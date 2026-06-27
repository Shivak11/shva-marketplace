# Stage 7 — Build the print PDF (after Shiva finalizes the HTML)

> Paths below: set `$SKILL_DIR` to this skill's announced base directory and use it for every `scripts/` run and `assets/` copy (CWD at runtime is the user's project).

Use ReportLab via the bundled **aesthetic-pdf-creator** skill
(`references/aesthetic-pdf-creator/GUIDE.md`). The worked builder `assets/build_worksheet.example.py` (the DHRL
sheet) is your starting point: copy it, swap the content, keep the helpers (the ruled `Box` flowable,
the `panel` / `how_panel` / `mindful_panel` / `carry_in` / `carry_out` / `field` / `stage_header`
builders, the 2×2 `matrix` table, the signature block).

## Setup (ReportLab needs a venv; PEP 668 blocks system pip)

```bash
python3 -m venv .venv && ./.venv/bin/pip install --quiet reportlab
./.venv/bin/python build_worksheet.py
```

## The aesthetic-pdf-creator rules (from the bundled skill — obey them)

- **Never use `<br/>` in a Paragraph** — it causes text overlap. Use separate Paragraphs, or stack
  rows in a Table cell (pass a list of flowables).
- **Build every box and the 2×2 as Tables**, not absolutely-positioned elements. Tables never overlap.
- **Set `leading` > `fontSize`** on every style (1.3–1.5×).
- See `references/aesthetic-pdf-creator/GUIDE.md` and `.../references/color_schemes.md`.

## Worksheet-specific gotchas (learned the hard way)

- **Checkbox glyph:** the white square `☐` (U+25A1) is NOT in Helvetica's encoding. Use `[  ]`.
- **No em/en-dashes** survive into the PDF either — run the lint on the `.py` too.
- **Proportional boxes, not page-count tuning.** If a stage overruns, let it run to a second page split
  at a natural seam ("Stage N, continued") with generous boxes on the second page. Do NOT shrink
  writing boxes to force fewer pages. (This was the single biggest time-sink; the advisor's call was
  to cut content, never boxes.)
- **KeepTogether bands jump whole.** A `carry_out` / `closing` block wrapped in `KeepTogether` moves
  entirely to the next page when it doesn't fit, leaving a near-empty orphan. Fix by trimming the body
  above it (or accept the split), not by fighting the band.
- **Long rotated 2×2 axis labels** stretch a cell taller than the page. Keep axis text short, or render
  axis labels as plain header rows/columns (the example builder does the latter — cleanest, no overlap).
- **Footer "Page X of N":** count pages in a first build, then bake N. A hardcoded total goes stale
  when a stage splits. (The example builder uses a `TOTAL` constant set after a first pass.)

## Verify

```bash
./.venv/bin/python build_worksheet.py
pdfinfo worksheet.pdf | grep Pages
# rasterize and eyeball; measure per-page fill to find orphans
pdftoppm -png -r 70 worksheet.pdf pg
for p in pg-*.png; do echo "$p $(magick "$p" -format '%[fx:mean]' info:)"; done   # ~0.98+ = near-empty
bash "$SKILL_DIR/scripts/lint.sh" build_worksheet.py
```

Read the rasterized pages. Confirm: every stage is clean, nothing overlaps, the 2×2 is intact, boxes
are proportional, signature has signing space, footer total is correct.

## Headless Chrome note (HTML render path)

`scripts/render_check.sh` and any Chrome `--print-to-pdf` can hand off to a running Chrome and serve a
cached render. If the output PDF md5 does not change after an edit, render a uniquely-named copy of the
HTML to bust the URL cache.
