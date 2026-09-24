# FraudShield BD

Check a chat, a link, an app file (APK) or a QR code before you pay. FraudShield BD reads Bangla, Banglish and English conversations turn by turn, explains every warning with evidence, and runs on your device.

**Live prototype:** https://fablihakhan.github.io/fraudshield-bd/

Research prototype by **Fabliha Afia** (CSE, BUET) for the Ziaur Rahman Foundation competition “ভবিষ্যৎ বিজ্ঞানীর খোঁজে ২০২৬”.

- All examples and sample files are fictional and harmless.
- Not affiliated with bKash, Nagad, Rocket or any bank.
- Transparent rules with hand-set weights; the score is an uncalibrated indicator, not a probability.
- Chats, links and files are checked in the browser. The optional DNS check sends only a site name to Google Public DNS, and only after the user agrees.

`samples/` holds two QR test images (a look-alike link and the official bKash site).

Third-party: [jsQR](https://github.com/cozmo/jsQR) 1.4.0, Apache License 2.0.
