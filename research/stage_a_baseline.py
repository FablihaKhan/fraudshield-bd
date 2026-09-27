"""
FraudShield BD - Pipeline Stage A: single-message baseline.

What it does (exactly as specified in the research pipeline, Section 7, Stage A):
  1. Loads the public Bengali SMS Smishing Dataset (MIT licence, 7,005 messages;
     4,903 train / 701 validation / 1,401 test; labels normal / promo / smish;
     sources Bengali / Banglish / English / CodeMix).
  2. Label & leakage audit: class/language distribution, exact and normalised
     duplicates inside and across splits.
  3. Features: word TF-IDF (1-2 gram) + character TF-IDF (3-5 gram, char_wb).
  4. Model: class-weighted Logistic Regression.
  5. Threshold for the "smish" decision chosen on VALIDATION ONLY
     (maximise smish F1 subject to benign false-positive rate <= 5%).
  6. Held-out TEST reported once: macro-F1, smish precision/recall,
     benign FPR, per-language breakdown, and a de-duplicated test view.
  7. Probe: the trained single-message model is run on a few hand-written
     benign SAFETY messages (e.g. "PIN কাউকে দেবেন না") to show the
     negation problem that motivates Stage C. These probes are illustrative,
     not an evaluation set.

Run:  python stage_a_baseline.py            (expects data/*.parquet)
Data: https://huggingface.co/datasets/shariul-islam/bengali-sms-smishing-dataset
"""
import json, re, sys, unicodedata
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, confusion_matrix

HERE = Path(__file__).parent
DATA = HERE / "data"
OUT = HERE / "results"
OUT.mkdir(exist_ok=True)
SEED = 13
BN_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")


def normalise(t: str) -> str:
    """Stage-1 cleaning: Unicode NFC, Bangla digits -> ASCII, lowercase Latin, mask long numbers/URLs lightly."""
    t = unicodedata.normalize("NFC", str(t)).translate(BN_DIGITS).lower()
    t = re.sub(r"\+?88?01[3-9]\d{8}", " <phone> ", t)
    t = re.sub(r"\d{4,}", " <num> ", t)
    return re.sub(r"\s+", " ", t).strip()


def load():
    splits = {s: pd.read_parquet(DATA / f"{s}-00000-of-00001.parquet") if (DATA / f"{s}-00000-of-00001.parquet").exists()
              else pd.read_parquet(DATA / f"{s}.parquet") for s in ["train", "validation", "test"]}
    for s, d in splits.items():
        d["norm"] = d["text"].map(normalise)
    return splits


def audit(splits):
    rep = {}
    for s, d in splits.items():
        rep[s] = {"n": len(d), "labels": d["label"].value_counts().to_dict(), "sources": d["source"].value_counts().to_dict(),
                  "exact_dup_within": int(d["text"].duplicated().sum()), "norm_dup_within": int(d["norm"].duplicated().sum())}
    tr_exact, tr_norm = set(splits["train"]["text"]), set(splits["train"]["norm"])
    for s in ["validation", "test"]:
        d = splits[s]
        rep[s]["exact_overlap_with_train"] = int(d["text"].isin(tr_exact).sum())
        rep[s]["norm_overlap_with_train"] = int(d["norm"].isin(tr_norm).sum())
    return rep


def build(train_text):
    word = TfidfVectorizer(analyzer="word", ngram_range=(1, 2), min_df=1, sublinear_tf=True, token_pattern=r"(?u)[\w<>]+")
    char = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=2, sublinear_tf=True)
    word.fit(train_text); char.fit(train_text)
    return lambda x: hstack([word.transform(x), char.transform(x)]).tocsr()


def decide(proba, classes, thr):
    """Predict smish if P(smish) >= thr, else argmax over the remaining classes."""
    i_s = list(classes).index("smish")
    out = []
    for p in proba:
        if p[i_s] >= thr:
            out.append("smish")
        else:
            q = p.copy(); q[i_s] = -1
            out.append(classes[int(np.argmax(q))])
    return np.array(out)


def metrics(y, yhat):
    benign = y != "smish"
    return {
        "n": int(len(y)),
        "macro_f1": round(float(f1_score(y, yhat, average="macro")), 4),
        "smish_precision": round(float(precision_score(y == "smish", yhat == "smish", zero_division=0)), 4),
        "smish_recall": round(float(recall_score(y == "smish", yhat == "smish", zero_division=0)), 4),
        "benign_FPR": round(float((yhat[benign] == "smish").mean()), 4),
        "benign_false_alarms": f"{int((yhat[benign] == 'smish').sum())}/{int(benign.sum())}",
        "missed_smish": f"{int(((yhat != 'smish') & ~benign).sum())}/{int((~benign).sum())}",
    }


def bootstrap_ci(y, yhat, B=1000, seed=SEED):
    rng = np.random.default_rng(seed); n = len(y); vals = []
    for _ in range(B):
        idx = rng.integers(0, n, n)
        vals.append(f1_score(y[idx], yhat[idx], average="macro"))
    return [round(float(np.percentile(vals, 2.5)), 4), round(float(np.percentile(vals, 97.5)), 4)]


PROBES = [  # fictional benign safety / notification messages (illustrative only)
    ("benign_safety", "সতর্কতা: বিকাশ কখনো আপনার পিন বা ওটিপি চায় না। পিন ও ওটিপি কাউকে দেবেন না।"),
    ("benign_safety", "Apnar OTP kauke diben na. Bank kokhono OTP chay na."),
    ("benign_otp", "আপনার অনলাইন লেনদেনের ওটিপি 482913। এটি ৫ মিনিট বৈধ। ওটিপি কাউকে জানাবেন না।"),
    ("benign_notice", "প্রিয় গ্রাহক, আপনার বিকাশ অ্যাকাউন্টে ৫০০ টাকা ক্যাশ ইন হয়েছে।"),
    ("scam_turn", "আপনার ফোনে একটা ৬ সংখ্যার কোড গেছে, কোডটা এখনই বলুন।"),
    ("scam_turn", "আসসালামু আলাইকুম, আমি বিকাশ হেড অফিস থেকে বলছি।"),
    ("scam_turn", "Ammu ami, amar notun number eta, save kore rakho."),
    ("scam_turn", "ekhon ekta emergency, 5000 taka bkash kore dao ei number e, jaldi, kauke bolo na."),
]


def main():
    sp = load()
    rep = {"audit": audit(sp)}
    tr, va, te = sp["train"], sp["validation"], sp["test"]
    feat = build(tr["norm"])
    Xtr, Xva, Xte = feat(tr["norm"]), feat(va["norm"]), feat(te["norm"])
    clf = LogisticRegression(C=8.0, class_weight="balanced", max_iter=4000, random_state=SEED)
    clf.fit(Xtr, tr["label"])
    classes = clf.classes_

    # threshold on validation only: best smish-F1 with benign FPR <= 5%
    pva = clf.predict_proba(Xva); yva = va["label"].values
    best = (0.5, -1)
    for thr in np.round(np.arange(0.20, 0.91, 0.02), 2):
        yhat = decide(pva, classes, thr); m = metrics(yva, yhat)
        f1s = f1_score(yva == "smish", yhat == "smish")
        if m["benign_FPR"] <= 0.05 and f1s > best[1]:
            best = (float(thr), f1s)
    thr = best[0]
    rep["threshold_from_validation"] = thr
    rep["validation"] = metrics(yva, decide(pva, classes, thr))

    # held-out test, looked at once
    pte = clf.predict_proba(Xte); yte = te["label"].values; yhat = decide(pte, classes, thr)
    rep["test"] = metrics(yte, yhat)
    rep["test"]["macro_f1_95CI_bootstrap"] = bootstrap_ci(yte, yhat)
    rep["test"]["confusion_matrix(rows=true normal,promo,smish)"] = confusion_matrix(yte, yhat, labels=["normal", "promo", "smish"]).tolist()
    rep["test_by_language"] = {src: metrics(yte[te["source"].values == src], yhat[te["source"].values == src]) for src in sorted(te["source"].unique())}
    # de-duplicated view: drop test items whose normalised text also appears in train
    keep = ~te["norm"].isin(set(tr["norm"])).values
    rep["test_dedup_vs_train"] = metrics(yte[keep], yhat[keep])
    rep["classification_report_test"] = classification_report(yte, yhat, digits=4, output_dict=True)

    # probes (illustrative)
    pp = clf.predict_proba(feat([normalise(t) for _, t in PROBES]))
    i_s = list(classes).index("smish")
    rep["probes_illustrative"] = [{"kind": k, "text": t, "P(smish)": round(float(p[i_s]), 3),
                                   "decision": decide(np.array([p]), classes, thr)[0]} for (k, t), p in zip(PROBES, pp)]

    (OUT / "stage_a_results.json").write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: rep[k] for k in ["threshold_from_validation", "validation", "test", "test_by_language", "test_dedup_vs_train"]}, ensure_ascii=False, indent=1))
    print("AUDIT", json.dumps(rep["audit"], ensure_ascii=False))
    for r in rep["probes_illustrative"]:
        print(r["kind"], r["P(smish)"], r["decision"], "|", r["text"])


if __name__ == "__main__":
    main()
