/* ================= Shieldy: rule-based assistant that runs on the device =================
   Asks what happened, walks the user through the app with a spotlight, and checks pasted links or chats inline.
   It is not an online AI: nothing typed here leaves the page. */
const AS = {
 en:{
  name:"Shieldy", role:"Your guide · works on this device",
  about:"How I work|I'm a simple rule-based helper inside this page. I'm not a person or an online AI, and nothing you type here is sent anywhere.",
  helloTitle:"Hi, I'm Shieldy!", hello:"Need help? I'll show you step by step.", open:"Open assistant", close:"Close",
  greet:"Hi! I'm Shieldy. Tell me what happened, and I'll guide you step by step.",
  menu:{msg:"Got a strange message", link:"Got a link", file:"Got an app or file", call:"Got a strange call", qr:"Got a QR code", lost:"I already gave my code or money", tour:"Show me around", privacy:"Is my data safe?", more:"More…", level:"Make it simpler / deeper", learn:"Teach me something", login:"A page wants my password", it:"I work in IT / security", pass:"Is my password strong?", web:"I build websites", shield:"Protect me on every website"},
  passQ:"Let's check it. Type it in the Password tab. It stays on this device and is never saved. I can also make a strong one for you.", openPass:"Open password check", makePw:"Make me a strong one", learn2fa:"Two-step login, simply",
  webQ:"I can grade your website's security headers and cookies, check code for SQL injection, XSS and command injection, and X-ray pages or emails for hidden tricks. Paste, and I'll show the fix.", openHdr:"Check my website", openCode:"Check my code", openPage:"X-ray an email or page",
  shieldQ:"The Browser Shield is a free add-on for Chrome and Edge. It pauses you before a password goes to a fake page, reveals invisible frames and blocks hidden form sends.", openShield:"Show me the Browser Shield",
  loginQ:"Good that you stopped! Tell me which app, and paste the page address. I'll say if it's the real site. (Remember: telegram.sth is NOT Telegram.)", itQ:"Welcome! The Security Lab reads Wi-Fi captures (.pcap) and web server logs. It finds fake routers, fake DNS, passwords sent in the open, DDoS early warnings, password guessing and scanners. Switch to Expert view for the raw data.", openLab:"Open the Lab", tryDdos:"Show a DDoS example", tryMitm:"Show a Wi-Fi attack example",
  levelAsk:"How much do you know about phones and the internet? Pick one. You can change it any time.", levelSet:"Done! I switched the view.", learnAsk:"Pick a 30-second lesson:",
  ph:"Type here, or paste a message or link…", send:"Send",
  showMe:"Show me where", pasteHere:"Paste it here instead", tryEx:"Try an example", seeFull:"See full result", seeDetails:"See details", makeReport:"Make a report", back:"Main menu", openSettings:"Open settings",
  msg:"OK, let's check it together. Copy the messages and paste them in the Chat tool. I'll show you where.",
  call:"Write what the caller said, one line each, then check it like a chat. Remember: bKash, Nagad and banks never ask for your PIN or OTP.",
  link:"Paste the link right here and I'll check it. Or I can show you the Link tool.",
  file:"Pick the file in the App / file tool. It never leaves your phone. I'll show you where.",
  qr:"Save the QR as a picture, then choose it in the QR tool. I'll show you where.",
  lostTitle:"Act fast. Do these now:",
  lost:['Call your provider to block it: <a href="tel:16247">bKash 16247</a> · <a href="tel:16167">Nagad 16167</a> · <a href="tel:16216">Rocket 16216</a>, or the number on your card.', "Change your PIN from the official app.", "Stop replying. Don't send more money or codes.", "Keep the messages and make a report.", 'Threatened? Call <a href="tel:999">999</a>. Bangladesh Bank: <a href="tel:16236">16236</a>.'],
  privacy:"Yes. Chats, links and files are checked right here on your device. Nothing is uploaded. The only online option is a DNS check for a link, and I always ask first.",
  pasteChat:"Paste the messages here, each on its own line.", pasteLink:"Paste the link here.",
  otp:"Never share your PIN or OTP with anyone. No real company asks for it, not even on the phone.",
  thanks:"You're welcome! Stay safe.",
  fallback:"Sorry, I didn't get that. Pick one, or paste the message or link here:",
  reason:"Why", doNow:"Do this", done:"Done! What next?",
  step:(i,n)=>`Step ${i} of ${n}`, next:"Next", prev:"Back", skip:"Skip", finish:"Finish",
  g:{chatTab:["Tap “Chat”","This is where you check messages."], chatBox:["Paste here","Put each message on its own line. Start your own replies with “me:”."], sender:["Who sent it?","Optional. It helps me check if the sender matches who they claim to be."], go:["Tap Check","I'll read the whole chat in a second. I'm waiting for you."], result:["Your answer","Red means stop. Orange means check first. Green means no danger found yet."], dos:["What to do","These tiles tell you exactly what to do next."], replay:["Watch it again","Replay shows the moment the chat turned dangerous."], linkTab:["Tap “Link”","This is the link checker."], linkIn:["Paste the link","From SMS, WhatsApp, email or anywhere. I only read it."], linkGo:["Tap Check","I'm waiting for you."], realsite:["The real website","This is where the link really goes. The red box shows what it pretends to be."], fileTab:["Tap “App / file”","This checks APKs and other files."], drop:["Choose the file","Tap here and pick the file."], samples:["Or try a sample","These demo files are safe. They have no code."], appcard:["What the app really is","A red stamp means it's fake or disguised."], perms:["What it wants","Red tiles are dangerous powers, like reading your OTP."], qrTab:["Tap “QR”","This reads the link inside a QR picture."], qrDrop:["Choose the QR picture","I'll read the link and check it. I never open it."], services:["Start here","Pick what you want to check."], loginTab:["Tap “Login”","Check a page before you type a password."], loginSvc:["Pick the app","Telegram, Facebook, Google, bKash…"], loginIn:["Paste the address","Copy it from the very top of the page."], loginGo:["Tap the button","I check it right here, nothing is sent."], loginRes:["Real or fake?","Left: the app you want. Right: who really owns this page."], labTabs:["Two tools","Network capture for Wi-Fi tricks. Server logs for website attacks."], labNet:["Step by step","Each step of the attack, in time order."], labDeep:["Go deeper","Lessons, and in Expert view a Wireshark-style packet list."], labChart:["Early warning","Orange bars warn early. Red means attack. The dashed line is normal."], labFind:["What to do","Each finding says what the IT team should do now."], lab:["Security Lab","For IT teams and curious learners."], levels:["Easy or deep?","Easy shows only the answer. Learn explains why. Expert shows all the data."], tabs:["The checker","Four tools: chat, link, app or file, and QR."], layers:["10 safety layers","Hover any icon to learn what it does."], tips:["Stay safe","Four habits that stop most scams."], privacy:["Your privacy","Settings and Delete all are here."], lang:["বাংলা / English","Switch language any time."], me:["That's me!","Tap me whenever you need help."]}
 },
 bn:{
  name:"শিল্ডি", role:"আপনার গাইড · এই ফোনেই চলে",
  about:"আমি কীভাবে কাজ করি|আমি এই পেজের ভেতরের সহজ রুল-ভিত্তিক সাহায্যকারী। মানুষ না, অনলাইন AI-ও না। এখানে যা লিখবেন, কোথাও যায় না।",
  helloTitle:"হাই, আমি শিল্ডি!", hello:"সাহায্য লাগবে? ধাপে ধাপে দেখিয়ে দেব।", open:"সাহায্যকারী খুলুন", close:"বন্ধ করুন",
  greet:"হাই! আমি শিল্ডি। কী হয়েছে বলুন, আমি ধাপে ধাপে দেখিয়ে দেব।",
  passQ:"চলুন দেখি। পাসওয়ার্ড ট্যাবে লিখুন। এটা এই ডিভাইসেই থাকে, কখনো সেভ হয় না। চাইলে আমি একটা শক্ত পাসওয়ার্ড বানিয়ে দিতে পারি।", openPass:"পাসওয়ার্ড চেক খোলো", makePw:"আমাকে একটা শক্ত বানিয়ে দাও", learn2fa:"টু-স্টেপ লগইন, সহজ করে",
  webQ:"আমি আপনার ওয়েবসাইটের সিকিউরিটি হেডার আর কুকির গ্রেড দিতে পারি, কোডে SQL injection, XSS আর কমান্ড ইনজেকশন খুঁজতে পারি, আর পেজ বা ইমেইলের লুকানো চালাকি দেখাতে পারি। পেস্ট করুন, আমি সমাধান দেখাব।", openHdr:"আমার ওয়েবসাইট চেক করো", openCode:"আমার কোড চেক করো", openPage:"ইমেইল বা পেজের এক্স-রে",
  shieldQ:"ব্রাউজার শিল্ড Chrome আর Edge-এর ফ্রি অ্যাড-অন। নকল পেজে পাসওয়ার্ড যাওয়ার আগে থামায়, অদৃশ্য ফ্রেম দেখায় আর লুকানো ফর্ম পাঠানো আটকায়।", openShield:"ব্রাউজার শিল্ড দেখাও",
  menu:{msg:"সন্দেহজনক মেসেজ পেয়েছি", link:"লিংক পেয়েছি", file:"অ্যাপ বা ফাইল পেয়েছি", call:"সন্দেহজনক ফোন পেয়েছি", qr:"QR কোড পেয়েছি", lost:"কোড বা টাকা দিয়ে ফেলেছি", tour:"পুরো অ্যাপটা দেখাও", privacy:"আমার তথ্য কি সেফ?", more:"আরও…", level:"আরও সহজ / আরও গভীর", learn:"কিছু শেখাও", login:"একটা পেজ পাসওয়ার্ড চাইছে", it:"আমি IT / সিকিউরিটিতে কাজ করি", pass:"আমার পাসওয়ার্ড কি শক্ত?", web:"আমি ওয়েবসাইট বানাই", shield:"সব ওয়েবসাইটে আমাকে রক্ষা করো"},
  loginQ:"থেমে ভালো করেছেন! কোন অ্যাপ, বলুন, আর পেজের ঠিকানাটা পেস্ট করুন। আমি বলে দেব এটা আসল কি না। (মনে রাখবেন: telegram.sth মোটেও টেলিগ্রাম না।)", itQ:"স্বাগতম! সিকিউরিটি ল্যাব Wi-Fi ক্যাপচার (.pcap) আর ওয়েব সার্ভার লগ পড়ে। নকল রাউটার, নকল DNS, খোলা পাসওয়ার্ড, DDoS-এর আগাম সতর্কতা, পাসওয়ার্ড অনুমান আর স্ক্যানার ধরে। কাঁচা ডেটা দেখতে এক্সপার্ট ভিউ চালু করুন।", openLab:"ল্যাব খোলো", tryDdos:"DDoS উদাহরণ দেখাও", tryMitm:"Wi-Fi হামলার উদাহরণ দেখাও",
  levelAsk:"ফোন আর ইন্টারনেট নিয়ে আপনি কতটুকু জানেন? একটা বাছুন। পরে যখন খুশি বদলাতে পারবেন।", levelSet:"হয়ে গেছে! দেখার ধরন বদলে দিলাম।", learnAsk:"একটা ৩০ সেকেন্ডের পাঠ বাছুন:",
  ph:"এখানে লিখুন, বা মেসেজ বা লিংক পেস্ট করুন…", send:"পাঠান",
  showMe:"কোথায়, দেখাও", pasteHere:"এখানেই পেস্ট করি", tryEx:"উদাহরণ দেখাও", seeFull:"পুরো ফলাফল দেখুন", seeDetails:"বিস্তারিত দেখুন", makeReport:"রিপোর্ট বানাও", back:"মেনু", openSettings:"সেটিংস খুলুন",
  msg:"ঠিক আছে, চলুন একসাথে চেক করি। মেসেজগুলো কপি করে চ্যাট টুলে পেস্ট করুন। কোথায়, দেখিয়ে দিচ্ছি।",
  call:"কলার যা যা বলেছে, এক এক লাইনে লিখে চ্যাটের মতো চেক করুন। মনে রাখবেন: বিকাশ, নগদ বা ব্যাংক কখনো পিন বা OTP চায় না।",
  link:"লিংকটা এখানেই পেস্ট করুন, আমি চেক করে দিচ্ছি। অথবা লিংক টুলটা দেখিয়ে দিই।",
  file:"অ্যাপ / ফাইল টুলে ফাইলটা বাছুন। ফাইল আপনার ফোনের বাইরে যাবে না। কোথায়, দেখিয়ে দিচ্ছি।",
  qr:"QR-টা ছবি হিসেবে সেভ করুন, তারপর QR টুলে বাছুন। কোথায়, দেখিয়ে দিচ্ছি।",
  lostTitle:"দেরি করবেন না। এখনই করুন:",
  lost:['প্রোভাইডারকে ফোন করে ব্লক করান: <a href="tel:16247">বিকাশ ১৬২৪৭</a> · <a href="tel:16167">নগদ ১৬১৬৭</a> · <a href="tel:16216">রকেট ১৬২১৬</a>, বা কার্ডের নম্বর।', "অফিশিয়াল অ্যাপ থেকে পিন বদলান।", "আর রিপ্লাই দেবেন না। আর টাকা বা কোড দেবেন না।", "মেসেজগুলো রেখে দিন, একটা রিপোর্ট বানান।", 'হুমকি দিলে <a href="tel:999">৯৯৯</a>-এ ফোন করুন। বাংলাদেশ ব্যাংক: <a href="tel:16236">১৬২৩৬</a>।'],
  privacy:"হ্যাঁ। চ্যাট, লিংক আর ফাইল এই ফোনেই চেক হয়। কিছুই আপলোড হয় না। অনলাইনে যায় শুধু লিংকের DNS চেক, সেটাও আমি আগে জিজ্ঞেস করি।",
  pasteChat:"মেসেজগুলো এখানে পেস্ট করুন, প্রতিটা আলাদা লাইনে।", pasteLink:"লিংকটা এখানে পেস্ট করুন।",
  otp:"পিন বা OTP কখনো কাউকে দেবেন না। কোনো আসল কোম্পানি এটা চায় না, ফোনেও না।",
  thanks:"আপনাকেও ধন্যবাদ! সাবধানে থাকবেন।",
  fallback:"দুঃখিত, বুঝতে পারিনি। একটা বাছুন, অথবা মেসেজ বা লিংক এখানে পেস্ট করুন:",
  reason:"কারণ", doNow:"এখন করুন", done:"হয়ে গেছে! এরপর কী করবেন?",
  step:(i,n)=>`ধাপ ${i}/${n}`, next:"পরের ধাপ", prev:"আগের", skip:"বাদ দিন", finish:"শেষ",
  g:{chatTab:["“চ্যাট”-এ চাপ দিন","এখানে মেসেজ চেক হয়।"], chatBox:["এখানে পেস্ট করুন","প্রতিটা মেসেজ আলাদা লাইনে। নিজের উত্তরের শুরুতে “আমি:” লিখুন।"], sender:["কে পাঠিয়েছে?","না দিলেও চলে। দিলে মিলিয়ে দেখি সে যা বলছে তা ঠিক কি না।"], go:["চেক-এ চাপ দিন","এক সেকেন্ডে পুরো চ্যাট পড়ে ফেলব। আমি অপেক্ষা করছি।"], result:["আপনার উত্তর","লাল মানে থামুন। কমলা মানে আগে যাচাই। সবুজ মানে এখনো বিপদ পাইনি।"], dos:["কী করবেন","এই টাইলগুলো বলে দেয় এখন ঠিক কী করতে হবে।"], replay:["আবার দেখুন","কোন মেসেজে চ্যাটটা বিপজ্জনক হলো, রিপ্লেতে দেখা যায়।"], linkTab:["“লিংক”-এ চাপ দিন","এটা লিংক চেকার।"], linkIn:["লিংক পেস্ট করুন","SMS, WhatsApp, ইমেইল যেখান থেকেই হোক। আমি শুধু পড়ি।"], linkGo:["চেক-এ চাপ দিন","আমি অপেক্ষা করছি।"], realsite:["আসল ওয়েবসাইট","লিংকটা আসলে এখানেই যায়। লাল বক্স দেখায় এটা কী সাজছে।"], fileTab:["“অ্যাপ / ফাইল”-এ চাপ দিন","এখানে APK আর অন্য ফাইল চেক হয়।"], drop:["ফাইল বাছুন","এখানে চাপ দিয়ে ফাইলটা বাছুন।"], samples:["অথবা নমুনা দেখুন","এই ডেমো ফাইলগুলো নিরাপদ, কোনো কোড নেই।"], appcard:["অ্যাপটা আসলে কী","লাল সিল মানে নকল বা ছদ্মবেশী।"], perms:["কী চায়","লাল টাইল মানে বিপজ্জনক ক্ষমতা, যেমন আপনার OTP পড়া।"], qrTab:["“QR”-এ চাপ দিন","QR ছবির ভেতরের লিংক পড়ে।"], qrDrop:["QR ছবি বাছুন","লিংক পড়ে চেক করব। কখনো খুলব না।"], services:["এখান থেকে শুরু","কী চেক করতে চান, বাছুন।"], loginTab:["“লগইন”-এ চাপ দিন","পাসওয়ার্ড দেওয়ার আগে পেজটা চেক করুন।"], loginSvc:["অ্যাপ বাছুন","টেলিগ্রাম, ফেসবুক, গুগল, বিকাশ…"], loginIn:["ঠিকানা পেস্ট করুন","পেজের একদম ওপর থেকে কপি করুন।"], loginGo:["বাটনে চাপ দিন","এখানেই চেক করি, কিছু পাঠানো হয় না।"], loginRes:["আসল না নকল?","বামে: আপনি যে অ্যাপ চান। ডানে: পেজটা আসলে কার।"], labTabs:["দুইটা টুল","Wi-Fi-র চালাকির জন্য নেটওয়ার্ক ক্যাপচার। সাইটে হামলার জন্য সার্ভার লগ।"], labNet:["ধাপে ধাপে","হামলার প্রতিটা ধাপ, সময় অনুযায়ী।"], labDeep:["আরও গভীরে","পাঠ, আর এক্সপার্ট ভিউতে Wireshark-এর মতো প্যাকেট লিস্ট।"], labChart:["আগাম সতর্কতা","কমলা বার আগেই সতর্ক করে। লাল মানে হামলা। ড্যাশ লাইন হলো স্বাভাবিক।"], labFind:["কী করবেন","প্রতিটা ফাইন্ডিং বলে IT টিম এখন কী করবে।"], lab:["সিকিউরিটি ল্যাব","IT টিম আর শিখতে চাওয়াদের জন্য।"], levels:["সহজ না গভীর?","সহজ দেখায় শুধু উত্তর। শিখি বোঝায় কেন। এক্সপার্ট দেখায় সব ডেটা।"], tabs:["চেকার","চারটা টুল: চ্যাট, লিংক, অ্যাপ বা ফাইল, আর QR।"], layers:["১০ স্তরের সুরক্ষা","যেকোনো আইকনের ওপর মাউস রাখলে কাজটা দেখবেন।"], tips:["সাবধান থাকুন","৪টা অভ্যাস, বেশিরভাগ স্ক্যাম আটকায়।"], privacy:["আপনার প্রাইভেসি","সেটিংস আর সব ডিলিট এখানে।"], lang:["বাংলা / English","যখন খুশি ভাষা বদলান।"], me:["এই যে আমি!","সাহায্য লাগলেই আমাকে চাপ দিন।"]}
 }
};
const at = () => AS[LANG];

/* ---------- guided walkthroughs (spotlight steps) ---------- */
const GUIDES = {
  chat:[{sel:'#tabs [data-tab="chat"]', g:"chatTab", before:() => setTab("chat")}, {sel:"#chat", g:"chatBox"}, {sel:"#senderSeg", g:"sender"}, {sel:"#goBtn", g:"go", wait:"chat"}, {sel:"#result .banner, #result .simple", g:"result"}, {sel:"#result .dos, #result .sdos", g:"dos"}],
  chatEx:[{sel:"#result .banner, #result .simple", g:"result", before:() => loadExample("s1", {scroll:false})}, {sel:"#result .dos, #result .sdos", g:"dos"}, {sel:"#aReplay", g:"replay"}],
  link:[{sel:'#tabs [data-tab="link"]', g:"linkTab", before:() => setTab("link")}, {sel:"#linkIn", g:"linkIn"}, {sel:"#linkGo", g:"linkGo", wait:"link"}, {sel:"#result .realsite, #result .sreasons", g:"realsite"}, {sel:"#result .dos, #result .sdos", g:"dos"}],
  linkEx:[{sel:"#result .realsite, #result .sreasons", g:"realsite", before:() => { const u = tx().linkEx[2][1]; $("linkIn").value = u; runLink(u); }}, {sel:"#result .dos, #result .sdos", g:"dos"}],
  file:[{sel:'#tabs [data-tab="file"]', g:"fileTab", before:() => setTab("file")}, {sel:"#drop", g:"drop", wait:"file"}, {sel:"#fileEx", g:"samples", wait:"file"}, {sel:"#result .appcard, #result .simple", g:"appcard"}, {sel:"#result .pgrid, #result .sreasons", g:"perms"}],
  fileEx:[{sel:"#result .appcard, #result .simple", g:"appcard", before:() => { setTab("file"); runSample("fake"); }}, {sel:"#result .pgrid, #result .sreasons", g:"perms"}, {sel:"#result .dos, #result .sdos", g:"dos"}],
  qr:[{sel:'#tabs [data-tab="qr"]', g:"qrTab", before:() => setTab("qr")}, {sel:"#paneQR .drop", g:"qrDrop", wait:"qr"}, {sel:"#result .realsite, #result .sreasons", g:"realsite"}],
  login:[{sel:'#tabs [data-tab="login"]', g:"loginTab", before:() => setTab("login")}, {sel:"#lgSvcs", g:"loginSvc"}, {sel:"#lgIn", g:"loginIn"}, {sel:"#lgGo", g:"loginGo", wait:"login"}, {sel:"#result .lgcmp, #result .simple", g:"loginRes"}],
  loginEx:[{sel:"#result .lgcmp, #result .simple", g:"loginRes", before:() => { setTab("login"); const x = lb().ex[0]; loginSvc = x[0]; applyLoginStatic(); $("lgIn").value = x[1]; runLogin(); }}, {sel:"#result .dos, #result .sdos", g:"dos"}],
  labNet:[{sel:"#labTabs", g:"labTabs", before:() => { labOpen = true; labTab = "net"; renderLab(); wsFocusLab("net"); }}, {sel:"#labOut .ltl, #labOut .simple", g:"labNet", before:() => labSample("attack")}, {sel:"#labOut .extras, #labOut .sdos", g:"labDeep"}],
  labLogs:[{sel:"#labTabs", g:"labTabs", before:() => { labOpen = true; labTab = "logs"; renderLab(); wsFocusLab("logs"); }}, {sel:"#labOut .lchart, #labOut .simple", g:"labChart", before:() => labSample("ddos")}, {sel:"#labOut .whys, #labOut .sdos", g:"labFind"}],
  tour:[{sel:"#svGrid", g:"services"}, {sel:"#levels", g:"levels"}, {sel:"#tabs", g:"tabs"}, {sel:"#strip", g:"layers"}, {sel:"#lab .wrap", g:"lab"}, {sel:"#tipCards", g:"tips"}, {sel:"#settings", g:"privacy"}, {sel:".lang", g:"lang"}, {sel:".as-launch", g:"me"}]
};
let G = null, spotEl = null, stepEl = null, spotRaf = 0;
function waitFor(sel, ms){ return new Promise(res => { const t0 = Date.now(); (function poll(){ const el = document.querySelector(sel); if (el && el.getBoundingClientRect().height > 0) return res(el); if (Date.now() - t0 > ms) return res(null); setTimeout(poll, 120); })(); }); }
function guideStart(name){
  const steps = GUIDES[name]; if (!steps) return;
  panelHide(); guideClear();
  G = {name, steps, i:0, mute:0};
  guideShow();
}
async function guideShow(){
  if (!G) return;
  const st = G.steps[G.i];
  if (st.before){ G.mute = Date.now() + 900; st.before(); }
  const el = await waitFor(st.sel, 2500);
  if (!G) return;
  if (!el){ if (G.i < G.steps.length - 1){ G.i++; return guideShow(); } return guideEnd(); }
  G.el = el;
  el.scrollIntoView({block:"center", behavior:reduceMotion ? "auto" : "smooth"});
  renderStep();
  setTimeout(() => placeSpot(), reduceMotion ? 0 : 450);
}
function renderStep(){
  const a = at(), st = G.steps[G.i], [title, text] = a.g[st.g] || ["", ""], last = G.i === G.steps.length - 1;
  if (!spotEl){ spotEl = document.createElement("div"); spotEl.className = "spot"; document.body.appendChild(spotEl); }
  if (!stepEl){ stepEl = document.createElement("div"); stepEl.className = "stepb"; stepEl.setAttribute("role", "dialog"); document.body.appendChild(stepEl); }
  stepEl.innerHTML = `<div class="sh">${mascot("")}<div><small>${esc(a.step(num(G.i + 1), num(G.steps.length)))}</small><b>${esc(title)}</b></div></div><p>${esc(text)}</p>
    <div class="row">${G.i ? `<button class="pill ghost sm" type="button" data-gs="prev">${esc(a.prev)}</button>` : ""}<button class="pill ghost sm" type="button" data-gs="skip">${esc(a.skip)}</button><button class="pill sky sm" type="button" data-gs="next">${esc(last ? a.finish : a.next)}</button></div>`;
  stepEl.querySelectorAll("[data-gs]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.gs; if (k === "skip") return guideEnd(); if (k === "prev"){ G.i = Math.max(0, G.i - 1); return guideShow(); } if (last) return guideEnd(); G.i++; guideShow(); }));
  const nb = stepEl.querySelector('[data-gs="next"]'); if (nb) nb.focus({preventScroll:true});
}
function placeSpot(){
  if (!G || !G.el || !spotEl || !stepEl) return;
  const r = G.el.getBoundingClientRect(), pad = 6;
  const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), bottom = Math.min(innerHeight - 4, r.bottom + pad), right = Math.min(innerWidth - 4, r.right + pad);
  Object.assign(spotEl.style, {top:top + "px", left:left + "px", width:Math.max(0, right - left) + "px", height:Math.max(0, bottom - top) + "px"});
  const bw = stepEl.offsetWidth, bh = stepEl.offsetHeight;
  let y = bottom + 12; if (y + bh > innerHeight - 8) y = top - bh - 12; if (y < 8) y = innerHeight - bh - 12;
  const x = Math.min(Math.max(16, r.left + r.width / 2 - bw / 2), innerWidth - bw - 16);
  stepEl.style.top = y + "px"; stepEl.style.left = x + "px";
}
function onMove(){ if (!G) return; cancelAnimationFrame(spotRaf); spotRaf = requestAnimationFrame(placeSpot); }
addEventListener("scroll", onMove, {passive:true}); addEventListener("resize", onMove);
function guideClear(){ if (spotEl){ spotEl.remove(); spotEl = null; } if (stepEl){ stepEl.remove(); stepEl = null; } }
function guideEnd(){ G = null; guideClear(); panelShow(); bot(at().done, menuChips()); }
document.addEventListener("fs:rendered", e => {
  if (!G || Date.now() < G.mute) return;
  let j = -1; for (let x = G.i; x < G.steps.length; x++) if (G.steps[x].wait === e.detail) j = x;
  if (j < 0) return;
  G.i = j + 1; if (G.i >= G.steps.length) return guideEnd();
  setTimeout(guideShow, 350);
});

/* ---------- chat panel ---------- */
let asMode = null, asBuilt = false;
function buildAssistant(){
  if (asBuilt) return; asBuilt = true;
  const l = document.createElement("button"); l.type = "button"; l.className = "as-launch"; l.id = "asLaunch"; l.innerHTML = mascot("as-l"); document.body.appendChild(l);
  l.addEventListener("click", () => { hideHello(); $("asPanel").hidden ? assistantOpen() : panelHide(); });
  const p = document.createElement("div"); p.className = "as-panel"; p.id = "asPanel"; p.hidden = true; p.setAttribute("role", "dialog");
  p.innerHTML = `<div class="as-head">${mascot("as-av")}<div><b id="asName"></b><small id="asRole"></small></div><span class="qi" tabindex="0" id="asAbout" style="background:rgba(255,255,255,.25);color:#fff">?</span><button class="as-x" type="button" id="asX">${ico("x","width:18px;height:18px")}</button></div>
    <div class="as-body" id="asBody" aria-live="polite"></div>
    <div class="as-foot"><textarea id="asIn" rows="1"></textarea><button class="as-send" type="button" id="asSend">${ico("send","width:20px;height:20px")}</button></div>`;
  document.body.appendChild(p);
  $("asX").addEventListener("click", panelHide);
  $("asSend").addEventListener("click", sendInput);
  $("asIn").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); sendInput(); } });
  document.addEventListener("keydown", e => { if (e.key === "Escape"){ if (G) guideEnd(); else if (!$("asPanel").hidden) panelHide(); } });
  labelAssistant();
  if (sget("fsbd-as-hello", "") !== "1") setTimeout(showHello, 2600);
}
function labelAssistant(){
  const a = at();
  $("asLaunch").setAttribute("aria-label", a.open); $("asLaunch").setAttribute("data-tip", a.helloTitle + "|" + a.hello);
  $("asPanel").setAttribute("aria-label", a.name); $("asName").textContent = a.name; $("asRole").textContent = a.role;
  $("asAbout").setAttribute("data-tip", a.about); $("asX").setAttribute("aria-label", a.close);
  $("asIn").placeholder = a.ph; $("asSend").setAttribute("aria-label", a.send);
  const h = document.querySelector(".as-hello"); if (h) h.querySelector("span").innerHTML = `<b>${esc(a.helloTitle)}</b>${esc(a.hello)}`;
}
function showHello(){
  if (!$("asPanel").hidden || G || document.querySelector(".as-hello")) return;
  const a = at(), h = document.createElement("div"); h.className = "as-hello";
  h.innerHTML = `<span><b>${esc(a.helloTitle)}</b>${esc(a.hello)}</span><button class="x" type="button" aria-label="${esc(a.close)}">${ico("x")}</button>`;
  document.body.appendChild(h);
  h.addEventListener("click", e => { if (e.target.closest(".x")){ hideHello(); return; } hideHello(); assistantOpen(); });
}
function hideHello(){ const h = document.querySelector(".as-hello"); if (h) h.remove(); sset("fsbd-as-hello", "1"); }
function panelShow(){ $("asPanel").hidden = false; $("asLaunch").hidden = innerWidth <= 520; }
function panelHide(){ $("asPanel").hidden = true; $("asLaunch").hidden = false; }
function assistantOpen(flow){
  buildAssistant(); hideHello(); panelShow();
  if (!$("asBody").children.length) bot(at().greet, menuChips());
  if (flow) runFlow(flow);
  setTimeout(() => $("asIn").focus({preventScroll:true}), 50);
}
function scrollBody(){ const b = $("asBody"); b.scrollTop = b.scrollHeight; }
function addMsg(html, me){ const d = document.createElement("div"); d.className = "as-msg" + (me ? " me" : ""); d.innerHTML = html; $("asBody").appendChild(d); scrollBody(); return d; }
function user(text){ const d = addMsg("", true); d.textContent = text.length > 600 ? text.slice(0, 600) + "…" : text; }
function bot(html, chips){
  const typing = !reduceMotion ? addMsg(`<span class="as-typing"><i></i><i></i><i></i></span>`) : null;
  const put = () => { if (typing) typing.remove(); const d = addMsg(html); if (chips && chips.length){ const c = document.createElement("div"); c.className = "as-chips"; chips.forEach(ch => { const b = document.createElement("button"); b.type = "button"; b.className = "as-chip" + (ch.red ? " red" : ""); b.innerHTML = (ch.icon ? ico(ch.icon) : "") + esc(ch.label); b.addEventListener("click", () => { user(ch.label); ch.fn(); }); c.appendChild(b); }); d.appendChild(c); } scrollBody(); };
  if (typing) setTimeout(put, 420); else put();
}
function menuChips(){
  const m = at().menu, f = k => () => runFlow(k);
  return [{label:m.msg, icon:"chat", fn:f("msg")}, {label:m.link, icon:"link", fn:f("link")}, {label:m.file, icon:"package", fn:f("file")}, {label:m.login, icon:"key", fn:f("login")}, {label:m.pass, icon:"lock", fn:f("pass")}, {label:m.lost, icon:"alert", red:true, fn:f("lost")}, {label:m.tour, icon:"sparkle", fn:f("tour")}, {label:m.more, icon:"chev", fn:f("more")}];
}
function moreChips(){
  const m = at().menu, f = k => () => runFlow(k);
  return [{label:m.call, icon:"phone", fn:f("call")}, {label:m.qr, icon:"qr", fn:f("qr")}, {label:m.level, icon:"sprout", fn:f("level")}, {label:m.learn, icon:"book", fn:f("learn")}, {label:m.shield, icon:"shield", fn:f("shield")}, {label:m.web, icon:"code", fn:f("web")}, {label:m.it, icon:"radar", fn:f("it")}, {label:m.privacy, icon:"lock", fn:f("privacy")}];
}
function runFlow(k){
  const a = at(); asMode = null;
  const pasteChat = {label:a.pasteHere, icon:"chat", fn:() => { asMode = "chat"; bot(a.pasteChat); $("asIn").focus(); }};
  if (k === "msg" || k === "call") return bot(k === "msg" ? a.msg : a.call, [{label:a.showMe, icon:"arrow", fn:() => guideStart("chat")}, pasteChat, {label:a.tryEx, icon:"play", fn:() => guideStart("chatEx")}]);
  if (k === "link"){ asMode = "link"; return bot(a.link, [{label:a.showMe, icon:"arrow", fn:() => guideStart("link")}, {label:a.tryEx, icon:"play", fn:() => guideStart("linkEx")}]); }
  if (k === "file") return bot(a.file, [{label:a.showMe, icon:"arrow", fn:() => guideStart("file")}, {label:a.tryEx, icon:"play", fn:() => guideStart("fileEx")}]);
  if (k === "qr") return bot(a.qr, [{label:a.showMe, icon:"arrow", fn:() => guideStart("qr")}]);
  if (k === "lost") return bot(`<b style="color:var(--high)">${esc(a.lostTitle)}</b><ol>${a.lost.map(x => `<li>${x}</li>`).join("")}</ol>`, [{label:a.makeReport, icon:"file", fn:reportFlow}, {label:a.back, icon:"left", fn:() => bot(a.greet, menuChips())}]);
  if (k === "tour") return guideStart(WK.on ? "wsTour" : "tour");
  if (k === "more") return bot(esc(a.greet), moreChips());
  if (k === "login") return bot(esc(a.loginQ), [{label:a.showMe, icon:"arrow", fn:() => guideStart("login")}, {label:a.tryEx, icon:"play", fn:() => guideStart("loginEx")}]);
  if (k === "pass") return bot(esc(a.passQ), [{label:a.openPass, icon:"lock", fn:() => { panelHide(); tryFeature("pass"); }}, {label:a.makePw, icon:"wand", fn:() => { panelHide(); tryFeature("pass"); setTimeout(() => $("pwMake").click(), 350); }}, {label:a.learn2fa, icon:"book", fn:() => openLesson("twofa", ["twofa","pwhash"])}]);
  const openLabTab = tab => () => { panelHide(); labOpen = true; labTab = tab; if (WK.on) return wsFocusLab(tab); renderLab(); $("lab").scrollIntoView({behavior:"smooth"}); };
  if (k === "web") return bot(esc(a.webQ), [{label:a.openHdr, icon:"globe", fn:openLabTab("headers")}, {label:a.openCode, icon:"code", fn:openLabTab("code")}, {label:a.openPage, icon:"mail", fn:openLabTab("page")}, {label:lv().lessons.xss[0], icon:"book", fn:() => openLesson("xss", ["xss","sqli","csrf","clickjack","cookies"])}]);
  if (k === "shield") return bot(esc(a.shieldQ), [{label:a.openShield, icon:"shield", fn:() => { panelHide(); tryFeature("shield"); }}, {label:lv().lessons.clickjack[0], icon:"book", fn:() => openLesson("clickjack", ["clickjack","csrf","bitb"])}]);
  if (k === "it") return bot(esc(a.itQ), [{label:a.openLab, icon:"radar", fn:() => { panelHide(); tryFeature("lab"); }}, {label:a.tryMitm, icon:"wifi", fn:() => guideStart("labNet")}, {label:a.tryDdos, icon:"activity", fn:() => guideStart("labLogs")}, {label:lv().levels.expert[0], icon:"terminal", fn:() => { setLevel("expert", true); bot(esc(a.levelSet)); }}]);
  if (k === "level") return bot(esc(a.levelAsk), ["simple","learn","expert"].map(x => ({label:lv().levels[x][0] + " · " + lv().levels[x][1], icon:{simple:"sprout", learn:"book", expert:"terminal"}[x], fn:() => { setLevel(x, true); bot(esc(a.levelSet)); }})));
  if (k === "learn"){ const ids = Object.keys(lv().lessons); return bot(esc(a.learnAsk), ids.map(id => ({label:lv().lessons[id][0], icon:"bulb", fn:() => openLesson(id, ids)}))); }
  if (k === "privacy") return bot(esc(a.privacy), [{label:a.openSettings, icon:"shieldok", fn:() => { panelHide(); $("privacy").scrollIntoView({behavior:"smooth"}); const d = $("settings").querySelector("details"); if (d) d.open = true; }}, {label:a.back, icon:"left", fn:() => bot(a.greet, menuChips())}]);
}
function reportFlow(){
  if (current && current.id === "custom"){ panelHide(); setTab("chat"); openReport(); return; }
  asMode = "chatReport"; bot(at().pasteChat); $("asIn").focus();
}
function sendInput(){ const v = $("asIn").value; if (!v.trim()) return; $("asIn").value = ""; understand(v); }
const INTENTS = [
  ["lost", /(already (gave|sent|shared)|i (gave|sent|shared)|scammed|lost (my )?money|দিয়ে ফেলেছি|দিয়েছি|পাঠিয়ে ফেলেছি|পাঠিয়েছি|প্রতারিত|ঠকেছি|টাকা গেছে|টাকা চলে গেছে|taka (gese|geche|chole)|diye felechi|diye diyechi|pathiye felechi|thokechi)/i],
  ["otp", /^(what|why|should|can|is|কেন|কী|কি|দেব|দিব).{0,40}(otp|pin|পিন|কোড|code)|(otp|pin|পিন|কোড)\s*(dibo|debo|দেব|দিব|দেওয়া|দিলে)/i],
  ["link", /(link|লিংক|url|website|ওয়েবসাইট|site)/i],
  ["file", /(apk|app|অ্যাপ|file|ফাইল|install|ইনস্টল|update|আপডেট)/i],
  ["qr", /(qr|কিউআর)/i],
  ["call", /(call|phone|ফোন|কল)/i],
  ["msg", /(sms|message|মেসেজ|chat|চ্যাট|whatsapp|messenger|imo)/i],
  ["privacy", /(privacy|data|safe\?|প্রাইভেসি|তথ্য|ডেটা|নিরাপদ|সেফ)/i],
  ["tour", /(how|help|guide|tour|show|use|কীভাবে|কিভাবে|সাহায্য|দেখাও|শেখাও|ব্যবহার)/i],
  ["thanks", /(thank|ধন্যবাদ|thanks|tnx)/i],
  ["greet", /^(hi|hello|hey|salam|assalam|আসসালামু|সালাম|হাই|হ্যালো)\b/i]
];
function understand(text){
  const a = at(), t = text.trim(); user(t);
  const urls = extractUrls(t), words = t.split(/\s+/).length;
  if (asMode === "link" || (urls.length && words <= 3)) return checkLinkInline(urls[0] || t);
  if (asMode === "chat" || asMode === "chatReport" || t.includes("\n") || t.length >= 60) return checkChatInline(t, asMode === "chatReport");
  for (const [k, re] of INTENTS){
    if (!re.test(t)) continue;
    if (k === "otp") return bot(esc(a.otp), menuChips().slice(0, 3));
    if (k === "thanks") return bot(esc(a.thanks));
    if (k === "greet") return bot(a.greet, menuChips());
    return runFlow(k);
  }
  bot(esc(a.fallback), menuChips());
}
function checkChatInline(text, thenReport){
  asMode = null;
  const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 100);
  const turns = lines.map(l => /^(আমি|me)\s*:/i.test(l) ? ["me", l.replace(/^(আমি|me)\s*:\s*/i, "")] : ["o", l]);
  const r = runConversation({id:"as", sender:"", senderType:"unknown", turns});
  const last = [...r.perTurn].reverse().find(p => p.who !== "me") || r.perTurn[r.perTurn.length - 1];
  const t = tx(), a = at(), v = last.verdict, top = last.contrib.filter(c => c[1] > 0)[0];
  const g = guidance(new Set(last.contrib.map(c => c[0])))[0];
  const card = getLevel() === "simple" ? `<div class="as-card v-${v}"><b>${esc(lv().simpleTitle[v])}</b>${plainChatReasons(last, 2).map(x => esc(x[1])).join("<br>")}<br>${esc(a.doNow)}: ${esc(t.todoL[g][0])}</div>` : `<div class="as-card v-${v}"><b>${esc(t.v[v][0])}</b>${esc(a.reason)}: ${esc(top ? sl(top[0]) : t.lowReasons[0][0])}<br>${esc(a.doNow)}: ${esc(t.todoL[g][0])}</div>`;
  const openFull = rep => { $("chat").value = lines.join("\n"); senderType = "unknown"; applySender(); if (innerWidth <= 520) panelHide(); analyzeInput(); setTab("chat"); if (rep) openReport(); else goCheck(); };
  if (thenReport){ bot(card); openFull(true); return; }
  bot(card, [{label:a.seeFull, icon:"arrow", fn:() => openFull(false)}, {label:a.makeReport, icon:"file", fn:() => openFull(true)}]);
}
function checkLinkInline(u){
  asMode = null;
  const t = tx(), a = at(), r = inspectUrl(u, {trusted:trustList()});
  if (r.status !== "complete") return bot(esc(t.linkErr[r.notices[0]] || t.linkErr.malformed), menuChips().slice(0, 3));
  const card = getLevel() === "simple" ? `<div class="as-card v-${r.verdict}"><b>${esc(lv().simpleTitle[r.verdict])}</b>${plainLinkMain(r).slice(0, 2).map(x => esc(x[1])).join("<br>")}<br>${esc(a.doNow)}: ${esc(t.linkActShort[r.action])}</div>` : `<div class="as-card v-${r.verdict}"><b>${esc(t.linkV[r.category][0])}</b>${esc(t.realSite)}: <code>${esc(r.reg)}</code>${r.lookalikeOf ? `<br>${esc(t.pretends)}: ${esc(r.lookalikeOf)}` : ""}<br>${esc(a.doNow)}: ${esc(t.linkActShort[r.action])}</div>`;
  bot(card, [{label:a.seeDetails, icon:"arrow", fn:() => { $("linkIn").value = u; if (innerWidth <= 520) panelHide(); runLink(u); goCheck(); }}]);
}
document.addEventListener("fs:lang", () => { if (asBuilt) labelAssistant(); if (G) renderStep(); });
buildAssistant();
