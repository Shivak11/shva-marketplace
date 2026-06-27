---
name: genai-use-case-finder
description: >-
  Use when Dr. Shiva Kakkar wants a FILLED GenAI use-case portfolio for a real
  organization: feed it a function, an org, an industry, or a process (for example
  "claims at a mid-size insurer", "month-end close in finance", "the CHRO hiring
  funnel") and it runs the four-move method MAP, GATE, SCORE, SEQUENCE to discover
  candidate use cases, gate each as point versus system, score them, and sequence them
  into a portfolio with named quadrants. Triggers on "use-case portfolio", "where should
  we use GenAI in <function>", "prioritize AI use cases", "point versus system",
  "build the use-case matrix for <org>", "score and sequence these AI ideas". This is an
  ANALYSIS GENERATOR, not a lesson. Sibling of teaching-designer (which makes the
  facilitator keynote or session that TEACHES use-case discovery) and worksheet-generator
  (which makes the participant fillable worksheet). If the user wants to TEACH the method,
  hand off to those. This skill fills the matrix for a real org.
---

# GenAI Use-Case Finder for Dr. Shiva Kakkar

Turn a function, org, industry, or process into a FILLED use-case portfolio: the candidate use cases discovered, each gated as point or system, scored on value and feasibility with risk as a veto and verifiability as the autonomy axis, then sequenced into a defensible portfolio of named quadrants (Lighthouses, Strategic Bets, Quick Wins, Park or Kill).

This is an analysis generator, not a session. The deliverable is the completed analysis for a real organization. It is the analysis sibling of two teaching skills. `teaching-designer` makes the facilitator keynote or session that teaches use-case discovery. `worksheet-generator` makes the participant fillable worksheet. This skill does neither. It runs the method on a real org and hands back the filled matrix. If the user wants to TEACH the method, say so and hand off to those two. Keep the boundary sharp.

**Golden rule: do not skip stages and do not do half discovery.** A portfolio's quality is set before any table, in the intake and in running BOTH lenses. Run the pipeline in order. Most teams only ever run Lens A and find only point solutions. Running Lens B deliberately is the discipline.

**Paths:** when this skill loads, its base directory is announced. Capture it as `$SKILL_DIR` and use it for bundled files. Reads of `references/*.md` may use bare relative paths, but Bash runs and asset copies must use the absolute base (the runtime CWD is the user's project, not this skill): `SKILL_DIR="<announced base directory>"`, then for example `cp "$SKILL_DIR/assets/portfolio-2x2-template.html" .` and `bash "$SKILL_DIR/scripts/lint.sh" portfolio.md` and `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>`.

---

## STEP 0: What is being asked for (decide first)

This skill produces ONE thing: a filled use-case portfolio for a real organization. Before running it, confirm two things.

1. Is the user asking to FILL the matrix for a real org (this skill), or to TEACH the method (hand off to teaching-designer for the keynote or session, worksheet-generator for the participant worksheet)? If they want a lesson, stop and hand off.
2. What is the unit of analysis? A function (claims), a single process (the hiring funnel), an org, or an industry. If the user names something broad ("use AI in finance"), narrow it to one process before you start. A portfolio for "finance" is vague. A portfolio for "month-end close at a mid-size manufacturer" is sharp.

The primary deliverable is the structured markdown portfolio. The signed worksheet is a standard add-on. The aesthetic HTML 2x2 is optional and built only when asked.

---

## The pipeline (6 stages, in order)

| # | Stage | What happens | Gate |
|---|---|---|---|
| 1 | **Intake** | Pin the unit of analysis, the value stream (5 to 9 steps), the decisions underneath, data reality, risk and regulatory exposure, deliverable format. | Read `references/01-intake-questions.md`. Use AskUserQuestion. |
| 2 | **MAP (dual-lens discovery)** | Run Lens A (Stream) for point candidates and Lens B (Flip It Around) for system candidates. | Read `references/02-discovery-and-gate.md`. You must run BOTH lenses. |
| 3 | **GATE (point versus system)** | Run the five-question tell on every candidate. 3+ yes = system. Decompose only after the gate says point. | Read `references/02-discovery-and-gate.md`. Record a yes count per candidate. |
| 4 | **SCORE** | Value by Feasibility (four sub-drivers, data readiness heaviest), Risk as a veto, Verifiability as the autonomy axis. | Read `references/03-score-and-sequence.md`. Calibrate on the first three. |
| 5 | **SEQUENCE** | Plot the 2x2, color by risk, place each candidate in a quadrant, assemble the portfolio. | Read `references/03-score-and-sequence.md`. Aim for a defensible mix. |
| 6 | **Output and lint** | Produce the filled portfolio, the 2x2, the worksheet, optionally the HTML. Lint every file. | Read `references/04-output-formats.md` and `references/05-writing-rules.md`. Lint must print CLEAN. |

The full method behind all of this is `references/00-method.md`. Read it once before running stage 2.

---

## What "good" looks like (design backward from this)

- **Both lenses, always.** If your candidate list is all point solutions, you skipped Lens B. Force at least one blank-slate redesign. The uncomfortable candidate is usually the real prize.
- **The Gate is a test, not a vibe.** Every candidate gets a yes count from the five questions and a verdict (point, pilot, system). Task decomposition happens only AFTER the gate says point, never before.
- **Risk vetoes, it does not average.** A catastrophic, irreversible, or legally exposed use case is capped at assist-only or disqualified regardless of value and feasibility. On-prem is a mitigation the risk axis forces, not a complexity input.
- **Verifiability sets autonomy.** Report it as its own column. Two use cases with the same cost-if-wrong can demand opposite postures, decided entirely by how cheap it is to check the output.
- **A defensible portfolio, not a pilot.** 2 to 3 Lighthouses, plus 2 to 4 Quick Wins, plus 1 to 2 Strategic Bets, plus 1 exploratory system bet. Name the blocker for each Strategic Bet. Re-run the Gate after each Lighthouse ships, because the constraint moves.
- **Filled, not blank.** Every cell holds the user's real organization. Where a fact was missing, the assumption is named, not left empty.

Full detail: `references/00-method.md` (the spine) and `references/03-score-and-sequence.md` (the rubric and the 2x2).

---

## The hard rules (never violate, full list in `references/05-writing-rules.md`)

- **No em-dashes and no en-dashes.** Use periods, colons, commas, parentheses, or "to" for ranges. Write "0 to 5", never a dashed range. `scripts/lint.sh` enforces this.
- **No stylish or GPT-cloud language.** Say it plainly.
- **Helper and hint text are complete sentences** a casual reader understands.
- **Flag any coinage as a coinage.**
- **Author names are allowed but garnish.** This is an analysis artifact, not a participant worksheet, so citing the underlying books in the method and the rationale is fine. But the spine is the filled matrix for the real org, not a reading list. Keep names light. (This is why `scripts/lint.sh` here bans only the dash glyphs and not author names, unlike the sibling worksheet skill.)
- **Stay an analysis.** Do not drift into teaching the method. If the user wants a lesson, hand off to teaching-designer or worksheet-generator.

---

## Tooling

- **Lint:** run `bash "$SKILL_DIR/scripts/lint.sh" <every .md and .html you wrote>` and confirm it prints CLEAN before declaring done.
- **HTML (optional):** `cp "$SKILL_DIR/assets/portfolio-2x2-template.html" .`, fill in the candidate dots, then verify with `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>` (headless Chrome, reports page count and fill). Read the PNG before sending. The markdown portfolio stays the source of truth.
- **Research (optional):** when the user's org or industry is unfamiliar, the open web and Shiva's book search can ground the value stream and the regulatory exposure. The method itself needs no research; it runs on the intake.

---

## References (load on demand)

- `references/00-method.md` is the full method: MAP, GATE, SCORE, SEQUENCE, the five-question tell, the verifiability axis, the four quadrants, the proof strip, and the source lineage.
- `references/01-intake-questions.md` is the Stage 1 discovery question set for analysis (not for teaching).
- `references/02-discovery-and-gate.md` is how to run both lenses and the Gate in practice, with the per-industry proof strip and the carried insurance claims worked example.
- `references/03-score-and-sequence.md` is the scoring rubric (including verifiability) and the 2x2 portfolio.
- `references/04-output-formats.md` is the output artifacts: the filled portfolio table, the text 2x2, the one-page signed worksheet, and the optional HTML.
- `references/05-writing-rules.md` is the hard writing rules and the author-name nuance for this analysis skill.
- `assets/portfolio-2x2-template.html` is the HTML 2x2 skeleton.
- `scripts/lint.sh` is the dash-glyph lint. `scripts/render_check.sh` is the headless HTML render check.

---

## After shipping (optional)

When a portfolio is finalized, offer to: save the analysis to the relevant project folder, capture any new industry row or worked example back into the wiki method map, and (if the user is moving from analysis to teaching) hand the filled portfolio to teaching-designer as the worked example for a session.
