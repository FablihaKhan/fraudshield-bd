# FraudShield BD

Check a chat, a link, an app file (APK) or a QR code before you pay, and check a login page before you type a password. FraudShield BD reads Bangla, Banglish and English conversations turn by turn, explains every warning with evidence, and runs on your device.

**Live prototype:** https://fablihakhan.github.io/fraudshield-bd/

Research prototype by **Fabliha Afia** (CSE, BUET) for the Ziaur Rahman Foundation competition “ভবিষ্যৎ বিজ্ঞানীর খোঁজে ২০২৬”.

- All examples and sample files are fictional and harmless.
- Not affiliated with bKash, Nagad, Rocket or any bank.
- Transparent rules with hand-set weights; the score is an uncalibrated indicator, not a probability.
- Chats, links and files are checked in the browser. The optional DNS check sends only a site name to Google Public DNS, and only after the user agrees.

Three viewing levels: **Easy** (just what to do), **Learn** (why, with 30-second lessons) and **Expert** (raw analysis console).

**Profiles**: the first screen asks “Who is using FraudShield?” — Everyday, Learner, Website & code, or Security pro. Each gets its own home with only its tools, and each tool opens on its own screen. No account; the choice stays on the device. The full website is one tap away.

**Security Lab** (for IT teams and learners): open a Wi-Fi packet capture (.pcap / .pcapng) to spot ARP spoofing, DNS spoofing, look-alike domains and passwords sent without TLS, or a web server log (Apache / Nginx) for DDoS early warning, password guessing, scanning and injection attempts. Everything is analysed in the browser.

**Password check**: shows how fast a password falls to online guessing versus an offline attack on a leaked database (slow salted hash vs fast MD5/SHA), makes 7-word passphrases, and offers an opt-in leak check with Have I Been Pwned that sends only the first 5 characters of the SHA-1 hash (k-anonymity). A live PBKDF2 demo in Expert view.

**Web attack tools** (Security Lab): Page & email X-ray (tracking pixels, CSRF images, auto-submitting forms, invisible iframes / clickjacking, lying links, browser-in-the-browser windows), Website check (security headers and cookie flags with an A–F grade and exact fixes), and Code check (SQL injection, command injection, XSS sinks, weak password hashing, with CWE ids and the safe way). Server logs now also flag cross-site forged requests (CSRF).

**Browser Shield** ([download](extension/FraudShield_BD_Browser_Shield.zip)): a Chrome / Edge add-on (Manifest V3, `storage` permission only) that pauses you before a password goes to a look-alike or unlocked page, neutralises invisible frames, holds back forms a page sends to another site by script (CSRF), and warns on links carrying XSS / SQL injection code. Install: unzip, open `chrome://extensions`, turn on Developer mode, click "Load unpacked".

`samples/` holds harmless test files: two QR images, a fake "bKash Update" APK, a disguised "PDF" that is really an app, a simple calculator APK, two synthetic packet captures (café Wi-Fi attack, normal home Wi-Fi) and three synthetic server logs (normal, DDoS, attack attempts). All addresses in them come from private or documentation ranges.

Third-party: [jsQR](https://github.com/cozmo/jsQR) 1.4.0, Apache License 2.0.
