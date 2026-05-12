---
description: "Write a long-form Medium-grade essay in Dr. Shiva Kakkar's voice. Outputs a complete shivakakkar.com blog post (Markdown + Astro frontmatter) ready to commit to src/data/blog/<slug>.md. Sources from wiki + 6-tier MCP hierarchy."
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "WebSearch", "WebFetch"]
model: opus
argument-hint: "<topic, e.g. 'AI expertise paradox' or 'India AI readiness'>"
---

# /shva:medium-write — Long-Form Essay In Shiva's Voice

> Drafts a 1500-2000 word essay on `$ARGUMENTS` in Dr. Shiva Kakkar's writing voice, using his wiki + the 6-tier MCP source hierarchy. Outputs a shivakakkar.com blog post with Astro frontmatter, ready to commit to `src/data/blog/<slug>.md`.

**Input:** `/shva:medium-write <topic>` *(or run blank to be prompted)*
**Output:** Markdown file in `src/data/blog/<slug>.md` + audit report

---

## Step 1 — Load the skill

Open and read this skill in full before doing anything else:

```
/Users/shivakakkar/.claude/plugins/marketplaces/shva/shva/skills/shva-medium-writer/SKILL.md
```

The skill defines:
- Inheritance from `shva-linkedin-post-writer` (6-tier source hierarchy, 3 signature lenses)
- The 7-beat long-form structural template
- Voice rules from `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md`
- SEO/AI-SEO rules (≥3 tier-1 co-citations, ≥5 quotable sentences, Gradeless×links)
- Astro Zod frontmatter schema

Also read the 4 reference files under `shva-medium-writer/references/` for structural template, bio template, publish rules, and SEO rules.

## Step 2 — Resolve the topic

If `$ARGUMENTS` is empty, ask the user:

> What topic should the essay cover? Aim for a category correction — what's the familiar label everyone uses, and what's actually happening underneath?

If `$ARGUMENTS` is present, treat it as the topic brief and proceed.

## Step 3 — Confirm working directory

Check whether the current working directory is the shivakakkar.com repo:

```bash
test -f src/content.config.ts && grep -q 'shivakakkar' src/content.config.ts && echo "in-shivakakkar-com" || echo "elsewhere"
```

If "elsewhere", ask the user whether to:
- Write to `~/Python Projects/shivakakkar.com/src/data/blog/<slug>.md` (the canonical home)
- Write to stdout only
- Cancel

## Step 4 — Execute the writing process

Follow the skill's writing process in order:

1. **Source the insight** — 6-tier hierarchy, sourcing-first then web-as-support. Tiers 1-5 are sourcing; tier 6 is reinforcement.
2. **Choose a signature lens** — Sequence Inversion, Constraint Migration, or Authority Redesign. Check the latest 4 essays in `src/data/blog/*.md` to avoid lens-repetition.
3. **Apply the 7-beat template** — TL;DR → lived opening → visible category → hidden category → pull-quote → consequences → personal anchor → open close.
4. **SEO/AI-SEO pass** — ≥3 tier-1 co-citations, ≥5 quotable sentences, every Gradeless linked, bio footer verbatim.
5. **Frontmatter** — Astro Zod compliant; title FOMO question form 40-55 chars; description 140-156 chars; up to 5 tags following Medium tag rules.
6. **Voice self-audit** — sentence tests per skill SKILL.md.

## Step 5 — Write the file

Unless `dry_run` is requested, write to `<working_dir>/src/data/blog/<slug>.md`. The slug is derived from the FOMO title via kebab-case.

## Step 6 — Output the audit report

Print to the user:
- Filepath of the written file
- Word count
- Self-audit results (✅ or ⚠️ with details)
- Suggested next step:
  ```
  Next: 
    1. Review the draft
    2. Open PR via `gh pr create` from a feature branch
    3. Merge → Vercel auto-deploys
    4. Once live, run `/shva:medium-post <slug>` to publish to Medium
  ```

## Notes

- This command does NOT automatically open a PR. The user reviews first.
- This command does NOT publish to Medium. `/shva:medium-post` is the publishing step.
- This command does NOT auto-commit. The user can run `git add` + `git commit` themselves after review.
- Voice corpus is read at runtime — if `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md` updates, this command automatically improves.

---

*Skill source: `~/.claude/plugins/marketplaces/shva/shva/skills/shva-medium-writer/`*
*Companion: `/shva:medium-post` (publishes the output to Medium once deployed)*
