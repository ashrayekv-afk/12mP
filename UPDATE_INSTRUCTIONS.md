# Update to 8.1.0-baseline-outlook

1. Download **NKPI_v810_Extract.zip** completely. Right-click it in Windows and choose **Extract All**.
2. Upload the extracted contents to the GitHub repository root, preserving folders and replacing matching files. Do not upload the ZIP itself. A clean replacement is preferable to mixing releases.
3. Include the new `nkpi/baseline_outlook.py`, `components/baseline_outlook.js`, all updated component files, and the existing evidence files. Keep both frozen NKPI files in `models/` and both bundled OCR models in `components/extractor/`.
4. Streamlit main file stays **kcn_dual_calculator_app.py**. Reboot the app and refresh the browser. Confirm **8.1.0-baseline-outlook** in the footer.
5. Reimport the source reports. For a single-visit eye, open **Baseline outlook & scan sensitivity · Both eyes** below NKPI. For two-visit eyes, the existing **Observed change & evidence** dropdown remains below it.
6. The baseline sensitivity uses actual inputs. The forecast percentages are available only under **View the fictional forecast design** and are never patient results.

The package uses a conventional ZIP with standard DEFLATE compression, no encryption, no symlinks, and no ZIP64 requirement. A manifest and extraction-integrity check are included.

No patient records or training spreadsheets are distributed. The new synthetic baseline preview is `docs/BASELINE_OUTLOOK_PREVIEW.html`; the longitudinal preview remains `docs/OBSERVED_EVIDENCE_PREVIEW.html`; it is not the Streamlit entry point.

If uploading over the prior repository, the retired files `nkpi/projection.py`, `research/projection_model.json`, `research/projection_model.sha256`, `research/fit_conditional_projection.py`, `tests/test_projection.py`, `docs/SIX_MONTH_PROJECTION.md` and `docs/OUTLOOK_PREVIEW.html` can be removed. They are not used by version 8.0.

The NKPI calculation and existing extraction decisions are preserved. The new supplement assesses reference-based observed signals; it does not diagnose progression or assign six-month probabilities.
