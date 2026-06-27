---
name: worksheet-generator
description: >-
  Use when Shiva wants a hands-on teaching worksheet, workshop sheet, fillable
  exercise, session handout, or in-class activity built from a topic plus rough
  ideas. Produces an AI-resistant, self-contained, print-ready worksheet (HTML
  first for review, then a ReportLab PDF) in Shiva's voice. Triggers on
  "worksheet", "workshop sheet", "session exercise", "fillable handout",
  "in-class activity", "participant sheet", "teaching worksheet", "make a
  worksheet for <topic>".
---

# Worksheet Generator

Turn a topic plus fragmented ideas into a **hands-on workshop worksheet** that a room of senior
managers fills in during a session: one that thinks for itself (self-contained), resists generic
ChatGPT answers, and prints clean. Validated on the DHRL "Change Management Through GenAI" closing
session. The canonical method lives in the wiki at `maps/session-worksheet-design-method.md`;
`references/00-method.md` is the bundled copy.

**Golden rule: do not skip stages and do not do half research.** The quality of a worksheet is set
before any HTML is written, in the framing and the research. Run the pipeline in order.

**Paths:** when this skill loads, its base directory is announced (e.g.
`.../plugins/marketplaces/shva/shva/skills/worksheet-generator/`). Capture it as `$SKILL_DIR` and use
it for every bundled file. Reads of `references/*.md` may use bare relative paths, but **Bash runs and
asset copies must use the absolute base** (CWD at runtime is the user's project, not this skill):
`SKILL_DIR="<announced base directory>"`, then e.g.
`bash "$SKILL_DIR/scripts/lint.sh" <file>` and `cp "$SKILL_DIR/assets/worksheet-template.html" .`.

---

## The pipeline (7 stages, in order)

| # | Stage | What happens | Gate |
|---|---|---|---|
| 1 | **Intake** | Ask Shiva structured questions to understand what he wants to teach. | Read `references/01-intake-questions.md`. Use AskUserQuestion. |
| 2 | **Research** | Fan out across ALL of Shiva's sources in parallel + pull design taste. | Read `references/02-research-protocol.md`. Parallel, not serial. |
| 3 | **Arc** | Build the carried-forward spine and pick ONE worked example. | Read `references/00-method.md` §2. |
| 4 | **Draft** | Write every field, helper, and Example in plain language. | Read `references/03-formatting-rules.md`. Obey the hard rules. |
| 5 | **HTML** | Build the print-aware HTML from the house style; render and eyeball it. | Read `references/05-build-html.md`. Use `assets/worksheet-template.html`. |
| 6 | **Review** | Open the HTML for Shiva, iterate until he finalizes. | HUMAN GATE. Do not generate the PDF before he says go. |
| 7 | **PDF** | Generate the ReportLab print PDF, verify pages, lint. | Read `references/06-build-pdf.md`. Use `assets/build_worksheet.example.py`. |

Stages 1–6 are the default deliverable run. Stage 7 happens only after Shiva finalizes the HTML
(HTML iterates fast; PDF is the commit).

---

## Stage 1 — Intake (always start here)

Never start building from a one-line brief. First understand the teaching intent. Ask Shiva the
questions in `references/01-intake-questions.md` using **AskUserQuestion** (offer sensible default
options; let him add free-text). AskUserQuestion allows at most 4 questions per call, so use **1 to 2
calls (max 4 each)**, not one giant call. At minimum you must learn: the topic, the single decision /
tension / skill at the centre, the audience, any rough ideas or fragments he already has, the session
length, and whether he wants HTML only for now or HTML then PDF.

If he has already answered some of these in the prompt, only ask what is missing.

---

## Stage 2 — Research (parallel, exhaustive)

A worksheet grounded in generic web claims is worthless. Ground it in **Shiva's own corpus**, then
strip every author/source name out of the participant-facing sheet (his synthesis, not a reading list).

**Fire these concurrently in a single batch (see `references/02-research-protocol.md` for exact tools
and example queries):**

- `mcp__llamacloud__query_*` — AI-Change-and-leadership, AI-Strategy-Studies, Persuasion_and_communication_OB
- `mcp__claude_ai_Shiva_s_Brain__search_notes` (or read `~/Python Projects/Obsidian Wiki/` directly) — his own synthesized methods and maps
- `mcp__readwise-cloudflare__*` — highlights, verbatim lines, examples (flaky; have a fallback)
- `mcp__claude_ai_Youtube__*` — transcripts when the topic ties to a talk/video Shiva names
- `mcp__shivas-book-search__*` — confirm a frame is in a book he owns before leaning on it
- `mcp__mobbin__search_screens` — design taste for layout, helper text, fill-in prompts

Do not stop at the first hit from one source. The research is "done" only when you can state the core
frame in Shiva's own phrasing AND you have one concrete worked example to thread through every stage.

---

## What "good" looks like (design backward from this)

- **One spine, carried forward.** The whole sheet is one idea traced to its end; each stage hands a
  concrete value to the next via a carry-forward band that reappears at the top of the next page.
- **A stage is a page.** Dense moves (a workflow to draw, a 2×2 to fill) may take two pages, split at
  a natural seam labelled "Stage N, continued".
- **AI-resistant.** Every box demands a name, number, place, or consequence from the participant's own
  workplace. The house rule, stated up front: *if a sentence could have been written by someone who
  has never seen your workplace, it is the wrong answer.*
- **Self-contained.** Every field carries its own short "how to think" helper and a faint worked
  **Example:**. One example case runs through all stages.
- **Guidance placed right, not stacked.** A slim mechanical "How to use" strip at the top; the
  **"Be Mindful!"** think-about-it panel moved DOWN next to the field it informs. Stacking How-to and
  Be Mindful! at the top is the anti-pattern (people read the warning cold, then redo the step).
- **A companion questioner GPT**, not a content GPT (the Decision Decomposer GPT pattern in
  `references/decision-decomposer-gpt.md`).
- **Real signing space** in the signature block (blank area above the line, label below).

---

## The hard rules (never violate — full list in `references/03-formatting-rules.md`)

- **No author or source names anywhere on the sheet.** It is Shiva's synthesis.
- **No em-dashes (—) or en-dashes (–).** Use periods, colons, commas, parentheses, "is".
- **No stylish / GPT-cloud language.** Say it plainly.
- **Hints are complete sentences in parentheses**, readable by a casual reader.
- **"Be Mindful!"** (with the exclamation) is the standing name of the think panel.
- **Boxes are proportional to the ask.** A "draw a 5–9 step workflow" prompt gets a large area, not
  two lines. Never shrink a writing box just to hit a page count.
- **Run the lint before declaring any draft done:** `bash "$SKILL_DIR/scripts/lint.sh" <file...>`.

---

## Tooling

- **HTML:** `cp "$SKILL_DIR/assets/worksheet-template.html" .`, adapt content, keep the warm house
  palette. Verify with `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>` (renders via headless
  Chrome, reports page count and per-page fill so you catch near-empty orphan pages). Read the PNGs
  before sending.
- **PDF:** use the bundled aesthetic-pdf-creator guide at
  `references/aesthetic-pdf-creator/GUIDE.md` (ReportLab, table-based boxes, no overlap) and the worked
  builder `assets/build_worksheet.example.py` as the starting point (copy it, then run
  `./.venv/bin/python build_worksheet.py <out.pdf>`). ReportLab needs a venv (PEP 668). Full guidance +
  pitfalls in `references/06-build-pdf.md`.

---

## References (load on demand)

- `references/00-method.md` — the full method: target shape, content arc, per-page structure.
- `references/01-intake-questions.md` — the Stage 1 question set.
- `references/02-research-protocol.md` — the parallel research playbook, exact tools + queries.
- `references/03-formatting-rules.md` — the hard rules and the lint.
- `references/04-design-taste.md` — Mobbin sourcing and the transferable patterns.
- `references/05-build-html.md` — HTML house style and the render-verify loop.
- `references/06-build-pdf.md` — ReportLab build, venv, pagination pitfalls.
- `references/decision-decomposer-gpt.md` — the companion questioner-GPT prompt to ship with the sheet.
- `references/aesthetic-pdf-creator/GUIDE.md` (+ `scripts/pdf_template.py`, `references/color_schemes.md`) — the bundled PDF guide (no `<br/>`, Table-based boxes, leading > fontSize).
- `assets/worksheet-template.html` — the HTML skeleton.
- `assets/build_worksheet.example.py` — the worked ReportLab builder (DHRL).
- `scripts/lint.sh` · `scripts/render_check.sh` — the deterministic checks.

---

## After shipping (optional)

When a worksheet is finalized, offer to: capture the topic's frame into the wiki, save the worksheet
files to the relevant project folder, and hand Shiva the Decision Decomposer GPT prompt for the room.
