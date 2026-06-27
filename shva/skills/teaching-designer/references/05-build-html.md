# 05 - The interactive HTML house style

The deliverable is an editorial reading document, not an app. Invoke the frontend-design skill for the aesthetic. Start from `assets/teaching-doc-template.html` and adapt; do not rebuild the CSS from scratch.

## The look

- Distinctive type, never Inter or system defaults. Validated pairing: Fraunces (display headings and pull-quotes), Newsreader (body and script prose), Hanken Grotesk (labels, chips, chrome).
- Warm editorial palette: paper background, ink text, one or two restrained accents. Warm, not cold; avoid purple-on-white and other generic AI looks.
- Generous reading width (about 880px), hairline rules, numbered sections, time badges, a one-idea band, objectives and takeaways panels at the top, a legend.

## The block taxonomy (collapsible, color-coded)

Each section is a header (always visible: number, time badge, phase tag, title, summary, the running-thread chip, the named principle banner) followed by blocks. Block types, each with its own accent color and a small icon:

- Teaching script (the spoken word, delivery cues in italics). Collapsed by default because it is long.
- Evidence (a big statistic, a verbatim quote, attribution, a plain reframe).
- Discussion (the nudge questions, numbered, with a facilitation note).
- Exercise (the micro-exercise, steps, nudge scaffolds, worked example).
- Video (candidate clip: title, why it works, a search link, what to verify).

Frameworks, evidence, and diagrams open by default because seeing them is the point. Provide an Expand all and Collapse all control. The named principle banners and the revision recap are always visible (not collapsible) so the spine reads even with every script closed.

## Diagrams

Embed live Mermaid via CDN. Build before/after pairs. Validate each diagram with the Mermaid MCP before embedding. If the validator is down, harden to forms known to parse (quoted node labels, `:::class` on its own line, pipe-labeled dotted edges `A -.->|label| B`) and rely on the render check. Theme Mermaid to the house palette via the init themeVariables.

## Print

Include a print stylesheet that forces every block open and removes the toolbar, so browser print to PDF gives a clean handout that includes the scripts and the revision recap.

## Render-verify (before declaring done or shipping)

Run `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>` (headless Chrome; reports page count and per-section fill, and surfaces a blank diagram if Mermaid failed). Read the PNG. This is mandatory before the file is sent to Shiva and before any skill template is committed.

## Writing inside the HTML

Obey `04-writing-rules.md` in every string: no em or en dashes (time badges read "0 to 12 min"), no author names on participant surfaces or inside the spoken script (citations only in framework and evidence cards and the sources block), plain language, complete-sentence helpers.
