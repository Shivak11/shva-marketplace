# SHVA MDP Architect v0.10.0

## Objective

Add an additive SHVA orchestration skill surfaced as **MDP Architect** and invoked as `/shva:mdp-architect`. It should turn an executive-education brief into a source-grounded programme architecture and, when requested, one coherent interactive HTML artifact whose Book Chapter, Teaching Script, and Slide Content modes are different compressions of the same session.

## Safe activation

- Add the skill alongside `mdp-source-finder`, `teaching-designer`, `worksheet-generator`, and `book-taste-curator`.
- Preserve every existing skill and invocation unchanged.
- Use MDP Architect for new end-to-end programme builds and substantial MDP refinements while the narrower skills remain directly invokable.

## Scope

- Add `shva/skills/mdp-architect/SKILL.md`.
- Add concise references for the programme architecture, shared session contract, chapter and mode contract, research routing, and verification gates.
- Add `agents/openai.yaml` for Codex discovery.
- Add a deterministic validator for content-model and timing invariants, plus a valid and invalid fixture.
- Update plugin and marketplace metadata to v0.10.0.
- Update the plugin README and `/shva:help` with the new invocation and its boundary from neighbouring skills.
- Update the canonical Obsidian wiki with the MDP operating model, the Chapter One design learnings, and a link to the SHVA skill.
- Save the reusable procedure in Shiva's Brain so other MCP clients can retrieve the same method.

## Product contract

### Modes

1. **Architecture mode** turns a brief into a session-by-session MDP plan, central question, carried artifact, faculty/room work, and cross-session progression.
2. **Chapter mode** creates one session as a sustained book chapter, first-person Shiva teaching script, and condensed slide content from one canonical content model.
3. **Programme build mode** applies the session contract across a complete programme without making every session identical.
4. **Audit mode** diagnoses thinness, mode drift, cognitive overload, source overreach, weak exercises, pacing risk, and visual defects in an existing artifact before revising it.

### Session invariants

- Begin with a real organizational disturbance or consequential decision, not a framework definition.
- Use one central question, one sustained case, at most one short lateral example, one earned mechanism, one named participant artifact, and one unresolved question handed to the next session.
- Make the learner commit before any AI reveal.
- Use AI to challenge a map, interpretation, threshold, or evidence boundary. Never let it certify a people decision or become moral authority.
- Build every 90-minute teaching slot with a protected 90-minute core and 30 minutes of integrated depth reserves. Reserve moves deepen the existing case, mechanism, or artifact and include an explicit rejoin point.
- Keep the official client timetable separate from prepared facilitation capacity.

### Three-surface contract

- Store shared claims, terms, cases, diagram labels, exercise steps, and transitions once, then render the three modes from those semantic blocks.
- Book Chapter is connected prose: usually 2,500 to 3,200 narrative words, no more than three internal headings, no body callout-card system, scarce emphasis, one inline diagram, and a 400 to 600 word chapter-end workbook.
- Teaching Script preserves the chapter sequence and adds only spoken lines, timing, room moves, likely responses, recovery moves, depth reserves, and rejoin instructions.
- Slide Content introduces no new claim, example, theory, or exercise. It compresses the same session into six to ten visual beats.
- Every exercise includes a realistic filled edition hidden behind an intentional reveal control.

### Source and design contract

- Search Shiva's wiki and current programme files first, then Readwise/book corpus and live web sources as needed.
- Verify current or material factual claims against live primary sources when available.
- Keep source boundaries in a ledger: observed, source-backed, teaching synthesis, illustrative, or still to confirm.
- Follow the teaching workspace's current `design.md` and `shiva-teaching-artifact` skill before using SHVA templates.
- Keep provenance, prompt logic, and facilitator scaffolding out of Book and Slide surfaces.
- HTML is the review artifact by default. Do not generate PDF unless requested.
- Render and inspect desktop and mobile. Verify diagrams, reveal controls, headings, text size, overflow, timing sums, and browser errors from disk.

## Composition boundaries

- `mdp-source-finder` may assemble raw sources when the brief needs a source pack.
- `book-taste-curator` may retrieve Shiva's taste profile and book-derived structural moves.
- `teaching-designer` remains the direct route for a standalone plan, script, or light keynote.
- `worksheet-generator` remains the direct route for a standalone participant worksheet.
- MDP Architect owns the programme spine and cross-surface consistency when two or more of those outputs must work together.

## Verification

- Parse all edited JSON and YAML files.
- Run the skill-creator quick validator on `shva/skills/mdp-architect`.
- Run the deterministic MDP contract validator against passing and failing fixtures.
- Confirm help, README, manifest, marketplace, and folder names agree on `/shva:mdp-architect` and v0.10.0.
- Forward-test the skill on a different 90-minute MDP session and grade it against the acceptance rubric.
- Inspect the complete Git diff and staging set before each commit.
- Reindex the wiki with both `qmd update` and `qmd embed`, then verify `qmd status`.
- Keep source, plugin package, installation, runtime invocation, and rendered-journey proof separate.
