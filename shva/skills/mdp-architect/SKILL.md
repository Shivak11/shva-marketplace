---
name: mdp-architect
description: >-
  Use when an author or faculty builder wants to create or substantially refine a
  multi-session learning programme: an MDP, executive-education or faculty
  programme, workshop series, or book-shaped course. Establishes the programme
  thesis and learner change, audits inherited material by present function,
  architects the session spine, and keeps chapters, teaching scripts, slides,
  exercises, sources, games, and interactive HTML coherent. Also audits thin
  chapters, generic-AI reframing, cognitive overload, weak pacing, mode drift,
  decorative cases, unearned frameworks, or disconnected exercises and answer
  keys. Triggers include "MDP", "redesign this syllabus", "session-by-session
  plan", "write the chapter", "teaching script and slides", "make this two hours",
  "refine this course", and "programme architecture" when multiple sessions or
  canonical surfaces must work together. Do not use for a standalone source pack,
  keynote, or worksheet when a sibling skill covers the whole request.
---

# MDP Architect

Build a substantial learning programme as one connected system. Start with the
change learners must be able to demonstrate: a decision, interpretation,
diagnosis, craft move, explanation, or other observable performance. End with a
source-grounded, verified programme in which the chapter, teaching script,
slides, exercises, and cross-session artifacts agree.

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
| Architecture | A new programme, client brief, or major restructure | Programme Thesis Record and session-by-session plan; cover direction only when book-shaped |
| Chapter | One session developed in depth | Book Chapter, Teaching Script, Slide Content, workbook |
| Programme build | A complete multi-session build | Architecture plus the requested session surfaces |
| Audit | An existing course or HTML that feels thin, busy, generic, or short | Evidence-backed diagnosis, then an in-scope revision |

Do not equate a long brief with an approved programme thesis. Start production when a current approved Programme Thesis Record covers the requested work and any other applicable gate is satisfied. Reuse settled decisions instead of ceremonially interviewing the author again. Ask only for a missing choice whose answer changes the promise, architecture, evidence boundary, or requested artifact.

## Programme Thesis Gate

For a new substantial programme, a major redesign, or an under-specified architecture request, read `references/00-programme-thesis-interview.md` and establish a Programme Thesis Record before production. Inspect the brief, inherited outline, current artifacts, source ledger, author context, and previous decisions first. Then show the author a provisional diagnosis and compact options; do not begin with a generic survey.

The record must distinguish the recognised problem from the learning promise, state the learner's starting point and observable change, name the central question and the author's distinctive argument, classify the evidence and uncertainty boundaries, identify the carried artifact or performance, and show how the session progression proves the promise. For a redesign, audit inherited material by purpose and fit rather than preserving or discarding it by default. Classify the enduring-requirement/changing-form lens as `Central`, `Supporting`, or `Not applicable`, with a substantive reason. `Not applicable` is a valid result: never force AI or transformation language into a subject that does not need it.

An approved current record may be reused for a well-specified build or a small correction when the recognised problem, promise, learner, central argument, and scope remain unchanged. Name the record and the evidence of approval. If one of those changes, revise only the affected thesis fields and dependent session decisions. This is an editorial production gate, not a Super-outer critical-action approval.

## Book Foundation Gate

For a greenfield book, a substantial book-shaped programme, or a book-like chapter whose premise, reader, identity, title, or front matter is not already approved, run the Book Foundation Interview before production. Read `references/00-book-foundation-interview.md` and complete its short, choice-led rounds in chat. The author must explicitly approve the resulting Book Foundation Record for the exact production scope: `prose`, `front-matter`, `visual-production`, or `full`. A prose approval may deliberately defer title or visual choices for another author and may authorise a prose-bearing canonical chapter model; it cannot authorise finished front matter, cover art, or book-identity styling. In Shiva's environment, the validator defaults to `full` unless Shiva explicitly narrows it to an exploratory prototype.

For a small correction, a recent approved record may be reused only if the premise, reader, and identity are unchanged. Name that record and why it still applies. Do not make a taste-sensitive choice silently in HTML: offer two or three concrete candidates with a recommendation and trade-off. This is an editorial approval, not a Super-outer critical-action approval.

## The workflow

### 1. Establish the programme thesis

Classify the request against the Programme Thesis Gate before creating programme architecture, a canonical session model, or participant-facing artifacts. When the gate applies, conduct the inspect-first interview, return the compact record, and wait for explicit approval of the next production scope. Research, source inspection, and candidate-making may happen before approval; HTML and other production artifacts may not.

Keep author contribution epistemically clear. Tag a load-bearing claim as established external knowledge, author experience or teaching observation, author synthesis, or open hypothesis. An anecdote can motivate a question; it cannot silently become a general fact. When AI-age redesign is relevant, name which mechanism changed—representation, prediction, coordination, execution, monitoring, memory, or agency—and trace the consequence. Do not use “AI changes everything” as programme architecture.

### 2. Establish the book foundation when required

Classify the request against the Book Foundation Gate before creating an artifact. When it applies, conduct the interview, return the compact record, and wait for explicit approval. Exploratory research and candidate-making may happen before approval; production outside the approved scope may not.

Keep the generic skill neutral: never assume an author biography, title, profile link, acknowledgement, recent cover, or reference shelf. Before asking about taste, retrieve an existing author profile or wiki when one is available. Load author-specific defaults only when the author supplied them or the work is explicitly in that author's environment; keep those defaults out of the reusable method.

### 3. Bind to the canonical workspace

Find and read the programme README, source ledger, current design contract, approved Programme Thesis Record, and latest rendered artifact. In Shiva's teaching workspace, `design.md` and `skills/shiva-teaching-artifact/SKILL.md` outrank bundled SHVA styling. Preserve the official client brief, dates, durations, and faculty ownership unless Shiva changes them. Session names and sequence may change in a redesign only when the approved thesis and transformation audit explain why.

For a greenfield book-shaped brief with no programme folder, wait for the approved Book Foundation Record before creating the minimal programme README and source ledger. For work that does not need the gate, create them before drafting. If the destination itself is genuinely unclear, ask for that one choice. Record the brief, audience, official timetable, known sources, assumptions, open questions, and artifact paths. A prior render is then not required; the first render becomes the baseline.

Read `references/01-programme-architecture.md` before changing the programme spine.

### 4. Retrieve before inventing

Search the author's wiki and current programme files first. In Shiva's environment, then use Readwise and the owned book corpus for structural inspiration. Use live web research for current examples and factual verification. Prefer primary sources and serious practitioner-intellectual work. Keep a source ledger whose evidence class separates observation, sourced fact, teaching synthesis, illustration, and unresolved claims. Record presentation status separately when wording or a scene is direct, normalised, paraphrased, reconstructed, counterfactual, composite, or author synthesis. Reconstruction and counterfactual are not evidence classes and never inherit factual authority from fluent prose.

Read `references/04-research-routing.md` before research. If a dedicated source pack is needed, invoke or follow `mdp-source-finder` without letting source collection replace programme design.

### 5. Architect the learning progression

Work backward from the promised learner change. Define the programme question and the concrete artifact or observable performance participants will revise across sessions. For each session, name:

- the question the room must answer;
- the concrete disturbance, consequential decision, interpretive problem, craft task, diagnosis, or demonstration that makes it matter;
- the capability move the participant must make;
- the artifact state or performance that proves it;
- the unresolved question handed to the next session.

Do not make sessions a list of topics or learning-outcome jargon. Make each one change what the participant can inspect, decide, build, or challenge. If an inherited outline exists, complete the transformation audit before settling the new sequence. Use `references/01-programme-architecture.md`.

### 6. Create one canonical session model

Before drafting three modes, write a compact JSON content model using the contract in `references/02-session-content-model.md`. Start from `fixtures/who-owns-the-exception.valid.json` and replace its content. Store the Book reader separately from the participant audience. Store the central question, case and purposeful return points, terms that need introduction, claims, bounded lateral examples, evidence-path comparisons, mechanism, narrative hinges, visuals, exercise journey, sources, transition, and surface references once.

Run the scope-appropriate thesis, foundation, and session checks:

```bash
node "$SKILL_DIR/scripts/validate-programme-thesis.mjs" <programme-thesis.json> <requested-scope>
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <book-foundation.json> full
node "$SKILL_DIR/scripts/validate-session-model.mjs" <session-model.json>
node "$SKILL_DIR/scripts/validate-programme-chain.mjs" <programme-thesis.json> <book-foundation.json|-> <session-model.json|-> <requested-scope>
```

The standalone validators preserve local and legacy checks. The programme-chain
validator is the v0.14 production gate: it requires the actual Book Foundation
file for book-shaped work, rejects book-only records for other formats, proves
the foundation imported the approved thesis exactly, and resolves every new
session link to the programme's promise, carried proof, capability stage, and
stage proof.

Do not draft Book, Teaching, and Slides independently. If the model changes, propagate the change to all surfaces before polishing any one of them. Semantic parity means shared meaning, not identical density: a surface may omit a block only when the model declares that omission; it may never invent one.

The validator proves structural declarations and cross-references: core blocks survive in all three surfaces; every canonical exercise block maps to exactly one uniquely identified exercise record; every typed commitment, final revision, optional reveal, and—in an AI-present session—AI challenge belongs to exactly one applicable exercise; the selected exercise lifecycle retains its order; and a no-AI session supplies a substantive rationale while containing no AI block, actor, exercise field, or authority field. When AI is present, its moves come from an allow-list, its closed authority flags are false, and its visible block derives from the same contract. The positive owner resolves through the typed actor registry to a non-automatable human role introduced by the exercise case before commitment on all three surfaces; hinge endpoints have the intended block types; term references point from problem to definition to reuse; reveal gates bind only to fields that can exist at that point; every participant field has a writing step; and the filled edition uses the same fields in the same order. It rejects obvious bypasses such as duplicate or unbound exercise records, unowned lifecycle blocks, free-text or shadow AI authority, an unregistered owner ID, a registered AI actor disguised as the human owner, a roleless or explicit machine identity relabelled as a human role, a human owner introduced only after commitment, negative minutes, a one-blob schedule hidden by a permissive profile, renamed copies of one core or reserve move, placeholder answers, renamed duplicate foundation directions or decision options, an early gate that demands the whole form, game choices disconnected from the decision fork, visibly duplicated game routes, different internal game states with the same visible consequence, replay that skips the initial choice, a forced linear click-through presented as a game, and next choices that cannot be reached from the resulting state. It does not prove that prose is causally connected, an example is true, an ambiguously named actor is actually human, a visual beats words, a field contains meaningful input in the DOM, semantic paraphrases are genuinely different, or the Book is novice-readable. Those require source, narrative, actor-identity, browser, and rendered-artifact reviews.

### 7. Build the requested surfaces

For a programme-review HTML, place the cover and session-by-session MDP plan in the shell before the session surfaces. For a public-book HTML, render the approved book object—cover, title material, contents, selected author material, optional prologue, parts, chapters, notes, and exercises—in the order chosen in the Book Foundation Record. Do not make a trade-book reader pass through an internal programme table unless the approved architecture gives it a reader-facing job.

Book mode is continuous reading for the approved Book reader. Teaching mode contains the scaffolding for the participant audience. Slide mode is compression. Follow `references/03-three-surface-contract.md` and run the three-hinge pass in `references/06-chapter-craft-and-exercise-journey.md` before rendering.

For a book-shaped build, derive the title system, opening logic, author material, and visual identity from the approved Book Foundation Record. Do not restore a previous book's title treatment, visual grammar, or cover palette by habit.

Set the timing and editorial limits in `programme.planningProfile` from the approved brief and author profile. In Shiva's current teaching profile, a 90-minute scheduled session normally carries a protected 90-minute core plus 30 minutes of integrated depth reserves, a 3,800-5,200-word planning range, no more than three internal headings, no body callout-card system, and at most two pull lines. These are Shiva-profile defaults, not universal constants. A profile may raise but cannot remove the engine's anti-blob floor: at least two core segments and one distinct segment per started thirty minutes of official time. Core segments and reserves also need materially different semantic IDs and moves, not one row cloned behind new names; near-duplicate paraphrases remain a human-review boundary. Every segment needs a facilitator move, participant move, artifact state, and recovery move; every reserve needs a trigger, added move, participant move, artifact state, and rejoin. Do not show prepared runway as official timetable duration unless the brief says so.

Every exercise must arise from the chapter's final unresolved problem and make the participant commit before any challenge or worked comparison. Declare `session.aiUse` explicitly in every new model. When changed information drives the learning, keep the early consequence reveal separate from the later filled-edition reveal. The early reveal may require only a proper subset of fields writable by that point; it introduces a fact, provenance issue, counter-signal, or consequence and immediately leads to a visible human revision. In an AI-present session, AI may then challenge that revised judgment. In a no-AI session, the exercise proceeds through human or evidence-led revision without empty AI placeholders. The filled-edition reveal remains mandatory for every exercise and unlocks only after every comparison field contains a meaningful attempt. If changed information is not part of the exercise, record why the consequence reveal is unnecessary rather than manufacturing one. A common transfer case may replace the sustained case only when it lowers setup cost, tests the same mechanism, and is explicitly bridged back to the chapter and the learner's context. When AI is present, build its role from `aiRoleType`, one or more allow-listed `aiAllowedMoves`, and a closed `aiAuthorityBoundary` whose approval, denial, certification, decision, and authorisation flags are all false. The owning `ai-challenge` semantic block declares `renderFromExerciseContract: true` and carries no visible text or unknown fields. Declare every consequential actor once in the typed `actorRegistry`, bind each actor to the semantic block where the role first appears, and make the exercise case appear before commitment on every surface. A `human-role` names a recognisable human role in both its stable ID and display name and contains no explicit machine-identity token; put AI responsibility in the case context, not the actor identity. `humanDecisionOwner.actorId` must resolve to such a non-automatable actor listed in that exercise case; a plausible ID plus repeated flags is not enough. AI may challenge a map, threshold, interpretation, evidence boundary, or exception. It may not write the initial answer or become the decision-maker.

### 8. Verify from the artifact

Run the gates in `references/05-verification-gates.md`. At minimum:

- validate the session model;
- validate the Programme Thesis Record and its approval scope;
- validate the cross-record programme chain whenever a Book Foundation or new session model exists;
- verify the core and reserve timing sums;
- compare shared claims, cases, examples, diagrams, and exercises across all modes;
- audit the scene-to-concept, concept-to-framework, and chapter-to-exercise hinges;
- inspect the live HTML at desktop and mobile widths;
- test tabs, participant-input gates, reveal controls, focus transfer and restoration, overflow, visuals, and browser errors;
- confirm Book mode has sustained prose and scarce headings rather than card-like fragments;
- confirm every factual claim stays within its source boundary.

Keep source, plugin/package, installation, runtime invocation, and rendered-journey proof separate. Do not claim a participant outcome without a live cohort pilot.

## Hard rules

- Build programme architecture backward from a stated learner change and observable proof, not forward from a topic list.
- Treat inherited material by purpose, changed condition, and present fit. Do not preserve it for lineage theatre or discard it to perform novelty.
- Keep the transformation lens configurable. Never force AI, automation, or an enduring-form argument when the approved thesis marks it `Not applicable`.
- Distinguish established external knowledge, author experience or teaching observation, author synthesis, and open hypothesis. Do not promote fluency, conviction, or a single anecdote into evidence.
- Start from a concrete disturbance, consequential decision, interpretive problem, craft task, diagnosis, or demonstration—not a framework definition. Do not force every subject into an organisational meeting.
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

- `references/00-programme-thesis-interview.md`: inspect-first thesis interview, approval and reuse rules, transformation lens, inherited-material audit, and Programme Thesis Record.
- `references/00-book-foundation-interview.md`: required interview, approved foundation record, title systems, author material, voice, and visual identity for new books or substantial reframes.
- `references/01-programme-architecture.md`: programme question, session table, carried artifact, and cross-session progression.
- `references/02-session-content-model.md`: canonical JSON model and cross-surface identity rules.
- `references/03-three-surface-contract.md`: Book Chapter, Teaching Script, Slide Content, exercise, and HTML interaction contracts.
- `references/04-research-routing.md`: wiki, programme files, Readwise, owned books, web verification, and source classifications.
- `references/05-verification-gates.md`: deterministic checks, rendered QA, and acceptance rubric.
- `references/06-chapter-craft-and-exercise-journey.md`: three narrative hinges, prose anti-patterns, evidence-path comparisons, framework naming, and the chapter-end exercise journey.

## After a successful build

With Shiva's explicit approval, update the relevant wiki method or project page and record any new general rule. Do not turn a one-off preference into a universal rule until it explains more than one artifact.
