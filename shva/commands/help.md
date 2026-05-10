---
description: "Show what /shva can do. Lists all commands in the personal pack with examples."
allowed-tools: []
model: haiku
---

# /shva:help — What's in the personal pack

> Personal command pack. The `shva` namespace = "this is mine, not work."
> If the prefix is `shva`, Shiva built it for cross-cutting personal use.

---

## Available commands

| Command | What it does | When to use |
|---|---|---|
| `/shva:brief-me [project-type]` | Returns a 20–25 term domain glossary in three buckets (Creative/Style · Technical/Process · Prompt/Direction), then 3 clarifying questions, then a "flag terms I'm using incorrectly" coda. | **Before starting any new GenAI build.** Code, design, video, music, art — domain-agnostic. The 5-minute step that prevents 5-hour drifts. |
| `/shva:help` | This screen. | When you forget what's installed. |

---

## Quick examples

```
/shva:brief-me 2D browser game in Phaser
/shva:brief-me AI music track in Suno — lo-fi hip-hop
/shva:brief-me Midjourney editorial photography series
/shva:brief-me SaaS dashboard in Next.js with shadcn
/shva:brief-me                                          # asks you what you're building
```

---

## Philosophy

> "In the GenAI era, syntax is cheap. Vocabulary is the bottleneck."

Every command in `shva` exists to sharpen the **input** to AI tools, not
the output. They're prompt scaffolds, not generators. The bet is that a
5-minute briefing in front saves hours of back-and-forth later.

---

*Plugin source: `~/Python Projects/shva-marketplace/shva/`*
*Issues / changes: edit the markdown directly, then `/plugin uninstall shva@shva && /plugin install shva@shva` to reload.*
