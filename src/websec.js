/* ================= Web attack protection (pure logic, no DOM): links carrying attack code, passwords,
   pages & emails, website headers & cookies, source code. Each finding names the attack, a CWE id and the fix. ================= */

/* ---------- 1. Attack code hidden inside a link (reflected XSS, SQLi, traversal, command injection, open redirect, %-obfuscation) ---------- */
const PAYLOAD_RULES = [
  ["xss_payload", /(<\s*script|<\s*img[^>]*onerror|<\s*svg[^>]*onload|<\s*iframe|javascript\s*:|on(error|load|mouseover|focus)\s*=|document\.cookie|alert\s*\()/i, "CWE-79"],
  ["sqli_payload", /('|%27|")\s*(or|and)\s*('|")?\s*\d+\s*('|")?\s*=\s*('|")?\s*\d+|\bunion\b[\s+]+(all[\s+]+)?select\b|;\s*drop\s+table|\bor\s+1\s*=\s*1\b|sleep\s*\(\s*\d+\s*\)|'\s*--/i, "CWE-89"],
  ["traversal_payload", /(\.\.\/|\.\.\\|\/etc\/passwd|\\windows\\win\.ini)/i, "CWE-22"],
  ["cmd_payload", /(;|\||`|\$\()\s*(cat|ls|id|whoami|wget|curl|nc|bash|sh|rm|mail)\b/i, "CWE-78"]
];
function multiDecode(s){
  let out = String(s), prev = null, rounds = 0;
  while (out !== prev && rounds < 3){ prev = out; try { out = decodeURIComponent(out.replace(/\+/g, " ")); } catch(e){ break; } rounds++; }
  return {text:out, rounds:rounds - (out === prev ? 1 : 0)};
}
function urlPayloadCheck(href){
  let u; try { u = new URL(href); } catch(e){ return []; }
  const raw = u.pathname + u.search + u.hash, dec = multiDecode(raw), found = [];
  for (const [kind, re, cwe] of PAYLOAD_RULES) if (re.test(dec.text) || re.test(raw)) found.push({kind, cwe, sample:(dec.text.match(re) || [""])[0].slice(0, 40)});
  const pct = (raw.match(/%[0-9a-f]{2}/gi) || []).length;
  if (dec.rounds >= 2 || (pct >= 8 && pct * 3 > raw.length * 0.4)) found.push({kind:"encoded_obfuscation", cwe:"CWE-116", sample:raw.slice(0, 40)});
  for (const [k, v] of u.searchParams){
    if (/^(url|next|redirect|redirect_uri|return|returnto|goto|dest|destination|continue|target|r|u)$/i.test(k) && /^(https?:)?\/\//i.test(v)){
      try { const t = new URL(v, u.href); if (regDomainOf(t.hostname) !== regDomainOf(u.hostname)) found.push({kind:"open_redirect", cwe:"CWE-601", sample:t.hostname}); } catch(e){}
    }
  }
  return found;
}
function regDomainOf(host){ try { return parseUrl("https://" + host + "/").reg || host; } catch(e){ return host; } }

/* ---------- 2. Password strength (offline vs online attacks, salts, slow hashes) ---------- */
const COMMON_PW = ("123456 123456789 12345678 password qwerty 12345 1234567890 111111 1234567 123123 abc123 password1 1234 iloveyou 000000 qwerty123 " +
  "admin welcome monkey dragon letmein football baseball sunshine princess master 654321 superman 1qaz2wsx 7777777 121212 123321 666666 " +
  "password123 passw0rd p@ssw0rd p@ssword qwertyuiop asdfghjkl zxcvbnm 987654321 112233 159753 147258369 aa123456 abcd1234 " +
  "bangladesh bangladesh123 dhaka dhaka123 bkash bkash123 nagad123 allah786 786786 bismillah pakistan india1234 love123 iloveu " +
  "shadow trustno1 hello123 freedom whatever michael jessica charlie 123qwe qazwsx zaq12wsx google facebook telegram tr0ub4dor&3 troubador correcthorsebatterystaple").split(" ");
const WORDS_HINT = ("love hello welcome secret password pass admin login user money happy lucky dragon tiger cricket football family " +
  "sunshine flower summer winter apple banana orange mango dhaka bangla bangladesh bkash nagad rocket allah bismillah").split(" ");
const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890", "!@#$%^&*()"];
function leetFold(s){ return s.toLowerCase().replace(/[@4]/g, "a").replace(/[3]/g, "e").replace(/[1!|]/g, "i").replace(/[0]/g, "o").replace(/[$5]/g, "s").replace(/[7]/g, "t"); }
function passwordCheck(pw, ctx){
  pw = String(pw || ""); ctx = ctx || {};
  const n = [...pw].length, low = pw.toLowerCase(), fold = leetFold(pw), patterns = [];
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26; if (/[A-Z]/.test(pw)) pool += 26; if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33; if (/[^\x00-\x7f]/.test(pw)) pool += 100;
  let bits = n * Math.log2(Math.max(pool, 1));
  const ci = COMMON_PW.indexOf(low) >= 0 ? COMMON_PW.indexOf(low) : COMMON_PW.indexOf(fold);
  if (ci >= 0){ patterns.push({kind:"common", detail:pw.slice(0, 3) + "…"}); bits = Math.min(bits, Math.log2(ci + 2) + 1); }
  const strip = fold.replace(/[^a-z]/g, "");
  const word = WORDS_HINT.find(w => w.length >= 4 && strip.includes(w));
  if (word && ci < 0){ patterns.push({kind:"word", detail:word}); bits -= word.length * 3.2; }
  for (const row of KEY_ROWS) for (let L = Math.min(8, row.length); L >= 4; L--){
    let hit = false; for (let i = 0; i + L <= row.length; i++){ const seg = row.slice(i, i + L); if (low.includes(seg) || low.includes([...seg].reverse().join(""))){ hit = seg; break; } }
    if (hit){ patterns.push({kind:"keyboard", detail:hit}); bits -= L * 2.5; break; }
  }
  if (/(.)\1{2,}/.test(pw)){ patterns.push({kind:"repeat", detail:(pw.match(/(.)\1{2,}/) || [""])[0]}); bits -= 6; }
  if (/(19[5-9]\d|20[0-3]\d)/.test(pw)){ patterns.push({kind:"year", detail:pw.match(/(19[5-9]\d|20[0-3]\d)/)[0]}); bits -= 7; }
  if (/(?:\+?88)?01[3-9]\d{8}/.test(pw)){ patterns.push({kind:"phone", detail:"01•••"}); bits -= 20; }
  // "Name@1998" style: one word + a symbol + a few digits. Attack tools try exactly this shape first,
  // so its real cost is about: one dictionary word (~17 bits) + capital (1) + symbol (5) + the digits.
  const shape = pw.match(/^([A-Za-z]{2,})([^A-Za-z0-9]{0,2})(\d{1,6})([^A-Za-z0-9]{0,2})$/);
  if (shape && ci < 0){
    patterns.push({kind:"word_digits", detail:""});
    const d = shape[3], digitBits = /^(19[5-9]\d|20[0-3]\d)$/.test(d) ? 7 : d.length * Math.log2(10);
    bits = Math.min(bits, 17 + (/[A-Z]/.test(shape[1]) ? 1 : 0) + (shape[2].length + shape[4].length) * 5 + digitBits);
  }
  // a passphrase made from our own word list is only as strong as the number of words picked
  const parts = low.split(/[-_ .]+/).filter(Boolean);
  if (parts.length >= 3 && typeof PASSPHRASE_WORDS !== "undefined" && parts.every(w => PASSPHRASE_WORDS.includes(w))) bits = Math.min(bits, parts.length * Math.log2(PASSPHRASE_WORDS.length) + 2);
  const ctxHits = (ctx.words || []).filter(w => w && w.length >= 3 && low.includes(String(w).toLowerCase()));
  if (ctxHits.length){ patterns.push({kind:"personal", detail:ctxHits[0]}); bits -= 12; }
  if (/^\d+$/.test(pw) && n <= 8){ patterns.push({kind:"digits_only", detail:""}); }
  bits = Math.max(0, Math.round(bits * 10) / 10);
  const guesses = Math.pow(2, bits);
  // attacker speeds (guesses per second) for the four situations taught in class
  const SPEEDS = {online_limited:0.01, online:10, offline_slow:1e4, offline_fast:1e10};
  const crack = {}; for (const [k, s] of Object.entries(SPEEDS)) crack[k] = guesses / 2 / s;
  const level = n === 0 ? "none" : bits < 28 ? "weak" : bits < 50 ? "medium" : "strong";
  return {status:n ? "complete" : "empty", length:n, pool, bits, level, patterns, crack, speeds:SPEEDS, verdict:{none:"abstain", weak:"high", medium:"verify", strong:"low"}[level]};
}
function humanTime(sec){
  if (!isFinite(sec) || sec > 3.15e13) return ["centuries", "শত শত বছর"];
  const U = [[3.15e9, "centuries", "শত শত বছর"], [3.15e7, "years", "বছর"], [2.6e6, "months", "মাস"], [86400, "days", "দিন"], [3600, "hours", "ঘণ্টা"], [60, "minutes", "মিনিট"], [1, "seconds", "সেকেন্ড"]];
  if (sec < 1) return ["instantly", "সাথে সাথে"];
  for (const [d, en, bn] of U) if (sec >= d){ const v = Math.round(sec / d); return d === 3.15e9 ? [en, bn] : [v + " " + en, v + " " + bn]; }
  return ["instantly", "সাথে সাথে"];
}
const PASSPHRASE_WORDS = ("apple river cloud tiger mango lamp paper stone green blue happy quiet bridge window garden rocket pencil sugar water music " +
  "orange silver planet forest candle yellow jungle pillow basket camera doctor engine family friend guitar island jacket kettle ladder market " +
  "needle ocean pepper rabbit saddle ticket umbrella valley wallet yogurt zebra anchor bamboo butter cactus dinner eagle feather ginger honey " +
  "igloo jelly kitten lemon magnet nectar olive parrot quilt radio salmon tomato unicorn violin walnut yarn acorn banana cherry dolphin " +
  "elbow falcon goose hammer iron jasmine koala lizard maple noodle oyster panda quartz robin spider tulip urchin velvet whale almond breeze " +
  "castle desert ember fiddle glove harbor ivory jigsaw kayak lotus meadow nickel orbit pebble quiver ribbon saffron thunder upload voyage wander " +
  "yonder zipper arrow blossom copper dragon echo frost galaxy harvest insect jungle kernel lantern mirror nutmeg onion pirate rainbow shadow timber " +
  "turtle vapor willow bishop cobalt drizzle fossil glacier hazel indigo juniper kitchen lagoon mosaic nimbus oasis puzzle riddle sprout tundra " +
  "atlas beacon canyon domino emerald flute gravel helmet jungle2 kiwi lobster marble napkin octopus pumpkin raven sketch trumpet vortex wizard " +
  "badge cabin daisy easel fabric gecko hiking iceberg jewel kernel2 lychee mitten nomad opera poppy quest rocket2 satin teapot unity vessel " +
  "waffle xylophone yeti zigzag amber button cotton dune feast gadget hollow input jolly karma lilac mustard nebula ozone prism quiet2 rustic " +
  "spiral toast utopia vivid whisker yodel zenith bakery comet dusk ferry grove hinge ink jumper knot linen meteor nest orchid plume ramp scarf").split(" ").map(w => w.replace(/\d$/, "")).filter((w, i, a) => a.indexOf(w) === i);
function makePassphrase(nWords, rand){
  nWords = nWords || 7; const words = [];
  const pick = () => { if (rand) return rand(PASSPHRASE_WORDS.length); const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % PASSPHRASE_WORDS.length; };
  for (let i = 0; i < nWords; i++) words.push(PASSPHRASE_WORDS[pick()]);
  return {text:words.join("-"), bits:Math.round(nWords * Math.log2(PASSPHRASE_WORDS.length) * 10) / 10};
}
/* opt-in breach check: only the first 5 hex characters of SHA-1(password) leave the device (k-anonymity) */
async function sha1Hex(s){ const b = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase(); }
async function pwnedCheck(pw, fetchImpl){
  const h = await sha1Hex(pw), prefix = h.slice(0, 5), suffix = h.slice(5), f = fetchImpl || fetch;
  try {
    const r = await f("https://api.pwnedpasswords.com/range/" + prefix, {headers:{"Add-Padding":"true"}});
    if (!r.ok) return {status:"error", prefix};
    const txt = await r.text(); let count = 0;
    for (const line of txt.split(/\r?\n/)){ const [s, c] = line.split(":"); if (s && s.trim().toUpperCase() === suffix){ count = parseInt(c, 10) || 0; break; } }
    return {status:"complete", prefix, count};
  } catch(e){ return {status:"offline", prefix}; }
}

/* ---------- 3. Page & email X-ray: a tiny tag reader (never runs the page) ---------- */
function htmlTags(html){
  const tags = [], re = /<\s*([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g; let m, guard = 0;
  while ((m = re.exec(html)) && guard++ < 20000){
    const attrs = {}, ar = /([^\s=>\/]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g; let a;
    while ((a = ar.exec(m[2]))) attrs[a[1].toLowerCase()] = a[3] !== undefined ? a[3] : a[4] !== undefined ? a[4] : a[5] !== undefined ? a[5] : "";
    tags.push({tag:m[1].toLowerCase(), attrs, index:m.index});
  }
  return tags;
}
const decodeEntities = s => String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function styleOf(t){ return (t.attrs.style || "").toLowerCase().replace(/\s+/g, ""); }
function pageScan(html, opts){
  opts = opts || {}; html = String(html || "").slice(0, 2 * 1024 * 1024);
  const tags = htmlTags(html), F = [], add = (kind, sev, data, cwe) => F.push({kind, sev, data:data || {}, cwe:cwe || ""});
  const pageHost = opts.pageHost || "";
  const text = decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  // tracking pixels (who opened the email, when, from where)
  const pixels = tags.filter(t => t.tag === "img" && /^https?:/i.test(t.attrs.src || "") && !/(transfer|send-?money|amount=|delete|password|set-?dns|withdraw|payout|to=)/i.test(t.attrs.src) && ((+t.attrs.width <= 1 && t.attrs.width !== undefined && +t.attrs.height <= 1) || /display:none|visibility:hidden|width:1px;height:1px|width:0/.test(styleOf(t))));
  if (pixels.length) add("tracking_pixel", "low", {count:pixels.length, hosts:[...new Set(pixels.map(p => { try { return new URL(p.attrs.src).hostname; } catch(e){ return "?"; } }))].slice(0, 4)}, "CWE-359");
  // images that secretly call an action URL (CSRF with <img>)
  tags.filter(t => t.tag === "img" && /^https?:/i.test(t.attrs.src || "") && /(transfer|send-?money|amount=|delete|password|set-?dns|withdraw|payout|to=)/i.test(t.attrs.src)).forEach(t => add("csrf_img", "high", {url:t.attrs.src.slice(0, 120)}, "CWE-352"));
  // invisible or tiny frames (clickjacking, hidden requests)
  tags.filter(t => t.tag === "iframe").forEach(t => {
    const st = styleOf(t), op = st.match(/opacity:([0-9.]+)/);
    const tiny = (+t.attrs.width <= 2 && t.attrs.width !== undefined) || (+t.attrs.height <= 2 && t.attrs.height !== undefined);
    if ((op && +op[1] <= 0.2) || /visibility:hidden|display:none/.test(st)) add("hidden_iframe", "high", {src:(t.attrs.src || "").slice(0, 100), opacity:op ? +op[1] : 0}, "CWE-1021");
    else if (tiny) add("tiny_iframe", "medium", {src:(t.attrs.src || "").slice(0, 100)}, "CWE-1021");
  });
  // fake cursor (cursorjacking)
  if (/cursor\s*:\s*none/i.test(html)) add("cursor_hidden", "medium", {}, "CWE-1021");
  // forms: password to another site / over http; auto-submitting forms (CSRF, like the CalNet example)
  const forms = []; const formRe = /<form\b([\s\S]*?)>([\s\S]*?)<\/form>/gi; let fm;
  while ((fm = formRe.exec(html))){ const t = htmlTags("<form" + fm[1] + ">")[0] || {attrs:{}}; forms.push({attrs:t.attrs, body:fm[2]}); }
  forms.forEach(f => {
    const action = f.attrs.action || "", hasPw = /type\s*=\s*["']?password/i.test(f.body), hidden = /type\s*=\s*["']?hidden/i.test(f.body);
    let host = ""; try { host = new URL(action, pageHost ? "https://" + pageHost + "/" : "https://local.invalid/").hostname; } catch(e){}
    if (hasPw && /^http:/i.test(action)) add("form_http", "high", {action:action.slice(0, 100)}, "CWE-319");
    if (hasPw && host && host !== "local.invalid" && (!pageHost || regDomainOf(host) !== regDomainOf(pageHost))){
      const r = inspectUrl("https://" + host);
      add("form_foreign", r.verdict === "high" ? "high" : "medium", {host, lookalikeOf:r.lookalikeOf || "", brand:r.brand && REGISTRY.orgs[r.brand] ? REGISTRY.orgs[r.brand].en : ""}, "CWE-346");
    }
    if (/method\s*=\s*["']?post/i.test(" " + Object.entries(f.attrs).map(([k, v]) => k + "=" + v).join(" ")) && !/csrf|xsrf|authenticity_token|_token|nonce/i.test(f.body) && opts.developer) add("form_no_csrf_token", "medium", {action:action.slice(0, 80)}, "CWE-352");
    f.id = f.attrs.id || f.attrs.name || "";
  });
  if (forms.length && /\.submit\s*\(\s*\)/.test(html) && /(DOMContentLoaded|onload|window\.onload|setTimeout|addEventListener\(\s*['"]load)/i.test(html)) add("auto_submit_form", "high", {}, "CWE-352");
  // links that say one address but go to another (classic phishing email)
  tags.filter(t => t.tag === "a" && t.attrs.href).forEach(t => {
    const end = html.indexOf("</a>", t.index), inner = end > 0 ? decodeEntities(html.slice(t.index, end).replace(/<[^>]+>/g, "")).trim() : "";
    let realHost = ""; try { realHost = new URL(decodeEntities(t.attrs.href)).hostname; } catch(e){ if (/^\s*javascript:/i.test(t.attrs.href)) add("js_link", "high", {href:t.attrs.href.slice(0, 60)}, "CWE-79"); return; }
    const shown = inner.match(/(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})/i);
    if (shown && regDomainOf(shown[1].toLowerCase()) !== regDomainOf(realHost)) add("link_mismatch", "high", {shown:shown[1].toLowerCase(), real:realHost}, "CWE-451");
    else { const r = inspectUrl(t.attrs.href); if (r.status === "complete" && (r.category === "dangerous" || r.category === "known_harmful")) add("bad_link", "high", {real:realHost, lookalikeOf:r.lookalikeOf || ""}, "CWE-451"); }
    const pl = urlPayloadCheck(decodeEntities(t.attrs.href)); if (pl.length) add("payload_link", "high", {kinds:pl.map(p => p.kind), real:realHost}, pl[0].cwe);
  });
  // script / event handler injection markers (useful when checking a comment, profile or post before saving)
  const inline = tags.filter(t => t.tag === "script" && !t.attrs.src).length, handlers = tags.filter(t => Object.keys(t.attrs).some(k => /^on[a-z]+$/.test(k))).length;
  if (handlers) add("event_handlers", opts.userContent ? "high" : "low", {count:handlers}, "CWE-79");
  if (opts.userContent && inline) add("script_in_content", "high", {count:inline}, "CWE-79");
  // meta refresh redirect to another site
  tags.filter(t => t.tag === "meta" && /refresh/i.test(t.attrs["http-equiv"] || "")).forEach(t => { const m = (t.attrs.content || "").match(/url\s*=\s*(\S+)/i); if (m) add("meta_redirect", "medium", {to:m[1].slice(0, 80)}, "CWE-601"); });
  // fake browser window drawn inside the page (browser-in-browser)
  const textNoLinks = decodeEntities(html.replace(/<a\b[\s\S]*?<\/a>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "));
  const fakeBar = textNoLinks.match(/(?:🔒|&#128274;)?\s*https:\/\/(?:accounts\.google\.com|www\.facebook\.com|web\.telegram\.org|www\.bkash\.com|login\.microsoftonline\.com|appleid\.apple\.com)[^\s]*/i);
  if (fakeBar && /type\s*=\s*["']?password/i.test(html) && /position\s*:\s*(fixed|absolute)/i.test(html)) add("browser_in_browser", "high", {shows:fakeBar[0].trim().slice(0, 60)}, "CWE-451");
  // pressure words typical of phishing emails
  const urg = text.match(/(account (will be|has been) (closed|suspended|locked)|verify (your )?account|confirm (your|my) account|within 24 hours|unusual (sign-?in|activity)|অ্যাকাউন্ট বন্ধ|যাচাই করুন)/i);
  if (urg) add("urgency", "medium", {phrase:urg[0].slice(0, 50)}, "");
  const brandHit = Object.entries(REGISTRY.orgs).find(([k, o]) => o.officialOnly && o.domains.length && new RegExp("\\b" + o.en.replace(/[^a-z]/gi, "") + "\\b", "i").test(text));
  const rank = {high:0, medium:1, low:2}; F.sort((a, b) => rank[a.sev] - rank[b.sev]);
  const verdict = F.some(f => f.sev === "high") ? "high" : F.some(f => f.sev === "medium") ? "verify" : "low";
  return {status:"complete", verdict, findings:F, stats:{tags:tags.length, forms:forms.length, links:tags.filter(t => t.tag === "a").length, images:tags.filter(t => t.tag === "img").length, iframes:tags.filter(t => t.tag === "iframe").length, scripts:tags.filter(t => t.tag === "script").length}, brand:brandHit ? brandHit[1].en : "", textPreview:text.slice(0, 300)};
}

/* ---------- 4. Website headers & cookies audit (paste the response headers) ---------- */
function headerCheck(raw){
  const lines = String(raw || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return {status:"error", code:"empty"};
  const H = {}, cookies = []; let statusLine = "";
  for (const l of lines){
    if (/^HTTP\/\d/i.test(l)){ statusLine = l; continue; }
    const i = l.indexOf(":"); if (i <= 0) continue;
    const k = l.slice(0, i).trim().toLowerCase(), v = l.slice(i + 1).trim();
    if (k === "set-cookie") cookies.push(v); else H[k] = H[k] ? H[k] + ", " + v : v;
  }
  if (!Object.keys(H).length && !cookies.length) return {status:"error", code:"no_headers"};
  const C = [], chk = (id, ok, sev, detail, cwe, fix) => C.push({id, ok, sev, detail:detail || "", cwe:cwe || "", fix:fix || ""});
  const hsts = H["strict-transport-security"] || "", maxAge = +((hsts.match(/max-age=(\d+)/i) || [])[1] || 0);
  chk("hsts", maxAge >= 31536000, maxAge ? "medium" : "high", hsts || "missing", "CWE-319", "Strict-Transport-Security: max-age=31536000; includeSubDomains");
  const csp = H["content-security-policy"] || "";
  const cspWeak = csp && (/'unsafe-inline'/.test(csp) && !/'nonce-|'strict-dynamic'/.test(csp) || /'unsafe-eval'/.test(csp) || /(script-src|default-src)[^;]*\s\*(\s|;|$)/.test(csp));
  chk("csp", !!csp && !cspWeak && /(default-src|script-src)/.test(csp), csp ? "medium" : "high", csp ? (cspWeak ? "weak: " : "") + csp.slice(0, 90) : "missing", "CWE-79", "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'");
  const xfo = (H["x-frame-options"] || "").toUpperCase(), fa = (csp.match(/frame-ancestors\s+([^;]+)/i) || [])[1] || "";
  chk("clickjacking", /DENY|SAMEORIGIN/.test(xfo) || /'none'|'self'/.test(fa), "high", fa ? "frame-ancestors " + fa : xfo || "missing", "CWE-1021", "Content-Security-Policy: frame-ancestors 'none'   (or X-Frame-Options: DENY)");
  chk("nosniff", /nosniff/i.test(H["x-content-type-options"] || ""), "low", H["x-content-type-options"] || "missing", "CWE-16", "X-Content-Type-Options: nosniff");
  const rp = (H["referrer-policy"] || "").toLowerCase();
  chk("referrer", /no-referrer|strict-origin|same-origin/.test(rp), "low", rp || "missing", "CWE-200", "Referrer-Policy: strict-origin-when-cross-origin");
  const acao = H["access-control-allow-origin"] || "", acac = /true/i.test(H["access-control-allow-credentials"] || "");
  if (acao) chk("cors", !(acao === "*" && acac) && acao !== "null", acao === "*" && acac ? "high" : "medium", "Allow-Origin: " + acao + (acac ? " + credentials" : ""), "CWE-942", "Allow only your own origins; never * together with credentials");
  const leak = [H["server"], H["x-powered-by"], H["x-aspnet-version"]].filter(v => v && /\d/.test(v));
  chk("version_leak", !leak.length, "low", leak.join(", ") || "none", "CWE-200", "Hide exact server and framework versions");
  if (/^http:\/\//i.test(H["location"] || "")) chk("downgrade", false, "high", "Location: " + H["location"].slice(0, 80), "CWE-319", "Redirect only to https:// addresses");
  const ck = cookies.map(c => {
    const parts = c.split(";").map(s => s.trim()), [nv, ...attrs] = parts, name = nv.split("=")[0], A = attrs.map(a => a.toLowerCase());
    const ss = (A.find(a => a.startsWith("samesite=")) || "").split("=")[1] || "";
    const session = /sess|sid|token|auth|login|jwt|remember/i.test(name);
    const issues = [];
    if (!A.includes("secure")) issues.push("no_secure");
    if (session && !A.includes("httponly")) issues.push("no_httponly");
    if (!ss) issues.push("no_samesite"); else if (ss === "none" && !A.includes("secure")) issues.push("samesite_none_insecure"); else if (ss === "none" && session) issues.push("samesite_none");
    const dom = (A.find(a => a.startsWith("domain=")) || "").split("=")[1] || "";
    if (dom && !dom.replace(/^\./, "").includes(".")) issues.push("tld_domain");
    const exp = A.find(a => a.startsWith("max-age=")); if (session && exp && +exp.split("=")[1] > 60 * 60 * 24 * 30) issues.push("long_lived");
    if (/^__host-/i.test(name) && (A.some(a => a.startsWith("domain=")) || !A.includes("secure"))) issues.push("bad_host_prefix");
    return {name, session, sameSite:ss || "(not set)", secure:A.includes("secure"), httpOnly:A.includes("httponly"), issues};
  });
  ck.forEach(c => chk("cookie", !c.issues.length, c.issues.some(i => ["no_secure", "no_httponly", "samesite_none_insecure", "tld_domain"].includes(i)) && c.session ? "high" : c.issues.length ? "medium" : "low", c.name + ": " + (c.issues.join(", ") || "ok"), "CWE-614", "Set-Cookie: __Host-" + c.name.replace(/^__host-/i, "") + "=…; Path=/; Secure; HttpOnly; SameSite=Lax"));
  const W = {high:3, medium:2, low:1}, total = C.reduce((s, c) => s + W[c.sev], 0), got = C.reduce((s, c) => s + (c.ok ? W[c.sev] : 0), 0);
  const pct = total ? Math.round(got / total * 100) : 0, grade = pct >= 90 ? "A" : pct >= 75 ? "B" : pct >= 60 ? "C" : pct >= 40 ? "D" : "F";
  const fails = C.filter(c => !c.ok);
  return {status:"complete", statusLine, headers:H, cookies:ck, checks:C, score:pct, grade, verdict:fails.some(f => f.sev === "high") ? "high" : fails.length ? "verify" : "low"};
}

/* ---------- 5. Code check for developers (injection, weak password storage, cookies, randomness, secrets) ---------- */
const CODE_RULES = [
  {id:"sql_concat", cwe:"CWE-89", sev:"high", re:/\b(select|insert\s+into|update|delete\s+from)\b[^\n]*?("\s*\+|'\s*\+|\+\s*["']|%s|\$\{|\{\w+\}|\.format\(|Sprintf\()/i, fix:'db.QueryRow("SELECT name, price FROM items WHERE name = ?", itemName)   // prepared statement'},
  {id:"sql_fstring", cwe:"CWE-89", sev:"high", re:/(execute|query|raw)\s*\(\s*f["'][^"'\n]*\b(select|insert|update|delete)\b/i, fix:'cursor.execute("SELECT * FROM users WHERE name = %s", (name,))'},
  {id:"cmd_injection", cwe:"CWE-78", sev:"high", re:/\b(os\.system|system|popen|shell_exec|passthru|child_process\.exec|execSync|Runtime\.getRuntime\(\)\.exec)\s*\([^)\n]*(\+|%s|\$\{|\bf["']|snprintf|\.format)|shell\s*=\s*True|snprintf\s*\([^)]*"[^"]*(grep|ls|cat|ping|rm)\b[^"]*%s/i, fix:'subprocess.run(["grep", pattern, "phonebook.txt"])   // execv / exec.Command: program and data kept separate'},
  {id:"xss_sink", cwe:"CWE-79", sev:"high", re:/(\.innerHTML\s*\+?=|\.outerHTML\s*=|document\.write\s*\(|insertAdjacentHTML\s*\(|dangerouslySetInnerHTML|v-html\s*=|\|\s*safe\b|echo\s+\$_(GET|POST|REQUEST))/i, fix:"el.textContent = userText;   // or a template engine that escapes automatically + a Content-Security-Policy"},
  {id:"xss_fprintf", cwe:"CWE-79", sev:"high", re:/Fprintf\s*\(\s*w\s*,\s*"[^"]*<[a-z][^"]*%s/i, fix:'fmt.Fprintf(w, "<html><body>Hello %s!</body></html>", html.EscapeString(name))   // better: html/template'},
  {id:"eval", cwe:"CWE-95", sev:"high", re:/\beval\s*\(|new\s+Function\s*\(|setTimeout\s*\(\s*["'`][^"'`]*\+/, fix:"Parse data with JSON.parse; never run text as code"},
  {id:"path_traversal", cwe:"CWE-22", sev:"medium", re:/(open|readFile|readFileSync|sendFile|file_get_contents|fopen)\s*\([^)\n]*(req\.|request\.|params|query|\$_GET|argv)/i, fix:"Resolve the path, then check it stays inside the allowed folder"},
  {id:"weak_password_hash", cwe:"CWE-916", sev:"high", re:/(md5|sha1|sha256|sha-256|hashlib\.sha\d+|createHash\(\s*['"](md5|sha1|sha256))[^\n]*pass|pass[^\n]*(md5|sha1|hashlib\.sha\d+|createHash\(\s*['"](md5|sha1|sha256))/i, fix:"bcrypt.hash(password, 12) / argon2id / PBKDF2 with a random salt per user and many iterations"},
  {id:"plain_password", cwe:"CWE-256", sev:"high", re:/(insert\s+into\s+\w*users?\b[^\n]*password|\.password\s*=\s*(req|request)\.)/i, fix:"Store only a salted slow hash of the password, never the password"},
  {id:"insecure_random", cwe:"CWE-338", sev:"medium", re:/(Math\.random\(\)|random\.random\(\)|\brand\(\)|mt_rand\()[^\n]*|(token|session|otp|salt|nonce|secret)[^\n]*(Math\.random|random\.random|rand\(\))/i, test:line => /(token|session|otp|salt|nonce|secret|key|id)/i.test(line), fix:"crypto.randomBytes(32) / secrets.token_urlsafe(32) / crypto.getRandomValues"},
  {id:"cookie_flags", cwe:"CWE-614", sev:"medium", re:/(res\.cookie\s*\(|setcookie\s*\(|set_cookie\s*\(|Set-Cookie|http\.Cookie\s*\{)/i, test:(line, all) => !/httponly/i.test(line) || !/secure/i.test(line) || !/samesite/i.test(line), fix:"Secure; HttpOnly; SameSite=Lax (Strict for banking)"},
  {id:"cors_any", cwe:"CWE-942", sev:"medium", re:/(Access-Control-Allow-Origin["']?\s*[:,]\s*["']\*|cors\(\s*\)|origin\s*:\s*["']\*["'])/i, fix:"cors({ origin: ['https://your-site.com'] })"},
  {id:"hardcoded_secret", cwe:"CWE-798", sev:"high", re:/\b(password|passwd|api[_-]?key|secret|token)\s*[:=]\s*["'][^"'\s]{6,}["']/i, fix:"Read secrets from environment variables or a secrets manager"},
  {id:"form_no_csrf", cwe:"CWE-352", sev:"medium", re:/<form[^>]*method\s*=\s*["']?post/i, test:(line, all) => !/csrf|xsrf|_token|authenticity_token/i.test(all), fix:'<input type="hidden" name="csrf_token" value="{{token}}">  + SameSite cookies'},
  {id:"http_url", cwe:"CWE-319", sev:"low", re:/["']http:\/\/(?!localhost|127\.0\.0\.1)[a-z0-9.-]+/i, fix:"Use https:// for every request"},
  {id:"tls_off", cwe:"CWE-295", sev:"high", re:/(verify\s*=\s*False|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true|CURLOPT_SSL_VERIFYPEER\s*,\s*(0|false))/i, fix:"Keep certificate checking on (otherwise anyone in the middle can read the traffic)"}
];
function codeScan(code){
  const src = String(code || "").slice(0, 400000), lines = src.split(/\r?\n/), F = [];
  if (!src.trim()) return {status:"error", code:"empty"};
  lines.forEach((line, i) => {
    if (line.length > 2000) return;
    for (const r of CODE_RULES){
      if (!r.re.test(line)) continue;
      if (r.test && !r.test(line, src)) continue;
      if (F.some(f => f.id === r.id && f.line === i + 1)) continue;
      F.push({id:r.id, cwe:r.cwe, sev:r.sev, line:i + 1, snippet:line.trim().slice(0, 160), fix:r.fix});
    }
  });
  const lang = /\bfunc\s+\w+\(|fmt\./.test(src) ? "Go" : /\bdef\s+\w+\(|import\s+os|subprocess/.test(src) ? "Python" : /#include|snprintf|\bint\s+main\(/.test(src) ? "C" : /<\?php|\$_(GET|POST)/.test(src) ? "PHP" : /require\(|const\s+\w+\s*=|=>/.test(src) ? "JavaScript" : /\bpublic\s+(static\s+)?\w+/.test(src) ? "Java" : "unknown";
  const rank = {high:0, medium:1, low:2}; F.sort((a, b) => rank[a.sev] - rank[b.sev] || a.line - b.line);
  return {status:"complete", lines:lines.length, lang, findings:F, verdict:F.some(f => f.sev === "high") ? "high" : F.length ? "verify" : "low"};
}

/* ---------- Samples for the demo ---------- */
const WEB_SAMPLES = {
  phishEmail:`<html><body style="font-family:Arial">
<p>Dear customer,</p>
<p><b>Your bKash account will be closed</b> within 24 hours because of unusual sign-in activity. Please verify your account now.</p>
<p><a href="http://bkash-verify-bd.help/login?id=77">https://www.bkash.com/verify</a></p>
<img src="http://track.mailer-stats.top/open.gif?u=8812" width="1" height="1" style="display:none">
<img src="https://bank.example.com/transfer?amount=5000&to=mallory" width="0" height="0">
<iframe src="https://www.bkash.com/" style="opacity:0;position:absolute;top:0;left:0" width="500" height="400"></iframe>
<form id="f" action="http://bkash-verify-bd.help/collect" method="POST">
 <input name="phone"><input type="password" name="pin"><input type="submit" value="Confirm">
</form>
<script>document.addEventListener('DOMContentLoaded', () => { document.getElementById('f').submit(); });</script>
</body></html>`,
  bitb:`<html><body><div style="position:fixed;top:60px;left:25%;width:50%;border:1px solid #ccc;box-shadow:0 8px 30px #0003">
<div style="background:#eee;padding:6px">🔒 https://accounts.google.com/signin</div>
<h3>Sign in with Google</h3><input placeholder="Email"><input type="password" placeholder="Password"><button>Next</button></div></body></html>`,
  safeEmail:`<html><body><p>Hi Rahim, the class notes are attached. See the course page at <a href="https://www.buet.ac.bd/">www.buet.ac.bd</a>.</p><p>Thanks!</p></body></html>`,
  headersBad:`HTTP/1.1 200 OK
Server: Apache/2.4.29 (Ubuntu)
X-Powered-By: PHP/7.2.24
Content-Type: text/html; charset=UTF-8
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Set-Cookie: PHPSESSID=9f2c1e0ab7; path=/
Set-Cookie: remember_token=abc123; Max-Age=31536000; path=/; SameSite=None`,
  headersGood:`HTTP/2 200
Content-Type: text/html; charset=utf-8
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Set-Cookie: __Host-session=3b9f0c; Path=/; Secure; HttpOnly; SameSite=Lax`,
  codeBad:`// Go: the lecture's vulnerable handlers
func handleGetItems(w http.ResponseWriter, r *http.Request) {
    itemName := r.URL.Query()["item"][0]
    query := fmt.Sprintf("SELECT name, price FROM items WHERE name = '%s'", itemName)
    row, err := db.QueryRow(query)
    fmt.Fprintf(w, "<html><body>Hello %s!</body></html>", itemName)
}
/* C */
void find_employee(char *regex) {
    char cmd[512];
    snprintf(cmd, sizeof cmd, "grep '%s' phonebook.txt", regex);
    system(cmd);
}
// JavaScript
document.getElementById("greet").innerHTML = "Hello " + location.hash.slice(1);
const sessionToken = Math.random().toString(36);
res.cookie("session", sessionToken);
# Python
hashed = hashlib.md5(password.encode()).hexdigest()
API_KEY = "demo-key-not-real-123"`,
  codeGood:`func handleGetItems(w http.ResponseWriter, r *http.Request) {
    itemName := r.URL.Query()["item"][0]
    row, err := db.QueryRow("SELECT name, price FROM items WHERE name = ?", itemName)
    tmpl.Execute(w, map[string]string{"name": itemName})
}
subprocess.run(["grep", pattern, "phonebook.txt"])
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
token = secrets.token_urlsafe(32)`
};
