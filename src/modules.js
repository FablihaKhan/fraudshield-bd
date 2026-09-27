/* ================= Security modules (Application Feature Integration Pipeline) ================= */
/* Shared evidence contract. Every module returns ModuleResult-shaped objects. */
let EVSEQ = 0;
function mkEv(o){ return Object.assign({id:"ev" + (++EVSEQ), state:"risk", source:"local-parser", observedAt:new Date().toISOString(), localOnly:true, confidenceBand:"medium"}, o); }
function modResult(status, evidence, notices, extra){ return Object.assign({status, evidence:evidence || [], notices:notices || [], checkedAt:new Date().toISOString()}, extra || {}); }
/* Feature registry: offline = works with no network; optin = online only after consent; helper = needs a planned helper; android = Android/desktop companion only; preview = shown, not active */
const FEATURE_STATES = {F1:"offline", F2:"offline", F3:"offline", F4:"offline", F5:"preview", F6:"offline", F7:"offline", F8:"offline", FILE:"offline", DNS:"optin", TLS:"helper", NET:"android"};

/* ---------- punycode (RFC 3492 decode) so look-alike hostnames can be shown and compared ---------- */
function punyDecode(input){
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700; let n = 128, i = 0, bias = 72, out = [];
  let b = input.lastIndexOf("-"); if (b < 0) b = 0;
  for (let j = 0; j < b; j++){ if (input.charCodeAt(j) >= 128) return null; out.push(input.charCodeAt(j)); }
  const adapt = (delta, num, first) => { delta = first ? Math.floor(delta / damp) : delta >> 1; delta += Math.floor(delta / num); let k = 0; while (delta > ((base - tMin) * tMax) >> 1){ delta = Math.floor(delta / (base - tMin)); k += base; } return k + Math.floor((base - tMin + 1) * delta / (delta + skew)); };
  for (let idx = b > 0 ? b + 1 : 0; idx < input.length;){
    const oldi = i; let w = 1;
    for (let k = base; ; k += base){
      if (idx >= input.length) return null;
      const c = input.charCodeAt(idx++), d = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base;
      if (d >= base) return null;
      i += d * w; const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (d < t) break; w *= base - t; if (w > 1e9) return null;
    }
    bias = adapt(i - oldi, out.length + 1, oldi === 0); n += Math.floor(i / (out.length + 1)); i %= out.length + 1;
    if (n > 0x10FFFF) return null; out.splice(i++, 0, n);
  }
  try { return String.fromCodePoint(...out); } catch(e){ return null; }
}
function hostUnicode(host){ return host.split(".").map(l => l.startsWith("xn--") ? (punyDecode(l.slice(4)) || l) : l).join("."); }
const CONF_X = {"ı":"i","ӏ":"l","ⅼ":"l","ԛ":"q","ѡ":"w","ս":"u","ɑ":"a","к":"k","ĸ":"k","в":"b","н":"h","т":"t","м":"m","ԝ":"w","ј":"j","һ":"h","ɡ":"g","ᴋ":"k","ⅰ":"i","ł":"l"};
function skeleton(s){ return [...String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")].map(c => CONF[c] || CONF_X[c] || c).join("").replace(/[01358]/g, d => ({"0":"o","1":"l","3":"e","5":"s","8":"b"})[d]).replace(/[-_.]/g, "").replace(/rn/g, "m").replace(/vv/g, "w"); }
/* Damerau-Levenshtein distance (small strings only) for one-letter typosquats such as telegrm / teleqram */
function editDist(a, b){
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({length:a.length + 1}, (_, i) => [i].concat(Array(b.length).fill(0)));
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++){
    const c = a[i - 1] === b[j - 1] ? 0 : 1;
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}

/* ---------- A1: canonical URL inspection + C1 link policy ---------- */
const DEMO_BLOCKLIST = {version:"demo-2026-09-24", note:"Illustrative list of fictional scam domains used in this demo. Not a real threat feed.", domains:["bkash-verify-bd.help","redx-parcel-bd.xyz","bkash-bonus.xyz","daraz-lucky-draw.top"]};
const RISKY_SCHEMES = ["javascript","data","file","vbscript","intent","content","blob"];
const PATH_BAIT = /(log-?in|sign-?in|verify|verification|update|otp|(?<![a-z])pin(?![a-z])|kyc|secure|account|confirm|unlock|bonus|claim|reward|gift)/i;
function isIPv4(h){ return /^\d{1,3}(\.\d{1,3}){3}$/.test(h); }
function isPrivateHost(h){
  h = h.replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (isIPv4(h)){ const [a,b] = h.split(".").map(Number); return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 100 && b >= 64 && b <= 127); }
  if (h.includes(":")) return h === "::1" || /^f[cd]/i.test(h) || /^fe80/i.test(h);
  return false;
}
function defang(href){ return href.replace(/^http/i, "hxxp").replace(/^(hxxps?:\/\/)?([^\/?#]+)/i, (m, s, host) => (s || "") + host.replace(/\./g, "[.]")); }
function extractUrls(text){ const out = []; L.url.lastIndex = 0; let m; while ((m = L.url.exec(String(text).toLowerCase()))) out.push(String(text).substr(m.index, m[0].length)); return out.slice(0, 10); }
function inspectUrl(input, opts){
  opts = opts || {}; const trusted = opts.trusted || [], dismissed = opts.dismissed || [];
  let raw = String(input == null ? "" : input).trim();
  if (!raw) return modResult("error", [], ["empty"]);
  if (raw.length > 2048) return modResult("error", [], ["too_long"]);
  if (/[\u0000-\u001f\u007f]/.test(raw)) return modResult("error", [], ["control"]);
  raw = raw.replace(/^[<("'“\[]+/, "").replace(/[.,;:!?)\]>"'”»।]+$/, "");
  const ev = []; const sm = raw.match(/^([a-z][a-z0-9+-]*):(?!\d)/i); const scheme0 = sm ? sm[1].toLowerCase() : "";
  if (scheme0 && RISKY_SCHEMES.includes(scheme0)){
    ev.push(mkEv({kind:"danger_scheme", targetType:"url", redactedTarget:scheme0 + ":", finding:scheme0}));
    return modResult("complete", ev, [], {raw, scheme:scheme0, host:"", hostUnicode:"", reg:"", category:"dangerous", verdict:"high", action:"dont_open", defanged:raw.replace(/:/, "[:]").slice(0, 80)});
  }
  if (scheme0 && !["http","https"].includes(scheme0) && !/^[a-z0-9-]+\.[a-z]/i.test(raw.slice(scheme0.length + 1))) return modResult("unsupported", [], ["scheme"], {raw, scheme:scheme0});
  let u; try { u = new URL(scheme0 === "http" || scheme0 === "https" ? raw : "http://" + raw); } catch(e){ return modResult("error", [], ["malformed"], {raw}); }
  const host = u.hostname.toLowerCase().replace(/\.$/, ""), uni = hostUnicode(host), scheme = scheme0 || "";
  const p = parseUrl(u.href);
  const ip = isIPv4(host) || host.startsWith("["), priv = isPrivateHost(host);
  const reg = ip ? host : p.reg, regUni = hostUnicode(reg);
  const flag = (kind, extra) => ev.push(mkEv(Object.assign({kind, targetType:"url", redactedTarget:reg, finding:kind}, extra || {})));
  if (u.username || u.password) flag("userinfo", {finding:decodeURIComponent(u.username).slice(0, 40)});
  if (priv) flag("private_ip"); else if (ip) flag("ip");
  if (u.port && !["80","443"].includes(u.port)) flag("port", {finding:u.port, confidenceBand:"low"});
  if (!scheme) flag("no_scheme", {state:"unknown", confidenceBand:"low"});
  else if (scheme === "http") flag("no_tls", {confidenceBand:"low"});
  if (/(^|\.)xn--/.test(host)) flag("idn", {finding:uni, confidenceBand:"low"});
  // brand look-alike: plain token (engine) or skeleton after folding confusables / digits
  let brand = p.brandIn, lookalikeOf = null;
  const skReg = skeleton(regUni.split(".").slice(0, -1).join(".") || regUni), skHost = skeleton(uni);
  for (const [k, o] of Object.entries(REGISTRY.orgs)){
    for (const d of o.domains){
      if (reg === d) continue;
      const skD = skeleton(d.split(".")[0]);
      if (!p.official && skD.length >= 4 && skReg === skD && reg !== d){ lookalikeOf = d; brand = brand || k; }
      else if (!lookalikeOf && !p.official && skD.length >= 6 && skReg.length >= 5 && skReg[0] === skD[0] && editDist(skReg, skD) === 1){ lookalikeOf = d; brand = brand || k; }
      if (host.startsWith(d + ".") || host.includes("." + d + ".")) { flag("deceptive_subdomain", {finding:d}); brand = brand || k; }
    }
    const tok = BRAND_TOKENS[k]; if (tok && !brand && skHost.includes(tok) && !o.domains.includes(reg)) brand = k;
  }
  if (lookalikeOf) flag("lookalike", {finding:lookalikeOf, confidenceBand:"high"});
  else if (brand && !p.official) flag("brand_in_host", {finding:REGISTRY.orgs[brand].en});
  if (p.shortener) flag("shortener", {confidenceBand:"low"});
  if (PATH_BAIT.test(u.pathname + u.search)) flag("path_bait", {finding:(u.pathname.match(PATH_BAIT) || u.search.match(PATH_BAIT) || [""])[0], confidenceBand:"low"});
  // attack code carried inside the link (reflected XSS, SQL / command injection, traversal, open redirect, %-obfuscation)
  const payloads = typeof urlPayloadCheck === "function" ? urlPayloadCheck(u.href) : [];
  payloads.forEach(pl => flag(pl.kind, {finding:pl.sample, cwe:pl.cwe, confidenceBand:pl.kind === "encoded_obfuscation" ? "low" : "high"}));
  const onBlock = DEMO_BLOCKLIST.domains.includes(reg);
  if (onBlock) flag("known_harmful", {source:"feed", confidenceBand:"high", provenance:"demo blocklist " + DEMO_BLOCKLIST.version});
  const official = !!p.official && !ip;
  if (official) flag("official", {state:"counterevidence", finding:REGISTRY.orgs[p.official].en, provenance:"registry " + REGISTRY.version});
  const isTrusted = trusted.includes(reg);
  if (isTrusted) flag("user_trusted", {state:"counterevidence", confidenceBand:"low"});
  const strong = ev.some(e => ["userinfo","private_ip","lookalike","deceptive_subdomain","brand_in_host","xss_payload","sqli_payload","traversal_payload","cmd_payload","open_redirect"].includes(e.kind));
  const category = onBlock ? "known_harmful" : strong ? "dangerous" : official ? "official" : isTrusted ? "trusted" : "unknown";
  const verdict = category === "known_harmful" || category === "dangerous" ? "high" : category === "official" || category === "trusted" ? "low" : "verify";
  const action = category === "known_harmful" ? "delete" : category === "dangerous" ? "dont_open" : category === "official" ? "use_app" : category === "trusted" ? "your_choice" : p.shortener ? "short" : "careful";
  const hostShown = uni !== host ? uni : host;
  return modResult("complete", ev, dismissed.includes(reg) ? ["dismissed"] : [], {raw, href:u.href, scheme:scheme || "none", host, hostUnicode:hostShown, reg, regUnicode:regUni, port:u.port || "", path:(u.pathname + u.search).slice(0, 200), userinfo:u.username ? decodeURIComponent(u.username).slice(0, 60) + (u.password ? ":•••" : "") : "", ip, privateIp:priv, official:p.official, brand, lookalikeOf, category, verdict, action, defanged:defang(u.href).slice(0, 300)});
}

/* ---------- B1: opt-in DNS metadata (DNS-over-HTTPS). Sends ONLY the hostname, and only after consent. ---------- */
const DNS_PROVIDER = {name:"Google Public DNS", host:"dns.google", url:"https://dns.google/resolve"};
const dnsCache = new Map();
function dnsAllowed(host){ return !!host && host.length <= 253 && /^[a-z0-9.-]+$/.test(host) && host.includes(".") && !isIPv4(host) && !isPrivateHost(host); }
async function dnsLookup(host, fetchImpl, regDomain){
  const f = fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!dnsAllowed(host)) return modResult("unsupported", [], ["not_public_host"], {host});
  const c = dnsCache.get(host); if (c && c.expires > Date.now()) return Object.assign({}, c.result, {cached:true});
  if (!f) return modResult("offline", [], ["no_fetch"], {host});
  const q = async (type, name) => {
    const ctl = typeof AbortController !== "undefined" ? new AbortController() : null, tm = setTimeout(() => ctl && ctl.abort(), 5000);
    try { const r = await f(`${DNS_PROVIDER.url}?name=${encodeURIComponent(name || host)}&type=${type}`, {signal: ctl ? ctl.signal : undefined, cache:"no-store", credentials:"omit", referrerPolicy:"no-referrer"}); if (!r.ok) throw new Error("http " + r.status); return await r.json(); }
    finally { clearTimeout(tm); }
  };
  try {
    const [a, aaaa, ns] = await Promise.all([q("A"), q("AAAA"), q("NS", dnsAllowed(regDomain || "") ? regDomain : host)]);
    const pick = (res, t) => ((res && res.Answer) || []).filter(x => x.type === t).slice(0, 6);
    const cname = [...pick(a, 5), ...pick(aaaa, 5)].map(x => x.data.replace(/\.$/, "")).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 8);
    const out = {host, provider:DNS_PROVIDER.name, nx:a && a.Status === 3, A:pick(a, 1).map(x => x.data), AAAA:pick(aaaa, 1).map(x => x.data), CNAME:cname, NS:pick(ns, 2).map(x => x.data.replace(/\.$/, "")), ttl:Math.min(...[...pick(a, 1), ...pick(aaaa, 1)].map(x => x.TTL).concat([300]))};
    const ev = [];
    if (out.nx) ev.push(mkEv({kind:"dns_nx", state:"unknown", source:"dns", targetType:"host", redactedTarget:host, finding:"NXDOMAIN", localOnly:false}));
    else if (out.A.length || out.AAAA.length) ev.push(mkEv({kind:"dns_resolves", state:"unknown", source:"dns", targetType:"host", redactedTarget:host, finding:(out.A.length + out.AAAA.length) + " addresses", localOnly:false}));
    else ev.push(mkEv({kind:"dns_noaddr", state:"unknown", source:"dns", targetType:"host", redactedTarget:host, finding:"no A/AAAA", localOnly:false}));
    if (out.CNAME.length) ev.push(mkEv({kind:"dns_cname", state:"unknown", source:"dns", targetType:"host", redactedTarget:host, finding:out.CNAME.join(" → "), localOnly:false}));
    const res = modResult("complete", ev, [], out);
    dnsCache.set(host, {expires:Date.now() + Math.max(60, Math.min(out.ttl, 3600)) * 1000, result:res});
    return res;
  } catch(e){ return modResult("offline", [], [String(e && e.name === "AbortError" ? "timeout" : "unavailable")], {host, provider:DNS_PROVIDER.name}); }
}

/* ---------- E1/E2: file intake, type sniffing, hashing, static APK metadata. Nothing is executed, opened or uploaded. ---------- */
const FILE_LIMIT = 50 * 1024 * 1024, APK_MANIFEST_LIMIT = 4 * 1024 * 1024, ZIP_ENTRY_LIMIT = 5000;
const EICAR_SHA256 = "275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f";
const OFFICIAL_APPS = {version:"demo-2026-09-24", note:"Illustrative. Verify package names and signing keys against Google Play before real use.",
  apps:{bkash:{en:"bKash", tokens:["bkash"], pkgs:["com.bKash.customerapp"]}, nagad:{en:"Nagad", tokens:["nagad"], pkgs:["com.konasl.nagad"]}, rocket:{en:"Rocket", tokens:["rocket","dbbl"], pkgs:["com.dbbl.mbs.apps.main"]}}};
const SENSITIVE_PERMS = {READ_SMS:"sms", RECEIVE_SMS:"sms", SEND_SMS:"sms", BIND_ACCESSIBILITY_SERVICE:"access", SYSTEM_ALERT_WINDOW:"overlay", BIND_NOTIFICATION_LISTENER_SERVICE:"notif", REQUEST_INSTALL_PACKAGES:"install", READ_CONTACTS:"contacts", CALL_PHONE:"calls", READ_CALL_LOG:"calls", READ_PHONE_STATE:"calls", BIND_DEVICE_ADMIN:"admin", QUERY_ALL_PACKAGES:"apps", RECORD_AUDIO:"mic", CAMERA:"camera", ACCESS_FINE_LOCATION:"location"};
const HIGH_PERM_GROUPS = ["sms","access","overlay","notif","install","admin"];
function sizeBand(n){ return n < 1024 * 1024 ? "under 1 MB" : n < 10 * 1024 * 1024 ? "1–10 MB" : "10–50 MB"; }
function extOf(name){ const m = String(name || "").toLowerCase().match(/\.([a-z0-9]{1,6})$/); return m ? m[1] : ""; }
const EXT_KIND = {apk:"apk", xapk:"apk", pdf:"pdf", exe:"exe", msi:"exe", scr:"exe", dll:"exe", zip:"zip", jar:"zip", docx:"ooxml", xlsx:"ooxml", pptx:"ooxml", doc:"ole", xls:"ole", ppt:"ole", png:"image", jpg:"image", jpeg:"image", gif:"image", webp:"image", html:"html", htm:"html", txt:"text", csv:"text", js:"script", vbs:"script", bat:"script", cmd:"script", ps1:"script", sh:"script"};
function u8at(b, i){ return b[i]; }
function startsWith(b, arr, off){ off = off || 0; for (let i = 0; i < arr.length; i++) if (b[off + i] !== arr[i]) return false; return true; }
function zipEntries(bytes){
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), n = bytes.length;
  let e = -1; for (let i = n - 22; i >= Math.max(0, n - 65557); i--){ if (dv.getUint32(i, true) === 0x06054b50){ e = i; break; } }
  if (e < 0) throw new Error("zip_no_eocd");
  const count = dv.getUint16(e + 10, true), cdOff = dv.getUint32(e + 16, true);
  if (cdOff === 0xFFFFFFFF || count === 0xFFFF) throw new Error("zip64_unsupported");
  if (count > ZIP_ENTRY_LIMIT) throw new Error("zip_too_many");
  const out = []; let p = cdOff;
  for (let k = 0; k < count; k++){
    if (p + 46 > n || dv.getUint32(p, true) !== 0x02014b50) throw new Error("zip_corrupt");
    const nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
    out.push({name:new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nl)), flags:dv.getUint16(p + 8, true), method:dv.getUint16(p + 10, true), comp:dv.getUint32(p + 20, true), size:dv.getUint32(p + 24, true), off:dv.getUint32(p + 42, true)});
    p += 46 + nl + xl + cl;
  }
  return out;
}
async function zipRead(bytes, ent, maxOut){
  if (ent.flags & 1) throw new Error("zip_encrypted");
  if (ent.size > maxOut) throw new Error("zip_entry_too_big");
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (dv.getUint32(ent.off, true) !== 0x04034b50) throw new Error("zip_corrupt");
  const start = ent.off + 30 + dv.getUint16(ent.off + 26, true) + dv.getUint16(ent.off + 28, true), data = bytes.subarray(start, start + ent.comp);
  if (ent.method === 0) return data.slice(0, maxOut);
  if (ent.method !== 8 || typeof DecompressionStream === "undefined") throw new Error("zip_method_unsupported");
  const rd = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw")).getReader();
  const parts = []; let total = 0;
  for (;;){ const {done, value} = await rd.read(); if (done) break; total += value.length; if (total > maxOut){ try { rd.cancel(); } catch(e){} throw new Error("zip_entry_too_big"); } parts.push(value); }
  const out = new Uint8Array(total); let o = 0; for (const x of parts){ out.set(x, o); o += x.length; } return out;
}
function parseAxml(b){
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), n = b.length;
  if (n < 8 || dv.getUint16(0, true) !== 0x0003) throw new Error("axml_bad");
  const strings = [], tags = []; let off = dv.getUint16(2, true);
  while (off + 8 <= n){
    const type = dv.getUint16(off, true), hs = dv.getUint16(off + 2, true), size = dv.getUint32(off + 4, true);
    if (size < 8 || off + size > n) break;
    if (type === 0x0001){
      const cnt = Math.min(dv.getUint32(off + 8, true), 20000), utf8 = dv.getUint32(off + 16, true) & 0x100, ss = dv.getUint32(off + 20, true);
      for (let i = 0; i < cnt; i++){
        let p = off + ss + dv.getUint32(off + hs + 4 * i, true), s = "";
        if (utf8){
          p += (b[p] & 0x80) ? 2 : 1; let len = b[p]; if (len & 0x80){ len = ((len & 0x7f) << 8) | b[p + 1]; p += 2; } else p += 1;
          s = new TextDecoder().decode(b.subarray(p, p + len));
        } else {
          let len = dv.getUint16(p, true); if (len & 0x8000){ len = ((len & 0x7fff) << 16) | dv.getUint16(p + 2, true); p += 4; } else p += 2;
          len = Math.min(len, 4096); const cs = []; for (let k = 0; k < len; k++) cs.push(dv.getUint16(p + 2 * k, true)); s = String.fromCharCode(...cs);
        }
        strings.push(s);
      }
    } else if (type === 0x0102){
      const x = off + 16, name = strings[dv.getUint32(x + 4, true)] || "", as = dv.getUint16(x + 8, true), asz = dv.getUint16(x + 10, true), ac = Math.min(dv.getUint16(x + 12, true), 200), attrs = {};
      for (let j = 0; j < ac; j++){
        const a = x + as + j * asz; if (a + 20 > n) break;
        const an = strings[dv.getUint32(a + 4, true)] || "", raw = dv.getUint32(a + 8, true), dt = b[a + 15], data = dv.getUint32(a + 16, true);
        attrs[an] = raw !== 0xFFFFFFFF ? strings[raw] : dt === 0x03 ? strings[data] : dt === 0x12 ? data !== 0 : dt === 0x01 ? "@res/" + data.toString(16) : data;
      }
      tags.push({tag:name, attrs});
      if (tags.length > 5000) break;
    }
    off += size;
  }
  return {strings, tags};
}
async function apkStatic(bytes, fileName){
  const ents = zipEntries(bytes);
  const man = ents.find(e => e.name === "AndroidManifest.xml");
  if (!man) return modResult("unsupported", [], ["no_manifest"]);
  const ax = parseAxml(await zipRead(bytes, man, APK_MANIFEST_LIMIT));
  const mt = ax.tags.find(t => t.tag === "manifest") || {attrs:{}}, app = ax.tags.find(t => t.tag === "application") || {attrs:{}};
  const perms = new Set(ax.tags.filter(t => /^uses-permission/.test(t.tag)).map(t => t.attrs.name).filter(Boolean));
  ax.tags.filter(t => ["service","activity","receiver","provider"].includes(t.tag) && typeof t.attrs.permission === "string").forEach(t => perms.add(t.attrs.permission));
  ax.strings.filter(s => /^android\.permission\.[A-Z_]+$/.test(s)).forEach(s => perms.add(s));
  const exported = ax.tags.filter(t => ["service","activity","receiver","provider"].includes(t.tag) && t.attrs.exported === true).length;
  const pkg = typeof mt.attrs.package === "string" ? mt.attrs.package.slice(0, 120) : "";
  const label = typeof app.attrs.label === "string" && !app.attrs.label.startsWith("@res/") ? app.attrs.label.slice(0, 80) : "";
  const sens = [...perms].map(p => p.replace(/^android\.permission\./, "")).filter(p => SENSITIVE_PERMS[p]);
  const claimText = skeleton(pkg + " " + label + " " + fileName);
  let claimed = null; for (const [k, a] of Object.entries(OFFICIAL_APPS.apps)) if (a.tokens.some(t => claimText.includes(t))) { claimed = k; break; }
  const officialPkg = Object.entries(OFFICIAL_APPS.apps).find(([k, a]) => a.pkgs.includes(pkg));
  const ev = [];
  if (claimed && (!officialPkg || officialPkg[0] !== claimed)) ev.push(mkEv({kind:"apk_impersonation", source:"file-static", targetType:"apk", redactedTarget:pkg, finding:OFFICIAL_APPS.apps[claimed].en, confidenceBand:"high", provenance:"official-app list " + OFFICIAL_APPS.version}));
  if (officialPkg) ev.push(mkEv({kind:"apk_official_pkg", state:"counterevidence", source:"file-static", targetType:"apk", redactedTarget:pkg, finding:OFFICIAL_APPS.apps[officialPkg[0]].en, confidenceBand:"low"}));
  sens.forEach(p => ev.push(mkEv({kind:"apk_perm", source:"file-static", targetType:"apk", redactedTarget:pkg, finding:p, confidenceBand:HIGH_PERM_GROUPS.includes(SENSITIVE_PERMS[p]) ? "medium" : "low"})));
  if (exported) ev.push(mkEv({kind:"apk_exported", state:"unknown", source:"file-static", targetType:"apk", redactedTarget:pkg, finding:String(exported), confidenceBand:"low"}));
  return modResult("complete", ev, [], {pkg, version:typeof mt.attrs.versionName === "string" ? mt.attrs.versionName.slice(0, 30) : "", label, perms:[...perms].map(p => p.replace(/^android\.permission\./, "")).slice(0, 60), sensitive:sens, highGroups:[...new Set(sens.map(p => SENSITIVE_PERMS[p]).filter(g => HIGH_PERM_GROUPS.includes(g)))], exported, claimed, officialPkg:officialPkg ? officialPkg[0] : null, entries:ents.length, signed:ents.some(e => /^META-INF\/.+\.(RSA|DSA|EC)$/i.test(e.name))});
}
function sniffKind(b, name){
  if (startsWith(b, [0x50,0x4B,0x03,0x04]) || startsWith(b, [0x50,0x4B,0x05,0x06])){
    try { const ents = zipEntries(b), names = ents.map(e => e.name);
      if (names.includes("AndroidManifest.xml")) return "apk";
      if (names.some(x => x.startsWith("word/") || x.startsWith("xl/") || x.startsWith("ppt/"))) return "ooxml";
      return "zip"; } catch(e){ return "zip"; }
  }
  if (startsWith(b, [0x25,0x50,0x44,0x46])) return "pdf";
  if (startsWith(b, [0x4D,0x5A])) return "exe";
  if (startsWith(b, [0x7F,0x45,0x4C,0x46])) return "elf";
  if (startsWith(b, [0xD0,0xCF,0x11,0xE0])) return "ole";
  if (startsWith(b, [0x89,0x50,0x4E,0x47]) || startsWith(b, [0xFF,0xD8,0xFF]) || startsWith(b, [0x47,0x49,0x46,0x38]) || (startsWith(b, [0x52,0x49,0x46,0x46]) && startsWith(b, [0x57,0x45,0x42,0x50], 8))) return "image";
  if (startsWith(b, [0x64,0x65,0x78,0x0A])) return "dex";
  const head = new TextDecoder("utf-8", {fatal:false}).decode(b.subarray(0, 512)).toLowerCase();
  if (/<!doctype html|<html|<script|<iframe/.test(head)) return "html";
  if (/^#!|^@echo off|powershell|wscript|createobject\(/.test(head)) return "script";
  if (!/[\x00-\x08\x0e-\x1a]/.test(head)) return "text";
  return "unknown";
}
const ACTIVE_KINDS = ["apk","exe","elf","dex","script","html","ole"];
async function inspectFile(bytes, name, opts){
  opts = opts || {}; name = String(name || "file").slice(0, 120);
  if (!bytes || !bytes.length) return modResult("error", [], ["empty"], {name});
  if (bytes.length > FILE_LIMIT) return modResult("error", [], ["too_big"], {name, size:bytes.length});
  const kind = sniffKind(bytes, name), ext = extOf(name), expect = EXT_KIND[ext] || null, ev = [];
  const famEq = (a, b) => a === b || (a === "zip" && b === "ooxml") || (a === "ooxml" && b === "zip");
  if (/\.(pdf|jpe?g|png|docx?|xlsx?|txt|mp4|mp3)\.(apk|exe|scr|js|vbs|bat|cmd|com|jar|html?)$/i.test(name)) ev.push(mkEv({kind:"double_ext", source:"file-static", targetType:"file", redactedTarget:name, finding:name.split(".").slice(-2).join("."), confidenceBand:"high"}));
  if (expect && !famEq(expect, kind) && !(kind === "text" && ["script","html","text"].includes(expect))) ev.push(mkEv({kind:"disguised", source:"file-static", targetType:"file", redactedTarget:name, finding:ext + "→" + kind, confidenceBand:ACTIVE_KINDS.includes(kind) ? "high" : "medium"}));
  let sha = "";
  try { const d = await crypto.subtle.digest("SHA-256", bytes); sha = Array.from(new Uint8Array(d)).map(x => x.toString(16).padStart(2, "0")).join(""); } catch(e){ sha = ""; }
  const known = Object.assign({}, typeof DEMO_HASHES !== "undefined" ? DEMO_HASHES : {}, opts.testSignatures ? {[EICAR_SHA256]:"EICAR anti-malware test file"} : {}, opts.knownHashes || {});
  const hit = sha && known[sha];
  if (hit) ev.push(mkEv({kind:"known_hash", source:"feed", targetType:"file", redactedTarget:sha.slice(0, 16), finding:hit, confidenceBand:"high", provenance:"local hash list " + REGISTRY.version}));
  else if (sha) ev.push(mkEv({kind:"unknown_hash", state:"unknown", source:"file-static", targetType:"file", redactedTarget:sha.slice(0, 16), finding:"not on list", confidenceBand:"low"}));
  let apk = null, notices = [];
  if (kind === "apk"){ try { apk = await apkStatic(bytes, name); ev.push(...apk.evidence); if (apk.status !== "complete") notices.push(...apk.notices); } catch(e){ notices.push(String(e.message || "apk_error")); apk = modResult("error", [], [String(e.message || "apk_error")]); } }
  const has = k => ev.some(e => e.kind === k);
  const highPerm = apk && apk.highGroups ? apk.highGroups.length : 0;
  const verdict = has("known_hash") || has("double_ext") || (has("disguised") && ACTIVE_KINDS.includes(kind)) || has("apk_impersonation") || highPerm >= 2 ? "high"
    : ACTIVE_KINDS.includes(kind) || kind === "unknown" || kind === "zip" || has("disguised") || highPerm === 1 ? "verify" : "low";
  const action = kind === "apk" ? "store_only" : ["exe","elf","dex","script"].includes(kind) ? "never_run" : ["html"].includes(kind) ? "dont_open" : kind === "ole" || kind === "ooxml" ? "no_macros" : verdict === "high" ? "delete" : "careful";
  return modResult("complete", ev, notices, {name, size:bytes.length, sizeBand:sizeBand(bytes.length), kind, ext, sha256:sha, known:hit || null, apk, verdict, action});
}

/* ---------- C2: IDS-inspired sequence detectors over turns that have arrived (no look-ahead) ---------- */
const SEQ_PATTERNS = [
  {id:"office", steps:[["authority_claim","identity_mismatch"],["urgency","threat","secrecy"],["request_credential","install_app"]]},
  {id:"linkcode", steps:[["open_link","brand_lookalike","url_userinfo","url_ip","shortener"],["request_credential","share_identity"]]},
  {id:"prize", steps:[["lure"],["request_money","open_link","request_credential"]]},
  {id:"relative", steps:[["relative_claim"],["request_money"]]},
  {id:"refund", steps:[["wrong_send"],["request_money"]]},
  {id:"remote", steps:[["authority_claim","context_claim"],["install_app"]]}
];
function turnSigs(p){ const s = new Set(p.found.map(f => f.sig)); if (p.channel && p.channel.status === "mismatched") s.add("identity_mismatch"); return s; }
function matchPatterns(perTurn, upto){
  const turns = perTurn.filter(p => p.who !== "me" && p.t <= upto), res = [];
  for (const pat of SEQ_PATTERNS){
    let from = 0; const hits = [];
    for (const step of pat.steps){
      const k = turns.findIndex((p, i) => i >= from && step.some(sg => turnSigs(p).has(sg)));
      if (k < 0){ hits.length = 0; break; }
      hits.push(turns[k].t); from = k;
    }
    if (hits.length === pat.steps.length) res.push({id:pat.id, turns:hits, at:hits[hits.length - 1]});
  }
  return res.sort((a, b) => a.at - b.at);
}
