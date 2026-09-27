/* FraudShield BD Browser Shield: popup (Easy / Expert, English / Bangla) */
const CFG = {lang: "en", level: "simple", on: true};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
let tabId = null, data = null;

function paintStatic(){
  const S = FSBD_S[CFG.lang];
  document.documentElement.lang = CFG.lang;
  $("tg").textContent = S.tag; $("onLbl").textContent = S.on; $("onBox").checked = CFG.on;
  $("ft").textContent = S.footer; $("mk").textContent = S.made;
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === CFG.lang)));
  document.querySelectorAll("[data-level]").forEach(b => { b.textContent = S[b.dataset.level === "simple" ? "easy" : "expert"]; b.setAttribute("aria-pressed", String(b.dataset.level === CFG.level)); b.style.color = b.dataset.level === CFG.level ? "" : "#075985"; });
}
function paint(){
  paintStatic();
  const S = FSBD_S[CFG.lang], out = $("out");
  if (!CFG.on){ out.innerHTML = `<div class="verdict v-off"><div class="dot">–</div><div><b>${esc(S.off)}</b><small>${esc(S.offSub)}</small></div></div>`; return; }
  if (!data || data.localish){ out.innerHTML = `<div class="verdict v-off"><div class="dot">i</div><div><b>${esc(S.notWeb)}</b></div></div>`; return; }
  const v = data.verdict, title = v === "high" ? S.danger : v === "verify" ? S.careful : S.safe;
  const text = f => { try { return S.f[f.id](f.data); } catch (e) { return f.id; } };
  const expert = CFG.level === "expert";
  const list = (expert ? data.findings : data.findings.filter(f => f.sev !== "low").slice(0, 3));
  out.innerHTML = `<div class="verdict v-${v}"><div class="dot">${v === "low" ? "✓" : "!"}</div><div><b>${esc(title)}</b><small>${esc(data.host)}</small></div></div>
    <div class="counts"><div><b>${data.counts.pixels}</b><span>${esc(S.pixels)}</span></div><div><b>${data.counts.frames}</b><span>${esc(S.frames)}</span></div><div><b>${data.counts.held}</b><span>${esc(S.forms)}</span></div><div><b>${data.counts.links}</b><span>${esc(S.links)}</span></div></div>
    <div class="list">${list.map(f => `<div class="f ${f.sev}">${esc(text(f))}${expert && f.cwe ? ` <code>${esc(f.cwe)}</code>` : ""}</div>`).join("")}</div>
    ${data.counts.frames ? `<div class="row"><button class="btn" id="reveal">${esc(S.show)}: ${esc(S.frames)}</button></div>` : ""}
    ${expert && data.url ? `<div class="xp">host: ${esc(data.url.host)}<br>registrable: ${esc(data.url.reg || "")}<br>category: ${esc(data.url.category)} · verdict: ${esc(data.url.verdict)}${data.url.official ? "<br>official: " + esc(data.url.official) : ""}<br>evidence: ${esc(data.url.evidence.join(", ") || "–")}${data.held.length ? "<br>held forms: " + esc(data.held.map(h => h.method + " " + h.host + " [" + h.fields.join(", ") + "]").join("; ")) : ""}</div>` : ""}`;
  const r = $("reveal"); if (r) r.onclick = () => chrome.tabs.sendMessage(tabId, {type: "fsbd-reveal"});
}
function save(){ chrome.storage.local.set(CFG); if (tabId !== null) chrome.tabs.sendMessage(tabId, {type: "fsbd-settings", cfg: CFG}, () => void chrome.runtime.lastError); paint(); }

document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { CFG.lang = b.dataset.lang; save(); });
document.querySelectorAll("[data-level]").forEach(b => b.onclick = () => { CFG.level = b.dataset.level; save(); });
$("onBox").onchange = e => { CFG.on = e.target.checked; save(); };

chrome.storage.local.get(CFG, v => {
  Object.assign(CFG, v); paintStatic();
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const forced = +new URLSearchParams(location.search).get("tab"); // used by the automated tests, which open the popup as a page
    tabId = forced || (tabs[0] ? tabs[0].id : null);
    if (tabId === null) return paint();
    chrome.tabs.sendMessage(tabId, {type: "fsbd-get"}, res => { void chrome.runtime.lastError; data = res || null; paint(); });
  });
});
