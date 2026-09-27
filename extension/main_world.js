/* FraudShield BD Browser Shield: runs inside the page (MAIN world) at document_start.
   Holds back the CSRF trick from the lecture: a page that sends a form to ANOTHER site by script,
   without the user clicking anything (e.g. on DOMContentLoaded). The user is asked first;
   "Allow" sends it (single sign-on pages do this for real), "Block" drops it. */
(() => {
  const proto = HTMLFormElement.prototype, realSubmit = proto.submit, realRequest = proto.requestSubmit;
  const regOf = h => String(h || "").toLowerCase().split(".").slice(-2).join(".");
  const userActed = () => { try { return navigator.userActivation ? navigator.userActivation.isActive : true; } catch (e) { return true; } };
  const held = new Map(); let seq = 0;
  function crossSite(form){
    let target; try { target = new URL(form.getAttribute("action") || location.href, location.href); } catch (e) { return false; }
    return /^https?:$/.test(target.protocol) && regOf(target.hostname) !== regOf(location.hostname) ? target : false;
  }
  function hold(form, how){
    const target = crossSite(form);
    if (!target || userActed()) return false;
    const id = "f" + (++seq); held.set(id, form);
    const fields = [...form.elements].filter(el => el.name).map(el => el.name + (el.type === "hidden" ? " (hidden)" : "")).slice(0, 12);
    document.dispatchEvent(new CustomEvent("fsbd-csrf-held", {detail: {id, action: target.href.slice(0, 200), method: (form.getAttribute("method") || "get").toUpperCase(), how, fields}}));
    return true;
  }
  document.addEventListener("fsbd-csrf-allow", e => { const f = held.get(e.detail); held.delete(e.detail); if (f) realSubmit.call(f); });
  document.addEventListener("fsbd-csrf-drop", e => held.delete(e.detail));
  proto.submit = function(){ if (hold(this, "form.submit()")) return; return realSubmit.apply(this, arguments); };
  if (realRequest) proto.requestSubmit = function(){ if (hold(this, "form.requestSubmit()")) return; return realRequest.apply(this, arguments); };
  // a script "clicking" a hidden submit button is not a real click either
  document.addEventListener("submit", e => { const f = e.target; if (f instanceof HTMLFormElement && hold(f, "scripted click")) e.preventDefault(); }, true);
})();
