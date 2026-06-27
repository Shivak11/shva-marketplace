# 00 - The Method: MAP, GATE, SCORE, SEQUENCE

This is the spine of the skill. It is an industry-agnostic method for two questions every leader is now asking:

1. Where should we actually use GenAI, and how do we find the use cases we would otherwise miss?
2. Which ones do we pick first, given that some are cheap tweaks and some rewrite the whole process?

The method has four moves. The first move (MAP) is the genuinely new part. The last three (GATE, SCORE, SEQUENCE) generalize an existing HR portfolio apparatus to any function or industry. The job of this skill is to RUN these four moves on a real organization and produce a filled portfolio, not to teach them.

---

## Why a plain "map the workflow, find the breakdown, apply GenAI" approach is only half right

Value-stream mapping (VSM) is the habit most teams reach for. It is half right, and the wrong half is structural, not a mistake.

What VSM gets right (keep it). VSM is the only common lens that actually draws the handoffs, queues, batching, rework loops, and "send it to X for sign-off" steps. Those steps are the compensatory scaffolding people built precisely because information used to be missing. That scaffolding is exactly where GenAI value hides. VSM produces the right map.

What it gets structurally wrong (three things):

1. It biases you toward point solutions. VSM's ontology is the existing stream. It can speed up a step. It cannot draw the use case that deletes the stream. Looking at existing workflows to find where AI can replace humans delivers incremental benefit, but it is not where the biggest opportunities lie. (As Hammer and Champy put it, automate a flawed process and you just speed up the mistakes. As Meadows notes, tuning steps and flows is the weakest leverage point. The value is at rules and structure.)
2. "Find the breakdown" mis-aims. Goldratt is the rigorous version of the instinct: optimize the constraint, not any breakdown, because optimizing a non-constraint is waste. But GenAI's best targets are often steps that are not broken. They work fine but are cognitively expensive (reading, drafting, classifying, summarizing). Worse, the constraint moves. The moment AI elevates a reading or drafting bottleneck, throughput jumps to a new constraint, usually judgment, verification, or trust. A one-pass VSM hands you a map that is stale the day after you deploy.
3. It conflates two different axes. "Complexity (data, on-prem)" mixes feasibility (can we build it?) with risk (what if it is wrong, who is exposed?). They behave differently. Feasibility you average into a score. Risk you gate: a catastrophic, irreversible use case is disqualified regardless of value or feasibility. On-prem is not a complexity primitive. It is a mitigation you adopt because the risk axis demanded it.

---

## MAP: Dual-Lens Discovery

Run the process through two lenses, on purpose. This is what stops you from only finding point solutions.

- Lens A, the Stream lens (VSM, kept). Map the value stream in 5 to 9 steps. For each step, tag three things: the cognitive work (generate, retrieve, classify, summarize, decide), the cost driver (time, expertise, error, wait), and one flag: is this step here only as a workaround for missing information? (a queue, a batch, a handoff, a specialist, a "route it to X to review"). Lens A surfaces point candidates: make a step faster, cheaper, or more consistent.
- Lens B, the Decision lens ("Flip It Around"). Ignore the stream. Ask: what decisions does this process exist to make, and if prediction and drafting were free and instant, would we ever build it this way? Start from the decision and a blank slate. Lens B surfaces system candidates: the redesign that deletes steps.
- The tell: which lens surfaced the use case is your first signal of point versus system. Lens A points to point. Lens B points to system. Confirm with the Gate.

Most teams only ever run Lens A (it is what "analyze the workflow" produces). Running Lens B deliberately is the discipline. You cannot find a stream-deleting use case with a tool whose first assumption is that the stream exists.

---

## GATE: Point versus System

One underlying test, from Power and Prediction: independence. Does the AI create value on its own, or only if other decisions and steps also change?

- Value is independent. This is a point solution (improve an existing decision) or an application (enable a new one). Adopt it standalone.
- Value is interdependent. This is a system change. It pays off only if dependent procedures change too. Highest value, hardest, slowest, most defensible.

Operationalize with the five-question tell. 3 or more "yes" answers means system.

| # | Question | A "yes" points to system |
|---|---|---|
| 1 | If AI did this perfectly, would the artifact this step produces still need to exist? | The output was a workaround for a constraint AI just removed |
| 2 | Do the handoffs exist because of communication, search, or coordination cost? | Those costs, and the roles built around them, are about to vanish |
| 3 | Is the bottleneck generation, retrieval, classification, or summarization? | The bottleneck is moving. The new one is judgment, verification, or trust |
| 4 | Is the decision-maker's authority based on having seen all the inputs? | AI now sees more, faster. The authority basis is unstable |
| 5 | Is the output consumed by the next step, or by a human reading a document? | If a human reads a doc, AI can too. The next step may not need to exist |

Reading the count:

- 0 to 1 yes: point. Optimize it. Now (and only now) you may decompose tasks VSM-style.
- 2 yes: ambiguous. Run a small learning pilot to find out.
- 3 or more yes: system. Redesign around the decision. Do not decompose the old stream, or you will pave the cowpath.

Two rules that fall out of the Gate:

- Task decomposition is for AFTER the gate, never before. You do not work a system change by decomposing harder. You stop decomposing and redesign around the decision. Decomposition is licensed only after the gate confirms the workflow is still the right unit.
- Re-run the Gate after every win, because the constraint moves. A use case that gated as "point" last quarter can gate as "system" once the bottleneck shifts.

---

## SCORE: Value, Feasibility, Risk, and Verifiability

Three things, not one. Use crude 0 to 5 anchors. Score the first three candidates together to calibrate.

- Value (Y axis): size of the prize, roughly volume times cost-per-instance times strategic weight.
- Feasibility (X axis): can we build it? Four sub-drivers. This is where the "data sources" instinct belongs, correctly placed.
  - Data readiness. Heaviest weight. Every credible post-mortem (MIT NANDA, McKinsey, Bain) names it the number one failure cause.
  - Capability and stack deployability. Have we shipped this class of system before?
  - Integration and change cost. How many systems, teams, and politics it touches.
  - Verifiability. The new axis, defined below.
- Risk (the VETO, not an axis you average): consequence-if-wrong times reversibility times regulatory or data exposure. A catastrophic, irreversible use case is capped at "assist-only" or disqualified regardless of value or feasibility. This is where "needs on-prem" actually lives. On-prem or a local model is a mitigation the risk axis forces, not a complexity input.

### Verifiability (the axis most scorecards miss)

Verifiability is NOT "what does it cost if it is wrong" (that is risk). Verifiability is what does it cost to CHECK whether it is right. It is the single best predictor of how much autonomy you can give the AI.

- Cheap to verify (a cited policy paragraph, a number that reconciles, a claim with a clickable source): deploy aggressively, even autonomously, even on high-stakes work, because a human catches the error in seconds.
- Expensive to verify (a 40-page strategy memo, a "trust me" risk score with no provenance): the value collapses no matter how good the model is, because checking costs as much as doing.

The non-obvious lesson: two use cases with the same "cost if wrong" can demand opposite deployment postures, decided entirely by verifiability. Build verifiability in (force citations, reconciliations, structured outputs) and a use case climbs the feasibility axis and earns more autonomy.

---

## SEQUENCE: The Portfolio

Plot every candidate on Value (Y) times Feasibility (X). Color each dot by Risk (green, amber, red-veto). Four named quadrants.

| Quadrant | Meaning | Move |
|---|---|---|
| Lighthouses | High value, high feasibility | Ship in 90 days. These fund everything else. Aim for 2 to 3. |
| Strategic Bets | High value, low feasibility | Usually the system candidates from Lens B. Do not build a model yet. Fund the blocker (data project, redesign mandate). Aim for 1 to 2. |
| Quick Wins | Low value, high feasibility | Ship for momentum. Do not oversell. Aim for 2 to 4. |
| Park or Kill | Low value, low feasibility | Do not enter the backlog. Red-risk dots park here until mitigated. |

The point-versus-system payoff on the 2x2: system redesigns almost always land as Strategic Bets (high value, low feasibility, because they need interdependent change). That is why you do not lead with them, but you must fund one deliberately in parallel, or you win this quarter and are irrelevant in two years.

A defensible portfolio: 2 to 3 Lighthouses, plus 2 to 4 Quick Wins, plus 1 to 2 Strategic Bets, plus 1 exploratory system bet. Re-run the Gate after each Lighthouse ships.

---

## The method works in any industry (proof strip)

One row per industry. Lens A finds the point candidate. Lens B finds the system candidate. Risk gates. Verifiability sets autonomy.

| Industry | Process | Lens A point candidate | Lens B system candidate (deletes steps) | Risk veto | Verifiability read |
|---|---|---|---|---|---|
| Insurance | Claims | Summarize loss or medical reports, draft denial letter | Straight-through processing: low-risk claims auto-adjudicate, only exceptions reach humans | Adverse-action and discrimination law on auto-decisions | Denial letter: cheap (cite the clause). Fraud score: expensive |
| Finance | Month-end close | Draft variance commentary, classify journal entries | Continuous close: reconcile and flag in real time, killing the month-end crunch | Audit trail, SOX, materiality | Reconciliation: cheap (it ties or it does not). Forecast narrative: expensive |
| Customer service | Complaint escalation | Draft the reply, triage by intent | Deflect and resolve: agent answers and acts within a bounded policy, escalating only true exceptions | Tone or brand harm, regulated advice | Policy-cited answer: cheap. "Sentiment-appropriate" tone: expensive |
| Manufacturing | Field service or warranty | Summarize fault logs, draft the work order | Predict and dispatch: schedule the technician before the failure call | Safety-critical action, warranty fraud | Part-match to manual: cheap. Root-cause hypothesis: expensive |
| HR | Hiring or separation | JD-to-evidence sheet, draft offer letters | Continuous candidate-signal model replacing the JD to CV to shortlist funnel | Data protection law, labour law, bias | Citation-grounded policy answer: cheap. "Culture-fit" score: expensive |

---

## Source lineage (citation is allowed in this analysis artifact)

This is an analysis artifact, not a participant worksheet, so naming the underlying books in the method and the rationale is fine. Keep author names as garnish in the final portfolio, not the spine.

- Power and Prediction (Agrawal, Gans, Goldfarb): point, application, and system solutions; the independence test; "task-thinking gives point solutions, system-thinking gives value"; "Flip It Around"; cheap prediction dismantles compensatory scaffolding; decouple prediction from judgment.
- The Goal (Goldratt): Theory of Constraints, the five focusing steps, optimize the constraint not a non-constraint, the constraint moves.
- Reengineering the Corporation (Hammer and Champy): "don't automate, obliterate"; automation entrenches a flawed process.
- Thinking in Systems (Meadows): leverage points; parameters and flows are weak, rules and goals and paradigm are strong.
- The Secrets of AI Value Creation (Proksch and others): the four value types (Process Optimisation, Decision Augmentation, Decision Automation, AI Products and Services).
- Reshuffle (Choudhary): coordination thesis; jobs disappear because the architecture of work no longer needs them.

Consultant evidence to carry as context: BCG "Closing the AI Impact Gap" (leaders run about 3.5 use cases and earn higher ROI than peers running more); MIT NANDA "GenAI Divide" (most pilots fail to reach P&L); the Brynjolfsson J-curve; Gartner AI Use-Case Prism and TRiSM; the Andrew Ng five-step.
