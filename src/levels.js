/* ================= Three viewing levels: Easy (zero knowledge) · Learn (why + mini lessons) · Expert (analysis console) ================= */
let LEVEL = null;
function getLevel(){ if (LEVEL === null){ const v = sget("fsbd-level", "simple"); LEVEL = ["simple","learn","expert"].includes(v) ? v : "simple"; } return LEVEL; }
function setLevel(v, quiet){
  if (!["simple","learn","expert"].includes(v)) return;
  LEVEL = v; sset("fsbd-level", v);
  if (v === "expert"){ detOpen.s = true; linkDetOpen = true; fileDetOpen = true; }
  document.body.classList.remove("lv-simple","lv-learn","lv-expert"); document.body.classList.add("lv-" + v);
  renderLevels(); renderView(); renderLab();
  if (!quiet) toast(lv().levelToast[v]);
}
const lv = () => LV[LANG];
const LV = {
 en:{
  levelTitle:"How much do you want to see?",
  levels:{simple:["Easy","Just tell me what to do"], learn:["Learn","Show me why"], expert:["Expert","Show me everything"]},
  levelToast:{simple:"Easy view: just the answer and what to do.", learn:"Learn view: reasons and 30-second lessons.", expert:"Expert view: full analysis console."},
  simpleTitle:{high:"Stop!", verify:"Be careful", low:"Nothing scary found", abstain:"Tell me more"},
  simpleSub:{high:"This looks like a scam.", verify:"Something is not right. Check before you do anything.", low:"We found nothing dangerous so far.", abstain:"Paste more of the chat so we can understand."},
  whyTitle:"Why?", doTitle:"What to do", moreBtn:"Show me why", reportBtn:"Make a report",
  plainChat:{credential:"They are asking for your secret code (PIN or OTP).", money:"They are asking you to send money.", install:"They want you to install an app.", link:"They want you to open a link.", identity:"They pretend to be someone else, like an office or a relative.", urgency:"They are rushing you or scaring you.", lure:"They promise a prize or easy money.", secrecy:"They tell you to keep it secret.", wrong:"They say they sent money by mistake. This is often a lie.", manip:"The message hides a trick.", ident:"They ask for your NID or card number.", none:"Nobody asked for your code, money or a link."},
  plainLink:{known:"This is a known scam link.", lookalike:b=>`This is not the real ${b} website. It only looks like it.`, brand:b=>`This website is not ${b}'s, even though it uses the name.`, userinfo:"This link hides where it really goes.", priv:"This is not a real website address.", ip:"This link has no website name, only numbers.", short:"This link is shortened, so the real address is hidden.", notls:"This website has no lock, so others may see what you type.", official:b=>`This is the real ${b} website. Opening the app is still safer.`, trusted:"You marked this website as trusted.", unknown:"We don't know this website. Don't type your PIN or password there.", scheme:"This kind of link can run hidden code."},
  plainFile:{known:"This is a known bad file.", disguised:(n,k)=>`It says it is a ${n} file, but it is really ${k}.`, fake:b=>`This is not the real ${b} app. It is fake.`, perms:"This app could read your messages and secret codes.", apk:"Apps sent in a chat can be dangerous.", run:"This file can run programs.", ok:"It looks like a normal file."},
  kindPlain:{apk:"an app", exe:"a program", elf:"a program", dex:"app code", script:"a program", html:"a web page", ole:"an old Office file", ooxml:"an Office file", zip:"a zip file", pdf:"a PDF", image:"a picture", text:"a text file", unknown:"an unknown file"},
  doDelete:"Delete the message", doStore:"Get apps from Play Store only",
  lessonsLbl:"Learn in 30 seconds:", lessonNext:"Next lesson", lessonOk:"Got it",
  lessons:{
   https:["The lock (https)", ["https means the connection is locked. People on the same Wi-Fi can't read what you type.", "http (without s) means no lock. Someone nearby could read it.", "A lock only means private, not honest. Scam sites can have a lock too."], "lockbar"],
   domain:["The real website name", ["Look at the part just before .com or .com.bd. That shows the real owner.", "bkash.com.fake-login.top belongs to fake-login.top, not to bKash.", "Anything written before it can be made up."], "addrbar"],
   lookalike:["Look-alike letters", ["Some letters from other alphabets look exactly like English ones.", "bkаsh.com with a Russian “а” is a different website.", "We show the real code name (xn--…) so you can see the trick."], "hero2"],
   otp:["PIN and OTP", ["Your PIN is like the key to your house.", "An OTP is a one-time key sent to you by SMS.", "No real company ever asks for them. Anyone who asks is a thief."], "hero3"],
   apk:["Apps from a chat (APK)", ["An APK is an app file. Apps from a chat skip Play Store's safety checks.", "Fake apps ask for scary powers, like reading your SMS.", "Install apps only from Play Store."], "apk"],
   perms:["App permissions", ["Permissions are powers you give an app.", "“Read SMS” means it can read your OTP.", "“Accessibility” lets it tap your screen for you. Never allow it for unknown apps."], "fakeapp"],
   stages:["How a scam unfolds", ["Hook: they grab your attention with a problem or a prize.", "Trust and pressure: they pretend to be official and rush you.", "The ask: a code, money, an app or a link. Stop right here!"], "hero1"],
   dns:["DNS, the internet's phone book", ["DNS turns a website name into a number address.", "It tells us if a name exists and where it points.", "It cannot tell whether a website is honest."], "net"],
   hash:["File fingerprint (hash)", ["Every file has a unique fingerprint made of letters and numbers.", "If the fingerprint matches a known bad file, it is that exact file.", "A fingerprint we don't know doesn't prove the file is safe."], "filedrop"],
   mitm:["Man-in-the-middle", ["A thief sits between you and the website, like someone secretly opening your letters in the post.", "On public Wi-Fi they can pretend to be the router and send you to a fake login page, like telegram.sth instead of telegram.org.", "Before typing a password, check the real website name and the lock. When unsure, use mobile data."], "mitm"],
   arp:["Fake router (ARP)", ["On Wi-Fi, phones ask “who is the router?” and believe the answer.", "An attacker can shout “I am the router!” so your traffic passes through them.", "Two different answers for the same router is a danger sign. The Lab spots it."], "mitm"],
   ddos:["DDoS attack", ["Many hacked computers visit one website at the same time.", "The site gets so busy that real customers can't use it.", "Early warning: traffic jumps far above the normal level, often minutes before the crash."], "ddos"],
   brute:["Password guessing", ["A robot tries thousands of passwords, one after another.", "Many “wrong password” lines from one address give it away.", "Long passwords, login limits and two-step login stop it."], "loginguard"],
   wireshark:["Packets and Wireshark", ["Everything on the internet travels in small parcels called packets.", "Tools like Wireshark save them in a capture file (.pcap).", "Each row is one packet: who sent it, to whom, and what kind. Our Lab explains each one."], "pcap"]
  },
  xTitle:"Analysis console", xSub:"Raw evidence for analysts. Everything here was computed on this device.", copyJson:"Copy JSON", copied:"Copied",
  xt:{signals:"Signals", norm:"Normalizer", engine:"Engine", evidence:"Evidence", json:"JSON", url:"URL", policy:"Policy", dns:"DNS", hex:"Header", zip:"ZIP", manifest:"Manifest"},
  xh:{turn:"turn", who:"who", text:"text (masked)", stages:"stages", sig:"signals (weight)", z:"z", score:"score", verdict:"verdict", orig:"original (masked)", norm:"normalised", zw:"zero-width", field:"field", value:"value", kind:"kind", state:"state", source:"source", conf:"confidence", finding:"finding", prov:"provenance", rule:"rule", hit:"match", name:"entry", method:"method", comp:"compressed", size:"size", tag:"tag", attrs:"attributes", offset:"offset", hexb:"hex", ascii:"ascii", weight:"weight", family:"family", msg:"msg"},
  xNoDns:"Not queried. Use Learn view → Details → Check online (asks for consent first).",
  xPolicy:["on demo blocklist", "strong disguise (hidden @, private IP, look-alike, fake subdomain, brand on foreign domain)", "official registry match", "on user's trusted list", "otherwise unknown"],
  xNone:"none"
 },
 bn:{
  levelTitle:"কতটুকু দেখতে চান?",
  levels:{simple:["সহজ","শুধু বলো কী করব"], learn:["শিখি","কেন, সেটাও দেখাও"], expert:["এক্সপার্ট","সব ডেটা দেখাও"]},
  levelToast:{simple:"সহজ ভিউ: শুধু উত্তর আর কী করবেন।", learn:"শেখার ভিউ: কারণ আর ৩০ সেকেন্ডের পাঠ।", expert:"এক্সপার্ট ভিউ: পুরো অ্যানালাইসিস কনসোল।"},
  simpleTitle:{high:"থামুন!", verify:"সাবধান", low:"ভয়ের কিছু পাইনি", abstain:"আরও বলুন"},
  simpleSub:{high:"এটা স্ক্যাম মনে হচ্ছে।", verify:"কিছু একটা ঠিক নেই। কিছু করার আগে যাচাই করুন।", low:"এখন পর্যন্ত বিপদের কিছু পাইনি।", abstain:"আরও চ্যাট পেস্ট করুন, তাহলে বুঝতে পারব।"},
  whyTitle:"কেন?", doTitle:"কী করবেন", moreBtn:"কেন, দেখাও", reportBtn:"রিপোর্ট বানাও",
  plainChat:{credential:"ওরা আপনার গোপন কোড (পিন বা OTP) চাইছে।", money:"ওরা আপনার কাছে টাকা চাইছে।", install:"ওরা একটা অ্যাপ ইনস্টল করাতে চাইছে।", link:"ওরা একটা লিংকে ঢুকতে বলছে।", identity:"ওরা অন্য কেউ সাজছে, যেমন অফিসের লোক বা আত্মীয়।", urgency:"ওরা তাড়া দিচ্ছে বা ভয় দেখাচ্ছে।", lure:"ওরা পুরস্কার বা সহজ টাকার লোভ দেখাচ্ছে।", secrecy:"ওরা কাউকে বলতে মানা করছে।", wrong:"ওরা বলছে ভুল করে টাকা পাঠিয়েছে। এটা প্রায়ই মিথ্যা।", manip:"মেসেজের ভেতরে একটা চালাকি লুকানো আছে।", ident:"ওরা আপনার NID বা কার্ড নম্বর চাইছে।", none:"কেউ কোড, টাকা বা লিংক চায়নি।"},
  plainLink:{known:"এটা একটা চেনা স্ক্যাম লিংক।", lookalike:b=>`এটা আসল ${b}-এর ওয়েবসাইট না। শুধু দেখতে একই রকম।`, brand:b=>`নাম ব্যবহার করলেও এই ওয়েবসাইট ${b}-এর না।`, userinfo:"লিংকটা আসলে কোথায় যায়, সেটা লুকিয়ে রেখেছে।", priv:"এটা কোনো আসল ওয়েবসাইটের ঠিকানা না।", ip:"এই লিংকে ওয়েবসাইটের নাম নেই, শুধু নম্বর।", short:"লিংকটা ছোট করা, তাই আসল ঠিকানা লুকানো।", notls:"এই সাইটে তালা নেই, তাই যা লিখবেন অন্যরা দেখে ফেলতে পারে।", official:b=>`এটা আসল ${b}-এর ওয়েবসাইট। তবু অ্যাপ থেকে খোলা বেশি নিরাপদ।`, trusted:"আপনি এই সাইটটাকে ভরসার লিস্টে রেখেছেন।", unknown:"এই সাইটটা আমরা চিনি না। এখানে পিন বা পাসওয়ার্ড দেবেন না।", scheme:"এমন লিংক লুকিয়ে কোড চালাতে পারে।"},
  plainFile:{known:"এটা একটা চেনা খারাপ ফাইল।", disguised:(n,k)=>`নিজেকে ${n} ফাইল বলছে, কিন্তু আসলে এটা ${k}।`, fake:b=>`এটা আসল ${b} অ্যাপ না। এটা নকল।`, perms:"এই অ্যাপ আপনার মেসেজ আর গোপন কোড পড়তে পারে।", apk:"চ্যাটে পাঠানো অ্যাপ বিপজ্জনক হতে পারে।", run:"এই ফাইল প্রোগ্রাম চালাতে পারে।", ok:"সাধারণ ফাইল মনে হচ্ছে।"},
  kindPlain:{apk:"একটা অ্যাপ", exe:"একটা প্রোগ্রাম", elf:"একটা প্রোগ্রাম", dex:"অ্যাপের কোড", script:"একটা প্রোগ্রাম", html:"একটা ওয়েব পেজ", ole:"পুরনো Office ফাইল", ooxml:"Office ফাইল", zip:"একটা zip ফাইল", pdf:"একটা PDF", image:"একটা ছবি", text:"লেখার ফাইল", unknown:"অজানা ফাইল"},
  doDelete:"মেসেজটা ডিলিট করুন", doStore:"অ্যাপ শুধু Play Store থেকে",
  lessonsLbl:"৩০ সেকেন্ডে শিখুন:", lessonNext:"পরের পাঠ", lessonOk:"বুঝেছি",
  lessons:{
   https:["তালা (https)", ["https মানে কানেকশনে তালা দেওয়া। একই Wi-Fi-তে থাকা কেউ আপনার লেখা পড়তে পারবে না।", "http (s ছাড়া) মানে তালা নেই। পাশের কেউ পড়ে ফেলতে পারে।", "তালা মানে শুধু গোপন, সৎ না। স্ক্যাম সাইটেও তালা থাকতে পারে।"], "lockbar"],
   domain:["আসল ওয়েবসাইটের নাম", [".com বা .com.bd-এর ঠিক আগের অংশটা দেখুন। ওটাই আসল মালিক।", "bkash.com.fake-login.top আসলে fake-login.top-এর, বিকাশের না।", "তার আগে যা লেখা থাকে, সেটা বানানো হতে পারে।"], "addrbar"],
   lookalike:["একই রকম দেখতে অক্ষর", ["অন্য ভাষার কিছু অক্ষর দেখতে হুবহু ইংরেজির মতো।", "রাশিয়ান “а” দিয়ে লেখা bkаsh.com একটা আলাদা ওয়েবসাইট।", "আমরা আসল কোড নাম (xn--…) দেখাই, যাতে চালাকিটা ধরা যায়।"], "hero2"],
   otp:["পিন আর OTP", ["পিন হলো আপনার ঘরের চাবির মতো।", "OTP হলো SMS-এ আসা একবারের চাবি।", "কোনো আসল কোম্পানি এগুলো চায় না। যে চায়, সে চোর।"], "hero3"],
   apk:["চ্যাটে আসা অ্যাপ (APK)", ["APK মানে অ্যাপের ফাইল। চ্যাটে আসা অ্যাপ Play Store-এর সেফটি চেক পার হয় না।", "নকল অ্যাপ ভয়ংকর ক্ষমতা চায়, যেমন আপনার SMS পড়া।", "অ্যাপ শুধু Play Store থেকে ইনস্টল করুন।"], "apk"],
   perms:["অ্যাপের পারমিশন", ["পারমিশন মানে অ্যাপকে দেওয়া ক্ষমতা।", "“SMS পড়া” মানে ও আপনার OTP পড়তে পারবে।", "“Accessibility” দিলে ও আপনার হয়ে স্ক্রিনে চাপ দিতে পারে। অচেনা অ্যাপকে কখনো দেবেন না।"], "fakeapp"],
   stages:["স্ক্যাম কীভাবে এগোয়", ["টোপ: সমস্যা বা পুরস্কারের কথা বলে মনোযোগ টানে।", "ভরসা আর চাপ: অফিসের লোক সেজে তাড়া দেয়।", "আসল চাওয়া: কোড, টাকা, অ্যাপ বা লিংক। ঠিক এখানেই থামুন!"], "hero1"],
   dns:["DNS, ইন্টারনেটের ফোনবুক", ["DNS ওয়েবসাইটের নামকে নম্বরের ঠিকানায় বদলায়।", "এতে জানা যায় নামটা আছে কি না, কোথায় যায়।", "সাইটটা সৎ কি না, DNS বলতে পারে না।"], "net"],
   hash:["ফাইলের ফিঙ্গারপ্রিন্ট (hash)", ["প্রতিটা ফাইলের অক্ষর আর নম্বরের একটা আলাদা ফিঙ্গারপ্রিন্ট আছে।", "চেনা খারাপ ফাইলের সাথে মিললে, এটা হুবহু সেই ফাইল।", "অচেনা ফিঙ্গারপ্রিন্ট মানেই ফাইল নিরাপদ না।"], "filedrop"],
   mitm:["মাঝখানে বসা চোর (Man-in-the-middle)", ["চোর আপনার আর ওয়েবসাইটের মাঝখানে বসে থাকে, যেন ডাকে পাঠানো চিঠি লুকিয়ে খুলে পড়ছে।", "পাবলিক Wi-Fi-তে সে নিজেকে রাউটার সাজিয়ে আপনাকে নকল লগইন পেজে পাঠাতে পারে, যেমন telegram.org-এর বদলে telegram.sth।", "পাসওয়ার্ড দেওয়ার আগে আসল সাইটের নাম আর তালা দেখুন। সন্দেহ হলে মোবাইল ডেটা ব্যবহার করুন।"], "mitm"],
   arp:["নকল রাউটার (ARP)", ["Wi-Fi-তে ফোন জিজ্ঞেস করে “রাউটার কে?”, আর উত্তরটা বিশ্বাস করে।", "হামলাকারী চেঁচিয়ে বলতে পারে “আমিই রাউটার!”, তখন আপনার ডেটা তার ভেতর দিয়ে যায়।", "একই রাউটারের দুইটা আলাদা উত্তর মানে বিপদ। ল্যাব এটা ধরে ফেলে।"], "mitm"],
   ddos:["DDoS হামলা", ["অনেকগুলো হ্যাক করা কম্পিউটার একসাথে একটা সাইটে ঢোকে।", "সাইট এত ব্যস্ত হয়ে যায় যে আসল কাস্টমাররা ঢুকতে পারে না।", "আগাম সতর্কতা: ট্রাফিক স্বাভাবিকের চেয়ে অনেক বেড়ে যায়, প্রায়ই সাইট বন্ধের কয়েক মিনিট আগে।"], "ddos"],
   brute:["পাসওয়ার্ড অনুমান", ["একটা রোবট একের পর এক হাজারো পাসওয়ার্ড চেষ্টা করে।", "এক ঠিকানা থেকে অনেক “ভুল পাসওয়ার্ড” লাইন দেখলেই ধরা যায়।", "লম্বা পাসওয়ার্ড, লগইন লিমিট আর টু-স্টেপ লগইন এটা থামায়।"], "loginguard"],
   wireshark:["প্যাকেট আর Wireshark", ["ইন্টারনেটে সবকিছু ছোট ছোট পার্সেলে যায়, এগুলোকে প্যাকেট বলে।", "Wireshark-এর মতো টুল এগুলো একটা ক্যাপচার ফাইলে (.pcap) সেভ করে।", "প্রতিটা লাইন একটা প্যাকেট: কে পাঠাল, কাকে, আর কী ধরনের। আমাদের ল্যাব প্রতিটা বুঝিয়ে দেয়।"], "pcap"]
  },
  xTitle:"অ্যানালাইসিস কনসোল", xSub:"অ্যানালিস্টদের জন্য কাঁচা প্রমাণ। সব এই ফোনেই হিসাব হয়েছে।", copyJson:"JSON কপি", copied:"কপি হয়েছে",
  xt:{signals:"সিগন্যাল", norm:"নর্মালাইজার", engine:"ইঞ্জিন", evidence:"প্রমাণ", json:"JSON", url:"URL", policy:"পলিসি", dns:"DNS", hex:"হেডার", zip:"ZIP", manifest:"ম্যানিফেস্ট"},
  xh:{turn:"turn", who:"who", text:"text (masked)", stages:"stages", sig:"signals (weight)", z:"z", score:"score", verdict:"verdict", orig:"original (masked)", norm:"normalised", zw:"zero-width", field:"field", value:"value", kind:"kind", state:"state", source:"source", conf:"confidence", finding:"finding", prov:"provenance", rule:"rule", hit:"match", name:"entry", method:"method", comp:"compressed", size:"size", tag:"tag", attrs:"attributes", offset:"offset", hexb:"hex", ascii:"ascii", weight:"weight", family:"family", msg:"msg"},
  xNoDns:"কোয়েরি করা হয়নি। শিখি ভিউ → বিস্তারিত → অনলাইনে চেক (আগে অনুমতি চায়)।",
  xPolicy:["ডেমো ব্লকলিস্টে আছে", "জোরালো ছদ্মবেশ (লুকানো @, প্রাইভেট IP, একই রকম অক্ষর, নকল সাবডোমেইন, অন্যের ডোমেইনে ব্র্যান্ড)", "অফিশিয়াল রেজিস্ট্রির সাথে মিল", "ইউজারের ভরসার লিস্টে", "নইলে অচেনা"],
  xNone:"নেই"
 }
};

/* ---------- level switch ---------- */
function renderLevels(){
  const box = $("levels"); if (!box) return;
  const l = lv(), cur = getLevel(), IC = {simple:"sprout", learn:"book", expert:"terminal"};
  box.innerHTML = `<span class="lvt">${esc(l.levelTitle)}</span><div class="lvbtns" role="radiogroup" aria-label="${esc(l.levelTitle)}">${["simple","learn","expert"].map(k => `<button type="button" role="radio" class="lvb lv-${k}" data-level="${k}" aria-checked="${k === cur}"><span class="lvi">${ico(IC[k])}</span><span class="lvl"><b>${esc(l.levels[k][0])}</b><small>${esc(l.levels[k][1])}</small></span></button>`).join("")}</div>`;
  box.querySelectorAll("[data-level]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.level)));
}

/* ---------- Easy view ---------- */
function bigSign(v){
  const c = RING[v] || RING.abstain;
  const mark = v === "high" ? '<path d="M-16-16 16 16M16-16-16 16" stroke="#fff" stroke-width="10" stroke-linecap="round"/>' : v === "verify" ? '<path d="M0-20V4" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cy="18" r="6" fill="#fff"/>' : v === "low" ? '<path d="M-18 1-5 14 19-12" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : '<path d="M-9-10a10 10 0 1 1 10 10v5" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><circle cy="18" r="5" fill="#fff"/>';
  return `<svg class="sbig" viewBox="-60 -60 120 120" aria-hidden="true"><circle r="56" fill="${c}" fill-opacity=".18"/><circle r="42" fill="${c}"/>${mark}</svg>`;
}
function simpleCard(v, reasons, dos, opts){
  const l = lv(); opts = opts || {};
  return `<div class="simple v-${v}">
    ${bigSign(v)}
    <h3>${esc(opts.title || l.simpleTitle[v])}</h3>
    <p class="ssub">${esc(opts.sub || l.simpleSub[v])}</p>
    ${opts.tag || ""}
    ${reasons.length ? `<div class="sreasons"><div class="slbl">${esc(l.whyTitle)}</div>${reasons.map(r => `<div class="sr"><span class="sri">${ico(r[0])}</span><span>${esc(r[1])}</span></div>`).join("")}</div>` : ""}
    <div class="sdos"><div class="slbl">${esc(l.doTitle)}</div>${dos.map(d => `<div class="sdo"><span class="sdi">${ico(d[0])}</span><b>${esc(d[1])}</b></div>`).join("")}</div>
    <div class="srow">${opts.report ? `<button class="pill ghost sm" type="button" id="sReport">${ico("file","width:18px;height:18px")} ${esc(l.reportBtn)}</button>` : ""}<button class="pill sky sm" type="button" data-lvgo="learn">${ico("book","width:18px;height:18px")} ${esc(l.moreBtn)}</button></div>
  </div>`;
}
function wireSimple(){
  const el = $("result");
  el.querySelectorAll("[data-lvgo]").forEach(b => b.addEventListener("click", () => setLevel(b.dataset.lvgo)));
  const r = $("sReport"); if (r) r.addEventListener("click", openReport);
}
const PLAIN_OF = {request_credential:"credential", combo_authority_cred:"credential", request_money:"money", combo_lure_money:"money", combo_relative_money:"money", combo_wrong_money:"wrong", install_app:"install", open_link:"link", brand_lookalike:"link", url_userinfo:"link", url_ip:"link", url_idn:"link", shortener:"link", share_identity:"ident", authority_claim:"identity", identity_mismatch:"identity", relative_claim:"identity", context_claim:"identity", urgency:"urgency", threat:"urgency", lure:"lure", secrecy:"secrecy", wrong_send:"wrong", manipulation:"manip"};
const PLAIN_ICON = {credential:"lock", money:"taka", install:"app", link:"link", ident:"card", identity:"user", urgency:"alert", lure:"star", secrecy:"eyeoff", wrong:"refresh", manip:"eyeoff", none:"check"};
function plainChatReasons(last, max){
  const l = lv(), keys = [];
  last.contrib.filter(c => c[1] > 0).forEach(c => { const k = PLAIN_OF[c[0]]; if (k && !keys.includes(k)) keys.push(k); });
  if (!keys.length) keys.push("none");
  return keys.slice(0, max || 2).map(k => [PLAIN_ICON[k], l.plainChat[k]]);
}
function renderSimpleChat(){
  const t = tx(), last = lastOther(), v = last.verdict, seen = new Set(last.contrib.map(c => c[0]));
  const dos = guidance(seen).slice(0, 2).map(k => [TODO_ICON[k], t.todoL[k][0]]);
  $("result").innerHTML = simpleCard(v, plainChatReasons(last, 2), dos, {report: v !== "low"});
  wireSimple(); emitRendered("chat");
}
function plainLinkMain(r){
  const l = lv().plainLink, has = k => r.evidence.some(e => e.kind === k), bn = r.brand ? REGISTRY.orgs[r.brand].en : "";
  const out = [];
  if (has("danger_scheme")) out.push(["stop", l.scheme]);
  if (has("known_harmful")) out.push(["stop", l.known]);
  if (["xss_payload","sqli_payload","traversal_payload","cmd_payload"].some(has)) out.push(["code", l.payload]);
  if (has("open_redirect")) out.push(["arrow", l.redirect]);
  if (has("lookalike")) out.push(["eyeoff", l.lookalike(REGISTRY.orgs[r.brand] ? REGISTRY.orgs[r.brand].en : r.lookalikeOf)]);
  else if (has("brand_in_host") || has("deceptive_subdomain")) out.push(["eyeoff", l.brand(bn || "")]);
  if (has("userinfo")) out.push(["eyeoff", l.userinfo]);
  if (has("private_ip")) out.push(["alert", l.priv]); else if (has("ip")) out.push(["alert", l.ip]);
  if (has("shortener")) out.push(["link", l.short]);
  if (has("official")) out.push(["check", l.official(REGISTRY.orgs[r.official].en)]);
  if (has("user_trusted")) out.push(["star", l.trusted]);
  if (has("no_tls")) out.push(["lock", l.notls]);
  if (!out.length) out.push(["help", l.unknown]);
  return out;
}
function renderSimpleLink(r, kind){
  const t = tx(), l = lv(), reasons = plainLinkMain(r).slice(0, 2);
  const dos = [[r.verdict === "low" ? "app" : "stop", t.linkActShort[r.action]]];
  if (r.verdict === "high") dos.push(["trash", l.doDelete]);
  $("result").innerHTML = simpleCard(r.verdict, reasons, dos, {tag: kind === "qr" ? `<span class="when">${ico("qr","width:15px;height:15px")}${esc(t.fromQR)}</span>` : ""});
  wireSimple(); emitRendered(kind === "qr" ? "qr" : "link");
}
function plainFileReasons(r){
  const l = lv().plainFile, a = r.apk && r.apk.status === "complete" ? r.apk : null, has = k => r.evidence.some(e => e.kind === k), kp = lv().kindPlain, out = [];
  if (r.known) out.push(["stop", l.known]);
  if (has("disguised") || has("double_ext")) out.push(["eyeoff", l.disguised((r.ext || "?").toUpperCase(), kp[r.kind] || kp.unknown)]);
  if (a && a.claimed && !a.officialPkg) out.push(["eyeoff", l.fake(OFFICIAL_APPS.apps[a.claimed].en)]);
  if (a && a.highGroups && a.highGroups.length) out.push(["mail", l.perms]);
  if (!out.length) out.push(r.kind === "apk" ? ["app", l.apk] : ["exe","elf","dex","script"].includes(r.kind) ? ["alert", l.run] : ["check", l.ok]);
  return out;
}
function renderSimpleFile(r){
  const t = tx(), l = lv(), dos = [[r.kind === "apk" ? "store" : "stop", t.fileActShort[r.action]]];
  if (r.verdict === "high") dos.push(["trash", t.fileDosShort.delete]);
  $("result").innerHTML = simpleCard(r.verdict, plainFileReasons(r).slice(0, 2), dos);
  wireSimple(); emitRendered("file");
}

/* ---------- Learn view: 30-second lessons ---------- */
ART.lockbar = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="85" r="72" fill="#BAE6FD"/><g transform="translate(40 40)"><rect width="240" height="36" rx="18" fill="#fff" ${DS}/><circle cx="22" cy="18" r="11" fill="#DCFCE7"/><rect x="16" y="17" width="12" height="9" rx="2" fill="#16A34A"/><path d="M18.5 17v-3a3.5 3.5 0 0 1 7 0v3" stroke="#16A34A" stroke-width="2.2" fill="none"/><text x="42" y="23" font-size="13" font-family="monospace" fill="#0B2545">https://bank.com</text></g><g transform="translate(40 94)"><rect width="240" height="36" rx="18" fill="#fff" ${DS}/><circle cx="22" cy="18" r="11" fill="#FFE4E6"/><rect x="16" y="17" width="12" height="9" rx="2" fill="#E07A6B"/><path d="M18.5 17v-3a3.5 3.5 0 0 1 7 0" stroke="#E07A6B" stroke-width="2.2" fill="none"/><text x="42" y="23" font-size="13" font-family="monospace" fill="#0B2545">http://bank-login.xyz</text></g></svg>`;
ART.addrbar = `<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="85" r="72" fill="#BAE6FD"/><rect x="20" y="62" width="280" height="44" rx="22" fill="#fff" ${DS}/><text x="38" y="90" font-size="14" font-family="monospace" fill="#94A3B8">bkash.com.</text><rect x="125" y="72" width="128" height="26" rx="8" fill="#FFF3F0" stroke="#E07A6B" stroke-width="2"/><text x="132" y="90" font-size="14" font-family="monospace" fill="#A4453A" font-weight="700">fake-login.top</text><path d="M189 112v18" stroke="#E07A6B" stroke-width="3"/><circle cx="189" cy="136" r="8" fill="#E07A6B"/></svg>`;
function lessonChips(ids){
  const l = lv();
  return `<div class="lessons"><span class="small" style="font-weight:700">${esc(l.lessonsLbl)}</span>${ids.map(id => `<button class="lchip" type="button" data-lesson="${id}">${ico("bulb","width:15px;height:15px")}${esc(l.lessons[id][0])}</button>`).join("")}</div>`;
}
function openLesson(id, list){
  const l = lv(), L = l.lessons[id]; if (!L) return;
  closeLesson();
  const ov = document.createElement("div"); ov.className = "lesson-ov"; ov.id = "lessonOv";
  const i = list ? list.indexOf(id) : -1, nextId = list && i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  ov.innerHTML = `<div class="lesson" role="dialog" aria-label="${esc(L[0])}"><div class="lpic">${ART[L[2]] || ""}</div><h3>${esc(L[0])}</h3><ul>${L[1].map(x => `<li>${esc(x)}</li>`).join("")}</ul><div class="row">${nextId ? `<button class="pill ghost sm" type="button" id="lNext">${esc(l.lessonNext)} ${ico("arrow","width:16px;height:16px")}</button>` : ""}<button class="pill sky sm" type="button" id="lOk">${esc(l.lessonOk)}</button></div></div>`;
  document.body.appendChild(ov);
  ov.addEventListener("click", e => { if (e.target === ov) closeLesson(); });
  $("lOk").addEventListener("click", closeLesson); $("lOk").focus();
  const n = $("lNext"); if (n) n.addEventListener("click", () => openLesson(nextId, list));
}
function closeLesson(){ const o = $("lessonOv"); if (o) o.remove(); }
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLesson(); });

/* ---------- Expert view: analysis console ---------- */
let xTab = {chat:"signals", link:"url", file:"hex"};
function xTable(heads, rows){ return `<div class="xtw"><table class="xt"><thead><tr>${heads.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${heads.length}">${esc(lv().xNone)}</td></tr>`}</tbody></table></div>`; }
function xConsole(kind, tabs, bodies, json, idp){
  idp = idp || "x"; const l = lv(), cur = tabs.includes(xTab[kind]) ? xTab[kind] : tabs[0];
  return `<div class="xcon" id="${idp}con" data-kind="${kind}"><div class="xhead"><span class="xdot"></span><span class="xdot"></span><span class="xdot"></span><b>${esc(l.xTitle)}</b><small>${esc(l.xSub)}</small><button class="xcopy" type="button" id="${idp}Copy">${ico("copy","width:14px;height:14px")} ${esc(l.copyJson)}</button></div>
    <div class="xtabs" role="tablist">${tabs.map(k => `<button type="button" role="tab" data-xt="${k}" aria-selected="${k === cur}">${esc(l.xt[k] || lb().xt[k] || k)}</button>`).join("")}</div>
    <div class="xbody">${tabs.map(k => `<div data-xp="${k}"${k === cur ? "" : " hidden"}>${bodies[k]}</div>`).join("")}</div><textarea id="${idp}Json" hidden>${esc(json)}</textarea></div>`;
}
function wireConsole(kind, idp){
  idp = idp || "x"; const c = $(idp + "con"); if (!c) return;
  c.querySelectorAll("[data-xt]").forEach(b => b.addEventListener("click", () => { xTab[kind] = b.dataset.xt; c.querySelectorAll("[data-xt]").forEach(x => x.setAttribute("aria-selected", String(x === b))); c.querySelectorAll("[data-xp]").forEach(p => p.hidden = p.dataset.xp !== b.dataset.xt); }));
  $(idp + "Copy").addEventListener("click", () => copyText($(idp + "Json").value, lv().copied));
}
const mono = s => `<code>${esc(s)}</code>`;
function expertChat(){
  const h = lv().xh, all = result.perTurn.filter(p => p.t <= turnIdx);
  const zOf = p => BIAS + p.contrib.reduce((a, c) => a + c[1], 0);
  const sigRows = all.map(p => [num(p.t), p.who === "me" ? "me" : "them", esc(maskText(p.text).slice(0, 70)), esc(p.stages.join("+") || "–"), p.who === "me" ? "–" : esc([...new Set(p.found.map(f => f.sig))].map(s => s + ":" + (SIG[s] ? SIG[s].w : "?")).join(", ") || "–"), p.who === "me" ? "–" : zOf(p).toFixed(2), p.who === "me" ? "–" : p.score.toFixed(3), p.who === "me" ? "–" : `<span class="xv x-${p.verdict}">${p.verdict}</span>`]);
  const normRows = all.map(p => { const nm = normalize(p.text); return [num(p.t), esc(maskText(p.text).slice(0, 80)), esc(maskText(nm.n).slice(0, 80)), String(nm.zw)]; });
  const last = lastOther(), z = zOf(last);
  const engine = xTable([h.field, h.value], [["BIAS", String(BIAS)], ["T_HIGH / T_VERIFY", T_HIGH + " / " + T_VERIFY], ["z = BIAS + Σw", z.toFixed(3)], ["score = min(0.99, σ(z))", last.score.toFixed(4)], ["verdict", last.verdict], ["firstSuspicion / firstAlert / firstHarm", [result.firstSuspicion, result.firstAlert, result.firstHarm].map(x => x == null ? "–" : x).join(" / ")], ["channel", esc(JSON.stringify(last.channel || {}))], ["registry", REGISTRY.version], ["patterns", esc(matchPatterns(result.perTurn, turnIdx).map(p => p.id + "@" + p.turns.join(">")).join(", ") || "–")]])
    + xTable([h.sig, h.family, h.weight, h.msg], last.contrib.map(c => [mono(c[0]), esc(SIG[c[0]] ? SIG[c[0]].fam : ""), (c[1] > 0 ? "+" : "") + c[1].toFixed(1), num(c[2])]));
  const json = JSON.stringify({engine:{bias:BIAS, tHigh:T_HIGH, tVerify:T_VERIFY, registry:REGISTRY.version}, sender:current.senderType, turns:all.map(p => ({t:p.t, who:p.who, text:maskText(p.text), stages:p.stages, signals:[...new Set(p.found.map(f => f.sig))], score:+p.score.toFixed(4), verdict:p.verdict, channel:p.channel || null})), firstSuspicion:result.firstSuspicion, firstAlert:result.firstAlert, firstHarm:result.firstHarm, patterns:matchPatterns(result.perTurn, turnIdx)}, null, 2);
  return xConsole("chat", ["signals","norm","engine","json"], {signals:xTable([h.turn, h.who, h.text, h.stages, h.sig, h.z, h.score, h.verdict], sigRows), norm:xTable([h.turn, h.orig, h.norm, h.zw], normRows), engine, json:`<pre class="xpre">${esc(json)}</pre>`}, json);
}
function evidenceTable(ev){ const h = lv().xh; return xTable([h.kind, h.state, h.source, h.conf, h.finding, h.prov], ev.map(e => [mono(e.kind), esc(e.state), esc(e.source), esc(e.confidenceBand), esc(String(e.finding == null ? "" : e.finding).slice(0, 80)), esc(e.provenance || "–")])); }
function expertLink(r){
  const h = lv().xh, l = lv();
  let u = null; try { u = new URL(r.href); } catch(e){}
  const sub = r.host && r.reg && r.host !== r.reg ? r.host.slice(0, -(r.reg.length + 1)) : "";
  const suffix = r.reg && r.reg.includes(".") && !r.ip ? r.reg.split(".").slice(1).join(".") : "–";
  const rows = [["href", mono(r.href || r.raw)], ["scheme", mono(r.scheme)], ["userinfo", mono(r.userinfo || "–")], ["host (ASCII)", mono(r.host || "–")], ["host (Unicode)", mono(r.hostUnicode || "–")], ["subdomain", mono(sub || "–")], ["registrable domain", mono(r.reg || "–")], ["public suffix", mono(suffix)], ["skeleton", mono(r.regUnicode ? skeleton(r.regUnicode) : "–")], ["port", mono(r.port || "default")], ["path+query", mono(r.path || "/")], ["ip / private", r.ip + " / " + r.privateIp], ["brand / look-alike of", mono((r.brand || "–") + " / " + (r.lookalikeOf || "–"))], ["category → verdict → action", mono(r.category + " → " + r.verdict + " → " + r.action)], ["defanged", mono(r.defanged)]];
  if (u) [...u.searchParams.entries()].slice(0, 10).forEach(([k, v]) => rows.push(["param: " + esc(k), mono(v.slice(0, 80))]));
  const has = k => r.evidence.some(e => e.kind === k);
  const hits = [has("known_harmful"), r.evidence.some(e => ["userinfo","private_ip","lookalike","deceptive_subdomain","brand_in_host","danger_scheme"].includes(e.kind)), has("official"), has("user_trusted"), r.category === "unknown"];
  const policy = xTable([h.rule, h.hit], l.xPolicy.map((p, i) => [esc(p), hits[i] ? `<span class="xv x-high">✓</span>` : "·"])) + `<p class="xnote">→ ${mono(r.category)} · ${mono(r.verdict)} · ${mono(r.action)}</p>`;
  const dns = r.dns && r.dns.status ? `<pre class="xpre">${esc(JSON.stringify(r.dns, null, 2))}</pre>` : `<p class="xnote">${esc(l.xNoDns)}</p>`;
  const json = JSON.stringify(Object.assign({}, r, {dns:r.dns && r.dns.status ? r.dns : null}), null, 2);
  return xConsole("link", ["url","evidence","policy","dns","json"], {url:xTable([h.field, h.value], rows), evidence:evidenceTable(r.evidence), policy, dns, json:`<pre class="xpre">${esc(json)}</pre>`}, json);
}
function hexDump(bytes){
  const h = lv().xh, rows = [];
  for (let o = 0; o < bytes.length; o += 16){
    const chunk = Array.from(bytes.slice(o, o + 16));
    rows.push([o.toString(16).padStart(8, "0"), chunk.map(b => b.toString(16).padStart(2, "0")).join(" "), esc(chunk.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : ".").join(""))]);
  }
  return xTable([h.offset, h.hexb, h.ascii], rows);
}
function expertFile(r){
  const h = lv().xh;
  const hex = r.head ? hexDump(r.head) : `<p class="xnote">–</p>`;
  const zip = r.zip ? xTable([h.name, h.method, h.comp, h.size], r.zip.map(e => [mono(e.name), e.method === 8 ? "deflate" : e.method === 0 ? "stored" : String(e.method), String(e.comp), String(e.size)])) : `<p class="xnote">${esc(lv().xNone)}</p>`;
  const man = r.manifest ? xTable([h.tag, h.attrs], r.manifest.map(tg => [mono("<" + tg.tag + ">"), esc(Object.entries(tg.attrs).map(([k, v]) => k + "=" + v).join("  ").slice(0, 160))])) : `<p class="xnote">${esc(lv().xNone)}</p>`;
  const info = xTable([h.field, h.value], [["name", mono(r.name)], ["magic kind", mono(r.kind)], ["extension", mono(r.ext || "–")], ["size (bytes)", String(r.size)], ["sha256", mono(r.sha256)], ["hash list", mono(r.known || "no match")], ["verdict / action", mono(r.verdict + " / " + r.action)]].concat(r.apk && r.apk.status === "complete" ? [["package", mono(r.apk.pkg)], ["label / version", mono((r.apk.label || "–") + " / " + (r.apk.version || "–"))], ["permissions", mono(r.apk.perms.join(", "))], ["exported components", String(r.apk.exported)], ["signature block present", String(r.apk.signed)], ["official-app registry", mono(OFFICIAL_APPS.version)]] : []));
  const json = JSON.stringify(Object.assign({}, r, {head:undefined, zip:r.zip || null, manifest:r.manifest || null}), null, 2);
  return xConsole("file", ["hex","evidence","zip","manifest","json"], {hex:info + hex, evidence:evidenceTable(r.evidence), zip, manifest:man, json:`<pre class="xpre">${esc(json)}</pre>`}, json);
}
function addExtras(kind, r){
  const el = $("result"), lvl = getLevel();
  if (lvl === "simple") return;
  const ids = kind === "chat" ? ["otp","stages","domain"] : kind === "file" ? ["apk","perms","hash"] : kind === "login" ? ["mitm","https","domain","lookalike"] : ["domain","https","lookalike","dns"];
  el.insertAdjacentHTML("beforeend", `<div class="extras">${lessonChips(ids)}${lvl === "expert" ? (kind === "chat" ? expertChat() : kind === "file" ? expertFile(r) : kind === "login" ? expertLogin(r) : expertLink(r)) : ""}</div>`);
  el.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.lesson, ids)));
  if (lvl === "expert") wireConsole(kind);
}
