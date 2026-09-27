/* ================= UI logic ================= */
const VERSION = "1.2";
T.en.linkErr = {empty:"Paste a link first.", too_long:"That link is too long to check safely.", control:"That link has hidden control characters. Don't open it.", malformed:"That doesn't look like a web link.", scheme:"This isn't a web link (only http and https are checked)."};
T.bn.linkErr = {empty:"আগে একটা লিংক পেস্ট করুন।", too_long:"লিংকটা এত লম্বা যে সেফভাবে চেক করা যায় না।", control:"লিংকে লুকানো অদ্ভুত অক্ষর আছে। খুলবেন না।", malformed:"এটা ওয়েব লিংকের মতো লাগছে না।", scheme:"এটা ওয়েব লিংক না (শুধু http আর https চেক করি)।"};
T.en.bands = {"under 1 MB":"under 1 MB", "1–10 MB":"1–10 MB", "10–50 MB":"10–50 MB"};
T.bn.bands = {"under 1 MB":"১ MB-এর কম", "1–10 MB":"১–১০ MB", "10–50 MB":"১০–৫০ MB"};
T.en.fromQR = "Found inside your QR code"; T.bn.fromQR = "আপনার QR কোডের ভেতরে পাওয়া";
T.en.close = "Close"; T.bn.close = "বন্ধ করুন";
T.en.showsAs = u => `On screen it looks like “${u}”, but some letters are from another alphabet.`; T.bn.showsAs = u => `স্ক্রিনে দেখায় “${u}”, কিন্তু কিছু অক্ষর অন্য বর্ণমালার।`;

let LANG = "en";
const sget = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } };
const sset = (k, v) => { try { localStorage.setItem(k, v); } catch(e){} };
const sdel = k => { try { localStorage.removeItem(k); } catch(e){} };
{ const s = sget("fsbd-lang", ""); if (s === "en" || s === "bn") LANG = s; else if ((navigator.language || "").toLowerCase().startsWith("bn")) LANG = "bn"; }
const $ = id => document.getElementById(id);
const tx = () => T[LANG], sl = s => SIG[s][LANG];
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function num(n){ return LANG === "bn" ? String(n).replace(/\d/g, d => BD[d]) : String(n); }
const tip = (title, body) => `data-tip="${esc(body ? title + "|" + body : title)}"`;
const tipS = s => tip(...String(s).split("|"));
const VC = {high:{c:"--high",g:"linear-gradient(135deg,#FF7A7D,#E5383B)"}, verify:{c:"--verify",g:"linear-gradient(135deg,#FBBF24,#D97706)"}, low:{c:"--low",g:"linear-gradient(135deg,#34D399,#16A34A)"}, abstain:{c:"--muted",g:"linear-gradient(135deg,#94A3B8,#64748B)"}};
function toast(m){ const t = $("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2800); }
function copyText(txt, okMsg, node){ const fail = () => { if (node){ const rg = document.createRange(); rg.selectNodeContents(node); const s = getSelection(); s.removeAllRanges(); s.addRange(rg); } toast(tx().copyFail || tx().repCopyFail); }; try { navigator.clipboard.writeText(txt).then(() => toast(okMsg), fail); } catch(e){ fail(); } }
function defangText(s){ for (const u of extractUrls(s)) s = s.split(u).join(defang(u)); return s; }
function highlight(text, found){
  const disp = maskText(text), sx = tx().sigx;
  const spans = found.filter(f => SIG[f.sig]).sort((a,b) => a.s-b.s || b.e-a.e);
  const kept = []; let end = -1;
  for (const f of spans){ if (f.s >= end){ kept.push(f); end = f.e; } }
  let out = "", i = 0;
  for (const f of kept){ out += esc(disp.slice(i, f.s)) + `<mark class="ev" tabindex="0" style="--c:var(${SIG[f.sig].c})" ${tip(sl(f.sig), sx[f.sig] || "")}>${esc(disp.slice(f.s, f.e))}</mark>`; i = f.e; }
  return out + esc(disp.slice(i));
}

/* ---------- tooltips (hover, focus, tap) ---------- */
const tipEl = $("tip"); let tipOwner = null, tipTimer = null;
function showTip(el){
  const raw = el.getAttribute("data-tip"); if (!raw) return;
  const k = raw.indexOf("|");
  tipEl.innerHTML = k > 0 ? `<b>${esc(raw.slice(0,k))}</b><br>${esc(raw.slice(k+1))}` : esc(raw);
  tipEl.classList.add("on"); tipOwner = el;
  const r = el.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  const left = Math.min(Math.max(8, r.left + r.width/2 - w/2), innerWidth - w - 8);
  let top = r.top - h - 10; if (top < 8) top = r.bottom + 10;
  tipEl.style.left = left + "px"; tipEl.style.top = top + "px";
}
function hideTip(){ tipEl.classList.remove("on"); tipOwner = null; clearTimeout(tipTimer); }
document.addEventListener("pointerover", e => { if (e.pointerType !== "mouse") return; const el = e.target.closest("[data-tip]"); if (el && el !== tipOwner) showTip(el); else if (!el && tipOwner) hideTip(); });
document.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; const el = e.target.closest("[data-tip]"); if (el){ showTip(el); clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 3400); } else hideTip(); });
document.addEventListener("focusin", e => { const el = e.target.closest && e.target.closest("[data-tip]"); if (el) showTip(el); });
document.addEventListener("focusout", hideTip);
addEventListener("scroll", () => { if (tipOwner) hideTip(); }, {passive:true});

/* ---------- state ---------- */
let current = null, result = null, turnIdx = 0, playing = null, senderType = "unknown", showBase = false, activeEx = null, detOpen = {c:true, s:false, e:false};
let showAllEx = false, showAllLinkEx = false, linkDetOpen = false, fileDetOpen = false;
let view = "chat", linkRes = null, fileRes = null, qrRes = null, qrText = null, seenPats = new Set();
const session = {links:[], files:[]};
const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
let slideIdx = 0, slideTimer = null, autoplay = !reduceMotion;
const onlineMode = () => { const m = sget("fsbd-online", "ask"); return ["ask","always","off"].includes(m) ? m : "ask"; };
const trustList = () => { try { const a = JSON.parse(sget("fsbd-trust", "[]")); return Array.isArray(a) ? a.filter(x => typeof x === "string").slice(0, 100) : []; } catch(e){ return []; } };
const testSig = () => sget("fsbd-testsig", "0") === "1";

/* ---------- static render ---------- */
function applyStatic(){
  const t = tx();
  document.documentElement.lang = LANG;
  $("links").innerHTML = t.nav.map(([h,l]) => `<a href="${h}">${esc(l)}</a>`).join("");
  $("navCta").innerHTML = `${ico("shieldok","width:18px;height:18px")} ${esc(t.navCta)}`;
  $("l-en").setAttribute("aria-pressed", String(LANG === "en")); $("l-bn").setAttribute("aria-pressed", String(LANG === "bn"));
  $("track").innerHTML = t.slides.map((s,i) => `<div class="slide-wrap" role="group" aria-roledescription="slide" aria-label="${esc(t.slideN(i+1))}"><div class="slide">
    <div><span class="tag"><i></i>${esc(s.tag)}</span>${i === 0 ? `<h1 class="ht">${s.t}</h1>` : `<h2 class="ht">${s.t}</h2>`}<p>${esc(s.p)}</p>
    <div class="cta-row">${s.a.map((a,j) => `<button class="pill ${j === 0 ? "sky" : "ghost"}" type="button" data-go="${a[0]}">${j === 0 ? "" : ico("play","width:18px;height:18px")} ${esc(a[1])} ${j === 0 ? ico("arrow","width:18px;height:18px") : ""}</button>`).join("")}</div></div>
    <div class="art">${ART[s.art]}</div></div></div>`).join("");
  $("track").querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => tryFeature(b.dataset.go)));
  $("prev").innerHTML = ico("left"); $("next").innerHTML = ico("right");
  renderDots(); goSlide(slideIdx);
  $("svTitle").textContent = t.svTitle;
  $("svGrid").innerHTML = t.services.map(s => `<button class="sv" type="button" data-sv="${s.id}" style="--g:linear-gradient(135deg,${s.g[0]},${s.g[1]});--c:${s.g[1]}" ${tipS(s.tip)}>${s.badge ? `<span class="badge ${s.id === "net" ? "soon" : "new"}">${esc(s.badge)}</span>` : ""}<span class="ring">${ico(s.icon)}</span>${esc(s.label)}</button>`).join("");
  $("svGrid").querySelectorAll("[data-sv]").forEach(b => b.addEventListener("click", () => tryFeature("sv_" + b.dataset.sv)));
  $("chTitle").textContent = t.chTitle; $("chSub").textContent = t.chSub;
  document.body.classList.remove("lv-simple","lv-learn","lv-expert"); document.body.classList.add("lv-" + getLevel()); renderLevels();
  renderTabs();
  $("chatLbl").innerHTML = `${esc(t.chatLbl)} <span class="qi" tabindex="0" ${tipS(t.chatTip)}>?</span>`; $("chat").placeholder = t.chatPh;
  $("senderLbl").innerHTML = `${esc(t.senderLbl)} <span class="qi" tabindex="0" ${tipS(t.senderTip)}>?</span>`;
  $("senderSeg").innerHTML = Object.entries(t.senderOpts).map(([k,v]) => `<button type="button" data-k="${k}" aria-pressed="${k === senderType}">${esc(v)}</button>`).join("");
  $("senderSeg").querySelectorAll("button").forEach(b => b.addEventListener("click", () => { senderType = b.dataset.k; applySender(); }));
  applySender();
  $("goBtn").innerHTML = `${ico("shieldok")} ${t.go}`;
  renderExamples();
  $("linkPic").innerHTML = ART.linktool;
  $("linkLbl").innerHTML = `${esc(t.linkLbl)} <span class="qi" tabindex="0" ${tipS(t.linkTip)}>?</span>`; $("linkIn").placeholder = t.linkPh;
  $("linkGo").innerHTML = `${ico("search")} ${t.linkGo}`;
  renderLinkEx();
  $("filePic").innerHTML = ART.filedrop; $("fileCta").textContent = t.fileCta; $("fileLimit").textContent = t.fileLimit;
  $("fileEx").innerHTML = `<span class="small" style="align-self:center;font-weight:700">${esc(t.fileExLbl)}</span>` + t.fileEx.map(x => `<button class="ex" type="button" data-fe="${x[0]}" ${tipS(t.fileSampleTip)}><i style="background:var(${x[0] === "calc" ? "--verify" : "--high"})"></i>${esc(x[1])}</button>`).join("");
  $("fileEx").querySelectorAll("[data-fe]").forEach(b => b.addEventListener("click", () => runSample(b.dataset.fe)));
  $("fileNote").innerHTML = `<span tabindex="0" ${tipS(t.fileNoteTip)} style="display:flex;gap:8px;align-items:center">${ico("lock")}<span>${esc(t.fileNote)}</span></span>`;
  $("qrPic").innerHTML = ART.qr; $("qrCta").textContent = t.qrCta; $("qrHelp").textContent = t.qrHelp; $("qrLib").textContent = window.jsQR ? t.qrReady : "";
  $("ftTitle").textContent = t.ftTitle; $("ftSub").textContent = t.ftSub;
  $("strip").innerHTML = t.feats.map((f,i) => { const st = t.stateOf[f[1]]; return `<button class="svc" type="button" data-i="${i}" style="--g:linear-gradient(135deg,${f[5]},${f[6]});--c:${f[6]}" ${tip(f[2] + " · " + t.states[st], f[3])}><span class="ring">${ico(f[0])}</span>${esc(f[2])}<small>${f[1] === "NEW" ? `<span class="new">NEW</span>` : f[1] === "NET" ? "" : `<span class="fcode">${f[1]}</span>`} <span class="${st === "offline" ? "new" : "soon"}" style="${st === "offline" ? "background:var(--mint)" : ""}">${esc(t.states[st])}</span></small></button>`; }).join("");
  $("strip").querySelectorAll(".svc").forEach(b => b.addEventListener("click", () => tryFeature(tx().feats[+b.dataset.i][4])));
  if (!$("featInfo").hidden) showNet();
  $("scTitle").textContent = t.scTitle; $("scSub").textContent = t.scSub;
  $("scamCards").innerHTML = t.scams.map((c,i) => `<article class="icard" tabindex="0" data-i="${i}"><span class="flag">${esc(t.scamFlag)}${c.isNew ? " · NEW" : ""}</span><div class="pic">${ART[c.art]}</div><h3>${esc(c.t)}</h3><p>${esc(c.p)}</p>
    <div class="reveal"><h4>${esc(t.howT)}</h4><ul>${c.how.map(h => `<li>${esc(h)}</li>`).join("")}</ul><button class="pill white sm" type="button" data-try="${c.id}">${ico("play","width:16px;height:16px")} ${esc(t.tryIt)}</button></div></article>`).join("");
  $("scamCards").querySelectorAll(".icard").forEach(c => c.addEventListener("click", e => { if (e.target.closest("[data-try]")) return; c.classList.toggle("open"); }));
  $("scamCards").querySelectorAll("[data-try]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); tryFeature(b.dataset.try); }));
  $("bdTitle").textContent = t.bdTitle; $("bdSub").textContent = t.bdSub; $("phoneSub").textContent = t.phoneSub; $("bdSrc").innerHTML = `<span tabindex="0" ${tipS(t.bdSrcTip)}>${ico("info","width:16px;height:16px;vertical-align:-3px")} ${esc(t.bdSrcTip.split("|")[0])}</span>`;
  $("stats").innerHTML = t.stats.map(s => `<div class="stat" tabindex="0" ${tipS(s[2])}><b${/^\d+\.\d+$/.test(s[0]) ? ` data-to="${s[0]}"` : ""}>${s[0]}</b><span>${esc(s[1])}</span></div>`).join("");
  $("tpTitle").textContent = t.tpTitle; $("tpSub").textContent = t.tpSub;
  $("tipCards").innerHTML = t.tips.map(c => `<div class="tip-card" tabindex="0" ${tip(c[1], c[2])}><div class="pic">${ART[c[0]]}</div><h3>${esc(c[1])}</h3></div>`).join("");
  $("pvPic").innerHTML = ART.privacy; $("pvTitle").textContent = t.pvTitle; $("pvSub").textContent = t.pvSub;
  $("pvList").innerHTML = t.pv.map(p => `<div class="pi" tabindex="0" ${tip(p[1], p[2])}>${ico(p[0])}<span>${esc(p[1])}</span></div>`).join("");
  renderSettings();
  applyLoginStatic(); applyPwStatic(); renderLab(); renderShield();
  $("foot").innerHTML = t.foot;
  ["chSub","scSub","ftSub","tpSub","pvSub","bdSub"].forEach(id => { const e = $(id); if (e) e.hidden = !e.textContent.trim(); });
}
function renderTabs(){
  const t = tx(), tabs = [["chat","chat"],["link","link"],["login","key",1],["pass","lock",1],["file","package"],["qr","qr"]];
  $("tabs").innerHTML = tabs.map(([k,ic,isNew]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${view === k}">${isNew ? `<span class="new">NEW</span>` : ""}${ico(ic)}<span>${esc(k === "login" ? lb().tab : k === "pass" ? ws().pwTab : t.tabs[k])}</span></button>`).join("");
  $("tabs").querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
}
function applySender(){
  const t = tx(), v = $("senderVal");
  $("senderSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === senderType)));
  v.hidden = senderType === "unknown"; v.placeholder = t.senderPh[senderType] || "";
}
const SCAMS = ["s1","s9","s12","s11","s3","s4","s6","s7"], REALS = ["s2","s10","s8","s5"];
function renderExamples(){
  const t = tx(), MAIN = ["s1","s9","s10","s4"];
  const mk = (ids, col, tp) => ids.map(id => { const s = SCEN.find(x => x.id === id); return `<button class="ex" type="button" data-id="${id}" aria-pressed="${activeEx === id}" ${tipS(tp)}><i style="background:var(${col})"></i>${esc(s[LANG])}</button>`; }).join("");
  const scams = showAllEx ? SCAMS : SCAMS.filter(x => MAIN.includes(x)), reals = showAllEx ? REALS : REALS.filter(x => MAIN.includes(x));
  const hidden = SCAMS.length + REALS.length - scams.length - reals.length;
  $("exs").innerHTML = mk(scams, "--high", t.exScamTip) + mk(reals, "--low", t.exRealTip) + `<button class="ex more" type="button" id="exMore">${esc(showAllEx ? t.less : t.more(num(hidden)))}</button>`;
  $("exs").querySelectorAll(".ex[data-id]").forEach(b => b.addEventListener("click", () => loadExample(b.dataset.id)));
  $("exMore").addEventListener("click", () => { showAllEx = !showAllEx; renderExamples(); });
}
function renderLinkEx(){
  const t = tx(), MAIN = [0, 2, 6], idx = t.linkEx.map((x,i) => i).filter(i => showAllLinkEx || MAIN.includes(i));
  $("linkEx").innerHTML = idx.map(i => `<button class="ex" type="button" data-le="${i}"><i style="background:var(${i === t.linkEx.length - 1 ? "--low" : "--high"})"></i>${esc(t.linkEx[i][0])}</button>`).join("") + `<button class="ex more" type="button" id="leMore">${esc(showAllLinkEx ? t.less : t.more(num(t.linkEx.length - MAIN.length)))}</button>`;
  $("linkEx").querySelectorAll("[data-le]").forEach(b => b.addEventListener("click", () => { const u = tx().linkEx[+b.dataset.le][1]; $("linkIn").value = u; runLink(u); }));
  $("leMore").addEventListener("click", () => { showAllLinkEx = !showAllLinkEx; renderLinkEx(); });
}
function renderSettings(){
  const t = tx(), m = onlineMode(), tl = trustList();
  const wasOpen = $("settings").querySelector("details") ? $("settings").querySelector("details").open : false;
  $("settings").innerHTML = `<details class="setdet"${wasOpen ? " open" : ""}><summary><h3>${ico("shieldok","color:var(--sky)")} ${esc(t.setTitle)}</h3><span class="chev">${ico("chev")}</span></summary><div class="setbody">
    <div class="setrow"><span class="lbl">${esc(t.onlineLbl)} <span class="qi" tabindex="0" ${tipS(t.onlineTip)}>?</span></span><div class="seg" id="onlineSeg">${Object.entries(t.onlineOpts).map(([k,v]) => `<button type="button" data-om="${k}" aria-pressed="${k === m}">${esc(v)}</button>`).join("")}</div></div>
    <div class="setrow"><label class="switch"><input type="checkbox" id="testSig"${testSig() ? " checked" : ""}> ${esc(t.testLbl)}</label><span class="qi" tabindex="0" ${tipS(t.testTip)}>?</span></div>
    <div class="setrow" style="align-items:flex-start"><span class="lbl">${esc(t.trustLbl)}</span><div class="trusted">${tl.length ? tl.map(d => `<span>${esc(d)}<button type="button" data-untrust="${esc(d)}" aria-label="remove">×</button></span>`).join("") : `<span class="small" style="background:none;font-family:var(--body)">${esc(t.trustNone)}</span>`}</div></div>
    <div class="setrow"><button class="pill danger sm" type="button" id="wipe">${ico("trash","width:18px;height:18px")} ${esc(t.wipe)}</button><span class="small" id="wipeMsg" role="status"></span></div></div></details>`;
  $("onlineSeg").querySelectorAll("[data-om]").forEach(b => b.addEventListener("click", () => { sset("fsbd-online", b.dataset.om); renderSettings(); if (view === "link" || view === "qr") renderView(); }));
  $("testSig").addEventListener("change", e => sset("fsbd-testsig", e.target.checked ? "1" : "0"));
  $("settings").querySelectorAll("[data-untrust]").forEach(b => b.addEventListener("click", () => setTrust(b.dataset.untrust, false)));
  $("wipe").addEventListener("click", wipeAll);
}
function setTrust(domain, on){
  let tl = trustList().filter(d => d !== domain); if (on) tl.push(domain);
  sset("fsbd-trust", JSON.stringify(tl)); toast(on ? tx().trustedToast : tx().untrustedToast);
  if (linkRes && linkRes.reg === domain) runLink(linkRes.raw, {keepView:true});
  if (qrRes && qrRes.reg === domain) { qrRes = inspectUrl(qrRes.raw, {trusted:trustList()}); renderView(); }
  renderSettings();
}
function wipeAll(){
  ["fsbd-feedback","fsbd-lang","fsbd-trust","fsbd-online","fsbd-testsig","fsbd-profile","fsbd-lastprof","fsbd-level"].forEach(sdel);
  session.links.length = 0; session.files.length = 0;
  $("report").hidden = true; $("chat").value = ""; $("linkIn").value = ""; result = null; linkRes = null; fileRes = null; qrRes = null; qrText = null;
  renderView(); renderSettings(); $("wipeMsg").textContent = tx().wiped;
}

/* ---------- hero carousel ---------- */
function renderDots(){
  const t = tx();
  $("dots").innerHTML = t.slides.map((s,i) => `<button type="button" aria-label="${esc(t.slideN(i+1))}" aria-current="${i === slideIdx}" data-s="${i}"></button>`).join("") +
    `<button type="button" class="ctl" id="slidePP" aria-label="${esc(autoplay ? t.pause : t.playS)}">${ico(autoplay ? "pause" : "play","width:18px;height:18px")}</button>`;
  $("dots").querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => { goSlide(+b.dataset.s); restartSlides(); }));
  $("slidePP").addEventListener("click", () => { autoplay = !autoplay; renderDots(); restartSlides(); });
}
function goSlide(i){
  const n = tx().slides.length; slideIdx = (i + n) % n;
  $("track").style.transform = `translateX(${-100 * slideIdx}%)`;
  $("track").querySelectorAll(".slide-wrap").forEach((w,k) => { const on = k === slideIdx; w.setAttribute("aria-hidden", String(!on)); if (on) w.removeAttribute("inert"); else w.setAttribute("inert", ""); });
  $("dots").querySelectorAll("[data-s]").forEach((b,k) => b.setAttribute("aria-current", String(k === slideIdx)));
}
function restartSlides(){ clearInterval(slideTimer); if (autoplay) slideTimer = setInterval(() => goSlide(slideIdx + 1), 6000); }

/* ---------- routing of actions ---------- */
const goCheck = () => $("check").scrollIntoView({behavior:"smooth"});
function tryFeature(what){
  const t = tx();
  if (what === "sv_chat" || what === "chat"){ setTab("chat"); goCheck(); setTimeout(() => $("chat").focus({preventScroll:true}), 500); return; }
  if (what === "sv_link"){ setTab("link"); goCheck(); setTimeout(() => $("linkIn").focus({preventScroll:true}), 500); return; }
  if (what === "sv_file"){ setTab("file"); goCheck(); return; }
  if (what === "sv_qr" || what === "qr"){ setTab("qr"); goCheck(); return; }
  if (what === "sv_report" || what === "report"){ loadExample("s11", {scroll:false, then: () => openReport()}); return; }
  if (what === "sv_pass" || what === "pass"){ setTab("pass"); goCheck(); setTimeout(() => $("pwIn").focus({preventScroll:true}), 500); return; }
  if (what === "sv_shield" || what === "shield"){ $("shield").scrollIntoView({behavior:"smooth"}); return; }
  if (what === "sv_login" || what === "login"){ setTab("login"); goCheck(); setTimeout(() => $("lgIn").focus({preventScroll:true}), 500); return; }
  if (what === "sv_lab" || what === "lab"){ labOpen = true; renderLab(); $("lab").scrollIntoView({behavior:"smooth"}); return; }
  if (what === "sv_tips"){ $("tips").scrollIntoView({behavior:"smooth"}); return; }
  if (what === "sv_help"){ assistantOpen("lost"); return; }
  if (what === "sv_net" || what === "net"){ showNet(); $("features").scrollIntoView({behavior:"smooth"}); return; }
  if (what === "privacy"){ $("privacy").scrollIntoView({behavior:"smooth"}); return; }
  if (what === "demo") what = "s1";
  if (what === "linkSample"){ const u = t.linkEx[2][1]; setTab("link"); $("linkIn").value = u; runLink(u); goCheck(); return; }
  if (what === "fileSample"){ setTab("file"); runSample("fake"); goCheck(); return; }
  if (what === "pattern"){ loadExample("s9", {scroll:false, then: () => openReport()}); return; }
  loadExample(what, {scroll:false}); goCheck();
  if (what === "s1") setTimeout(replay, 700);
}
function setTab(which){
  view = which;
  $("tabs").querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === which)));
  $("paneChat").hidden = which !== "chat"; $("paneLink").hidden = which !== "link"; $("paneFile").hidden = which !== "file"; $("paneQR").hidden = which !== "qr"; $("paneLogin").hidden = which !== "login"; $("panePass").hidden = which !== "pass";
  renderView();
}
function emptyCard(kind, art){ const e = tx().empty[kind]; return `<div class="empty"><div style="max-width:230px;margin:0 auto 10px">${art}</div><h3 style="margin:0 0 4px;font:800 22px var(--disp)">${esc(e[0])}</h3><p class="small" style="margin:0;font-size:15px">${esc(e[1])}</p></div>`; }
function renderView(){
  if (view === "chat") return renderResult();
  if (view === "link") return renderLink(linkRes, ART.hero2, "link");
  if (view === "file") return renderFile();
  if (view === "login") return renderLogin();
  if (view === "pass") return renderPw();
  if (view === "qr"){
    if (qrRes) return renderLink(qrRes, ART.qr, "qr");
    if (qrText !== null){ $("result").innerHTML = `<div class="empty"><div style="max-width:200px;margin:0 auto">${ART.qr}</div><p style="margin:10px 0 0">${esc(tx().qrText)}</p><p class="small"><code>${esc(maskText(qrText).slice(0, 300))}</code></p></div>`; emitRendered("qr"); return; }
    $("result").innerHTML = emptyCard("qr", ART.qr);
  }
}

/* ---------- chat checker ---------- */
function loadExample(id, opts){
  const sc = SCEN.find(x => x.id === id); if (!sc) return; activeEx = id;
  const mePrefix = LANG === "bn" ? "আমি: " : "me: ";
  $("chat").value = sc.turns.map(([w,t]) => (w === "me" ? mePrefix : "") + t).join("\n");
  senderType = sc.senderType; $("senderVal").value = sc.sender || ""; applySender();
  renderExamples();
  analyze({id, en:sc.en, bn:sc.bn, kind:sc.kind, sender:sc.sender, senderType:sc.senderType, turns:sc.turns}, opts);
}
function analyzeInput(){
  const lines = $("chat").value.split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 200);
  if (!lines.length){ $("chat").focus(); return; }
  const turns = lines.map(l => /^(আমি|me)\s*:/i.test(l) ? ["me", l.replace(/^(আমি|me)\s*:\s*/i, "").slice(0, 2000)] : ["o", l.replace(/^\[QR\]\s*/, "").slice(0, 2000)]);
  activeEx = null; renderExamples();
  analyze({id:"custom", en:"Your chat", bn:"আপনার চ্যাট", kind:"custom", sender: senderType === "unknown" ? "" : $("senderVal").value.trim().slice(0, 60), senderType, turns});
}
function analyze(sc, opts){
  stop(); current = sc; result = runConversation(sc); turnIdx = sc.turns.length; seenPats = new Set(matchPatterns(result.perTurn, turnIdx).map(p => p.id));
  $("report").hidden = true;
  if (view !== "chat") setTab("chat"); else renderResult();
  if (!opts || opts.scroll !== false){ const r = $("result").getBoundingClientRect(); if (r.top < 60 || r.top > window.innerHeight - 120) $("result").scrollIntoView({behavior:"smooth", block:"start"}); }
  if (opts && opts.then) opts.then();
}
function gauge(score){
  const p = Math.round(score * 100);
  return `<svg class="gauge" viewBox="0 0 128 84" role="img" aria-label="${p}/100" tabindex="0" ${tipS(tx().gaugeTip)}><path d="M14 72a50 50 0 0 1 100 0" pathLength="100" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="12" stroke-linecap="round"/><path d="M14 72a50 50 0 0 1 100 0" pathLength="100" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="${Math.max(2,p)} 100"/><text x="64" y="64" text-anchor="middle" font-size="30" font-weight="800" fill="#fff" font-family="Baloo Da 2, sans-serif">${num(p)}</text><text x="64" y="82" text-anchor="middle" font-size="10" fill="#fff" opacity=".9">/100</text></svg>`;
}

/* ---------- calm verdict header (soft tint + score ring, no loud colour blocks) ---------- */
const RING = {high:"#E07A6B", verify:"#E3A74F", low:"#46B394", abstain:"#94A8BC"};
const FAM_ICON = {credential:"lock", action:"taka", url:"link", identity:"user", urgency:"alert", lure:"star", secrecy:"eyeoff", manipulation:"eyeoff", benign_counterevidence:"shieldok"};
function ring(v, score){
  const c = RING[v] || RING.abstain, R = 40, C = 2 * Math.PI * R;
  if (score == null){
    const mark = v === "high" ? '<path d="M-11-11 11 11M11-11-11 11" stroke-width="7"/>' : v === "verify" ? '<path d="M0-14V3" stroke-width="7"/><circle cy="13" r="4" stroke="none" fill="' + c + '"/>' : v === "low" ? '<path d="M-13 1-4 10 13-9" stroke-width="7"/>' : '<path d="M-7-7a7 7 0 1 1 7 7v4" stroke-width="6"/><circle cy="13" r="3.5" stroke="none" fill="' + c + '"/>';
    return `<svg class="vring" viewBox="-50 -50 100 100" aria-hidden="true"><circle r="${R}" fill="#fff" stroke="${c}" stroke-opacity=".25" stroke-width="10"/><g stroke="${c}" fill="none" stroke-linecap="round" stroke-linejoin="round">${mark}</g></svg>`;
  }
  const p = Math.max(2, Math.round(score * 100));
  return `<svg class="vring" viewBox="-50 -50 100 100" role="img" aria-label="${p}/100" tabindex="0" ${tipS(tx().gaugeTip)}><circle r="${R}" fill="#fff" stroke="#E3EEF7" stroke-width="10"/><circle r="${R}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(C * p / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/><text y="6" text-anchor="middle" font-size="24" font-weight="800" fill="#0B2545" font-family="Baloo Da 2, sans-serif">${num(p)}</text><text y="22" text-anchor="middle" font-size="9" fill="#4B6584">/100</text></svg>`;
}
function vhead(v, title, sub, extra, score){
  return `<div class="banner v-${v}">${ring(v, score)}<div class="vtext"><h3><i></i>${esc(title)}</h3><p>${esc(sub)}</p>${extra || ""}</div></div>`;
}
function lastOther(){ const pts = result.perTurn.slice(0, turnIdx); return [...pts].reverse().find(x => x.who !== "me") || pts[pts.length-1]; }
const TODO_ICON = {cred:"lock", install:"app", link:"link", money:"taka", wrong:"refresh", verify:"phone", ident:"card", manip:"eyeoff", none:"shieldok"};
function renderResult(){
  if (view !== "chat") return;
  const t = tx(), el = $("result");
  if (!result){ el.innerHTML = emptyCard("chat", ART.hero3); return; }
  if (getLevel() === "simple") return renderSimpleChat();
  const pts = result.perTurn.slice(0, turnIdx), last = lastOther(), v = last.verdict, vc = VC[v];
  const seen = new Set(last.contrib.map(c => c[0]));
  const pos = last.contrib.filter(c => c[1] > 0).slice(0, 4);
  const pats = matchPatterns(result.perTurn, turnIdx);
  pats.forEach(p => { if (!seenPats.has(p.id)){ seenPats.add(p.id); if (playing) toast(t.patToast(t.pat[p.id][0])); } });
  const reasons = (v === "low" || v === "abstain") && !pos.length
    ? t.lowReasons.map(r => `<div class="why ok" tabindex="0" ${tip(r[0], r[1])}><span class="wi">${ico("check")}</span><span>${esc(r[0])}</span></div>`).join("")
    : pos.slice(0, 3).map(([s,w,tt]) => `<div class="why" tabindex="0" ${tip(sl(s), (t.sigx[s] || "") + ` (${t.msg} ${num(tt)})`)}><span class="wi">${ico(FAM_ICON[SIG[s].fam] || "alert")}</span><span>${esc(sl(s))}</span><small>${esc(t.msg)} ${num(tt)}</small></div>`).join("");
  const patTags = pats.length ? `<div class="ptags"><span class="small" style="font-weight:700">${esc(t.patLbl)}</span>${pats.map(p => `<span class="ptag" tabindex="0" ${tip(t.pat[p.id][0], t.patTip.split("|")[1])}>${ico("alert")}${esc(t.pat[p.id][0])}</span>`).join("")}</div>` : "";
  const alertLine = turnIdx === result.perTurn.length && result.firstAlert ? `<span class="when">${ico("alert","width:15px;height:15px")}${t.firstAlert(num(result.firstAlert), result.firstSuspicion ? num(result.firstSuspicion) : null)}</span>` : "";
  el.innerHTML = `
    ${vhead(v, t.v[v][0], t.v[v][1], alertLine, last.score)}
    <div class="whys v-${v}"><div class="lbl" style="margin:0">${esc(t.whyLbl)}</div>${reasons}${patTags}</div>
    <div class="lbl" style="padding:14px 20px 0;margin:0">${ico("check","width:18px;height:18px;color:var(--sky)")} ${t.todo}</div>
    <div class="dos">${guidance(seen).map(k => `<div class="do" tabindex="0" ${tip(t.todoL[k][0], t.todoL[k][1])}><span class="di">${ico(TODO_ICON[k])}</span><b style="font-weight:600">${esc(t.todoL[k][0])}</b></div>`).join("")}</div>
    <div class="bar"><button class="pill sky sm" type="button" id="aReplay">${ico(playing ? "stop" : "play","width:18px;height:18px")} ${playing ? t.stop : t.replay}</button><button class="pill ghost sm" type="button" id="aReport">${ico("file","width:18px;height:18px")} ${t.report}</button>
      <span class="fb">${t.fbQ} ${t.fb.map(f => `<button type="button" data-fb="${esc(f)}">${esc(f)}</button>`).join("")}</span></div>
    <details class="det" id="dC"${detOpen.c ? " open" : ""}><summary>${t.detConvo}<span class="chev">${ico("chev")}</span></summary><div class="body">${convo()}</div></details>
    <details class="det" id="dS"${detOpen.s ? " open" : ""}><summary><span>${t.detSec} <span class="new">NEW</span></span><span class="chev">${ico("chev")}</span></summary><div class="body">${security(pts, last, seen, pats)}</div></details>
    <details class="det" id="dE"${detOpen.e ? " open" : ""}><summary>${t.detEv}<span class="chev">${ico("chev")}</span></summary><div class="body">${evidence(last, seen)}</div></details>`;
  $("aReplay").addEventListener("click", () => playing ? stop() : replay());
  $("aReport").addEventListener("click", openReport);
  el.querySelectorAll("[data-fb]").forEach(b => b.addEventListener("click", () => { try { const q = JSON.parse(sget("fsbd-feedback", "[]")); q.push({case: current.id, label: b.dataset.fb}); sset("fsbd-feedback", JSON.stringify(q.slice(-200))); } catch(e){} toast(t.fbDone); }));
  el.querySelectorAll("[data-xray]").forEach(b => b.addEventListener("click", () => { const u = b.dataset.xray; $("linkIn").value = u; runLink(u); }));
  [["dC","c"],["dS","s"],["dE","e"]].forEach(([id,k]) => $(id).addEventListener("toggle", e => { detOpen[k] = e.target.open; }));
  const bt = $("baseT"); if (bt) bt.addEventListener("change", e => { showBase = e.target.checked; renderResult(); });
  const rs = $("turnR"); if (rs) rs.addEventListener("input", e => { stop(); turnIdx = +e.target.value; renderResult(); });
  addExtras("chat");
  emitRendered("chat");
}
function emitRendered(kind){ try { document.dispatchEvent(new CustomEvent("fs:rendered", {detail:kind})); } catch(e){} }
function convo(){
  const t = tx(), all = result.perTurn;
  const rows = all.map(p => {
    const cls = [p.who === "me" ? "me" : "", p.t > turnIdx ? "fut" : "", p.t === turnIdx ? "cur" : ""].join(" ");
    const stg = p.stages.map(s => `<span class="stag" tabindex="0" ${tip(t.stageNames[s], t.stageTip[s])}>${esc(t.stageNames[s])}</span>`).join("");
    const base = showBase && p.who !== "me" ? `<span class="stag" style="color:${p.baseline ? "var(--high)" : "var(--low)"}">${p.baseline ? t.baseScam : t.baseOk}</span>` : "";
    const meta = p.who === "me" ? `<div class="m"><span class="small">${t.selfNote}</span></div>` :
      `<div class="m"><span class="sbar"><i style="width:${Math.max(3, Math.round(p.score*100))}%;background:var(${VC[p.verdict].c})"></i></span><span class="small" style="font-family:var(--mono)">${num(Math.round(p.score*100))}</span>${stg}${base}</div>`;
    return `<li class="${cls}"><div class="n">${num(p.t)}</div><div class="bub"><div class="t">${highlight(p.text, p.found)}</div>${meta}</div></li>`;
  }).join("");
  return `${all.length < 2 ? "" : `<div class="replay"><span class="small">${t.msg}</span><input type="range" id="turnR" min="1" max="${all.length}" value="${turnIdx}" aria-label="turn"><span class="small" style="font-family:var(--mono)">${num(turnIdx)}/${num(all.length)}</span></div>`}
    <ol class="tl">${rows}</ol>
    <label class="small" style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="baseT"${showBase ? " checked" : ""}> ${t.baseToggle}</label>`;
}
function ckCard(key, iconName, color, status, statusCol, line, extraTip){
  const t = tx(), [tt, tb] = t.ckTip[key].split("|");
  return `<div class="ck" tabindex="0" ${tip(tt, tb + (extraTip ? " " + extraTip : ""))}><span class="ci" style="background:${color}">${ico(iconName)}</span><div style="min-width:0"><h4>${esc(t.ck[key])} <span class="st" style="background:color-mix(in srgb,var(${statusCol}) 15%,#fff);color:var(${statusCol})">${esc(status)}</span></h4><p>${line}</p></div></div>`;
}
function security(pts, last, seen, pats){
  const t = tx(), st = t.st;
  const claims = [...new Set(pts.flatMap(x => x.claims))];
  const claimTxt = claims.length ? claims.map(k => REGISTRY.orgs[k][LANG]).join(", ") : (seen.has("relative_claim") ? t.family : t.noClaim);
  const ch = last.channel || {status:"na"};
  const chKey = ch.status === "unknown" ? "unknown" + (ch.reason ? "_" + ch.reason : "") : ch.status;
  const idSt = ch.status === "mismatched" ? [st.mismatch,"--high"] : ch.status === "matched" ? [st.matched,"--verify"] : ch.status === "na" ? [st.none,"--muted"] : [st.unknown,"--muted"];
  const stagesSeen = {}; pts.forEach(p => p.stages.forEach(s => { if (!stagesSeen[s]) stagesSeen[s] = p.t; }));
  const links = pts.flatMap(p => p.links.map(l => ({l, t:p.t})));
  const L2 = t.link;
  const bad = links.some(({l}) => l.userinfo || l.ip || l.brandIn), weak = links.some(({l}) => l.idn || l.shortener);
  const lkSt = !links.length ? [st.clean,"--muted"] : bad ? [st.flagged,"--high"] : weak ? [st.flagged,"--verify"] : [st.ok,"--low"];
  const lc = links.slice(0, 3).map(({l}) => {
    const f = [];
    if (l.official) f.push(`<span style="color:var(--low)">✓ ${L2.official}</span>`);
    if (l.userinfo) f.push(`<span style="color:var(--high)">✗ ${L2.userinfo}</span>`);
    if (l.ip) f.push(`<span style="color:var(--high)">✗ ${L2.ip}</span>`);
    if (l.brandIn) f.push(`<span style="color:var(--high)">✗ ${esc(L2.brand(REGISTRY.orgs[l.brandIn].en))}</span>`);
    if (l.idn) f.push(`<span style="color:var(--verify)">! ${L2.idn}</span>`);
    if (l.shortener) f.push(`<span style="color:var(--verify)">! ${L2.short}</span>`);
    if (!f.length) f.push(L2.none);
    return `<div class="linkcard"><code>${esc(l.raw)}</code><span>${L2.reg}: <b><code>${esc(l.reg)}</code></b></span>${f.join("")}<button class="pill ghost sm" type="button" data-xray="${esc(l.raw)}" style="align-self:flex-start;margin-top:6px">${ico("search","width:16px;height:16px")} ${esc(t.inspectLink)}</button></div>`;
  }).join("");
  const creds = pts.flatMap(p => p.creds.map(c => ({...c, t:p.t})));
  const crSt = creds.some(c => c.act === "request") ? [st.asked,"--high"] : creds.some(c => c.act === "forbid") ? [st.advice,"--low"] : creds.length ? [st.mention,"--muted"] : [st.clean,"--muted"];
  const crLine = creds.length ? creds.slice(0, 3).map(c => `${t.msg} ${num(c.t)}: <b>${esc(c.type)}</b> ${esc(t.cred[c.act])}`).join("<br>") : esc(t.credNone);
  const manip = seen.has("manipulation");
  const patHtml = pats.length ? pats.map(p => { const [name, steps] = t.pat[p.id]; return `<div class="pat" tabindex="0" ${tipS(t.patTip)}><b>${ico("alert","width:18px;height:18px;vertical-align:-3px")} ${esc(name)}</b>${steps.map((s,i) => `${i ? `<span class="ar">→</span>` : ""}<span class="step">${esc(s)} <small>${t.msg} ${num(p.turns[i])}</small></span>`).join("")}</div>`; }).join("") : `<p class="small" style="margin:0">${esc(t.patNone)}</p>`;
  return `<div class="stages">${STAGES.map(s => `<div class="stg ${stagesSeen[s] ? "on" : ""}" tabindex="0" ${tip(t.stageNames[s], t.stageTip[s])}><b>${stagesSeen[s] ? num(stagesSeen[s]) : "–"}</b>${esc(t.stageNames[s])}</div>`).join("")}</div>
    <p class="small" style="margin:-6px 0 0">F4 · ${t.stagesTitle}</p>
    <div><div class="lbl">${esc(t.patTitle)} <span class="new">NEW</span></div><div class="pats">${patHtml}</div></div>
    <div class="checks">
      ${ckCard("id", "user", "linear-gradient(135deg,#38BDF8,#0369A1)", idSt[0], idSt[1], `${t.claimed}: <b style="color:var(--ink)">${esc(claimTxt)}</b>`, t.chan[chKey] || t.chan.unknown)}
      ${ckCard("cred", "lock", "linear-gradient(135deg,#34D399,#059669)", crSt[0], crSt[1], crLine)}
      ${ckCard("link", "link", "linear-gradient(135deg,#A78BFA,#7C3AED)", lkSt[0], lkSt[1], links.length ? `<code style="font:12px var(--mono);word-break:break-all">${esc(links[0].l.reg)}</code>` : esc(t.noLinks))}
      ${ckCard("manip", "eyeoff", "linear-gradient(135deg,#60A5FA,#1D4ED8)", manip ? st.trick : st.noTrick, manip ? "--high" : "--low", esc(manip ? t.manipOn : t.manipOff))}
    </div>
    ${lc ? `<div style="display:flex;flex-direction:column;gap:8px">${lc}</div>` : ""}`;
}
function evidence(last, seen){
  const t = tx();
  const row = (w, body) => `<li style="display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:baseline"><span style="font:600 13px var(--mono);color:var(--muted)">${w}</span><span>${body}</span></li>`;
  const ev = last.contrib.filter(c => c[1] > 0).map(([s,w,tt]) => row("+" + w.toFixed(1), `<b style="color:var(${SIG[s].c})" tabindex="0" ${tip(sl(s), t.sigx[s] || "")}>${esc(sl(s))}</b> <span class="small">· ${t.msg} ${num(tt)}</span>`)).join("");
  const cnt = last.contrib.filter(c => c[1] < 0).map(([s,w]) => row(w.toFixed(1), `<span style="color:var(--low)">${esc(sl(s))}</span>`));
  const ben = Object.keys(t.benign).filter(k => seen.has(k)).slice(0, 2).map(k => row("?", esc(t.benign[k])));
  if (last.channel && last.channel.status === "unknown" && last.channel.reason === "no_sender") ben.push(row("?", esc(t.noSender)));
  const ul = s => `<ul style="list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:6px">${s}</ul>`;
  return `<div><div class="lbl">${t.evTitle}</div>${ul(ev || row("·", "–"))}</div>${cnt.length || ben.length ? `<div><div class="lbl">${t.cntTitle}</div>${ul(cnt.join("") + ben.join(""))}</div>` : ""}<p class="small" style="margin:0">${esc(t.gaugeNote)}</p>`;
}
function guidance(seen){
  const g = [];
  if (seen.has("request_credential")) g.push("cred");
  if (seen.has("install_app")) g.push("install");
  if (seen.has("open_link") || seen.has("brand_lookalike") || seen.has("url_userinfo")) g.push("link");
  if (seen.has("request_money")) g.push("money");
  if (seen.has("wrong_send")) g.push("wrong");
  if (seen.has("identity_mismatch") || seen.has("relative_claim") || seen.has("authority_claim")) g.push("verify");
  if (seen.has("share_identity")) g.push("ident");
  if (seen.has("manipulation")) g.push("manip");
  if (!g.length) g.push("none");
  return g.slice(0, 4);
}
function replay(){
  if (!result) return;
  stop(); detOpen.c = true; turnIdx = 1; seenPats = new Set(); if (view !== "chat") setTab("chat"); renderResult();
  playing = setInterval(() => { if (turnIdx >= result.perTurn.length){ stop(); return; } turnIdx++; renderResult(); }, 1300);
  renderResult();
}
function stop(){ if (playing){ clearInterval(playing); playing = null; if (result) renderResult(); } }

/* ---------- Link X-ray (A1 + C1), DNS (B1), TLS note (A2) ---------- */
function runLink(raw, opts){
  const r = inspectUrl(raw, {trusted:trustList()});
  linkRes = r;
  if (r.status === "complete") logLink(r);
  if (view !== "link") setTab("link"); else renderView();
}
function logLink(r, src){
  const e = {when:r.checkedAt, defanged:r.defanged, reg:r.reg, category:r.category, flags:r.evidence.filter(x => x.state === "risk").map(x => x.kind), src:src || "link", dns:"not checked"};
  const i = session.links.findIndex(x => x.defanged === e.defanged); if (i >= 0) session.links[i] = e; else session.links.push(e);
  if (session.links.length > 20) session.links.shift();
}
function renderLink(r, art, kind){
  const t = tx(), el = $("result");
  if (!r){ el.innerHTML = emptyCard(kind === "qr" ? "qr" : "link", art); return; }
  if (r.status !== "complete"){ el.innerHTML = `<div class="empty"><div style="max-width:230px;margin:0 auto">${art}</div><h3 style="margin:10px 0 4px;font:800 21px var(--disp)">${esc(t.linkErr[r.notices[0]] || t.linkErr.malformed)}</h3>${r.raw ? `<p class="small"><code>${esc(String(r.raw).slice(0, 200))}</code></p>` : ""}</div>`; return; }
  if (getLevel() === "simple") return renderSimpleLink(r, kind);
  const [title, sub] = t.linkV[r.category], vc = VC[r.verdict], bad = r.verdict === "high";
  const risks = r.evidence.filter(e => e.state === "risk"), goods = r.evidence.filter(e => e.state === "counterevidence");
  const chip = (e, cls) => { const f = t.linkFlag[e.kind] || [e.kind, ""]; return `<span class="rchip" style="--c:var(${cls})" tabindex="0" ${tip(f[0], f[1])}><b></b>${esc(f[0])}</span>`; };
  const row = (k, v) => `<dt>${esc(t.linkRows[k])}</dt><dd>${v}</dd>`;
  const facts = [row("shown", `<code>${esc(maskText(r.raw).slice(0, 160))}</code>`)];
  if (r.host && r.hostUnicode !== r.host) facts.push(row("real", `<code>${esc(r.host)}</code><br><span class="small">${esc(t.showsAs(r.hostUnicode))}</span>`));
  if (r.host) facts.push(row("conn", esc(t.conn[r.scheme === "https" ? "https" : r.scheme === "http" ? "http" : "none"])));
  if (r.port) facts.push(row("port", esc(r.port)));
  if (r.path && r.path !== "/") facts.push(row("path", `<code>${esc(maskText(r.path).slice(0, 120))}</code>`));
  const trusted = trustList().includes(r.reg), canTrust = r.reg && !r.ip && r.category !== "known_harmful";
  const domTip = r.regUnicode && r.regUnicode !== r.reg ? tip(t.realSite, t.showsAs(r.regUnicode)) : tip(t.realSite, t.linkRows.real + ": " + r.reg);
  const [actShort, actLong] = [t.linkActShort[r.action], t.linkAct[r.action]];
  const pic = r.host ? `<div class="realsite">
      <div class="addr ${bad ? "bad" : r.verdict === "low" ? "ok" : "mid"}" tabindex="0" ${domTip}><span class="ai">${ico(bad ? "alert" : r.verdict === "low" ? "lock" : "help")}</span><span class="lab">${esc(t.realSite)}</span><span class="dom">${esc(r.reg)}</span></div>
      ${r.lookalikeOf ? `<div class="mask" tabindex="0" ${tip(t.linkFlag.lookalike[0], t.linkFlag.lookalike[1])}>${ico("eyeoff")}<span>${esc(t.pretends)}</span><b>${esc(r.lookalikeOf)}</b></div>` : r.brand && !r.official ? `<div class="mask" tabindex="0" ${tip(t.linkFlag.brand_in_host[0], t.linkFlag.brand_in_host[1])}>${ico("eyeoff")}<span>${esc(t.usesName)}</span><b>${esc(REGISTRY.orgs[r.brand].en)}</b></div>` : ""}
      ${r.userinfo ? `<div class="mask" tabindex="0" ${tip(t.linkFlag.userinfo[0], t.linkFlag.userinfo[1])}>${ico("x")}<span>${esc(t.hiddenPart)}</span><s>${esc(r.userinfo)}</s></div>` : ""}
    </div>` : "";
  el.innerHTML = `
    ${vhead(r.verdict, title, sub, kind === "qr" ? `<span class="when">${ico("qr","width:15px;height:15px")}${esc(t.fromQR)}</span>` : "")}
    ${pic}
    <div class="chips">${risks.map(e => chip(e, e.confidenceBand === "low" ? "--verify" : "--high")).join("")}${goods.map(e => chip(e, "--low")).join("")}</div>
    <div class="dos"><div class="do" tabindex="0" ${tip(actShort, actLong)}><span class="di">${ico(r.verdict === "low" ? "app" : "stop")}</span><b style="font-weight:700">${esc(actShort)}</b></div></div>
    <div class="bar"><button class="pill sky sm" type="button" id="lCopy" ${tip(t.copySafe, r.defanged)}>${ico("copy","width:18px;height:18px")} ${esc(t.copySafe)}</button>${canTrust ? `<button class="pill ghost sm" type="button" id="lTrust">${ico(trusted ? "x" : "star","width:18px;height:18px")} ${esc(trusted ? t.untrustBtn : t.trustBtn)}</button>` : ""}</div>
    <details class="det" id="lDet"${linkDetOpen || r.dns === "consent" || r.dns === "loading" ? " open" : ""}><summary>${esc(t.details)}<span class="chev">${ico("chev")}</span></summary><div class="body">
      <dl class="facts">${facts.join("")}</dl>
      <code id="lSafe" style="font:12.5px var(--mono);word-break:break-all;background:var(--skybg);padding:8px 10px;border-radius:10px">${esc(r.defanged)}</code>
      <div class="online">${dnsCard(r)}<div class="ocard"><h4 tabindex="0" ${tip(t.tlsTitle, t.tlsBody)}>${ico("lock","width:18px;height:18px")} ${esc(t.tlsTitle)} <span class="soon">${esc(t.notChecked)}</span></h4>${r.scheme === "http" ? `<p style="color:var(--high)">${esc(t.tlsHttp)}</p>` : ""}</div></div>
      <p class="small" style="margin:0" tabindex="0" ${tip(t.localNote, t.provNote(REGISTRY.version, DEMO_BLOCKLIST.version))}>${ico("shieldok","width:14px;height:14px;vertical-align:-2px;color:var(--low)")} ${esc(r.dns && r.dns.status ? t.dnsCaveat : t.localNote)}</p>
    </div></details>`;
  $("lCopy").addEventListener("click", () => copyText(r.defanged, t.copied, $("lSafe")));
  const tb = $("lTrust"); if (tb) tb.addEventListener("click", () => setTrust(r.reg, !trusted));
  $("lDet").addEventListener("toggle", e => { linkDetOpen = e.target.open; });
  wireDns(r);
  addExtras("link", r);
  emitRendered(kind === "qr" ? "qr" : "link");
}
function dnsCard(r){
  const t = tx(), m = onlineMode(), d = r.dns;
  let bodyHtml;
  if (!dnsAllowed(r.host)) bodyHtml = `<p>${esc(t.dnsNA)}</p>`;
  else if (d === "consent") bodyHtml = `<div class="consent"><span>${t.dnsConsent(esc(r.host))}</span><div class="row"><button class="pill sky sm" type="button" id="dOnce">${esc(t.allowOnce)}</button><button class="pill ghost sm" type="button" id="dAlways">${esc(t.allowAlways)}</button><button class="pill ghost sm" type="button" id="dCancel">${esc(t.cancel)}</button></div></div>`;
  else if (d === "loading") bodyHtml = `<p>${esc(t.dnsLoading)}</p>`;
  else if (d && d.status){
    const state = d.status === "complete" ? (d.nx ? "nx" : (d.A.length || d.AAAA.length) ? "complete" : "noaddr") : "offline";
    const col = state === "nx" ? "--verify" : state === "offline" ? "--muted" : "--deep";
    const rr = (k, v) => v ? `<dt>${esc(t.dnsRows[k])}</dt><dd>${v}</dd>` : "";
    bodyHtml = `<p style="color:var(${col});font-weight:700">${esc(t.dnsRes[state])}</p>${d.status === "complete" ? `<dl class="facts">${rr("addr", [...d.A, ...d.AAAA].slice(0, 4).map(x => `<code>${esc(x)}</code>`).join("<br>"))}${rr("cname", d.CNAME.map(x => `<code>${esc(x)}</code>`).join(" → "))}${rr("ns", d.NS.slice(0, 3).map(x => `<code>${esc(x)}</code>`).join("<br>"))}${rr("prov", esc(d.provider))}${rr("when", esc(new Date(d.checkedAt).toLocaleString(LANG === "bn" ? "bn-BD" : "en-GB")))}</dl>` : ""}<p>${esc(t.dnsCaveat)}</p>`;
  } else if (m === "off") bodyHtml = `<p style="color:var(--verify)">${esc(t.dnsOff)}</p>`;
  else bodyHtml = `<button class="pill ghost sm" type="button" id="dGo" style="align-self:flex-start" ${tip(t.dnsTitle, t.dnsBody)}>${ico("globe","width:18px;height:18px")} ${esc(t.dnsBtn)}</button>`;
  const badge = d && d.status ? `<span class="new" style="background:var(--sky)">DNS</span>` : `<span class="soon">${esc(t.notChecked)}</span>`;
  return `<div class="ocard"><h4>${ico("server","width:18px;height:18px")} ${esc(t.dnsTitle)} ${badge}</h4>${bodyHtml}</div>`;
}
function wireDns(r){
  const go = async () => {
    r.dns = "loading"; renderView();
    const res = await dnsLookup(r.host, undefined, r.reg);
    r.dns = res; const e = session.links.find(x => x.defanged === r.defanged);
    if (e) e.dns = res.status === "complete" ? (res.nx ? "NXDOMAIN" : `${res.A.length + res.AAAA.length} addresses${res.CNAME.length ? ", CNAME " + res.CNAME.join(" > ") : ""}`) + ` (${res.provider}, ${res.checkedAt})` : "unavailable";
    if ((view === "link" && linkRes === r) || (view === "qr" && qrRes === r)) renderView();
  };
  const b = $("dGo"); if (b) b.addEventListener("click", () => { if (onlineMode() === "always") go(); else { r.dns = "consent"; renderView(); } });
  const o = $("dOnce"); if (o) o.addEventListener("click", go);
  const a = $("dAlways"); if (a) a.addEventListener("click", () => { sset("fsbd-online", "always"); renderSettings(); go(); });
  const c = $("dCancel"); if (c) c.addEventListener("click", () => { r.dns = undefined; renderView(); });
}

/* ---------- App / file check (E1/E2) ---------- */
function b64bytes(s){ const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
async function runSample(key){ const s = SAMPLE_FILES[key]; if (!s) return; await runFile(b64bytes(s.b64), s.name, true); }
async function runFile(bytes, name, sample){
  if (view !== "file") setTab("file");
  $("result").innerHTML = `<div class="empty"><div style="max-width:200px;margin:0 auto">${ART.filedrop}</div><p>${esc(tx().dnsLoading)}</p></div>`;
  const r = await inspectFile(bytes, name, {testSignatures:testSig()});
  r.sample = !!sample; fileRes = r;
  if (PAGE_FILE.test(name) || r.kind === "html"){ try { r.page = pageScan(decodeMailText(bytes)); } catch(e){} }
  if (r.status === "complete"){
    r.head = bytes.slice(0, 64);
    if (["apk","zip","ooxml"].includes(r.kind)){ try { const ents = zipEntries(bytes); r.zip = ents.slice(0, 80).map(e => ({name:e.name.slice(0, 80), method:e.method, comp:e.comp, size:e.size})); const m = ents.find(e => e.name === "AndroidManifest.xml"); if (m){ const ax = parseAxml(await zipRead(bytes, m, APK_MANIFEST_LIMIT)); r.manifest = ax.tags.slice(0, 80); } } catch(e){} }
  }
  if (r.status === "complete"){
    session.files.push({when:r.checkedAt, name:r.name, kind:r.kind, sizeBand:r.sizeBand, sha256:r.sha256, known:r.known, verdict:r.verdict, pkg:r.apk && r.apk.pkg, sensitive:r.apk && r.apk.sensitive, flags:r.evidence.filter(e => e.state === "risk").map(e => e.kind)});
    if (session.files.length > 20) session.files.shift();
  }
  if (view === "file") renderFile();
}
const PERM_ICON = {sms:"mail", access:"eye", overlay:"layers", notif:"bell", install:"download", contacts:"users", calls:"phone", admin:"lock", apps:"grid", mic:"mic", camera:"camera", location:"mappin"};
function renderFile(){
  const t = tx(), el = $("result"), r = fileRes;
  if (!r){ el.innerHTML = emptyCard("file", ART.apk); return; }
  if (r.page && r.page.status === "complete"){ renderPageXray(el, r.page, r.name, "file", "wx"); emitRendered("file"); return; }
  if (r.status !== "complete"){ el.innerHTML = `<div class="empty"><div style="max-width:200px;margin:0 auto">${ART.filedrop}</div><h3 style="margin:10px 0 4px;font:800 21px var(--disp)">${esc(t.fileErr[r.notices[0]] || t.fileErr.read)}</h3></div>`; return; }
  if (getLevel() === "simple") return renderSimpleFile(r);
  const vc = VC[r.verdict], [title, sub] = t.fileV[r.verdict], a = r.apk && r.apk.status === "complete" ? r.apk : null;
  const has = k => r.evidence.some(e => e.kind === k);
  const stamps = [];
  if (a && a.claimed && !a.officialPkg) stamps.push(["hi", t.notOfficial, t.fileFlag.apk_impersonation]);
  if (has("disguised") || has("double_ext")) stamps.push(["hi", t.disguisedStamp, t.fileFlag[has("disguised") ? "disguised" : "double_ext"]]);
  if (r.known) stamps.push(["hi", t.knownStamp, [t.fileFlag.known_hash[0], t.hashKnown(r.known)]]);
  const disg = has("disguised") || has("double_ext"), name = a && a.label && !disg ? a.label : r.name;
  const card = `<div class="appcard">
      <div class="aicon ${r.kind === "apk" ? "apk" : ""}">${ico(r.kind === "apk" ? "package" : r.kind === "image" ? "camera" : "file")}</div>
      <div class="ainfo"><b>${esc(name)}</b><span tabindex="0" ${tip(t.fileRows.type, (t.kinds[r.kind] || r.kind) + (r.ext ? " (." + r.ext + ")" : ""))}>${esc(t.kinds[r.kind] || r.kind)}</span>${a && a.pkg ? `<code>${esc(a.pkg)}</code>` : ""}</div>
      <div class="stamps">${stamps.map(s => `<span class="stamp" tabindex="0" ${tip(s[2][0], s[2][1])}>${esc(s[1])}</span>`).join("")}</div>
    </div>`;
  const perms = a ? a.sensitive.map(p => { const g = SENSITIVE_PERMS[p], hi = HIGH_PERM_GROUPS.includes(g); return `<div class="ptile ${hi ? "hi" : "md"}" tabindex="0" ${tip(t.permShort[p] || p, t.perm[p] || p)}><span class="pi2">${ico(PERM_ICON[g] || "alert")}</span><span>${esc(t.permShort[p] || p)}</span></div>`; }).join("") : "";
  const permBlock = a ? `<div class="lbl" style="padding:14px 20px 0;margin:0">${ico("package","width:18px;height:18px;color:var(--verify)")} ${esc(t.wants)}</div><div class="pgrid">${perms || `<span class="small">${esc(t.permNone)}</span>`}</div>` : "";
  const dos = [[r.kind === "apk" ? "store" : "stop", t.fileActShort[r.action], t.fileAct[r.action]]];
  if (a && a.sensitive.includes("BIND_ACCESSIBILITY_SERVICE")) dos.push(["eyeoff", t.fileDosShort.access, t.fileDos.access]);
  else if (r.verdict === "high") dos.push(["trash", t.fileDosShort.delete, t.fileDos.delete]);
  const row = (k, v) => `<dt>${esc(t.fileRows[k])}</dt><dd>${v}</dd>`, ar = (k, v) => `<dt>${esc(t.apkRows[k])}</dt><dd>${v}</dd>`;
  const facts = [row("name", esc(r.name)), row("size", esc(t.bands[r.sizeBand] || r.sizeBand)),
    row("hash", r.sha256 ? `<span class="hash"><code>${esc(r.sha256.slice(0, 16))}…</code><button class="pill ghost sm" type="button" id="fHash" style="padding:5px 10px" aria-label="copy">${ico("copy","width:14px;height:14px")}</button></span>` : "–"),
    row("list", r.known ? `<b style="color:var(--high)">${esc(t.hashKnown(r.known))}</b>` : esc(t.hashUnknown))];
  if (a) facts.push(ar("version", esc(a.version || "–")), ar("official", a.officialPkg ? esc(t.officialYes) : a.claimed ? `<b style="color:var(--high)">${esc(t.officialNo)}</b>` : "–"), ar("signed", `<span tabindex="0" ${tipS(t.signedTip)}>${esc(a.signed ? t.yes : t.no)} <span class="qi">?</span></span>`), ar("exported", `<span tabindex="0" ${tipS(t.exportedTip)}>${num(a.exported)} <span class="qi">?</span></span>`));
  el.innerHTML = `
    ${vhead(r.verdict, title, sub)}
    ${card}
    ${disg ? `<div class="realsite" style="padding-top:10px"><div class="mask">${ico("eyeoff")}<span>${esc(lv().plainFile.disguised((r.ext || "?").toUpperCase(), lv().kindPlain[r.kind] || r.kind))}</span></div></div>` : ""}
    ${permBlock}
    <div class="dos">${dos.map(([ic, s1, s2]) => `<div class="do" tabindex="0" ${tip(s1, s2)}><span class="di">${ico(ic)}</span><b style="font-weight:700">${esc(s1)}</b></div>`).join("")}</div>
    <details class="det" id="fDet"${fileDetOpen ? " open" : ""}><summary>${esc(t.fileDetails)}<span class="chev">${ico("chev")}</span></summary><div class="body">
      <dl class="facts">${facts.join("")}</dl>
      <div class="ocard"><h4 tabindex="0" ${tip(t.sandboxTitle, t.sandboxBody)}>${ico("server","width:18px;height:18px")} ${esc(t.sandboxTitle)} <span class="soon">OFF</span></h4></div>
    </div></details>
    <p class="small" style="margin:0;padding:0 20px 16px" tabindex="0" ${tipS(t.fileNoteTip)}>${ico("lock","width:14px;height:14px;vertical-align:-2px;color:var(--low)")} ${esc(t.fileNote)}</p>`;
  const hb = $("fHash"); if (hb) hb.addEventListener("click", () => copyText(r.sha256, t.copied.split(" (")[0]));
  $("fDet").addEventListener("toggle", e => { fileDetOpen = e.target.open; });
  addExtras("file", r);
  emitRendered("file");
}
function handlePicked(f){
  if (!f) return;
  if (f.size > FILE_LIMIT){ fileRes = modResult("error", [], ["too_big"]); if (view !== "file") setTab("file"); else renderFile(); return; }
  f.arrayBuffer().then(buf => runFile(new Uint8Array(buf), f.name, false)).catch(() => { fileRes = modResult("error", [], ["read"]); renderFile(); });
}
$("fileIn").addEventListener("change", e => { handlePicked(e.target.files && e.target.files[0]); e.target.value = ""; });
(function dropZone(){ const d = $("drop"); ["dragenter","dragover"].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.add("over"); })); ["dragleave","drop"].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.remove("over"); })); d.addEventListener("drop", e => handlePicked(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0])); })();

/* ---------- Wi-Fi / network health (honest browser limits) ---------- */
function showNet(){
  const t = tx(), box = $("featInfo"), c = navigator.connection || {};
  box.hidden = false;
  box.innerHTML = `<div class="panel" style="padding:20px;display:grid;grid-template-columns:${innerWidth < 600 ? "1fr" : "minmax(0,200px) 1fr"};gap:18px;align-items:center"><div style="max-width:220px">${ART.net}</div><div><h3 style="margin:0 0 6px;font:800 21px var(--disp)">${esc(t.netTitle)} <span class="soon">${esc(t.states.android)}</span></h3><p style="margin:0 0 8px;color:var(--muted)">${esc(t.netBody)}</p><p style="margin:0 0 10px;font-weight:700">${esc(t.netSee(navigator.onLine !== false, c.effectiveType || ""))}</p><ul style="margin:0 0 12px;padding-left:18px">${t.netTips.map(x => `<li>${esc(x)}</li>`).join("")}</ul><button class="pill ghost sm" type="button" id="netClose">${ico("x","width:16px;height:16px")} ${esc(t.close)}</button></div></div>`;
  $("netClose").addEventListener("click", () => { box.hidden = true; box.innerHTML = ""; });
}

/* ---------- F6 report + F5 fingerprint ---------- */
async function sha(s){ try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join(""); } catch(e){ return "unavailable"; } }
function openReport(){
  if (!result) return;
  const t = tx(), r = $("report");
  r.hidden = false;
  r.innerHTML = `<h3 style="margin:0;font:800 24px var(--disp);display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span style="width:42px;height:42px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#4ADE80,#16A34A)">${ico("file")}</span>${t.repTitle} <span class="new">F6</span></h3>
    <p class="small" style="margin:8px 0 12px;font-size:14px">${t.repHelp}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px"><input class="txt" id="rLoss" maxlength="300" placeholder="${esc(t.repLoss)}"><input class="txt" id="rSteps" maxlength="300" placeholder="${esc(t.repSteps)}"></div>
    <label class="switch" style="margin-top:10px"><input type="checkbox" id="rInc" checked> ${esc(t.repInc)}</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="pill sky sm" type="button" id="rBuild">${ico("refresh","width:18px;height:18px")} ${t.repBuild}</button><button class="pill ghost sm" type="button" id="rCopy">${ico("copy","width:18px;height:18px")} ${t.repCopy}</button><button class="pill ghost sm" type="button" id="rDel">${ico("trash","width:18px;height:18px")} ${t.repDel}</button></div>
    <pre id="rText"></pre>
    <h3 style="margin:18px 0 4px;font:800 18px var(--disp);display:flex;gap:8px;align-items:center;flex-wrap:wrap">${ico("cloud","color:var(--sky)")} ${t.patFpTitle} <span class="new">F5</span></h3>
    <p class="small" style="margin:0">${t.patFpHelp}</p><pre id="pText"></pre>`;
  $("rBuild").addEventListener("click", buildReport);
  $("rInc").addEventListener("change", buildReport);
  $("rCopy").addEventListener("click", () => copyText($("rText").textContent, tx().repCopied, $("rText")));
  $("rDel").addEventListener("click", () => { r.hidden = true; r.innerHTML = ""; toast(tx().repDeleted); });
  buildReport();
  r.scrollIntoView({behavior:"smooth", block:"start"});
}
async function buildReport(){
  const pts = result.perTurn, last = pts.filter(p => p.who !== "me").slice(-1)[0] || pts[pts.length-1], en = T.en;
  const L = [];
  L.push("FRAUDSHIELD BD — INCIDENT SUMMARY");
  L.push("Machine-generated assistance. Not forensic proof or a legal finding. Review before sharing.");
  L.push(`Case FSBD-${Math.random().toString(36).slice(2,8).toUpperCase()} · ${new Date().toISOString()} · app ${VERSION} · registry ${REGISTRY.version}`);
  L.push("", "PARTICIPANTS (as claimed; not independently verified)");
  const claims = [...new Set(pts.flatMap(p => p.claims))].map(k => REGISTRY.orgs[k].en);
  L.push(`- Claims to be: ${claims.join(", ") || "no organisation"}`);
  L.push(`- Sender: ${current.sender ? maskText(current.sender) : "not provided"} (${current.senderType})`);
  const ch = last.channel || {status:"na"};
  L.push(`- Channel check: ${en.chan[ch.status === "unknown" ? "unknown" + (ch.reason ? "_" + ch.reason : "") : ch.status] || "unknown"}`);
  L.push("", "TIMELINE (secrets masked; links defanged; SHA-256 of each original message for integrity comparison)");
  for (const p of pts){ const h = await sha(p.text); L.push(`${p.t}. [${p.who === "me" ? "me" : "them"}] ${defangText(maskText(p.text))}`); L.push(`   sha256 ${h.slice(0,16)}…  stage: ${p.stages.join(", ") || "-"}`); }
  L.push("", "REQUESTS IDENTIFIED");
  const reqs = [...new Set(pts.flatMap(p => p.found.filter(f => REQUESTS.includes(f.sig)).map(f => `${SIG[f.sig].en} (message ${p.t})`)))];
  L.push(reqs.length ? reqs.map(r => "- " + r).join("\n") : "- none");
  const pats = matchPatterns(pts, pts.length);
  L.push("", "SCAM PATTERNS (rule-based, messages so far)");
  L.push(pats.length ? pats.map(p => `- ${en.pat[p.id][0]}: messages ${p.turns.join(" > ")}`).join("\n") : "- none");
  L.push("", "LINKS IN THE CHAT (never opened; defanged)");
  const links = pts.flatMap(p => p.links.map(l => `- message ${p.t}: ${defang(l.raw)} → real domain ${l.reg}${l.official ? " (official)" : ""}${l.userinfo ? " · hidden destination via @" : ""}${l.ip ? " · IP address" : ""}${l.brandIn ? " · brand look-alike" : ""}${l.shortener ? " · destination not verified" : ""}`));
  L.push(links.length ? links.join("\n") : "- none");
  if ($("rInc") && $("rInc").checked){
    L.push("", "LINK CHECKS THIS SESSION (source: on-device parser; DNS only if the user allowed it)");
    L.push(session.links.length ? session.links.map(x => `- ${x.defanged} · real site ${x.reg} · ${x.category}${x.flags.length ? " · " + x.flags.join(", ") : ""} · DNS: ${x.dns} · ${x.when}${x.src === "qr" ? " · from QR" : ""}`).join("\n") : "- none");
    L.push("", "FILE CHECKS THIS SESSION (never opened or uploaded; bytes discarded)");
    L.push(session.files.length ? session.files.map(x => `- ${x.name} · ${x.kind} · ${x.sizeBand} · sha256 ${x.sha256 ? x.sha256.slice(0, 16) + "…" : "n/a"} · ${x.known ? "hash match: " + x.known : "hash not on list"}${x.pkg ? " · package " + x.pkg : ""}${x.sensitive && x.sensitive.length ? " · permissions " + x.sensitive.join(", ") : ""}${x.flags.length ? " · " + x.flags.join(", ") : ""} · ${x.verdict} · ${x.when}`).join("\n") : "- none");
  }
  L.push("", `RESULT: ${en.v[last.verdict][0]} (rule score ${Math.round(last.score*100)}/100, not a probability)`);
  if (result.firstAlert) L.push(`First alert: message ${result.firstAlert}${result.firstHarm ? ` · first harmful request: message ${result.firstHarm}` : ""}`);
  L.push("Evidence: " + (last.contrib.filter(c => c[1] > 0).map(c => `${SIG[c[0]].en} [msg ${c[2]}]`).join("; ") || "none"));
  L.push("", "YOUR NOTES", `- What happened / loss: ${(($("rLoss") || {}).value || "(not provided)").slice(0, 300)}`, `- Steps taken: ${(($("rSteps") || {}).value || "(not provided)").slice(0, 300)}`);
  L.push("", "SAFE NEXT STEPS", "- Stop replying. Never share a PIN/OTP, send money or install an app from the chat.", "- Call your provider using the number on your card or official app (e.g. bKash 16247, Nagad 16167, Rocket 16216 — verify independently). Emergency: 999.", "- Keep the original messages and files. This summary is never sent anywhere automatically.");
  if ($("rText")) $("rText").textContent = L.join("\n");
  const threat = last.reqNow.includes("request_credential") ? "credential_theft" : pts.some(p => p.found.some(f => f.sig === "wrong_send")) ? "refund_trick" : pts.some(p => p.found.some(f => f.sig === "lure")) ? "advance_fee" : last.reqNow.includes("request_money") ? "money_request" : last.reqNow.includes("open_link") ? "link_phishing" : "none_detected";
  const cat = [...new Set(pts.flatMap(p => p.claims).map(k => REGISTRY.orgs[k].cat))];
  const pat = {schema:"fsbd-pattern/0.2", threat_type:threat, patterns:pats.map(p => p.id), stage_sequence:pts.filter(p => p.who !== "me").map(p => p.stages.join("+") || "-"), action_sequence:pts.filter(p => p.who !== "me").map(p => [...new Set(p.found.filter(f => REQUESTS.includes(f.sig)).map(f => f.sig))].join("+") || "-"), claimed_brand_category:cat.length ? cat : ["none"], detector:VERSION, contains_text:false, contains_numbers:false, contains_links:false};
  if ($("pText")) $("pText").textContent = JSON.stringify(pat, null, 2);
}

/* ---------- F8 QR → Link X-ray ---------- */
$("qrFile").addEventListener("change", e => {
  const f = e.target.files && e.target.files[0], t = tx(), out = $("qrOut");
  e.target.value = "";
  if (!f) return;
  if (f.size > 5 * 1024 * 1024){ out.textContent = t.qrBig; return; }
  if (!window.jsQR){ out.textContent = t.qrNoLib; return; }
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const k = Math.min(1, 1024 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    const code = window.jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
    if (!code || !code.data){ out.textContent = t.qrNone; return; }
    const data = code.data.slice(0, 1000);
    const isUrl = /^(https?:\/\/|www\.)/i.test(data) || /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i.test(data) || (/^[a-z]+:/i.test(data) && !/^(wifi|tel|smsto?|mailto|mecard|begin):/i.test(data));
    out.textContent = "";
    if (isUrl){ qrText = null; qrRes = inspectUrl(data, {trusted:trustList()}); if (qrRes.status === "complete") logLink(qrRes, "qr"); }
    else { qrRes = null; qrText = data; }
    renderView();
  };
  img.onerror = () => { out.textContent = t.qrNone; URL.revokeObjectURL(url); };
  img.src = url;
});

/* ---------- live phone demo + counters ---------- */
let heroTimer = null;
function heroDemo(){
  const sc = SCEN.find(s => s.id === "s1"), r = runConversation(sc), box = $("phoneMsgs"), bar = $("shieldbar");
  clearTimeout(heroTimer); box.innerHTML = ""; bar.classList.remove("alarm");
  const setBar = p => { const t = tx(); $("sbText").textContent = t.sb[p.verdict === "abstain" ? "low" : p.verdict]; const i = $("sbBar"); i.style.width = Math.max(5, Math.round(p.score*100)) + "%"; i.style.background = p.verdict === "high" ? "#E5383B" : p.verdict === "verify" ? "#D97706" : "#16A34A"; bar.classList.toggle("alarm", p.verdict === "high"); };
  const show = i => { const p = r.perTurn[i], d = document.createElement("div"); d.className = "pm" + (p.who === "me" ? " me" : "") + (p.verdict === "high" && p.who !== "me" ? " hot" : ""); d.textContent = maskText(p.text); box.appendChild(d); if (p.who !== "me") setBar(p); };
  if (reduceMotion){ r.perTurn.forEach((p,i) => show(i)); return; }
  $("sbText").textContent = tx().sb.low; $("sbBar").style.width = "5%"; $("sbBar").style.background = "#16A34A";
  let i = 0;
  const step = () => { if (i < r.perTurn.length){ show(i++); heroTimer = setTimeout(step, 1500); } else heroTimer = setTimeout(heroDemo, 4200); };
  heroTimer = setTimeout(step, 700);
}
function countUp(){
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(ents => ents.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, to = parseFloat(el.dataset.to), dec = (el.dataset.to.split(".")[1] || "").length, t0 = performance.now();
    const f = now => { const k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3); el.textContent = (to * e).toFixed(dec); if (k < 1) requestAnimationFrame(f); else el.textContent = el.dataset.to; };
    requestAnimationFrame(f);
  }), {threshold:.6});
  document.querySelectorAll("#stats b[data-to]").forEach(b => io.observe(b));
}

/* ---------- wiring ---------- */
$("goBtn").addEventListener("click", analyzeInput);
$("linkGo").addEventListener("click", () => runLink($("linkIn").value));
$("linkIn").addEventListener("keydown", e => { if (e.key === "Enter") runLink($("linkIn").value); });
$("prev").addEventListener("click", () => { goSlide(slideIdx - 1); restartSlides(); });
$("next").addEventListener("click", () => { goSlide(slideIdx + 1); restartSlides(); });
const heroEl = document.querySelector(".hero");
heroEl.addEventListener("mouseenter", () => clearInterval(slideTimer));
heroEl.addEventListener("mouseleave", restartSlides);
heroEl.addEventListener("focusin", () => clearInterval(slideTimer));
(function swipe(){ let x0 = null; heroEl.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, {passive:true}); heroEl.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50){ goSlide(slideIdx + (dx < 0 ? 1 : -1)); restartSlides(); } x0 = null; }, {passive:true}); })();
$("l-en").addEventListener("click", () => setLang("en"));
$("l-bn").addEventListener("click", () => setLang("bn"));
function setLang(l){ LANG = l; sset("fsbd-lang", l); applyStatic(); renderView(); heroDemo(); countUp(); if (!$("report").hidden) openReport(); try { document.dispatchEvent(new CustomEvent("fs:lang")); } catch(e){} }
window.addEventListener("load", () => { $("qrLib").textContent = window.jsQR ? tx().qrReady : tx().qrNoLib; });
const hs = (location.hash || "").replace("#","");
const hm = hs.match(/^(en|bn)_(s\d+|link|file|filecalc|net|qr|login|loginok|labnet|lablogs|labattack|pass|labpage|labhdr|labcode|filephish|shield)(r)?$/);
const hsl = hs.match(/^slide(\d)$/);
if (hm) LANG = hm[1];
if (hsl){ slideIdx = +hsl[1] - 1; autoplay = false; }
applyStatic();
loadExample(hm && /^s\d+$/.test(hm[2]) ? hm[2] : "s9", {scroll:false});
if (hm && hm[3]) openReport();
if (hm && hm[2] === "link"){ const u = tx().linkEx[2][1]; $("linkIn").value = u; runLink(u); }
if (hm && hm[2] === "file") runSample("fake");
if (hm && hm[2] === "filecalc") runSample("calc");
if (hm && hm[2] === "net") showNet();
if (hm && hm[2] === "qr") setTab("qr");
if (hm && (hm[2] === "login" || hm[2] === "loginok")){ const x = lb().ex[hm[2] === "login" ? 0 : 1]; loginSvc = x[0]; applyLoginStatic(); $("lgIn").value = x[1]; runLogin(); }
if (hm && hm[2] === "pass"){ setTab("pass"); $("pwIn").value = "Rahim@1998"; runPw(); }
if (hm && hm[2] === "filephish") runSample("phish");
if (hm && hm[2] === "shield") setTimeout(() => $("shield").scrollIntoView(), 300);
if (hm && /^lab(page|hdr|code)$/.test(hm[2])){ labOpen = true; labTab = {labpage:"page", labhdr:"headers", labcode:"code"}[hm[2]]; renderLab(); labTextSample(); }
else if (hm && /^lab/.test(hm[2])){ labOpen = true; labTab = hm[2] === "labnet" ? "net" : "logs"; renderLab(); labSample(hm[2] === "labnet" ? "attack" : hm[2] === "lablogs" ? "ddos" : "attack"); }
heroDemo(); countUp(); restartSlides();
