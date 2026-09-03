# Session Content Model

## Create one canonical model first

Store the session once before writing Book Chapter, Teaching Script, or Slide Content. Use stable IDs for every shared item. Render surfaces from those IDs. Do not write three independent versions and attempt to reconcile them later.

Copy `fixtures/who-owns-the-exception.valid.json` as the starting contract. The validator reads JSON, and the fixture shows every required field and exact classification value. The fixture demonstrates the schema; it is not a content template and its case should be replaced.

## Separate the readers

The model must distinguish:

- `session.bookReader`: who can buy or encounter the Book without the facilitator;
- `session.participantAudience`: who attends the teaching session;
- `session.assumedKnowledge.book`: what the Book may safely assume;
- `session.assumedKnowledge.teaching`: what the facilitator may safely assume or establish live.

A source cohort can be function-specific while the Book addresses a general reader. Do not let a CHRO, banking, manufacturing, or academic cohort narrow the public prose by accident.

## Required semantic blocks

| Block | Required content |
| --- | --- |
| `disturbance` | A concrete opening situation and the decision or consequence that makes it matter. |
| `case` | One sustained case with actors, stakes, constraint, incomplete evidence, evidence boundary, decision, and purposeful return points. |
| `claim` | Plain-language claim, source classification, and surfaces that use it. |
| `lateral-example` | Optional bounded example with a distinct conceptual job, mechanism, factual status, boundary, and explicit return to the human or organisational question. |
| `exercise-case` | Optional common transfer case used only by the exercise when it lowers setup cost and tests the same mechanism. |
| `mechanism` | One earned causal relation. A branded label is optional, never required. |
| `commitment` | What participants map, choose, rank, allocate, or write before AI or a filled edition appears. |
| `ai-challenge` | A bounded challenge that tests interpretation, threshold, evidence boundary, or alternative. It never makes or authorises the decision. |
| `revision` | How the participant retains, rejects, or changes the committed artifact and why. |
| `exercise` | Starting material, ordered steps, decision boundary, output, comparison, transfer, and debrief. |
| `transition` | The unresolved consequence and artifact state passed onward without a meta announcement. |

Every block declares `requiredAcrossSurfaces`. Blocks marked true must appear in Book, Teaching, and Slides. Other blocks may appear only in the surfaces named by the source ledger. Surface omission is allowed; surface invention is not.

## Causal Hinge Ledger

Store three hinges under `session.narrativeHinges`:

| Hinge | What it proves |
| --- | --- |
| `sceneToConcept` | The concrete object, consequence, or unresolved question that makes the first concept necessary. |
| `conceptToFramework` | The prose relation the reader can already explain before a diagram or framework name appears. |
| `chapterToExercise` | The chapter's culminating problem and the first participant action that answers, tests, or operationalises it. |

Each hinge contains `fromBlockId`, `toBlockId`, and a non-empty `bridge`. The validator checks order; the straight-through editorial review checks whether the bridge is real rather than a label.

For every specialist term a general reader may not know, add an entry to `session.terms`:

```json
{
  "term": "provenance",
  "problemBlockId": "case-record-history",
  "definitionBlockId": "claim-provenance",
  "plainDefinition": "the history of where a record came from and how it changed",
  "nearestDistinction": "not the same as whether the final number is accurate",
  "reuseBlockId": "mechanism-evidence-path"
}
```

The problem must appear before the definition, and the definition before consequential reuse, in every surface that uses all three blocks. Professional nouns such as a ship's master, bridge, draught, band, model label, or operating review belong in this register when the Book reader may not know them.

## Cases, examples, and comparisons

The sustained `case` block records:

- `decision`, `actors`, `stakes`, `constraint`, and `incompleteEvidence`;
- `evidenceBoundary`, including what public sources do not establish;
- `returnPoints`, each with `afterBlockId`, `purpose`, and `newCausalWork`.

A return point must change what the reader can see in the case. A naked return count or a repeated phrase such as “return to the case” proves nothing.

Every `lateral-example` records `conceptualJob`, `mechanism`, `boundary`, and `returnToHumanProblem`. If its `sourceClass` is `source-backed`, it also records the unfamiliar verified fact it earns and the source ledger identifies the exact supported facts.

When a chapter compares evidence paths, store an item in `session.evidenceComparisons`:

```json
{
  "leftBlockId": "case-reporting-omission",
  "rightBlockId": "lateral-process-trace",
  "commonProblem": "both records were altered before analysis began",
  "differentMechanisms": "one omitted a relevant signal; the other acquired a process trace",
  "decisionConsequence": "speed cannot decide whether either record is fit for action"
}
```

This prevents a comparison from turning omission, measurement change, process trace, and model error into one vague “data quality” problem.

## Visual contract

Store zero to two substantive visuals in `surfaces.book.visuals`. Cover art and ordinary form controls do not count. Editorial illustrations, diagrams, data graphics, and exercise maps do.

Each visual records:

- `id` and `kind`;
- `semanticBlockId` whose relation it explains;
- `visualJob`;
- `proseRemoved`;
- `appearsAfterBlockId`;
- `reusedInBlockId`;
- `sourceStatus` and, for a reconstruction, `chronologyNote`.

The model never requires a diagram merely because a mechanism exists.

## Decision-Closure Contract

Every exercise binds to the chapter rather than merely sitting after it. Record:

- `caseMode`: `sustained-case` or `transfer-case`;
- `exerciseCaseBlockId` and `mechanismBlockId`;
- `chapterConnection` and `decisionFork`;
- `steps`, each with a stable ID, prompt, and observable output;
- `participantFields`, in display order;
- commitment, AI-challenge, and revision block IDs;
- `revealGate.requiresParticipantInput` and the required field IDs;
- `filledEdition.fields`, using exactly the same field IDs and order;
- `filledEdition.completeness`: actors, live alternative, evidence discriminator, authority boundary, executable action, revision condition, and appeal or challenge route;
- `transferPrompt` and `debriefQuestion`.

When a field is genuinely irrelevant, the filled edition states why; it does not leave the field blank. A game may add score and state transitions, but its choices must change visible state, each consequence must explain why, and a reveal must alter the next choice. If the learning lives mainly in explanatory copy after a tap, use a workbook.

## Required sequence

Use this order unless the brief gives a reason to depart from it:

1. Disturbance: let the organisation fail or hesitate in view of the reader.
2. First reading: make the plausible but incomplete explanation visible.
3. Mechanism: earn the causal relation from the tension in the case.
4. Participant commitment: ask the room to make a traceable move.
5. AI challenge: use AI to test the committed move, not make it.
6. Revision: show what changed, what did not, and who still authorises action.
7. Filled-edition comparison: reveal the same artifact only after required input exists.
8. Transfer and transition: apply the changed model elsewhere and leave a causally unresolved consequence.

Encode the sequence. Each teaching core segment and slide beat carries ordered `semanticBlockIds`. Each exercise names its commitment, AI-challenge, and revision blocks. Every surface containing those blocks preserves their order.

## Source ledger

Every semantic block has one matching source-ledger entry with `origin`, `sourceType`, `checkedOn`, `confidence`, `surfaces`, `supportedFacts`, `teachingInference`, and `factualBoundary`. A `source-backed` entry includes its live URL. A `still-to-confirm` item may remain internal but cannot appear in a visible surface.

The ledger's surfaces must exactly match visible use. A URL beside a paragraph does not support every clause in it; `supportedFacts` records the exact factual load the source carries.

## Completion check

The model is ready only when every visible claim, term, case detail, comparison, visual, exercise step, filled-edition field, and transition has an ID and source boundary. Run the validator, then perform the experienced-artifact checks in `05-verification-gates.md`. JSON structure can prevent drift; it cannot certify narrative quality by declaration.
