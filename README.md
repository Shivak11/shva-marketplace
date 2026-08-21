# shva — Shiva's personal Claude Code marketplace

> **Personal**, not work. Tools that aren't tied to any single product.
> The `shva` namespace = "this is mine."

## Plugins

| Plugin | Version | What it does |
|---|---|---|
| [`shva`](./shva) | 0.9.0 | Personal command and skill pack for cross-cutting work. v0.9.0 adds `/shva:meditate`: Shiva's three-mode reflection and judgment ritual for artifacts, sessions, and taste, with the five-question Aliveness Review, counterexample testing, explicit record boundaries, and no automatic wiki promotion. |

## Why a separate marketplace

I keep `rehearsal-dev` (in `~/Python Projects/atom-creator-plugin/`) for product work — atom-creator, case-writer, rehearsal-taste, and friends. That marketplace is scoped to Rehearsal.

`shva-marketplace` is for **everything else** — cross-cutting personal tools that should outlive any single product. Vocabulary scaffolds, prompt patterns, personal accelerators.

## Claude Code marketplace install

```bash
# 1. Add the marketplace (one-time)
/plugin marketplace add ~/Python\ Projects/shva-marketplace

# 2. Install plugins from it
/plugin install shva@shva
```

Verify with `/shva:help`.

Update an existing Claude Code installation after a release:

```bash
claude plugin marketplace update shva
claude plugin update shva@shva --scope user
```

This preserves the namespaced invocation `/shva:meditate`.

## Codex, Cursor, and Claude Code skill parity

Install only the `meditate` skill as a deterministic global copy in all three harnesses:

```bash
npx skills add https://github.com/Shivak11/shva-marketplace \
  --skill meditate --global \
  --agent codex --agent cursor --agent claude-code \
  --yes --copy
```

The standalone copies live under `~/.codex/skills/meditate`, `~/.cursor/skills/meditate`, and `~/.claude/skills/meditate`. Claude Code users who already install the full SHVA plugin should prefer the marketplace update above for the `/shva:meditate` namespace; the global copy is the explicit skill-only parity path.

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
