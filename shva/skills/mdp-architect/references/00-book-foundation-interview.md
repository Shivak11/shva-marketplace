# Book Foundation Interview

Run this interview before producing a new book or a substantial book-shaped programme. Its job is to settle the editorial decisions required by the next production scope; HTML, a cover, a chapter model, or a slide deck cannot settle those choices safely on their own.

## 1. Decide whether the gate applies

The interview is required when the work is any of the following:

- a greenfield book or a greenfield programme that will be presented as a book;
- a substantial reframe of a book-shaped programme, including a new premise, reader, title system, author platform, or visual identity;
- a request for a book-like chapter, cover, front matter, or three-surface HTML experience where those decisions have not already been approved.

A local correction may reuse a recent approved record only when the premise, reader, and identity are unchanged. Name the record being reused and say why it still applies. If any one of those three changes, run a short foundation revision before production.

Before explicit approval, research and candidate-making are allowed. Do not create an artifact in a scope that has not been approved. With the default `full` scope, this bars HTML, cover art, front matter, a canonical chapter model, and production files. An explicitly approved `prose` scope may produce the prose-bearing canonical model while keeping title, front-matter, cover, and visual-identity work blocked. Do not use Super-outer approval syntax for this editorial decision. If the author explicitly asks for an exploratory prototype while non-blocking identity choices remain open, label it as such and record every deferred field; it may not establish the final voice, cover, front matter, or book identity.

Premise, Book reader, reader change, argument, evidence boundary, and prose register always block substantial prose. A title, final cover, or palette may be deliberately deferred for another author, but it still blocks finished front matter and visual production. Record the approved scope explicitly as `prose`, `front-matter`, `visual-production`, or `full`; do not let approval for one kind of work silently authorise another. In Shiva's environment, unresolved taste-sensitive choices remain blocking and `full` is the default target unless Shiva explicitly authorises a narrower exploratory prototype.

## 2. Run short, choice-led rounds

Before asking, retrieve an existing taste profile, wiki record, prior foundation record, and the latest relevant artifact when available. Do not ask the author to repeat a preference already supported by current evidence. Ask no more than three questions in one turn. Start with what the brief, programme files, or verified context already establish. For every unresolved taste-sensitive choice, show two or three concrete candidates, mark one as recommended, and explain the trade-off. Combine uncontested fields when doing so reduces interview drag; required fields are fixed, not the number of conversational rounds. Do not send a blank questionnaire when a useful hypothesis can be offered.

Keep a running distinction between:

- **confirmed**: approved by the author or supported by a source;
- **author-supplied**: supplied by the author but not independently checked;
- **proposed**: a candidate that needs a choice;
- **open**: missing information that would materially change the book.

## 3. Interview rounds

### Round 1: proposition

Establish the Book reader, the problem they recognise, the change the book promises, the central argument, the boundary of the argument, and the evidence base. Record the teaching participant audience separately when the chapter also belongs to a course. A CHRO cohort can generate the material without becoming the permanent public reader; seniority does not imply knowledge of every specialist noun.

Ask questions that force a choice between real reader situations, not demographic abstractions. Capture what the book will not claim as carefully as what it will.

### Round 2: book architecture

Offer at least two title and subtitle systems. A system includes the promise, the organising metaphor or conceptual move, and the cover direction it makes possible. It is not two word-order variants of the same title.

Settle the section logic, the carried question or artifact, each chapter's promise, and the opening mode. Also decide whether the session-by-session programme table belongs in the reader-facing book, only in the interactive programme shell, or in production notes. An opening should begin with a human or organisational problem the reader can enter before it explains the framework. Suitable modes include a verified scene, a sourced fact or statement, or a clearly marked illustrative situation. Do not open with stacked thesis lines, a generic era claim, a fake clock-time detail, a memo header, or an invented event presented as reporting.

### Round 3: author and front matter

Separate the author-facing material correctly:

- An **Author's Note** explains the author's vantage, verified experience, and reason for writing the book.
- **Acknowledgements** thank real people or institutions the author has named and approved.
- A dedication, epigraph, foreword, profile link, newsletter, edition note, or back-matter invitation appears only when the author has chosen and supplied the necessary facts or permissions.

Never invent names, cohorts, clients, endorsements, institutional ownership, or claims of experience. Propose a front-matter order only from selected elements. A useful default order is title material, edition or copyright material, optional dedication or epigraph, contents, confirmed foreword, Author's Note, and Acknowledgements.

### Round 4: voice

Translate a reference shelf into observable mechanics, not an author's voice. Capture the desired paragraph movement, example standard, density, humour, vocabulary, and sentence-level bans. Also record the anti-shelf: registers or habits that would make the book feel wrong.

The resulting contract must require all of the following:

- connected paragraphs that carry cause and consequence rather than a ladder of isolated declarations;
- a framework, technical term, or diagram only after the reader understands the problem it resolves;
- one verified, non-generic example when an example carries a load-bearing mechanism, with novelty serving explanation rather than decoration;
- a clear distinction between reporting, teaching synthesis, and an illustrative composite;
- scarce emphasis, no punchline stacks, slogan chains, circular revelations, motivational fragments, closing sermons, generic AI prose, or outline labels disguised as transitions;
- prose a novice can follow without being spoken down to.

Record the emphasis policy explicitly. Book prose may use sparse semantic italics for a term or question that has earned attention even when Teaching and Slide design contracts prohibit italics. Emphasis is not a quota and must not become a second system of callouts.

Settle the exercise form at foundation level when it changes the reading experience: workbook or scored game, sustained case or bounded transfer case, the observable artifact, what must be committed before reveal, and what a filled edition or worked exemplar is meant to help the reader compare. The detailed exercise is designed later from the chapter's culminating problem.

Test the contract by asking whether a blind reader could name three intended taste traits and would avoid mistaking the chapter for a keynote, an influencer post, a memo, or a research-paper summary.

### Round 5: visual identity

Present two or three materially different cover directions. For each direction specify:

- its connection to the book's proposition;
- composition;
- palette roles rather than only colour names;
- typography mood;
- diagram or image grammar;
- prohibited motifs;
- how it differs from the last relevant book.

Colour alone does not make a direction distinct. Select a direction in chat before generating art or styling HTML.

### Round 6: approval

Return one compact Book Foundation Record. Mark each choice as confirmed, author-supplied, proposed, or open. Name the requested approval scope and identify which open item blocks which scope. End with this plain editorial question: **Approve this Book Foundation Record for the named scope, or amend it?**

Do not begin the requested production scope until the author explicitly approves that scope. When the command omits a scope, the validator deliberately checks `full`.

Validate the exact next action, not an imaginary finished book:

```bash
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <record.json> prose
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <record.json> front-matter
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <record.json> visual-production
node "$SKILL_DIR/scripts/validate-book-foundation.mjs" <record.json> full
```

A prose-only record may pass with title and visual identity deferred. The same record must fail a `full` request until those choices are selected.

## 4. Book Foundation Record template

```markdown
# Book Foundation Record

Status: proposed | approved
Project and scope:
Approval scopes: prose | front-matter | visual-production | full

## Proposition

- Reader:
- Teaching participant audience, if different:
- Assumed knowledge by surface:
- Recognised problem:
- Promised change:
- Central argument:
- Boundary:
- Evidence base and source status:

## Architecture

- Carried question or artifact:
- Section logic:
- Chapter promises:
- Opening mode and source status:
- Programme-table placement:

## Title systems

1. System name: title, subtitle, promise, trade-off, cover connection.
2. System name: title, subtitle, promise, trade-off, cover connection.

## Author and front matter

- Author's Note facts:
- Approved acknowledgements:
- Selected front matter order:
- Profile or newsletter links:
- Edition note:

## Voice contract

- Reference-shelf mechanics:
- Anti-shelf:
- Paragraph movement:
- Example and source standard:
- Density, humour, vocabulary, and bans:
- Book emphasis policy:

## Exercise direction

- Workbook or game:
- Sustained case or bounded transfer case:
- Observable artifact:
- Commitment and reveal policy:
- Filled edition or worked exemplar:

## Visual directions

1. Direction: premise connection, composition, palette roles, typography, diagram grammar, prohibited motifs, difference from recent work.
2. Direction: premise connection, composition, palette roles, typography, diagram grammar, prohibited motifs, difference from recent work.

## Open items and approval

- Blocking item: field, reason, and scopes blocked.
- Deferred item: field, reason, and scopes blocked, if any.
- Author decision and evidence: approve named scope | amend
```

## 5. Handoff after approval

Use the approved record as the editorial source of truth. Persist it with planning material only after approval. Then bind the programme workspace, assemble the source ledger, build the programme architecture, create the canonical session model, and produce the requested surfaces. If a later decision would contradict the record, surface it as an amendment instead of quietly changing the HTML.
