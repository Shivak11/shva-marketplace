# 04 - Output formats

The deliverable of this skill is a FILLED analysis for one real organization, not a lesson. Produce the structured markdown portfolio by default. Add the signed worksheet. Build the HTML 2x2 only if asked.

---

## Output 1: The filled portfolio (primary, always produce)

A structured markdown document with these sections, in order. Fill every cell with the user's real organization, not placeholders. Where a fact was missing, write the assumption you made.

### 1. Header

- Organization or team.
- Process analyzed, as a value stream of 5 to 9 steps.
- The decisions this process exists to make.

### 2. Candidates discovered (MAP output)

A table of every candidate from both lenses.

| Candidate | Lens (A stream / B decision) | Step or decision it targets | One-line description |
|---|---|---|---|

### 3. Gate results (point versus system)

| Candidate | Q1 | Q2 | Q3 | Q4 | Q5 | Yes count | Verdict (point / pilot / system) |
|---|---|---|---|---|---|---|---|

### 4. Scores

| Candidate | Type | Value (0-5) | Feasibility (0-5) | Verifiability (0-5) | Risk (green / amber / red) | Autonomy posture | Quadrant |
|---|---|---|---|---|---|---|---|

Autonomy posture is one of: autonomous, light human check, assist-only. It is set by verifiability and risk together, not by value.

### 5. The portfolio (SEQUENCE output)

List the members of each quadrant by name.

- Lighthouses (2 to 3): name each, with its autonomy posture and a 90-day owner.
- Quick Wins (2 to 4): name each.
- Strategic Bets (1 to 2): name each, and name the blocker to fund (data project, redesign mandate).
- One exploratory system bet: name it and what you would learn from a small pilot.
- Park or Kill: name what you are deliberately not doing, and why.

### 6. Sequencing note

State the order of moves over the next few quarters, and the rule: re-run the Gate after each Lighthouse ships, because the constraint moves.

---

## Output 2: The 2x2 (text version, always produce)

A plain-text grid placing each candidate by Value and Feasibility, with a risk marker. Use (G), (A), (R) for risk so it survives in plain text with no dash glyphs.

```
            HIGH VALUE
   STRATEGIC BETS      |      LIGHTHOUSES
   (fund the blocker)  |      (ship in 90 days)
   - candidate (R)     |      - candidate (G)
   - candidate (A)     |      - candidate (G)
   ---------------------+---------------------  LOW FEAS .... HIGH FEAS
   PARK or KILL         |      QUICK WINS
   (keep out of backlog)|      (ship for momentum)
   - candidate (R)      |      - candidate (G)
            LOW VALUE
```

Risk key: (G) green, can earn autonomy if verifiability is high. (A) amber, human-in-the-loop. (R) red, assist-only or parked until mitigated.

---

## Output 3: The one-page signed worksheet (produce on request)

This is the commitment capstone. Reuse this block, filled for the organization.

```
ORGANISATION / TEAM: ______________________________________

PROCESS (as a value stream, 5 to 9 steps):
__________________________________________________________

MAP
  Lens A, point candidates (speed or cost a step):
    1. ___________________________  2. ___________________________
  Lens B, system candidates (flip it; what would we never build this way?):
    1. ___________________________  2. ___________________________

GATE (per candidate, 5 questions, Y/N; 3+ = SYSTEM)
  Candidate: _______________________  Yes count: ___  ->  POINT / PILOT / SYSTEM

SCORE (0 to 5 each; Risk is a VETO)
  Value: ___   Feasibility: ___   (data ___ / stack ___ / integration ___ / VERIFIABILITY ___)
  Risk (consequence x reversibility x regulatory): LOW / MED / HIGH-VETO
  Quadrant:  LIGHTHOUSE / QUICK WIN / STRATEGIC BET / PARK

SEQUENCE
  First Lighthouse: ___________________  Owner: ___________  90-day check-in: _______
  One Strategic Bet (system): _________________  Blocker to fund: __________________

SIGNATURE / DATE: _________________________________________
```

When you produce this for a real org, you fill it in rather than leaving blanks. The blank version is only for when the user wants a printable form.

---

## Output 4: Aesthetic HTML 2x2 (optional, only when asked)

If the user wants a visual portfolio, copy `assets/portfolio-2x2-template.html` into the working directory, fill in the candidate dots, and render-verify with `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>`. Read the PNG before sending. Keep the markdown portfolio as the source of truth. The HTML is a presentation layer, not the analysis.

Keep scope disciplined. The primary deliverable is the structured markdown portfolio. Do not build HTML unless the user asks for it.
