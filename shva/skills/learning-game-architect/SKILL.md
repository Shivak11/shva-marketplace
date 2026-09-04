---
name: learning-game-architect
description: >-
  Use when a teaching artefact needs a playable game rather than a worksheet:
  a mini-game, simulation, level campaign or interactive exercise that has to
  teach something and survive a room. Stack-agnostic. It governs what the
  player sees, decides, feels and remembers; it does not choose a renderer.
  Called by mdp-architect whenever a session model declares a game, and usable
  on its own for product games, Rehearsal atoms and standalone exercises.
  Load before any design document and long before any code.
---

# Learning Game Architect

Version: `1.0.0`

A worksheet asks what you know. A game makes you decide, shows you the
consequence, and lets you be wrong in a way you remember. Most educational
games fail because they are quizzes wearing animation. The rules below are the
ones that separate the two, drawn from three sources: the Rehearsal
`atom-creator` game pipeline and its thirty-three mechanical audit checks, the
`game-design-theory` frameworks, and the seven rebuilds of Writing for AI
exercise 1.1 on 2026-09-04, where a game that passed every mechanical rubric
was still rejected on sight.

## The three questions that decide everything

Answer these before a single design decision. If any answer is weak, no amount
of craft downstream recovers it.

1. **What object is the screen?** Name a thing the learner has already used: a
   parcel tracking page, a filing tray, a bank transfer form, a chat thread, a
   departure board. The player must be able to say what they are looking at
   before reading a word of instruction. A screen built from invented tokens
   ("three helpers", "signal bars", "resilience points") teaches nothing until
   its own vocabulary is taught first, which is a tax paid on every single
   player.
2. **What quantity is the lesson about, and which axis carries it?** If the
   lesson is about time, an axis is time and empty distance is waiting. If it
   is about money, an axis is money. A grid of evenly spaced identical cards
   encodes nothing, so it teaches nothing, whatever the palette.
3. **What does the player physically do?** One sentence, no course vocabulary
   in it. If the sentence needs a bracket, the mechanic is not settled.

## The object rule

Build the screen as the real artefact and let the mechanics live inside it.
Test it by covering every instruction: show the screen to somebody who knows
nothing and ask what it is. If they cannot name it, the metaphor is wrong and
no copy will save it.

Two consequences follow. First, prefer the real-world interface over any
house aesthetic: a dialogue mechanic belongs in a chat mockup, a filing
mechanic in a cabinet, an allocation in a transfer form. Second, invented
scarcity is usually worse than the real constraint. A budget of tokens is a
game-ism; "some steps cannot be handed over, and some are expensive to check"
is the actual lesson and needs no explaining.

Put the price of each option on the card. Numbers on the card teach; copy
underneath the card does not. When a step costs twenty minutes to do and
twenty-five to check, the player discovers the rule by reading two numbers,
and it stays discovered.

## Level architecture

Five to eight levels. Three is a quiz with rounds; twelve outgrows a teaching
slot. Each level adds exactly one new rule, named in one line before play.

- **The naive move wins the first level and loses a later one.** Reward the
  instinct, then punish confidence in it. If the naive move loses immediately,
  the game teaches tactically and the player never owned the belief being
  broken.
- **State compounds across levels where it honestly can.** A level whose
  opening depends on nothing that came before is an independent mini-game and
  learning does not accumulate. Name the variable that carries.
- **The last playable level is a transfer test.** A context not named anywhere
  in the teaching material, so the player applies the method without coaching.
  Where a host contract requires the taught case to be played, put the taught
  case second to last and make the final level or the written transfer carry
  the novel context. Record which choice was made and why.
- **No replay of the teaching material's own examples** as the game's content
  where transfer is the goal. Reusing the course's brands and protagonists
  turns the game into a memory test of the course.

## Decisions, not selections

A single choice per level is a radio button. Aim for two to four decision
points per level, and prefer a two-part decision over a one-part one: hand
this over, and will you check it. The second part is where judgement lives.

Enumerate every pure policy before building: always the first option, always
the most visible work, always everything, always nothing, always the longest
bar. Simulate each against every level. Every pure policy must lose at least
one level. If one wins everywhere, the game has no decision in it. Do this in
a script, not by reasoning, and keep the script.

## Reflection: place it where the contrast bites

This is the rule most often got wrong, including by this skill's author.

A question after every level is monotonous, and a comprehension question is
the wrong instrument entirely. Reflection belongs at the moment a player has
just seen a result that breaks or confirms a model they were holding, and its
job is to make them say the model out loud.

- **Frequency: roughly half the levels, never all of them.** Beats on the
  levels where a new rule bit hardest. The rest run straight on.
- **Shape: contrast, not quiz.** Offer two honest mental models and ask which
  one they were working from. Neither is scored. The follow-up line adapts to
  the choice: one confirms, the other names what just happened instead.
  A player who has to own a prior belief remembers its correction.
- **One quiet synthesis before any score.** After the last level and before any
  number, stop the game for a page of four to six short lines, one of them
  drawn from what this player actually did (how many times they reached into
  somebody else's queue, whether a thing they skipped came back). No confetti,
  no score, no celebration; those belong to the screen after. Tap to advance,
  and auto-advance if untapped.
- **Typed reflection is expensive.** Reserve it for where the host contract
  requires the learner's own words, one box per screen, never a scrolling wall
  of boxes. Everything else is a tap.

## Copy register

The briefing is a case, not signage. Second person, present tense, in the
voice of the teaching material it belongs to. Three short paragraphs: what
happened, what the machinery is, what you want. Then the objective on its own
line.

Inside the game, labels are sentences. Uppercase fragments read as an airport
board and make the whole screen feel staccato. Every verdict opens with Yes or
No and then ties the result to what the player did, in one or two sentences.
A neutral opener the player can misread as a win is a defect.

Ban from the game surface: paragraph explanations, "how scoring works" blocks,
teasers for the next level, and any label that leaks the answer before the
commitment. Badges such as "optimal", "2x adjacent" or a score preview on a
card the player has not yet chosen are hard failures.

## Feel

Three feedback tiers, used consistently: a tick on any tap, a tone and a
colour change on a hit or a miss, and a longer sequence only at the end.
Results reveal as a timed sequence, not a static card. Something visible
persists from earlier levels. Sound is off until the player turns it on,
because these are played on buses and in classrooms.

Motion serves the mechanic: if the lesson is compression, the board must
visibly compress. Decorative animation on a static idea is theatre.

## Choosing a stack

Distribution decides, not preference. Ask how the game reaches a player.

| Route | Choose | Why |
|---|---|---|
| A link in a message | A single HTML file, engine from a CDN, canvas or DOM | Opens in seconds on any phone. Measure the payload and record it. |
| An installed app | A native or engine build | Only when an install is genuinely acceptable to the audience. |
| Inside an existing product | That product's stack | Never introduce a second renderer for one exercise. |

Any renderer is admissible: canvas, DOM, sprites, isometric, an engine. The
contract in this skill is about play and teaching. When the choice is
contested, measure rather than assert: record the compressed payload and the
oldest device tested.

## Verification ladder

Each rung proves something the rung below cannot. Report them separately and
never let one stand in for another.

1. **Model sweep.** Extract the simulation into a script and run every pure
   policy against every level. Print the outcome table. This proves the design
   has decisions in it and no dominant strategy.
2. **State renders.** Render every screen and every meaningful board state at
   phone and desktop width, in both themes. This proves layout, not behaviour.
3. **A driven journey in a real browser.** Drive every gesture the player has:
   each tap target, each drag, each control that only appears in some states,
   the full run from first screen to last. This is the only rung that proves
   input works.
4. **A room.** Nothing before this proves the game is worth playing.

Two traps worth naming, both cost real time on 2026-09-04. A hidden preview
pane runs no animation frames, and a headless shell under a virtual time
budget runs almost none, so both can render a state perfectly and prove
nothing about input or motion. And synthetic DOM events are not input: an
engine listening for pointer events at the document level will ignore them.
Use a real browser driver.

## Known bug classes

Check these by name; each one has shipped.

- **A container with no size has no hit area.** Setting a custom shape on a
  container without setting its size silently fails; the object never
  hit-tests. Give it a size and standard interactivity.
- **Overlapping tap zones with a higher depth eat the tap underneath.** A
  secondary control drawn inside a card must not cover the card's own centre,
  and should be interactive only while it is visible.
- **An empty class name throws.** Adding a conditional class computed as an
  empty string aborts the handler and freezes the screen.
- **A display rule beats the hidden attribute.** An element styled as flex
  stays visible when hidden; add an explicit rule for the hidden state.
- **Fade-in from an unset start leaves elements invisible** when a re-render
  interrupts it. Always animate from an explicit start state to an explicit
  end state.
- **Reused nodes keep the previous transform.** Reset position, opacity and
  rotation before an entry animation on any element keyed to changing state.
- **Fixed card heights and wrapping labels collide.** Either cap the label
  length or measure and reflow.

## The handoff, when a host skill calls this one

`mdp-architect` and its kin own the teaching contract; this skill owns the
play contract. The host passes down the decision fork with its options, the
typed actor registry including the human decision owner, the mechanism the
exercise must exercise, the case, and the participant fields the record needs.
This skill returns a level design, a state model whose initial choices cover
that decision fork exactly once, the reflection placement, and the
verification evidence. The host then validates the returned game record
against its own schema. Neither side edits the other's contract.

## Before you write code

Write a design note first, and answer each of these in at least two sentences.
Anything unanswered is a redesign, not a note.

1. The object the screen is, and how a stranger would name it.
2. The quantity being taught and the axis that carries it.
3. The one-sentence description of what the player does.
4. The level list, one new rule per level, with the naive move and the level
   that punishes it named.
5. Every pure policy, and which level each one loses.
6. The two-part decision, and the numbers printed on the card that make the
   trade visible.
7. Reflection placement: which levels get a beat, what two models each beat
   contrasts, and the signal that tailors the closing synthesis.
8. The stack, the route to the player, and the measured payload.
9. The verification plan, rung by rung.

Read [references/audit-checklist.md](references/audit-checklist.md) before
declaring a build finished.
