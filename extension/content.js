/* FraudShield BD Browser Shield: content script (isolated world). Uses the same engine as the web app
   (lib.js = engine.js + modules.js + websec.js). Everything runs on this computer; nothing is sent. */
(() => {
  if (window.__fsbd) return; window.__fsbd = true;
  const CFG = {lang: "en", level: "simple", on: true};
  const S = () => FSBD_S[CFG.lang] || FSBD_S.en;
  const DELAY = 1200; // temporal integrity: buttons wake up only after the warning has been visible for a moment
  const state = {verdict: "low", url: null, findings: [], pixels: 0, pixelHosts: [], frames: [], held: [], riskyLinks: 0, accepted: false, cursor: false};
  let host = location.hostname, href = location.href, proto = location.protocol;
  const reg = h => { try { return regDomainOf(h); } catch (e) { return h; } };
  const local = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/.test(host) || !/^https?:$/.test(location.protocol);
  let localish = local;
  // Practice pages: a page on this computer may say which web address it pretends to be,
  // e.g. <meta name="fsbd-test-url" content="http://telegrarn.org/login">. Only local pages can do this.
  function practiceUrl(){
    if (!local) return false;
    const m = document.querySelector('meta[name="fsbd-test-url"]'); if (!m) return false;
    try { const u = new URL(m.content); if (!/^https?:$/.test(u.protocol)) return false; href = u.href; host = u.hostname; proto = u.protocol; localish = false; state.practice = true; return true; } catch (e) { return false; }
  }
  const orgName = k => (REGISTRY.orgs[k] && REGISTRY.orgs[k].en) || k || "";
  const add = (id, sev, data, cwe) => { if (!state.findings.some(f => f.id === id)) state.findings.push({id, sev, data: data || {}, cwe: cwe || ""}); };

  /* ---------- 1. the page address itself ---------- */
  let pageDanger = false, pageWhy = "";
  function checkAddress(){
    if (localish) return;
    const r = inspectUrl(href); state.url = r;
    const has = k => r.evidence.some(e => e.kind === k);
    if (r.category === "dangerous" && !has("private_ip")){
      pageDanger = true;
      if (has("lookalike")) add("lookalike", "high", {brand: orgName(r.brand) || r.lookalikeOf, host}, "CWE-451");
      else if (has("brand_in_host") && r.brand) add("brand_fake", "high", {brand: orgName(r.brand), host}, "CWE-451");
      else add("deceptive", "high", {reg: r.reg || host}, "CWE-451");
      pageWhy = S().f[state.findings[state.findings.length - 1].id](state.findings[state.findings.length - 1].data);
    }
    if (proto === "http:") add("no_tls", "medium", {}, "CWE-319");
    const pl = urlPayloadCheck(href).filter(p => /_payload$/.test(p.kind));
    if (pl.length) add("payload", "high", {kinds: pl.map(p => p.kind.replace("_payload", "").toUpperCase()).join(", ")}, pl[0].cwe);
  }

  /* ---------- 2. overlay UI in a closed shadow root (the page can't read or restyle it) ---------- */
  let root = null, hostEl = null;
  function ui(){
    if (root) return root;
    hostEl = document.createElement("fsbd-shield");
    hostEl.style.cssText = "all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none";
    root = hostEl.attachShadow({mode: (state.practice || (local && document.querySelector('meta[name="fsbd-test-url"]'))) ? "open" : "closed"}); // open only on local practice pages, so demos and tests can press its buttons
    root.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box;font-family:"Segoe UI",system-ui,"Noto Sans Bengali",sans-serif}
      .bar{pointer-events:auto;position:fixed;left:50%;top:12px;transform:translateX(-50%);width:min(680px,calc(100vw - 24px));background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(11,37,69,.28);border:2px solid #E07A6B;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;color:#0B2545}
      .bar.m{border-color:#E3A74F}.ic{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#FFF3F0;color:#E07A6B;font:800 22px/1 sans-serif}
      .bar.m .ic{background:#FFF8EC;color:#B7791F}.tx{flex:1;min-width:0}.tx b{display:block;font-size:16px;margin-bottom:3px}.tx p{margin:0 0 4px;font-size:14px;line-height:1.4}
      .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
      button{pointer-events:auto;border:0;border-radius:999px;padding:8px 14px;font-weight:700;font-size:13.5px;cursor:pointer;background:#E0F2FE;color:#075985}
      button.go{background:#0EA5E9;color:#fff}button.red{background:#E07A6B;color:#fff}button:disabled{opacity:.45;cursor:not-allowed}
      .veil{pointer-events:auto;position:fixed;inset:0;background:rgba(11,37,69,.55);display:grid;place-items:center}
      .card{width:min(460px,calc(100vw - 24px));background:#fff;border-radius:22px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.35);color:#0B2545;text-align:center}
      .card .big{width:64px;height:64px;margin:0 auto 10px;border-radius:20px;background:#FFF3F0;color:#E07A6B;display:grid;place-items:center;font:800 34px/1 sans-serif}
      .card b{display:block;font-size:19px;margin-bottom:6px}.card p{margin:0 0 6px;font-size:14.5px;line-height:1.45}.card .row{justify-content:center}
      .small{font-size:12px;color:#5B6B7F}code{font:12px Consolas,monospace;background:#F1F5F9;border-radius:6px;padding:1px 5px;word-break:break-all}
      .tipx{position:fixed;pointer-events:none;background:#0B2545;color:#fff;border-radius:10px;padding:6px 10px;font-size:12.5px;max-width:340px;box-shadow:0 6px 20px rgba(0,0,0,.25)}
      .tipx.bad{background:#A4453A}.tipx i{font-style:normal;opacity:.75}
    </style><div id="bars"></div><div id="modal"></div><div id="tip"></div>`;
    (document.documentElement || document).appendChild(hostEl);
    return root;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
  function banner(id, sev, title, lines, buttons){
    const r = ui(), el = document.createElement("div");
    el.className = "bar" + (sev === "high" ? "" : " m"); el.dataset.id = id;
    el.innerHTML = `<div class="ic">!</div><div class="tx"><b>${esc(title)}</b>${lines.map(l => `<p>${esc(l)}</p>`).join("")}<div class="row"></div></div>`;
    const row = el.querySelector(".row");
    (buttons || []).concat([{label: S().dismiss, fn: () => el.remove()}]).forEach(b => { const x = document.createElement("button"); x.textContent = b.label; if (b.cls) x.className = b.cls; x.onclick = b.fn; row.appendChild(x); });
    r.getElementById("bars").querySelectorAll(`[data-id="${id}"]`).forEach(n => n.remove());
    r.getElementById("bars").appendChild(el);
  }
  // a modal whose "risky" button only wakes up after DELAY ms of being visible (defends against clickjacking / double-click tricks)
  function modal(title, lines, safeBtn, riskyBtn){
    const r = ui(), m = r.getElementById("modal");
    m.innerHTML = `<div class="veil"><div class="card" role="alertdialog"><div class="big">!</div><b>${esc(title)}</b>${lines.map(l => `<p>${l}</p>`).join("")}<div class="row"><button class="go" id="safe">${esc(safeBtn.label)}</button><button id="risky" disabled>${esc(S().wait)}</button></div></div></div>`;
    const risky = m.querySelector("#risky"); let armed = false;
    const arm = () => { if (armed) return; armed = true; setTimeout(() => { if (document.visibilityState === "visible"){ risky.disabled = false; risky.textContent = riskyBtn.label; } else armed = false; }, DELAY); };
    arm(); document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && risky.disabled){ armed = false; arm(); } });
    m.querySelector("#safe").onclick = () => { m.innerHTML = ""; safeBtn.fn(); };
    risky.onclick = () => { if (risky.disabled) return; m.innerHTML = ""; riskyBtn.fn(); };
    m.querySelector("#safe").focus();
  }
  const leave = () => { if (history.length > 1) history.back(); else location.replace("about:blank"); };

  /* ---------- 3. password guard ---------- */
  const isPw = el => el && el.tagName === "INPUT" && (el.type || "").toLowerCase() === "password";
  function pwRisk(field){
    if (pageDanger) return {why: pageWhy};
    const form = field && field.form;
    if (form){
      let t = null; try { t = new URL(form.getAttribute("action") || location.href, location.href); } catch (e) {}
      if (t && t.protocol === "http:" && !localish) return {why: S().f.pw_http({})};
      if (t && reg(t.hostname) !== reg(host)){
        const r = inspectUrl(t.href);
        if (r.category === "dangerous"){ add("form_foreign", "high", {host: t.hostname}, "CWE-346"); return {why: S().f.form_foreign({host: t.hostname})}; }
      }
    }
    if (proto === "http:" && !localish) return {why: S().f.pw_http({})};
    return null;
  }
  function pwWarn(field){
    const risk = pwRisk(field); if (!risk || state.accepted) return false;
    if (field) field.blur();
    modal(S().danger, [esc(S().f.pw_danger(risk))], {label: S().leave, fn: leave}, {label: S().understand, fn: () => { state.accepted = true; if (field) field.focus(); }});
    report(); return true;
  }
  document.addEventListener("focusin", e => { if (CFG.on && isPw(e.target)) pwWarn(e.target); }, true);
  ["keydown", "paste", "beforeinput"].forEach(ev => document.addEventListener(ev, e => {
    if (!CFG.on || !isPw(e.target) || state.accepted || !pwRisk(e.target)) return;
    e.preventDefault(); e.stopImmediatePropagation(); pwWarn(e.target);
  }, true));
  document.addEventListener("submit", e => {
    if (!CFG.on || state.accepted) return;
    const f = e.target, pw = f && f.querySelector && f.querySelector("input[type=password]");
    if (pw && pw.value && pwRisk(pw)){ e.preventDefault(); e.stopImmediatePropagation(); pwWarn(pw); }
  }, true);

  /* ---------- 4. CSRF: forms the page tries to send by itself (held by main_world.js) ---------- */
  document.addEventListener("fsbd-csrf-held", e => {
    const d = e.detail || {}; let h = ""; try { h = new URL(d.action).hostname; } catch (err) {}
    state.held.push({host: h, method: d.method, how: d.how, fields: d.fields || []}); add("csrf", "high", {host: h, how: d.how}, "CWE-352"); report();
    if (!CFG.on){ document.dispatchEvent(new CustomEvent("fsbd-csrf-allow", {detail: d.id})); return; }
    const extra = CFG.level === "expert" ? `<p class="small">${esc(d.method)} <code>${esc(d.action)}</code><br>${esc((d.fields || []).join(", "))}</p>` : "";
    modal(S().held, [esc(S().f.csrf({host: h, how: d.how})), `<span class="small">${esc(S().heldSub)}</span>`, extra],
      {label: S().block, fn: () => document.dispatchEvent(new CustomEvent("fsbd-csrf-drop", {detail: d.id}))},
      {label: S().allow, fn: () => document.dispatchEvent(new CustomEvent("fsbd-csrf-allow", {detail: d.id}))});
  });

  /* ---------- 5. clickjacking: invisible frames, hidden pointer ---------- */
  function effectiveOpacity(el){ let o = 1, n = el, i = 0; while (n && n.nodeType === 1 && i++ < 12){ o *= parseFloat(getComputedStyle(n).opacity || "1"); n = n.parentElement; } return o; }
  function scanFrames(){
    const found = [];
    document.querySelectorAll("iframe, frame, object, embed").forEach(fr => {
      const r = fr.getBoundingClientRect(); if (r.width < 40 || r.height < 20) return;
      if (effectiveOpacity(fr) < 0.2){ found.push(fr); if (CFG.on && !fr.dataset.fsbd){ fr.dataset.fsbd = "1"; fr.style.setProperty("pointer-events", "none", "important"); } }
    });
    state.frames = found;
    if (found.length) add("hidden_frame", "high", {n: found.length, src: found.map(f => (f.src || "").slice(0, 80))}, "CWE-1021");
    const cur = el => el && getComputedStyle(el).cursor === "none";
    if (cur(document.body) || cur(document.documentElement)){ state.cursor = true; add("cursor", "medium", {}, "CWE-1021"); }
  }
  function revealFrames(){ state.frames.forEach(f => { f.style.setProperty("opacity", "0.85", "important"); f.style.setProperty("outline", "4px dashed #E07A6B", "important"); }); }

  /* ---------- 6. spy pixels ---------- */
  function scanPixels(){
    const hosts = new Set(); let n = 0;
    document.querySelectorAll("img").forEach(img => {
      if (!img.complete || !/^https?:/.test(img.currentSrc || img.src)) return;
      const tiny = (img.naturalWidth <= 2 && img.naturalHeight <= 2) || (img.width <= 1 && img.height <= 1);
      let h = ""; try { h = new URL(img.currentSrc || img.src).hostname; } catch (e) { return; }
      if (tiny && reg(h) !== reg(host)){ n++; hosts.add(h); }
    });
    state.pixels = n; state.pixelHosts = [...hosts].slice(0, 5);
    if (n) add("pixel", "low", {n, hosts: state.pixelHosts.join(", ")}, "CWE-359");
  }

  /* ---------- 7. page source X-ray (same rules as the web app) ---------- */
  function scanSource(){
    let r; try { r = pageScan(document.documentElement.outerHTML.slice(0, 1500000), {pageHost: host}); } catch (e) { return; }
    r.findings.forEach(f => {
      if (f.kind === "csrf_img") add("csrf_img", "high", f.data, f.cwe);
      if (f.kind === "browser_in_browser" && !/^(accounts\.google\.com|www\.facebook\.com|web\.telegram\.org|www\.bkash\.com|login\.microsoftonline\.com|appleid\.apple\.com)$/.test(host)) add("bitb", "high", f.data, f.cwe);
    });
  }

  /* ---------- 8. links: show the real owner on hover, stop attack links on click ---------- */
  let linkCache = new WeakMap();
  function linkInfo(a){
    if (linkCache.has(a)) return linkCache.get(a);
    let info = null, u; try { u = new URL(a.href, location.href); } catch (e) { linkCache.set(a, null); return null; }
    if (!/^https?:$/.test(u.protocol)){ linkCache.set(a, null); return null; }
    const shown = (a.textContent || "").trim().match(/^(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?:[\/:?#]|$)/i);
    const pl = urlPayloadCheck(u.href).filter(p => /_payload$/.test(p.kind));
    const r = inspectUrl(u.href), ext = reg(u.hostname) !== reg(host);
    if (pl.length) info = {bad: true, text: S().f.link_payload({kinds: pl.map(p => p.kind.replace("_payload", "").toUpperCase()).join(", ")}), host: u.hostname};
    else if (r.category === "dangerous" && !r.privateIp) info = {bad: true, text: S().f.link_bad({host: u.hostname, why: r.lookalikeOf ? (CFG.lang === "bn" ? r.lookalikeOf + "-এর নকল" : "a copy of " + r.lookalikeOf) : (CFG.lang === "bn" ? "ধোঁকার ঠিকানা" : "a tricky address")}), host: u.hostname};
    else if (shown && reg(shown[1].toLowerCase()) !== reg(u.hostname)) info = {bad: true, text: S().f.link_shown({shown: shown[1], host: u.hostname}), host: u.hostname};
    else if (ext) info = {bad: false, text: S().real + ": " + (r.reg || u.hostname), host: u.hostname};
    linkCache.set(a, info); return info;
  }
  document.addEventListener("mouseover", e => {
    if (!CFG.on) return; const a = e.target.closest && e.target.closest("a[href]"); const t = root && root.getElementById("tip");
    if (!a){ if (t) t.innerHTML = ""; return; }
    const info = linkInfo(a); if (!info || (!info.bad && CFG.level !== "expert")){ if (t) t.innerHTML = ""; return; }
    const tip = ui().getElementById("tip"), rc = a.getBoundingClientRect();
    tip.innerHTML = `<div class="tipx ${info.bad ? "bad" : ""}" style="left:${Math.max(8, Math.min(innerWidth - 350, rc.left))}px;top:${rc.bottom + 6 > innerHeight - 60 ? rc.top - 44 : rc.bottom + 6}px">${info.bad ? "⚠ " : ""}${esc(info.text)}</div>`;
  }, true);
  document.addEventListener("click", e => {
    if (!CFG.on || e.button !== 0) return; const a = e.target.closest && e.target.closest("a[href]"); if (!a || a.dataset.fsbdOk) return;
    const info = linkInfo(a); if (!info || !info.bad) return;
    e.preventDefault(); e.stopImmediatePropagation(); state.riskyLinks++; report();
    modal(S().careful, [esc(info.text)], {label: S().goBack, fn: () => {}}, {label: S().openAnyway, fn: () => { a.dataset.fsbdOk = "1"; a.click(); }});
  }, true);

  /* ---------- 9. report to the badge and the popup ---------- */
  function verdict(){ return state.findings.some(f => f.sev === "high") ? "high" : state.findings.some(f => f.sev === "medium") ? "verify" : "low"; }
  function report(){
    state.verdict = verdict();
    const alerts = state.findings.filter(f => f.sev !== "low").length;
    try { chrome.runtime.sendMessage({type: "fsbd-state", level: state.verdict, alerts, title: state.verdict === "high" ? S().danger : state.verdict === "verify" ? S().careful : S().safe}); } catch (e) {}
  }
  chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (!msg) return;
    if (msg.type === "fsbd-get"){
      reply({host, localish, practice: !!state.practice, on: CFG.on, verdict: state.verdict, findings: state.findings.map(f => ({id: f.id, sev: f.sev, cwe: f.cwe, data: f.data})),
        counts: {pixels: state.pixels, frames: state.frames.length, held: state.held.length, links: state.riskyLinks},
        url: state.url ? {reg: state.url.reg, host: state.url.host, category: state.url.category, verdict: state.url.verdict, official: state.url.official || "", evidence: state.url.evidence.map(e => e.kind)} : null,
        held: state.held});
    } else if (msg.type === "fsbd-reveal"){ revealFrames(); reply({ok: true}); }
    else if (msg.type === "fsbd-settings"){ Object.assign(CFG, msg.cfg || {}); linkCacheReset(); reply({ok: true}); }
  });
  function linkCacheReset(){ linkCache = new WeakMap(); }

  function firstBanners(){
    if (!CFG.on || localish) return;
    const main = state.findings.find(f => ["lookalike", "brand_fake", "deceptive", "payload"].includes(f.id));
    if (main) banner(main.id, "high", S().danger, [S().f[main.id](main.data)], [{label: S().leave, cls: "red", fn: leave}]);
    const fr = state.findings.find(f => f.id === "hidden_frame");
    if (fr) banner("frames", "high", S().careful, [S().f.hidden_frame(fr.data)], [{label: S().show, fn: revealFrames}]);
    const bb = state.findings.find(f => f.id === "bitb");
    if (bb) banner("bitb", "high", S().careful, [S().f.bitb(bb.data)], [{label: S().leave, cls: "red", fn: leave}]);
  }
  function scanAll(){ if (localish) { report(); return; } try { scanFrames(); scanPixels(); scanSource(); } catch (e) {} report(); }

  chrome.storage.local.get({lang: "en", level: "simple", on: true}, v => {
    Object.assign(CFG, v);
    if (!CFG.on) return report();
    if (!local) { checkAddress(); report(); }
    const ready = () => { if (local && practiceUrl()) checkAddress(); scanAll(); firstBanners(); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, {once: true}); else ready();
    window.addEventListener("load", () => setTimeout(scanAll, 300), {once: true});
    let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { scanFrames(); report(); }, 800); }).observe(document.documentElement, {subtree: true, childList: true});
  });
  chrome.storage.onChanged.addListener(ch => { for (const k in ch) CFG[k] = ch[k].newValue; linkCacheReset(); });
})();
