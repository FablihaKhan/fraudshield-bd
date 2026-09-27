"""Builds harmless sample APK files for the Attachment Safety demo.
They contain only a binary AndroidManifest.xml, a stub classes.dex (no code) and a text manifest.
They cannot run. Usage: python make_samples.py"""
import struct, zipfile, io, hashlib, base64, os

def axml(package, version, label, perms, services):
    strings = []
    def S(s):
        if s not in strings: strings.append(s)
        return strings.index(s)
    NS = "http://schemas.android.com/apk/res/android"
    S("android"); S(NS)
    chunks = []
    def attr(name, val, typ=0x03):
        ns = S(NS) if name != "package" and name != "versionName_plain" else 0xFFFFFFFF
        if name == "package": ns = 0xFFFFFFFF
        n = S(name)
        if typ == 0x03:
            v = S(val); return struct.pack("<IIIHBBI", ns, n, v, 8, 0, 0x03, v)
        return struct.pack("<IIIHBBI", ns, n, 0xFFFFFFFF, 8, 0, typ, val)
    def start(tag, attrs):
        t = S(tag); body = struct.pack("<IIHHHHHH", 0xFFFFFFFF, t, 0x14, 0x14, len(attrs), 0, 0, 0) + b"".join(attrs)
        chunks.append(struct.pack("<HHIII", 0x0102, 16, 16 + len(body), 1, 0xFFFFFFFF) + body)
    def end(tag):
        chunks.append(struct.pack("<HHIIIII", 0x0103, 16, 24, 1, 0xFFFFFFFF, 0xFFFFFFFF, S(tag)))
    chunks.append(struct.pack("<HHIIIII", 0x0100, 16, 24, 1, 0xFFFFFFFF, S("android"), S(NS)))
    start("manifest", [attr("package", package), attr("versionName", version)])
    for p in perms:
        start("uses-permission", [attr("name", p)]); end("uses-permission")
    start("application", [attr("label", label)])
    for name, perm, exported in services:
        a = [attr("name", name)]
        if perm: a.append(attr("permission", perm))
        a.append(attr("exported", 0xFFFFFFFF if exported else 0, 0x12))
        start("service", a); end("service")
    end("application"); end("manifest")
    chunks.append(struct.pack("<HHIIIII", 0x0101, 16, 24, 1, 0xFFFFFFFF, S("android"), S(NS)))
    # string pool (UTF-16)
    data = b""; offs = []
    for s in strings:
        offs.append(len(data)); enc = s.encode("utf-16-le")
        data += struct.pack("<H", len(s)) + enc + b"\x00\x00"
    while len(data) % 4: data += b"\x00"
    hdr = 28; start_ = hdr + 4 * len(strings)
    pool = struct.pack("<HHIIIIII", 0x0001, hdr, start_ + len(data), len(strings), 0, 0, start_, 0) + b"".join(struct.pack("<I", o) for o in offs) + data
    body = pool + b"".join(chunks)
    return struct.pack("<HHI", 0x0003, 8, 8 + len(body)) + body

def apk(manifest):
    b = io.BytesIO()
    with zipfile.ZipFile(b, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("AndroidManifest.xml", manifest)
        z.writestr("classes.dex", b"dex\n035\x00" + b"\x00" * 104)
        z.writestr("META-INF/MANIFEST.MF", "Manifest-Version: 1.0\nCreated-By: FraudShield BD harmless demo sample (no code)\n")
    return b.getvalue()

P = "android.permission."
fake = apk(axml("com.bkash.secure.update", "7.1", "bKash Update",
    [P+"INTERNET", P+"READ_SMS", P+"RECEIVE_SMS", P+"SYSTEM_ALERT_WINDOW", P+"REQUEST_INSTALL_PACKAGES", P+"READ_CONTACTS"],
    [(".AccessHelper", P+"BIND_ACCESSIBILITY_SERVICE", True), (".NotifyReader", P+"BIND_NOTIFICATION_LISTENER_SERVICE", True)]))
calc = apk(axml("org.example.simplecalculator", "2.0", "Simple Calculator", [P+"VIBRATE"], []))
disg = apk(axml("com.receipt.pdfviewer", "1.3", "PDF Viewer", [P+"INTERNET", P+"READ_SMS", P+"RECEIVE_SMS", P+"SYSTEM_ALERT_WINDOW"], [(".Sync", None, True)]))
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "05_Prototype", "samples")
open(os.path.join(out, "sample_fake_bKash_Update.apk"), "wb").write(fake)
open(os.path.join(out, "sample_simple_calculator.apk"), "wb").write(calc)
open(os.path.join(out, "sample_disguised_Payment_Receipt.pdf"), "wb").write(disg)
js = "const SAMPLE_FILES = {\n fake:{name:'bKash_Update.apk', b64:'%s'},\n disguised:{name:'Payment_Receipt.pdf', b64:'%s'},\n calc:{name:'Simple_Calculator.apk', b64:'%s'}\n};\nconst DEMO_HASHES = {'%s':'FraudShield demo sample: fake bKash update'};\n" % (
    base64.b64encode(fake).decode(), base64.b64encode(disg).decode(), base64.b64encode(calc).decode(), hashlib.sha256(fake).hexdigest())
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "samples_data.js"), "w").write(js)
print(len(fake), len(calc), hashlib.sha256(fake).hexdigest())
