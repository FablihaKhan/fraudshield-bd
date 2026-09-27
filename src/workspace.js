/* ================= Workspaces: pick who you are, get your own app =================
   Four profiles, each with its own home screen, its own tools and its own view level.
   The tools themselves are the same working parts of the page; they are moved into the
   workspace when opened and put back when the full website is shown. No account, no password:
   the choice is saved only on this device. */
const WSP = {
 en:{
  who:"Who is using FraudShield?", whoSub:"Pick one. You get only the tools you need. You can switch any time.",
  noAcc:"No account or password. Your choice stays on this device.", full:"Just show me the full website",
  go:"Start", switchP:"Switch", fullSite:"Full website", home:"Home", back:"Home", view:"View",
  hi:{everyday:"What do you want to check?", learner:"What shall we check and learn today?", builder:"Keep your website and users safe", pro:"Analysis workbench"},
  p:{
   everyday:["Everyday", "Keep me safe", ["Big, simple answers", "Only a few buttons", "Shieldy helps every step"]],
   learner:["Learner", "Teach me as I go", ["The reason behind every answer", "30-second lessons", "Password and email checks"]],
   builder:["Website & code", "I build websites or apps", ["Security grade for your site", "Code check: SQLi, XSS", "Attack alerts from server logs"]],
   pro:["Security pro", "I work in IT or security", ["Packet and log analysis", "Raw evidence, CWE, MITRE", "Copy JSON"]]
  },
  groups:{check:"Check something", learn:"Learn", everywhere:"Protect every website", site:"Your website", users:"Your users", net:"Network & servers", web:"Web", people:"People & devices", help:"Need help?"},
  t:{
   chat:["Check a message", "SMS, WhatsApp, Messenger"], link:["Check a link", "See the real website"], login:["Is this login page real?", "Before you type a password"],
   pass:["Is my password strong?", "And make a strong one"], file:["Check an app or file", "APK, PDF, any file"], qr:["Scan a QR code", "Read the link inside"],
   help:["I lost money or a code", "What to do right now"], shield:["Browser Shield", "Guards every website"], lessons:["30-second lessons", "Scams and web attacks"],
   scams:["Common scams", "Know them before they call"], page:["X-ray an email or page", "Hidden tricks, spy pixels"], headers:["Check my website", "Security grade A–F"],
   code:["Check my code", "SQL, command, XSS bugs"], logs:["Read server logs", "DDoS, guessing, CSRF"], net:["Network capture", ".pcap / .pcapng"]
  },
  pro_t:{chat:["Conversation analysis", "Stages, signals, score"], link:["URL analysis", "Parser, registry, payloads"], file:["File / APK analysis", "Magic bytes, manifest, hashes"], login:["Login page check", "Domain vs service registry"], pass:["Password policy check", "Entropy, patterns, crack time"]},
  helpT:"Act fast. Do these now:", askShieldy:"Ask Shieldy", makeRep:"Make a report", tourT:["Your home", "Every tool you need is one tap away."], tourP:["Your profile", "Tap here to switch to another profile or the full website."]
 },
 bn:{
  who:"কে FraudShield ব্যবহার করছেন?", whoSub:"একটা বাছুন। শুধু দরকারি টুলগুলো পাবেন। যেকোনো সময় বদলাতে পারবেন।",
  noAcc:"কোনো অ্যাকাউন্ট বা পাসওয়ার্ড লাগে না। আপনার পছন্দ এই ডিভাইসেই থাকে।", full:"পুরো ওয়েবসাইটটা দেখাও",
  go:"শুরু করুন", switchP:"বদলান", fullSite:"পুরো ওয়েবসাইট", home:"হোম", back:"হোম", view:"ভিউ",
  hi:{everyday:"কী চেক করতে চান?", learner:"আজ কী চেক করব আর শিখব?", builder:"আপনার ওয়েবসাইট আর ইউজারদের নিরাপদ রাখুন", pro:"অ্যানালাইসিস ওয়ার্কবেঞ্চ"},
  p:{
   everyday:["সাধারণ ব্যবহারকারী", "আমাকে নিরাপদ রাখো", ["বড়, সহজ উত্তর", "অল্প কয়েকটা বাটন", "শিল্ডি প্রতিটা ধাপে সাহায্য করে"]],
   learner:["শিখতে চাই", "চেক করতে করতে শেখাও", ["প্রতিটা উত্তরের কারণ", "৩০ সেকেন্ডের লেসন", "পাসওয়ার্ড আর ইমেইল চেক"]],
   builder:["ওয়েবসাইট ও কোড", "আমি ওয়েবসাইট বা অ্যাপ বানাই", ["সাইটের সিকিউরিটি গ্রেড", "কোড চেক: SQLi, XSS", "সার্ভার লগ থেকে হামলার সতর্কতা"]],
   pro:["সিকিউরিটি প্রো", "আমি IT বা সিকিউরিটিতে কাজ করি", ["প্যাকেট আর লগ অ্যানালাইসিস", "কাঁচা প্রমাণ, CWE, MITRE", "JSON কপি"]]
  },
  groups:{check:"কিছু চেক করুন", learn:"শিখুন", everywhere:"সব ওয়েবসাইটে সুরক্ষা", site:"আপনার ওয়েবসাইট", users:"আপনার ইউজার", net:"নেটওয়ার্ক ও সার্ভার", web:"ওয়েব", people:"মানুষ ও ডিভাইস", help:"সাহায্য লাগবে?"},
  t:{
   chat:["মেসেজ চেক করুন", "SMS, WhatsApp, Messenger"], link:["লিংক চেক করুন", "আসল ওয়েবসাইট দেখুন"], login:["এই লগইন পেজ কি আসল?", "পাসওয়ার্ড লেখার আগে"],
   pass:["আমার পাসওয়ার্ড কি শক্ত?", "আর একটা শক্ত বানান"], file:["অ্যাপ বা ফাইল চেক", "APK, PDF, যেকোনো ফাইল"], qr:["QR কোড স্ক্যান", "ভেতরের লিংক পড়ুন"],
   help:["টাকা বা কোড চলে গেছে", "এখনই কী করবেন"], shield:["ব্রাউজার শিল্ড", "সব ওয়েবসাইট পাহারা দেয়"], lessons:["৩০ সেকেন্ডের লেসন", "স্ক্যাম আর ওয়েব হামলা"],
   scams:["চেনা স্ক্যামগুলো", "ফোন আসার আগেই চিনুন"], page:["ইমেইল বা পেজের এক্স-রে", "লুকানো চালাকি, গোয়েন্দা পিক্সেল"], headers:["আমার ওয়েবসাইট চেক", "সিকিউরিটি গ্রেড A–F"],
   code:["আমার কোড চেক", "SQL, কমান্ড, XSS বাগ"], logs:["সার্ভার লগ পড়ুন", "DDoS, অনুমান, CSRF"], net:["নেটওয়ার্ক ক্যাপচার", ".pcap / .pcapng"]
  },
  pro_t:{chat:["কথোপকথন অ্যানালাইসিস", "ধাপ, সিগন্যাল, স্কোর"], link:["URL অ্যানালাইসিস", "পার্সার, রেজিস্ট্রি, পেলোড"], file:["ফাইল / APK অ্যানালাইসিস", "ম্যাজিক বাইট, ম্যানিফেস্ট, হ্যাশ"], login:["লগইন পেজ চেক", "ডোমেইন বনাম সার্ভিস রেজিস্ট্রি"], pass:["পাসওয়ার্ড পলিসি চেক", "এনট্রপি, প্যাটার্ন, ভাঙার সময়"]},
  helpT:"দেরি করবেন না। এখনই করুন:", askShieldy:"শিল্ডিকে জিজ্ঞেস করুন", makeRep:"রিপোর্ট বানান", tourT:["আপনার হোম", "দরকারি সব টুল এক চাপেই।"], tourP:["আপনার প্রোফাইল", "অন্য প্রোফাইল বা পুরো ওয়েবসাইটে যেতে এখানে চাপ দিন।"]
 }
};
const wsx = () => WSP[LANG];
// every tool: where it lives, its icon and colours
const WTOOLS = {
  chat:{kind:"check", tab:"chat", icon:"chat", g:["#38BDF8","#0369A1"]}, link:{kind:"check", tab:"link", icon:"link", g:["#A78BFA","#7C3AED"]},
  login:{kind:"check", tab:"login", icon:"key", g:["#22D3EE","#0891B2"]}, pass:{kind:"check", tab:"pass", icon:"lock", g:["#4ADE80","#16A34A"]},
  file:{kind:"check", tab:"file", icon:"package", g:["#FBBF24","#D97706"]}, qr:{kind:"check", tab:"qr", icon:"qr", g:["#F472B6","#DB2777"]},
  net:{kind:"lab", lab:"net", icon:"radar", g:["#818CF8","#4F46E5"]}, logs:{kind:"lab", lab:"logs", icon:"server", g:["#60A5FA","#1D4ED8"]},
  page:{kind:"lab", lab:"page", icon:"mail", g:["#FB923C","#EA580C"]}, headers:{kind:"lab", lab:"headers", icon:"globe", g:["#2DD4BF","#0F766E"]},
  code:{kind:"lab", lab:"code", icon:"code", g:["#94A3B8","#334155"]},
  shield:{kind:"shield", icon:"shield", g:["#38BDF8","#1D4ED8"]}, lessons:{kind:"lessons", icon:"book", g:["#FDE047","#CA8A04"]},
  scams:{kind:"scams", icon:"alert", g:["#FDA4AF","#E11D48"]}, help:{kind:"help", icon:"lifebuoy", g:["#FB7185","#BE123C"]}
};
// what each profile gets, grouped, plus its view level
const WPROF = {
  everyday:{level:"simple", fixed:true, groups:[["check", ["chat","link","login","file","qr","help"]], ["everywhere", ["shield"]]]},
  learner:{level:"learn", groups:[["check", ["chat","link","login","pass","file","page"]], ["learn", ["lessons","scams","qr"]], ["everywhere", ["shield"]]]},
  builder:{level:"learn", groups:[["site", ["headers","code","logs"]], ["users", ["page","pass","shield"]], ["learn", ["lessons"]]]},
  pro:{level:"expert", groups:[["net", ["net","logs"]], ["web", ["page","headers","code","link"]], ["people", ["chat","file","login","pass","shield"]]]}
};
const WLESSONS = {builder:["xss","sqli","cmdi","csrf","clickjack","cookies","certs","pwhash","twofa","bitb","pixel"]};
ART.pEveryday = `<svg class="ill" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="78" r="62" fill="#E0F2FE"/><circle cx="100" cy="60" r="22" fill="#FDE2C8"/><path d="M78 56c2-20 42-22 44 0-8-8-34-8-44 0Z" fill="#94A3B8"/><rect x="88" y="56" width="10" height="6" rx="3" fill="none" stroke="#0B2545" stroke-width="2"/><rect x="102" y="56" width="10" height="6" rx="3" fill="none" stroke="#0B2545" stroke-width="2"/><path d="M62 132c4-30 72-30 76 0Z" fill="#0EA5E9"/><g transform="translate(132 88)"><path d="M0-18 16-12v10c0 10-7 16-16 19-9-3-16-9-16-19v-10Z" fill="#46B394" stroke="#fff" stroke-width="3"/><path d="m-6 0 4 4 8-8" stroke="#fff" stroke-width="3" fill="none"/></g></svg>`;
ART.pLearner = `<svg class="ill" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="78" r="62" fill="#FEF9C3"/><circle cx="100" cy="64" r="20" fill="#FDE2C8"/><path d="M70 44 100 32l30 12-30 12Z" fill="#0B2545"/><path d="M84 50v10c10 6 22 6 32 0V50" fill="#0B2545"/><path d="M130 44v14" stroke="#CA8A04" stroke-width="3"/><path d="M64 132c4-30 68-30 72 0Z" fill="#FACC15"/><g transform="translate(130 96)"><rect x="-16" y="-12" width="32" height="24" rx="3" fill="#fff" stroke="#CA8A04" stroke-width="3"/><path d="M0-12v24" stroke="#CA8A04" stroke-width="3"/></g></svg>`;
ART.pBuilder = `<svg class="ill" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="78" r="62" fill="#CCFBF1"/><rect x="46" y="40" width="108" height="72" rx="10" fill="#fff" stroke="#0F766E" stroke-width="4"/><rect x="46" y="40" width="108" height="16" rx="8" fill="#0F766E"/><circle cx="56" cy="48" r="3" fill="#fff"/><circle cx="66" cy="48" r="3" fill="#fff"/><path d="m82 72-12 12 12 12M118 72l12 12-12 12M106 68l-12 32" stroke="#0F766E" stroke-width="5" fill="none" stroke-linecap="round"/><g transform="translate(150 112)"><circle r="16" fill="#2DD4BF" stroke="#fff" stroke-width="3"/><text y="7" text-anchor="middle" font-size="18" font-weight="800" font-family="sans-serif" fill="#fff">A</text></g></svg>`;
ART.pPro = `<svg class="ill" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="78" r="62" fill="#E0E7FF"/><rect x="44" y="42" width="112" height="70" rx="8" fill="#0B1B2F"/><path d="M56 60l10 8-10 8" stroke="#7DD3FC" stroke-width="4" fill="none"/><rect x="72" y="72" width="30" height="5" rx="2" fill="#B2F2BB"/><rect x="56" y="86" width="60" height="5" rx="2" fill="#7DD3FC"/><rect x="56" y="98" width="40" height="5" rx="2" fill="#E07A6B"/><rect x="84" y="112" width="32" height="10" fill="#334155"/><rect x="70" y="122" width="60" height="6" rx="3" fill="#334155"/><g transform="translate(148 50)"><circle r="18" fill="#fff" stroke="#4F46E5" stroke-width="4"/><circle r="9" fill="none" stroke="#4F46E5" stroke-width="3"/><path d="M0 0 12-12" stroke="#4F46E5" stroke-width="3"/></g></svg>`;
const PROF_ART = {everyday:"pEveryday", learner:"pLearner", builder:"pBuilder", pro:"pPro"};

const WK = {on:false, profile:null, tool:null, screen:null};
let wsRoot = null;
function wsEl(){
  if (wsRoot) return wsRoot;
  wsRoot = document.createElement("div"); wsRoot.id = "ws";
  wsRoot.innerHTML = `<div class="wsbar"><div class="wsbar-in"><button class="wslogo" type="button" id="wsLogo"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 42 9v13c0 11.5-7.7 19.6-18 23C13.7 41.6 6 33.5 6 22V9Z" fill="#fff"/><path d="m16 24 6 6 11-12" stroke="#0EA5E9" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span>FraudShield</span></button>
    <span class="wssp"></span><div class="lang" role="group" aria-label="Language"><button type="button" data-wl="en">EN</button><button type="button" data-wl="bn">বাংলা</button></div>
    <button class="wsprof" type="button" id="wsProfile" hidden></button></div></div>
    <div class="wsmain" id="wsMain"></div><div class="wsslot" id="wsSlot" hidden></div>`;
  document.body.insertBefore(wsRoot, document.body.firstChild);
  wsRoot.querySelectorAll("[data-wl]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.wl)));
  $("wsLogo").addEventListener("click", () => WK.profile ? wsHome() : wsChooser());
  $("wsProfile").addEventListener("click", wsChooser);
  return wsRoot;
}
// the moveable parts: [element id, where it goes back to]
const WPARTS = {};
function wsPark(id){ const el = $(id); if (!el || WPARTS[id]) return el; const mark = document.createComment("ws:" + id); el.parentNode.insertBefore(mark, el); WPARTS[id] = mark; return el; }
function wsReturnAll(){ Object.entries(WPARTS).forEach(([id, mark]) => { const el = $(id); if (el && mark.parentNode) mark.parentNode.insertBefore(el, mark.nextSibling); }); }
function wsBar(){
  const W = wsx(), pb = $("wsProfile");
  wsRoot.querySelectorAll("[data-wl]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.wl === LANG)));
  if (WK.profile){ const p = W.p[WK.profile]; pb.hidden = false; pb.innerHTML = `<span class="wspav">${ART[PROF_ART[WK.profile]]}</span><span><b>${esc(p[0])}</b><small>${esc(W.switchP)}</small></span>`; }
  else pb.hidden = true;
}
function wsEnter(){
  WK.on = true; document.body.classList.add("ws-on"); wsEl();
  try { document.documentElement.scrollTop = 0; } catch(e){}
}
function wsLeave(){
  WK.on = false; WK.tool = null; document.body.classList.remove("ws-on"); wsReturnAll();
  sset("fsbd-profile", "site"); if (wsRoot) wsRoot.hidden = true;
  applyStatic(); renderView(); scrollTo(0, 0);
}

/* ---------- 1. "Who is using FraudShield?" ---------- */
function wsChooser(){
  wsEnter(); wsRoot.hidden = false; WK.tool = null; WK.screen = "chooser"; wsReturnAll();
  const W = wsx(); $("wsSlot").hidden = true; $("wsMain").hidden = false; wsBar(); $("wsProfile").hidden = true;
  $("wsMain").innerHTML = `<div class="wswho"><h1>${esc(W.who)}</h1><p class="wslead">${esc(W.whoSub)}</p>
    <div class="wspgrid">${Object.keys(WPROF).map(k => { const p = W.p[k]; return `<button class="wspc wspc-${k}${WK.profile === k ? " cur" : ""}" type="button" data-prof="${k}"><span class="wspart">${ART[PROF_ART[k]]}</span><b>${esc(p[0])}</b><span class="wspq">“${esc(p[1])}”</span><ul>${p[2].map(x => `<li>${ico("check","width:15px;height:15px")}${esc(x)}</li>`).join("")}</ul><span class="pill sky sm">${esc(W.go)} ${ico("arrow","width:16px;height:16px")}</span></button>`; }).join("")}</div>
    <p class="wsnote">${ico("lock","width:16px;height:16px")} ${esc(W.noAcc)}</p>
    <button class="wsfull" type="button" id="wsFull">${esc(W.full)} ${ico("arrow","width:15px;height:15px")}</button></div>`;
  $("wsMain").querySelectorAll("[data-prof]").forEach(b => b.addEventListener("click", () => wsPick(b.dataset.prof)));
  $("wsFull").addEventListener("click", wsLeave);
  scrollTo(0, 0);
}
function wsPick(k){
  WK.profile = k; sset("fsbd-profile", k); sset("fsbd-lastprof", k);
  const lvl = WPROF[k].level; if (getLevel() !== lvl) setLevel(lvl, true);
  wsHome();
}

/* ---------- 2. each profile's home ---------- */
function wtName(k){ const W = wsx(); return (WK.profile === "pro" && W.pro_t[k]) || W.t[k]; }
function wsHome(){
  if (!WK.profile) return wsChooser();
  wsEnter(); wsRoot.hidden = false; WK.tool = null; WK.screen = "home"; sset("fsbd-profile", WK.profile); wsReturnAll();
  const W = wsx(), P = WPROF[WK.profile]; $("wsSlot").hidden = true; $("wsMain").hidden = false; wsBar();
  $("wsMain").innerHTML = `<div class="wshome wsh-${WK.profile}"><div class="wshead"><span class="wshart">${ART[PROF_ART[WK.profile]]}</span><div><small>${esc(W.p[WK.profile][0])}</small><h1>${esc(W.hi[WK.profile])}</h1></div></div>
    ${P.groups.map(([g, list]) => `<section class="wsgrp"><h2>${esc(W.groups[g])}</h2><div class="wstiles ${list.length <= 1 ? "one" : ""}" id="${g === P.groups[0][0] ? "wsTiles" : ""}">${list.map(k => { const t = WTOOLS[k], n = wtName(k); return `<button class="wst${k === "help" ? " red" : ""}" type="button" data-tool="${k}" style="--g:linear-gradient(135deg,${t.g[0]},${t.g[1]});--c:${t.g[1]}"><span class="wsi">${ico(t.icon)}</span><span class="wstx"><b>${esc(n[0])}</b><small>${esc(n[1])}</small></span></button>`; }).join("")}</div></section>`).join("")}</div>`;
  $("wsMain").querySelectorAll("[data-tool]").forEach(b => b.addEventListener("click", () => wsOpen(b.dataset.tool)));
  scrollTo(0, 0); emitRendered("wshome");
}

/* ---------- 3. one tool, alone on its screen ---------- */
function wsToolHead(k){
  const W = wsx(), t = WTOOLS[k], n = wtName(k), P = WPROF[WK.profile] || {};
  const lv3 = `<div class="wsview${P.fixed ? " fx" : ""}" data-lv="${getLevel()}" role="radiogroup" aria-label="${esc(W.view)}"><span>${esc(W.view)}</span>${["simple","learn","expert"].map(x => `<button type="button" data-wv="${x}" aria-pressed="${getLevel() === x}">${esc(lv().levels[x][0])}</button>`).join("")}</div>`;
  return `<div class="wsth"><button class="wsback" type="button" id="wsBack">${ico("left","width:18px;height:18px")} ${esc(W.back)}</button><span class="wsti" style="--g:linear-gradient(135deg,${t.g[0]},${t.g[1]})">${ico(t.icon)}</span><div class="wsttx"><h1>${esc(n[0])}</h1><small>${esc(n[1])}</small></div>${lv3}</div>`;
}
let wsInOpen = false;
function wsOpen(k){
  const t = WTOOLS[k]; if (!t) return;
  if (!WK.profile){ WK.profile = sget("fsbd-profile", "") in WPROF ? sget("fsbd-profile", "") : "everyday"; }
  wsEnter(); wsRoot.hidden = false; wsReturnAll(); WK.tool = k; WK.screen = "tool"; wsInOpen = true;
  const slot = $("wsSlot"); $("wsMain").hidden = true; slot.hidden = false; wsBar();
  slot.innerHTML = `<div class="wstool">${wsToolHead(k)}<div class="wsbody" id="wsBody"></div></div>`;
  const body = $("wsBody");
  if (t.kind === "check"){ body.appendChild(wsPark("checkApp")); body.appendChild(wsPark("report")); _wsSetTab(t.tab); }
  else if (t.kind === "lab"){ labOpen = true; labTab = t.lab; body.appendChild(wsPark("labTools")); _wsRenderLab(); }
  else if (t.kind === "shield"){ renderShield(); body.appendChild(wsPark("shBody")); }
  else if (t.kind === "scams"){ body.appendChild(wsPark("scamCards")); }
  else if (t.kind === "lessons") wsLessons(body);
  else if (t.kind === "help") wsHelp(body);
  $("wsBack").addEventListener("click", wsHome);
  slot.querySelectorAll("[data-wv]").forEach(b => b.addEventListener("click", () => { setLevel(b.dataset.wv, true); slot.querySelectorAll("[data-wv]").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.wv === getLevel()))); }));
  wsInOpen = false; scrollTo(0, 0); emitRendered("wstool");
}
function wsLessons(body){
  const L = lv().lessons, ids = WLESSONS[WK.profile] || Object.keys(L);
  body.innerHTML = `<div class="wsless">${ids.filter(id => L[id]).map(id => `<button class="wsl" type="button" data-wl2="${id}"><span class="wslart">${ART[L[id][2]] || ART.hero1 || ""}</span><b>${esc(L[id][0])}</b></button>`).join("")}</div>`;
  body.querySelectorAll("[data-wl2]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.wl2, ids)));
}
function wsHelp(body){
  const a = at(), W = wsx();
  body.innerHTML = `<div class="wshelp"><h2>${esc(W.helpT)}</h2><ol>${a.lost.map(x => `<li>${x}</li>`).join("")}</ol><div class="bar" style="padding:8px 0 0"><button class="pill sky" type="button" id="wsAsk">${ico("chat","width:18px;height:18px")} ${esc(W.askShieldy)}</button><button class="pill ghost" type="button" id="wsRep">${ico("file","width:18px;height:18px")} ${esc(W.makeRep)}</button></div></div>`;
  $("wsAsk").addEventListener("click", () => assistantOpen("lost"));
  $("wsRep").addEventListener("click", () => { assistantOpen(); reportFlow(); });
}

const _wsSetLevel = setLevel;
setLevel = function(v, quiet){ const r = _wsSetLevel(v, quiet); document.querySelectorAll(".wsview").forEach(w => { w.dataset.lv = getLevel(); w.querySelectorAll("[data-wv]").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.wv === getLevel()))); }); return r; };

/* ---------- 4. keep Shieldy and the old buttons working inside workspaces ---------- */
const _wsSetTab = setTab, _wsRenderLab = renderLab, _wsTryFeature = tryFeature;
setTab = function(which){ if (WK.on && !wsInOpen && WK.tool !== which && WTOOLS[which] && WTOOLS[which].kind === "check") return wsOpen(which); return _wsSetTab(which); };
tryFeature = function(what){
  if (WK.on){
    const k = String(what).replace(/^sv_/, ""), map = {chat:"chat", link:"link", login:"login", pass:"pass", file:"file", qr:"qr", shield:"shield", help:"help", lab:labTab || "net"};
    if (map[k] && WK.tool !== map[k]) wsOpen(map[k]);
    if (k === "help" || k === "shield") return;
  }
  return _wsTryFeature(what);
};
function wsFocusLab(tab){ if (WK.on && WK.tool !== tab && WTOOLS[tab]) wsOpen(tab); }
document.addEventListener("fs:lang", () => { if (!WK.on || wsRoot.hidden) return; if (WK.screen === "tool" && WK.tool) wsOpen(WK.tool); else if (WK.screen === "home" && WK.profile) wsHome(); else wsChooser(); });
Object.assign(AS.en.g, {wsTiles:WSP.en.tourT, wsProfile:WSP.en.tourP}); Object.assign(AS.bn.g, {wsTiles:WSP.bn.tourT, wsProfile:WSP.bn.tourP});
GUIDES.wsTour = [{sel:"#wsTiles", g:"wsTiles", before:() => wsHome()}, {sel:"#wsProfile", g:"wsProfile"}, {sel:".as-launch", g:"me"}];

function wsNavBtn(){ const b = $("navApp"); if (!b) return; b.innerHTML = `${ico("users","width:16px;height:16px")}<span> ${esc(LANG === "bn" ? "আমার অ্যাপ" : "My app")}</span>`; b.setAttribute("aria-label", LANG === "bn" ? "আমার অ্যাপ" : "My app"); if (!b.dataset.w){ b.dataset.w = "1"; b.addEventListener("click", () => { const s = sget("fsbd-lastprof", ""); if (WPROF[s]){ WK.profile = s; wsHome(); } else wsChooser(); }); } }
wsNavBtn(); document.addEventListener("fs:lang", wsNavBtn);

/* ---------- 5. start: deep links keep the full website; otherwise open the chooser or the saved profile ---------- */
(function wsStart(){
  if (/^#(en|bn)_|^#slide/.test(location.hash || "")) return;   // demo links and tests show the full website
  const saved = sget("fsbd-profile", "");
  if (saved === "site") return;
  if (location.hash === "#app" || !saved){ wsChooser(); return; }
  if (WPROF[saved]){ WK.profile = saved; if (getLevel() !== WPROF[saved].level && WPROF[saved].fixed) setLevel("simple", true); wsHome(); }
  else wsChooser();
})();
