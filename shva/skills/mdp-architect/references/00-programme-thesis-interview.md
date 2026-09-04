# Programme Thesis Interview

Use this reference before designing a new substantial programme or materially
reworking an existing one. The interview establishes what the programme is
trying to change, what claim holds it together, and what learner performance
would count as evidence. It is an editorial production gate, not a
questionnaire and not a Super-outer approval gate.

## 1. Decide whether the gate applies

Run the Programme Thesis Interview when the request involves any of the
following:

- a new substantial programme, course, standalone workshop, workshop series,
  or book-shaped learning journey;
- a major redesign that may change the audience, promise, argument, sequence,
  or carried participant work;
- an inherited syllabus or outline whose fit with present conditions has not
  been examined; or
- an under-specified architecture request for which different reasonable
  interpretations would produce materially different programmes.

Do not restart the gate for a local correction, a single resource, or a new
surface generated from an approved current architecture. Reuse an approved
Programme Thesis Record when its audience, promise, central argument, changed
condition, evidence boundary, and production scope still apply. Name the record
and its approval provenance. If only one field has changed, reopen that field
and its dependants rather than conducting a ceremonial re-interview.

Record that decision explicitly. A new or substantially changed request uses
`complete-interview`; an unfinished current interview uses `continue-interview`;
an unchanged approved record uses `reuse-approved-record`. Reuse is valid only
when `materialChangeDetected` is `false` and the prior approval covers the next
production action.

Before approval, the architect may inspect sources, diagnose the brief, compare
inherited material, and propose alternatives. Do not produce the requested
chapter, slide deck, participant HTML, or other finished surface while a thesis
decision that could materially change it remains open. A deliberately requested
exploratory prototype must be labelled as such, name its unresolved assumptions,
and must not silently become the approved architecture.

An explicit approval in a current brief or record counts; do not ask the author
to approve the same decision twice. A complete but unapproved brief should be
compiled into a proposed record for one compact approval, not expanded into a
generic interview.

## 2. Route books and workshops correctly

Every substantial learning journey needs a defensible programme thesis. Only
book-shaped work also invokes the [Book Foundation Interview](00-book-foundation-interview.md)
when its reader proposition, voice, title system, front matter, or visual
identity is unsettled.

The records answer different questions:

- The **Programme Thesis Record** governs the learning problem, promised
  capability, central question, distinctive argument, evidence boundary,
  progression, and proof.
- The **Book Foundation Record** governs the public reader proposition, book
  architecture, editorial voice, author material, title system, and visual
  identity.

For book-shaped work, reuse answers across the two interviews and combine
conversation rounds where useful, but persist both records. Approval of one
record cannot silently substitute for approval of the other. A workshop should
not be asked about cover art, acknowledgements, title systems, or other book
identity decisions unless the user has also requested a book-shaped public
artifact.

## 3. Inspect before asking

Read the current brief, existing programme files, approved records, source
ledger, prior learner artifacts, and relevant feedback before opening the
interview. When inherited material exists, inspect the actual material rather
than relying on its table of contents or a summary.

Return a provisional diagnosis before asking questions. It should state:

- the subject and scope the evidence appears to support;
- the audience and their likely starting point;
- the problem they already recognise;
- the learner change the programme appears to promise;
- the candidate central question and distinctive argument;
- the condition that has changed, if transformation is relevant;
- what inherited material appears worth preserving, reframing, combining,
  resequencing, adding, or omitting; and
- the smallest remaining uncertainty that would materially change production.

Offer two or three meaningfully different options for each unresolved choice,
mark one as recommended, and explain its consequence. Ask no more than three
questions in a turn. Do not send a blank survey, ask for information already in
the evidence, or translate ordinary decisions into CLO/PLO or accreditation
jargon unless that vocabulary is itself a required deliverable.

Keep a running status for every material field:

- **confirmed**: explicitly approved in the current scope;
- **source-grounded**: supported by inspected, attributable evidence;
- **author-supplied**: supplied from experience or preference but not
  independently verified;
- **proposed**: a reasoned candidate awaiting a decision; and
- **open**: unresolved and consequential to the next production action.

## 4. Run only the rounds the evidence requires

The fields are required; the number of conversational rounds is not. Combine
settled fields and skip questions whose answers are already current and
approved.

### Round A: problem, learner, and promise

Establish the subject boundary, intended audience, assumed starting point, and
the situation in which the audience recognises the problem. Define the promised
change as something the learner will be able to notice, decide, build, explain,
or do differently—not a list of topics they will have encountered.

Set one central question with a decision or capability at stake. Record the
programme's exclusions and anti-goals at the same time so an attractive adjacent
topic cannot quietly widen the programme.

### Round B: argument, changed condition, and evidence

State the programme owner's distinctive argument in complete causal language.
It must explain why the recognised problem persists and how the proposed learner
change addresses it. A broad theme, fashionable vocabulary, or a catalogue of
sources is not an argument.

Identify any changed condition that makes the programme newly necessary. The
condition may be technological, institutional, social, economic, regulatory,
or absent. Do not insert AI merely because the programme is contemporary. When
AI is genuinely material, identify which mechanism has changed—representation,
prediction, coordination, execution, monitoring, memory, or agency—and what
observable consequence follows. Avoid generic claims that AI has transformed
everything or will inevitably do so.

Classify the evidence supporting every load-bearing claim:

| Evidence class | Permitted use |
| --- | --- |
| `established_external` | A claim supported by a traceable external source. Verify it to the standard required by the artifact before presenting it as fact. |
| `author_experience_or_teaching_observation` | A bounded observation from the programme owner's practice. Attribute and scope it; do not present it as population evidence. |
| `author_synthesis` | A new connection or model made from named inputs. Make the reasoning visible and distinguish it from the sources it combines. |
| `open_hypothesis` | A proposition still requiring evidence or testing. Preserve the uncertainty and state what would strengthen, weaken, or falsify it. |

An anecdote may open a question or illustrate a mechanism; it does not become
general evidence through confident prose. Record what is known, what remains
uncertain, and what the programme will not claim. Give each evidence boundary a
stable ID and reference it from the thesis claim, audit item, or public
contribution it supports. A label without a traceable basis is not an evidence
boundary.

The class determines the required basis. `established_external` needs an
HTTP(S) source URL, source title, and an exact section, page, or passage locator.
`author_experience_or_teaching_observation` needs the observer or attribution,
context, and scope. `author_synthesis` references the evidence IDs it combines
and states the new inference. `open_hypothesis` states what would falsify it. If
an approved production scope depends on an open hypothesis being treated as
settled fact, that scope remains blocked.

### Round C: lineage and transformation

When a prior syllabus, outline, book, or programme exists, audit its teaching
function before rebuilding the sequence. The purpose is to preserve useful
lineage without granting the old structure veto power over the new programme.

Classify the lens **what remains necessary while its form changes?** as one of:

- **Central**: the programme's governing argument depends on distinguishing an
  enduring requirement from a changing form.
- **Supporting**: the distinction clarifies part of the programme but should not
  organise the entire journey.
- **Not applicable**: the learning problem is greenfield or does not depend on
  a transformation claim. State why, and do not force an old-form/new-form
  narrative into the architecture.

The classification requires a reason. It is not a maturity score: `Central` is
not better than `Supporting`, and `Not applicable` is a valid positive result.
An existing outline still receives a lineage audit even when the transformation
lens is not applicable. Give `reason` a specific explanation, keep
`governingQuestion` as an empty string, and keep `changedMechanisms` empty; do
not fill substantive fields with the phrase “not applicable.”

When inherited material is present, create one audit entry for every inherited
item considered and every material addition proposed alongside it. The entry
shape follows its disposition rather than forcing an invented history or
destination. A genuinely greenfield programme has no inherited-item audit; its
new contributions are designed after the thesis is approved:

| Field | Requirement |
| --- | --- |
| `id` | A stable reference for the audit decision. |
| `sourceItemIds` | Present only for inherited dispositions: exactly one source ID for `preserve`, `reframe`, `resequence`, or `omit`; at least two for `combine`. Omit this field for `add`. |
| `sourceConceptOrQuestion` | Required for inherited dispositions; omit it for `add`. |
| `newContribution` | Required only for `add`; states what is being introduced and why it was absent from the inherited material. |
| `originalPurpose` | Required for inherited dispositions; omit it for `add`. |
| `enduringRequirementOrFunction` | Required for inherited dispositions; omit it for `add`. |
| `inheritedForm` | Required for inherited dispositions; omit it for `add`. |
| `changedCondition` | The material condition that alters relevance or form. Required for every disposition, including when the reason is that no external condition changed. |
| `authorClaimOrSynthesis` | The programme owner's proposed interpretation, classified by evidence type. |
| `disposition` | Exactly one of `preserve`, `reframe`, `combine`, `resequence`, `add`, or `omit`. |
| `dispositionReason` | Why this treatment better serves the programme thesis than the plausible alternatives. |
| `programmeFit` | Whether and how the item supports the recognised problem, promise, and central argument. |
| `evidenceStatus` | The declared evidence class; it must match the referenced evidence-boundary entry. |
| `evidenceBoundaryId` | Stable reference to the evidence-boundary entry that supplies the class, basis, scope, and residual uncertainty. |
| `destination` | Where the item enters the programme; required except for `omit`. |
| `learnerMove` and `artifactProof` | Required except for `omit`; what the learner does and what observable change demonstrates it. |
| `omissionConsequence` | Required only for `omit`; states what the programme deliberately gives up or relocates by leaving the item out. |

`Preserve` is not a reward for age, and `omit` is not evidence of innovation.
Do not preserve every inherited heading ceremonially or reinvent the programme
merely to appear current. For retained or added work, the reason, learner move,
and proof determine the disposition. For omitted work, the reason and explicit
omission consequence make the trade-off inspectable.

### Round D: carried proof and capability progression

Work backward from the promised learner change. Select either a carried artifact
that gains useful layers across the programme or an observable performance that
can be examined repeatedly. Define its initial state, final state, and the
evidence that would show improvement.

Then sketch the capability progression. Each stage must name:

- the new move the learner can make;
- the proof added to the artifact or performance;
- the dependency created for the next stage; and
- the unresolved question handed forward.

This is not yet a session catalogue. If the stages can be freely reordered
without changing the learner's work, the progression is thematic rather than
causal and needs revision. Programme architecture and sessions are built only
after this progression is coherent.

Record an intended public contribution only when the programme is meant to make
one. Internal capability building does not need a thought-leadership claim. A
public contribution must say what the work adds, for whom, and whether it is
established knowledge, author synthesis, or an open hypothesis.

### Round E: open decisions and approval

Return a compact Programme Thesis Record. For each unresolved decision, name the
real alternatives, the production consequence, and the exact scope it blocks.
Set `productionDecision.state` to `stop` whenever a blocking decision remains;
name the allowed next action rather than stopping all useful work. Set it to
`proceed` only when the requested next action is inside the approved scope.

End with the plain editorial question: **Approve this Programme Thesis Record
for the named scope, or amend it?** Do not use Super-outer approval syntax.

## 5. Programme Thesis Record contract

Persist the approved record with the programme planning material. Use these
field names when the record is stored as JSON so it can be validated and handed
forward without reinterpretation:

```json
{
  "schemaVersion": "1.0",
  "recordId": "stable-programme-thesis-id",
  "trigger": {
    "kind": "new-substantial-programme | major-redesign | under-specified-architecture | approved-record-reuse",
    "reason": "Why this gate applies",
    "inspectedEvidence": ["Brief, source, prior record, or artifact actually inspected"],
    "reusedRecord": null,
    "materialChangeDetected": true,
    "interviewAction": "complete-interview | continue-interview | reuse-approved-record"
  },
  "programme": {
    "subject": "Subject boundary",
    "scope": "Exact programme and production boundary",
    "format": "book | workshop | course | programme",
    "audience": "Intended learners",
    "startingPoint": "What they already know and can do"
  },
  "thesis": {
    "recognisedProblem": "A situation the audience recognises",
    "promisedLearnerChangeId": "stable-learner-change-id",
    "promisedLearnerChange": "An observable change in learner capability",
    "centralQuestion": "One programme-level question with a decision at stake",
    "distinctiveArgument": "The programme owner's causal argument",
    "argumentBoundary": "What the argument does not claim",
    "recognisedProblemEvidenceId": "evidence-recognised-problem",
    "changedCondition": "Material changed condition, or none with a reason",
    "changedConditionEvidenceId": "evidence-changed-condition",
    "distinctiveArgumentEvidenceId": "evidence-distinctive-argument"
  },
  "inheritedMaterial": {
    "present": true,
    "sources": [
      {
        "id": "stable-inherited-source-id",
        "label": "Named inherited syllabus, outline, programme, or body of knowledge"
      }
    ],
    "audit": [
      {
        "id": "stable-audit-item-id",
        "sourceItemIds": ["stable-inherited-source-id"],
        "sourceConceptOrQuestion": "Inherited concept or question",
        "originalPurpose": "Original learning function",
        "enduringRequirementOrFunction": "What remains necessary independent of form",
        "inheritedForm": "Prior teaching or organisational form",
        "changedCondition": "Condition affecting present fit",
        "authorClaimOrSynthesis": "Proposed interpretation and evidence class",
        "disposition": "preserve | reframe | combine | resequence | add | omit",
        "dispositionReason": "Why",
        "programmeFit": "Connection to problem, promise, and argument",
        "evidenceStatus": "established_external | author_experience_or_teaching_observation | author_synthesis | open_hypothesis",
        "evidenceBoundaryId": "stable-evidence-boundary-id",
        "destination": "Programme destination",
        "learnerMove": "What the learner does",
        "artifactProof": "What observable change proves the move"
      }
    ]
  },
  "transformationLens": {
    "applicability": "Central | Supporting | Not applicable",
    "reason": "Why this classification fits",
    "governingQuestion": "What remains necessary while its form changes; empty when not applicable",
    "changedMechanisms": ["representation | prediction | coordination | execution | monitoring | memory | agency"]
  },
  "evidenceBoundaries": [
    {
      "id": "stable-evidence-boundary-id",
      "claim": "Load-bearing claim",
      "evidenceClass": "established_external",
      "sourceUrl": "https://authoritative.example/source",
      "sourceTitle": "Source title",
      "locator": "Exact section, page, or passage",
      "known": "What the evidence supports",
      "uncertain": "What remains uncertain",
      "allowedUse": "How strongly the programme may state or use the claim"
    }
  ],
  "carriedProof": {
    "carriedProofId": "stable-carried-proof-id",
    "supportsLearnerChangeId": "stable-learner-change-id",
    "successEvidenceId": "stable-final-proof-id",
    "type": "A descriptive multiword proof type, such as progressive decision record",
    "name": "Named proof carried through the programme",
    "initialState": "What exists at entry",
    "finalState": "What should exist at completion",
    "successEvidence": "What would show the promised learner change"
  },
  "capabilityProgression": [
    {
      "stageId": "stable-capability-stage-id",
      "stage": "Ordered stage",
      "learnerChangeId": "stable-stage-change-id",
      "learnerMove": "New capability exercised",
      "proofId": "stable-stage-proof-id",
      "proofAdded": "Observable artifact or performance change",
      "handoff": "Dependency and unresolved question carried forward"
    }
  ],
  "publicContribution": {
    "intended": false,
    "claim": "",
    "audience": "",
    "evidenceBoundaryId": null
  },
  "exclusions": {
    "outOfScope": ["Adjacent topics or claims excluded"],
    "antiGoals": ["Registers, outcomes, or designs the programme must avoid"]
  },
  "openDecisions": [
    {
      "decision": "Unresolved material choice",
      "options": ["Meaningful alternatives"],
      "productionConsequence": "What changes depending on the choice",
      "blockingScopes": ["Exact next actions blocked"]
    }
  ],
  "approval": {
    "status": "draft | approved",
    "scope": ["architecture | session-production | artifact-production | full"],
    "approvedBy": null,
    "approvedAt": null,
    "provenance": null
  },
  "productionDecision": {
    "state": "stop | proceed",
    "nextAction": "Next action permitted by the record",
    "blockedBy": ["Exact open decision text, or empty when proceeding"],
    "bookFoundation": {
      "required": false,
      "status": "approved | required | not-applicable",
      "record": "Approved Book Foundation stable record ID, or empty"
    }
  }
}
```

For a greenfield programme, set `inheritedMaterial.present` to `false` and keep
both `sources` and `audit` empty. Do not manufacture an inherited-item audit for
material that did not exist. When an inherited audit is present, an `add` entry
uses a substantive `newContribution` and no inherited-source fields; an `omit`
entry has no destination, learner move, or artifact proof and instead names the
`omissionConsequence`; and a `combine` entry references at least two source
items. For an approved reused record, use
`trigger.kind: approved-record-reuse`, set `reusedRecord` to its stable record
identifier (the same value as the record's own `recordId`), set
`materialChangeDetected` to `false`, select
`reuse-approved-record`, and preserve its approval provenance.

For `transformationLens.applicability: Not applicable`, keep both
`governingQuestion` and `changedMechanisms` empty. For the other two values, the
governing question is required; include only changed mechanisms that are
material to the thesis. Do not use the mechanism list as a topical checklist.

Every thesis evidence ID, audit `evidenceBoundaryId`, and an intended public
contribution's `evidenceBoundaryId` must resolve to exactly one
evidence-boundary entry. Evidence entries use a discriminated shape:
`established_external` adds `sourceUrl`, `sourceTitle`, and `locator`;
`author_experience_or_teaching_observation` adds `attribution` and
`observedScope`; `author_synthesis` adds `inputClaimIds`; and
`open_hypothesis` adds `falsificationCondition` and `dependentScopes`. Do not
include fields from another class as empty ceremony. A load-bearing open
hypothesis blocks every requested scope named in `dependentScopes`, including
when a synthesis depends on it indirectly. The validator does not require a
duplicate open-decision entry merely to repeat that epistemic boundary.

The final capability-progression entry closes the contract by setting
`learnerChangeId` to `thesis.promisedLearnerChangeId` and `proofId` to
`carriedProof.successEvidenceId`. `carriedProof.supportsLearnerChangeId` also
references that promised change. The final `learnerMove` and `proofAdded` should
explain the stage in their own useful language; do not copy proposition prose
into an assessment field merely to satisfy a string comparison.

Approval scopes are `architecture`, `session-production`,
`artifact-production`, and `full`. A book requires a separately approved Book
Foundation Record before production may proceed. For a workshop, course, or
programme, set `bookFoundation.required` to `false` and its status to
`not-applicable`; do not manufacture a book gate. Proposed or under-specified
records stop. A current approved record with no material change proceeds within
its named scope without another interview. When production stops,
`productionDecision.blockedBy` repeats the exact `decision` text from each
blocking `openDecisions` entry; it does not point to an invented identifier.

Validate the record for the exact next production scope:

```bash
node "$SKILL_DIR/scripts/validate-programme-thesis.mjs" <programme-thesis-record.json> architecture
node "$SKILL_DIR/scripts/validate-programme-thesis.mjs" <programme-thesis-record.json> session-production
node "$SKILL_DIR/scripts/validate-programme-thesis.mjs" <programme-thesis-record.json> artifact-production
node "$SKILL_DIR/scripts/validate-programme-thesis.mjs" <programme-thesis-record.json> full
```

If the scope argument is omitted, the validator checks `full`. A record may
therefore pass architecture and correctly fail artifact production until the
remaining decisions for that broader scope are approved.

## 6. Completion and handoff

The record is ready only when:

- the recognised problem, promised change, central question, and distinctive
  argument form one causal proposition;
- the argument's evidence classes and uncertainty boundaries are explicit;
- the transformation lens has a reason and does not force AI or an inherited
  form into an unrelated subject;
- inherited items have defensible dispositions rather than ceremonial survival
  or novelty;
- the carried proof could show the promised learner change;
- the capability progression is ordered by dependency rather than topics;
- open decisions name their production consequences; and
- approval provenance and the production decision agree;
- a `proceed` decision has no blocking open decision and is contained by an
  approved scope; and
- book-shaped work has a separately approved Book Foundation Record, while
  other formats do not inherit book-only questions.

After approval, hand the record to [Programme Architecture](01-programme-architecture.md).
That stage turns the progression into a linked programme spine. If a later
choice contradicts the approved thesis, amend the record and re-open only the
affected scope instead of quietly changing the session model or visible
artifact.
