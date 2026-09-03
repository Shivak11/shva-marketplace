---
name: mdp-architect
description: >-
  Use when an author or faculty builder wants to create or substantially refine an
  MDP, executive-education programme, faculty-development programme, multi-session
  workshop, or book-shaped teaching programme and needs the programme spine, book
  chapters, teaching scripts, slide content, exercises, source ledger, and
  interactive HTML to remain one coherent system. Also use to audit thin chapters,
  abrupt or generic-AI prose, cognitive overload, weak pacing, mode drift,
  decorative cases, unearned frameworks, or disconnected exercises and answer
  keys. Triggers include "MDP", "session-by-session plan", "write the chapter",
  "teaching script and slides", "make this two hours", "refine this course", and
  "programme architecture" when two or more teaching surfaces must work together.
  Do not use for a standalone source pack, keynote, or worksheet when a sibling
  skill already covers the whole request.
---

# MDP Architect

Build an executive programme as one connected learning system. Start with the decisions participants must learn to make. End with a source-grounded, verified programme in which the chapter, teaching script, slides, exercises, and cross-session artifacts agree.

This is an orchestrator. It composes SHVA's narrower skills without swallowing them:

- `mdp-source-finder` gathers raw sources, demos, and labs.
- `book-taste-curator` supplies the reading-taste and book-structure lens.
- `teaching-designer` remains the direct route for a standalone session or light keynote.
- `worksheet-generator` remains the direct route for a standalone participant sheet.

Use MDP Architect when programme architecture or cross-surface consistency is the real job.

Tie-break for one session: use MDP Architect when the request needs two or more canonical surfaces, such as Book Chapter plus Teaching Script plus Slides. Use `teaching-designer` when the request is only a plan, script, or light keynote, and `worksheet-generator` when it is only a participant sheet.

When the skill loads, capture its announced base directory as `SKILL_DIR`. Shell commands must use that absolute path because the runtime working directory is the programme workspace, not the skill folder.

## First decision: choose the mode

| Mode | Use it for | Default output |
|---|---|---|
| Architecture | A new programme, client brief, or major restructure | Cover direction and session-by-session MDP plan |
| Chapter | One session developed in depth | Book Chapter, Teaching Script, Slide Content, workbook |
| Programme build | A complete multi-session build | Architecture plus the requested session surfaces |
| Audit | An existing course or HTML that feels thin, busy, generic, or short | Evidence-backed diagnosis, then an in-scope revision |

If the request already supplies audience, duration, source material, and output format, start work. Ask only for a missing choice that would materially change the programme.

## Book Foundation Gate

For a greenfield book, a substantial book-shaped programme, or a book-like chapter whose premise, reader, identity, title, or front matter is not already approved, run the Book Foundation Interview before production. Read `references/00-book-foundation-interview.md` and complete its short, choice-led rounds in chat. The author must explicitly approve the resulting Book Foundation Record for the exact production scope: `prose`, `front-matter`, `visual-production`, or `full`. A prose approval may deliberately defer title or visual choices for another author and may authorise a prose-bearing canonical chapter model; it cannot authorise finished front matter, cover art, or book-identity styling. In Shiva's environment, the validator defaults to `full` unless Shiva explicitly narrows it to an exploratory prototype.

For a small correction, a recent approved record may be reused only if the premise, reader, and identity are unchanged. Name that record and why it still applies. Do not make a taste-sensitive choice silently in HTML: offer two or three concrete candidates with a recommendation and trade-off. This is an editorial approval, not a Super-outer critical-action approval.

## The workflow

### 1. Establish the book foundation when required

Classify the request against the Book Foundation Gate before creating an artifact. When it applies, conduct the interview, return the compact record, and wait for explicit approval. Exploratory research and candidate-making may happen before approval; production outside the approved scope may not.

Keep the generic skill neutral: never assume an author biography, title, profile link, acknowledgement, recent cover, or reference shelf. Before asking about taste, retrieve an existing author profile or wiki when one is available. Load author-specific defaults only when the author supplied them or the work is explicitly in that author's environment; keep those defaults out of the reusable method.

### 2. Bind to the canonical workspace

Find and read the programme README, source ledger, current design contract, and latest rendered artifact. In Shiva's teaching workspace, `design.md` and `skills/shiva-teaching-artifact/SKILL.md` outrank bundled SHVA styling. Preserve the official client brief, session names, dates, durations, and faculty ownership unless Shiva changes them.

For a greenfield book-shaped brief with no programme folder, wait for the approved Book Foundation Record before creating the minimal programme README and source ledger. For work that does not need the gate, create them before drafting. If the destination itself is genuinely unclear, ask for that one choice. Record the brief, audience, official timetable, known sources, assumptions, open questions, and artifact paths. A prior render is then not required; the first render becomes the baseline.

Read `references/01-programme-architecture.md` before changing the programme spine.

### 3. Retrieve before inventing

Search the author's wiki and current programme files first. In Shiva's environment, then use Readwise and the owned book corpus for structural inspiration. Use live web research for current examples and factual verification. Prefer primary sources and serious practitioner-intellectual work. Keep a source ledger whose evidence class separates observation, sourced fact, teaching synthesis, illustration, and unresolved claims. Record presentation status separately when wording or a scene is direct, normalised, paraphrased, reconstructed, counterfactual, composite, or author synthesis. Reconstruction and counterfactual are not evidence classes and never inherit factual authority from fluent prose.

Read `references/04-research-routing.md` before research. If a dedicated source pack is needed, invoke or follow `mdp-source-finder` without letting source collection replace programme design.

### 4. Architect the learning progression

Define the programme question and the concrete artifact participants will revise across sessions. For each session, name:

- the question the room must answer;
- the organizational disturbance or decision that makes it matter;
- the participant move;
- the artifact produced or revised;
- the unresolved question handed to the next session.

Do not make sessions a list of topics. Make each one change what the participant can inspect, decide, build, or challenge. Use `references/01-programme-architecture.md`.

### 5. Create one canonical session model

Before drafting three modes, write a compact JSON content model using the contract in `references/02-session-content-model.md`. Start from `fixtures/who-owns-the-exception.valid.json` and replace its content. Store the Book reader separately from the participant audience. Store the central question, case and purposeful return points, terms that need introduction, claims, bounded lateral examples, evidence-path comparisons, mechanism, narrative hinges, visuals, exercise journey, sources, transition, and surface references once.

Run the scope-appropriate foundation check and session check:

```bash
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <book-foundation.json> full
node "$SKILL_DIR/scripts/validate-session-model.mjs" <session-model.json>
```

Do not draft Book, Teaching, and Slides independently. If the model changes, propagate the change to all surfaces before polishing any one of them. Semantic parity means shared meaning, not identical density: a surface may omit a block only when the model declares that omission; it may never invent one.

The validator proves structural declarations and cross-references: core blocks survive in all three surfaces; every canonical exercise block maps to exactly one uniquely identified exercise record; commitment, consequence reveal, consequence-led revision, AI challenge, and final revision retain their order when changed information drives the exercise; every optional reveal block belongs to exactly one applicable exercise; hinge endpoints have the intended block types; term references point from problem to definition to reuse; reveal gates bind only to fields that can exist at that point; every participant field has a writing step; and the filled edition uses the same fields in the same order. It rejects obvious bypasses such as duplicate or unbound exercise records, negative minutes, one-blob schedules, placeholder answers, renamed duplicate foundation directions or decision options, an early gate that demands the whole form, game choices disconnected from the decision fork, visibly duplicated game routes, different internal game states with the same visible consequence, a forced linear click-through presented as a game, and next choices that cannot be reached from the resulting state. It does not prove that prose is causally connected, an example is true, a visual beats words, a field contains meaningful input in the DOM, or the Book is novice-readable. Those require source, narrative, browser, and rendered-artifact reviews.

### 6. Build the requested surfaces

For a programme-review HTML, place the cover and session-by-session MDP plan in the shell before the session surfaces. For a public-book HTML, render the approved book object—cover, title material, contents, selected author material, optional prologue, parts, chapters, notes, and exercises—in the order chosen in the Book Foundation Record. Do not make a trade-book reader pass through an internal programme table unless the approved architecture gives it a reader-facing job.

Book mode is continuous reading for the approved Book reader. Teaching mode contains the scaffolding for the participant audience. Slide mode is compression. Follow `references/03-three-surface-contract.md` and run the three-hinge pass in `references/06-chapter-craft-and-exercise-journey.md` before rendering.

For a book-shaped build, derive the title system, opening logic, author material, and visual identity from the approved Book Foundation Record. Do not restore a previous book's title treatment, visual grammar, or cover palette by habit.

Set the timing and editorial limits in `programme.planningProfile` from the approved brief and author profile. In Shiva's current teaching profile, a 90-minute scheduled session normally carries a protected 90-minute core plus 30 minutes of integrated depth reserves, a 3,800-5,200-word planning range, no more than three internal headings, no body callout-card system, and at most two pull lines. These are Shiva-profile defaults, not universal constants. Every segment needs a facilitator move, participant move, artifact state, and recovery move; every reserve needs a trigger, added move, participant move, artifact state, and rejoin. Do not show prepared runway as official timetable duration unless the brief says so.

Every exercise must arise from the chapter's final unresolved problem and make the participant commit before AI is used. When changed information drives the learning, keep two reveals distinct. The early consequence reveal may require only a proper subset of fields writable by that point; it introduces a fact, provenance issue, counter-signal, or consequence and immediately leads to a visible human revision. Only then may AI challenge the revised judgment. The later filled-edition reveal remains mandatory for every exercise and unlocks only after every comparison field contains a meaningful attempt. If changed information is not part of the exercise, record why the consequence reveal is unnecessary rather than manufacturing one. A common transfer case may replace the sustained case only when it lowers setup cost, tests the same mechanism, and is explicitly bridged back to the chapter and the learner's context. AI may challenge a map, threshold, interpretation, evidence boundary, or exception. It may not write the initial answer, certify a consequential decision, authorise action, or become the decision-maker.

### 7. Verify from the artifact

Run the gates in `references/05-verification-gates.md`. At minimum:

- validate the session model;
- verify the core and reserve timing sums;
- compare shared claims, cases, examples, diagrams, and exercises across all modes;
- audit the scene-to-concept, concept-to-framework, and chapter-to-exercise hinges;
- inspect the live HTML at desktop and mobile widths;
- test tabs, participant-input gates, reveal controls, focus transfer and restoration, overflow, visuals, and browser errors;
- confirm Book mode has sustained prose and scarce headings rather than card-like fragments;
- confirm every factual claim stays within its source boundary.

Keep source, plugin/package, installation, runtime invocation, and rendered-journey proof separate. Do not claim a participant outcome without a live cohort pilot.

## Hard rules

- Start from a real organizational disturbance or consequential decision, not a framework definition.
- Use one central question, one sustained case, one earned mechanism, and one named participant artifact per chapter. Permit one to three bounded lateral examples when each performs a different conceptual job; do not turn the chapter into an anecdote parade.
- Treat analogies as explanatory instruments. Each factual lateral example should teach an unfamiliar verified fact, reveal a specific mechanism more clearly than a generic manager story would, state where the analogy ends, and circle back to the human or organisational problem without false equivalence.
- Keep Book Chapter prose direct, connected, and novice-readable. Let a problem appear before the term, framework, or visual that resolves it. Do not use an outline phrase as a prose transition, fake clock-time or memo frame, fourth-wall narration, repeated antithesis, literature-review procession, decorative metaphor density, condescending theory commentary, generic motivation, AI doom, closing sermon, or a card on every idea.
- Introduce a specialist term through need: the reader meets the problem, receives a plain definition and nearby distinction, then sees the term change the case. Explain professional nouns at first contact.
- State comparison logic precisely. When two records produce similar risk, name the common organisational problem and the different mechanisms that produced each record; never collapse omission, process trace, measurement change, and model error into one generic data-quality claim.
- Use verified cases when visible prose relies on their facts. Mark a composite as illustrative and do not manufacture precise details to make it feel real. Do not stack punchlines, slogan chains, or clipped motivational fragments.
- A framework needs no branded name unless the name makes a genuinely original, reusable distinction clearer. Build the whole relation in prose before naming or drawing it.
- A substantive visual is an explanation, not a speed bump. Use zero to two across the chapter body and workbook, excluding cover art and ordinary controls. Place it after the reader can describe the relation in words, count every editorial illustration, diagram, data graphic, and exercise map, and keep it only when the picture replaces weaker prose.
- Book prose may use sparse semantic italics for an earned term or question. Do not turn italics into a second callout system; Teaching and Slides follow their own no-italics design contract.
- End Book prose in an unresolved consequence that the exercise or next chapter can take up. Do not announce that the next chapter is beginning or append a detached new topic as a transition.
- Keep facilitator notes, timing, dialogue, contingencies, and source caveats out of Book and Slide surfaces.
- Slide Content may remove detail but may not introduce a new claim, example, framework, or exercise.
- Keep private or identifiable participant and employee data out of external AI tools by default.
- In Shiva's teaching workspace, HTML is the review artifact unless Shiva asks for PDF. In another environment, follow the requested delivery format and its local artifact rules.
- Do not expose process scaffolding or prompt logic in participant-facing views.

## References

- `references/00-book-foundation-interview.md`: required interview, approved foundation record, title systems, author material, voice, and visual identity for new books or substantial reframes.
- `references/01-programme-architecture.md`: programme question, session table, carried artifact, and cross-session progression.
- `references/02-session-content-model.md`: canonical JSON model and cross-surface identity rules.
- `references/03-three-surface-contract.md`: Book Chapter, Teaching Script, Slide Content, exercise, and HTML interaction contracts.
- `references/04-research-routing.md`: wiki, programme files, Readwise, owned books, web verification, and source classifications.
- `references/05-verification-gates.md`: deterministic checks, rendered QA, and acceptance rubric.
- `references/06-chapter-craft-and-exercise-journey.md`: three narrative hinges, prose anti-patterns, evidence-path comparisons, framework naming, and the chapter-end exercise journey.

## After a successful build

With Shiva's explicit approval, update the relevant wiki method or project page and record any new general rule. Do not turn a one-off preference into a universal rule until it explains more than one artifact.
