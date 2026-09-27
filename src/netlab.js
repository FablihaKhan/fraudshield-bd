/* ================= Login guard + Security Lab (packet capture reader, server-log analyser). Pure logic, no DOM. ================= */

/* ---------- Login guard: "Is it safe to type my password here?" ---------- */
const LOGIN_SERVICES = ["telegram","whatsapp","facebook","google","instagram","bkash","nagad","daraz"];
function loginCheck(service, raw){
  const org = REGISTRY.orgs[service];
  if (!org) return {status:"error", code:"no_service"};
  const r = inspectUrl(raw);
  if (r.status !== "complete") return {status:"error", code:(r.notices && r.notices[0]) || "malformed", url:r};
  const base = {status:"complete", service, url:r, realDomains:org.domains.slice(), reasons:[]};
  const add = k => base.reasons.push(k);
  if (r.category === "known_harmful") add("known_harmful");
  if (r.userinfo) add("userinfo");
  if (r.lookalikeOf) add("lookalike");
  if (r.evidence.some(e => e.kind === "deceptive_subdomain")) add("deceptive_subdomain");
  if (r.ip) add("ip_address");
  if (r.official === service && !base.reasons.length){
    if (r.scheme === "http"){ add("no_tls"); return Object.assign(base, {verdict:"verify", code:"official_http"}); }
    if (r.scheme === "none"){ add("check_lock"); return Object.assign(base, {verdict:"low", code:"official_noscheme"}); }
    add("official"); return Object.assign(base, {verdict:"low", code:"official_https"});
  }
  if (r.official && r.official !== service && !base.reasons.length){ add("other_service"); return Object.assign(base, {verdict:"verify", code:"other_service", otherService:r.official}); }
  if (!base.reasons.length) add(r.brand ? "brand_in_host" : "not_official");
  if (r.scheme === "http") add("no_tls");
  return Object.assign(base, {verdict:"high", code:"not_official"});
}

/* ---------- Small helpers ---------- */
const ipStr = (b, o) => b[o] + "." + b[o + 1] + "." + b[o + 2] + "." + b[o + 3];
const macStr = (b, o) => Array.from(b.subarray(o, o + 6)).map(x => x.toString(16).padStart(2, "0")).join(":");
const be16 = (b, o) => (b[o] << 8) | b[o + 1];
const be32 = (b, o) => ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
function isPrivateIp(s){
  const p = s.split(".").map(Number); if (p.length !== 4) return false;
  return p[0] === 10 || p[0] === 127 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 169 && p[1] === 254);
}
const LOCAL_NAME = /(\.local|\.lan|\.home|\.internal|\.arpa|\.localdomain)$/i;
const ascii = (b, o, n) => { let s = ""; for (let i = o; i < Math.min(b.length, o + n); i++) s += String.fromCharCode(b[i]); return s; };

/* ---------- Packet capture reader: pcap (µs / ns, both byte orders) and pcapng ---------- */
const PCAP_LIMIT = 20 * 1024 * 1024, PCAP_MAX_PKTS = 20000;
function readCapture(bytes){
  const b = bytes, dv = new DataView(b.buffer, b.byteOffset, b.byteLength), frames = [];
  if (b.length < 24) return {status:"error", code:"too_small", frames};
  const magic = dv.getUint32(0, true);
  if (magic === 0x0A0D0D0A) return readPcapng(b, dv);
  let le, nano;
  if (magic === 0xa1b2c3d4){ le = true; nano = false; } else if (magic === 0xd4c3b2a1){ le = false; nano = false; }
  else if (magic === 0xa1b23c4d){ le = true; nano = true; } else if (magic === 0x4d3cb2a1){ le = false; nano = true; }
  else return {status:"error", code:"not_capture", frames};
  const link = dv.getUint32(20, le) & 0xffff; let o = 24;
  while (o + 16 <= b.length && frames.length < PCAP_MAX_PKTS){
    const sec = dv.getUint32(o, le), frac = dv.getUint32(o + 4, le), cap = dv.getUint32(o + 8, le), orig = dv.getUint32(o + 12, le);
    if (cap > 262144 || o + 16 + cap > b.length) break;
    frames.push({t:sec + frac / (nano ? 1e9 : 1e6), link, len:orig, data:b.subarray(o + 16, o + 16 + cap)}); o += 16 + cap;
  }
  return {status:"complete", format:"pcap", frames, truncated:o < b.length};
}
function readPcapng(b, dv){
  const frames = [], ifs = []; let o = 0, le = true;
  while (o + 12 <= b.length && frames.length < PCAP_MAX_PKTS){
    let type = dv.getUint32(o, le);
    if (type === 0x0A0D0D0A){ le = dv.getUint32(o + 8, true) === 0x1A2B3C4D; }
    const len = dv.getUint32(o + 4, le);
    if (len < 12 || o + len > b.length) break;
    if (type === 1) ifs.push({link:dv.getUint16(o + 8, le), res:1e6});
    else if (type === 6){
      const id = dv.getUint32(o + 8, le), hi = dv.getUint32(o + 12, le), lo = dv.getUint32(o + 16, le), cap = dv.getUint32(o + 20, le), orig = dv.getUint32(o + 24, le);
      const itf = ifs[id] || {link:1, res:1e6};
      if (o + 28 + cap <= b.length) frames.push({t:(hi * 4294967296 + lo) / itf.res, link:itf.link, len:orig, data:b.subarray(o + 28, o + 28 + cap)});
    } else if (type === 3){
      const orig = dv.getUint32(o + 8, le), itf = ifs[0] || {link:1}, cap = Math.min(orig, len - 16);
      frames.push({t:0, link:itf.link, len:orig, data:b.subarray(o + 12, o + 12 + cap)});
    }
    o += len;
  }
  return {status:"complete", format:"pcapng", frames, truncated:o < b.length};
}

/* ---------- Protocol decoders ---------- */
function dnsName(b, off, base, depth){
  const parts = []; let o = off, jumped = false, end = off, guard = 0;
  while (o < b.length && guard++ < 64){
    const l = b[o];
    if (l === 0){ if (!jumped) end = o + 1; break; }
    if ((l & 0xc0) === 0xc0){ if (!jumped) end = o + 2; if ((depth || 0) > 8) break; o = base + (((l & 0x3f) << 8) | b[o + 1]); jumped = true; continue; }
    parts.push(ascii(b, o + 1, l)); o += l + 1;
  }
  return {name:parts.join(".").toLowerCase(), end};
}
function decodeDns(b, base){
  if (b.length - base < 12) return null;
  const id = be16(b, base), flags = be16(b, base + 2), qd = be16(b, base + 4), an = be16(b, base + 6);
  const d = {id, response:!!(flags & 0x8000), rcode:flags & 15, questions:[], answers:[]}; let o = base + 12;
  for (let i = 0; i < Math.min(qd, 8); i++){ const n = dnsName(b, o, base); o = n.end; if (o + 4 > b.length) return d; d.questions.push({name:n.name, type:be16(b, o)}); o += 4; }
  for (let i = 0; i < Math.min(an, 16); i++){
    const n = dnsName(b, o, base); o = n.end; if (o + 10 > b.length) break;
    const type = be16(b, o), rdl = be16(b, o + 8); o += 10;
    if (type === 1 && rdl === 4) d.answers.push({name:n.name, type:"A", data:ipStr(b, o)});
    else if (type === 5) d.answers.push({name:n.name, type:"CNAME", data:dnsName(b, o, base).name});
    else if (type === 28) d.answers.push({name:n.name, type:"AAAA", data:"(IPv6)"});
    o += rdl;
  }
  return d;
}
function decodeHttp(b, o){
  const head = ascii(b, o, 2048), m = head.match(/^(GET|POST|PUT|HEAD|DELETE|OPTIONS|PATCH) (\S+) HTTP\/1\.[01]\r?\n/);
  const r = head.match(/^HTTP\/1\.[01] (\d{3})/);
  if (!m && !r) return null;
  const sep = head.indexOf("\r\n\r\n"), hdrTxt = sep >= 0 ? head.slice(0, sep) : head, headers = {};
  hdrTxt.split(/\r?\n/).slice(1).forEach(l => { const i = l.indexOf(":"); if (i > 0) headers[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim(); });
  return m ? {kind:"request", method:m[1], path:m[2].slice(0, 300), host:(headers.host || "").toLowerCase().replace(/:\d+$/, ""), headers, body:sep >= 0 ? head.slice(sep + 4, sep + 4 + 600) : ""} : {kind:"response", status:+r[1], headers};
}
function decodeTlsHello(b, o){
  if (b[o] !== 0x16 || b[o + 5] !== 0x01 || b.length < o + 50) return null;
  let p = o + 9 + 2 + 32; if (p >= b.length) return null;
  p += 1 + b[p]; if (p + 2 > b.length) return null;
  p += 2 + be16(b, p); if (p + 1 > b.length) return null;
  p += 1 + b[p]; if (p + 2 > b.length) return {sni:""};
  const extEnd = Math.min(b.length, p + 2 + be16(b, p)); p += 2;
  while (p + 4 <= extEnd){
    const et = be16(b, p), el = be16(b, p + 2);
    if (et === 0 && p + 9 <= extEnd){ const nl = be16(b, p + 7); return {sni:ascii(b, p + 9, nl).toLowerCase()}; }
    p += 4 + el;
  }
  return {sni:""};
}
const TCP_FLAG_NAMES = [[0x02,"SYN"],[0x10,"ACK"],[0x01,"FIN"],[0x04,"RST"],[0x08,"PSH"],[0x20,"URG"]];
function decodeFrame(f, no){
  const b = f.data, p = {no, t:f.t, len:f.len, data:b, proto:"?", src:"", dst:"", info:"", layers:[]};
  let o = 0, et;
  if (f.link === 1){ if (b.length < 14) return p; p.ethSrc = macStr(b, 6); p.ethDst = macStr(b, 0); et = be16(b, 12); o = 14; p.layers.push("Ethernet");
    if (et === 0x8100 && b.length >= 18){ et = be16(b, 16); o = 18; p.layers.push("802.1Q"); } }
  else if (f.link === 113){ if (b.length < 16) return p; et = be16(b, 14); o = 16; p.layers.push("Linux SLL"); }
  else if (f.link === 101 || f.link === 228 || f.link === 12){ et = (b[0] >> 4) === 6 ? 0x86dd : 0x0800; }
  else { p.info = "link type " + f.link; return p; }
  if (et === 0x0806 && b.length >= o + 28){
    const op = be16(b, o + 6); p.proto = "ARP"; p.layers.push("ARP");
    p.arp = {op, sha:macStr(b, o + 8), spa:ipStr(b, o + 14), tha:macStr(b, o + 18), tpa:ipStr(b, o + 24)};
    p.src = p.arp.sha; p.dst = op === 1 ? "broadcast" : p.arp.tha;
    p.info = op === 1 ? `Who has ${p.arp.tpa}? Tell ${p.arp.spa}` : `${p.arp.spa} is at ${p.arp.sha}`; return p;
  }
  if (et === 0x86dd){ p.proto = "IPv6"; p.layers.push("IPv6"); p.info = "IPv6 packet"; return p; }
  if (et !== 0x0800 || b.length < o + 20) { p.info = "ethertype 0x" + (et || 0).toString(16); return p; }
  const ihl = (b[o] & 15) * 4, proto = b[o + 9], tot = be16(b, o + 2);
  p.src = ipStr(b, o + 12); p.dst = ipStr(b, o + 16); p.ttl = b[o + 8]; p.layers.push("IPv4"); p.proto = "IPv4";
  const l4 = o + ihl, end = Math.min(b.length, o + (tot || b.length));
  if (proto === 6 && end >= l4 + 20){
    p.sport = be16(b, l4); p.dport = be16(b, l4 + 2); const off = (b[l4 + 12] >> 4) * 4, fl = b[l4 + 13];
    p.flags = fl; p.proto = "TCP"; p.layers.push("TCP");
    const fn = TCP_FLAG_NAMES.filter(([m]) => fl & m).map(x => x[1]).join(",");
    p.info = `${p.sport} → ${p.dport} [${fn}]`;
    const po = l4 + off, plen = end - po;
    if (plen > 0){
      p.payloadOff = po; p.payloadLen = plen;
      const h = decodeHttp(b.subarray(0, end), po);
      if (h){ p.http = h; p.proto = "HTTP"; p.layers.push("HTTP"); p.info = h.kind === "request" ? `${h.method} ${h.path}${h.host ? "  (Host: " + h.host + ")" : ""}` : `HTTP ${h.status}`; }
      else { const tl = decodeTlsHello(b.subarray(0, end), po); if (tl){ p.tls = tl; p.proto = "TLS"; p.layers.push("TLS"); p.info = "Client Hello" + (tl.sni ? "  SNI=" + tl.sni : ""); }
        else if (p.dport === 21 || p.sport === 21){ const s = ascii(b, po, Math.min(plen, 120)).trim(); p.proto = "FTP"; p.layers.push("FTP"); p.ftp = s; p.info = s.startsWith("PASS ") ? "PASS ••••" : s.slice(0, 60); } }
    }
  } else if (proto === 17 && end >= l4 + 8){
    p.sport = be16(b, l4); p.dport = be16(b, l4 + 2); p.proto = "UDP"; p.layers.push("UDP"); p.info = `${p.sport} → ${p.dport}`;
    if ([53, 5353].includes(p.sport) || [53, 5353].includes(p.dport)){
      const d = decodeDns(b.subarray(0, end), l4 + 8);
      if (d){ p.dns = d; p.proto = "DNS"; p.layers.push("DNS"); const q = d.questions[0] ? d.questions[0].name : "";
        p.info = d.response ? `Answer ${q} → ${d.answers.filter(a => a.type === "A").map(a => a.data).join(", ") || (d.rcode === 3 ? "no such name" : "–")}` : `Query A ${q}`; }
    }
  } else if (proto === 1){ p.proto = "ICMP"; p.layers.push("ICMP"); p.info = "ICMP type " + b[l4]; }
  return p;
}

/* ---------- Capture analyser: man-in-the-middle signs, cleartext secrets, floods, scans ---------- */
const CRED_RE = /(?:^|[&?\s])(pass(?:word|wd)?|pwd|pin|otp|secret)=([^&\s]*)/i;
function analyzeCapture(bytes, opts){
  opts = opts || {};
  const cap = readCapture(bytes); if (cap.status !== "complete") return {status:"error", code:cap.code};
  const pkts = cap.frames.map((f, i) => decodeFrame(f, i + 1));
  const findings = [], F = (id, sev, nos, data, mitre, at) => findings.push({id, sev, pkts:nos.slice(0, 50), data:data || {}, mitre:mitre || "", at:at || Math.min(...nos)});
  const t0 = pkts.length ? pkts[0].t : 0, protos = {}, talkers = {}, names = new Map();
  pkts.forEach(p => { protos[p.proto] = (protos[p.proto] || 0) + 1; if (p.src) talkers[p.src] = (talkers[p.src] || 0) + p.len; });
  // 1. ARP spoofing: one IP claimed by more than one hardware address
  const arpMap = new Map();
  pkts.filter(p => p.arp && p.arp.op === 2).forEach(p => { const e = arpMap.get(p.arp.spa) || {macs:new Map(), nos:[], at:0}; if (e.macs.size && !e.macs.has(p.arp.sha) && !e.at) e.at = p.no; e.macs.set(p.arp.sha, (e.macs.get(p.arp.sha) || 0) + 1); e.nos.push(p.no); arpMap.set(p.arp.spa, e); });
  arpMap.forEach((e, ipA) => { if (e.macs.size > 1){ const macs = [...e.macs.keys()]; F("arp_spoof", "high", e.nos, {ip:ipA, macs, first:macs[0], newer:macs[macs.length - 1]}, "T1557.002", e.at); } });
  // 2. DNS: public names answered with private addresses; answers that change
  const answers = new Map();
  pkts.filter(p => p.dns && p.dns.response).forEach(p => p.dns.answers.filter(a => a.type === "A").forEach(a => {
    const q = (p.dns.questions[0] || {}).name || a.name; if (!q) return;
    const e = answers.get(q) || {ips:new Set(), nos:[]}; e.ips.add(a.data); e.nos.push(p.no); answers.set(q, e);
    if (isPrivateIp(a.data) && !LOCAL_NAME.test(q) && q.includes(".")) F("dns_private", "high", [p.no], {name:q, ip:a.data}, "T1557");
  }));
  answers.forEach((e, q) => { if (e.ips.size > 1 && [...e.ips].some(isPrivateIp)) F("dns_changed", "medium", e.nos, {name:q, ips:[...e.ips]}, "T1557", e.nos[e.nos.length - 1]); });
  // 3. names seen on the wire (DNS query, TLS SNI, HTTP Host) checked with the link inspector
  const seen = (name, where, no) => { if (!name || !name.includes(".")) return; const e = names.get(name) || {where:new Set(), nos:[]}; e.where.add(where); e.nos.push(no); names.set(name, e); };
  pkts.forEach(p => { if (p.dns && !p.dns.response && p.dns.questions[0]) seen(p.dns.questions[0].name, "DNS", p.no); if (p.tls && p.tls.sni) seen(p.tls.sni, "TLS", p.no); if (p.http && p.http.host) seen(p.http.host, "HTTP", p.no); });
  const nameList = [];
  names.forEach((e, n) => { const r = inspectUrl("https://" + n); nameList.push({name:n, where:[...e.where], verdict:r.verdict || "verify", category:r.category || "unknown", lookalikeOf:r.lookalikeOf || "", official:r.official || ""});
    if (r.category === "dangerous" || r.category === "known_harmful") F("bad_domain", "high", e.nos, {name:n, lookalikeOf:r.lookalikeOf || "", brand:r.brand && REGISTRY.orgs[r.brand] ? REGISTRY.orgs[r.brand].en : "", where:[...e.where]}, "T1566.002"); });
  // 4. secrets in cleartext
  pkts.forEach(p => {
    if (p.http && p.http.kind === "request"){
      const hay = p.http.path + " " + p.http.body, m = hay.match(CRED_RE), auth = p.http.headers.authorization || "";
      if (m) F("cleartext_password", "high", [p.no], {host:p.http.host, field:m[1], path:p.http.path.split("?")[0]}, "T1040");
      else if (/^basic /i.test(auth)) F("cleartext_password", "high", [p.no], {host:p.http.host, field:"Authorization: Basic", path:p.http.path.split("?")[0]}, "T1040");
      else if (p.http.method === "POST" && PATH_BAIT.test(p.http.path)) F("http_login", "medium", [p.no], {host:p.http.host, path:p.http.path.split("?")[0]}, "T1040");
    }
    if (p.ftp && p.ftp.startsWith("PASS ")) F("cleartext_password", "high", [p.no], {host:p.dst, field:"FTP PASS", path:""}, "T1040");
  });
  // 5. SYN flood (per destination per second) and port scan (distinct ports per source → destination)
  const syn = new Map(), scan = new Map();
  pkts.filter(p => p.proto !== "?" && p.flags !== undefined && (p.flags & 0x02) && !(p.flags & 0x10)).forEach(p => {
    const k = p.dst + "|" + Math.floor(p.t); const e = syn.get(k) || {n:0, srcs:new Set(), nos:[]}; e.n++; e.srcs.add(p.src); if (e.nos.length < 20) e.nos.push(p.no); syn.set(k, e);
    const s = p.src + "|" + p.dst; const g = scan.get(s) || {ports:new Set(), nos:[]}; g.ports.add(p.dport); if (g.nos.length < 20) g.nos.push(p.no); scan.set(s, g);
  });
  let worst = null; syn.forEach((e, k) => { if (e.n >= 100 && (!worst || e.n > worst.n)) worst = Object.assign({k}, e); });
  if (worst) F("syn_flood", "high", worst.nos, {target:worst.k.split("|")[0], perSecond:worst.n, sources:worst.srcs.size}, "T1498.001");
  scan.forEach((g, k) => { if (g.ports.size >= 15) F("port_scan", "medium", g.nos, {src:k.split("|")[0], dst:k.split("|")[1], ports:g.ports.size}, "T1046"); });
  const sevRank = {high:0, medium:1, low:2}; findings.sort((a, b) => sevRank[a.sev] - sevRank[b.sev]);
  const verdict = findings.some(f => f.sev === "high") ? "high" : findings.length ? "verify" : "low";
  const topTalkers = Object.entries(talkers).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {status:"complete", format:cap.format, truncated:cap.truncated, count:pkts.length, duration:pkts.length ? pkts[pkts.length - 1].t - t0 : 0, t0, protos, topTalkers, names:nameList, findings, verdict, packets:pkts};
}

/* ---------- Server-log analyser (Apache / Nginx combined or common format) ---------- */
const LOG_LIMIT = 20 * 1024 * 1024, LOG_MAX_LINES = 200000;
const LOG_RE = /^(\S+) \S+ (\S+) \[([^\]]+)\] "(\S+) (\S+)(?: [^"]*)?" (\d{3}) (\S+)(?: "([^"]*)" "([^"]*)")?/;
const MON = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function logTime(s){
  const m = s.match(/^(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2})$/); if (!m || MON[m[2]] === undefined) return NaN;
  const off = (m[7] === "-" ? -1 : 1) * (+m[8] * 60 + +m[9]);
  const t = Date.UTC(+m[3], MON[m[2]], +m[1], +m[4], +m[5], +m[6]) - off * 60000; logTime.lastOff = off; return t;
}
function parseLogLine(line){
  const m = LOG_RE.exec(line); if (!m) return null;
  const t = logTime(m[3]); if (isNaN(t)) return null;
  return {ip:m[1], user:m[2], t, time:m[3], method:m[4], path:m[5].slice(0, 500), status:+m[6], bytes:m[7] === "-" ? 0 : +m[7] || 0, ref:m[8] || "", ua:(m[9] || "").slice(0, 200)};
}
const LOGIN_PATH = /(log-?in|sign-?in|auth|wp-login\.php|session|account\/login)/i;
const PROBE_PATH = /(\/\.env|\/\.git|\/wp-admin|\/wp-login\.php|\/phpmyadmin|\/pma\b|\/config\.php|\/server-status|\/actuator|\/\.aws|\/backup|\/admin\.php|\/xmlrpc\.php|\/cgi-bin|\/shell|\/vendor\/phpunit)/i;
const STATE_PATH = /(transfer|send-?money|payment|pay\b|withdraw|change-?(password|email)|settings|delete|profile\/update|account\/(update|email))/i;
const INJECT = [
  ["sqli", /(union(\s|%20|\+)+select|'\s*or\s*'?1'?\s*=\s*'?1|%27(\s|%20|\+)*or|\bor(\s|%20|\+)+1=1|sleep\(\d|information_schema|--(\s|%20)*$)/i],
  ["xss", /(<script|%3cscript|onerror=|javascript:|%3csvg)/i],
  ["traversal", /(\.\.\/|\.\.%2f|%2e%2e%2f|%2e%2e\/|\/etc\/passwd)/i],
  ["cmdi", /(;|%3b|\||%7c|`)(\s|%20|\+)*(cat|wget|curl|id|whoami|uname|sh|bash)\b/i]
];
const SCANNER_UA = /(sqlmap|nikto|nmap|masscan|zgrab|gobuster|dirbuster|wpscan|nuclei|acunetix|hydra|feroxbuster|ffuf)/i;
function median(a){ if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function analyzeLogs(text){
  const lines = String(text).split(/\r?\n/).filter(l => l.trim()).slice(0, LOG_MAX_LINES), recs = []; let bad = 0;
  for (const l of lines){ const r = parseLogLine(l); if (r) recs.push(r); else bad++; }
  if (!recs.length) return {status:"error", code:"no_lines", lines:lines.length, bad};
  recs.sort((a, b) => a.t - b.t);
  const t0 = Math.floor(recs[0].t / 60000) * 60000, tEnd = recs[recs.length - 1].t, nMin = Math.min(1440, Math.floor((tEnd - t0) / 60000) + 1);
  const minutes = Array.from({length:nMin}, (_, i) => ({t:t0 + i * 60000, n:0, ips:new Map(), s4:0, s5:0}));
  recs.forEach(r => { const i = Math.floor((r.t - t0) / 60000); if (i >= nMin) return; const m = minutes[i]; m.n++; m.ips.set(r.ip, (m.ips.get(r.ip) || 0) + 1); if (r.status >= 500) m.s5++; else if (r.status >= 400) m.s4++; });
  const globalMed = median(minutes.map(m => m.n));
  minutes.forEach((m, i) => {
    const prev = minutes.slice(Math.max(0, i - 10), i).filter(x => x.level !== "alert").map(x => x.n);
    m.base = prev.length >= 3 ? median(prev) : globalMed; m.ratio = m.n / Math.max(1, m.base);
    m.level = m.ratio >= 5 && m.n >= 30 ? "alert" : m.ratio >= 2 && m.n >= 10 ? "warn" : "ok";
    const top = [...m.ips.entries()].sort((a, b) => b[1] - a[1])[0]; m.uniq = m.ips.size; m.topIp = top ? top[0] : ""; m.topShare = top ? top[1] / m.n : 0;
  });
  const findings = [], F = (id, sev, data, mitre) => findings.push({id, sev, data, mitre});
  const firstAlert = minutes.findIndex(m => m.level === "alert");
  const firstWarn = minutes.findIndex(m => m.level !== "ok");
  const peakI = minutes.reduce((bi, m, i) => m.n > minutes[bi].n ? i : bi, 0), peak = minutes[peakI];
  if (firstAlert >= 0){
    const distributed = peak.topShare < 0.2 && peak.uniq >= 50;
    const lead = firstWarn >= 0 && firstWarn < firstAlert ? firstAlert - firstWarn : 0;
    const errShare = peak.n ? (peak.s5 / peak.n) : 0;
    F(distributed ? "ddos" : "dos_single", "high", {warnAt:firstWarn >= 0 ? minutes[firstWarn].t : null, alertAt:minutes[firstAlert].t, leadMin:lead, peakAt:peak.t, peak:peak.n, base:Math.round(peak.base), ratio:Math.round(peak.ratio), uniq:peak.uniq, topIp:peak.topIp, topShare:Math.round(peak.topShare * 100), errShare:Math.round(errShare * 100)}, distributed ? "T1498" : "T1499");
  } else if (firstWarn >= 0){
    F("traffic_rise", "medium", {warnAt:minutes[firstWarn].t, peak:peak.n, base:Math.round(peak.base), ratio:Math.round(peak.ratio * 10) / 10}, "T1498");
  }
  // brute force + success after failures
  const byIp = new Map();
  recs.forEach(r => { const e = byIp.get(r.ip) || {n:0, fails:[], okAfter:null, probes:new Set(), n404:new Set(), inj:{}, ua:new Set(), paths:[]}; e.n++; byIp.set(r.ip, e);
    if (LOGIN_PATH.test(r.path) && r.method === "POST"){ if ([401, 403].includes(r.status)) e.fails.push(r.t); else if (r.status < 400 && e.fails.length >= 10 && !e.okAfter) e.okAfter = r.t; }
    if (PROBE_PATH.test(r.path)) e.probes.add(r.path.split("?")[0]);
    if (r.status === 404) e.n404.add(r.path.split("?")[0]);
    let dec = r.path; try { dec = decodeURIComponent(r.path); } catch(err){}
    INJECT.forEach(([k, re]) => { if (re.test(r.path) || re.test(dec)){ e.inj[k] = (e.inj[k] || 0) + 1; if (e.paths.length < 3) e.paths.push(r.path.slice(0, 120)); } });
    const sc = r.ua.match(SCANNER_UA); if (sc) e.ua.add(sc[1].toLowerCase());
  });
  byIp.forEach((e, ip) => {
    if (e.fails.length >= 10){
      let best = 0; for (let i = 0, j = 0; i < e.fails.length; i++){ while (e.fails[i] - e.fails[j] > 300000) j++; best = Math.max(best, i - j + 1); }
      if (best >= 10) F(e.okAfter ? "bruteforce_success" : "bruteforce", "high", {ip, fails:e.fails.length, in5min:best, okAt:e.okAfter}, "T1110.001");
    }
    if (e.probes.size >= 3 || e.n404.size >= 20) F("scan", "medium", {ip, probes:[...e.probes].slice(0, 6), probeCount:e.probes.size, n404:e.n404.size}, "T1595.003");
    const injKinds = Object.keys(e.inj); if (injKinds.length) F("injection", "high", {ip, kinds:injKinds, cwe:injKinds.map(k => ({sqli:"CWE-89", xss:"CWE-79", traversal:"CWE-22", cmdi:"CWE-78"})[k]), count:injKinds.reduce((s, k) => s + e.inj[k], 0), examples:e.paths}, "T1190");
    if (e.ua.size) F("scanner_tool", "medium", {ip, tools:[...e.ua]}, "T1595.002");
  });
  // CSRF (lecture 10): a money/settings action whose Referer is another website.
  // "Our" site = the most common Referer host; a request that changes state and comes from elsewhere is suspicious.
  const refHost = r => { const m = /^https?:\/\/([^\/:?#]+)/i.exec(r.ref || ""); return m ? m[1].toLowerCase() : ""; };
  const hostCount = new Map(); recs.forEach(r => { const h = refHost(r); if (h) hostCount.set(h, (hostCount.get(h) || 0) + 1); });
  const own = [...hostCount.entries()].sort((a, b) => b[1] - a[1])[0];
  if (own){
    const ownReg = own[0].split(".").slice(-2).join("."), cross = new Map();
    recs.forEach(r => {
      const h = refHost(r); if (!h || h.split(".").slice(-2).join(".") === ownReg) return;
      if (!(STATE_PATH.test(r.path) && (r.method !== "GET" || /[?&](amount|to|email|password)=/i.test(r.path)))) return;
      const e = cross.get(h) || {n:0, ips:new Set(), paths:new Set(), ok:0}; e.n++; e.ips.add(r.ip); e.paths.add(r.path.split("?")[0]); if (r.status < 400) e.ok++; cross.set(h, e);
    });
    cross.forEach((e, h) => F("csrf", e.ok ? "high" : "medium", {from:h, site:own[0], count:e.n, victims:e.ips.size, done:e.ok, paths:[...e.paths].slice(0, 4)}, "CWE-352"));
  }
  const sevRank = {high:0, medium:1, low:2}; findings.sort((a, b) => sevRank[a.sev] - sevRank[b.sev]);
  const status = {}; recs.forEach(r => { const k = Math.floor(r.status / 100) + "xx"; status[k] = (status[k] || 0) + 1; });
  const topIps = [...byIp.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 8).map(([ip, e]) => [ip, e.n]);
  const verdict = findings.some(f => f.sev === "high") ? "high" : findings.length ? "verify" : "low";
  return {status:"complete", tz:logTime.lastOff || 0, lines:lines.length, parsed:recs.length, bad, t0, tEnd, globalMed, minutes:minutes.map(m => ({t:m.t, n:m.n, base:m.base, ratio:m.ratio, level:m.level, uniq:m.uniq, topIp:m.topIp, topShare:m.topShare, s4:m.s4, s5:m.s5})), firstWarn, firstAlert, peakI, findings, topIps, statusCounts:status, uniqIps:byIp.size, verdict};
}

/* ---------- Deterministic sample server logs (documentation IP ranges only: RFC 5737) ---------- */
function mulberry32(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function genLogs(kind){
  const rnd = mulberry32({normal:11, ddos:22, attack:33}[kind] || 7), pick = a => a[Math.floor(rnd() * a.length)];
  const nets = ["203.0.113.", "198.51.100.", "192.0.2."], users = Array.from({length:60}, (_, i) => nets[i % 3] + (10 + i));
  const pages = ["/", "/", "/products", "/products/42", "/cart", "/offers", "/help", "/static/app.js", "/static/logo.png", "/api/price?id=7", "/login"];
  const uas = ["Mozilla/5.0 (Linux; Android 14) Chrome/128.0 Mobile", "Mozilla/5.0 (Windows NT 10.0) Chrome/128.0", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5) Safari/604.1"];
  const start = Date.UTC(2026, 8, 26, 4, 0, 0), out = [];
  const fmt = t => { const d = new Date(t + 6 * 3600000), p = n => String(n).padStart(2, "0"); return `${p(d.getUTCDate())}/${Object.keys(MON)[d.getUTCMonth()]}/${d.getUTCFullYear()}:${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} +0600`; };
  const line = (t, ip, m, path, st, ua, ref) => out.push({t, s:`${ip} - - [${fmt(t)}] "${m} ${path} HTTP/1.1" ${st} ${st === 404 ? 162 : 800 + Math.floor(rnd() * 9000)} "${ref || "-"}" "${ua || pick(uas)}"`});
  const mins = kind === "ddos" ? 45 : 40;
  for (let mi = 0; mi < mins; mi++){
    let n = 18 + Math.floor(rnd() * 10);
    for (let k = 0; k < n; k++){ const p = pick(pages); line(start + mi * 60000 + Math.floor(rnd() * 60000), pick(users), p === "/login" && rnd() < .5 ? "POST" : "GET", p, rnd() < .03 ? 404 : 200, undefined, k % 3 ? "https://shop.example.com/" : "-"); }
  }
  if (kind === "ddos"){
    const bots = Array.from({length:600}, (_, i) => nets[i % 3] + (1 + (i * 7) % 254)), ramp = {28:2.4, 29:3.2, 30:6, 31:11, 32:14, 33:15, 34:15, 35:13, 36:9, 37:4};
    Object.entries(ramp).forEach(([mi, x]) => { const n = Math.round(22 * x); for (let k = 0; k < n; k++){ const t = start + mi * 60000 + Math.floor(rnd() * 60000), st = x > 10 && rnd() < .35 ? 503 : 200; line(t, pick(bots), "GET", pick(["/", "/search?q=" + Math.floor(rnd() * 99999), "/products"]), st, pick(uas)); } });
  }
  if (kind === "attack"){
    const bf = "203.0.113.77", sc = "198.51.100.23", base = start + 12 * 60000;
    for (let k = 0; k < 46; k++) line(base + k * 6500, bf, "POST", "/login", 401, "python-requests/2.32");
    line(base + 46 * 6500, bf, "POST", "/login", 302, "python-requests/2.32");
    line(base + 47 * 6500, bf, "GET", "/account/transfer", 200, "python-requests/2.32");
    const probes = ["/.env", "/.git/config", "/wp-admin/", "/phpmyadmin/", "/config.php", "/server-status", "/actuator/health", "/backup.zip"];
    probes.forEach((p, k) => line(start + 25 * 60000 + k * 1500, sc, "GET", p, 404, "Mozilla/5.0 (compatible; Nikto/2.5.0)"));
    for (let k = 0; k < 18; k++) line(start + 26 * 60000 + k * 900, sc, "GET", "/old-page-" + k, 404, "Mozilla/5.0 (compatible; Nikto/2.5.0)");
    ["/products?id=42%27%20OR%20%271%27=%271", "/products?id=42%20UNION%20SELECT%20username,password%20FROM%20users--", "/search?q=%3Cscript%3Ealert(1)%3C/script%3E", "/download?file=../../../../etc/passwd", "/ping?host=127.0.0.1;cat%20/etc/passwd"]
      .forEach((p, k) => line(start + 27 * 60000 + k * 2000, sc, "GET", p, k === 0 ? 500 : 400, "sqlmap/1.8.4#stable (https://sqlmap.org)"));
    [users[4], users[17], users[31], users[45]].forEach((ip, k) => line(start + 33 * 60000 + k * 41000, ip, "POST", "/account/transfer", 200, uas[k % 3], "http://free-prize-bd.top/win.html"));
  }
  return out.sort((a, b) => a.t - b.t).map(x => x.s).join("\n") + "\n";
}
