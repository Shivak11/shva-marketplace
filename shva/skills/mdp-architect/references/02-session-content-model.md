# Session Content Model

## Create one canonical model first

Store the session once before writing Book Chapter, Teaching Script, or Slide Content. Use stable IDs for every shared item. Render surfaces from those IDs. Do not write three independent versions and attempt to reconcile them later.

Copy `fixtures/who-owns-the-exception.valid.json` as the starting contract. The validator reads JSON, and the fixture shows every required field and exact classification value. The fixture demonstrates the schema; it is not a content template and its case should be replaced.

Set `programme.officialSessionMinutes`, `programme.preparedRunwayMinutes`, and `programme.planningProfile` from the approved brief and author profile. The planning profile carries the narrative-word range, maximum headings, pull lines, body callout cards, substantive visuals, and minimum facilitation segments. These limits are explicit configuration, not hidden assumptions in a supposedly neutral engine. Declared counts remain planning checks; the rendered artifact must be counted independently.

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

Every block declares `requiredAcrossSurfaces`. The validator owns the rule for core block types: disturbance, sustained case, claim, mechanism, commitment, AI challenge, revision, exercise, and transition must be true and must appear in Book, Teaching, and Slides. Only supporting material such as a bounded lateral example may be declared optional. An `exercise-case` becomes required across surfaces when an exercise uses it. Surface omission is allowed for genuinely supporting material; surface invention is not.

## Causal Hinge Ledger

Store three hinges under `session.narrativeHinges`:

| Hinge | What it proves |
| --- | --- |
| `sceneToConcept` | The concrete object, consequence, or unresolved question that makes the first concept necessary. |
| `conceptToFramework` | The prose relation the reader can already explain before a diagram or framework name appears. |
| `chapterToExercise` | The chapter's culminating problem and the first participant action that answers, tests, or operationalises it. |

Each hinge contains `fromBlockId`, `toBlockId`, a substantive `bridge`, the `unresolvedConsequence`, and the `nextMove` enabled by the destination block. The validator type-constrains the endpoints—disturbance or case to claim, case or claim to mechanism, and culminating claim, mechanism, or revision to exercise—and requires both endpoints in Book order. This prevents arbitrary IDs and one-word transitions from passing. The straight-through editorial review still decides whether the prose genuinely carries the causal relation.

`session.terms` is always present. For every specialist term a general reader may not know, add an entry:

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

If the audit finds no new specialist term, leave the array empty and state why in `session.termAudit.noNewTermsReason`. Omitting the register entirely is not a clean bill of health.

## Cases, examples, and comparisons

The sustained `case` block records:

- `decision`, `actors`, `stakes`, `constraint`, and `incompleteEvidence`;
- `evidenceBoundary`, including what public sources do not establish;
- `returnPoints`, each with `afterBlockId`, `purpose`, and `newCausalWork`.

A return point must change what the reader can see in the case. A naked return count or a repeated phrase such as “return to the case” proves nothing.

Every `lateral-example` records `conceptualJob`, `mechanism`, `boundary`, and `returnToHumanProblem`. If its `sourceClass` is `source-backed`, it also records the unfamiliar verified fact it earns and the source ledger identifies the exact supported facts.

`session.evidenceComparisons` is always present. When a chapter compares evidence paths, store an item:

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

If the chapter makes no evidence-path comparison, leave the array empty and state the reason in `session.comparisonAudit.noComparisonNeededReason`.

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

`visualJob` must name the relation made easier to see, and `proseRemoved` must identify the prose the image genuinely replaces. “Looks good,” “none,” and equivalent declarations fail. The model never requires a diagram merely because a mechanism exists, and DOM inspection—not the declared array—proves the final count and geometry.

## Decision-Closure Contract

Every exercise binds to the chapter rather than merely sitting after it. Record:

- `caseMode`: `sustained-case` or `transfer-case`;
- `exerciseCaseBlockId` and `mechanismBlockId`;
- `chapterConnection.fromBlockId`, `unresolvedConsequence`, `firstParticipantAction`, and `mechanismUsed`;
- `decisionFork.question` and two to four options, each with a stable ID, action, and accepted consequence;
- `steps`, each with a stable ID, prompt, observable output, and the participant fields it writes; every participant field must be written by at least one step;
- `participantFields`, in display order;
- commitment, AI-challenge, and revision block IDs;
- `consequenceReveal.present`: whether changed information drives this exercise;
- when present, `consequenceReveal`: its reveal and consequence-revision semantic block IDs, proper required-field subset, minimum attempt length, trigger and immediately following revision steps, revealed fact, provenance, and decision consequence; each typed reveal or consequence-revision block belongs to exactly one exercise;
- when absent, `consequenceReveal.notUsedReason`: why the exercise does not need changed information rather than a manufactured twist;
- `filledEditionReveal`: the later declared input gate, every participant field in display order, minimum attempt length, control label, initial closed state, field-binding attribute, and browser-proof requirement;
- `filledEdition.fields`, using exactly the same field IDs and order;
- `filledEdition.completeness`: actors, live alternative, evidence discriminator, authority boundary, executable action, revision condition, and appeal or challenge route;
- `transferPrompt` and `debriefQuestion`.

When a field is genuinely irrelevant, the filled edition states why; it does not leave the field blank. The validator rejects short placeholder answers, but a human exercise read still judges realism and density.

A game records at least two visible states, an initial state, and for every choice a `fromStateId`, `toStateId`, state delta, consequence, and next-choice IDs. Every state is reachable; every named next choice begins from the state just reached and the list equals what is available there. At least one reachable state offers two consequential choices leading to different states, so the learner can choose a route rather than advance through a forced sequence. Its replay rule says what resets, what learner evidence remains, and what changes on another run. A pair of booleans claiming that choice changes state is not a game contract. If the learning lives mainly in explanatory copy after a tap, use a workbook.

## Required sequence

Use this order unless the brief gives a reason to depart from it:

1. Disturbance: let the organisation fail or hesitate in view of the reader.
2. First reading: make the plausible but incomplete explanation visible.
3. Mechanism: earn the causal relation from the tension in the case.
4. Participant commitment: ask the room to make a traceable move.
5. Consequence reveal, when changed information drives the exercise: disclose it after only the minimum writable field subset.
6. Consequence-led revision: require the learner to retain or change the first move before AI enters.
7. AI challenge: use AI to test the revised human judgment, not make it.
8. Final revision: show what changed, what did not, and who still authorises action.
9. Filled-edition comparison: reveal the same artifact only after all comparison fields contain meaningful attempts.
10. Transfer and transition: apply the changed model elsewhere and leave a causally unresolved consequence.

Encode the sequence. Each teaching core segment and slide beat carries ordered `semanticBlockIds`, and their first-use order must exactly match the parent Teaching or Slide surface order. Each exercise names its commitment, AI-challenge, and final-revision blocks. An exercise with a consequence reveal also names required-across-surfaces reveal and consequence-revision blocks; every surface preserves commitment → reveal → immediate human revision → AI challenge → final revision. Without changed information, every surface preserves commitment → AI challenge → revision and the model records why the early reveal is absent.

## Source ledger

Every semantic block has one matching source-ledger entry with `origin`, `sourceType`, `presentationStatus`, `checkedOn`, `confidence`, `surfaces`, `supportedFacts`, `teachingInference`, and `factualBoundary`. Evidence classification and presentation status are separate. The latter records direct, normalised, paraphrased, reconstructed, counterfactual, composite, or author-synthesis treatment. A `source-backed` entry includes a non-placeholder live URL, source title, locator, and at least one fact-level support statement. A reconstructed scene requires the same source coordinates. A counterfactual names the claim IDs it is built from. A `still-to-confirm` item may remain internal but cannot appear in a visible surface.

The ledger's surfaces must exactly match visible use. A URL beside a paragraph does not support every clause in it; `supportedFacts` records the exact factual load the source carries. The validator can reject an empty or placeholder mapping. A source-boundary reviewer must still open the source and compare those facts with the final prose.

## Completion check

The model is ready only when every visible claim, term, case detail, comparison, visual, exercise step, filled-edition field, and transition has an ID and source boundary. Run the validator, then perform the experienced-artifact checks in `05-verification-gates.md`. JSON structure can prevent drift; it cannot certify narrative quality by declaration.
