# Engineering verification — 8.1.0-baseline-outlook

Completed 2026-09-29. These are software checks, not validation of clinical forecasts or repeatability coverage.

## Baseline calculation and contracts

- `test_baseline_outlook.py`: 10 tests. Independent logit arithmetic; exact envelope versus all 64 input corners; bilateral isolation; incomplete/unverified/treated/poor-quality and two-visit cases; unknown context; bounded perturbations; Kmax reference boundaries; snapshot invalidation; no future-data/identifier leakage; zero coefficient behavior.
- `test_baseline_outlook.cjs`: real Python service responses checked by independent JavaScript arithmetic. Wrong eye, snapshot, version, score, envelope, input, perturbation size, rank, contributor, quality, age and forecast fields are rejected. The forecast probability is always null in patient results.
- Existing app-event test updated only to load the new baseline renderer. It continues checking stale responses, edits, source changes, resets, observed evidence and NKPI layout.

## Regression checks

All **13** bundled test entry points passed: the 11 preserved tests below plus the two new baseline tests. Extraction files are byte-for-byte identical to version 8.0. All frozen model files and the observed-evidence implementation, renderer and artifact are also byte-identical.

An additional 80 deterministic synthetic cases (40 single-visit, 40 two-visit) were evaluated in both releases. After removing the new baseline field and interface version, all existing numeric response content was exactly equal, including NKPI predictions, explanations and longitudinal evidence. Bilateral one-page PDFs generated successfully; only the interface-version label changed.

## Browser and startup

Headless Chromium inspected the standalone synthetic preview at 1200, 760, 390 and 320 pixels. Cards, expanded tables and the separate fictional forecast displayed without horizontal page overflow. Desktop and mobile screenshots were visually reviewed.

The real calculator component was connected to the actual Python service and checked for single-visit / two-visit mixed mode, both baseline eyes, sensitivity disclosures, unchanged-input rerenders, input-edit invalidation, recalculation, separate fictional preview, audited JSON download and clearing. Zero JavaScript runtime errors were observed. Streamlit AppTest startup passed with no app exception or error.

The browser checks blocked CDN resources and did not repeat real OCR inference. Existing extraction logic passed controlled regression tests; no new real-world OCR accuracy claim is made.

## Distribution

The complete ZIP is verified with CRC checking, full extraction and SHA-256 manifest checks. Standard DEFLATE, no encryption or ZIP64 dependency, ordinary short paths, and 97 distributed files. No patient spreadsheets, reports, private fitting rows, API credentials or local QA output are included. Preview cases and forecast design numbers are explicitly fictional.

## Forecast limitation

No new forecasting model was trained or released in 8.1. Prior baseline candidate validation remains weak (variable-interval AUROC 0.574, minimal Brier improvement); it does not establish a calibrated fixed 12-month risk. The production calculation returns no patient progression probability. A working input-sensitivity analysis does not remedy that scientific limitation.

---

## Retained version 8.0 verification

Completed 2026-09-29. These checks verify implementation behavior; they do not establish clinical accuracy, sensitivity, specificity or progression calibration.

## New evidence checks

`tests/test_evidence.py`: 15 tests cover unchanged measurements, analytic two-visit slope/Z, interval invariance of evidence, severity-band boundaries, pooled raw-measure references, opposite directions, BAD-D exclusion from structural count, Holm adjustment, recovery of known irregularly timed slopes, duplicate suppression, within-day scatter, nonlinear trend inflation, eligibility, privacy allowlists, unchanged NKPI with added history, exact historical thresholds, artifact integrity and recovery of a simulated multivariate slope population.

`tests/test_progression_summary.cjs`: real Python service to production JavaScript contract; OD/OS displays, 0–3 structural count plus supporting BAD-D, actual-interval ordering, no future count, source/eye/artifact mismatch rejection, rate/evidence consistency, history canonicalization, stale responses, source edits, clearing and preservation of score layout.

`tests/test_bilateral_review.cjs`: existing review tests plus automatic inclusion of a resolved same-eye intermediate scan; rejection of unresolved, manually ambiguous or quality-unknown extra scans; rejection after interval editing; numeric-only history with dates/identifiers excluded.

## Preserved workflow regressions

All included test entry points passed:

- `test_model_interval.py`
- `test_evidence.py`
- `test_domain_training.py` (historical inactive research candidates)
- `test_progression_summary.cjs`
- `test_bilateral_review.cjs`
- `test_bilateral_import.cjs`
- `test_auto_import_merge.cjs`
- `test_extraction_integrity.cjs`
- `test_second_reader.cjs`
- `test_score_band.cjs`
- `test_map_identification.cjs`

The original wrong ARTmax 236/296 regression still blocks silent confirmation. Bilateral discovery, incomplete source handling, numeric extraction checks, OCR reader decision logic and source-edit invalidation still pass. These are controlled tests, not a new real-world OCR accuracy benchmark or a promise of 6/6 extraction on every report.

## Score preservation

All three files in `models/` are byte-identical to 7.9.1. An additional 80 deterministic synthetic baseline/two-visit cases produced exactly identical NKPI predictions and explanations between releases. Both-eye PDF generation succeeded. The PDF interface label is updated; its existing NKPI content is preserved.

## Browser and startup

Headless Chromium rendered the production evidence renderer at 1200, 760 and 390 pixels without horizontal page overflow. Both eye cards, group disclosures, calculation tables and observed-first order were checked. Screenshots were visually inspected.

The actual calculator component was run in a parent frame connected to the real Python service: synthetic example, both scores, new dropdown, input edit, clearing of stale evidence and recalculation passed with zero JavaScript runtime errors. This test blocked CDN resources; it did not repeat real OCR inference. Streamlit AppTest started successfully from the project root with no app exception or error.

## Packaging

The release uses ordinary DEFLATE ZIP entries. CRC, full extraction and SHA-256 manifest checks were run on a fresh extracted copy. No patient workbook, source reports or private fitting rows are included. The package contains source code, aggregate model artifacts, bundled OCR resources, tests, documentation and fictional preview data.

## Remaining validation

External same-day measurement precision has not been validated for this app's interday comparisons. The joint prior is a selected-cohort rate regularizer, not a validated future predictor. Additional visits are only included when their values, eye, dates and quality meet the stated import rules. Clinical use requires an appropriate validation study beyond these engineering checks.
