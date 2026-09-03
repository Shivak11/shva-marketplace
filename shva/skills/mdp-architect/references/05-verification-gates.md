# Verification Gates

Run these gates from disk. An agent report, clean source diff, or successful build alone is not proof.

## 0. Book Foundation Gate

- Classify whether the request is a greenfield book, a substantial book-shaped reframe, or a local correction.
- For a greenfield book or substantial reframe, confirm an explicitly approved Book Foundation Record covers the exact next production scope. Under the default `full` scope, this precedes HTML, cover art, front matter, a canonical chapter model, or production files; explicit prose approval may precede a prose-bearing model while leaving identity work blocked.
- If reusing a record for a local correction, confirm that the premise, reader, and identity are unchanged and name the record that supplies those decisions.
- Confirm the record settles every field needed for the requested approval scope. Substantial prose always needs reader, argument, boundaries, evidence base, opening mode, section logic, carried question or artifact, voice contract, and source status. Finished front matter and visual production additionally need their selected identity fields.
- For front-matter or full approval, confirm the author saw at least two materially different title systems. For visual-production or full approval, confirm at least two cover systems with composition, palette roles, typography mood, diagram grammar, prohibited motifs, and difference from recent work. Colour-only or name-only variations fail.
- Confirm that names, client claims, acknowledgements, endorsements, affiliations, and author experience are either verified or omitted. Never infer them from a programme brief.
- Run `node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <approved-record.json> <requested-scope>` before production. A draft record may exist, but the requested action needs approved status, explicit approval evidence, and no blocker that applies to its scope. Shiva's default target is `full` unless he explicitly narrows the prototype.

## 1. Scope and composition gate

- Confirm the work belongs to MDP Architect rather than a sibling skill.
- Confirm the programme plan table appears after the cover in a programme-review shell. For a public Book, confirm its placement matches the approved Book Foundation Record and does not displace selected front matter.
- Confirm each session has a central question, sustained case, carried artifact, commitment, mechanism, workbook, and handoff.
- Confirm no session merely repeats the preceding session with new labels.
- Confirm one main case and no more than three bounded lateral examples per session. Each lateral example must carry a distinct mechanism, teach a sourced unfamiliar fact when factual, and circle back to the organisational question.
- Confirm a Book chapter opens from a problem, verified situation, sourced material, or clearly marked illustration. Reject a generic thesis stack, fake clock-time, memo frame, or invented reporting detail.
- Confirm the Book reader and teaching participant audience are distinct fields. Reject cohort-only address or unexplained functional vocabulary in a Book intended for a general reader.
- Audit case diversity across sessions. Repetition may serve continuity, but a programme made entirely from generic manager meetings needs an explicit reason.

## 2. Timing gate

- Sum the required teaching moves to exactly `programme.officialSessionMinutes`.
- Sum depth reserves to the difference between `preparedRunwayMinutes` and the official duration. In Shiva's current 90-minute profile, that difference is normally 30 minutes; it is not a generic constant.
- Reject non-positive, fractional, or one-blob timing plans. Independently of the author-selected profile, require at least two core segments and one distinct segment per started thirty minutes of official time; the selected profile may set a higher floor. Reject core segments or depth reserves that are the same semantic IDs and moves copied behind new row IDs. Verify every core segment states its facilitator move, participant move, artifact state, and recovery move. Verify every reserve states its trigger, added move, participant move, artifact state, and rejoin line. Near-duplicate paraphrases still require a human timing read.
- Verify the rejoin line returns to the same case and artifact state.
- Keep official client timetable calculations separate and unchanged unless the user asks for a timetable revision.

## 3. Content model and parity gate

- Run `node "$SKILL_DIR/scripts/test-contracts.mjs"`. It must prove the approved foundation and valid session fixtures pass and each focused mutation fails for its named invariant.
- Verify every Book, Teaching, and Slide item maps to a canonical ID. Blocks marked `requiredAcrossSurfaces` appear everywhere; declared optional blocks may be omitted.
- Reject a surface that adds a claim, case, visual label, exercise step, or transition absent from the canonical model.
- Confirm every commitment, AI-challenge, and final-revision semantic block belongs to exactly one exercise; supporting discussion cannot masquerade as an unowned lifecycle block. Confirm the participant commitment occurs before the AI challenge in all surfaces. When changed information drives the exercise, confirm every surface also preserves consequence reveal → immediate human revision → AI challenge. Teaching core segments and slide beats must preserve the same first-use order rather than merely declaring it in a parent array.
- Confirm all three Causal Hinge Ledger entries use the intended endpoint types, point forward in Book order, and declare a causal bridge, unresolved consequence, and next move. Then read the prose straight through; structure cannot prove that the bridge is real.
- Confirm each specialist term appears after the problem that earns it, is plainly defined and distinguished, and is used again in consequence.
- Confirm every evidence-path comparison states its common problem, different mechanisms, and decision consequence.
- Confirm every canonical exercise block maps to one—and only one—exercise record with a unique ID. Confirm the exercise binds to its case and mechanism through structured block references and a live decision fork. Confirm every participant field is written by at least one exercise step. When a consequence reveal is present, confirm it requires a proper subset of fields writable by its trigger step, uses named required-across-surfaces reveal and revision blocks owned by exactly that exercise, immediately enters the named human revision step, and identifies the revealed fact, provenance, and decision consequence. When it is absent, judge the recorded rationale and confirm no typed reveal or consequence-revision blocks remain orphaned in the delivered surfaces. Confirm the later filled-edition reveal remains present and matches every participant field in order.

## 4. Source integrity gate

- Inspect the source ledger for evidence classification, presentation status, origin, source type, source title and locator when sourced, exact supported facts, teaching inference, and factual boundary on every material claim.
- Recheck current or material facts with a live primary source during this run.
- Confirm teaching synthesis and illustrative material are not represented as external evidence.
- Confirm raw recording IDs, prompt logic, provenance ledgers, and facilitator scaffolding are absent from Book and Slide surfaces. Treat reconstruction and counterfactual as presentation statuses rather than proof classes; verify the source claims beneath them.
- Confirm a visible case's source status supports both its material facts and the causal inference made beside it. A composite must not masquerade as reporting.
- For dialogue, confirm verbatim, normalised, paraphrased, and reconstructed wording are not conflated. A source recollection does not become a meeting transcript.
- For paired cases, confirm a shared outcome is not used to erase different evidence mechanisms. In particular, omission, process trace, measurement change, and model error remain separate.

## 5. HTML behavior gate

- Parse edited JSON and YAML files.
- Load the HTML from disk in a browser and check for console errors.
- Toggle Book Chapter, Teaching Script, and Slide Content. Confirm the active mode is visible, keyboard reachable, and returns the same session meaning.
- Confirm every declared gate in the actual DOM. When present, the consequence reveal must reject empty, whitespace-only, default, and too-short attempts; it must not demand the whole form; complete the named writable first-commitment fields, reveal the new information, and confirm the participant can revise while the first commitment remains visible and before AI appears. The filled-edition control must reject the same bypasses until every comparison field has a meaningful attempt. Open and close it with keyboard input, confirm focus moves to the reveal heading and returns to the control, and confirm the participant instructions and answers remain intact.
- Verify links, headings, diagrams, and controls work without a network dependency when the artifact is meant to be local.

## 6. Render gate

- Render and inspect a desktop viewport and a mobile viewport. Use at least 1440 by 1000 and 390 by 844 unless the client specifies another device.
- Inspect cover, programme plan table where approved, a Book section, every substantive visual, a Teaching reserve, a Slide mode, the workbook, the filled-edition reveal, and the final transition.
- Check readable type, overflow, clipped diagrams, table wrapping, contrast, touch target spacing, horizontal scroll, and visual dominance of callouts.
- Check the Book surface still reads as prose after styles load. If it scans like a deck with speaker notes, reduce headings and boxes before shipping.
- Read the Book surface straight through at body-text size. Confirm that paragraphs carry cause and consequence, terms appear after the problem they solve, diagrams arrive after the full mechanism is understandable, and emphasis is scarce.
- Confirm every specialist or region-specific noun needed to follow the scene is defined naturally on first use, including vocabulary that feels ordinary only inside one profession.
- Confirm case caveats remain traceable in notes without repeatedly breaking narrative immersion, and that every move from story to abstraction has an explicit hinge in the preceding prose.
- For each editorial reconstruction, compare composition and caption with the source chronology. Reject false simultaneity, implied access to private material, or a third visual added without replacing one of the first two.
- Run a blind taste read: it should name at least three intended traits, remain legible to a novice, and not be mistaken for keynote, influencer, memo, research-paper, or generic AI prose.
- Count substantive visuals from the DOM: editorial illustrations, diagrams, data graphics, and workbook maps all count; cover art and ordinary controls do not. Accept zero, one, or two and reject a third.
- Search the experienced Book prose for repeated outline transitions, meta narration, antithesis scaffolding, memorable-line duplication, and literature-review procession. A string scan is a prompt for a human read, not proof by itself.
- Read the final two Book paragraphs directly into the first exercise instruction. Reject a conceptual reset, unexplained new case, or activity that merely rehearses a midpoint framework.
- Walk the exercise from first decision through any consequence reveal, immediate human revision, AI challenge, executable action, filled-edition reveal, and transfer. Confirm the AI role is composed from allow-listed questioning or stress-testing moves and a closed-key boundary that explicitly denies approval, denial, certification, decision, and authorisation authority. Confirm the canonical AI-challenge block renders only from that owning contract; reject free-text or shadow fields that could contradict it. Confirm the positive owner is a stable non-automatable `human-role` that must be named before use and remains accountable for the final decision. Reject a reveal that changes no subsequent decision, a form that demands every field before the first consequential fact appears, or an AI challenge that arrives before the learner has responded to changed information.
- Compare the blank exercise and filled edition row by row at desktop and mobile widths. Reject missing answers, generic placeholders, dense answer walls, duplicated stages, or an answer several screens away from the field it explains.
- For any game, verify from interaction that the initial choices faithfully render every canonical decision-fork option, competing choices are visibly different, a choice changes visible state, and different state IDs produce distinct visible consequences. Confirm every next choice actually begins from the state just reached, the declared next choices equal the choices available from that destination state, every state is reachable from the initial state, and at least one reachable state offers two choices leading to different states. Replay both routes, confirm the decision returns to the initial state rather than a later checkpoint, and confirm the configured evidence persists. Structured JSON rejects interface theatre; it does not prove the implementation obeys it.

## 7. Forward test and delivery gate

- Forward-test a fresh book-shaped request in an isolated directory. Before explicit approval, the only deliverable may be a Book Foundation Record; no HTML or production artifact may appear. After approval, grade a different non-HR session, with a different case and official duration or planning profile where practical, against the same gates before calling the skill reusable. The bundled non-HR model mutation proves schema portability only; it does not replace this editorial forward test.
- For a substantial build, use separate read-only reviewer lanes for source boundary, narrative/taste, visual opportunity and geometry, exercise journey, and cross-surface parity. The orchestrator reconciles findings and verifies files from disk. Reviewer agreement is not a substitute for the experienced-artifact checks.
- Derive word count, heading count, repeated emphasis, visual count, and initial DOM state from the actual artifact. Do not accept self-declared model numbers as rendered proof.
- Inspect the complete Git diff and staging set. Verify files on disk, not only agent claims.
- Keep source, package, installation, runtime invocation, and rendered journey evidence separate in the report.
- In Shiva's teaching workspace, deliver HTML by default and do not generate a PDF unless Shiva requests one. Elsewhere, follow the requested delivery format and local rules.
