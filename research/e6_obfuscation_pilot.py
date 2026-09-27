"""
FraudShield BD - E6 obfuscation-robustness PILOT on the M0 (Stage A) baseline.

Experiment E6: compare original vs meaning-preserving perturbations
(p1n / O.T.P / spacing, confusables, zero-width characters). This pilot applies each
perturbation to the held-out TEST split only and reports macro-F1, smish recall and
benign FPR for (a) the unchanged Stage A model and threshold, and (b) the same model
trained and evaluated with a defensive normaliser (zero-width removal, Cyrillic/Greek
confusable folding, leetspeak folding). M0 only; FraudShield's conversational modules
are evaluated later on the own frozen conversational set.

Perturbations (applied to raw text, then the normal Stage A normalisation):
  P1 keyword_dots     : O.T.P, P.I.N, c.o.d.e, ও.টি.পি ...
  P2 leetspeak        : Latin a->@, o->0, i->1, e->3 inside words of length >= 4
  P3 zero_width       : U+200B after every 2nd character of Bengali words
  P4 confusable_latin : Latin a,e,o,p,c -> Cyrillic look-alikes
  P5 spaced_letters   : sensitive keywords written with spaces ("o t p")
Run: python e6_obfuscation_pilot.py
"""
import json, re
from pathlib import Path

from sklearn.linear_model import LogisticRegression

import stage_a_baseline as A

OUT = Path(__file__).parent / "results"
KEYS = ["otp", "pin", "code", "password", "bkash", "nagad", "link", "click", "account",
        "ওটিপি", "পিন", "কোড", "বিকাশ",
        "নগদ", "লিংক", "অ্যাকাউন্ট"]
KEY_RE = re.compile("|".join(sorted(map(re.escape, KEYS), key=len, reverse=True)), re.IGNORECASE)
CYR = str.maketrans({"a": "а", "e": "е", "o": "о", "p": "р", "c": "с"})
LEET = str.maketrans({"a": "@", "o": "0", "i": "1", "e": "3"})
ZWSP = "​"


def p1(t): return KEY_RE.sub(lambda m: ".".join(m.group(0)), t)
def p2(t): return re.sub(r"[A-Za-z]{4,}", lambda m: m.group(0).lower().translate(LEET), t)
def p3(t): return re.sub(r"[ঀ-৿]{3,}", lambda m: "".join(c + (ZWSP if i % 2 else "") for i, c in enumerate(m.group(0))), t)
def p4(t): return re.sub(r"[A-Za-z]+", lambda m: m.group(0).translate(CYR), t)
def p5(t): return KEY_RE.sub(lambda m: " ".join(m.group(0)), t)


PERT = {"original": lambda t: t, "P1_keyword_dots": p1, "P2_leetspeak": p2, "P3_zero_width": p3,
        "P4_confusable_latin": p4, "P5_spaced_letters": p5}

# ---- defensive normaliser ----
ZW = dict.fromkeys([0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF], None)
UNCONF = str.maketrans({"а": "a", "е": "e", "о": "o", "р": "p", "с": "c",
                        "х": "x", "у": "y", "і": "i", "ο": "o", "α": "a"})
DELEET = str.maketrans({"@": "a", "0": "o", "1": "i", "3": "e"})
TOKEN = re.compile(r"[A-Za-z@0-9]+")


def _deleet(m):
    tok = m.group(0)
    # only tokens mixing >=2 letters with leet symbols; pure numbers (2GB, 45, 16247) stay intact
    if len(re.findall(r"[A-Za-z]", tok)) >= 2 and re.search(r"[@013]", tok):
        return tok.translate(DELEET)
    return tok


def defend(t):
    t = t.translate(ZW).translate(UNCONF)
    return TOKEN.sub(_deleet, t)


def main():
    sp = A.load()
    tr, te = sp["train"], sp["test"]
    thr = json.loads((OUT / "stage_a_results.json").read_text(encoding="utf-8"))["threshold_from_validation"]
    y = te["label"].values
    feat = A.build(tr["norm"])
    clf = LogisticRegression(C=8.0, class_weight="balanced", max_iter=4000, random_state=A.SEED).fit(feat(tr["norm"]), tr["label"])
    trd = [A.normalise(defend(t)) for t in tr["text"]]
    featd = A.build(trd)
    clfd = LogisticRegression(C=8.0, class_weight="balanced", max_iter=4000, random_state=A.SEED).fit(featd(trd), tr["label"])
    rows = {}
    for name, f in PERT.items():
        pert = [f(t) for t in te["text"]]
        changed = int(sum(a != b for a, b in zip(te["text"], pert)))
        m = A.metrics(y, A.decide(clf.predict_proba(feat([A.normalise(t) for t in pert])), clf.classes_, thr))
        md = A.metrics(y, A.decide(clfd.predict_proba(featd([A.normalise(defend(t)) for t in pert])), clfd.classes_, thr))
        keep = ("macro_f1", "smish_recall", "benign_FPR", "missed_smish", "benign_false_alarms")
        rows[name] = {"messages_changed": changed, "M0": {k: m[k] for k in keep}, "M0_defended": {k: md[k] for k in keep}}
    (OUT / "e6_obfuscation_pilot.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    for k, v in rows.items():
        a, d = v["M0"], v["M0_defended"]
        print(f"{k:20s} changed={v['messages_changed']:5d} | M0 F1={a['macro_f1']:.3f} R={a['smish_recall']:.3f} FPR={a['benign_FPR']:.4f} miss={a['missed_smish']:7s}"
              f" | defended F1={d['macro_f1']:.3f} R={d['smish_recall']:.3f} FPR={d['benign_FPR']:.4f} miss={d['missed_smish']}")


if __name__ == "__main__":
    main()
