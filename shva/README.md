# shva

> Shiva's personal Claude Code command pack.
> Commands in this plugin start with `/shva:` — that's the `shva` namespace tag.
> (Yes, the missing "i" is on purpose. Easier to remember, impossible to collide.)

## v0.1.0 — `/shva:brief-me`

**Pre-project vocabulary briefing for any GenAI build.**

In the GenAI era, syntax is cheap and vocabulary is the bottleneck. The sharper you can name what you want, the better the AI's output. This command generates a domain-specific glossary *before* you start a project, so your first instructions land cleanly instead of triggering hours of drift.

### Usage

```
/shva:brief-me <project-type>
```

Or run blank to be prompted:

```
/shva:brief-me
```

### What you get

1. **20–25 term glossary** in three buckets:
   - 🎨 **Creative / Style** — how things look, sound, feel
   - ⚙️  **Technical / Process** — how things are built or run
   - 💬 **Prompt / Direction** — words you'll actually say to the AI
2. **3 sharp clarifying questions** — aesthetic refs, scope, constraints
3. **A correction-coda prompt** to paste before your real project brief — turns Claude into a real-time vocabulary coach
4. **Optional save** — write the glossary to `.shva/glossaries/<slug>-<date>.md` in the current project

### Domains it handles

Domain-agnostic by design:

- 🕹️ Browser games (Phaser, p5.js, Three.js)
- 📊 Web apps & dashboards (Next.js, shadcn, Tailwind)
- 🛒 E-commerce
- 📱 Mobile-first apps
- 🎬 AI video (Runway, Kling, Pika)
- 🎵 AI music (Suno, Udio, ElevenLabs Music)
- 🖼️ AI art (Midjourney, Flux, Nano Banana)
- 🗣️ Podcasts & audio drama (ElevenLabs, voice acting)
- 📑 Slide decks & docs
- ✍️ Copywriting & editorial

If your domain isn't listed, the command still works — `brief-me` infers the relevant vocabulary from the project type you describe.

### Why this is `/shva:` and not `/brief-me`

Personal namespace. Three reasons:

1. **Memory tag** — when I see `/shva:*` in any skill list, I know it's mine.
2. **Future-proof** — more personal commands will live here (`/shva:rip`, `/shva:think-with-me`, etc.) without polluting global namespace.
3. **Collision-proof** — "shva" (no `i`) doesn't conflict with anything in the wider Claude ecosystem.

## Installation

```bash
# 1. Add the marketplace (one-time)
/plugin marketplace add ~/Python\ Projects/shva-marketplace

# 2. Install the plugin
/plugin install shva@shva
```

After editing any command file, reload with:

```bash
/plugin uninstall shva@shva
/plugin install shva@shva
```

## Source

The `/shva:brief-me` workflow is distilled from a 17-page Perplexity exchange in May 2026 about pre-project vocabulary briefings — the realisation that in the GenAI era, the developer's leverage moved from syntax to vocabulary and intent. The Perplexity transcript is preserved in the workspace where this plugin was first scaffolded.

## License

Personal use. Fork freely if useful — drop the `shva` prefix and rename to your own.
