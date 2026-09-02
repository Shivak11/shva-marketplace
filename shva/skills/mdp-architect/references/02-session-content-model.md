# Session Content Model

## Create one canonical model first

Store the session once before writing Book Chapter, Teaching Script, or Slide Content. Use stable IDs for every shared item. Render surfaces from those IDs. Do not write three independent versions and attempt to reconcile them later.

Copy `fixtures/who-owns-the-exception.valid.json` as the starting schema. The validator reads JSON, and the fixture shows every required field and exact classification value.

## Required blocks

| Block | Required content |
| --- | --- |
| `session` | Title, audience, official duration, central question, carried artifact, and next session handoff. |
| `disturbance` | A concrete opening scene and the decision that cannot wait. |
| `case` | One sustained case: actors, stakes, constraint, evidence, first wrong move, three return points. |
| `claim` | Plain language claim, source classification, citation or note, and the surfaces that use it. |
| `mechanism` | One earned framework or inline diagram with exact labels and an explanation tied to the case. |
| `commitment` | What participants map, choose, rank, or write before AI appears. |
| `ai_challenge` | A bounded prompt or model challenge that tests an interpretation, threshold, evidence boundary, or alternative. It never certifies a people decision. |
| `revision` | How the participant changes the carried artifact after the challenge. |
| `exercise` | Instructions, constraints, output, debrief question, and a complete filled edition behind a reveal control. |
| `transition` | The unresolved question and artifact state passed to the next session. |

## Required sequence

Use this order unless the brief gives a reason to depart from it:

1. Disturbance: let the organization fail or hesitate in view of the reader.
2. First reading: make the plausible but incomplete explanation visible.
3. Mechanism: earn the framework from the tension in the case.
4. Participant commitment: ask the room to make a traceable move.
5. AI challenge: use AI to test the committed move, not to make it for them.
6. Revision: show what changed, what did not, and who still authorizes action.
7. Workbook: let the participant apply the same mechanism to their own decision.
8. Transition: open the next session's problem without a closing sermon.

## Case and emphasis controls

- Keep one sustained case in the foreground. A second full case is a redesign request, not an illustration.
- Use at most one short lateral example. It must return the reader to the sustained case within the same section.
- Give the session at most two memorable lines. Each line must do conceptual work and must not be repeated as a label, card, and slide title.
- Use bold labels, pull lines, cards, and diagrams sparingly. If every beat is emphasized, none is.
- Do not introduce a mechanism before a reader can name the failure it corrects.

## Example model fragment

```json
{
  "id": "signal-is-not-a-decision",
  "type": "claim",
  "text": "A signal tells the organization that something changed. A commitment tells people what happens next.",
  "sourceClass": "teaching-synthesis"
}
```

## Content model completion check

The model is ready only when every visible claim, term, case detail, diagram label, exercise step, and transition has an ID and source classification. An item that exists only in a surface is drift until it is added to the model or removed.
