# FraudShield BD Browser Shield (prototype 0.1.0)

A Chrome / Edge add-on (Manifest V3) by **Fabliha Afia** (BUET CSE). It uses the same detection engine as the FraudShield BD web app and works fully offline. It needs no permission except `storage`, which it uses to remember your language and view.

## What it does

| Attack (CSE lecture) | What the shield does |
|---|---|
| Phishing, look-alike and homograph domains | Shows a banner on fake pages (for example `telegrarn.org` or `accounts.google.com.verify-login.top`). Pauses you before you type a password there. |
| Man-in-the-middle over plain `http` | Warns before a password is typed on an `http` page or sent to an `http` form. |
| Clickjacking (invisible iframes) and cursorjacking | Finds frames with an opacity below 0.2, makes them unclickable and lets you reveal them. Flags pages that hide the mouse pointer. |
| CSRF (auto-submitting forms, like the CalNet example) | Holds back any form that a script sends to another site without a real click. You choose Block or Allow; single sign-on pages do this legitimately. |
| Reflected XSS, SQL injection and command injection in links | Flags pages and links whose address carries attack code. Such a link opens only after a warning. |
| Browser-in-the-browser | Flags pages that draw a fake login window with a real-looking address. |
| Link text that lies | On hover, shows the real owner of a link whose text names a different site. |
| Tracking pixels | Counts 1×1 images from other sites. |

**Temporal integrity:** every "continue anyway" button stays disabled for 1.2 seconds after the warning appears, and only counts while the tab is visible. This stops a page from tricking you into clicking it by accident (as taught in lecture 11). All warnings are drawn in a closed shadow DOM, so the page cannot read or restyle them.

## Install (developer mode)

1. Unzip `FraudShield_BD_Browser_Shield.zip`.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose the unzipped folder.

The popup has Easy and Expert views, and English and Bangla. Expert view shows the CWE ids, the URL evidence and the fields of any held-back form.

## Practice pages (try it safely)

Five harmless practice pages (kept offline, not published, because they imitate login pages) cover a fake Telegram login, an invisible clickjacking frame, a CSRF auto-submit form, lying and attack links, and a normal page. Each page names the web address it pretends to be in a `fsbd-test-url` tag, and the shield honours that tag only for pages on your own computer. In `chrome://extensions`, open the add-on's **Details** and turn on **Allow access to file URLs**, then double-click a page.

## Limits

- The checks are heuristics, so the shield can miss attacks or warn on safe pages.
- It checks the top page only. It does not look inside frames from other sites.
- It is a prototype. A Chrome Web Store release needs a review first.
