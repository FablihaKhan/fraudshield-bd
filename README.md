# FraudShield BD

Check a chat, a link, an app file (APK) or a QR code before you pay, and check a login page before you type a password. FraudShield BD reads Bangla, Banglish and English conversations turn by turn, explains every warning with evidence, and runs on your device.

**Live prototype:** https://fablihakhan.github.io/fraudshield-bd/

Research prototype by **Fabliha Afia** (CSE, BUET) for the Ziaur Rahman Foundation competition “ভবিষ্যৎ বিজ্ঞানীর খোঁজে ২০২৬”.

- All examples and sample files are fictional and harmless.
- Not affiliated with bKash, Nagad, Rocket or any bank.
- Transparent rules with hand-set weights; the score is an uncalibrated indicator, not a probability.
- Chats, links and files are checked in the browser. The optional DNS check sends only a site name to Google Public DNS, and only after the user agrees.

Three viewing levels: **Easy** (just what to do), **Learn** (why, with 30-second lessons) and **Expert** (raw analysis console).

**Security Lab** (for IT teams and learners): open a Wi-Fi packet capture (.pcap / .pcapng) to spot ARP spoofing, DNS spoofing, look-alike domains and passwords sent without TLS, or a web server log (Apache / Nginx) for DDoS early warning, password guessing, scanning and injection attempts. Everything is analysed in the browser.

`samples/` holds harmless test files: two QR images, a fake "bKash Update" APK, a disguised "PDF" that is really an app, a simple calculator APK, two synthetic packet captures (café Wi-Fi attack, normal home Wi-Fi) and three synthetic server logs (normal, DDoS, attack attempts). All addresses in them come from private or documentation ranges.

Third-party: [jsQR](https://github.com/cozmo/jsQR) 1.4.0, Apache License 2.0.
