---
description: "Pre-project vocabulary briefing. Returns a 20-25 term domain glossary before starting any GenAI build (code, design, video, music, art). Use BEFORE briefing the AI on your real project — it prevents drift by aligning your vocabulary with the AI's first."
allowed-tools: ["Read", "AskUserQuestion", "Write", "Bash"]
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

If `$ARGUMENTS` is non-empty, treat it as `project_type`.

Otherwise, ask the user via `AskUserQuestion`:

> "What are you about to build? (Be specific — domain matters more than scale.)"

Suggest these examples to nudge specificity:
- "2D browser game in Phaser"
- "SaaS dashboard in Next.js + shadcn"
- "AI music track in Suno"
- "AI video in Runway / Kling"
- "Mobile-first landing page"
- "Midjourney art series — editorial photography"
- "ElevenLabs documentary podcast"
- "Remotion explainer animation"
- "Pitch deck in Canva / Keynote"

If the user gives a vague answer (e.g. "a website"), push once for the
domain — *what kind* of website, *for whom*, *with what tech*. Then proceed.

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

## Step 5 (optional) — Persist the glossary

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
