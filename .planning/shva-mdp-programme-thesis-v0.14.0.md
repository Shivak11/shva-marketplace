# SHVA MDP Architect v0.14.0 — Programme Thesis And Transformation Audit

## Objective

Generalise `mdp-architect` so that it can design or substantially rework a
programme in any serious subject without inheriting the language, assumptions,
or content architecture of one earlier programme. Before session production,
the skill must establish the programme's defensible thesis, the learner change,
and the relationship between inherited material and the conditions that have
changed.

This release preserves the v0.13.0 Learning Game Architect integration and all
existing book-foundation, canonical-session, evidence, actor, AI-authority,
exercise, visual, timing, and three-surface contracts.

## Source boundary and protected work

- Base the release on `origin/main` commit `b354fa8`, which includes Claude's
  Learning Game Architect addition. Do not revert or bypass that integration.
- Treat the current DOUE Chapter One and Chapter Two HTML as protected inputs.
  Their byte hashes must be recorded before and after later Chapter Three work.
- Keep the generic SHVA method author-neutral. Shiva's biography, named reading
  shelf, programme-specific examples, and DOUE concepts belong in personal or
  programme records, not in the reusable skill.
- Treat programme-thesis approval as an editorial production gate, not as a
  Super-outer critical-action gate.

## Product decisions

### Programme Thesis Gate

Run a compact Programme Thesis Interview for a new substantial programme, a
major redesign, or an under-specified architecture request. Inspect available
evidence first, offer a provisional diagnosis and two or three meaningful
options, and ask only questions whose answers materially change the programme.
Do not restart the interview for small corrections or for decisions already
approved in a current record.

The resulting Programme Thesis Record stores:

- subject and scope;
- learner audience and starting point;
- recognised problem and promised learner change;
- central question and the author's distinctive argument;
- inherited knowledge or outline, when present;
- changed condition;
- evidence and uncertainty boundaries;
- carried artifact or observable performance;
- session capability progression;
- intended public contribution, if any;
- exclusions and anti-goals;
- open decisions with their production consequences; and
- approval status, scope, and provenance.

Book-shaped work may also require the existing Book Foundation Interview. The
two records solve different problems and neither may silently substitute for the
other.

### Configurable transformation lens

For programme redesign, classify the question "what remains necessary while its
form changes?" as `Central`, `Supporting`, or `Not applicable`, with a reason.
Never force an old-form-versus-new-form thesis onto a greenfield programme or a
subject whose learning problem does not depend on transformation.

For every inherited item considered, the transformation audit records:

- source concept or question and original purpose;
- enduring requirement or function, if one exists;
- inherited form and changed condition;
- author claim or synthesis;
- disposition: preserve, reframe, combine, resequence, add, or omit, with reason;
- programme fit and destination;
- evidence status;
- learner move and artifact proof.

Lineage must remain visible without granting the old outline veto power over the
new programme.

### Architecture backward from learner change

Align the programme promise, each session's capability move, and the carried
artifact that proves the move. Distinguish established external knowledge,
author experience or teaching observation, author synthesis, and open
hypothesis. When an AI-age redesign is relevant, diagnose the mechanism that has
changed—representation, prediction, coordination, execution, monitoring,
memory, or agency—instead of adding generic AI vocabulary.

## File scope and ownership

The orchestrator owns all shared routing and release surfaces:

- `shva/skills/mdp-architect/SKILL.md`
- `shva/skills/mdp-architect/references/01-programme-architecture.md`
- `shva/skills/mdp-architect/references/05-verification-gates.md`
- `.claude-plugin/marketplace.json`
- `shva/.claude-plugin/plugin.json`
- `README.md`
- `shva/README.md`
- this plan and all commits

Disjoint worker ownership may be assigned only after this plan is committed:

- one worker may own a new programme-thesis reference and its example records;
- one worker may own validators, fixtures, and contract tests;
- one reviewer may perform read-only leakage and regression analysis.

No worker may edit a shared release surface or revert another worker's changes.
At collision detection, snapshot the foreign diff and touched files before any
ruling. Agent reports are leads; final acceptance comes from files on disk.

## Required adversarial behaviour cases

1. Existing organisational-behaviour syllabus redesigned for an AI-shaped
   workplace.
2. Greenfield product-thinking programme grounded in an author's product
   experience.
3. Non-AI leadership programme where the transformation lens is `Not applicable`
   and AI is not forced into the architecture.
4. Existing strategy outline whose enduring structure is largely preserved.
5. Book-shaped work that triggers both Programme Thesis and Book Foundation.
6. Workshop work that triggers Programme Thesis but not book-identity questions.
7. Under-specified work that stops in chat before HTML production.
8. Well-specified, approved work that proceeds without a ceremonial re-interview.

The audit must also attempt domain leakage, mandatory transformation framing,
ceremonial preservation or reinvention, CLO/PLO jargon, generic AI insertion,
anecdote-as-fact, speculative inevitability, generic survey questions,
premature artifact production, repeated questioning of approved choices, and
regression of the v0.13.0 game contract.

## Verification and release ladder

1. Preserve the pre-change baseline: the current MDP contract suite passes; the
   system `quick_validate.py` is initially blocked because both available Python
   runtimes lack `PyYAML`.
2. Validate the Programme Thesis Record schema and every adversarial behaviour
   fixture. Existing valid fixtures must continue to pass and invalid fixtures
   must continue to fail for their named reason.
3. Run Skill Creator validation from a Python environment with `PyYAML`, parse
   both plugin manifests and agent YAML, and audit stale release text.
4. Have an independent reviewer forward-test the exact clean candidate against
   unrelated programme domains and the preserved game integration.
5. Commit verified units immediately and audit the complete staging set before
   every commit.
6. Push the verified source through the repository's established main/release
   workflow. Keep source commit, remote read-back, package metadata, installation,
   fresh discovery, and behavioural invocation as separate proofs.
7. Update the wiki only after the source contract is stable.
8. Begin DOUE Chapter Three only after release, installation, and fresh-context
   behaviour have passed. Preserve Chapters One and Two byte-for-byte; append
   Chapter Three to the cumulative book and deliver HTML only.

## DOUE Chapter Three acceptance boundary

Before prose, record a compact Chapter 3–13 hybrid arc. Chapter Three should
test the upgraded method through the question: when automation absorbs the
movement of information, where does coordination work go? The recommended
sustained case is Knight Capital's eighth server, subject to source and taste
review. The learner artifact is Work Chart v1 with: trigger, work, human or
agent, information/context, evidence/provenance, judgment gate, authorised
action, outcome/feedback, exception/escalation/appeal, and accountable human.

Chapter Three must retain one sustained case, no more than two substantive
visuals, novice-readable causal prose, a progressive-reveal exercise with a
realistic filled edition, a protected 90-minute core plus 30 minutes of useful
reserve, and semantic parity across Book, Teaching Script, and Slides. It must
not absorb the later chapters' full treatment of agency, boundaries, tacit
knowledge, hierarchy, control, transition rights, or organisational learning.
