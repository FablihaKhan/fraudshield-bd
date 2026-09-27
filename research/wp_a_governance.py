"""
FraudShield BD - baseline reproducibility and data governance.

Produces results/wp_a_manifest.json with:
  * SHA-256 hashes of every data file and of the Stage A script (reproducibility)
  * dataset licence / use-restriction table
  * group-wise near-duplicate leakage audit: character 5-gram Jaccard between each
    validation/test message and its closest training message, and the Stage A test score with those items removed.

Run: python wp_a_governance.py   (after stage_a_baseline.py has data/ in place)
"""
import hashlib, json, platform
from pathlib import Path

import numpy as np
import sklearn
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

import stage_a_baseline as A

HERE = Path(__file__).parent
OUT = HERE / "results"; OUT.mkdir(exist_ok=True)


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def max_jaccard(query, ref):
    """Max char-5-gram Jaccard similarity of each query text to any reference text."""
    v = CountVectorizer(analyzer="char_wb", ngram_range=(5, 5), binary=True).fit(list(ref) + list(query))
    R, Q = v.transform(ref), v.transform(query)
    inter = (Q @ R.T).tocsr()
    rs, qs = np.asarray(R.sum(1)).ravel(), np.asarray(Q.sum(1)).ravel()
    best = np.zeros(Q.shape[0])
    for i in range(Q.shape[0]):
        row = inter.getrow(i)
        if row.nnz:
            j = row.indices; k = row.data
            best[i] = np.max(k / (qs[i] + rs[j] - k))
    return best


LICENCES = [
    {"source": "Bengali SMS Smishing Dataset (shariul-islam, Hugging Face)", "licence": "MIT", "use": "Stage A train/val/test; commercial use permitted with notice"},
    {"source": "BTTC (Mendeley Data, 2026)", "licence": "CC BY 4.0", "use": "external evaluation after overlap removal; label mapping audit (spam != scam)"},
    {"source": "Bangalabarta v3 (Mendeley Data, 2026)", "licence": "CC BY-NC-SA 4.0", "use": "research evaluation only; not in commercial model"},
    {"source": "BanglaPhish-2026 (GitHub)", "licence": "CC BY-NC 4.0", "use": "synthetic challenge set only; report separately; not commercial"},
    {"source": "LoveFraud02 (Mendeley Data, 2024)", "licence": "CC BY 4.0", "use": "parser / turn protocol validation; language to be confirmed"},
    {"source": "COVA / COVA-X (arXiv 2604.11752, 2606.06879)", "licence": "check release terms", "use": "English synthetic external comparison only"},
    {"source": "BanglaBERT weights (csebuetnlp)", "licence": "CC BY-NC-SA 4.0", "use": "research comparison (Stage B); not in commercial model"},
    {"source": "FraudShield-BD own set (planned)", "licence": "own", "use": "main frozen multi-turn evaluation; synthetic or consented data only"},
]


def main():
    sp = A.load()
    tr, va, te = sp["train"], sp["validation"], sp["test"]
    files = sorted((A.DATA).glob("*.parquet"))
    manifest = {
        "environment": {"python": platform.python_version(), "scikit_learn": sklearn.__version__, "seed": A.SEED},
        "files": {f.name: {"sha256": sha256(f), "bytes": f.stat().st_size} for f in files},
        "stage_a_script_sha256": sha256(HERE / "stage_a_baseline.py"),
        "licences": LICENCES,
    }
    # near-duplicate audit on normalised text
    jt = max_jaccard(te["norm"].tolist(), tr["norm"].tolist())
    jv = max_jaccard(va["norm"].tolist(), tr["norm"].tolist())
    audit = {}
    for thr in (0.9, 0.8, 0.7):
        audit[f"test_items_jaccard_ge_{thr}"] = int((jt >= thr).sum())
        audit[f"validation_items_jaccard_ge_{thr}"] = int((jv >= thr).sum())
    audit["test_max_jaccard_quartiles"] = [round(float(x), 3) for x in np.percentile(jt, [25, 50, 75])]
    # Stage A re-fit (identical settings) and score on the near-duplicate-free test subset
    feat = A.build(tr["norm"])
    clf = LogisticRegression(C=8.0, class_weight="balanced", max_iter=4000, random_state=A.SEED).fit(feat(tr["norm"]), tr["label"])
    thr = json.loads((OUT / "stage_a_results.json").read_text(encoding="utf-8"))["threshold_from_validation"]
    yhat = A.decide(clf.predict_proba(feat(te["norm"])), clf.classes_, thr)
    y = te["label"].values
    for cut in (0.8, 0.7):
        keep = jt < cut
        audit[f"test_score_excluding_jaccard_ge_{cut}"] = A.metrics(y[keep], yhat[keep])
    manifest["near_duplicate_audit"] = audit
    (OUT / "wp_a_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(audit, indent=1))


if __name__ == "__main__":
    main()
