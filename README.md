# NKPI 8.1 — Baseline outlook & scan sensitivity

Complete GitHub/Streamlit package based on version 8.0. The frozen NKPI scores, scan-interval coefficient, extraction workflow and longitudinal observed-evidence section are preserved.

## New baseline dropdown

**Baseline outlook & scan sensitivity · Both eyes** appears below the calculator. It shows each eligible first-visit eye's existing NKPI, a deterministic input-sensitivity envelope, the measurement with the largest influence under that test, and the three leading score contributors. Expand **Inspect scan sensitivity** for the six per-input calculations. No extra upload or API key is required.

The proposed 12-month forecast design is included in a **separate, clearly fictional preview**. Patient progression probabilities are not enabled: the earlier baseline candidate showed weak discrimination and was not validated at a fixed 12-month horizon. This version does not convert NKPI into a probability or present mockup numbers as patient results.

- [Open the synthetic baseline preview](docs/BASELINE_OUTLOOK_PREVIEW.html) after extracting the complete ZIP.
- [Baseline methods and forecast status](docs/BASELINE_OUTLOOK.md).
- [Update instructions](UPDATE_INSTRUCTIONS.md).
- [Engineering verification](docs/TEST_REPORT.md).

```bash
pip install -r requirements.txt
streamlit run kcn_dual_calculator_app.py
python tools/verify_package.py
python tests/test_baseline_outlook.py
node tests/test_baseline_outlook.cjs
```

The main file remains **kcn_dual_calculator_app.py**. Confirm **8.1.0-baseline-outlook** in the calculator footer after rebooting Streamlit.


## Preserved version 8.0 supplement

The dropdown below NKPI is now **Observed change & evidence · Both eyes**. It shows:

1. Observed evidence over the actual selected interval.
2. Three structural groups: anterior curvature, posterior curvature and pachymetry. BAD-D appears as supporting evidence, without adding an independent vote.
3. Observed Kmax and thickness rates per year underneath. These summarize the measured interval; they do not predict a future scan.
4. Measurements, methods, prior fixed 0–4 count, and reference limitations inside expandable details.

The uncertain six-month projection is removed. The evidence screen uses continuous standardized changes, published precision references, Kmax severity bands and adjustment for three comparisons. Additional automatically resolved, QS-OK same-eye scans inside the selected interval are included when present in the imported studies. Duplicated exports add no confidence. Multi-visit departures from a straight trend reduce precision.

A separate joint cohort estimate regularizes the rates in the detailed audit. It was refitted on **179 eligible eye pairs from 101 patients**, not all 426 inventory eyes. It does not change the observed signal count or NKPI. No clinical progression probabilities are produced.

**Experimental supplement:** reference precision comes from same-day studies and has not been locally calibrated for interday progression. The new signal categories are research rules, not diagnoses or validated clinical cutoffs. See [methods](docs/OBSERVED_EVIDENCE.md).

Production requires no new dependency. OCR models and mathematical extraction checks are preserved. Unresolved source conflicts remain reviewable. The tests verify implementation behavior, not clinical validation or guaranteed extraction accuracy.
