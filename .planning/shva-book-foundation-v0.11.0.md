# SHVA Book Foundation Gate v0.11.0

## Objective

Revise `mdp-architect` so a new book or substantial book-shaped programme does not begin in HTML. It begins with a short, choice-led Book Foundation Interview in chat and an explicitly approved Book Foundation Record. The record settles the book's argument, reader, promise, title system, front matter, author platform, chapter-opening logic, writing-taste translation, and distinct visual identity before production.

Also update SHVA's personal `book-taste-curator` evidence so Shiva's newly stated reference shelf and anti-shelf are available to the architect without imitating any living author.

## Locked decisions

- Do not edit the current DOUE Chapter One HTML in this change.
- Keep the generic MDP skill reusable by other authors. Shiva-specific titles, biography, platform links, and taste evidence belong in his taste profile/wiki, not as universal defaults.
- Treat installed Super-outer as the engineering consequence and recovery layer. Run the Book Foundation Interview as the content-preparation analogue; do not reuse Super-outer's rare critical-action approval syntax for editorial approval.
- For greenfield books and substantial reframes, HTML production waits for explicit approval of the Book Foundation Record. Small corrections may reuse a recent approved record if its premise, reader, and identity are unchanged.
- Any unresolved taste-sensitive choice is shown in chat first as two or three concrete candidates with a recommendation and trade-off. Do not silently choose one and discover the mismatch in HTML.
- Acknowledgements thank real people or institutions. Author vantage, experience, and why the book exists belong in an Author's Note unless the author explicitly chooses otherwise. Never invent names, cohorts, clients, thanks, endorsements, or institutional ownership.
- Every book receives a subject-specific identity. Present at least two materially different title/cover systems before selection; never default to the previous book's palette, composition, or cover grammar.
- Learn from structural traits of reference books, never reproduce protected prose, diagrams, or a living author's voice.

## Product contract

### Interview rounds

1. Proposition: reader, problem, transformation, central argument, boundary, and evidence base.
2. Book architecture: title/subtitle candidates, section logic, carried question or artifact, chapter promise, and opening mode.
3. Author and front matter: Author's Note versus Acknowledgements, verified experience claims, dedications/thanks, profile URL, newsletter/Substack status, and edition note.
4. Voice: reference shelf, anti-shelf, paragraph movement, example standard, density, humour, vocabulary, and sentence-level bans.
5. Visual identity: two or three distinct cover directions with composition, palette, typography, diagram language, and explicit difference from recent books.
6. Approval: one compact Book Foundation Record with decisions, open items, source status, and a clear approve/amend question.

Ask in short rounds of at most three questions. Each question supplies useful options and a recommended starting point. Do not make the author answer a blank questionnaire when the existing context supports a sharper nudge.

### Perceptible voice contract

- Connected paragraphs carry an argument through cause and consequence.
- A chapter earns its framework after the reader understands the disturbance.
- One unfamiliar, verified, non-generic example may carry a load-bearing mechanism; novelty alone is insufficient.
- Memorable lines are scarce and separated. Reject stacked punchlines, slogan chains, clipped motivational fragments, circular revelation, and a closing sermon.
- The prose remains readable to a novice without treating a senior reader as unintelligent.
- A blind reviewer should be able to name at least three approved taste traits from the chapter and should not confuse it with keynote, influencer, or generic AI prose.

### Visual identity contract

For each candidate direction specify: premise connection, composition, palette roles, typography mood, diagram grammar, prohibited motifs, and how it differs from the last relevant book. Colour alone does not count as a different direction. The cover is selected in chat before art generation or HTML styling.

## File scope

- Add `shva/skills/mdp-architect/references/00-book-foundation-interview.md`.
- Update `shva/skills/mdp-architect/SKILL.md` and the three-surface, research, and verification references.
- Update `shva/skills/book-taste-curator/references/taste-profile.md` and `library.md` with Shiva's new explicit evidence.
- Update plugin/marketplace version metadata, READMEs, and help copy to v0.11.0.
- Do not alter the deterministic session JSON schema unless the foundation gate creates a machine-checkable invariant that belongs there.

## Verification

- Run the Skill Creator validator on `mdp-architect` and `book-taste-curator`.
- Parse both plugin JSON manifests.
- Run the existing MDP validator against the valid fixture and confirm the invalid fixture still fails.
- Forward-test the revised skill with a fresh book-shaped MDP request in an isolated directory; verify that it stops at a Book Foundation Record and does not create HTML.
- Search the package for stale v0.10.0 release-facing copy and for accidental hard-coded Shiva biography in the generic interview reference.
- Audit the complete diff and explicit staging set before commits.
- Install/update the verified source separately from publishing it. Report source, package, installation, fresh-task discovery, wiki, and GitHub proof independently.
