# Learnings Protocol — Self-Evolution Loop

> **What this covers:** The 4-stage self-learning lifecycle (CAPTURE → STAGE → PROMOTE → ENFORCE), JSONL entry format, capture triggers, promotion rules, and the LinkedIn-specific error taxonomy. Adapted from atom-creator's `shared/learnings-protocol.md`.
>
> **When to load:** During god-mode Step G6 (Learnings Capture) and during the manual review step (`/shva:shva-linkedin-post-writer learn`).

## Table of Contents

- [Overview](#overview) — the 4-stage CAPTURE → STAGE → PROMOTE → ENFORCE lifecycle
- [File Locations](#file-locations) — where the JSONL and human-readable log live
- [Error Taxonomy (LinkedIn-specific)](#error-taxonomy-linkedin-specific) — `lk_*` domain prefixes for routing promotions
- [JSONL Entry Format](#jsonl-entry-format) — schema with field definitions
- [Capture Triggers](#capture-triggers) — auto-capture (god-mode) + user-signal capture + manual
- [Auto-Capture Procedure](#auto-capture-procedure)
- [Checkpoint at God-Mode Start](#checkpoint-at-god-mode-start)
- [Promotion (manual review cycle)](#promotion-manual-review-cycle) — recurrence ≥ 2 → user-approved → bake into target file
- [Promotion Routing Table](#promotion-routing-table) — domain → target file mapping
- [Pruning](#pruning) — how to prevent the JSONL from bloating
- [Reference: example end-to-end learning trajectory](#reference-example-end-to-end-learning-trajectory)

---

## Overview

The skill evolves its own rules through this lifecycle:

```
CAPTURE → STAGE → PROMOTE → ENFORCE
   ↑                          │
   └─────── new findings ─────┘
```

- **CAPTURE:** Failure events (audit fails, user thumbs-down, regen loops) auto-write entries to `.claude/linkedin-post-learnings.jsonl`
- **STAGE:** Entries sit as `NEW` status, visible at every god-mode start as a checkpoint count
- **PROMOTE:** When recurrence ≥ 2 across different sessions, propose promotion to permanent rules in SKILL.md or reference files
- **ENFORCE:** Promoted rules embed in the skill, loaded every run, prevent future recurrence

This mirrors atom-creator's pattern exactly — same lifecycle, same JSONL shape, same checkpoint behavior.

---

## File Locations

| File | Purpose | Tracked in git? |
|---|---|---|
| `.claude/linkedin-post-learnings.jsonl` | Per-user staging area for NEW findings | NO (.gitignore) |
| `.claude/linkedin-post-learnings.md` | Human-readable curated log (PROMOTED entries + session notes) | YES |
| `SKILL.md` (this skill) | Promotion target for behavioral rules | YES |
| `references/visual-philosophy-linkedin.md` | Promotion target for visual-style rules | YES |
| `references/seedream-prompt-rules.md` | Promotion target for SeedDream-specific rules | YES |

The `.jsonl` is machine-readable per-user state. The `.md` is the human-readable log. Both coexist (same as atom-creator).

---

## Error Taxonomy (LinkedIn-specific)

Each finding is classified by domain prefix. The prefix determines which target file receives the promoted rule.

| Domain Prefix | Description | Promotion Target |
|---|---|---|
| `lk_visual_decision` | Wrong yes/no on the image-need gate (image generated when text-only would have been better, or vice versa) | `references/visual-philosophy-linkedin.md` "Visual Need Decision Gate" |
| `lk_visual_classify` | Wrong type classification (Type 1 chosen but post wasn't really company-driven, etc.) | `references/visual-philosophy-linkedin.md` "Classification Algorithm" |
| `lk_visual_style` | Style didn't match post mood (provocative post + soft watercolor image) | `references/visual-philosophy-linkedin.md` "Theme x Visual Type Affinity" |
| `lk_visual_palette` | Palette lacked semantic meaning OR clashed with post tone | `references/visual-philosophy-linkedin.md` "Palette" |
| `lk_visual_principle` | Lateral image applied <3 of the 8 principles, became generic | `references/visual-philosophy-linkedin.md` "8 Lateral Thinking Principles" |
| `lk_seedream_render` | SeedDream-specific render failure (faces visible, hands glitched, text rendered, white-passing bg) | `references/seedream-prompt-rules.md` SD1-SD5 |
| `lk_seedream_prompt` | Prompt structure issue (too long, no Chinese keywords, hex in body) | `references/seedream-prompt-rules.md` Two-Part Structure |
| `lk_seedream_aspect` | Aspect ratio mismatch (square when 1.91:1 needed, etc.) | `references/seedream-prompt-rules.md` Aspect Ratio for LinkedIn |
| `lk_post_voice` | Post voice drift (softening, "constructive B2B" creep, kostja overrode Shiva) | `SKILL.md` Voice Characteristics or Step 7.5 clash table |
| `lk_post_hook` | Hook archetype mismatch (used Violation Stat where Specific Observation would have landed better) | `SKILL.md` Step 4 Hook archetypes |
| `lk_post_close` | Closing style mismatch (used Direct Challenge in row 5 of rotation when Implied Multi-Audience was due) | `SKILL.md` Step 4 Layer 4 selection guidance |
| `lk_post_clash` | Kostja override applied wrong (kostja's recommendation should have been used; was rejected) | `SKILL.md` Step 7.5 clash table |
| `lk_post_theme` | Theme rotation drift (3 posts of same theme in a row) | `SKILL.md` Step 3 theme rotation |
| `lk_post_length` | Length out of band (too long, too short) AND not justified by exception | `SKILL.md` Post Length section |
| `lk_post_context_layer` | Optional context layer (India / region / sector) missing where it would sharpen, OR forced where it weakens the post | `SKILL.md` India contextualization |
| `lk_engine_failure` | fal.ai or Gemini API failed; pipeline blocked | `references/seedream-prompt-rules.md` Generation Invocation Pattern |

---

## JSONL Entry Format

Each line in `.claude/linkedin-post-learnings.jsonl` is a JSON object:

```json
{
  "id": "2026-04-25-001",
  "date": "2026-04-25",
  "command": "shva-linkedin-post-writer god-mode",
  "post_slug": "ambient-time-sensitive-ai",
  "domain": "lk_seedream_render",
  "severity": "HIGH",
  "trigger": "audit_fail",
  "finding": "SeedDream rendered visible text 'AMBIENT' on the door from the Character-as-Concept prompt despite no labels being requested. SD1 violation — the word 'ambient' in the prose got rendered as literal text.",
  "rule": "When the post's key concept is also a single noun (ambient, watcher, threshold), avoid using that exact noun in the SeedDream prompt body. Substitute with a description of the SHAPE or BEHAVIOR (e.g., 'a presence' instead of 'ambient', 'eye-shape' instead of 'watcher').",
  "applies_to": "seedream-prompt-rules.md SD1",
  "status": "NEW",
  "recurrence": 1,
  "related_ids": [],
  "post_excerpt": "First 100 chars of the post that triggered this finding...",
  "user_signal": null
}
```

### Field Definitions

| Field | Type | Description |
|---|---|---|
| `id` | string | `{date}-{sequence}` — unique per day |
| `date` | string | ISO date of capture |
| `command` | string | Which command captured this (`shva-linkedin-post-writer god-mode`, `shva-linkedin-post-writer`, `shva-linkedin-post-writer learn`) |
| `post_slug` | string | Generated slug for the post (e.g., from the first 4-5 meaningful words) |
| `domain` | string | Error taxonomy prefix from the table above |
| `severity` | string | `HIGH` (only HIGH is auto-captured; LOW/MEDIUM are informational) |
| `trigger` | string | `audit_fail` / `user_thumbs_down` / `regen_loop` / `engine_failure` / `manual_capture` |
| `finding` | string | What went wrong — specific enough to grep for |
| `rule` | string | The corrective rule to prevent recurrence |
| `applies_to` | string | Which file + section this rule should embed into when promoted |
| `status` | string | `NEW` → `PROMOTED` → `ARCHIVED` |
| `recurrence` | number | Count of times this pattern has been seen (across sessions) |
| `related_ids` | array | IDs of similar findings (for recurrence tracking) |
| `post_excerpt` | string | First 100 chars of the post (so you can reconstruct context later) |
| `user_signal` | string \| null | If user explicitly flagged: `thumbs_up` / `thumbs_down` / `requested_regen` / null |

---

## Capture Triggers

### Auto-capture (god-mode runs ONLY)

These fire automatically inside the god-mode pipeline:

1. **Audit fail (Step G5):** Any HIGH-severity audit finding (face visible, white-passing bg, aspect ratio wrong, hands glitched, text rendered) auto-captures with `trigger: "audit_fail"`.

2. **Regeneration loop:** If image generation requires ≥2 regens for the same image, capture with `trigger: "regen_loop"` and `severity: HIGH`. The pattern that caused the regens is the rule.

3. **Engine failure:** If fal.ai fails AND Gemini fallback also fails, capture with `trigger: "engine_failure"` and `domain: "lk_engine_failure"`.

### User-signal capture (any run)

These fire only when the user explicitly signals:

4. **Thumbs down on the post:** User says "this voice is off" / "soften this" / "not punchy enough" / "tighten the close" → capture with `trigger: "user_thumbs_down"`. Domain depends on the specific feedback (`lk_post_voice`, `lk_post_hook`, `lk_post_close`).

5. **Thumbs down on the image:** User says "this image doesn't fit" / "wrong vibe" / "too soft" / "too literal" → capture with `trigger: "user_thumbs_down"` and domain `lk_visual_style` or `lk_visual_decision` (if they wanted no image at all).

6. **User requests a regen with specific reason:** "regenerate but darker" / "use Type 1 instead" → capture with `trigger: "user_thumbs_down"`, severity HIGH, and the reason becomes the finding.

### Manual capture

7. `/shva:shva-linkedin-post-writer learn` (proposed slash command — see "Manual Review Cycle" below): user reviews accumulated entries, can add new ones from session memory, and approves promotions.

---

## Auto-Capture Procedure

Inside god-mode, after every audit or user signal:

1. Classify the finding using the error taxonomy
2. Read existing `.claude/linkedin-post-learnings.jsonl` (if it exists)
3. Fuzzy-match against existing entries (compare `finding` text + `domain`):
   - If similar entry found: increment `recurrence`, append current ID to `related_ids`, update `last_seen` (in extended schema)
   - If no match: create new entry with `recurrence: 1`, `status: "NEW"`
4. Append the new (or updated) entry to `.jsonl`
5. Display checkpoint summary in god-mode output: `📚 Learnings: {N} NEW, {M} PROMOTED. {K} promotion candidate(s).`

---

## Checkpoint at God-Mode Start

At the very beginning of every god-mode run (Step G0):

1. Read `.claude/linkedin-post-learnings.jsonl` if it exists
2. Count entries by status: `{NEW: N, PROMOTED: N, ARCHIVED: N}`
3. Find entries with `status: "NEW"` AND `recurrence ≥ 2` — these are promotion candidates
4. Display the checkpoint:
   ```
   📚 Learnings checkpoint: {N} NEW, {M} PROMOTED.
   {K} promotion candidate(s) ready for /shva:shva-linkedin-post-writer learn.
   ```
5. If `K ≥ 3`: surface a note: "**Strong recommendation: run `/shva:shva-linkedin-post-writer learn` after this post to promote rules.**"

---

## Promotion (manual review cycle)

Promotion is **manual**, not automatic. The `/shva:shva-linkedin-post-writer learn` command (or equivalent) walks through promotion candidates with user approval.

### Trigger conditions

An entry is a promotion candidate when:
- `status: "NEW"`
- `recurrence ≥ 2`

### Proposal format (presented to user during /learn)

```
🔄 Promotion candidates ({K} entries):

1. [{domain}] {rule}
   Seen in: {post_slug_1}, {post_slug_2}
   Severity: {HIGH}
   Target file: {applies_to}
   Proposed insertion location: {section name}
   
   [Approve / Skip / Modify rule text]

2. [...]
```

### On approval

1. Update entry `status` to `"PROMOTED"`
2. Add the `rule` text to the appropriate section in the target file (SKILL.md or a reference file)
3. Annotate the entry: `"promoted_to": "{file}:{section}", "promoted_date": "2026-04-25"`
4. Append a one-line entry to `.claude/linkedin-post-learnings.md` for human review

### Modification path

If the user wants to modify the rule before promoting (clarify, narrow scope, add caveat), they edit the rule text in the proposal. The edited version is what gets written.

---

## Promotion Routing Table

Quick reference for where promoted rules land:

| Domain | Target file | Target section |
|---|---|---|
| `lk_visual_decision` | `references/visual-philosophy-linkedin.md` | "When to Generate (Visual Need Decision Gate)" |
| `lk_visual_classify` | `references/visual-philosophy-linkedin.md` | "Classification Algorithm" |
| `lk_visual_style` | `references/visual-philosophy-linkedin.md` | "Theme x Visual Type Affinity" |
| `lk_visual_palette` | `references/visual-philosophy-linkedin.md` | "Principle 6: Constraint-Based Palette" |
| `lk_visual_principle` | `references/visual-philosophy-linkedin.md` | The relevant principle's section |
| `lk_seedream_render` | `references/seedream-prompt-rules.md` | SD1-SD5 (the relevant rule) |
| `lk_seedream_prompt` | `references/seedream-prompt-rules.md` | "The Two-Part Prompt Structure" |
| `lk_seedream_aspect` | `references/seedream-prompt-rules.md` | "Aspect Ratio for LinkedIn" |
| `lk_post_voice` | `SKILL.md` | "Voice characteristics" or "Step 7.5 clash table" |
| `lk_post_hook` | `SKILL.md` | "Step 4 Layer 1: Hook archetypes" |
| `lk_post_close` | `SKILL.md` | "Step 4 Layer 4: Multi-Audience Hook" closing styles |
| `lk_post_clash` | `SKILL.md` | "Step 7.5 DO NOT APPLY table" |
| `lk_post_theme` | `SKILL.md` | "Step 3: Select Theme from Rotation" |
| `lk_post_length` | `SKILL.md` | "Post Length & Formatting Guidelines" |
| `lk_post_context_layer` | `SKILL.md` | "India context — optional flavor only" |
| `lk_engine_failure` | `references/seedream-prompt-rules.md` | "Generation Invocation Pattern" |

---

## Pruning

When `.claude/linkedin-post-learnings.jsonl` exceeds 25 entries with `status: "NEW"`:
- Sort by `recurrence` (ascending), then `date` (oldest first)
- Archive the lowest-recurrence, oldest entries until count = 15
- Set their `status` to `"ARCHIVED"`

This prevents the JSONL from bloating with one-off failures.

---

## Integration with `.claude/linkedin-post-learnings.md` (human-readable log)

The `.md` file serves as the curated, git-tracked summary log:

```markdown
# LinkedIn Post Writer — Learnings Log

## Promoted rules
- 2026-04-25 — [lk_seedream_render] Avoid using key-concept nouns in prompt body — substitute with shapes (Promoted from learning ID 2026-04-25-001).
- 2026-04-22 — [lk_post_clash] Kostja's "first 140 chars" rule overrode Violation in Cost Arbitrage post — added explicit anti-rule (Promoted from learning ID 2026-04-22-003).

## Open candidates (not yet promoted)
- 2026-04-26 — [lk_visual_style] Soft watercolor on institutional-hypocrisy posts breaks register (recurrence 2)

## Session notes
- 2026-04-25: Tested Type 1 Brand-Driven on a Rehearsal-related Release post. Felt forced. Default Type 3 Lateral was clearly better. Did NOT capture (one-off, not generalizable).
```

The `.md` file is updated when entries are promoted OR when the user manually adds session notes via `/shva:shva-linkedin-post-writer learn`.

---

## Default state on first run

If `.claude/linkedin-post-learnings.jsonl` does not exist:
1. Create it as an empty file
2. Display: "📚 Learnings file initialized. Findings from this run will populate it."
3. Continue normally

If `.claude/linkedin-post-learnings.md` does not exist:
1. Create with header: `# LinkedIn Post Writer — Learnings Log\n\n## Promoted rules\n_(none yet)_\n\n## Open candidates\n_(none yet)_\n\n## Session notes\n_(none yet)_\n`
2. Continue normally

---

## Self-evolution feedback loop summary

Every god-mode run:
1. **Step G0:** Reads JSONL → displays NEW count + promotion candidate count
2. **Step G1-G5:** Pipeline runs (post + visual decision + style + image + audit)
3. **Step G6:** Captures new findings to JSONL with auto-classification
4. **At end of session OR via `/shva:shva-linkedin-post-writer learn`:** Promotions reviewed + applied

Over time, the skill silently absorbs new patterns. Patterns that recur become permanent rules. Patterns that don't recur get archived after 25 NEW entries accumulate.

This is identical in shape to atom-creator's lifecycle. The only differences are:
- Domain prefixes are LinkedIn-specific (`lk_*` instead of `visual_*`/`bio_*`/etc.)
- Promotion targets are this skill's files
- Auto-capture happens during god-mode runs, not during a separate audit command

---

## Reference: example end-to-end learning trajectory

To make the loop concrete, here's how a single rule evolves from one-off observation to permanent enforcement:

**Run 1 (post on AI policy, 2026-04-15):**
- god-mode generates an image with a face visible
- Audit captures: `domain: lk_seedream_render`, `severity: HIGH`, `recurrence: 1`, status NEW
- Rule: "When prompt mentions 'judge' or 'regulator' or 'lawmaker', SeedDream often renders a face. Add 'no faces, only silhouettes' to negative constraints."

**Run 2 (post on founder readiness, 2026-04-20):**
- Same failure — face visible despite the prompt not requesting one
- Existing entry's `recurrence` increments to 2, related_id added
- Now in promotion-candidate state

**Run 3 (post on industry pivot, 2026-04-22, includes `/learn` review):**
- god-mode start: "📚 Learnings: 5 NEW, 2 PROMOTED. 1 promotion candidate ready."
- After post is generated, user runs `/shva:shva-linkedin-post-writer learn`
- Promotion candidate displayed, user approves
- The rule is added to `references/seedream-prompt-rules.md` SD1
- Entry status → PROMOTED, .md log updated

**Run 4 onwards:**
- The rule is now loaded with every god-mode run
- Future SeedDream prompts auto-include the negative constraint when relevant
- The failure no longer occurs

This is exactly atom-creator's pattern. We've just adapted the domain prefixes and target files for LinkedIn.
