---
name: mdp-architect
description: >-
  Use when Dr. Shiva Kakkar wants to create or substantially refine an MDP,
  executive-education programme, faculty-development programme, or multi-session
  workshop and needs the programme spine, book-like session chapters, first-person
  teaching scripts, slide content, exercises, source ledger, and interactive HTML
  to remain internally consistent. Also use to audit an existing programme for
  thin chapters, cognitive overload, weak pacing, mode drift, decorative cases,
  generic AI use, or exercises without realistic revealable filled editions.
  Triggers include "MDP", "session-by-session plan", "write the chapter", "teaching
  script and slides", "make this two hours", "refine this course", and "programme
  architecture" when two or more teaching surfaces must work as one system. Do not
  use for a standalone source pack, keynote, or worksheet when the sibling skill
  already covers the whole request.
---

# MDP Architect

Build an executive programme as one connected learning system. Start with the decisions participants must learn to make. End with a source-grounded, verified programme in which the chapter, teaching script, slides, exercises, and cross-session artifacts agree.

This is an orchestrator. It composes SHVA's narrower skills without swallowing them:

- `mdp-source-finder` gathers raw sources, demos, and labs.
- `book-taste-curator` supplies the reading-taste and book-structure lens.
- `teaching-designer` remains the direct route for a standalone session or light keynote.
- `worksheet-generator` remains the direct route for a standalone participant sheet.

Use MDP Architect when programme architecture or cross-surface consistency is the real job.

When the skill loads, capture its announced base directory as `SKILL_DIR`. Shell commands must use that absolute path because the runtime working directory is the programme workspace, not the skill folder.

## First decision: choose the mode

| Mode | Use it for | Default output |
|---|---|---|
| Architecture | A new programme, client brief, or major restructure | Cover direction and session-by-session MDP plan |
| Chapter | One session developed in depth | Book Chapter, Teaching Script, Slide Content, workbook |
| Programme build | A complete multi-session build | Architecture plus the requested session surfaces |
| Audit | An existing course or HTML that feels thin, busy, generic, or short | Evidence-backed diagnosis, then an in-scope revision |

If the request already supplies audience, duration, source material, and output format, start work. Ask only for a missing choice that would materially change the programme.

## The workflow

### 1. Bind to the canonical workspace

Find and read the programme README, source ledger, current design contract, and latest rendered artifact. In Shiva's teaching workspace, `design.md` and `skills/shiva-teaching-artifact/SKILL.md` outrank bundled SHVA styling. Preserve the official client brief, session names, dates, durations, and faculty ownership unless Shiva changes them.

Read `references/01-programme-architecture.md` before changing the programme spine.

### 2. Retrieve before inventing

Search Shiva's wiki and current programme files first. Then use Readwise and the owned book corpus for structural inspiration. Use live web research for current examples and factual verification. Prefer primary sources and serious practitioner-intellectual work. Keep a source ledger that separates observation, sourced fact, teaching synthesis, illustration, and unresolved claims.

Read `references/04-research-routing.md` before research. If a dedicated source pack is needed, invoke or follow `mdp-source-finder` without letting source collection replace programme design.

### 3. Architect the learning progression

Define the programme question and the concrete artifact participants will revise across sessions. For each session, name:

- the question the room must answer;
- the organizational disturbance or decision that makes it matter;
- the participant move;
- the artifact produced or revised;
- the unresolved question handed to the next session.

Do not make sessions a list of topics. Make each one change what the participant can inspect, decide, build, or challenge. Use `references/01-programme-architecture.md`.

### 4. Create one canonical session model

Before drafting three modes, write a compact JSON content model using the contract in `references/02-session-content-model.md`. Start from `fixtures/who-owns-the-exception.valid.json` and replace its content. Store the central question, claims, case, lateral example, mechanism, diagram labels, exercises, sources, transition, and surface references once.

Run:

```bash
node "$SKILL_DIR/scripts/validate-session-model.mjs" <session-model.json>
```

Do not draft Book, Teaching, and Slides independently. If the model changes, propagate the change to all surfaces before polishing any one of them.

### 5. Build the requested surfaces

For a Chapter build, use this visible order:

1. Cover.
2. Session-by-session MDP plan table.
3. Book Chapter.
4. Teaching Script.
5. Slide Content.

Book mode is continuous reading. Teaching mode contains the scaffolding. Slide mode is compression. Follow `references/03-three-surface-contract.md`.

For a 90-minute scheduled session, prepare a protected 90-minute core plus 30 minutes of integrated depth reserves. Every reserve deepens an existing case, mechanism, or participant artifact and states where to rejoin. Do not show 120 minutes as the official timetable duration unless the brief says so.

Every exercise must make the participant commit before AI is used and must include a realistic filled edition behind an intentional reveal control. AI may challenge a map, threshold, interpretation, evidence boundary, or exception. It may not certify a people decision or become the decision-maker.

### 6. Verify from the artifact

Run the gates in `references/05-verification-gates.md`. At minimum:

- validate the session model;
- verify the core and reserve timing sums;
- compare shared claims, cases, examples, diagrams, and exercises across all modes;
- inspect the live HTML at desktop and mobile widths;
- test tabs, reveal controls, focus order, overflow, diagrams, and browser errors;
- confirm Book mode has sustained prose and scarce headings rather than card-like fragments;
- confirm every factual claim stays within its source boundary.

Keep source, plugin/package, installation, runtime invocation, and rendered-journey proof separate. Do not claim a participant outcome without a live cohort pilot.

## Hard rules

- Start from a real organizational disturbance or consequential decision, not a framework definition.
- Use one central question, one sustained case, at most one short lateral example, one earned mechanism, and one named participant artifact per chapter.
- Treat analogies as explanatory instruments. The lateral example must teach an unfamiliar fact and reveal the mechanism more clearly than a generic manager story would.
- Keep Book Chapter prose direct. No decorative metaphor density, generic motivation, AI doom, closing sermon, or card on every idea.
- Keep facilitator notes, timing, dialogue, contingencies, and source caveats out of Book and Slide surfaces.
- Slide Content may remove detail but may not introduce a new claim, example, framework, or exercise.
- Keep private or identifiable participant and employee data out of external AI tools by default.
- HTML is the review artifact unless Shiva asks for PDF.
- Do not expose process scaffolding or prompt logic in participant-facing views.

## References

- `references/01-programme-architecture.md`: programme question, session table, carried artifact, and cross-session progression.
- `references/02-session-content-model.md`: canonical JSON model and cross-surface identity rules.
- `references/03-three-surface-contract.md`: Book Chapter, Teaching Script, Slide Content, exercise, and HTML interaction contracts.
- `references/04-research-routing.md`: wiki, programme files, Readwise, owned books, web verification, and source classifications.
- `references/05-verification-gates.md`: deterministic checks, rendered QA, and acceptance rubric.

## After a successful build

With Shiva's explicit approval, update the relevant wiki method or project page and record any new general rule. Do not turn a one-off preference into a universal rule until it explains more than one artifact.
