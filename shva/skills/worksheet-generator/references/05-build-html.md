# Stage 5 — Build the HTML (review-first)

> Paths below: set `$SKILL_DIR` to this skill's announced base directory and use it for every `scripts/` run and `assets/` copy (CWD at runtime is the user's project).

HTML is the fast iteration surface. Shiva reviews in the browser. Generate the PDF only after he
finalizes (Stage 7).

## How to build

1. **Start from the bundled template** (`cp "$SKILL_DIR/assets/worksheet-template.html" .`). It already encodes the house style: stage headers,
   the slim top "How to use" strip, the contextual "Be Mindful!" card (with a lightbulb), per-field
   blocks (question + helper + ruled writing box + faint `Example:`), fill-in-the-blank sentences,
   carry-forward / from-previous bands, a 2×2 power-map table, and a signature row with real signing
   space. Copy it and replace the content stage by stage.
2. **Keep the structure rules** from `00-method.md`: How-to at top (mechanical), Be Mindful! moved down
   next to the field it informs, every field self-contained with a worked Example, proportional boxes.
3. **One worked example threaded through** every `Example:` line.
4. **Checkbox glyph** `☐` and arrows `→` render fine in a browser (the PDF stage swaps `☐` for `[  ]`
   because Helvetica lacks the glyph — see `06-build-pdf.md`).

## Verify before sending

```bash
bash "$SKILL_DIR/scripts/render_check.sh" <worksheet.html>
```

This renders the HTML to a PDF via headless Chrome and reports the page count and a per-page fill
score so you can spot near-empty orphan pages (fill ~0.98+ means almost blank). It also rasterizes the
pages to `*-pg-*.png`. **Read the PNGs** and check: Be Mindful! is in context (not stacked at top),
every field has a faint Example, boxes are proportional, the 2×2 axis labels do not overlap, and the
signature has room above the line. Then run the lint:

```bash
bash "$SKILL_DIR/scripts/lint.sh" <worksheet.html>
```

## Pagination note (defer it)

The HTML may print long because the examples add height. **Do not fight pagination in the HTML.** In
the browser it is a clean continuous scroll, which is what Shiva reviews. Page-fitting is a Stage 7
(ReportLab) concern. Do not shrink writing boxes to make the HTML hit a page count.

## Then: review gate

Open the HTML for Shiva (`open <file>`), send the file, and summarize what changed. Iterate on his
feedback. Do NOT proceed to the PDF until he says it is finalized.
