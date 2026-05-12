# SeedDream 4.5 Prompt Rules — LinkedIn Single-Image

> **What this covers:** SeedDream rendering rules (SD1-SD5), Visual Storytelling rules (VS1-VS7), Visual Direction rules (VD1-VD8), the proven style formula, mandatory Chinese keywords, the two-part prompt structure, and the generation invocation pattern. Adapted from atom-creator's `shared/visual-philosophy.md` SeedDream sections for LinkedIn single-image use.
>
> **When to load:** During god-mode Step G4 (SeedDream Prompt Construction), AFTER the visual style spec is finalized.
>
> **Inheritance:** Visual style (subject, palette, treatment) comes from `visual-philosophy-linkedin.md`. This file is purely about HOW to translate that style into a SeedDream prompt that renders cleanly.

## Table of Contents

- [Promoted Rules](#promoted-rules-validated-2026-04-25-across-10-image-iterations) — 7 validated rules (P1-P7) anti-frame, AI-cliché negatives, concise > verbose, etc.
- [SeedDream Rendering Rules SD1-SD5](#seeddream-specific-rendering-rules-sd1-sd5) — text-rendering nouns, hands, watermark, palette, character-style match
- [Visual Storytelling Rules VS1-VS7](#visual-storytelling-rules-vs1-vs7--apply-to-every-prompt) — film stills, no labels, outsider energy, etc.
- [Visual Direction Rules VD1-VD8](#visual-direction-rules-vd1-vd8) — pop colors, single moment, story-moment prompting
- [The Proven SeedDream Style Formula](#the-proven-seeddream-style-formula)
- [Mandatory Chinese Style Keywords](#mandatory-chinese-style-keywords)
- [The Two-Part Prompt Structure](#the-two-part-prompt-structure-mandatory)
- [Aspect Ratio for LinkedIn](#aspect-ratio-for-linkedin)
- [Generation Invocation Pattern](#generation-invocation-pattern)
- [Post-Generation Verification](#post-generation-verification)
- [Output: the rendered image](#output-the-rendered-image)
- [Quick reference card](#quick-reference-card)

---

## PROMOTED RULES (validated 2026-04-25 across 10 image iterations)

These are MANDATORY for every image generation, regardless of which engine actually runs (fal.ai SeedDream, Gemini Nano Banana 2, Freepik Mystic). Validated through the "Vivek Economy" post v3 → v10.

### 🔴 P1: Anti-frame language is mandatory in EVERY prompt
Gemini Nano Banana 2 reliably adds cream poster borders unless explicitly forbidden. Failure mode confirmed in v2 and v8 (cropped post-gen). Success in v9, v10 with this language:

> "Full-bleed to all four edges of the canvas, no cream border, no white frame, no poster matte, no decorative outline. The image extends content to every single edge."

Append to every prompt, even when using fal.ai or Freepik.

### 🔴 P2: AI-cliché negatives in EVERY prompt
NEVER allow AI to be rendered as:

> "no robots, no circuits, no neural networks, no holograms, no pixel grids, no cyborgs, no matrix-style code, no brain-with-circuits, no generic AI purple-blue gradients, no blue digital aesthetics, no machinery"

Append this exact list to every prompt's negative constraints.

### 🔴 P3: Concise prompt over verbose prompt — always
**Validated ratio:** 90-word SeedDream-style prompt (v9, v10) outperforms 340-word verbose Gemini-style prompt (v3) even when both run through Gemini. Concise prompt hygiene is universally good — not just for SeedDream.

**Mandatory structure:**
- Part 1: Content narrative (60-90 words) — style formula → subject → setting → composition
- Part 2: Style cluster (Chinese keywords) + negative constraints

### 🔴 P4: Hex codes BANNED in prompt body
SeedDream renders hex literally as text. Gemini occasionally does too. Use color names ("warm amber," "deep cobalt") in the prompt body. Hex codes belong only in the visual style spec / art-direction.md — NEVER in the prompt sent to the engine.

### 🔴 P5: Default engine is Gemini Nano Banana 2 in this environment
fal.ai SeedDream is the documented primary, but in practice requires interactive OAuth (interrupts auto-mode workflows). Freepik Mystic API key has been invalid in this environment. Until either is fixed, **Gemini Nano Banana 2 is the de-facto primary**.

Treat fal.ai and Freepik as future-state. For now: invoke `nano-banana:generate` with `--model 2 --size 1K --aspect 1:1` as the default.

### 🟢 P6: Iterative refinement is normal — expect 3-5 rounds minimum
The "Vivek Economy" post took 10 image iterations to land. This is not failure; this is the discovery process. The first generation is a probe; v2-v3 sharpen direction; v4-v6 explore alternative idioms; v7-v10 converge.

Build the workflow around iteration. Don't ship v1 unless it spectacularly hits AND the user signals approval.

### 🟢 P7: Capture every "no" as a JSONL learning entry
Each rejection reveals a taste boundary. By the end of a session, the JSONL contains the user's aesthetic codified.

---

---

## SeedDream-Specific Rendering Rules (SD1-SD5)

### SD1: No text you don't want rendered

SeedDream tries to render any word that sounds visible. "Classified personnel files" → garbled "CLASSIFICRIAL" stamped on cards. Words to avoid in prompts unless you actively want that text rendered: classified, confidential, secret, report, document, label, title, sign, poster, banner, headline, caption, certificate, scroll, screen, plaque.

If you must reference a document, describe the SHAPE: "a white rectangle pinned to a board" not "a file." For LinkedIn posts referencing announcements, say "a rectangular surface with a single warm-amber accent strip" not "a press release."

**Hex codes too** — writing "#FF3B30" in the prompt body can render as garbled text in the image. Use color names ("vivid hot coral," "deep midnight navy") in the prompt body. Hex codes belong ONLY in the internal palette spec, never in the prompt sent to SeedDream.

### SD2: Avoid hands and fingers

SeedDream produces glitched hands consistently. Use full silhouettes with: arms at sides, back turned to viewer, hands in pockets, hands tucked behind, or hands not visible. NEVER write: "a hand reaching toward," "grips the handle," "one arm extended," "pointing at," "fingers tracing."

If a figure must interact with an object, show them standing NEAR it, not touching it. Example: "an operative standing beside a switchboard" not "an operative reaching for the switchboard."

### SD3: watermark=False mandatory

The fal.ai SeedDream API includes `watermark` parameter; default is True (adds "AI generated" mark). ALWAYS set `watermark: false` in the API call. This is a parameter on the invocation, not the prompt.

When invoking via `fal-ai-media` skill, ensure the `watermark` flag is passed false explicitly. Verify the output image has no watermark before completing.

### SD4: 5-color semantic palette minimum

A 4-color monochrome palette (e.g., charcoal/white/gray/indigo) produces flat, lifeless images. Every palette needs at minimum:

- **Warm accent** for glow/hope/opportunity (amber, gold, coral)
- **Cool accent** for structure/authority (navy, indigo, teal)
- **Neutral** for background and secondary
- **Protagonist** for the figure (white or off-white)
- **Signal color** used sparingly for tension (red, coral — use only if the post has a tension/failure beat)

This matches Principle 6 (Constraint-Based Palette) in `visual-philosophy-linkedin.md`. Use the same 5-color list both places.

### SD5: Character-as-concept must match the art style

When using Character-as-Concept (Principle 2), the character MUST be rendered in the SAME visual style as everything else in the image. Specify explicitly in every prompt: "drawn in the SAME [style name] style as the environment — [specific style descriptors]."

If the post's metaphor is "ambient AI as a watcher figure at a threshold," specify the watcher in the same flat editorial vector style as the threshold/door behind them. Not a realistic figure in a stylized environment.

---

## Visual Storytelling Rules (VS1-VS7) — apply to every prompt

**VS1: Film stills, not infographics.** The image must feel like a frame from a movie, not a slide from a presentation. Test: "Would this work as a movie poster?" If the image needs a caption to be understood, it's an infographic. We want evocation.

**VS2: No explanatory labels.** Labels like THRESHOLD, AMBIENT, NUDGE, WATCHER kill the emotional world. Concepts must be expressed through composition, not through labels. A figure paused at a door says "threshold" without any words. Only real-world proper nouns are acceptable as image text (e.g., specific company names if Type 1 is allowed) — and even these should be avoided unless essential.

**VS3: The outsider energy test.** If someone outside LinkedIn / outside your domain looks at the image and feels the metaphor's emotional energy, it works. A plumber should look at an ambient-AI post's image and feel "huh, something is watching." If the image only makes sense to people who already understand the post, it's a diagram, not an evocation.

**VS4: Consistent register across the post-image pair.** The image's emotional temperature must match the post's emotional temperature. Provocative post → tense image. Calm announcement → centered image. If the post is discomforting and the image is comforting, the pair fails — re-pick the visual.

**VS5: The image must propagate post energy, not contradict it.** If the post is Adoption Gap (high tension), the image cannot be a soft watercolor flower. The cover sets a promise; the image delivers on it.

**VS6: Concepts through metaphor within the visual world.** Translate the post's concept into the visual world's vocabulary, not explained with the post's vocabulary. Examples:
- "AI watches in the background" → a single eye-shaped pendant on an empty desk, dawn light
- "Adoption Gap" → a polished facade with a hairline crack at the foundation
- "Constraint Migration numerical lead 0" → two cylindrical stacks in deep contrast lighting
- "Top Voice gaming" → a microphone on an empty stage with subtle puppet strings

**VS7: Contrast compositions need EXTREME intensity language.** Split/contrast images fail when both halves feel similar in energy. Use language like "BLAZING with white light" vs "STARK AND EMPTY," "packed-glowing-alive" vs "empty-dark-silent." Moderate language ("slightly dimmer," "somewhat cracked") produces images where contrast is invisible. The 2-second test: can a viewer instantly tell which half is good and which is bad without reading any text?

---

## Visual Direction Rules (VD1-VD8)

**VD1: Joy and curiosity first.** The image must make a LinkedIn scroller pause. Ask: "Would someone stop and tap, or scroll past?" Default to images that surprise pleasantly even when the topic is critical.

**VD2: Pop colors mandatory.** Vivid, saturated palettes. No muted/gray/navy-dominant unless the post genuinely demands darkness. Every image should stand out on a feed of generic content.

**VD3: Metaphor must connect to domain.** The lateral leap is in STYLE/TREATMENT, not in SUBJECT. Kathputli puppets for an Apple post = too far. Supermodel runway for an advertising post = instant. Subject rhymes; treatment surprises.

**VD4: Single image, single moment.** This is a single-image use case. Don't try to compress multiple beats into one frame. Pick the post's most visual sentence (key moment) and render that one moment cleanly.

**VD5: Story through figure posture, not through symbols.** The character's body language carries the narrative. Confident posture vs hunched. Facing into the frame vs facing away. Hands relaxed vs tucked. Posture is more readable than symbols.

**VD6: One-sentence pitch test.** Pitch the visual direction in one sentence. "An empty regulator's bench at dusk, lit by a single warm amber lamp." If a colleague says "oh cool" — proceed. If "what do you mean?" — iterate.

**VD7: No style copying between recent posts.** Each post must have a visually distinct identity. Track recent post images in `.claude/linkedin-post-image-log.md` (created at first run). Two posts in a row with the same background color + same fusion + same composition = style copy. Force a different fusion next post.

**VD8: Story-moment prompting.** The image renders the SPECIFIC emotional moment of the post — the key-moment sentence — not a generic illustration of the topic. Read the post, find the most striking sentence, pitch the image as that sentence as a movie still.

---

## The Proven SeedDream Style Formula

Use this EXACT phrase as the lead style descriptor in every prompt:

> **"Flat editorial illustration with risograph grain texture, crisp vector edges, hard geometric shadows."**

Do NOT improvise variants. The following push SeedDream toward cartoon/anime/comic-book style and break the editorial register:
- ❌ "noir thriller" / "dark editorial" / "graphic novel" / "comic book"
- ❌ "manga style" / "anime aesthetic"
- ❌ "Disney-Pixar" / "3D rendered"
- ❌ "watercolor" / "oil painting"

If a different render style is genuinely needed (for a specific Visual Tradition Fusion like Soviet Constructivism + Persian Miniature), prepend the proven formula AND name the two traditions explicitly: "Flat editorial illustration with risograph grain texture, crisp vector edges, hard geometric shadows — Soviet Constructivist composition with Persian miniature ornamental warmth."

---

## Mandatory Chinese Style Keywords

SeedDream is ByteDance-native. Append these keywords as a short cluster at the end of every prompt — they activate more precise style embeddings than English-only equivalents.

| Chinese | Meaning | When to use |
|---|---|---|
| `扁平插画` | flat illustration | ALWAYS include |
| `高对比度` | high contrast | For contrast/split compositions |
| `Riso印刷` | risograph print | Always (matches the proven formula) |
| `极简主义` | minimalism | For announcement / framework posts |
| `戏剧性侧光` | dramatic side lighting | For tense / institutional-hypocrisy posts |
| `电影感` | cinematic feel | Always include |

**Default cluster** (always at end of prompt): `扁平插画, Riso印刷, 电影感`. Add `高对比度` if contrast composition. Add `极简主义` if announcement. Add `戏剧性侧光` if tense.

---

## The Two-Part Prompt Structure (mandatory)

Every SeedDream prompt for LinkedIn must have two parts in this order:

**Part 1 — Content narrative (flowing prose, 25-80 words):**
- Start with the proven style formula
- Then: subject (character/object) — what hits the eye first
- Then: setting (environment, with descriptive color names)
- Then: composition (framing, spatial relationships)
- All as flowing sentences, not bullet points

**Part 2 — Style cluster (keyword cluster at the end):**
- The Chinese keywords (default cluster + theme-specific additions)
- Negative constraints as natural prose: "No faces, no hands, no text, no logos."

**Total prompt: 30-100 words sweet spot, max 2000 characters.**

### Example prompt (good)

> Flat editorial illustration with risograph grain texture, crisp vector edges, hard geometric shadows. A single white silhouette figure pauses at a tall narrow doorway, body half-turned toward an unseen room beyond. Warm amber light spills from the doorway across a dark cobalt floor. Composition is asymmetric — figure left of center, doorway as the vertical axis. Distant ambient grain in the air suggests presence rather than figures.
>
> 扁平插画, Riso印刷, 电影感, 戏剧性侧光. No faces, no hands, no text, no logos.

This is ~75 words, runs cleanly, and encodes Visual Tradition Fusion (Saul Bass film-poster + risograph texture).

### Example prompt (bad — would render poorly)

> A person looking at their smartwatch checking heart rate variability before a job interview, professional setting, modern office, AI-themed, beautiful lighting, 4K, hyperdetailed, masterpiece. #FF6B35 #1A1A2E watermark embedded.

This fails on: SD1 (renders "AI-themed" as text + hex codes as text + "masterpiece" overload), SD2 (hands visible on smartwatch will glitch), VS1 (infographic energy), VD3 (no lateral leap), no Chinese keywords, no negative constraints.

---

## Aspect Ratio for LinkedIn

Per `visual-philosophy-linkedin.md`:

- **Default god-mode:** 1:1 square (1200×1200) — most versatile mobile + desktop
- **Link-preview attached:** 1.91:1 (1200×627)
- **Vertical / mobile-hero:** 4:5 (1200×1500)

In the fal.ai SeedDream API call, set `image_size` parameter accordingly. After every generation, verify with `sips -g pixelWidth -g pixelHeight {file}`. If wrong ratio, regenerate up to 2 times before falling back.

---

## Generation Invocation Pattern

**Primary path: `fal-ai-media` skill**

Invoke via:
```
Skill(skill="fal-ai-media")
```

Then specify:
- **model:** `fal-ai/bytedance/seedream/v4` (or current SeedDream 4.5 endpoint)
- **prompt:** The two-part prompt constructed above
- **image_size:** `square_hd` (1024×1024 default; verify and re-request if needed for 1200×1200)
- **num_images:** 1
- **enable_safety_checker:** true
- **expand_prompt:** false (we've already crafted the precise prompt)
- **watermark:** false (SD3 mandatory)
- **seed:** randomize (or fix if iterating on same composition)

**Fallback path: `nano-banana:generate`**

If fal.ai unavailable, fall back to Gemini Pro via `nano-banana:generate` skill. WARNING: Gemini Pro landscape outputs ~16:9 (1376×768), not 4:3 or 1:1. Will need post-crop. Quality and color rendering will differ — accept that the fallback image is "good enough" not "design-perfect."

**Last-resort path: skip image, ship post text-only**

If both engines fail, ship the post without an image. Log the failure to learnings JSONL with domain `lk_seedream_render`. Better text-only than a broken image.

---

## Post-Generation Verification

After every image generation, run:

1. **Aspect ratio check:** `sips -g pixelWidth -g pixelHeight {file}`. If wrong, regenerate up to 2 times before falling back.

2. **No-text scan:** Visually inspect the image for any unintended text rendering (the SD1 failure mode). If garbled text is visible, regenerate.

3. **No-face scan:** Scan for visible faces. If a face appears (even partial), regenerate with stronger negative constraints in the prompt.

4. **Background check:** Verify the background is NOT white-passing (R, G, B all > #E0). LinkedIn's feed is white — white-passing images disappear.

5. **Hand glitch check:** If hands are visible at all, scan for the SD2 glitch pattern (extra fingers, melted hands, weird pose). If glitched, regenerate.

If any check fails twice in a row, log the failure pattern to `.claude/linkedin-post-learnings.jsonl` with the appropriate domain prefix (see `learnings-protocol.md`).

---

## Output: the rendered image

After successful generation:
- Save to `linkedin-images/{YYYY-MM-DD}-{post-slug}.png` (create the directory if it doesn't exist)
- Generate a slug from the post's first 4-5 meaningful words: "ambient time-sensitive AI" → `ambient-time-sensitive-ai`
- Display the image path to the user
- Display the prompt that produced it (for the learnings loop)
- Display the visual style spec (TYPE, KEY MOMENT, PALETTE, etc.) used to generate it

---

## Quick reference card

```
PROMPT FORMAT
─────────────
Part 1: [proven style formula] + [subject] + [setting with color names] + [composition]
Part 2: [Chinese keywords] + [negative constraints in prose]

LENGTH: 30-100 words, max 2000 chars
NO HEX in prompt body — use color names
NO HANDS visible
NO FACES
NO TEXT/labels/logos
WATERMARK=FALSE in API call

DEFAULT KEYWORDS
─────────────
扁平插画, Riso印刷, 电影感

ADD IF
─────────────
高对比度        → contrast/split composition
极简主义        → announcement / framework
戏剧性侧光      → tense / institutional

ASPECT RATIO (LinkedIn)
─────────────
Default god-mode:  1:1 square 1200×1200
Link-preview:      1.91:1 (1200×627)
Vertical hero:     4:5 (1200×1500)

ENGINE
─────────────
Primary: fal-ai-media skill → SeedDream 4.5
Fallback: nano-banana:generate → Gemini Pro
Last resort: ship text-only, log to learnings
```
