---
description: "Pre-project vocabulary briefing. Returns a 20-25 term domain glossary before starting any GenAI build (code, design, video, music, art). Use BEFORE briefing the AI on your real project — it prevents drift by aligning your vocabulary with the AI's first."
allowed-tools: ["Read", "Write", "Bash"]
model: sonnet
argument-hint: "[project-type, e.g. '2D browser game' or 'AI music track in Suno']"
---

# /shva:brief-me — Pre-Project Vocabulary Briefing

> **The 5-minute step that prevents 5-hour AI drifts.**
>
> In the GenAI era, syntax is cheap — vocabulary is the bottleneck. The
> sharper you can name what you want, the better the output. This command
> generates a domain-specific glossary before you start a build, so your
> instructions land cleanly the first time.
>
> Domain-agnostic: works for code, video, music, art, design, slides,
> games, copywriting — anywhere you'd brief an AI.

**Input:** `/shva:brief-me <project-type>` *(or run blank to be prompted)*
**Output:** 3-bucket glossary · 3 clarifying questions · correction-coda prompt

---

## Step 1 — Resolve the project type

If `$ARGUMENTS` is non-empty, treat it as `project_type` and continue
straight to Step 2.

Otherwise, ask the user as a **single plain-text prompt** (not via
`AskUserQuestion`) — project types are open-ended free text, and a
multiple-choice picker discards the specificity this skill is trying
to elicit. Render the examples as inspiration prose, not options:

> "What are you about to build? (Be specific — domain matters more
> than scale.)
>
> Examples to nudge specificity:
> • 2D browser game in Phaser
> • SaaS dashboard in Next.js + shadcn
> • AI music track in Suno
> • AI video in Runway / Kling
> • Mobile-first landing page
> • Midjourney art series — editorial photography
> • ElevenLabs documentary podcast
> • Remotion explainer animation
> • Pitch deck in Canva / Keynote"

Then wait for the user's reply and use it verbatim as `project_type`.

**Do not call `AskUserQuestion` here.** It caps at 4 options, which
forces a lossy collapse of the example list and turns inspiration
into a forced-choice menu.

If the user gives a vague answer (e.g. "a website"), push once for the
domain — *what kind* of website, *for whom*, *with what tech*. Then
proceed to Step 2.

---

## Step 2 — Generate the domain glossary

Output a glossary of **20–25 terms** specific to `project_type`. Strict format:

> **Term** → one plain-English sentence. *No jargon allowed inside the definition.*

Group into these **three buckets**, in this exact order:

### 🎨 Creative / Style — *how things look, sound, feel*
Aesthetic vocabulary. Mood, tone, genre, composition, palette, rhythm.

### ⚙️  Technical / Process — *how things are built or run*
Pipeline vocabulary. Engines, frameworks, formats, controls, mechanics.

### 💬 Prompt / Direction — *the words the user will actually say*
Instruction vocabulary. The terms that go *into* prompts when directing
the AI. (For code: component names. For video: shot types. For music:
instrumentation terms. For art: weight/CFG/seed.)

**Selection rules:**
- Prefer terms the user would **use when giving instructions**, not
  implementation details they'd need to debug.
- Skip the obvious (HTML, internet, file, button). Pick terms that *unlock
  precision* — words that, if missing from the user's prompt, would force
  the AI to guess.
- For a domain like AI video, "keyframe" earns a slot; "encoding" doesn't.

---

## Step 3 — Three sharp clarifying questions

After the glossary, ask **exactly 3** questions to sharpen the upcoming
project brief. Probe these axes:

1. **Aesthetic / reference points** — "Two existing examples you'd point at?"
2. **Scope / fidelity** — "Production-grade or proof-of-concept?"
3. **Constraints** — audience, platform, time budget, brand rules.

Keep them tight. One sentence each. No multi-part questions.

---

## Step 4 — Hand the user the correction coda

Close the response with this verbatim block, formatted as a copy-paste
quote so the user can grab it cleanly:

> "Now, given these terms, here's what I'm building: **[your idea]**.
> Flag any terms I'm using incorrectly and suggest better vocabulary
> before you write any code or output."

Then add a one-line note:

> *Paste this when you're ready to start the real project — it turns me
> into a real-time vocabulary coach. Over a few sessions, your prompts
> sharpen automatically.*

---

## Step 5 — Visual mental model

**Default behavior.** Run after Step 4 unless the user opted out.
The visual is part of brief-me's deliverable, not a follow-on perk —
a glossary and a visual mental model land together, the same way a
good textbook ships prose and diagrams together. Skip *only* if the
user explicitly said "glossary only", "no visual", "skip the diagram",
or similar.

Hand off to `visual-explainer:generate-web-diagram` (or write the HTML
directly) with an **analogical brief**, not a structural one. The job
is to make the domain *click*, not to inventory it.

**Constraints — read before generating:**

- **One diagram, not three.** A single Mermaid flowchart showing the
  spatial shape of the domain — 4 to 6 nodes, never more. No sequence
  diagrams. No comparison tables. No nested vocabulary stacks. If the
  user wants those, they will ask. Pull, don't push.

- **Pick one running metaphor and stay in it.** Restaurant, factory,
  postal system, USB peripheral, library, plumbing — pick *one* and
  ride it for the whole page. Never switch metaphors mid-explanation;
  that's the move that makes pages feel patchworked.

- **Warm, not dramatic.** The job is fast comprehension, not a reading
  experience. State the metaphor flat. Don't open with rhetorical
  framing ("there are X ways…"), don't withhold ("imagine this:"),
  don't address the reader's experience ("here's how to think about
  it"), don't write essay-openers. Vivid one-line compressions are
  good ("Tools without handlers are pictures of food"); theatrical
  setups are not. Cut every sentence whose job is *commentary on the
  explanation* rather than *the explanation itself*.

  *Bad:* "There are smarter ways to explain MCP. There are no warmer
  ones than this: imagine a small restaurant."

  *Good:* "Picture a small restaurant."

  *Bad:* "People make a fuss about transports. They shouldn't."

  *Good:* (just delete it — say what transport is, move on.)

- **Analogize technical concepts only — not everything.** Don't
  decorate every term with a metaphor. The User is a user. The Client
  is the client (Claude Code, Desktop, Cursor). The Server is your
  code. State plain things plainly. Reach for analogy *only* when the
  concept is abstract, unnamed in everyday language, or its
  relationship to other terms is non-obvious — that's typically 3-5
  terms per domain, not 10. Forced analogy on every line is just
  dramatic prose wearing a metaphor's clothes.

  *MCP example — analogize:* Tools (menu), Handlers (cooks), Schemas
  (order ticket), Roots (pantry fence). The structural relationships
  are non-obvious; the metaphor earns its place.

  *MCP example — don't:* User, Client, Server, Transport. These do
  their own work. Adding "the diner / the customer / the kitchen /
  the cable" decorates without informing.

- **Each beat gets a small companion visual.** The big diagram at the
  top shows topology — how all the pieces sit together. Each beat's
  mini-diagram (right of the prose, ~180-220px wide) shows *that one
  concept* in isolation. Two or three boxes and an arrow is plenty.
  The point is fast pattern-grasp; don't redraw the big diagram in
  miniature. Use inline SVG (not Mermaid) — these need to be tiny,
  cheap, and predictable.

- **Edge labels: short and plain.** Mermaid + ELK can clip long edge
  labels in foreignObject containers. Keep edge labels under 12
  characters where possible ("ask", "tool call", "result", "reply"
  — not "I want pasta", "places order", "plated dish"). Long labels
  also cost the reader's attention; short ones reinforce the topology
  they're already seeing.

- **Indian English vocabulary by default.** When picking analogies,
  examples, food references, and cultural touchstones, prefer terms
  familiar to Indian English readers. Same intuition, different
  surface vocabulary. This is a Shiva-default — calibrate accordingly.

  *Good:* Central government, station, lakh, chicken, biryani,
  thali, dal, raita, paneer, autorickshaw, chai

  *Bad:* Federal government, freeway, million, bacon, carbonara,
  pancetta, sandwich, taco, soccer (use football)

  **Avoid alcohol-centric references** (wine cellar, beer pong, bar
  tab) and **pork references** (bacon, pancetta, ham) by default —
  they exclude readers and add zero analogical value over neutral
  alternatives. A "spice rack" reads better than a "wine cellar"
  in nearly every metaphor anyway.

- **Analogical prose around the diagram.** Cover 4-6 core terms only —
  not the full glossary. For each one, give:
    1. A one-line plain explanation of what it is.
    2. A *"think of it as ___"* anchor that maps it to the running metaphor.
    3. Its relationship to at least one other term, expressed *through*
       the same metaphor.

  *Bad:* "Handlers do the actual work."

  *Good:* "Handlers are the code that runs when a tool is called — think
  of them as the kitchen behind the menu. The menu is what the customer
  sees; the kitchen is what actually cooks the dish."

- **Reader assumption: builder, not layperson.** Assume fluency in HTTP,
  JSON, filesystems, processes, APIs, basic CLI. Don't explain those.
  Explain only the things specific to the domain you're briefing — the
  *new* vocabulary, not the universal one.

- **Resist exhaustiveness.** The glossary already covers breadth
  (20-25 terms); the visual covers depth (4-6 core terms, rich analogies).
  Different jobs. Don't try to put the whole glossary in the diagram.

- **End with an opening, not a closing.** Name 1-2 follow-on questions
  the reader could ask ("want to see the lifecycle?", "want the Tool vs
  Resource comparison?") but don't pre-render them. The reader pulls;
  you don't push.

If the user wants more after the first pass — lifecycle, comparisons,
deep dives — that's a follow-up prompt. Treat the visual as a launchpad,
not a deliverable.

---

## Step 6 (optional) — Persist the glossary + visual

Ask: *"Save this glossary to your project notes? (y/N)"*

If **y**:
- Slugify `project_type` → e.g. `2d-browser-game`
- Get today's date via `Bash: date +%Y-%m-%d`
- Write the full glossary to:
  `${CLAUDE_PROJECT_DIR}/.shva/glossaries/<slug>-<date>.md`
- Confirm path written.

If **N** or no answer: skip silently.

---

## Behavioral discipline

- **No jargon inside definitions.** A 12-year-old should follow the
  one-line definition. If you find yourself writing "asynchronous", stop
  and rewrite as "doesn't wait — runs in the background."
- **Never exceed 25 terms.** Quality > quantity. Ruthless triage.
- **Bucket counts can be uneven** (e.g., 8 / 10 / 6). Don't pad. The
  shape of the glossary tells the user where the action lives.
- **Visual/audio/art domains: prioritise sensory + direction vocabulary**
  over pipeline plumbing. The user is the director, not the engineer.
- **Code domains: prioritise component names + architecture patterns**
  over function-level syntax. The user is the architect, not the typist.
- **The bucket emojis are intentional** (🎨 ⚙️ 💬). They speed visual
  scanning when the user is scrolling back to the glossary mid-build.
- **End-state test:** if the user could now write a 4-sentence project
  brief using nothing but the glossary terms, you nailed it. If they'd
  still need to say "you know, the box that pops up over the screen"
  instead of "modal" — you missed a slot.
- **Analogies > definitions for visuals.** Glossary entries get plain
  one-line definitions (Step 2). Visuals (Step 5) require analogies —
  single running metaphor, 4-6 core terms only, relationships expressed
  *through* the metaphor. Glossary covers breadth; visual covers depth.
  Different jobs.

---

## Reference seeds (optional priming)

If the project type matches one of these common domains, the glossary
should naturally include these anchor terms (not exhaustive — use as a
sanity check):

| Domain | Anchor terms to consider |
|---|---|
| Browser game | game loop, sprite, tilemap, hitbox, scene, viewport, parallax, delta time, HUD, state machine, respawn |
| Web app / dashboard | navbar, sidebar, hero, modal, toast, skeleton, CTA, breadcrumb, drawer, data table, empty state |
| E-commerce | product grid, PDP, cart drawer, checkout flow, hero banner, faceted filters, SKU, sticky CTA, upsell |
| Mobile-first app | bottom tab bar, FAB, pull-to-refresh, swipe gesture, bottom sheet, safe area, haptic feedback, splash screen |
| AI video | keyframe, motion brush, LoRA, inpainting, aspect ratio, camera motion type, shot length, transition |
| AI music | stems, BPM, key signature, negative prompting, continuation, style tags, mastering, instrumentation |
| AI art (Midjourney/Flux) | CFG scale, seed, aspect ratio, style reference, weight, negative prompt, ::syntax |
| AI slides / docs | information hierarchy, visual rhythm, deck narrative, white space, callout, sidebar |
| Podcast / audio drama | cold open, sting, sidechain ducking, bed music, narration vs dialogue, Foley, normalization, LUFS |

---

*Source: distilled from a Perplexity exchange with Shiva, May 2026 —
the "vocabulary, not syntax" insight. The prompt design is intentionally
domain-agnostic so one command serves coding, design, AI art, AI video,
AI music, and any future GenAI domain.*
