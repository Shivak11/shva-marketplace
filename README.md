# shva — Shiva's personal Claude Code marketplace

> **Personal**, not work. Tools that aren't tied to any single product.
> The `shva` namespace = "this is mine."

## Plugins

| Plugin | Version | What it does |
|---|---|---|
| [`shva`](./shva) | 0.8.0 | Personal command pack: `/shva:brief-me`, the SHVA LinkedIn writer, the Medium writer/poster, and the teaching pair. v0.6.0 added `/shva:worksheet-generator` (AI-resistant participant worksheets, HTML then ReportLab PDF). v0.7.0 added `/shva:teaching-designer` (the facilitator-side session plan, spoken script, and interactive lesson HTML). v0.8.0 added three workflow skills from matured wiki methods: `/shva:genai-use-case-finder` (fills a prioritized GenAI use-case portfolio for a real org), `/shva:mdp-source-finder` (live source pack for a session, indexed by session beat, feeds teaching-designer), and `/shva:persona-profile-from-text` (evidence-anchored mirror or voice-harvest profile from a person's own writing). |

## Why a separate marketplace

I keep `rehearsal-dev` (in `~/Python Projects/atom-creator-plugin/`) for product work — atom-creator, case-writer, rehearsal-taste, and friends. That marketplace is scoped to Rehearsal.

`shva-marketplace` is for **everything else** — cross-cutting personal tools that should outlive any single product. Vocabulary scaffolds, prompt patterns, personal accelerators.

## Local install

```bash
# 1. Add the marketplace (one-time)
/plugin marketplace add ~/Python\ Projects/shva-marketplace

# 2. Install plugins from it
/plugin install shva@shva
```

Verify with `/shva:help`.

## Adding a new personal command

Inside `shva/commands/<name>.md`, frontmatter format:

```yaml
---
description: "What this command does. Used by Claude to decide when it's relevant."
allowed-tools: ["Read", "Write", "AskUserQuestion", "Bash"]
model: sonnet
argument-hint: "[hint shown in command palette]"
---
```

Then register it in `shva/.claude-plugin/plugin.json` under `commands`, and reinstall:

```bash
/plugin uninstall shva@shva && /plugin install shva@shva
```

## Naming convention

- **Marketplace name:** `shva` (single word, no hyphen)
- **Plugin name:** `shva` (matches marketplace; only one plugin for now)
- **Command names:** kebab-case, verb-led if possible (`brief-me`, not `briefing`)
- **Personal tag:** the `shva` prefix in any namespace = mine

## Related

- Work plugins → `~/Python Projects/atom-creator-plugin/` (marketplace `rehearsal-dev`)
- This marketplace is intentionally minimal — small surface area, easy to maintain.
