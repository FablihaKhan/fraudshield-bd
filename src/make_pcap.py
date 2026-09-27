"""Builds two small, synthetic packet captures (classic .pcap, Ethernet) for the Security Lab demo.
   1. cafe_wifi_attack.pcap  - a man-in-the-middle story on public Wi-Fi (ARP spoofing, DNS spoofing,
      a look-alike Telegram login page and a password sent over plain HTTP).
   2. home_normal.pcap       - ordinary browsing for comparison.
   All addresses are private or documentation ranges (RFC 1918 / RFC 5737). No real traffic is included.
   Usage: python make_pcap.py"""
import struct, os, base64

def mac(s): return bytes(int(x, 16) for x in s.split(":"))
def ip(s): return bytes(int(x) for x in s.split("."))
def csum(b):
    if len(b) % 2: b += b"\x00"
    s = sum(struct.unpack("!%dH" % (len(b) // 2), b)); s = (s >> 16) + (s & 0xffff); s += s >> 16
    return (~s) & 0xffff
def eth(dst, src, etype, payload): return mac(dst) + mac(src) + struct.pack("!H", etype) + payload
def ipv4(src, dst, proto, payload, ttl=64, ident=1):
    h = struct.pack("!BBHHHBBH4s4s", 0x45, 0, 20 + len(payload), ident, 0, ttl, proto, 0, ip(src), ip(dst))
    h = h[:10] + struct.pack("!H", csum(h)) + h[12:]
    return h + payload
def udp(sport, dport, payload): return struct.pack("!HHHH", sport, dport, 8 + len(payload), 0) + payload
def tcp(sport, dport, flags, payload=b"", seq=1000, ack=0):
    return struct.pack("!HHIIBBHHH", sport, dport, seq, ack, 5 << 4, flags, 64240, 0, 0) + payload
def qname(n): return b"".join(bytes([len(p)]) + p.encode() for p in n.split(".")) + b"\x00"
def dns_query(tid, name): return struct.pack("!HHHHHH", tid, 0x0100, 1, 0, 0, 0) + qname(name) + struct.pack("!HH", 1, 1)
def dns_resp(tid, name, addr): return struct.pack("!HHHHHH", tid, 0x8180, 1, 1, 0, 0) + qname(name) + struct.pack("!HH", 1, 1) + struct.pack("!HHHIH", 0xC00C, 1, 1, 300, 4) + ip(addr)
def arp_reply(sha, spa, tha, tpa): return struct.pack("!HHBBH", 1, 0x0800, 6, 4, 2) + mac(sha) + ip(spa) + mac(tha) + ip(tpa)
def client_hello(sni):
    name = sni.encode(); ext = struct.pack("!HHHBH", 0x0000, len(name) + 5, len(name) + 3, 0, len(name)) + name
    body = b"\x03\x03" + bytes(32) + b"\x00" + struct.pack("!H", 2) + b"\x13\x01" + b"\x01\x00" + struct.pack("!H", len(ext)) + ext
    hs = b"\x01" + struct.pack("!I", len(body))[1:] + body
    return b"\x16\x03\x01" + struct.pack("!H", len(hs)) + hs

ROUTER, PHONE, ATTACK = "aa:bb:cc:00:00:01", "02:11:22:33:44:23", "de:ad:be:ef:00:66"
def pcap(packets):
    out = struct.pack("<IHHiIII", 0xa1b2c3d4, 2, 4, 0, 0, 65535, 1)
    t0 = 1790000000  # fixed timestamp base
    for i, (dt, frame) in enumerate(packets):
        ts = t0 + dt; sec = int(ts); usec = int((ts - sec) * 1e6)
        out += struct.pack("<IIII", sec, usec, len(frame), len(frame)) + frame
    return out

def attack():
    P = []
    P.append((0.00, eth(PHONE, ROUTER, 0x0806, arp_reply(ROUTER, "192.168.0.1", PHONE, "192.168.0.23"))))
    P.append((0.40, eth(ROUTER, PHONE, 0x0800, ipv4("192.168.0.23", "8.8.8.8", 17, udp(53001, 53, dns_query(0x1a01, "web.telegram.org"))))))
    P.append((0.45, eth(PHONE, ROUTER, 0x0800, ipv4("8.8.8.8", "192.168.0.23", 17, udp(53, 53001, dns_resp(0x1a01, "web.telegram.org", "149.154.167.99"))))))
    P.append((0.50, eth(ROUTER, PHONE, 0x0800, ipv4("192.168.0.23", "149.154.167.99", 6, tcp(50110, 443, 0x18, client_hello("web.telegram.org"))))))
    # attacker starts ARP spoofing: claims to be the router
    for k in range(3):
        P.append((5.0 + k, eth(PHONE, ATTACK, 0x0806, arp_reply(ATTACK, "192.168.0.1", PHONE, "192.168.0.23"))))
    # DNS spoof: web.telegram.org now answered with the attacker's private address
    P.append((8.10, eth(ATTACK, PHONE, 0x0800, ipv4("192.168.0.23", "8.8.8.8", 17, udp(53002, 53, dns_query(0x1a02, "web.telegram.org"))))))
    P.append((8.12, eth(PHONE, ATTACK, 0x0800, ipv4("8.8.8.8", "192.168.0.23", 17, udp(53, 53002, dns_resp(0x1a02, "web.telegram.org", "192.168.0.66"))))))
    # victim is redirected to a look-alike login page and types a password over plain HTTP
    P.append((9.00, eth(ATTACK, PHONE, 0x0800, ipv4("192.168.0.23", "8.8.8.8", 17, udp(53003, 53, dns_query(0x1a03, "telegrarn-login.top"))))))
    P.append((9.03, eth(PHONE, ATTACK, 0x0800, ipv4("8.8.8.8", "192.168.0.23", 17, udp(53, 53003, dns_resp(0x1a03, "telegrarn-login.top", "203.0.113.50"))))))
    body = b"phone=01712345678&password=MySecret123"
    req = (b"POST /login HTTP/1.1\r\nHost: telegrarn-login.top\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: " + str(len(body)).encode() + b"\r\n\r\n" + body)
    P.append((10.0, eth(ATTACK, PHONE, 0x0800, ipv4("192.168.0.23", "203.0.113.50", 6, tcp(50122, 80, 0x02)))))
    P.append((10.2, eth(ATTACK, PHONE, 0x0800, ipv4("192.168.0.23", "203.0.113.50", 6, tcp(50122, 80, 0x18, req)))))
    return pcap(P)

def normal():
    P = [(0.0, eth(PHONE, ROUTER, 0x0806, arp_reply(ROUTER, "192.168.0.1", PHONE, "192.168.0.23")))]
    t = 0.3
    for i, (name, addr) in enumerate([("www.google.com", "142.250.1.10"), ("web.telegram.org", "149.154.167.99"), ("www.bkash.com", "104.18.13.30")]):
        tid = 0x2b00 + i
        P.append((t, eth(ROUTER, PHONE, 0x0800, ipv4("192.168.0.23", "8.8.8.8", 17, udp(54000 + i, 53, dns_query(tid, name))))))
        P.append((t + .03, eth(PHONE, ROUTER, 0x0800, ipv4("8.8.8.8", "192.168.0.23", 17, udp(53, 54000 + i, dns_resp(tid, name, addr))))))
        P.append((t + .06, eth(ROUTER, PHONE, 0x0800, ipv4("192.168.0.23", addr, 6, tcp(51000 + i, 443, 0x02)))))
        P.append((t + .09, eth(ROUTER, PHONE, 0x0800, ipv4("192.168.0.23", addr, 6, tcp(51000 + i, 443, 0x18, client_hello(name))))))
        t += 1.5
    return pcap(P)

here = os.path.dirname(os.path.abspath(__file__))
a, n = attack(), normal()
out = os.path.join(here, "..", "05_Prototype", "samples")
open(os.path.join(out, "sample_cafe_wifi_attack.pcap"), "wb").write(a)
open(os.path.join(out, "sample_home_normal.pcap"), "wb").write(n)
open(os.path.join(here, "pcap_data.js"), "w").write("const SAMPLE_PCAPS = {\n attack:{name:'cafe_wifi_attack.pcap', b64:'%s'},\n normal:{name:'home_normal.pcap', b64:'%s'}\n};\n" % (base64.b64encode(a).decode(), base64.b64encode(n).decode()))
print(len(a), len(n))
