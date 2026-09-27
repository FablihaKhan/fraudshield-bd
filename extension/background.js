/* FraudShield BD Browser Shield: badge per tab. Nothing is sent anywhere. */
const COLORS = {high: "#E07A6B", verify: "#E3A74F", low: "#46B394"};
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "fsbd-state" || !sender.tab || sender.frameId !== 0) return;
  const tabId = sender.tab.id, n = msg.alerts || 0; self.lastTabId = tabId;
  chrome.action.setBadgeText({tabId, text: msg.level === "high" ? "!" : n ? String(n) : ""});
  chrome.action.setBadgeBackgroundColor({tabId, color: COLORS[msg.level] || COLORS.low});
  chrome.action.setTitle({tabId, title: "FraudShield BD: " + (msg.title || "")});
});
