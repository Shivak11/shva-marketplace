# Audit checklist

Run before calling a game finished. Adapted from the Rehearsal `atom-creator`
game auditor (thirty-three checks, 2026), the `game-design-theory` gates, and
the Writing for AI 1.1 rebuilds of 2026-09-04. A hard item blocks; a soft item
is reported and does not block.

## Design, before code

| # | Item | Hard |
|---|---|---|
| D1 | The screen is a nameable everyday object. A stranger can say what it is with the instructions covered. | Hard |
| D2 | An axis of the layout carries the quantity being taught. | Hard |
| D3 | Five to eight levels, each adding exactly one new rule, named in one line. | Hard |
| D4 | The naive move wins level one and loses a later level. Both named. | Hard |
| D5 | Every pure policy loses at least one level, proved by a simulation script, not by reasoning. | Hard |
| D6 | At least one level opens in a state that depends on an earlier level's outcome, or the absence is justified in the design note. | Soft |
| D7 | The final playable level, or the written transfer, uses a context not named in the teaching material. | Hard |
| D8 | The game's content does not replay the teaching material's own named examples where transfer is the goal. | Hard |
| D9 | Two to four decision points per level. A single choice per level fails. | Hard |
| D10 | The cost of each option is printed on the card the player is deciding on. | Soft |
| D11 | Reflection beats on about half the levels, never all, placed where a model breaks. | Hard |
| D12 | Reflection beats are contrasts between two honest models, not comprehension questions, and are not scored. | Hard |
| D13 | One quiet synthesis before any score, four to six lines, at least one tailored by a real play signal, no confetti and no number. | Hard |
| D14 | Typed input only where the host contract requires the learner's own words, one box per screen. | Hard |
| D15 | The stack is chosen from the route to the player, and the payload is measured and recorded. | Soft |

## Copy

| # | Item | Hard |
|---|---|---|
| C1 | Each level opens with a briefing in the host material's voice: second person, three short paragraphs, then the objective on its own line. | Hard |
| C2 | Labels and notes are sentences. Uppercase fragments are used only for genuine labels. | Hard |
| C3 | Every verdict opens with Yes or No, then ties the outcome to what the player did. | Hard |
| C4 | No paragraph explanations, scoring blocks or next-level teasers on a play screen. | Hard |
| C5 | No label, badge or tag on an uncommitted card leaks answer-relevant information. | Hard |
| C6 | Option labels do not reveal which is correct when read without their descriptions. | Hard |

## Feel

| # | Item | Hard |
|---|---|---|
| F1 | Three feedback tiers, applied consistently. | Soft |
| F2 | Results reveal as a timed sequence, not a static card. | Hard |
| F3 | Something visible persists from an earlier level into a later one. | Soft |
| F4 | Sound is off until the player turns it on. | Hard |
| F5 | Motion serves the mechanic. Decorative animation over a static idea is theatre. | Soft |
| F6 | Reduced motion is honoured, and the game remains completable with it on. | Hard |

## Build

| # | Item | Hard |
|---|---|---|
| B1 | Every interactive object has a real hit area. Containers are given a size. | Hard |
| B2 | No overlapping tap zone covers the centre of the control beneath it, and secondary zones are interactive only while visible. | Hard |
| B3 | No conditional class name can evaluate to an empty string. | Hard |
| B4 | Elements hidden by attribute are hidden whatever their display rule. | Hard |
| B5 | Entry animations run from an explicit start state to an explicit end state. | Hard |
| B6 | Nodes reused across state changes reset transform, opacity and rotation before animating in. | Hard |
| B7 | No horizontal scrolling at the narrowest supported width. | Hard |
| B8 | Every screen fits the viewport, or scrolls deliberately in a container that is meant to scroll. | Hard |
| B9 | Text is legible at the smallest supported size; no label is truncated to a non-word. | Hard |
| B10 | A keyboard and screen-reader path exists for every action that changes state. | Hard |
| B11 | Progress survives a reload mid-play. | Soft |
| B12 | Every string that reaches the screen is checked for stray quotes and encoding damage. | Hard |

## Evidence

| # | Item | Hard |
|---|---|---|
| E1 | The pure-policy sweep was run and its table is recorded. | Hard |
| E2 | Every screen and meaningful state was rendered at phone and desktop width, in both themes. | Hard |
| E3 | A real browser driver exercised every gesture, including controls that appear only in some states, from first screen to last, with the console clean. | Hard |
| E4 | Synthetic DOM events, hidden panes and headless shells under a virtual time budget were not used as proof of input or motion. | Hard |
| E5 | Whether a room has played it is stated plainly, and never implied by any of the above. | Hard |

## The two failures worth remembering

A game can pass every mechanical item here and still be rejected on sight,
because the layout encoded nothing and the vocabulary was invented. D1 and D2
exist because of that, and they come first for a reason.

A game can also render perfectly in every capture and be entirely unplayable,
because nothing in a still image proves a control responds. E3 exists because
of that.
