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
| `/shva:shva-medium-writer <topic>` | Drafts a 1500-2000 word Medium-grade essay in Shiva's voice. Uses wiki + 6-tier MCP source hierarchy. Outputs to `src/data/blog/<slug>.md` with Astro frontmatter, FOMO question title, ≥3 tier-1 institutional co-citations, and the v1.0 bio footer. | **Before opening a PR on shivakakkar.com.** Anywhere you'd write a long-form post. |
| `/shva:shva-medium-poster <url-or-slug>` | Publishes a deployed shivakakkar.com post to Medium under "Built at Rehearsal" via Chrome automation. Trims " \| Dr. Shiva Kakkar" title suffix, deletes embedded images + empty-paragraph gaps, sets up to 5 tags, submits for editorial review (default). | **After the post is live on shivakakkar.com.** Once Vercel deploy is propagated. |
| `/shva:shva-linkedin-post-writer` | Write LinkedIn posts in Shiva's systems-thinker voice. Three signature lenses, 6-tier source hierarchy, Hook/Cringe Test gates, god-mode pipeline. | **For any LinkedIn post request.** Voicenote-to-post, news reaction, content system runs. |
| `/shva:worksheet-generator [topic]` | Turns a topic plus rough ideas into an AI-resistant, self-contained teaching worksheet (HTML first, then a ReportLab PDF) in Shiva's voice. Asks intake questions, researches in parallel across the wiki + LlamaCloud + Readwise + YouTube + book-search + Mobbin, builds a carried-forward arc with one worked example, applies the hard formatting rules, and ships clean print pages. | **When you need a hands-on workshop or session sheet.** A decision, tension, workflow, or skill traced to its end. |
| `/shva:help` | This screen. | When you forget what's installed. |

---

## Quick examples

```
/shva:brief-me 2D browser game in Phaser
/shva:brief-me AI music track in Suno — lo-fi hip-hop
/shva:brief-me Midjourney editorial photography series
/shva:brief-me                                          # asks you what you're building

/shva:worksheet-generator GenAI change management for HR leaders
/shva:worksheet-generator                              # asks you what you want to teach

/shva:shva-medium-writer AI expertise paradox
/shva:shva-medium-writer Why India's AI talent builds for Americans
/shva:shva-medium-writer                                      # asks you for a topic

/shva:shva-medium-poster https://www.shivakakkar.com/posts/india-ai-readiness-tier-2-problem/
/shva:shva-medium-poster india-ai-readiness-tier-2-problem
/shva:shva-medium-poster                                       # asks you for a URL or slug
```

---

## Typical Medium workflow

```
1. /shva:shva-medium-writer "AI in Indian B-schools"
   → drafts src/data/blog/why-ai-in-iim-courses-fails.md
2. Review the draft; edit if needed
3. gh pr create  (PR flow — auto-mode blocks pushes to main)
4. User merges via GitHub UI
5. Wait ~60s for Vercel deploy to propagate
6. /shva:shva-medium-poster why-ai-in-iim-courses-fails
   → Medium draft submitted to Built at Rehearsal, pending review
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
