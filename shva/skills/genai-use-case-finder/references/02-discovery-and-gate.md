# 02 - Discovery and the Gate (Stages 2 and 3)

This reference is how you actually run MAP and GATE on the user's organization. The full method is in `references/00-method.md`. This file is the practitioner's version: what to do, in order, with a worked example to copy.

---

## Stage 2: MAP, run both lenses

### Lens A (Stream)

Take the value stream the user gave you (5 to 9 steps). For each step, write a one-line tag in three parts:

1. Cognitive work: generate, retrieve, classify, summarize, or decide.
2. Cost driver: time, expertise, error, or wait.
3. Workaround flag: is this step here only because information was missing? (a queue, a batch, a handoff, a specialist sign-off).

Then list the point candidates: for any step that is cognitively expensive or works fine but is slow, name the use case that makes it faster, cheaper, or more consistent. Aim for 3 to 6 point candidates.

### Lens B (Decision, "Flip It Around")

Now ignore the stream entirely. Take the decisions you pinned in intake. For each, ask: if prediction and drafting were free and instant, would we ever build the process this way? Start from the decision and a blank slate. Name the redesign that deletes steps. Aim for 1 to 3 system candidates.

Lens B is the discipline most teams skip. If you only produced point candidates, you have not run Lens B properly. Force at least one blank-slate redesign even if it feels uncomfortable, because the uncomfortable one is usually the real prize.

### The first signal

Tag each candidate by which lens surfaced it. Lens A points to point. Lens B points to system. This is a guess, not the verdict. The Gate decides.

---

## Stage 3: GATE every candidate

Run the five-question tell on each candidate. Record the yes count and the verdict.

| # | Question | A "yes" points to system |
|---|---|---|
| 1 | If AI did this perfectly, would the artifact this step produces still need to exist? | The output was a workaround AI just removed |
| 2 | Do the handoffs exist because of communication, search, or coordination cost? | Those costs and roles are about to vanish |
| 3 | Is the bottleneck generation, retrieval, classification, or summarization? | The bottleneck is moving to judgment, verification, or trust |
| 4 | Is the decision-maker's authority based on having seen all the inputs? | AI now sees more, faster |
| 5 | Is the output consumed by the next step, or by a human reading a document? | A human reads a doc, so AI can too |

Verdict by count: 0 to 1 = point, 2 = pilot, 3 or more = system.

Two rules to apply as you gate:

- For a point candidate, you may now decompose it into tasks VSM-style. Task decomposition is for after the gate, never before.
- For a system candidate, do not decompose the old stream. Redesign around the decision. Decomposing harder just paves the cowpath.

Note for the final write-up: the constraint moves, so state that the Gate should be re-run after each win. A candidate that gates as point today can gate as system once the first bottleneck clears.

---

## Per-industry proof strip (use to sanity-check your candidates)

If your candidate list for the user's industry looks nothing like the matching row, you have probably missed a lens.

| Industry | Process | Lens A point candidate | Lens B system candidate | Risk veto | Verifiability read |
|---|---|---|---|---|---|
| Insurance | Claims | Summarize reports, draft denial letter | Straight-through processing for low-risk claims | Adverse-action and discrimination law | Denial letter cheap, fraud score expensive |
| Finance | Month-end close | Draft variance commentary, classify entries | Continuous close in real time | Audit trail, SOX, materiality | Reconciliation cheap, forecast narrative expensive |
| Customer service | Complaint escalation | Draft reply, triage by intent | Deflect and resolve within bounded policy | Tone or brand harm, regulated advice | Policy-cited answer cheap, tone judgment expensive |
| Manufacturing | Field service or warranty | Summarize fault logs, draft work order | Predict and dispatch before the failure call | Safety-critical action, warranty fraud | Part-match cheap, root-cause hypothesis expensive |
| HR | Hiring or separation | JD-to-evidence sheet, draft offers | Continuous candidate-signal model | Data protection law, labour law, bias | Policy answer cheap, culture-fit score expensive |

---

## Worked example: Insurance Claims (copy this shape)

MAP, Lens A (Stream). FNOL intake, then triage, then coverage check, then investigation and fraud, then adjudication, then settlement, then customer comms. Point candidates: classify FNOL by severity; summarize the loss or medical pack; draft the denial or settlement letter.

MAP, Lens B (Flip It). The decisions this process exists to make are: is it covered, is it fraud, how much, pay or contest. If prediction were free, you would not run a sequential human triage funnel at all. You would run straight-through processing: high-verifiability, low-risk claims auto-adjudicate and pay, and only exceptions route to a human. That deletes the triage queue. This is a system candidate.

GATE the system candidate. Q1 (artifact still needed?): the triage queue's routing decision disappears, so yes. Q2 (handoffs are coordination cost?): yes. Q3 (bottleneck is classification or retrieval?): yes. Three or more yes. Confirmed system. Do not VSM-decompose the old funnel. Redesign around the adjudication decision.

The teaching jewel to carry into scoring: the denial letter and the fraud score have similar "cost if wrong," but opposite deployment postures, decided entirely by verifiability. The denial letter is cheap to verify (the adjuster reads the cited clause in seconds) so it can ship with a light human check. The fraud score is expensive to verify (why did it flag?) so it must stay assistive. Hold this distinction for the score stage in `references/03-score-and-sequence.md`.
