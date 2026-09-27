// Regression and module tests. Run from the source folder: node tests/run_tests.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const SRC = path.join(__dirname, "..");
const ctx = {console, URL, TextDecoder, TextEncoder, Blob, DecompressionStream, crypto: globalThis.crypto, setTimeout, clearTimeout, AbortController, Date, Promise};
vm.createContext(ctx);
const code = ["engine.js", "samples_data.js", "modules.js", "pcap_data.js", "netlab.js", "websec.js"].map(f => fs.readFileSync(path.join(SRC, f), "utf8")).join("\n") +
  "\n;this.X={SCEN,runConversation,inspectUrl,inspectFile,dnsLookup,matchPatterns,defang,maskText,SAMPLE_FILES,hostUnicode,parseAxml,loginCheck,analyzeCapture,analyzeLogs,genLogs,SAMPLE_PCAPS,readCapture,passwordCheck,makePassphrase,pwnedCheck,pageScan,headerCheck,codeScan,urlPayloadCheck,WEB_SAMPLES,humanTime};";
vm.runInContext(code, ctx);
const X = ctx.X; let pass = 0, fail = 0;
const ok = (cond, name, extra) => { if (cond){ pass++; } else { fail++; console.log("FAIL", name, extra !== undefined ? JSON.stringify(extra) : ""); } };
const b64 = s => new Uint8Array(Buffer.from(s, "base64"));

(async () => {
  // 1. The 12 existing scenarios keep their verdicts (preservation rule)
  const expect = {s1:"high", s2:"low", s9:"high", s10:"low", s3:"high", s12:"high", s11:"high", s4:"high", s5:"low", s6:"high", s7:"high", s8:"low"};
  for (const sc of X.SCEN){ const r = X.runConversation(sc), last = r.perTurn.filter(p => p.who !== "me").slice(-1)[0]; ok(last.verdict === expect[sc.id], "scenario " + sc.id, last.verdict); }
  ok(X.runConversation(X.SCEN.find(s => s.id === "s9")).perTurn[2].verdict === "verify", "s9 caution at T3");

  // 2. URL inspection
  const U = u => X.inspectUrl(u);
  const cases = [
    ["https://www.bkash.com", "official", "low"],
    ["https://nagad-verify.help/login", "dangerous", "high"],
    ["http://daraz.com.bd@198.51.100.7/claim", "dangerous", "high"],
    ["https://bk\u0430sh.com/login", "dangerous", "high"],           // Cyrillic a
    ["bkash.com.account-verify.top/kyc", "dangerous", "high"],       // deceptive subdomain
    ["https://bit.ly/3xYzAbc", "unknown", "verify"],
    ["http://192.168.0.1/login", "dangerous", "high"],               // private address
    ["https://bkash-verify-bd.help/login?id=77", "known_harmful", "high"],
    ["https://www.prothomalo.com/bangladesh", "unknown", "verify"],  // ordinary non-brand link
    ["javascript:alert(1)", "dangerous", "high"],
    ["bkash.com:8080/app", "official", "low"],
    ["https://bka5h.com", "dangerous", "high"],                      // digit look-alike
    ["telegram.sth/login", "dangerous", "high"],                      // teacher's story: fake Telegram
    ["https://telegrarn-login.top", "dangerous", "high"],             // rn -> m
    ["https://telegrm.org", "dangerous", "high"],                     // one-letter typo
    ["https://web.telegram.org", "official", "low"],
    ["https://accounts.google.com", "official", "low"],
    ["https://www.pocket.com", "unknown", "verify"],                  // not a rocket look-alike (different first letter)
    ["https://faceb00k-login.com", "dangerous", "high"]
  ];
  for (const [u, cat, v] of cases){ const r = U(u); ok(r.category === cat && r.verdict === v, "url " + u, [r.category, r.verdict, r.evidence && r.evidence.map(e => e.kind)]); }
  const cy = U("https://bk\u0430sh.com/login"); ok(cy.lookalikeOf === "bkash.com" && /bk.sh\.com/.test(cy.hostUnicode), "confusable shown", cy.hostUnicode);
  ok(U("https://nagad-verify.help/login").defanged === "hxxps://nagad-verify[.]help/login", "defang", U("https://nagad-verify.help/login").defanged);
  ok(U("").status === "error" && U("x".repeat(3000)).status === "error" && U("http://a\u0007b.com").status === "error", "bad input rejected");
  ok(U("https://www.bkash.com", ).verdict === "low" && U("https://example.org", {trusted:["example.org"]}).category === "unknown", "trusted needs opts");
  ok(X.inspectUrl("https://example.org", {trusted:["example.org"]}).category === "trusted", "user trusted list");
  ok(U("ftp://files.example.com/a").status === "unsupported", "ftp unsupported");

  // 3. Files and APKs
  const F = (k, o) => X.inspectFile(b64(X.SAMPLE_FILES[k].b64), X.SAMPLE_FILES[k].name, o);
  const fake = await F("fake"), dis = await F("disguised"), calc = await F("calc");
  ok(fake.kind === "apk" && fake.verdict === "high" && fake.apk.pkg === "com.bkash.secure.update", "fake apk", [fake.kind, fake.verdict, fake.apk && fake.apk.pkg]);
  ok(fake.apk.claimed === "bkash" && fake.evidence.some(e => e.kind === "apk_impersonation"), "impersonation flagged");
  ok(["READ_SMS","RECEIVE_SMS","SYSTEM_ALERT_WINDOW","BIND_ACCESSIBILITY_SERVICE","BIND_NOTIFICATION_LISTENER_SERVICE"].every(p => fake.apk.sensitive.includes(p)), "sensitive perms", fake.apk.sensitive);
  ok(fake.apk.exported === 2 && fake.known, "exported + demo hash", [fake.apk.exported, fake.known]);
  ok(dis.evidence.some(e => e.kind === "disguised") && dis.verdict === "high", "disguised pdf", dis.evidence.map(e => e.kind));
  ok(!dis.known && !dis.apk.claimed && dis.apk.pkg === "com.receipt.pdfviewer", "disguised sample differs from fake bKash app", [dis.known, dis.apk.pkg]);
  ok(calc.kind === "apk" && calc.verdict === "verify" && !calc.apk.claimed && calc.evidence.some(e => e.kind === "unknown_hash"), "benign apk = caution, unknown hash", [calc.verdict, calc.apk.sensitive]);
  const pdf = await X.inspectFile(new TextEncoder().encode("%PDF-1.4\n%demo\n"), "receipt.pdf"); ok(pdf.kind === "pdf" && pdf.verdict === "low", "plain pdf low", pdf.verdict);
  const html = await X.inspectFile(new TextEncoder().encode("<html><script>alert(1)</script></html>"), "invoice.pdf"); ok(html.kind === "html" && html.verdict === "high", "html disguised as pdf", [html.kind, html.verdict]);
  const dbl = await X.inspectFile(new Uint8Array([0x4D,0x5A,0,0]), "photo.jpg.exe"); ok(dbl.verdict === "high" && dbl.evidence.some(e => e.kind === "double_ext"), "double extension");
  const big = await X.inspectFile(new Uint8Array(10), "a.bin"); ok(big.status === "complete", "small unknown ok");
  const corrupt = await X.inspectFile(new Uint8Array([0x50,0x4B,0x03,0x04,1,2,3]), "broken.apk"); ok(corrupt.status === "complete" && corrupt.verdict !== "low", "corrupt zip handled", corrupt.verdict);
  const eicarOff = await X.inspectFile(new TextEncoder().encode("not eicar"), "t.txt", {testSignatures:true}); ok(!eicarOff.known, "no false hash hit");

  // 4. Sequence patterns: no look-ahead
  const s1 = X.runConversation(X.SCEN.find(s => s.id === "s1"));
  const all = X.matchPatterns(s1.perTurn, 99), early = X.matchPatterns(s1.perTurn, 2);
  ok(all.some(p => p.id === "office") && early.length === 0, "office pattern, no look-ahead", [all, early]);
  const s7 = X.runConversation(X.SCEN.find(s => s.id === "s7")); ok(X.matchPatterns(s7.perTurn, 99).some(p => p.id === "refund"), "refund pattern");
  const s4 = X.runConversation(X.SCEN.find(s => s.id === "s4")); ok(X.matchPatterns(s4.perTurn, 99).some(p => p.id === "relative"), "relative pattern");

  // 5. Output safety: hostile markup is data
  const xss = X.runConversation({id:"x", sender:"", senderType:"unknown", turns:[["o", "<img src=x onerror=alert(1)> bKash office theke bolchi, code ta din"]]});
  ok(xss.perTurn[0].text.includes("<img"), "engine keeps raw text for escaping in UI");

  // 6. DNS: blocked for private/IP hosts, honest offline state
  const d1 = await X.dnsLookup("192.168.0.1"); ok(d1.status === "unsupported", "dns refuses IP");
  const d2 = await X.dnsLookup("example.com", async () => { throw new Error("offline"); }); ok(d2.status === "offline", "dns offline state", d2.status);
  const d3 = await X.dnsLookup("nagad-verify.help", async (u) => ({ok:true, json: async () => (u.includes("type=A&") || u.endsWith("type=A") ? {Status:3} : {Status:3})})); ok(d3.status === "complete" && d3.nx, "dns nxdomain", d3.nx);

  // 7. Login guard (teacher's fake-Telegram story)
  const LC = (sv, u) => X.loginCheck(sv, u);
  const lg = [["telegram","telegram.sth/login","high"],["telegram","https://web.telegram.org","low"],["telegram","http://web.telegram.org/login","verify"],
    ["facebook","https://faceb00k-login.com","high"],["google","https://accounts.google.com.verify-login.top","high"],["google","https://accounts.google.com","low"],
    ["telegram","https://www.facebook.com","verify"],["bkash","http://bkash.com@198.51.100.7/","high"],["whatsapp","web.whatsapp.com","low"],["telegram","https://example.com","high"]];
  for (const [sv, u, v] of lg){ const r = LC(sv, u); ok(r.verdict === v, "login " + sv + " " + u, [r.verdict, r.code, r.reasons]); }
  ok(LC("telegram", "https://web.telegram.org").url.official === "telegram" && LC("nosuch", "x.com").status === "error", "login service guard");

  // 8. Packet capture reader + MITM detection
  const atk = X.analyzeCapture(b64(X.SAMPLE_PCAPS.attack.b64)), nor = X.analyzeCapture(b64(X.SAMPLE_PCAPS.normal.b64));
  const ids = atk.findings.map(f => f.id);
  ok(atk.status === "complete" && atk.count === 13, "pcap parsed", [atk.status, atk.count]);
  ok(ids.includes("arp_spoof") && ids.includes("dns_private") && ids.includes("bad_domain") && ids.includes("cleartext_password") && atk.verdict === "high", "cafe wifi attack findings", ids);
  ok(atk.findings.find(f => f.id === "bad_domain").data.name === "telegrarn-login.top", "look-alike name from DNS", atk.findings.find(f => f.id === "bad_domain").data);
  ok(atk.packets.some(p => p.tls && p.tls.sni === "web.telegram.org"), "TLS SNI decoded");
  ok(nor.status === "complete" && nor.findings.length === 0 && nor.verdict === "low", "normal capture clean", nor.findings.map(f => f.id));
  ok(X.analyzeCapture(new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25])).code === "not_capture", "non-capture rejected");
  const trunc = b64(X.SAMPLE_PCAPS.attack.b64).slice(0, 300); ok(X.analyzeCapture(trunc).status === "complete", "truncated capture handled");
  // SYN flood + port scan built in memory
  const fr = []; const hdr = new Uint8Array(24); new DataView(hdr.buffer).setUint32(0, 0xa1b2c3d4, true); new DataView(hdr.buffer).setUint16(4, 2, true); new DataView(hdr.buffer).setUint32(20, 101, true); fr.push(hdr);
  const pkt = (t, src, dport) => { const f = new Uint8Array(40); f[0] = 0x45; f[3] = 40; f[9] = 6; f.set(src, 12); f.set([10,0,0,5], 16); f[22] = 0x9c; f[23] = 0x40; f[20] = 0xc0; f[21] = 0x01; f[22] = dport >> 8; f[23] = dport & 255; f[32] = 0x50; f[33] = 0x02; const h = new Uint8Array(16); const dv = new DataView(h.buffer); dv.setUint32(0, 1000 + Math.floor(t), true); dv.setUint32(4, Math.floor((t % 1) * 1e6), true); dv.setUint32(8, 40, true); dv.setUint32(12, 40, true); fr.push(h, f); };
  for (let i = 0; i < 150; i++) pkt(i / 200, [198,51,100,(i % 250) + 1], 80);
  for (let i = 0; i < 30; i++) pkt(5 + i / 100, [203,0,113,9], 1 + i);
  const all8 = new Uint8Array(fr.reduce((s, a) => s + a.length, 0)); let off = 0; fr.forEach(a => { all8.set(a, off); off += a.length; });
  const fl = X.analyzeCapture(all8), fids = fl.findings.map(f => f.id);
  ok(fids.includes("syn_flood") && fids.includes("port_scan"), "syn flood + port scan", fids);

  // 9. Server-log analyser: DDoS early warning, brute force, scanning, injection
  const ln = X.analyzeLogs(X.genLogs("normal")), ld = X.analyzeLogs(X.genLogs("ddos")), la = X.analyzeLogs(X.genLogs("attack"));
  const cs = la.findings.find(f => f.id === "csrf");
  ok(cs && cs.data.from === "free-prize-bd.top" && cs.data.victims === 4 && cs.mitre === "CWE-352", "log CSRF: cross-site money requests", cs);
  ok(!ln.findings.some(f => f.id === "csrf") && !ld.findings.some(f => f.id === "csrf"), "no CSRF in normal/DDoS logs");
  const inj2 = la.findings.find(f => f.id === "injection"); ok(inj2 && inj2.data.cwe.includes("CWE-89"), "injection carries CWE ids", inj2 && inj2.data.cwe);
  ok(ln.status === "complete" && ln.findings.length === 0 && ln.verdict === "low", "normal logs clean", ln.findings.map(f => [f.id, f.data]));
  const dd = ld.findings.find(f => f.id === "ddos");
  ok(dd && ld.firstWarn >= 0 && ld.firstWarn < ld.firstAlert && dd.data.leadMin >= 1, "ddos early warning before alert", [ld.firstWarn, ld.firstAlert, dd && dd.data]);
  ok(dd && dd.data.uniq >= 50 && dd.data.topShare < 20, "ddos is distributed", dd && dd.data);
  const aid = la.findings.map(f => f.id);
  ok(aid.includes("bruteforce_success") && aid.includes("scan") && aid.includes("injection") && aid.includes("scanner_tool") && !aid.includes("ddos"), "attack logs findings", aid);
  const inj = la.findings.find(f => f.id === "injection"); ok(inj && ["sqli","xss","traversal","cmdi"].every(k => inj.data.kinds.includes(k)), "all 4 injection kinds", inj && inj.data.kinds);
  ok(X.analyzeLogs("hello\nworld").status === "error", "garbage log rejected");
  ok(X.genLogs("ddos") === X.genLogs("ddos"), "log samples deterministic");

  // 10. Attack code inside links (lecture: reflected XSS on a real site, SQLi, traversal, %-encoding, open redirect)
  const UL = u => X.inspectUrl(u);
  const r1 = UL("https://www.bkash.com/search?q=%3Cscript%3Ealert(document.cookie)%3C/script%3E");
  ok(r1.verdict === "high" && r1.evidence.some(e => e.kind === "xss_payload"), "reflected XSS on official domain flagged", r1.evidence.map(e => e.kind));
  ok(UL("https://shop.example.com/items?item=%27%20OR%20%271%27%20%3D%20%271").evidence.some(e => e.kind === "sqli_payload"), "SQLi payload in link");
  ok(UL("https://files.example.com/get?f=%252e%252e%252fetc%252fpasswd").evidence.some(e => e.kind === "traversal_payload"), "double-encoded traversal");
  ok(UL("https://www.google.com/url?url=https://evil-login.top/x").evidence.some(e => e.kind === "open_redirect"), "open redirect");
  ok(UL("https://www.bkash.com/offers?page=2").verdict === "low", "normal official link stays low");
  // 11. Passwords (lecture: offline/online attacks, salts, slow hashes)
  const pw1 = X.passwordCheck("password123"), pw2 = X.passwordCheck("P@ssw0rd"), pw3 = X.passwordCheck("tiger-lamp-orbit-quiver-mango-ribbon-fossil"), pw4 = X.passwordCheck("rahim1998", {words:["rahim"]}), pw5 = X.passwordCheck("01712345678");
  ok(pw1.level === "weak" && pw1.patterns.some(p => p.kind === "common"), "common password weak", pw1);
  ok(pw2.level === "weak", "leet common password weak", [pw2.bits, pw2.patterns]);
  ok(pw3.level === "strong" && pw3.crack.offline_slow > 3.15e9 && pw3.crack.offline_fast > 86400 * 30, "7-word passphrase strong", [pw3.bits]);
  ok(pw4.level !== "strong" && pw4.patterns.some(p => p.kind === "personal") && pw4.patterns.some(p => p.kind === "year"), "name + year", pw4.patterns);
  ok(pw5.patterns.some(p => p.kind === "phone") && pw5.level === "weak", "phone number password", [pw5.bits]);
  ok(pw3.crack.offline_slow > pw3.crack.offline_fast && pw1.crack.online_limited > pw1.crack.offline_fast, "slow hash / rate limit slower for attacker");
  let seed = 7; const pp = X.makePassphrase(7, n => (seed = (seed * 48271) % 2147483647) % n);
  ok(pp.text.split("-").length === 7 && pp.bits > 50, "passphrase generator", pp);
  const pw6 = X.passwordCheck("Rahim@1998");
  ok(pw6.level !== "strong" && pw6.patterns.some(p => p.kind === "word_digits"), "Name@year shape is not strong", [pw6.bits]);
  const pw7 = X.passwordCheck("ocean-gravel-yarn");
  ok(pw7.level === "weak", "3-word passphrase from the list is weak", [pw7.bits]);
  const pwn = await X.pwnedCheck("password", async (u) => { ok(/range\/5BAA6$/.test(u), "only 5-char prefix sent", u); return {ok:true, text: async () => "1E4C9B93F3F0682250B6CF8331B7EE68FD8:9659365\r\nFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1"}; });
  ok(pwn.status === "complete" && pwn.count === 9659365, "pwned count parsed", pwn);
  // 12. Page & email X-ray (tracking pixel, CSRF <img>, hidden iframe, auto-submit form, link mismatch, browser-in-browser)
  const pg = X.pageScan(X.WEB_SAMPLES.phishEmail), kinds = pg.findings.map(f => f.kind);
  ["tracking_pixel","csrf_img","hidden_iframe","auto_submit_form","link_mismatch","form_http","form_foreign","urgency"].forEach(k => ok(kinds.includes(k), "page finds " + k, kinds));
  ok(pg.verdict === "high", "phishing email high");
  ok(X.pageScan(X.WEB_SAMPLES.bitb).findings.some(f => f.kind === "browser_in_browser"), "browser-in-browser detected");
  ok(!X.pageScan(X.WEB_SAMPLES.phishEmail).findings.some(f => f.kind === "browser_in_browser"), "link text alone is not a fake window");
  const safe = X.pageScan(X.WEB_SAMPLES.safeEmail); ok(safe.verdict === "low" && safe.findings.length === 0, "normal email clean", safe.findings);
  ok(X.pageScan('<p>nice post</p><img src=x onerror=alert(1)>', {userContent:true}).findings.some(f => f.kind === "event_handlers" && f.sev === "high"), "stored XSS in user content");
  // 13. Website headers & cookies (CSP, frame-ancestors, HSTS, SameSite, HttpOnly, CORS)
  const hb = X.headerCheck(X.WEB_SAMPLES.headersBad), hg = X.headerCheck(X.WEB_SAMPLES.headersGood);
  ok(hb.grade === "F" && hb.checks.some(c => c.id === "cors" && !c.ok) && hb.cookies.find(c => c.name === "PHPSESSID").issues.includes("no_httponly"), "bad headers graded F", [hb.grade, hb.score]);
  ok(hb.cookies.find(c => c.name === "remember_token").issues.includes("samesite_none_insecure"), "SameSite=None without Secure");
  ok(hg.grade === "A" && hg.verdict === "low", "good headers graded A", [hg.grade, hg.checks.filter(c => !c.ok)]);
  ok(X.headerCheck("").status === "error", "empty headers rejected");
  // 14. Code check (prepared statements, execv, escaping, slow password hashing, secure randomness)
  const cb = X.codeScan(X.WEB_SAMPLES.codeBad), cids = cb.findings.map(f => f.id);
  ["sql_concat","cmd_injection","xss_fprintf","xss_sink","insecure_random","cookie_flags","weak_password_hash","hardcoded_secret"].forEach(k => ok(cids.includes(k), "code finds " + k, cids));
  const cg = X.codeScan(X.WEB_SAMPLES.codeGood); ok(cg.findings.length === 0, "safe code clean", cg.findings);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
