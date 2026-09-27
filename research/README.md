# Research code

```
pip install scikit-learn pandas pyarrow scipy
python stage_a_baseline.py       # single-message baseline -> results/stage_a_results.json
python wp_a_governance.py        # data hashes, licence table, near-duplicate audit -> results/wp_a_manifest.json
python e6_obfuscation_pilot.py   # look-alike letter / leetspeak / zero-width tests -> results/e6_obfuscation_pilot.json
```

**Data:** `data/` holds the Bengali SMS Smishing Dataset (MIT licence) in its official splits. The splits have 4,903 training, 701 validation and 1,401 test messages across Bangla, Banglish, English and code-mixed text.

**Environment:** Python 3.12, scikit-learn 1.8, seed 13.

**Model:** word 1–2-gram plus character 3–5-gram TF-IDF, class-weighted logistic regression (C = 8). The decision threshold is 0.60, chosen on the validation set with at most 5% false alarms on genuine messages.

## Results

| Test | Result |
|---|---|
| Test macro-F1 (n = 1,401) | 0.991 (95% CI 0.986–0.996); 3 of 840 genuine messages flagged; 6 of 561 scams missed |
| Near-duplicate audit | 156 test items have Jaccard ≥ 0.8 to a training message; without them macro-F1 is 0.990 |
| Cyrillic look-alike letters | scam recall 0.989 → 0.797 (114 of 561 missed); false alarms 0.36% → 1.43%; with the defence 0.989 |
| Leetspeak | recall 0.891; with the defence 0.989 |
| Zero-width characters | recall 0.959; with the defence 0.989 |
| Dots and spaced letters | no change (0.989) |

The robustness numbers are a pilot: the defence was written knowing these perturbation types, so they do not show real-world robustness.

`schemas/fraudshield_case.schema.json` describes how a conversation case, its turns, the evidence and the decision are stored.
