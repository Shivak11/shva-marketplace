---
name: brief-me
description: Run Shiva's pre-project vocabulary briefing for any GenAI build or technical workflow. Use when the user invokes /shva:brief-me, says "brief me", asks for a SHVA brief, or asks to understand a domain before building. Produces a 20-25 term glossary, 3 sharpening questions, correction coda, and a mandatory HTML visual mental model unless the user explicitly opts out.
---

# SHVA Brief-Me Skill

Use this skill when the user asks for `/shva:brief-me`, `brief-me`, a SHVA brief, or a pre-project vocabulary briefing.

## Required Output

Deliver all of these, in this order:

1. A 20-25 term glossary in three buckets:
   - Creative / Style: aesthetic vocabulary, mood, tone, composition, genre.
   - Technical / Process: engines, formats, controls, mechanics, lifecycle.
   - Prompt / Direction: terms the user can actually use in future prompts.
2. Exactly 3 clarifying questions:
   - one about aesthetic/reference points,
   - one about scope/fidelity,
   - one about constraints.
3. The correction coda:

> "Now, given these terms, here's what I'm building: **[your idea]**.
> Flag any terms I'm using incorrectly and suggest better vocabulary
> before you write any code or output."

4. A visual mental model as an HTML explainer file, unless the user explicitly says `no visual`, `glossary only`, `skip the diagram`, or similar.

## HTML Visual Hard Gate

The visual is not optional by default. Do not finish a `brief-me` request with only prose, a widget call, or a chat summary.

Before final response, verify that one of these is true:

- an HTML explainer file was created and linked in the final response, or
- the user explicitly opted out of the visual.

If the current project is writable, create the file under `docs/` using a descriptive slug, for example:

`docs/<topic>-brief.html`

If the current project is not writable, create it under `/private/tmp/` and link that path.

## Visual Shape

The HTML explainer should be a single page with:

- one running metaphor, used consistently,
- one main diagram with 4-6 nodes,
- 4-6 short explanation beats,
- a small companion visual for each beat,
- warm but plain language,
- no comparison tables unless the user asks,
- no exhaustive glossary inside the visual.

Use inline SVG or simple HTML/CSS. Avoid relying on external assets.

## Discipline

- Skip obvious vocabulary.
- Prefer terms the user will use while instructing AI.
- Do not make the glossary a debugging manual.
- Definitions should be simple enough for a smart non-specialist.
- The visual should make the domain click, not inventory every term.
- Final answer must include the HTML file path and a brief note that the visual was created.
