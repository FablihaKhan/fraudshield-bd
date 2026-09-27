/* ================= Login guard tab + Security Lab section (UI). Logic lives in netlab.js ================= */
Object.assign(I, {
  key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2.5 2.5"/>',
  radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 6.5-6.5"/><circle cx="12" cy="12" r="1.2"/>',
  server:'<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>',
  activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>'
});
ART.mitm = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(22 58)"><rect width="56" height="92" rx="12" fill="#0B2545"/><rect x="6" y="10" width="44" height="66" rx="5" fill="#E0F2FE"/><rect x="12" y="22" width="32" height="8" rx="4" fill="#fff"/><rect x="12" y="36" width="32" height="8" rx="4" fill="#fff"/><text x="28" y="60" font-size="9" text-anchor="middle" fill="#0369A1" font-family="monospace">••••</text></g><g transform="translate(244 70)"><rect width="60" height="26" rx="8" fill="#0B2545"/><circle cx="14" cy="13" r="4" fill="#22C55E"/><path d="M20-2 10-18M40-2 50-18" stroke="#0B2545" stroke-width="5" stroke-linecap="round"/></g><path d="M86 104C120 60 200 60 236 84" stroke="#0EA5E9" stroke-width="5" stroke-dasharray="3 10" stroke-linecap="round" fill="none"/><g transform="translate(160 64)"><circle r="26" fill="#FFF3F0" stroke="#E07A6B" stroke-width="4"/><path d="M-14 4q14-16 28 0" stroke="#A4453A" stroke-width="4" fill="none"/><rect x="-16" y="-6" width="12" height="7" rx="3" fill="#0B2545"/><rect x="4" y="-6" width="12" height="7" rx="3" fill="#0B2545"/><path d="M-4-3h8" stroke="#0B2545" stroke-width="2"/></g><text x="160" y="118" font-size="12" font-weight="800" text-anchor="middle" fill="#A4453A" font-family="sans-serif">?!</text></svg>`;
ART.ddos = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(200 44)"><rect width="84" height="30" rx="8" fill="#0B2545"/><rect y="38" width="84" height="30" rx="8" fill="#0B2545"/><circle cx="16" cy="15" r="4" fill="#E07A6B"/><circle cx="16" cy="53" r="4" fill="#E3A74F"/><rect x="30" y="12" width="40" height="6" rx="3" fill="#7DD3FC"/><rect x="30" y="50" width="40" height="6" rx="3" fill="#7DD3FC"/></g>${[20,44,68,92,116,140].map((y,i) => `<g transform="translate(${26 + (i % 2) * 22} ${y})"><rect width="30" height="20" rx="5" fill="#fff" ${DS}/><path d="M36 10h${110 - (i % 2) * 22}" stroke="${i % 3 ? "#E3A74F" : "#E07A6B"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${i % 2 ? "2 8" : "10 6"}"/></g>`).join("")}</svg>`;
ART.loginguard = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(58 34)"><rect width="204" height="112" rx="18" fill="#fff" ${DS}/><rect x="16" y="14" width="172" height="22" rx="11" fill="#F0F9FF"/><circle cx="30" cy="25" r="6" fill="#DCFCE7"/><text x="42" y="29" font-size="11" font-family="monospace" fill="#0B2545">web.telegram.org</text><rect x="16" y="48" width="172" height="20" rx="8" fill="#F0F9FF"/><rect x="16" y="76" width="172" height="20" rx="8" fill="#F0F9FF"/><text x="26" y="90" font-size="12" font-family="monospace" fill="#0369A1">• • • • • •</text></g><g transform="translate(236 104)"><path d="M0-30 24-22v16c0 16-10 26-24 30-14-4-24-14-24-30v-16Z" fill="#0EA5E9" stroke="#fff" stroke-width="4"/><path d="m-10 0 7 7 13-14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
ART.pcap = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="74" fill="#BAE6FD"/><g transform="translate(44 30)"><rect width="200" height="116" rx="14" fill="#0B1B2F" ${DS}/>${[0,1,2,3,4].map(i => `<rect x="12" y="${14 + i * 19}" width="176" height="13" rx="4" fill="${["#1E3A5F","#3B2F1A","#1E3A5F","#4A2323","#1E3A5F"][i]}"/><rect x="18" y="${18 + i * 19}" width="${[40,60,34,70,48][i]}" height="5" rx="2" fill="${["#7DD3FC","#E3A74F","#7DD3FC","#E07A6B","#7DD3FC"][i]}"/>`).join("")}</g><g transform="translate(236 108)"><circle r="26" fill="#fff" stroke="#0EA5E9" stroke-width="7"/><path d="M18 18 36 36" stroke="#0EA5E9" stroke-width="9" stroke-linecap="round"/><path d="M-10 0h20M0-10v20" stroke="#E07A6B" stroke-width="4" stroke-linecap="round"/></g></svg>`;

const LB = {
 en:{
  tab:"Login",
  svcLbl:"1. Which app are you logging in to?", urlLbl:"2. Paste the address from the top of the page",
  urlTip:"Where is the address?|It's the text at the very top of the browser, next to the lock. Tap it, then copy.",
  ph:"for example web.telegram.org", go:"Can I type my password here?", exLbl:"Try:",
  ex:[["telegram","telegram.sth/login","Fake Telegram"],["telegram","https://web.telegram.org","Real Telegram"],["facebook","http://www.facebook.com/login","Facebook, no lock"],["facebook","https://faceb00k-login.com","Fake Facebook"],["google","https://accounts.google.com.verify-login.top","Fake Google"]],
  note:"Want this on every website? Get the Browser Shield add-on for Chrome or Edge (below). It stops you before you type.",
  noteTip:"Why an add-on?|A web page can't see other tabs. The Browser Shield add-on can, so it checks every login page for you.",
  empty:["Before you type a password…","Pick the app, paste the page address, and we'll tell you if it's the real one."],
  pick:"Pick the app first.",
  title:{high:"Don't type your password!", official_http:"Wait. This page has no lock.", other_service:"Wrong website for this app", official_https:s=>`Yes, this is the real ${s}`, official_noscheme:s=>`This is ${s}'s real website name`},
  sub:{high:s=>`This page is not ${s}. It only pretends to be.`, official_http:"It's the real website, but the connection isn't locked. People on the same Wi-Fi could see your password.", other_service:(a,b)=>`You picked ${a}, but this page belongs to ${b}.`, official_https:"The name matches and the connection is locked. Still, never share an OTP someone asks for.", official_noscheme:"The name matches. Before typing, check that the address starts with https and shows a lock."},
  why:{lookalike:s=>`The name copies ${s}'s, with some letters changed.`, brand_in_host:s=>`It uses the name ${s}, but the website belongs to someone else.`, not_official:s=>`This is not one of ${s}'s real websites.`, deceptive_subdomain:s=>`${s}'s name is at the front, but the real owner is at the end.`, userinfo:"The link hides where it really goes.", ip_address:"There is no website name, only numbers.", known_harmful:"This is a known scam website.", no_tls:"No lock: what you type can be read on the way.", official:s=>`This is ${s}'s real website.`, check_lock:"We can't see the lock (https) from a pasted name. Check it on the page.", other_service:(a,b)=>`This is ${b}'s website, not ${a}'s.`},
  dos:{high:[["x","Close this page"],["app",s=>`Open the ${s} app directly`],["lock","Typed it already? Change your password now"]], verify:[["wifi","Don't log in on public Wi-Fi"],["app","Use the app instead"]], low:[["lock","Check the lock, then log in"],["shieldok","Turn on two-step login"]]},
  want:"You want", is:"This page is", real:"Real addresses", lockL:"Lock", lockY:"https (locked)", lockN:"http (no lock)", lockU:"not shown",
  labTitle:"Security Lab", labSub:"For curious learners and IT teams. Open network captures and server logs. Everything stays on this device.",
  teaserT:"This part is for IT and security people", teaserB:"Curious? It explains everything in simple words too.", teaserBtn:"Show me the Lab",
  labTabs:{net:["Network capture","Catch Wi-Fi tricks"], logs:["Server logs","Early DDoS warning"]},
  netCta:"Choose a capture file (.pcap / .pcapng)", netHelp:"Saved from Wireshark or tcpdump. Up to 20 MB.",
  logCta:"Choose a web server log (.log / .txt)", logHelp:"Apache or Nginx access log. Up to 20 MB.",
  samplesLbl:"Samples:", sampleTip:"Harmless demo data|Made for this project. No real people's traffic.",
  netEx:[["attack","Café Wi-Fi attack"],["normal","Normal home Wi-Fi"]], logEx:[["ddos","DDoS attack"],["attack","Hacker attempts"],["normal","Normal day"]],
  labNote:"Company version (planned): a small agent reads logs live and alerts the team by phone before the site goes down.",
  netEmpty:["Open a capture","Or try the café Wi-Fi sample to watch a man-in-the-middle attack get caught, step by step."],
  logEmpty:["Open a server log","Or try the DDoS sample to see the early warning."],
  loading:"Reading…",
  err:{not_capture:"This isn't a packet capture file (.pcap or .pcapng).", too_small:"This file is too small to be a capture.", too_big:"That file is larger than 20 MB.", no_lines:"We couldn't read any log lines. Apache/Nginx “combined” or “common” format works.", read:"Couldn't read that file."},
  nv:{high:["Attack signs found","Someone may be sitting between this device and the internet."], verify:["Something to check","Nothing certain, but a few things look unusual."], low:["Looks normal","No man-in-the-middle signs in this capture."]},
  nf:{
   arp_spoof:["Fake router (ARP spoofing)", d=>`${d.ip} was first at ${d.first}, then ${d.newer} also claimed it. Traffic may now flow through that device.`, "Another device pretended to be the Wi-Fi router."],
   dns_private:["Fake address answer (DNS spoofing)", d=>`${d.name} was pointed to a device on this network (${d.ip}) instead of the real server.`, "Someone gave a fake address for a real website."],
   dns_changed:["Address suddenly changed", d=>`${d.name} got different answers: ${d.ips.join(", ")}.`, "A website's address suddenly changed."],
   bad_domain:["Look-alike website", d=>`${d.name} pretends to be ${d.brand || d.lookalikeOf || "a known brand"}. Seen in ${d.where.join(", ")}.`, d=>`A fake ${d.brand || "look-alike"} website was opened.`],
   cleartext_password:["Password sent without a lock", d=>`A “${d.field}” was sent to ${d.host || "a server"} over plain http${d.path ? " (" + d.path + ")" : ""}. Anyone on the network could read it.`, "A password was sent without a lock. Others could read it."],
   http_login:["Login without a lock", d=>`A login form was sent to ${d.host} without https.`, "A login was sent without a lock."],
   syn_flood:["Flood of connection requests", d=>`${d.perSecond} new connections in one second to ${d.target}, from ${d.sources} addresses.`, "A computer is being flooded with requests."],
   port_scan:["Port scan", d=>`${d.src} knocked on ${d.ports} different doors (ports) of ${d.dst}.`, "Someone is testing the doors of a computer."]
  },
  netDos:{high:[["wifi","Leave this Wi-Fi now"],["lock","Change your password using mobile data"],["shieldok","Turn on two-step login"]], verify:[["search","Look at the details below"],["wifi","Prefer mobile data for logins"]], low:[["check","Nothing to do"]]},
  st:{pk:"packets", sec:"seconds", names:"website names", proto:"protocols", lines:"log lines", ips:"addresses", mins:"minutes", peak:"peak / minute"},
  timeline:"What happened, step by step", namesT:"Website names seen", noneFound:"No attack signs found.",
  lv:{high:["Attack in progress","Act now. Details and next steps are below."], verify:["Unusual activity","Keep watching. Get ready to act."], low:["Normal traffic","No attack patterns in this log."]},
  lvTitle:{ddos:"Your website is under a DDoS attack", dos_single:"One address is flooding your website", csrf:"Another site forged money requests", bruteforce_success:"A password was guessed", bruteforce:"Someone is guessing passwords", injection:"Hacker attempts found", scan:"Someone is scanning your website", scanner_tool:"Hacking tool detected", traffic_rise:"Traffic is rising fast"},
  lf:{
   ddos:["DDoS (many computers flooding)", d=>`Requests jumped to ${d.peak}/min (normal ≈ ${d.base}), ${d.ratio}× higher, from ${d.uniq} addresses. ${d.errShare}% of answers were errors at the peak.`, "Thousands of fake visitors are flooding your website."],
   dos_single:["Flood from one address", d=>`${d.topIp} sent ${d.topShare}% of all requests at the peak (${d.peak}/min).`, "One computer is flooding your website."],
   traffic_rise:["Unusual rise", d=>`Traffic reached ${d.ratio}× the normal level. Not an attack yet.`, "Visitors are rising unusually fast."],
   bruteforce:["Password guessing", d=>`${d.ip} failed to log in ${d.fails} times (${d.in5min} within 5 minutes).`, "Someone keeps guessing a password."],
   bruteforce_success:["Password guessed!", d=>`${d.ip} failed ${d.fails} times, then logged in successfully. That account may be taken over.`, "Someone guessed a password and got in!"],
   scan:["Scanning for weak spots", d=>`${d.ip} looked for ${d.probeCount} secret files (${d.probes.slice(0, 3).join(", ")}) and hit ${d.n404} missing pages.`, "Someone is searching for weak spots."],
   injection:["Attack code in requests", d=>`${d.ip} sent ${d.count} requests with attack code: ${d.kinds.map(k => ({sqli:"SQL injection", xss:"XSS", traversal:"path traversal", cmdi:"command injection"})[k]).join(", ")}.`, "Someone sent attack code to your website."],
   scanner_tool:["Hacking tool detected", d=>`${d.ip} identified itself as: ${d.tools.join(", ")}.`, "Someone used a hacking tool."],
   csrf:["Forged requests from another site (CSRF)", d=>`${d.count} money/settings request(s) to ${d.paths.join(", ")} came from ${d.from}, not from ${d.site}. ${d.victims} logged-in visitor(s) were tricked; ${d.done} went through.`, "Another website made your users' browsers send money without them knowing."]
  },
  lAct:{ddos:"Turn on DDoS protection at your CDN / hosting (rate limits, challenge page). Call the provider.", dos_single:"Rate-limit or block that address at the firewall.", traffic_rise:"Watch the next minutes. Tell the provider to be ready.", bruteforce:"Block the address. Add login rate limits and CAPTCHA.", bruteforce_success:"Lock that account, reset its password, check what it did.", scan:"Remove exposed files like .env and .git. Block the scanner.", injection:"Check the app for SQLi / XSS. Use a WAF and safe database queries.", scanner_tool:"Block the address at the firewall.", csrf:"Add CSRF tokens and SameSite=Lax/Strict cookies; check Origin on money actions. Refund the victims."},
  logDos:{high:[["alert","Tell your IT team now"],["shieldok","Turn on DDoS / attack protection"]], verify:[["activity","Watch the traffic"]], low:[["check","Nothing to do"]]},
  chartT:"Requests per minute", chBase:"normal level", chWarn:"Early warning", chAlert:"Alert", chPeak:"Peak",
  chTip:(time, n, base, ratio, uniq) => `${time} · ${n} requests|normal ≈ ${base} · ${ratio}× · ${uniq} addresses`,
  early:m=>`Early warning came ${m} minute${m === 1 ? "" : "s"} before the alert.`,
  xt:{packets:"Packets", findings:"Findings", names:"Names", hosts:"Talkers", minutes:"Per minute", ips:"Top IPs", rules:"Rules", policy:"Check", evidence:"Evidence", json:"JSON"},
  xh:{no:"No.", time:"Time", src:"Source", dst:"Destination", proto:"Protocol", len:"Length", info:"Info", id:"finding", sev:"severity", mitre:"MITRE ATT&CK", pk:"packets", data:"details", name:"name", where:"seen in", verdict:"verdict", host:"host", bytes:"bytes", min:"minute", req:"requests", base:"normal", ratio:"ratio", uniq:"addresses", top:"top IP", share:"top share", s4:"4xx", s5:"5xx", level:"level", ip:"IP", n:"requests", rule:"rule", step:"step", result:"result"},
  filter:"Filter: dns, arp, http, tls, 192.168.0.66 …", pickRow:"Click a packet to see its layers and bytes.", detail:"Packet details",
  rules:[["DDoS / DoS", "requests per minute ≥ 5× the median of the previous 10 minutes (and ≥ 30) = alert; ≥ 2× = early warning. Distributed if the top address sends < 20% and there are ≥ 50 addresses."], ["Brute force", "≥ 10 failed logins (401/403 on a login path) from one address within 5 minutes. A later success = account take-over risk."], ["Scanning", "≥ 3 probes for sensitive paths (.env, .git, wp-admin …) or ≥ 20 distinct 404 pages."], ["Injection", "SQLi, XSS, path traversal and command-injection patterns in the URL (raw and decoded)."], ["Scanner tools", "User-agent names of common attack tools (sqlmap, nikto, nmap, …)."], ["ARP spoofing", "One IP address claimed by more than one hardware (MAC) address."], ["DNS spoofing", "A public name answered with a private address, or answers that change to one."], ["Cleartext secrets", "password / pin / otp fields or Basic auth over http; FTP PASS."], ["SYN flood / port scan", "≥ 100 SYNs per second to one host; ≥ 15 distinct ports from one source to one host."]],
  loginSteps:["Picked app", "Real addresses of that app", "Address you pasted", "Registrable domain", "Official match?", "Look-alike / disguise", "Lock (https)", "Result"]
 },
 bn:{
  tab:"লগইন",
  svcLbl:"১. কোন অ্যাপে লগইন করছেন?", urlLbl:"২. পেজের একদম ওপরের ঠিকানাটা পেস্ট করুন",
  urlTip:"ঠিকানা কোথায়?|ব্রাউজারের একদম ওপরে, তালার পাশে লেখাটা। ওখানে চাপ দিয়ে কপি করুন।",
  ph:"যেমন web.telegram.org", go:"এখানে পাসওয়ার্ড দেওয়া যাবে?", exLbl:"দেখুন:",
  ex:[["telegram","telegram.sth/login","নকল টেলিগ্রাম"],["telegram","https://web.telegram.org","আসল টেলিগ্রাম"],["facebook","http://www.facebook.com/login","ফেসবুক, তালা নেই"],["facebook","https://faceb00k-login.com","নকল ফেসবুক"],["google","https://accounts.google.com.verify-login.top","নকল গুগল"]],
  note:"সব ওয়েবসাইটে এটা চান? Chrome বা Edge-এর জন্য ব্রাউজার শিল্ড অ্যাড-অন নিন (নিচে)। পাসওয়ার্ড লেখার আগেই থামায়।",
  noteTip:"অ্যাড-অন কেন?|একটা ওয়েব পেজ অন্য ট্যাব দেখতে পারে না। ব্রাউজার শিল্ড পারে, তাই সব লগইন পেজ আপনার হয়ে চেক করে।",
  empty:["পাসওয়ার্ড লেখার আগে…","অ্যাপটা বাছুন, পেজের ঠিকানা পেস্ট করুন। আমরা বলে দেব এটা আসল কি না।"],
  pick:"আগে অ্যাপটা বাছুন।",
  title:{high:"পাসওয়ার্ড দেবেন না!", official_http:"দাঁড়ান। এই পেজে তালা নেই।", other_service:"এই অ্যাপের ওয়েবসাইট এটা না", official_https:s=>`হ্যাঁ, এটা আসল ${s}`, official_noscheme:s=>`এটা ${s}-এর আসল ওয়েবসাইটের নাম`},
  sub:{high:s=>`এই পেজটা ${s} না। শুধু সেজে আছে।`, official_http:"ওয়েবসাইট আসল, কিন্তু কানেকশনে তালা নেই। একই Wi-Fi-র কেউ আপনার পাসওয়ার্ড দেখে ফেলতে পারে।", other_service:(a,b)=>`আপনি বেছেছেন ${a}, কিন্তু এই পেজটা ${b}-এর।`, official_https:"নাম মিলেছে, কানেকশনেও তালা আছে। তবু কেউ OTP চাইলে কখনো দেবেন না।", official_noscheme:"নাম মিলেছে। লেখার আগে দেখুন ঠিকানা https দিয়ে শুরু, আর তালা আছে।"},
  why:{lookalike:s=>`নামটা ${s}-এর নকল, কিছু অক্ষর বদলানো।`, brand_in_host:s=>`${s}-এর নাম ব্যবহার করছে, কিন্তু সাইটটা অন্য কারও।`, not_official:s=>`এটা ${s}-এর কোনো আসল ওয়েবসাইট না।`, deceptive_subdomain:s=>`${s}-এর নাম সামনে লেখা, কিন্তু আসল মালিক শেষে লেখা।`, userinfo:"লিংকটা আসলে কোথায় যায়, লুকিয়ে রেখেছে।", ip_address:"ওয়েবসাইটের নাম নেই, শুধু নম্বর।", known_harmful:"এটা একটা চেনা স্ক্যাম সাইট।", no_tls:"তালা নেই: যা লিখবেন, পথেই কেউ পড়ে ফেলতে পারে।", official:s=>`এটা ${s}-এর আসল ওয়েবসাইট।`, check_lock:"শুধু নাম দেখে তালা (https) বোঝা যায় না। পেজে গিয়ে দেখে নিন।", other_service:(a,b)=>`এটা ${b}-এর সাইট, ${a}-এর না।`},
  dos:{high:[["x","পেজটা বন্ধ করুন"],["app",s=>`সরাসরি ${s} অ্যাপ খুলুন`],["lock","লিখে ফেলেছেন? এখনই পাসওয়ার্ড বদলান"]], verify:[["wifi","পাবলিক Wi-Fi-তে লগইন করবেন না"],["app","অ্যাপ দিয়ে ঢুকুন"]], low:[["lock","তালা দেখে তারপর লগইন"],["shieldok","টু-স্টেপ লগইন চালু করুন"]]},
  want:"আপনি চান", is:"এই পেজটা", real:"আসল ঠিকানা", lockL:"তালা", lockY:"https (তালা আছে)", lockN:"http (তালা নেই)", lockU:"দেখা যায়নি",
  labTitle:"সিকিউরিটি ল্যাব", labSub:"যারা শিখতে চান আর IT টিমের জন্য। নেটওয়ার্ক ক্যাপচার আর সার্ভার লগ খুলুন। সব এই ডিভাইসেই থাকে।",
  teaserT:"এই অংশটা IT আর সিকিউরিটির লোকদের জন্য", teaserB:"দেখতে চান? এখানেও সব সহজ ভাষায় বোঝানো আছে।", teaserBtn:"ল্যাবটা দেখাও",
  labTabs:{net:["নেটওয়ার্ক ক্যাপচার","Wi-Fi-র চালাকি ধরুন"], logs:["সার্ভার লগ","DDoS-এর আগাম সতর্কতা"]},
  netCta:"ক্যাপচার ফাইল বাছুন (.pcap / .pcapng)", netHelp:"Wireshark বা tcpdump দিয়ে সেভ করা। ২০ MB পর্যন্ত।",
  logCta:"ওয়েব সার্ভারের লগ বাছুন (.log / .txt)", logHelp:"Apache বা Nginx-এর access log। ২০ MB পর্যন্ত।",
  samplesLbl:"নমুনা:", sampleTip:"নিরাপদ ডেমো ডেটা|এই প্রজেক্টের জন্য বানানো। কোনো আসল মানুষের ডেটা নেই।",
  netEx:[["attack","ক্যাফের Wi-Fi-তে হামলা"],["normal","বাসার সাধারণ Wi-Fi"]], logEx:[["ddos","DDoS হামলা"],["attack","হ্যাকারের চেষ্টা"],["normal","সাধারণ দিন"]],
  labNote:"কোম্পানি ভার্সন (পরিকল্পনা): সার্ভারে একটা ছোট এজেন্ট লগ সাথে সাথে পড়বে, সাইট বন্ধ হওয়ার আগেই টিমকে ফোনে জানাবে।",
  netEmpty:["একটা ক্যাপচার খুলুন","অথবা ক্যাফের Wi-Fi নমুনাটা দেখুন, ম্যান-ইন-দ্য-মিডল হামলা ধাপে ধাপে ধরা পড়ে।"],
  logEmpty:["একটা সার্ভার লগ খুলুন","অথবা DDoS নমুনাটা দেখুন, আগাম সতর্কতা দেখতে পাবেন।"],
  loading:"পড়ছি…",
  err:{not_capture:"এটা প্যাকেট ক্যাপচার ফাইল না (.pcap বা .pcapng)।", too_small:"ফাইলটা ক্যাপচার হওয়ার জন্য খুব ছোট।", too_big:"ফাইলটা ২০ MB-এর বেশি।", no_lines:"কোনো লগ লাইন পড়া যায়নি। Apache/Nginx-এর “combined” বা “common” ফরম্যাট চলে।", read:"ফাইলটা পড়া যায়নি।"},
  nv:{high:["হামলার চিহ্ন পাওয়া গেছে","কেউ হয়তো এই ডিভাইস আর ইন্টারনেটের মাঝখানে বসে আছে।"], verify:["একটু দেখে নিন","নিশ্চিত কিছু না, তবে কিছু জিনিস অস্বাভাবিক।"], low:["স্বাভাবিক মনে হচ্ছে","এই ক্যাপচারে মাঝখানে বসা হামলার চিহ্ন নেই।"]},
  nf:{
   arp_spoof:["নকল রাউটার (ARP spoofing)", d=>`${d.ip} প্রথমে ছিল ${d.first}-এ, পরে ${d.newer} নিজেকে সেটা বলে দাবি করেছে। ডেটা এখন ওই ডিভাইস দিয়ে যেতে পারে।`, "অন্য একটা ডিভাইস নিজেকে Wi-Fi রাউটার বলে দাবি করেছে।"],
   dns_private:["নকল ঠিকানা (DNS spoofing)", d=>`${d.name}-কে আসল সার্ভারের বদলে এই নেটওয়ার্কের একটা ডিভাইসে (${d.ip}) পাঠানো হয়েছে।`, "কেউ একটা আসল সাইটের নকল ঠিকানা দিয়েছে।"],
   dns_changed:["ঠিকানা হঠাৎ বদলেছে", d=>`${d.name}-এর আলাদা আলাদা উত্তর: ${d.ips.join(", ")}।`, "একটা সাইটের ঠিকানা হঠাৎ বদলে গেছে।"],
   bad_domain:["একই রকম দেখতে সাইট", d=>`${d.name} নিজেকে ${d.brand || d.lookalikeOf || "চেনা ব্র্যান্ড"} সাজাচ্ছে। দেখা গেছে: ${d.where.join(", ")}।`, d=>`একটা নকল ${d.brand || ""} সাইট খোলা হয়েছে।`],
   cleartext_password:["তালা ছাড়া পাসওয়ার্ড গেছে", d=>`“${d.field}” তালা ছাড়া (http) ${d.host || "সার্ভারে"} পাঠানো হয়েছে${d.path ? " (" + d.path + ")" : ""}। নেটওয়ার্কের যে কেউ পড়তে পারত।`, "তালা ছাড়া পাসওয়ার্ড গেছে। অন্যরা পড়ে ফেলতে পারে।"],
   http_login:["তালা ছাড়া লগইন", d=>`${d.host}-এ https ছাড়া লগইন ফর্ম পাঠানো হয়েছে।`, "তালা ছাড়া লগইন পাঠানো হয়েছে।"],
   syn_flood:["কানেকশনের বন্যা", d=>`এক সেকেন্ডে ${d.target}-এ ${d.perSecond}টা নতুন কানেকশন, ${d.sources}টা ঠিকানা থেকে।`, "একটা কম্পিউটারে রিকোয়েস্টের বন্যা বইছে।"],
   port_scan:["পোর্ট স্ক্যান", d=>`${d.src} ${d.dst}-এর ${d.ports}টা আলাদা দরজায় (পোর্ট) টোকা দিয়েছে।`, "কেউ একটা কম্পিউটারের দরজাগুলো পরীক্ষা করছে।"]
  },
  netDos:{high:[["wifi","এখনই এই Wi-Fi ছাড়ুন"],["lock","মোবাইল ডেটা দিয়ে পাসওয়ার্ড বদলান"],["shieldok","টু-স্টেপ লগইন চালু করুন"]], verify:[["search","নিচের বিস্তারিত দেখুন"],["wifi","লগইনে মোবাইল ডেটা ভালো"]], low:[["check","কিছু করতে হবে না"]]},
  st:{pk:"প্যাকেট", sec:"সেকেন্ড", names:"সাইটের নাম", proto:"প্রোটোকল", lines:"লগ লাইন", ips:"ঠিকানা", mins:"মিনিট", peak:"সর্বোচ্চ / মিনিট"},
  timeline:"কী হয়েছে, ধাপে ধাপে", namesT:"যেসব সাইটের নাম দেখা গেছে", noneFound:"হামলার কোনো চিহ্ন নেই।",
  lv:{high:["হামলা চলছে","এখনই ব্যবস্থা নিন। বিস্তারিত আর করণীয় নিচে।"], verify:["অস্বাভাবিক কিছু","নজর রাখুন। ব্যবস্থা নিতে তৈরি থাকুন।"], low:["স্বাভাবিক ট্রাফিক","এই লগে হামলার কোনো প্যাটার্ন নেই।"]},
  lvTitle:{csrf:"অন্য সাইট জাল টাকার রিকোয়েস্ট পাঠিয়েছে", ddos:"আপনার ওয়েবসাইটে DDoS হামলা চলছে", dos_single:"একটা ঠিকানা আপনার সাইটে বন্যা বইয়ে দিচ্ছে", bruteforce_success:"একটা পাসওয়ার্ড অনুমান করে ফেলেছে", bruteforce:"কেউ পাসওয়ার্ড অনুমান করছে", injection:"হ্যাকারের চেষ্টা পাওয়া গেছে", scan:"কেউ আপনার সাইট স্ক্যান করছে", scanner_tool:"হ্যাকিং টুল ধরা পড়েছে", traffic_rise:"ট্রাফিক হঠাৎ বাড়ছে"},
  lf:{
   ddos:["DDoS (অনেক কম্পিউটারের বন্যা)", d=>`রিকোয়েস্ট উঠেছে মিনিটে ${d.peak}-এ (স্বাভাবিক ≈ ${d.base}), ${d.ratio} গুণ বেশি, ${d.uniq}টা ঠিকানা থেকে। সর্বোচ্চ সময়ে ${d.errShare}% উত্তর ছিল এরর।`, "হাজারো নকল ভিজিটর আপনার সাইটে বন্যা বইয়ে দিচ্ছে।"],
   dos_single:["এক ঠিকানা থেকে বন্যা", d=>`সর্বোচ্চ সময়ে ${d.topIp} একাই ${d.topShare}% রিকোয়েস্ট পাঠিয়েছে (মিনিটে ${d.peak})।`, "একটা কম্পিউটার আপনার সাইটে বন্যা বইয়ে দিচ্ছে।"],
   traffic_rise:["অস্বাভাবিক বৃদ্ধি", d=>`ট্রাফিক স্বাভাবিকের ${d.ratio} গুণ হয়েছে। এখনো হামলা না।`, "ভিজিটর অস্বাভাবিক দ্রুত বাড়ছে।"],
   bruteforce:["পাসওয়ার্ড অনুমান", d=>`${d.ip} ${d.fails} বার লগইনে ব্যর্থ হয়েছে (৫ মিনিটে ${d.in5min} বার)।`, "কেউ বারবার পাসওয়ার্ড অনুমান করছে।"],
   bruteforce_success:["পাসওয়ার্ড মিলে গেছে!", d=>`${d.ip} ${d.fails} বার ব্যর্থ হয়ে তারপর ঢুকে গেছে। অ্যাকাউন্টটা হাতছাড়া হতে পারে।`, "কেউ পাসওয়ার্ড অনুমান করে ঢুকে গেছে!"],
   scan:["দুর্বল জায়গা খোঁজা", d=>`${d.ip} ${d.probeCount}টা গোপন ফাইল খুঁজেছে (${d.probes.slice(0, 3).join(", ")}), ${d.n404}টা না-থাকা পেজে ঢুকেছে।`, "কেউ দুর্বল জায়গা খুঁজছে।"],
   injection:["রিকোয়েস্টে হামলার কোড", d=>`${d.ip} ${d.count}টা রিকোয়েস্টে হামলার কোড পাঠিয়েছে: ${d.kinds.map(k => ({sqli:"SQL injection", xss:"XSS", traversal:"path traversal", cmdi:"command injection"})[k]).join(", ")}।`, "কেউ আপনার সাইটে হামলার কোড পাঠিয়েছে।"],
   scanner_tool:["হ্যাকিং টুল ধরা পড়েছে", d=>`${d.ip} নিজের পরিচয় দিয়েছে: ${d.tools.join(", ")}।`, "কেউ হ্যাকিং টুল ব্যবহার করেছে।"],
   csrf:["অন্য সাইট থেকে জাল রিকোয়েস্ট (CSRF)", d=>`${d.paths.join(", ")}-এ ${d.count}টা টাকা/সেটিংসের রিকোয়েস্ট এসেছে ${d.from} থেকে, ${d.site} থেকে না। লগইন থাকা ${d.victims} জন ভিজিটর ধোঁকা খেয়েছে; ${d.done}টা সফল হয়েছে।`, "অন্য একটা সাইট আপনার ইউজারদের ব্রাউজার দিয়ে তাদের অজান্তে টাকা পাঠিয়েছে।"]
  },
  lAct:{ddos:"CDN / হোস্টিং-এ DDoS প্রোটেকশন চালু করুন (রেট লিমিট, চ্যালেঞ্জ পেজ)। প্রোভাইডারকে ফোন করুন।", dos_single:"ফায়ারওয়ালে ওই ঠিকানা রেট-লিমিট বা ব্লক করুন।", traffic_rise:"পরের কয়েক মিনিট নজর রাখুন। প্রোভাইডারকে তৈরি থাকতে বলুন।", bruteforce:"ঠিকানাটা ব্লক করুন। লগইনে রেট লিমিট আর CAPTCHA দিন।", bruteforce_success:"অ্যাকাউন্টটা লক করুন, পাসওয়ার্ড রিসেট করুন, কী করেছে দেখুন।", scan:".env, .git-এর মতো খোলা ফাইল সরান। স্ক্যানারকে ব্লক করুন।", injection:"অ্যাপে SQLi / XSS আছে কি না দেখুন। WAF আর নিরাপদ ডেটাবেস কোয়েরি ব্যবহার করুন।", scanner_tool:"ফায়ারওয়ালে ঠিকানাটা ব্লক করুন।", csrf:"টাকা বা সেটিংসের কাজে CSRF টোকেন আর SameSite=Lax/Strict কুকি দিন, Origin চেক করুন। ক্ষতিগ্রস্তদের টাকা ফেরত দিন।"},
  logDos:{high:[["alert","এখনই IT টিমকে জানান"],["shieldok","DDoS / হামলা প্রোটেকশন চালু করুন"]], verify:[["activity","ট্রাফিকে নজর রাখুন"]], low:[["check","কিছু করতে হবে না"]]},
  chartT:"প্রতি মিনিটে রিকোয়েস্ট", chBase:"স্বাভাবিক মাত্রা", chWarn:"আগাম সতর্কতা", chAlert:"অ্যালার্ট", chPeak:"সর্বোচ্চ",
  chTip:(time, n, base, ratio, uniq) => `${time} · ${n}টা রিকোয়েস্ট|স্বাভাবিক ≈ ${base} · ${ratio} গুণ · ${uniq}টা ঠিকানা`,
  early:m=>`অ্যালার্টের ${m} মিনিট আগেই আগাম সতর্কতা এসেছে।`,
  xt:{packets:"প্যাকেট", findings:"ফাইন্ডিং", names:"নাম", hosts:"কারা বেশি", minutes:"প্রতি মিনিট", ips:"শীর্ষ IP", rules:"নিয়ম", policy:"চেক", evidence:"প্রমাণ", json:"JSON"},
  xh:{no:"নং", time:"সময়", src:"উৎস", dst:"গন্তব্য", proto:"প্রোটোকল", len:"দৈর্ঘ্য", info:"তথ্য", id:"finding", sev:"মাত্রা", mitre:"MITRE ATT&CK", pk:"প্যাকেট", data:"বিস্তারিত", name:"নাম", where:"কোথায়", verdict:"ফলাফল", host:"হোস্ট", bytes:"বাইট", min:"মিনিট", req:"রিকোয়েস্ট", base:"স্বাভাবিক", ratio:"গুণ", uniq:"ঠিকানা", top:"শীর্ষ IP", share:"শীর্ষের ভাগ", s4:"4xx", s5:"5xx", level:"অবস্থা", ip:"IP", n:"রিকোয়েস্ট", rule:"নিয়ম", step:"ধাপ", result:"ফল"},
  filter:"ফিল্টার: dns, arp, http, tls, 192.168.0.66 …", pickRow:"লেয়ার আর বাইট দেখতে একটা প্যাকেটে চাপ দিন।", detail:"প্যাকেটের বিস্তারিত",
  rules:null,
  loginSteps:["বাছাই করা অ্যাপ", "ওই অ্যাপের আসল ঠিকানা", "আপনার পেস্ট করা ঠিকানা", "মূল ডোমেইন", "অফিশিয়াল মিল?", "নকল / ছদ্মবেশ", "তালা (https)", "ফল"]
 }
};
LB.bn.rules = LB.en.rules;
const lb = () => LB[LANG];
const SVC_STYLE = {telegram:["T","#38BDF8"], whatsapp:["W","#22C55E"], facebook:["f","#3B82F6"], google:["G","#F59E0B"], instagram:["I","#E1306C"], bkash:["b","#E2136E"], nagad:["N","#F97316"], daraz:["D","#F85606"]};
const svcName = k => REGISTRY.orgs[k] ? REGISTRY.orgs[k][LANG === "bn" ? "bn" : "en"] : k;
const fnOr = (x, ...a) => typeof x === "function" ? x(...a) : x;
let loginSvc = "telegram", loginRes = null;
let labOpen = false, labTab = "net", netRes = null, logRes = null, labBusy = false, pkSel = 0, pkFilter = "";

/* ---------- Login guard: static parts ---------- */
function applyLoginStatic(){
  const L = lb();
  $("loginPic").innerHTML = ART.loginguard;
  $("lgSvcLbl").textContent = L.svcLbl;
  $("lgSvcs").innerHTML = LOGIN_SERVICES.map(k => `<button type="button" class="lgs" data-svc="${k}" aria-pressed="${k === loginSvc}"><span class="lgav" style="--c:${SVC_STYLE[k][1]}">${SVC_STYLE[k][0]}</span>${esc(svcName(k))}</button>`).join("");
  $("lgSvcs").querySelectorAll("[data-svc]").forEach(b => b.addEventListener("click", () => { loginSvc = b.dataset.svc; $("lgSvcs").querySelectorAll("[data-svc]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); if ($("lgIn").value.trim()) runLogin(); }));
  $("lgUrlLbl").innerHTML = `${esc(L.urlLbl)} <span class="qi" tabindex="0" ${tipS(L.urlTip)}>?</span>`;
  $("lgIn").placeholder = L.ph;
  $("lgGo").innerHTML = `${ico("key")} ${esc(L.go)}`;
  $("lgEx").innerHTML = `<span class="small" style="align-self:center;font-weight:700">${esc(L.exLbl)}</span>` + L.ex.map((x, i) => `<button class="ex" type="button" data-lx="${i}"><i style="background:var(${/Fake|নকল/.test(x[2]) ? "--high" : /no lock|তালা নেই/.test(x[2]) ? "--verify" : "--low"})"></i>${esc(x[2])}</button>`).join("");
  $("lgEx").querySelectorAll("[data-lx]").forEach(b => b.addEventListener("click", () => { const x = lb().ex[+b.dataset.lx]; loginSvc = x[0]; applyLoginStatic(); $("lgIn").value = x[1]; runLogin(); }));
  if (!$("lgGo").dataset.w){ $("lgGo").dataset.w = "1"; $("lgGo").addEventListener("click", runLogin); $("lgIn").addEventListener("keydown", e => { if (e.key === "Enter") runLogin(); }); }
  $("lgNote").innerHTML = `<span tabindex="0" ${tipS(L.noteTip)} style="display:flex;gap:8px;align-items:center">${ico("info")}<span>${esc(L.note)}</span></span>`;
}
function runLogin(){
  const raw = $("lgIn").value.trim();
  if (!raw){ $("lgIn").focus(); return; }
  loginRes = loginCheck(loginSvc, raw.slice(0, 2048));
  if (loginRes.status === "complete" && loginRes.url && loginRes.url.status === "complete") logLink(loginRes.url, "login");
  if (view !== "login") setTab("login"); else renderLogin();
}
function loginTitle(r){ const L = lb(), s = svcName(r.service); return r.verdict === "high" ? [L.title.high, L.sub.high(s)] : r.code === "other_service" ? [L.title.other_service, L.sub.other_service(s, svcName(r.otherService))] : [fnOr(L.title[r.code], s), L.sub[r.code]]; }
function loginWhy(r){
  const L = lb(), s = svcName(r.service), IC = {lookalike:"eyeoff", brand_in_host:"eyeoff", not_official:"x", deceptive_subdomain:"eyeoff", userinfo:"eyeoff", ip_address:"alert", known_harmful:"stop", no_tls:"lock", official:"check", check_lock:"help", other_service:"refresh"};
  return r.reasons.map(k => [IC[k] || "info", k === "other_service" ? L.why.other_service(s, svcName(r.otherService)) : fnOr(L.why[k], s)]);
}
function loginDos(r){ const L = lb(), s = svcName(r.service); return (L.dos[r.verdict] || L.dos.low).map(d => [d[0], fnOr(d[1], s)]); }
function renderLogin(){
  const L = lb(), el = $("result"), r = loginRes;
  if (!r){ el.innerHTML = `<div class="empty"><div style="max-width:230px;margin:0 auto 10px">${ART.loginguard}</div><h3 style="margin:0 0 4px;font:800 22px var(--disp)">${esc(L.empty[0])}</h3><p class="small" style="margin:0;font-size:15px">${esc(L.empty[1])}</p></div>`; emitRendered("login"); return; }
  if (r.status !== "complete"){ el.innerHTML = `<div class="empty"><div style="max-width:200px;margin:0 auto">${ART.loginguard}</div><h3 style="margin:10px 0 4px;font:800 21px var(--disp)">${esc(tx().linkErr[r.code] || tx().linkErr.malformed)}</h3></div>`; emitRendered("login"); return; }
  const [title, sub] = loginTitle(r), why = loginWhy(r), dos = loginDos(r);
  if (getLevel() === "simple"){ el.innerHTML = simpleCard(r.verdict, why.slice(0, 2), dos.slice(0, 2), {title, sub}); wireSimple(); emitRendered("login"); return; }
  const u = r.url, ok = r.verdict === "low", lock = u.scheme === "https" ? ["lock", L.lockY, "ok"] : u.scheme === "http" ? ["alert", L.lockN, "bad"] : ["help", L.lockU, "mid"];
  const cmp = `<div class="lgcmp">
      <div class="lgbox"><small>${esc(L.want)}</small><span class="lgav big" style="--c:${SVC_STYLE[r.service][1]}">${SVC_STYLE[r.service][0]}</span><b>${esc(svcName(r.service))}</b><span class="lgreal" tabindex="0" ${tip(L.real, r.realDomains.join(" · "))}>${r.realDomains.slice(0, 3).map(d => `<code>${esc(d)}</code>`).join("")}</span></div>
      <div class="lgvs ${ok ? "ok" : r.verdict === "high" ? "bad" : "mid"}">${ico(ok ? "check" : r.verdict === "high" ? "x" : "alert")}</div>
      <div class="lgbox ${r.verdict === "high" ? "bad" : ok ? "ok" : "mid"}"><small>${esc(L.is)}</small><span class="lgav big" style="--c:${r.verdict === "high" ? "#E07A6B" : ok ? "#46B394" : "#E3A74F"}">${ico(r.verdict === "high" ? "alert" : ok ? "shieldok" : "help")}</span><b>${esc(u.hostUnicode || u.host || u.reg || "?")}</b><span class="lglock ${lock[2]}">${ico(lock[0], "width:14px;height:14px")} ${esc(lock[1])}</span></div>
    </div>`;
  el.innerHTML = `${vhead(r.verdict, title, sub)}${cmp}
    <div class="whys v-${r.verdict}">${why.map(w => `<div class="why${w[0] === "check" ? " ok" : ""}"><span class="wi">${ico(w[0])}</span><span>${esc(w[1])}</span></div>`).join("")}</div>
    <div class="dos">${dos.map(d => `<div class="do"><span class="di">${ico(d[0])}</span><b style="font-weight:700">${esc(d[1])}</b></div>`).join("")}</div>`;
  addExtras("login", r);
  emitRendered("login");
}
function expertLogin(r){
  const L = lb(), h = L.xh, u = r.url;
  const steps = [[svcName(r.service), mono(r.service)], [r.realDomains.join(", "), "registry " + REGISTRY.version], [mono(maskText(u.raw).slice(0, 120)), ""], [mono(u.reg || "–"), mono(u.hostUnicode || "")], [u.official === r.service ? "yes" : u.official ? "other: " + u.official : "no", ""], [mono((u.lookalikeOf ? "look-alike of " + u.lookalikeOf : "–") + (u.userinfo ? " · userinfo" : "") + (u.evidence.some(e => e.kind === "deceptive_subdomain") ? " · deceptive subdomain" : "")), ""], [mono(u.scheme), u.scheme === "http" ? "MITM risk (T1557)" : ""], [`<span class="xv x-${r.verdict}">${r.verdict}</span>`, mono(r.code + " · " + r.reasons.join(", "))]];
  const json = JSON.stringify({service:r.service, verdict:r.verdict, code:r.code, reasons:r.reasons, realDomains:r.realDomains, url:{raw:maskText(u.raw), reg:u.reg, host:u.host, scheme:u.scheme, official:u.official, lookalikeOf:u.lookalikeOf, category:u.category}}, null, 2);
  return xConsole("login", ["policy","evidence","json"], {policy:xTable([h.step, h.result, h.data], L.loginSteps.map((s, i) => [esc(s), steps[i][0], steps[i][1]])), evidence:evidenceTable(u.evidence), json:`<pre class="xpre">${esc(json)}</pre>`}, json);
}

/* ---------- Security Lab ---------- */
function renderLab(){
  const L = lb(), lvl = getLevel(), box = $("lab"); if (!box) return;
  $("labTitle").textContent = L.labTitle; $("labSub").textContent = L.labSub;
  const open = lvl !== "simple" || labOpen;
  $("labTeaser").hidden = open; $("labTools").hidden = !open;
  if (!open){
    $("labTeaser").innerHTML = `<div class="labteaser"><div class="ltpic">${ART.pcap}</div><div><h3>${esc(L.teaserT)}</h3><p>${esc(L.teaserB)}</p><button class="pill sky sm" type="button" id="labShow">${ico("radar","width:18px;height:18px")} ${esc(L.teaserBtn)}</button></div></div>`;
    $("labShow").addEventListener("click", () => { labOpen = true; renderLab(); });
    return;
  }
  $("labTabs").innerHTML = LAB_TABS.map(k => `<button type="button" role="tab" data-lt="${k}" aria-selected="${labTab === k}">${ico(LAB_ICON[k])}<span><b>${esc(L.labTabs[k][0])}</b><small>${esc(L.labTabs[k][1])}</small></span></button>`).join("");
  $("labTabs").querySelectorAll("[data-lt]").forEach(b => b.addEventListener("click", () => { labTab = b.dataset.lt; renderLab(); }));
  if (LAB_TEXT_TABS.includes(labTab)){ renderLabTextInput(); renderLabOut(); return; }
  const isNet = labTab === "net", ex = isNet ? L.netEx : L.logEx;
  $("labIn").innerHTML = `<label class="drop labdrop" id="labDrop"><input type="file" id="labFile" accept="${isNet ? ".pcap,.pcapng,.cap" : ".log,.txt"}"><span class="ldi">${ico(isNet ? "radar" : "server")}</span><span><b>${esc(isNet ? L.netCta : L.logCta)}</b><span class="small">${esc(isNet ? L.netHelp : L.logHelp)}</span></span></label>
    <div class="exs"><span class="small" style="align-self:center;font-weight:700">${esc(L.samplesLbl)}</span>${ex.map(x => `<button class="ex" type="button" data-ls="${x[0]}" ${tipS(L.sampleTip)}><i style="background:var(${x[0] === "normal" ? "--low" : "--high"})"></i>${esc(x[1])}</button>`).join("")}</div>
    <div class="note">${ico(isNet ? "lock" : "bell")}<span>${esc(isNet ? tx().fileNote : L.labNote)}</span></div>`;
  $("labIn").querySelectorAll("[data-ls]").forEach(b => b.addEventListener("click", () => labSample(b.dataset.ls)));
  $("labFile").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) labPicked(f); e.target.value = ""; });
  const d = $("labDrop"); ["dragenter","dragover"].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.add("over"); })); ["dragleave","drop"].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.remove("over"); }));
  d.addEventListener("drop", e => { const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) labPicked(f); });
  renderLabOut();
}
function labSample(k){
  if (LAB_TEXT_TABS.includes(labTab)){ labTextSample(k); return; }
  if (labTab === "net"){ const s = SAMPLE_PCAPS[k]; if (!s) return; netRes = Object.assign(analyzeCapture(b64bytes(s.b64)), {name:s.name}); pkSel = 0; pkFilter = ""; }
  else { logRes = Object.assign(analyzeLogs(genLogs(k)), {name:"sample_server_" + k + ".log"}); }
  renderLabOut();
}
async function labPicked(f){
  const L = lb();
  if (f.size > 20 * 1024 * 1024){ labErr("too_big"); return; }
  labBusy = true; $("labOut").innerHTML = `<div class="empty"><p>${esc(L.loading)}</p></div>`;
  try {
    if (labTab === "net"){ const buf = new Uint8Array(await f.arrayBuffer()); netRes = Object.assign(analyzeCapture(buf), {name:f.name.slice(0, 80)}); pkSel = 0; pkFilter = ""; }
    else { const txt = await f.text(); logRes = Object.assign(analyzeLogs(txt), {name:f.name.slice(0, 80)}); }
  } catch(e){ labBusy = false; labErr("read"); return; }
  labBusy = false; renderLabOut();
}
function labErr(code){ $("labOut").innerHTML = `<div class="empty"><div style="max-width:180px;margin:0 auto">${ART.pcap}</div><h3 style="margin:8px 0 0;font:800 20px var(--disp)">${esc(lb().err[code] || lb().err.read)}</h3></div>`; }
function renderLabOut(){
  if (LAB_TEXT_TABS.includes(labTab)){ renderLabTextOut(); try { document.dispatchEvent(new CustomEvent("fs:rendered", {detail:"lab"})); } catch(e){} return; }
  const L = lb(), out = $("labOut"), r = labTab === "net" ? netRes : logRes;
  if (!r){ const e = labTab === "net" ? L.netEmpty : L.logEmpty; out.innerHTML = `<div class="empty"><div style="max-width:240px;margin:0 auto 10px">${labTab === "net" ? ART.mitm : ART.ddos}</div><h3 style="margin:0 0 4px;font:800 22px var(--disp)">${esc(e[0])}</h3><p class="small" style="margin:0;font-size:15px">${esc(e[1])}</p></div>`; return; }
  if (r.status !== "complete"){ labErr(r.code); return; }
  if (labTab === "net") renderNet(r); else renderLogs(r);
  try { document.dispatchEvent(new CustomEvent("fs:rendered", {detail:"lab"})); } catch(e){}
}
function wireLabOut(ids){
  const out = $("labOut");
  out.querySelectorAll("[data-lvgo]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.lvgo)));
  out.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ids)));
}
const secs = t => (t >= 0 ? "+" : "") + t.toFixed(1) + " s";
const statTiles = arr => `<div class="lstats">${arr.map(s => `<div class="lstat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</div>`;
const FIND_ICON = {arp_spoof:"wifi", dns_private:"mappin", dns_changed:"refresh", bad_domain:"eyeoff", cleartext_password:"lock", http_login:"lock", syn_flood:"activity", port_scan:"search", ddos:"activity", dos_single:"activity", traffic_rise:"activity", bruteforce:"key", bruteforce_success:"key", scan:"search", injection:"alert", scanner_tool:"terminal", csrf:"taka"};

function renderNet(r){
  const L = lb(), lvl = getLevel(), out = $("labOut"), v = r.verdict, F = L.nf, ids = ["mitm","arp","https","wireshark"];
  if (lvl === "simple"){
    const reasons = r.findings.filter((f, i, a) => a.findIndex(x => x.id === f.id) === i).slice(0, 3).map(f => [FIND_ICON[f.id] || "alert", fnOr(F[f.id][2], f.data)]);
    out.innerHTML = simpleCard(v, reasons, L.netDos[v], {title:L.nv[v][0], sub:L.nv[v][1]});
    wireLabOut(ids); return;
  }
  const byTime = r.findings.slice().sort((a, b) => (a.at || Math.min(...a.pkts)) - (b.at || Math.min(...b.pkts)));
  const tl = byTime.length ? `<ol class="ltl">${byTime.map(f => { const p = r.packets[(f.at || Math.min(...f.pkts)) - 1]; return `<li class="s-${f.sev}"><span class="ltt">${esc(secs(p.t - r.t0))}</span><span class="lti">${ico(FIND_ICON[f.id] || "alert")}</span><div><b>${esc(F[f.id][0])}</b><p>${esc(F[f.id][1](f.data))}</p>${f.mitre ? `<span class="mitre" tabindex="0" ${tip((/^CWE/.test(f.mitre) ? "" : "MITRE ATT&CK ") + f.mitre, /^CWE/.test(f.mitre) ? "The common name for this kind of software weakness." : "A shared name security teams worldwide use for this technique.")}>${esc(f.mitre)}</span>` : ""}</div></li>`; }).join("")}</ol>` : `<p class="lnone">${ico("check")} ${esc(L.noneFound)}</p>`;
  const names = `<div class="lnames">${r.names.map(n => `<span class="rchip" style="--c:var(${n.verdict === "high" ? "--high" : n.verdict === "low" ? "--low" : "--verify"})" tabindex="0" ${tip(n.name, n.where.join(", ") + (n.official ? " · official " + n.official : ""))}><b></b>${esc(n.name)}</span>`).join("") || "–"}</div>`;
  out.innerHTML = `${vhead(v, L.nv[v][0], L.nv[v][1], `<span class="when">${ico("radar","width:15px;height:15px")}${esc(r.name)}</span>`)}
    ${statTiles([[num(r.count), L.st.pk], [num(r.duration.toFixed(1)), L.st.sec], [num(r.names.length), L.st.names], [num(Object.keys(r.protos).length), L.st.proto]])}
    <div class="lsec"><h4>${esc(L.timeline)}</h4>${tl}</div>
    <div class="lsec"><h4>${esc(L.namesT)}</h4>${names}</div>
    <div class="dos">${L.netDos[v].map(d => `<div class="do"><span class="di">${ico(d[0])}</span><b style="font-weight:700">${esc(d[1])}</b></div>`).join("")}</div>
    <div class="extras">${lessonChips(ids)}${lvl === "expert" ? netConsole(r) : ""}</div>`;
  wireLabOut(ids);
  if (lvl === "expert"){ wireConsole("pcap", "lx"); wirePackets(r); }
}
function pkRows(r){
  const f = pkFilter.trim().toLowerCase(), flagged = new Set(r.findings.flatMap(x => x.pkts));
  return r.packets.filter(p => !f || [p.proto, p.src, p.dst, p.info, String(p.no)].some(s => String(s).toLowerCase().includes(f))).slice(0, 2000)
    .map(p => `<tr data-pk="${p.no}" class="pk p-${p.proto.toLowerCase()}${flagged.has(p.no) ? " pkflag" : ""}${p.no === pkSel ? " pksel" : ""}"><td>${p.no}</td><td>${(p.t - r.t0).toFixed(3)}</td><td>${esc(p.src)}</td><td>${esc(p.dst)}</td><td>${esc(p.proto)}</td><td>${p.len}</td><td>${esc(maskSecrets(p.info))}</td></tr>`).join("");
}
const maskSecrets = s => String(s).replace(/((?:pass(?:word|wd)?|pwd|pin|otp|secret)=)[^&\s]*/gi, "$1••••");
function pkDetail(r){
  const L = lb(), p = r.packets[pkSel - 1];
  if (!p) return `<p class="xnote">${esc(L.pickRow)}</p>`;
  const rows = [["Frame", `#${p.no} · ${p.len} bytes · ${(p.t - r.t0).toFixed(6)} s`]];
  if (p.ethSrc) rows.push(["Ethernet", `${p.ethSrc} → ${p.ethDst}`]);
  if (p.arp) rows.push(["ARP", `${p.arp.op === 1 ? "request" : "reply"} · sender ${p.arp.spa} (${p.arp.sha}) · target ${p.arp.tpa} (${p.arp.tha})`]);
  if (p.layers.includes("IPv4")) rows.push(["IPv4", `${p.src} → ${p.dst} · TTL ${p.ttl}`]);
  if (p.layers.includes("TCP")) rows.push(["TCP", `${p.sport} → ${p.dport} · flags 0x${p.flags.toString(16).padStart(2, "0")}${p.payloadLen ? " · payload " + p.payloadLen + " B" : ""}`]);
  if (p.layers.includes("UDP")) rows.push(["UDP", `${p.sport} → ${p.dport}`]);
  if (p.dns) rows.push(["DNS", `${p.dns.response ? "response" : "query"} id 0x${p.dns.id.toString(16)} · ${p.dns.questions.map(q => q.name).join(", ")}${p.dns.answers.length ? " → " + p.dns.answers.map(a => a.type + " " + a.data).join(", ") : ""}`]);
  if (p.tls) rows.push(["TLS", `ClientHello · SNI ${p.tls.sni || "–"}`]);
  if (p.http) rows.push(["HTTP", p.http.kind === "request" ? `${p.http.method} ${maskSecrets(p.http.path)} · Host ${p.http.host}${p.http.body ? " · body: " + maskSecrets(p.http.body).slice(0, 160) : ""}` : `status ${p.http.status}`]);
  if (p.ftp) rows.push(["FTP", maskSecrets(p.ftp.replace(/^PASS .*/, "PASS ••••"))]);
  const hits = r.findings.filter(f => f.pkts.includes(p.no)).map(f => f.id + (f.mitre ? " (" + f.mitre + ")" : ""));
  if (hits.length) rows.push(["⚑ " + L.xh.id, hits.join(", ")]);
  return `<div class="pkd"><b>${esc(L.detail)}</b>${xTable(["layer", L.xh.data], rows.map(x => [mono(x[0]), esc(x[1])]))}${hexDump(p.data.slice(0, 256))}</div>`;
}
function netConsole(r){
  const L = lb(), h = L.xh;
  const packets = `<input class="xfilter" id="pkF" placeholder="${esc(L.filter)}" value="${esc(pkFilter)}" spellcheck="false" autocomplete="off"><div class="xtw pkt"><table class="xt"><thead><tr>${[h.no, h.time, h.src, h.dst, h.proto, h.len, h.info].map(x => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody id="pkBody">${pkRows(r)}</tbody></table></div><div id="pkDet">${pkDetail(r)}</div>`;
  const findings = xTable([h.id, h.sev, h.mitre, h.pk, h.data], r.findings.map(f => [mono(f.id), `<span class="xv x-${f.sev === "high" ? "high" : "verify"}">${f.sev}</span>`, mono(f.mitre || "–"), esc(f.pkts.join(", ")), esc(JSON.stringify(f.data).slice(0, 200))]));
  const names = xTable([h.name, h.where, h.verdict, "look-alike / official"], r.names.map(n => [mono(n.name), esc(n.where.join(", ")), `<span class="xv x-${n.verdict}">${n.category}</span>`, mono((n.lookalikeOf || "–") + " / " + (n.official || "–"))]));
  const hosts = xTable([h.host, h.bytes], r.topTalkers.map(t => [mono(t[0]), String(t[1])])) + xTable([h.proto, h.pk], Object.entries(r.protos).map(([k, n]) => [mono(k), String(n)]));
  const json = JSON.stringify({file:r.name, format:r.format, packets:r.count, duration:+r.duration.toFixed(3), protocols:r.protos, names:r.names, findings:r.findings, verdict:r.verdict}, null, 2);
  return xConsole("pcap", ["packets","findings","names","hosts","json"], {packets, findings, names, hosts, json:`<pre class="xpre">${esc(json)}</pre>`}, json, "lx");
}
function wirePackets(r){
  const body = $("pkBody"), f = $("pkF");
  const bind = () => body.querySelectorAll("[data-pk]").forEach(tr => tr.addEventListener("click", () => { pkSel = +tr.dataset.pk; body.querySelectorAll(".pksel").forEach(x => x.classList.remove("pksel")); tr.classList.add("pksel"); $("pkDet").innerHTML = pkDetail(r); }));
  bind();
  f.addEventListener("input", () => { pkFilter = f.value.slice(0, 80); body.innerHTML = pkRows(r); bind(); });
}

const hm2 = (t, tz) => new Date(t + tz * 60000).toISOString().slice(11, 16);
function logChart(r){
  const L = lb(), M = r.minutes, n = M.length, W = Math.max(n * 14, Math.min(1400, (($("labOut") && $("labOut").clientWidth) || 700) - 70), 360), H = 230, pl = 44, pr = 12, pt = 30, pb = 30;
  const max = Math.max(10, ...M.map(m => m.n)) * 1.1, x = i => pl + (i + .5) * (W - pl - pr) / n, bw = Math.max(2, (W - pl - pr) / n - 3), y = v => pt + (H - pt - pb) * (1 - v / max);
  const col = {ok:"#7DD3FC", warn:"#E3A74F", alert:"#E07A6B"};
  const bars = M.map((m, i) => `<rect x="${(x(i) - bw / 2).toFixed(1)}" y="${y(m.n).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, H - pb - y(m.n)).toFixed(1)}" rx="${Math.min(4, bw / 2)}" fill="${col[m.level]}" data-tip="${esc(L.chTip(hm2(m.t, r.tz), m.n, Math.round(m.base), m.ratio.toFixed(1), m.uniq))}" tabindex="-1"/>`).join("");
  const base = M.map((m, i) => `${i ? "L" : "M"}${(x(i) - bw / 2 - 1).toFixed(1)} ${y(m.base).toFixed(1)}H${(x(i) + bw / 2 + 1).toFixed(1)}`).join("");
  const ticks = [0, Math.round(max / 2), Math.round(max / 1.1)].map(v => `<text x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text><path d="M${pl} ${y(v)}H${W - pr}" stroke="#E2E8F0" stroke-width="1"/>`).join("");
  const step = Math.max(1, Math.ceil(n / 10)), xl = M.map((m, i) => i % step ? "" : `<text x="${x(i)}" y="${H - 10}" text-anchor="middle">${hm2(m.t, r.tz)}</text>`).join("");
  const mark = (i, c, label, row) => i < 0 ? "" : `<path d="M${x(i)} ${pt - 4}V${H - pb}" stroke="${c}" stroke-width="2" stroke-dasharray="4 4"/><text x="${Math.min(W - pr - 4, Math.max(pl + 4, x(i)))}" y="${12 + row * 12}" text-anchor="middle" fill="${c}" font-weight="800">${esc(label)}</text>`;
  const warnI = r.firstWarn >= 0 && (r.firstAlert < 0 || r.firstWarn < r.firstAlert) ? r.firstWarn : -1;
  return `<div class="lchart"><div class="lch"><b>${esc(L.chartT)}</b><span class="lleg"><i style="background:${col.ok}"></i>ok <i style="background:${col.warn}"></i>${esc(L.chWarn)} <i style="background:${col.alert}"></i>${esc(L.chAlert)} <i class="dash"></i>${esc(L.chBase)}</span></div>
    <div class="lchw"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(L.chartT)}"><g font-size="11" fill="#64748B" font-family="system-ui,sans-serif">${ticks}${xl}</g>${bars}<path d="${base}" stroke="#0369A1" stroke-width="2" fill="none" stroke-dasharray="5 4"/><g font-size="11" font-family="system-ui,sans-serif">${mark(warnI, "#B7791F", L.chWarn, 0)}${mark(r.firstAlert, "#C0504D", L.chAlert, 1)}${r.firstAlert >= 0 ? mark(r.peakI, "#A4453A", L.chPeak, 2) : ""}</g></svg></div></div>`;
}
function renderLogs(r){
  const L = lb(), lvl = getLevel(), out = $("labOut"), v = r.verdict, F = L.lf, ids = ["ddos","brute","https","mitm"];
  const main = r.findings[0], title = main ? L.lvTitle[main.id] || L.lv[v][0] : L.lv[v][0], dd = r.findings.find(f => f.id === "ddos" || f.id === "dos_single");
  if (lvl === "simple"){
    const reasons = r.findings.slice(0, 3).map(f => [FIND_ICON[f.id] || "alert", F[f.id][2]]);
    if (dd && dd.data.leadMin) reasons.push(["bell", L.early(dd.data.leadMin)]);
    out.innerHTML = simpleCard(v, reasons, L.logDos[v], {title, sub:L.lv[v][1]});
    wireLabOut(ids); return;
  }
  const list = r.findings.length ? `<div class="whys v-${v}" style="padding:0">${r.findings.map(f => `<div class="why lf s-${f.sev}"><span class="wi">${ico(FIND_ICON[f.id] || "alert")}</span><span><b>${esc(F[f.id][0])}</b><br><span class="lft">${esc(F[f.id][1](f.data))}</span><br><span class="lact">${ico("arrow","width:14px;height:14px;vertical-align:-2px")} ${esc(L.lAct[f.id])}</span></span><small tabindex="0" ${tip("MITRE ATT&CK " + f.mitre, "A shared name security teams worldwide use for this technique.")}>${esc(f.mitre)}</small></div>`).join("")}</div>` : `<p class="lnone">${ico("check")} ${esc(L.noneFound)}</p>`;
  const peak = r.minutes[r.peakI];
  out.innerHTML = `${vhead(v, title, L.lv[v][1], `<span class="when">${ico("server","width:15px;height:15px")}${esc(r.name)}</span>`)}
    ${statTiles([[num(r.parsed), L.st.lines], [num(r.uniqIps), L.st.ips], [num(r.minutes.length), L.st.mins], [num(peak ? peak.n : 0), L.st.peak]])}
    ${dd && dd.data.leadMin ? `<p class="learly">${ico("bell")} ${esc(L.early(dd.data.leadMin))}</p>` : ""}
    <div class="lsec">${logChart(r)}</div>
    <div class="lsec">${list}</div>
    <div class="extras">${lessonChips(ids)}${lvl === "expert" ? logConsole(r) : ""}</div>`;
  wireLabOut(ids);
  if (lvl === "expert") wireConsole("logs", "lx");
}
function logConsole(r){
  const L = lb(), h = L.xh;
  const minutes = xTable([h.min, h.req, h.base, h.ratio, h.uniq, h.top, h.share, h.s4, h.s5, h.level], r.minutes.map(m => [mono(hm2(m.t, r.tz)), String(m.n), String(Math.round(m.base)), m.ratio.toFixed(1) + "×", String(m.uniq), mono(m.topIp), Math.round(m.topShare * 100) + "%", String(m.s4), String(m.s5), `<span class="xv x-${m.level === "alert" ? "high" : m.level === "warn" ? "verify" : "low"}">${m.level}</span>`]));
  const findings = xTable([h.id, h.sev, h.mitre, h.data], r.findings.map(f => [mono(f.id), `<span class="xv x-${f.sev === "high" ? "high" : "verify"}">${f.sev}</span>`, mono(f.mitre), esc(JSON.stringify(f.data).slice(0, 240))]));
  const ips = xTable([h.ip, h.n], r.topIps.map(x => [mono(x[0]), String(x[1])])) + xTable(["status", h.n], Object.entries(r.statusCounts).map(([k, n]) => [mono(k), String(n)]));
  const rules = xTable([h.rule, h.data], L.rules.map(x => [esc(x[0]), esc(x[1])]));
  const json = JSON.stringify({file:r.name, lines:r.lines, parsed:r.parsed, unparsed:r.bad, uniqueIps:r.uniqIps, baselineMedian:r.globalMed, firstWarn:r.firstWarn >= 0 ? hm2(r.minutes[r.firstWarn].t, r.tz) : null, firstAlert:r.firstAlert >= 0 ? hm2(r.minutes[r.firstAlert].t, r.tz) : null, findings:r.findings, verdict:r.verdict}, null, 2);
  return xConsole("logs", ["minutes","findings","ips","rules","json"], {minutes, findings, ips, rules, json:`<pre class="xpre">${esc(json)}</pre>`}, json, "lx");
}
