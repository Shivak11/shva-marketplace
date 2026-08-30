# God Mode Pipeline — Detailed Steps

> **What this covers:** Detailed implementation of Steps G0-G7 of god mode (autonomous LinkedIn post pipeline including visual generation + self-learning loop). The high-level overview lives in SKILL.md; this file is the step-by-step playbook.
>
> **When to load:** Only when god mode is active (user invoked the skill with `god mode` / `god-mode` / `gm` keyword). Progressive disclosure — don't load otherwise.
>
> **Companion reference files** (load each as the relevant step fires):
> - `visual-philosophy-linkedin.md` — visual types, principles, classification (G2, G3)
> - `seedream-prompt-rules.md` — prompt construction rules (G4)
> - `learnings-protocol.md` — JSONL self-evolution loop (G0, G6, post-run)
> - `linkedin-publish-rules.md` — six-step publish protocol (G7)
> - `state-of-humans-editorial-comic-system.md` — mandatory branch for `State of Humans` scripting, rendering, metadata, and visual QA

---

## Table of Contents

- [Pipeline Overview Table](#pipeline-overview-table)
- [G0: Learnings Checkpoint](#g0-learnings-checkpoint)
- [G1: Run Existing Flow (Steps 1-7.5)](#g1-run-existing-flow-steps-1-75)
- [G2: Visual Need Decision Gate](#g2-visual-need-decision-gate)
- [G3: Visual Style Determination](#g3-visual-style-determination)
- [G4: SeedDream Prompt Construction](#g4-seedream-prompt-construction)
- [G5: Image Generation](#g5-image-generation)
- [G6: Visual Audit + Learnings Capture](#g6-visual-audit--learnings-capture)
- [G7: Final Output + Publish Protocol](#g7-final-output--publish-protocol)
- [G8: Wiki Save + Taste Capture](#g8-wiki-save--taste-capture)
- [Post-Run Self-Learning](#post-run-self-learning)

---

## Pipeline Overview Table

| Step | What | Loads | Output |
|---|---|---|---|
| **G0** | Learnings checkpoint | `learnings-protocol.md` | NEW count + promotion candidates surfaced |
| **G1** | Steps 1-7.5 (existing flow) | — | Post drafted + mechanics-gated |
| **G2** | Visual Need Decision | Dedicated comic reference for `State of Humans`; otherwise `visual-philosophy-linkedin.md` | required comic or yes/no + reason |
| **G3** | Visual Style Determination | Dedicated comic reference for `State of Humans`; otherwise `visual-philosophy-linkedin.md` | continuity-locked comic brief or visual style spec |
| **G4** | Prompt / Production Brief | Dedicated comic reference for `State of Humans`; otherwise `seedream-prompt-rules.md` | comic production brief or two-part prompt |
| **G5** | Image Generation | — | PNG saved to `linkedin-images/{date}-{slug}.png` |
| **G6** | Visual Audit + Learnings Capture | `learnings-protocol.md` | Audit report + JSONL captures |
| **G7** | Final Output + Publish | `linkedin-publish-rules.md` | Post live on LinkedIn + post-publish verified |
| **G8** | Wiki Save + Taste Capture | SKILL.md Step 9 | Wiki page at `linkedin-posts/...` + log.md / index.md updates + recurring-pattern promotion |

---

## G0: Learnings Checkpoint

The skill evolves over time. Surfacing existing learnings at the start lets recurring patterns (promotion candidates) bubble up before drafting begins.

1. Read `~/.claude/linkedin-state/linkedin-post-learnings.jsonl`. If it doesn't exist, create empty file and continue.
2. Count entries by status: `{NEW: N, PROMOTED: M, ARCHIVED: K}`.
3. Find promotion candidates: entries where `status: "NEW"` AND `recurrence ≥ 2`.
4. Display ONE line at the top of god-mode output:
   ```
   📚 Learnings: {N} NEW, {M} PROMOTED. {K_candidates} promotion candidate(s).
   ```
5. If `K_candidates ≥ 3`, append: " — strong recommendation to run `/shva:shva-linkedin-post-writer learn` after this post."
6. Continue to G1.

---

## G1: Run Existing Flow (Steps 1-7.5)

The existing skill workflow runs unchanged for ordinary posts. For `State of Humans`, the dedicated reference deliberately replaces the prose-length, generic visual, no-text, no-robot, and text-only fallback rules where it says so.

Execute exactly as written in SKILL.md:
- Step 1: Search for recent announcement (or use the user-provided topic / voicenote idea)
- Steps 2-4: Theme rotation, 4-Layer Structure, hook archetype, retired-hook check
- Step 5: SUCCESs framework
- Step 5.5: Hook Test + Cringe Test
- Step 6: Voice & Variability Check + Format anti-patterns + Tone Dial + Vulnerability Guardrail
- Step 7.5: Mechanics Gate via `linkedin-posts` (Shiva wins all writing-style clashes)

The post text is now finalized. Hold it in memory for G7 output.

---

## G2: Visual Need Decision Gate

Not every post needs a visual. Some posts (Constraint Migration posts with numerical lead) lose punch when an image dilutes the numbers.

Load: `visual-philosophy-linkedin.md` — section "When to Generate (Visual Need Decision Gate)".

Apply the heuristic:
- **Generate visual if** ≥1 fires: theme is Release/Announcement; theme is Authority Redesign or Mental-Model Reframe (future-scenario framing); theme is Constraint Migration or Authority Redesign with quotable CEO/operator line; theme is Adoption Gap with two-state contrast (demo room vs production floor); post anchors on a specific company (Type 1) or famous founder (Type 2); the violation line is concrete enough to render as a single dramatic moment.
- **Skip visual if** ≥1 fires: Constraint Migration posts with numerical lead (numbers ARE the visual); dense data + framework where image fragments attention; violation is too abstract; post earns weight through prose alone; would force a metaphor that doesn't connect to domain.

In god mode: apply heuristic SILENTLY. No `AskUserQuestion`. Log decision + one-line reason for the learnings loop.

For `State of Humans`, decision = NO is invalid: the comic is the post. Stop and repair the visual premise or production artifact.

For other genres, if decision = NO → skip to G6 (audit/learnings on post-only) and then G7.
If decision = YES → continue to G3.

---

## G3: Visual Style Determination

Why this matters: the visual must amplify the post's voice, not soften it. The classification algorithm picks one of three types, then the lateral-thinking process generates the specific composition. Skipping the algorithm leads to generic stock-image-feel results.

Load: `visual-philosophy-linkedin.md` (full file).

Run the classification algorithm:
1. **Company dominance check** → if one company centers the post AND has recognizable design language → Type 1 Company-Driven.
2. **Personality anchor check** → if one famous person centers the post AND silhouette recognizable across ≥2 of the 5 tiers → Type 2 Personality-Driven.
3. **Default** → Type 3 Lateral. Run the 5-step Lateral Thinking Process and apply ≥3 of the 8 principles.

Then extract the **key moment** — the single sentence in the post that the image renders. Use the extraction rule from `visual-philosophy-linkedin.md` (most concrete imagery + emotional peak + would-survive-as-movie-still).

Write the Visual Style Spec to memory:
```
TYPE:                 [Company-Driven / Personality-Driven / Lateral]
KEY MOMENT:           [the one sentence from the post]
SUBJECT:              [character/object/scene that appears in the frame]
TREATMENT:            [rendering language — fusion of two visual traditions]
PALETTE:              [5 colors with semantic meaning per role]
COMPOSITION:          [centered / rule-of-thirds / diagonal / split / asymmetric]
EMOTIONAL TEMPERATURE:[calm / tense / triumphant / quiet / dense]
ASPECT RATIO:         [1:1 1200×1200 default / 1.91:1 link-preview / 4:5 portrait]
PRINCIPLES APPLIED:   [list ≥3 of the 8 principles]
ONE-SENTENCE PITCH:   [the VD6 pitch test]
```

In god mode: zero `AskUserQuestion` gates. The classification + lateral thinking output is auto-approved. Log the spec to learnings if any heuristic confidence is low (e.g., the post is borderline Type 2 vs Type 3) — these become candidate `lk_visual_classify` entries.

---

## G4: SeedDream Prompt Construction

Load: `seedream-prompt-rules.md` (full file).

Construct the two-part prompt:

**Part 1 — Content narrative (25-80 words flowing prose):**
1. Lead with the proven style formula: "Flat editorial illustration with risograph grain texture, crisp vector edges, hard geometric shadows."
2. Then: subject (the SUBJECT from G3 spec)
3. Then: setting (descriptive color names ONLY — no hex codes; pull from G3 PALETTE but translate to color names)
4. Then: composition (the G3 COMPOSITION axis)
5. Apply rules: SD1 (no text-rendering nouns), SD2 (no hands/fingers), SD5 (character-as-concept matches style), VS1-VS7 (film stills, no labels, etc.)

**Part 2 — Style cluster + negative constraints:**
- Default Chinese keyword cluster: `扁平插画, Riso印刷, 电影感`
- Add `高对比度` if COMPOSITION is split/contrast
- Add `极简主义` if theme is Release/Announcement
- Add `戏剧性侧光` if EMOTIONAL TEMPERATURE is tense/dense
- Negative constraints in prose: "No faces, no hands, no text, no logos."

**Length target:** 30-100 words (the SeedDream sweet spot). Verify before invoking. Long verbose prompts (validated worse — see learnings 005) underperform concise ones even when sent to Gemini.

---

## G5: Image Generation

**Primary engine: `fal-ai-media` skill (SeedDream 4.5)**

Invoke `Skill(skill="fal-ai-media")` with:
- `model`: `fal-ai/bytedance/seedream/v4` (or current SeedDream 4.5 endpoint)
- `prompt`: The two-part prompt from G4
- `image_size`: `square_hd` for 1:1 default, or matching the ASPECT RATIO from G3
- `num_images`: 1
- `enable_safety_checker`: true
- `expand_prompt`: false
- `watermark`: false (SD3 — non-negotiable)
- `seed`: random (or fixed if iterating on same composition)

After generation:
1. Save to `linkedin-images/{YYYY-MM-DD}-{post-slug}.png`. Create the directory if it doesn't exist. Slug = first 4-5 meaningful words of post, lowercased and hyphenated.
2. Verify aspect ratio: `sips -g pixelWidth -g pixelHeight {file}`. If wrong, regenerate up to 2 times.
3. If still wrong after 2 regens: capture learning entry (`lk_seedream_aspect`, severity HIGH), proceed with the wrong-ratio image OR fall back to Gemini Pro.

**Fallback engine: `nano-banana:generate` (Gemini Nano Banana 2)**

In this user's environment, fal.ai requires interactive OAuth (interrupts auto mode) and Freepik Mystic has had API key issues. As validated 2026-04-25, **Gemini Nano Banana 2 has been the de-facto primary** despite being documented as fallback. Treat it as primary in practice; document the engine substitution in learnings.

If the primary engine fails, capture `lk_engine_failure` learning entry (severity HIGH).

**Last-resort path:** If both engines fail, capture `lk_engine_failure`. For ordinary posts, text-only remains valid. For `State of Humans`, stop before output or delivery; never separate its principle caption from the comic that supplies the complete context.

---

## G6: Visual Audit + Learnings Capture

If image was generated, run the post-generation verification from `seedream-prompt-rules.md`:

1. **Aspect ratio check** (HARD) — regenerate if wrong, capture `lk_seedream_aspect` if persistent
2. **No-text scan** (HARD) — regenerate if garbled text rendered, capture `lk_seedream_render`
3. **No-face scan** (HARD) — regenerate with stronger negative constraints if face appears, capture `lk_seedream_render`
4. **No-white-passing-bg check** (HARD) — if R, G, B all > #E0, regenerate with darker bg, capture `lk_seedream_render`
5. **Hand glitch check** (SOFT) — regenerate if visible hands have SD2 glitch pattern
6. **Cream-poster-border check** (SOFT) — Gemini Nano Banana 2 reliably adds these unless explicitly forbidden; crop ~5% off each edge with `sips --cropToHeightWidth` if present

For ANY HIGH-severity finding (audit fail or regen-loop):
1. Classify using error taxonomy from `learnings-protocol.md`
2. Check existing JSONL for similar entries (fuzzy match on `finding` + `domain`)
3. If match: increment `recurrence`, append to `related_ids`
4. If no match: create new entry with `recurrence: 1`, `status: "NEW"`
5. Append to `~/.claude/linkedin-state/linkedin-post-learnings.jsonl`

---

## G7: Final Output + Publish Protocol

This step has TWO parts: composing the user-facing output, and (if requested) publishing to LinkedIn via the validated publish protocol.

### Part 7a: Compose Output

Display in this order:

1. **The post** — first character is first letter of post (Step 7's strict zero-wrapper rule still applies)
2. Source URL (if news-based) on its own line
3. Hashtags
4. Below the post, separated by `---`, an image-and-meta block:

```
─────────────
🖼  IMAGE: linkedin-images/{date}-{slug}.png
   TYPE: [type]
   KEY MOMENT: "[one-sentence pitch]"
   PALETTE: [5-color list]
   PITCH: "[one-sentence pitch from G3]"
   PRINCIPLES: [list of applied principles]

📚 LEARNINGS THIS RUN
   Captured: N new findings
   Existing: N NEW, M PROMOTED. K promotion candidates ready.

🔧 ENGINE: [engine name + elapsed time + watermark status]
✅ VISUAL AUDIT: [each check ✓ or ✗ inline]
─────────────
```

### Part 7b: Publish Protocol (only if user requests publishing)

If the user asks to save, schedule, or publish on LinkedIn, follow the owner-bound Cloudflare protocol from `linkedin-publish-rules.md`. Never use the metadata-incapable app shim or a legacy/local write server. Do NOT use direct `linkedin_post`. The protocol:

1. **Status + duplicate gate** — require healthy database and connected owner; check a stable tag.
2. **Draft Save** — use only `linkedin-cloudflare.linkedin_drafts_save`; for images send exact bytes/URL plus `mime_type`, `filename`, and authored `alt_text`; confirm the staged save with `CONFIRM`.
3. **Draft Readback** — `linkedin_drafts_get(id)` and diff exact text, content type, visibility, image hash, MIME type, filename metadata, byte size, and alt text.
4. **Schedule or publish, never both** — for a future slot call `linkedin_schedule_add` and confirm `CONFIRM`; for an immediate post call `linkedin_drafts_publish` and confirm `POST IT`.
5. **Receipt readback** — verify pending Schedule ID/Draft ID/UTC/fingerprint, or treat `linkedin_posts_history` only as a publication receipt.
6. **Public verification / recovery** — after publication, use public readback for exact-body proof. If a legacy truncation occurs, use the approved delete-and-ASCII-retry recovery in the publishing reference; never mutate approved Unicode pre-emptively on the current cloud path.

Prefer managed image bytes through the cloud MCP. A public image URL is allowed only when independently verified and explicitly chosen; `catbox.moe` is not the default path.

---

## G8: Wiki Save + Taste Capture

The full contract lives in SKILL.md Step 9 — this section adds the god-mode-specific runtime details. In god-mode, G8 is **mandatory** (not optional), runs *after* G7 has output the post and (optionally) published it, and uses information accumulated through G0-G7 (visual style spec, audit findings, publish state, learnings captures).

**Why G8 in god-mode specifically.** Without G8, each god-mode run shows a polished image and a fresh post, but the *decisions* that produced both vanish. The G6 learnings JSONL captures HIGH-severity findings, but it doesn't capture *what worked* — the tone-dial choice that earned its place, the lens pair that landed, the visual style classification that felt right. Those positive signals only become re-readable when written into the wiki page beside the post.

### Step G8a: Determine post status

The `status` frontmatter field depends on what happened in G7:

| G7 outcome | `status` value |
|---|---|
| G7 stopped at output (no publish requested) | `draft` |
| G7 ran publish protocol → draft saved → publish queued for a future slot | `scheduled` (also write `scheduled_for` and `slot`) |
| G7 ran publish protocol → published live, post-publish verify passed | `shipped` |
| G7 ran publish protocol → published → verify FAILED → auto-retry exhausted | `failed-publish` (rare; capture `lk_publish_*` learning HIGH) |

### Step G8b: Compose the wiki page

Build the page per SKILL.md Step 9 frontmatter contract + 5-section body. Use the in-memory artifacts G0-G7 produced:

- **Post body** → verbatim from G7 output (zero-wrapper, exactly as user copied/published).
- **Sources & Lens Application** → from G1 (which Tier 1-5 calls succeeded, which Tier 6 URL was used; from Step 3 lens selection).
- **Taste Notes** → from G1's Step 5.5 (Hook Test pass/fail observations), Step 6 (tone-dial deviations from default), Step 5 (SUCCESs verification notes). Convert internal reasoning into 6-10 bullets.
- **Generated Visual** → from G3 (visual style spec) + G6 (audit findings) + G5 (engine + elapsed time). Only fill if G2 = yes.
- **Connections** → at minimum `[[linkedin-post-niche-pipeline]]` and `[[linkedin-roster-theme-system]]`. Add `[[<map-or-synthesis-page>]]` wikilinks for any wiki page the post's argument extends. Use `wiki-query` semantically if uncertain which pages to link.

### Step G8c: Path resolution

Default vault location:

```
/Users/shivakakkar/Python Projects/Obsidian Wiki/
```

If `~/.obsidian-wiki/config` exists, read it and use `OBSIDIAN_VAULT_PATH` from there instead. If `Obsidian Wiki/.env` exists at the default path, that's authoritative (current state: `OBSIDIAN_VAULT_PATH` is `/Users/shivakakkar/Python Projects/Obsidian Wiki`).

```
Post:       $VAULT/linkedin-posts/YYYY-MM-DD-slug.md
Attachment: $VAULT/linkedin-posts/attachments/YYYY-MM-DD-slug-<descriptor>.png
```

### Step G8d: Copy the image (if G2 = yes)

In god-mode, copy the exact approved production master or independently inspected publish rendition from its recorded source path into the wiki attachments folder. Do not assume a legacy `linkedin-mcp-server` checkout or a PNG transport format:

```bash
cp "<verified-approved-artifact-path>" \
   "$VAULT/linkedin-posts/attachments/{date}-{slug}-<descriptor>.<ext>"
```

Keep the original at its recorded source location. The cloud draft read-back, not a repository convention, proves which bytes are attached to the LinkedIn artifact; the wiki copy preserves provenance and retrieval.

### Step G8e: Append log.md, update index.md

Direct append, no Skill delegation (god-mode preference for full autonomy):

```bash
# Append to log.md
echo "- [<ISO-IST>] LINKEDIN_POST status=<status> page=\"linkedin-posts/<file>.md\" title=\"<title>\" lenses=\"<lenses>\" hook_archetype=\"<hook>\" focus=\"<gist>\"" >> "$VAULT/log.md"
```

For `index.md`: read the "## LinkedIn Posts" section if it exists (create if missing, place after "## Synthesis (Recent)"); add the new entry as `- [[linkedin-posts/<file>|<title>]] — <summary>. <status>.`

For `hot.md`: skip unless the post is unusually high-signal (a release announcement, a contrarian take that may seed downstream commentary, a post that ships a new framework). Default: don't touch hot.md from inside god-mode.

### Step G8f: Promotion check

Read the Taste Notes sections of the previous 2-5 LinkedIn posts in `linkedin-posts/` (sort by date desc). Look for repeating patterns — the same hook archetype + lens pair winning, the same tone-axis deviation earning its place, the same banned-pattern near-miss recurring.

If a pattern has appeared in **≥3 posts including this one**, append it as a bullet under "Taste Topics" in `synthesis/linkedin-roster-theme-system.md`. Do NOT create a new page.

Example promotion:
```markdown
- Future Scenario hook + Authority Redesign lens shipped 3 winning posts (2026-04-25 manager-of-47-agents, 2026-MM-DD ..., 2026-MM-DD ...). The pair works because the violation is forward-dated and the credential is the org-design observation that anchors the prediction in present-tense evidence.
```

### Step G8g: Final god-mode output line

After all G8 substeps complete, output ONE additional line to the user (after the G7 image block):

```
📝 Wiki: linkedin-posts/YYYY-MM-DD-slug.md  ·  log.md ✓  ·  index.md ✓  [· promoted to synthesis ✓ — if applicable]
```

Keep it terse. The user already has the post (copied/published). The wiki line is incidental confirmation.

### G8 critical rules

1. **G8 is NOT optional in god-mode.** Even if the image generation failed (G5 last-resort path), G8 still runs — the post text alone gets a wiki page (omit "Generated Visual" section).
2. **G8 does NOT block on errors.** If `log.md` append fails or `index.md` is locked, write the post file anyway and surface the wiki-update error in the final line. The post is the primary artifact; index/log are catchup.
3. **G8 NEVER prompts the user.** Like the rest of god-mode, all decisions auto-resolve. Slug derivation, tag selection (within `_meta/taxonomy.md` vocabulary), and connection wikilinks are computed without `AskUserQuestion`.
4. **G8 does NOT re-derive the post.** The wiki "Post (as published)" section is a verbatim copy of G7's post text. No paraphrasing, no commentary inside the body section.
5. **Promotion is conservative.** Default to NOT promoting on edge cases. A pattern that's appeared in exactly 3 posts but two of them were near-identical topics is NOT 3 independent observations — it's 1.5. Wait for stronger signal.

---

## Post-Run Self-Learning

After god mode finishes, if the user gives any feedback signal, capture immediately:

| User signal | Domain | Severity |
|---|---|---|
| "this image doesn't fit" | `lk_visual_style` | HIGH |
| "voice is off" / "soften this" | `lk_post_voice` | HIGH |
| "regenerate but [specific reason]" | `lk_visual_*` (per reason) | HIGH |
| "this is great" / "ship it" | (no capture — positive confirmation) | — |
| "had to delete it" / "broken" | `lk_publish_*` | CRITICAL |

If the user explicitly invokes `/shva:shva-linkedin-post-writer learn` (separate command), walk through promotion candidates with their approval — see `learnings-protocol.md` for the promotion routing table.

---

## What god mode is NOT

- ❌ A replacement for the basic skill — the basic flow (Steps 1-8) still works without god mode for fast post-only drafts.
- ❌ A free pass on quality — every audit check still HARD-blocks if it fails.
- ❌ A way to bypass Shiva's voice rules — Step 7.5 Governing Rule applies to visual style too (kostja's "professional B2B" cannot soften the image).
- ❌ A guarantee of an image for ordinary prose posts — if the post genuinely does not need one, god mode may ship text-only. `State of Humans` is the hard exception: the approved comic is the primary artifact and must remain attached to its principle caption.
- ❌ A direct-publish bypass — even in god mode, the six-step publish protocol is mandatory. No exceptions.
- ❌ A wiki-save bypass — G8 is mandatory. A post that runs god-mode and doesn't land in the wiki leaves no audit trail for the next post's voice check.
