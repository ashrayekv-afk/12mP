# Baseline outlook — release 8.1

## What is live

Open **Baseline outlook & scan sensitivity · Both eyes** below NKPI. For each eligible single-visit eye, the panel uses the current frozen baseline NKPI model and the submitted numeric snapshot. It shows the existing score, its deterministic response to hypothetical input changes, the most sensitive measurement, and the three largest existing score contributors. The six source values and age are sufficient; no extra upload, model fitting or AI service is needed.

Both eyes are calculated independently. A two-visit eye continues to use the existing observed-evidence panel; it is not silently rescored as a first visit. Missing, unverified, out-of-bounds, recorded poor-quality and known treated cases inherit the calculator's existing holds. Unknown quality or treatment remain unknown in the sensitivity details. Edits clear results before recalculation. The supplement is included in audited numeric JSON; the existing one-page NKPI PDF content is preserved, with its interface-version label updated.

## What is a demonstration

**No patient progression probability is computed.** The proposed 12-month forecast design is accessible through a separate collapsed **View the fictional forecast design** control. Its 18% and 62%, contributors, and sensitivity ranges are invented. Opening it cannot change the patient's NKPI, inputs or exports. Clearing the case also clears the preview.

The old baseline candidate was actually trained using baseline age, six measurements and the evaluation interval to predict a later numerical domain endpoint. Patient-grouped internal testing on 179 eligible pairs / 101 patients gave AUROC 0.574 and Brier 0.2022, versus 0.2038 for the training-fold prevalence. This is weak discrimination and little Brier improvement. It is also not a fixed 12-month validation. The CXL/control sampling scheme does not calibrate absolute risk for an unselected clinic population. See `DOMAIN_TRAINING_REPORT.md`, retained aggregate artifacts and reproducible research code.

This release does not retrain that candidate, treat the NKPI class response as future risk, or claim all 426 historical eyes are eligible forecasting examples. Adding a different interface does not solve the endpoint, follow-up and calibration limitations. A baseline forecasting study can use baseline predictors and a later outcome; a third scan is not inherently required. A third scan is needed for the different task of forecasting after two visits using their observed trend.

## Sensitivity mathematics

The unchanged model is:

`NKPI(x) = 100 × sigmoid(intercept + Σ coefficient[j] × (x[j] − center[j]) / scale[j])`

The calculation uses the seven stored features (age and six measurements) and all existing direction specifications. Age stays fixed. No median is substituted for a missing input.

For each of the six measured inputs, evaluate the original score at `value − d` and `value + d`, clipping only at the existing calculator input bounds. Every row reports the two resulting score extrema; maximum shift is the larger absolute difference from the original score. The row with the largest maximum shift is labelled **Largest input sensitivity**. This describes model sensitivity, not the probability that the source value is wrong or the benefit of obtaining another scan.

| Input | Perturbation half-width d | Reference |
|---|---:|---|
| ARC | 0.106 mm | Neuhann, raw ARC COR |
| PRC | 0.131 mm | Neuhann, raw PRC COR |
| Thinnest thickness | 14.2 µm | Gustafsson, pooled repeatability coefficient |
| Kmax | 0.926 D if <48.2; 1.33 D if 48.2–<53.9; 1.62 D if ≥53.9 | Pooled floor plus Gustafsson bands |
| BAD-D | 0.810 | Neuhann, final D COR |
| ARTmax | 44.240 | Neuhann, ARTmax COR |

These pair-repeatability limits define **chosen stress-test sizes**. They are not interpreted as single-scan error confidence limits. The same references already used by version 8.0 are retained; their same-day origin does not establish interday precision for this patient.

The combined envelope is the minimum and maximum of the frozen model over the rectangle formed by all six clipped input intervals. Since the baseline logit is linear and the sigmoid is monotone, select each input's endpoint according to its coefficient's sign to obtain the exact two extrema. A test compares these extrema against all 64 corners.

Independent perturbations allow combinations that may not represent a physiologically consistent cornea. The result is a stress test, **not a confidence interval, forecast, calibrated uncertainty measure, repeat-scan prediction or treatment decision rule**. No percentage coverage is assigned to the envelope. A narrow range does not establish reliability; model misspecification, extraction mistakes, parameter uncertainty, covariate shift and acquisition problems are not quantified by this calculation.

The descriptive band labels use the unchanged displayed-integer NKPI boundaries (Lower 0–32, Intermediate 33–66, Higher 67–100). Reporting that a perturbation crosses a band is a UI observation, not a clinical threshold test.

## Forecast development contract

Before replacing the fictional probability with a patient forecast:

1. Prespecify the first-scan prediction time, a measured structural endpoint and the 12-month observation window, treatment policy and censoring rules. Do not infer event dates from late positive scans.
2. Audit source values, laterality, acquisition quality, dates and corneal treatment. Use representative consecutive follow-up or a defensible sampling correction.
3. Begin with a regularized baseline model. Keep both eyes and all visits of each patient in the same folds. Tune and calibrate within training folds; do not optimize thresholds against the final test set.
4. Validate discrimination, calibration, error and clinical utility at the actual horizon on held-out patients and preferably an external site. Quantify uncertainty at the patient level and examine post-CXL and severe disease separately.
5. Attach a versioned model, explicit input schema, validated horizon and out-of-scope rules. Revalidate the forecast renderer, numeric exports and snapshot checks. Do not enable a probability by changing a presentation flag.

## References

- Neuhann et al. (2020), *Comparison of variables measured with a Scheimpflug device for evaluation of progression and detection of keratoconus*. [Original article](https://doi.org/10.1038/s41598-020-76020-6); raw-measurement COR table.
- Gustafsson et al. (2020), *Association between keratoconus disease severity and repeatability in measurements of parameters for the assessment of progressive disease*. [Original article](https://doi.org/10.1371/journal.pone.0228992).

The published studies did not validate this NKPI sensitivity interface.
