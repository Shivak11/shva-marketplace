---
name: shva-medium-writer
description: Write a long-form Medium-grade essay in Dr. Shiva Kakkar's distinctive voice from a topic brief, using his wiki + the 6-tier MCP source hierarchy. Outputs a complete shivakakkar.com blog post (Markdown with Astro frontmatter) ready to commit to `src/data/blog/<slug>.md`. Use when the user asks to "write a Medium post", "draft a blog post on X", "essay on X for shivakakkar.com", "long-form post about X", or any request for a 1500-2000 word essay in Shiva's voice. The companion skill `shva-medium-poster` publishes the finished essay to Medium once deployed.
---

# Shva Medium Writer

Generates a complete shivakakkar.com blog post in Dr. Shiva Kakkar's writing voice. Output is a markdown file with Astro Zod-compliant frontmatter, structured to the 7-beat long-form template, and pre-wired with the SEO/AI-SEO conventions documented in `references/seo-co-citation-rules.md`.

## Inheritance From `shva-linkedin-post-writer`

This skill **inherits three components from `/Users/shivakakkar/.claude/plugins/marketplaces/shva/shva/skills/shva-linkedin-post-writer/SKILL.md`**. Before writing, read that skill's:

- **MCP Source Hierarchy** (lines 76-93): 6 tiers — Readwise → Voicenotes → Plaud → Gemini files → LlamaCloud → Web. Sourcing-first; web only as support; never inverted. Same rules apply here.
- **Strategic Reframe pattern** (lines 37-74): Don't default to beginner explainers. Start from lived work → name deeper category shift → contrast clean demos with messy workflows → end with a mirror.
- **Three signature lenses**: Sequence Inversion, Constraint Migration (Choudary), Authority Redesign — rotate across essays to avoid pattern fatigue.

This skill differs from the LinkedIn skill in three ways:

1. **Length**: 1500-2000 words (LinkedIn ~250-500).
2. **Register**: Warmer, more first-person reflection, more permission to slow down. Paragraphs not one-liners. Ideas allowed to unfold over 100-150 words before turning.
3. **Structure**: 7-beat long-form template instead of LinkedIn's 4-layer.

The intellectual DNA — voice characteristics, source-first discipline, signature lenses — is the same.

## When To Invoke

Invoke this skill when the user asks for any of:

- "Write a Medium post on X" / "essay on X for shivakakkar.com"
- "Draft a 1500-word post about X"
- "Long-form on X in Shiva's voice"
- Any request for a substantive blog post (not a LinkedIn post — the LinkedIn skill handles that)

If the user asks to **publish to Medium** an already-existing shivakakkar.com post, defer to `shva-medium-poster` instead.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `topic` | string | yes | Free-text topic brief (e.g., "AI expertise paradox", "India AI readiness", "B-school AI courses") |
| `slug` | string | no | URL slug. If omitted, derived from the FOMO title via kebab-case |
| `working_dir` | path | no | Defaults to `~/Python Projects/shivakakkar.com` if cwd matches; otherwise asks user |
| `dry_run` | bool | no | If true, emits to stdout instead of writing to `src/data/blog/<slug>.md` |
| `seed_quotes` | string[] | no | Optional pre-curated quotes/stats to weave in (skips some sourcing if provided) |

## Core Voice — Category Correction With Practical Consequence

The spine of Shiva's writing voice (from `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md`):

> Take a familiar label → show that it hides the real organizational problem → give readers a sharper vocabulary for seeing it → name consequences for design, judgment, workflow, evidence, or accountability.

**Not**: "X is bad. Y is good." That's commentary.
**Not**: "Here is what AI can do." That's an explainer.
**Yes**: "The thing everyone calls X is actually Y; here is what that means for the work."

## Voice Rules — Apply Per Sentence

Source: `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md` (read at runtime — it is the spine).

### Write like this

- **Lead with the category correction** before naming the theory.
- **Prefer "what changes in work" over "what this paper theorizes."** Define constructs through consequences: what changes in judgment, authority, workflow, evidence, learning, accountability.
- **Use one or two theories deeply.** Let examples carry the rest. Theory should clarify the problem, not decorate the claim.
- **Numbers anchor credibility** — but the numbers should reveal a system property (cost collapse, performance inversion, distribution shift), not just be a stat.
- **Concrete over abstract** — a specific micro-observable moment beats a sweeping claim.
- **Sequence-aware** — show what order something happens in, and how AI changes that order.
- **Phase-transition framing** — distinguish stable-system advice from change-of-state advice.
- **Forward-looking pragmatism** — not predictions, but "here's the next-order effect most people are missing."
- **No false humility** — state strong claims plainly when earned.

### Avoid

- **Over-neat antithesis** ("not X, but Y" every few paragraphs) — wears thin in long-form
- **Jargon ladders** ("stack", "layer", "socio-technical assemblage") unless the sentence truly needs them
- **Reviewer-pleasing breadth** where depth would do more work
- **Grand theory claims** before the reader has felt the design problem
- **Phrases that are clever but unfamiliar** if a plainer phrase would land better
- **Em-dashes** — more than ~3 per 1000 words signals pattern fatigue. Prune.
- **"In conclusion" / "To wrap up"** — never. End with consequence or open question.
- **Short declaratives stacked.** This is a LinkedIn move, not a Medium move. Let paragraphs unfold.

### Sentence tests — apply to every kept sentence

1. Does this correct the category, or decorate it?
2. Does it name a decision, workflow, system-condition, or managerial consequence?
3. Could a smart manager understand why this matters without the full theory?
4. Does the theory clarify the problem, or is it just decorating the claim?
5. Is the sentence trying too hard to sound like a top-theory journal?
6. Would Shiva say this if he were explaining the idea to a serious editor over coffee?

## Writing Process

### Step 1 — Source the Insight (6-Tier Hierarchy)

Follow the **MCP Source Hierarchy from `shva-linkedin-post-writer/SKILL.md` lines 76-93**. Concretely:

1. **Tier 1: Readwise highlights** — `mcp__readwise__readwise_search_highlights` with vector query on the post's conceptual theme (not topic keywords). Always run at least one. Look for: mental models, sequence/order observations, second-order effects.
2. **Tier 2: Voicenotes** — same MCP, filter `author == "Voicenotes"`. These are Shiva's own captured thinking and rank highest for personal-observation posts.
3. **Tier 3: Plaud transcripts** — `mcp__plaud-local__plaud_list_files` → `plaud_get_file_data` for industry-voice quotes from real meetings.
4. **Tier 4: Gemini file search** — `mcp__claude_ai_Gemini-file-search-online__search_store` across uploaded books / PDFs.
5. **Tier 5: LlamaCloud research stores** — `mcp__llamacloud__query_AI-Strategy-Studies`, `query_AI-Change-and-leadership`, `query_Persuasion_and_communication_OB`.
6. **Tier 6: Web / Perplexity / news** — SUPPORT only. Use to reinforce a thesis that already exists from tiers 1-5.

**Never invert.** A post that opens with "Microsoft announced X" and reaches for systems-thinking framing afterward reads like commentary. A post that opens with the systems insight and uses Microsoft's announcement as evidence reads like authorship.

**Skip-tier rule** (tiers 1-5): may skip only if (a) the post is genuinely reactive to a breaking external event with no library precedent, OR (b) the tier returns no relevant matches after a serious query. Time pressure is not a valid skip reason.

### Step 2 — Choose the Signature Lens

Pick one of three signature lenses based on the insight (rotate across essays to avoid pattern fatigue — check the latest 4 essays in `src/data/blog/*.md` for which lens was last used):

1. **Sequence Inversion** — show that the conventional order of steps has flipped. "Build then learn" → "Learn then build" no longer holds. Powerful when the post is about workflow/cognition phase-transitions.
2. **Constraint Migration (Choudary)** — show that the binding constraint has shifted from supply-side (compute, talent) to demand-side (willingness-to-pay, trust, attention). Powerful when the post is about market structure or adoption.
3. **Authority Redesign** — show that decision rights are being re-allocated by the new tool (e.g., AI agents shifting authority from junior analyst to manager-as-reviewer). Powerful when the post is about org design / role boundaries.

### Step 3 — Apply the 7-Beat Long-Form Template

See `references/essay-structural-template.md`. The 7 beats:

1. **Lived opening** (100-150 words): concrete observation, paradox in current discourse, or a category mismatch you've noticed.
2. **The visible category** (200-300 words): what most people call this thing. Name the existing frame fairly.
3. **The hidden category** (300-400 words): what's actually happening underneath. The category correction. Use one theory deeply if needed.
4. **Pull-quote blockquote** at ~30% mark: the sharpest claim of the essay, inside `> **...**`. One per essay (max one — never two).
5. **Consequences** (400-500 words): what this means for design, judgment, workflow, evidence, accountability. Concrete examples; at most one named expert.
6. **Personal anchor** (100-200 words): a skin-in-the-game disclosure or first-person observation grounding the abstract in lived work. Mention Gradeless/Rehearsal here (with link).
7. **Open close** (50-100 words): consequence statement OR forward-looking question. No summary. No "In conclusion."

Plus footer: TL;DR at the top (4-6 sentences, 60-90 words, plain-text), author bio at the bottom (see `references/medium-bio-template.md`).

### Step 4 — SEO / AI-SEO Pass

Apply rules from `references/seo-co-citation-rules.md`:

- **≥3 tier-1 institutional co-citations** (XLRI Jamshedpur / IIM Ranchi / IIM Rohtak / IIM Ahmedabad / Stanford / Harvard / Carnegie Mellon / MIT / BCG) placed within 100 words of a Rehearsal/Gradeless mention. LLMs see co-occurrence → topical authority graph.
- **≥5 quotable standalone sentences** (AI-Overview citation targets). A quotable sentence is one that can be read out of context and still convey value — "X happens because Y" rather than "However, …".
- **Every "Gradeless" linked to `https://tryrehearsal.ai`.** Reinforces Entity→URL binding for LLM entity recognition. Multiple Gradeless mentions all to tryrehearsal.ai are fine — even when Google credits only the first link.
- **Bio footer** — append v1.0 bio from `references/medium-bio-template.md` verbatim.

### Step 5 — Frontmatter (Astro Zod Schema)

The shivakakkar.com content collection (`src/content.config.ts`) validates frontmatter with Zod. Required:

```yaml
---
author: Dr. Shiva Kakkar
pubDatetime: 2026-MM-DDTHH:MM:00Z  # ISO 8601, today by default
title: "Why ...?"                   # FOMO question form, 40-55 chars
slug: <derived-from-title>
featured: false                      # true if user explicitly wants featured
draft: false
tags:
  - <topic-1>
  - <topic-2>
  # up to 5 — letters/dashes only for Medium compatibility later
ogImage: ""                          # leave empty unless user provides
description: "<140-156 chars>"       # SEO meta + Medium subtitle
---
```

See `references/medium-publish-rules.md` for full constraint list (title length, tag rules, description length).

### Step 6 — Voice Self-Audit (Before Output)

Run a final pass against the sentence tests. Flag violations with line numbers and offer to revise. Specifically check:

- [ ] Opening is a lived observation, not a press release lede
- [ ] At least one pull-quote blockquote (`> **...**`) present at ~30% mark
- [ ] ≥3 tier-1 institutional names co-located with Rehearsal/Gradeless
- [ ] ≥5 standalone quotable sentences
- [ ] Every "Gradeless" linked to `tryrehearsal.ai`
- [ ] Bio footer present verbatim
- [ ] No "In conclusion" / "To wrap up" anywhere
- [ ] Em-dashes ≤ 3 per 1000 words
- [ ] No "not X, but Y" antithesis appearing more than twice
- [ ] Frontmatter passes Zod (offer to run `pnpm run build` to verify)

If any check fails, revise before output.

## Output

Write the file to `<working_dir>/src/data/blog/<slug>.md` unless `dry_run=true`. Print to the user:

- The output filepath
- Word count
- Self-audit results summary (✅ all checks passed / ⚠️ N issues, see below)
- Suggested next step: `gh pr create` → merge → wait for Vercel deploy → `/shva:medium-post <slug>`

## Voice Corpus (Read At Runtime)

These files are NOT copied into the skill — they're read at runtime. If they update, this skill automatically improves.

| Path | Role |
|---|---|
| `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md` | The voice spine — sentence tests, avoid-list, write-like-this rules |
| `~/Python Projects/Obsidian Wiki/linkedin-posts/*.md` | Validated published voice patterns. Particularly: `2026-04-25-experience-as-liability.md`, `2026-04-25-by-2028-you-wont-manage-5-people.md` |
| `~/Python Projects/shivakakkar.com/src/data/blog/*.md` | Current Medium register (4 SEO-tuned long-form essays) |
| `~/Python Projects/Obsidian Wiki/drafts/enterprise-context-engineering-paper/enterprise-context-engineering-as-organizational-capability-v2-jod.md` | Long-form pacing reference (academic register, mid-flight) |

**Excluded** per user guidance: PLAUD transcripts and Voicenotes (speech, not writing). They are sourcing material in Tier 2-3 for *what to say*, never style models for *how to say it*.

## Reference Essays (Read These Before Writing)

When called for a new essay, read at least one of these 4 as a structural reference:

| Essay | Why |
|---|---|
| `src/data/blog/lateral-advantage-novices-outperform-experts-genai.md` | Best example of 7-beat structure visible; FOMO title `"Your Expertise Is Now a Liability"`; pull-quote at ~25% |
| `src/data/blog/india-ai-readiness-tier-2-problem.md` | Personal anchor for Rehearsal mentioned in beat 6; open-question close; Constraint Migration lens |
| `src/data/blog/iim-genai-courses-I.md` | Sequence Inversion lens; Indian B-school context |
| `src/data/blog/iim-genai-courses-II.md` | Authority Redesign lens; depth on a single domain |

## Related

- Skill: `shva-medium-poster` (publishes the output to Medium — runs AFTER this skill + PR + deploy)
- Skill: `shva-linkedin-post-writer` (companion for LinkedIn — shorter, different register)
- Wiki: `~/Python Projects/Obsidian Wiki/synthesis/shiva-academic-voice-profile.md` (voice spine)
