# 03 - Score and Sequence (Stages 4 and 5)

Once every candidate has a Gate verdict, score it and place it on the portfolio. Full method in `references/00-method.md`. This file is the scoring rubric and the 2x2 in practice.

---

## Stage 4: SCORE

Score the first three candidates together to calibrate the 0 to 5 anchors, then score the rest. Three quantities, plus the veto.

### Value (Y axis), 0 to 5

Size of the prize: volume times cost-per-instance times strategic weight. A high-volume, high-cost, strategically central use case scores near 5. A rare, cheap, peripheral one scores near 1.

### Feasibility (X axis), 0 to 5

Can we build it? Average four sub-drivers, with data readiness weighted heaviest.

| Sub-driver | What you are judging | Weight |
|---|---|---|
| Data readiness | Is the data clean, accessible, in one place? | Heaviest. This is the number one failure cause in the post-mortems. |
| Capability and stack | Have we shipped this class of system before? | Normal |
| Integration and change cost | How many systems, teams, and politics it touches | Normal |
| Verifiability | How cheap is it to check if the output is right? | Normal, but it also gates autonomy (see below) |

### Risk (the VETO, not averaged)

Risk is consequence-if-wrong times reversibility times regulatory or data exposure. Do not fold it into the score. Mark each candidate green, amber, or red.

- Green: low consequence, reversible, unregulated. Can run with autonomy if verifiability allows.
- Amber: contestable or sensitive. Human-in-the-loop.
- Red: catastrophic, irreversible, or legally exposed. Capped at assist-only, or disqualified regardless of value and feasibility. This is where "needs on-prem" lives: on-prem is a mitigation the risk axis forces.

### Verifiability (the axis that sets autonomy)

Verifiability is NOT cost-if-wrong (that is risk). It is the cost to CHECK whether the output is right. Score it, and use it to decide how much autonomy each candidate earns.

- Cheap to verify (a cited clause, a number that reconciles, a clickable source): can deploy aggressively, even on high-stakes work, because a human catches errors in seconds.
- Expensive to verify (a long memo, an unexplained score): value collapses, keep it assistive no matter how good the model looks.

Two use cases with the same cost-if-wrong can demand opposite postures. Always report verifiability as its own column, never merged into risk.

### Worked scoring table (insurance claims, copy this shape)

| Candidate | Type | Value | Feasibility | Verifiability | Risk | Verdict |
|---|---|---|---|---|---|---|
| Draft denial letter | Point | Mid | High | High (adjuster reads the cited clause in seconds) | Amber (contestable but verifiable) | Lighthouse. Ship with a light human check |
| Fraud score | Point (augment) | High | Low to mid (data) | Low (why did it flag? expensive to check) | Red (adverse-action, discrimination) | Assist-only, human-in-loop. Strategic Bet at best |
| Straight-through auto-pay | System | Very high | Low (policy admin, payments, audit, legal all must change) | Mixed | High | Strategic Bet. Fund the redesign, do not pilot a model alone |

---

## Stage 5: SEQUENCE the portfolio

Plot every candidate on Value (Y) times Feasibility (X). Color each dot by Risk. Place it in one of four quadrants.

| Quadrant | Meaning | Move | Target count |
|---|---|---|---|
| Lighthouses | High value, high feasibility | Ship in 90 days. These fund everything else. | 2 to 3 |
| Strategic Bets | High value, low feasibility | Usually the system candidates. Do not build a model yet. Fund the blocker (data project, redesign mandate). | 1 to 2 |
| Quick Wins | Low value, high feasibility | Ship for momentum. Do not oversell. | 2 to 4 |
| Park or Kill | Low value, low feasibility | Keep out of the backlog. Red-risk dots park here until mitigated. | as needed |

System redesigns almost always land as Strategic Bets (high value, low feasibility, because they need interdependent change). That is why you do not lead with them, but you must fund one deliberately in parallel, or you win this quarter and are irrelevant in two years.

### What a defensible portfolio looks like

2 to 3 Lighthouses, plus 2 to 4 Quick Wins, plus 1 to 2 Strategic Bets, plus 1 exploratory system bet. If your portfolio is all Lighthouses, you found only point solutions and skipped Lens B. If it is all Strategic Bets, you have no momentum and nothing funds the work. Re-run the Gate after each Lighthouse ships, because the constraint moves.

Carry this into the output: name each quadrant's members explicitly, name the blocker for each Strategic Bet, and name the autonomy posture (autonomous, light check, assist-only) that verifiability and risk set for each Lighthouse.
