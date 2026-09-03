# SHVA MDP Architect v0.12.0 — Narrative And Exercise Integrity

## Objective

Promote the full Chapter One correction cycle into a reusable MDP/book-production method. The release must prevent a semantically consistent chapter from still reading like a memo, glossary, research-paper summary, or interface; it must also prevent a chapter-end exercise from being mechanically valid yet detached from the argument the reader has just completed.

This is a replacement refinement of the current `mdp-architect` behaviour. The narrower SHVA teaching skills remain available; no parallel legacy mode is introduced.

## Source boundary

- Treat direct user feedback from the 3 September 2026 DOUE Chapter One review as editorial evidence.
- Use the verified clean Chapter One at commit `aa72d93abc38d4cd7c7a4f0d367689eade554455` as implementation evidence, not as a universal template.
- Do not revise the DOUE HTML in this release. The proposed Street Bump exercise remains unapproved and must not be silently installed into Chapter One.
- Preserve the distinction between personal taste and reusable method: named books, Shiva's anti-shelf, author biography, and platform choices stay in personal taste/wiki records; the generic skill receives observable editorial tests.
- Preserve source boundaries between reported fact, reconstruction, counterfactual, composite, and teaching synthesis.

## Product decisions

### Three narrative hinges

1. **Scene to concept:** introduce a term only after the reader has met the problem it names. Define it in plain language, distinguish it from its nearest neighbour, and reuse it in consequence.
2. **Concept to framework:** build the complete relation in prose before naming or drawing a framework. Do not brand a six-box sequence merely because it can be diagrammed.
3. **Chapter to exercise:** the exercise must resolve the live question created by the chapter's final argument. It may not restart at a midpoint framework or introduce an unrelated case without a bridge.

### Chapter craft

- Write for a public-book novice, even when the source cohort is senior or functional.
- Use connected causal paragraphs and concrete hinges; reject outline transitions, fourth-wall narration, fake clock times, memo texture, research-paper summaries, repeated antithesis, condescending era commentary, and punchline stacks.
- Let sourced dialogue breathe in separate paragraphs; keep caveats in quiet notes unless uncertainty changes the conclusion.
- Explain domain nouns at first contact and translate local shorthand.
- Use one sustained case for continuity and up to three bounded lateral examples for distinct conceptual work. A factual example must be verified, preferably surprising, and explicitly return to the human or organisational problem.
- Where two cases are compared, state both the common organisational problem and the different evidence mechanisms. Similar outcomes do not erase different causes.
- Permit sparse semantic italics in Book prose when one word or question has earned emphasis. The no-italics rule remains for designed teaching and slide surfaces.
- Allow zero to two chapter visuals. A visual must replace weaker prose, preserve chronology and source status, remain legible on mobile, and never be added merely because a framework exists.

### Exercise integrity

- Decide whether the exercise should use a common case or the learner's own case. Prefer a common, broadly legible case when comparison, reveal, or game-like consequence matters; transfer to the learner's context afterward.
- Make commitment before reveal an interaction rule, not only an instruction. A reveal that can be opened before any participant input fails.
- Ask for one visible decision at a time. Every step must change the artifact or expose a consequential trade-off.
- Keep the exercise and filled edition field-for-field comparable. The completed edition must name real roles or actors, a live alternative, evidence that could discriminate, a bounded right, executable action, and a review or reversal condition; use an explicit not-applicable rationale where a field genuinely does not belong.
- AI may question or stress-test a committed answer. It may not write the initial answer, authorise action, certify fairness, or replace the human decision owner.
- Treat game feel as consequential movement: commit, reveal a fact or consequence, revise, compare, transfer. Do not simulate it with badges, buttons, or decoration.

## File scope

- Update `shva/skills/mdp-architect/SKILL.md`.
- Update references `00` through `05` and add a focused chapter-craft/exercise-journey reference.
- Reconcile `scripts/validate-session-model.mjs` and both fixtures with the written contract, especially the visual range and exercise gate.
- Update the personal `book-taste-curator` description/rubric only where its current “diagram-heavy” and “all reading is product R&D” language would contaminate book authorship.
- Bump marketplace/plugin/help/readme release copy to `0.12.0`.

## Reviewer lanes

- **Requirement mapper:** trace every direct correction to an existing or missing rule.
- **Taste reviewer:** test paragraph movement, emphasis, example choice, and personal-vs-generic separation.
- **Adversarial method auditor:** try to reproduce every rejected failure while technically satisfying the skill.
- **Independent clean-head verifier:** rerun deterministic checks and forward-test a fresh chapter/exercise request from the exact committed head.

Agents remain read-only. The orchestrator owns every shared file and reconciles their findings.

## Verification

1. Run Skill Creator validation on `mdp-architect` and `book-taste-curator`.
2. Parse plugin manifests and agent YAML.
3. Run the MDP validator on the valid fixture; confirm the invalid fixture fails.
4. Add focused mutation checks for visual count, ungated reveal, field mismatch, missing chapter connection, and AI-before-commit order.
5. Forward-test a fresh, non-HR, book-shaped session request. Confirm the foundation gate stops production when identity choices are unresolved, and confirm an approved-record exercise plan preserves all three hinges.
6. Audit release-facing version text and the complete Git staging set.
7. Commit and push verified source. Install/update the supported skill copy only after source validation; report source, package, installation, runtime discovery, wiki, and GitHub proof separately.
