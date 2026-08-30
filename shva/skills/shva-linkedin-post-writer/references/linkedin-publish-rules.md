# LinkedIn Delivery Rules — Owner-Bound Cloud Path (updated 2026-08-30)

> **What this covers:** The LinkedIn API's actual ingest behavior via this MCP path, validated through 3 publish attempts on the same post (2 truncations, 1 clean). These are HARD CONSTRAINTS — not preferences.
>
> **When to load:** During god-mode Step G7, before saving a LinkedIn draft, schedule, or immediate publication.
>
> **Status of these rules:** The 2026-04-25 truncation is retained as legacy failure evidence. The current authoritative route is the metadata-capable, owner-bound `linkedin-cloudflare` MCP verified on 2026-08-30. Exact approved text is preserved by default; ASCII sanitisation is now a recovery fallback, not a pre-emptive rewrite.

## Current Provider Boundary

- Use only the owner-bound `linkedin-cloudflare` MCP for every write.
- Never fall back to `codex_apps`/app-shim, local, Render, or legacy LinkedIn write tools. The app shim lacks `alt_text` and `filename` fields.
- Require `linkedin_status` to report a healthy database and LinkedIn connected as Shiva Kakkar.
- Use a stable internal tag and `linkedin_drafts_list` before saving to prevent duplicates.
- For images, send and read back authored `alt_text`, canonical MCP-side `filename`, allowed `mime_type`, byte size, and image hash. LinkedIn receives alt text; the filename remains MCP provenance and is not a ranking claim.
- Draft saved, scheduled, published, and publication-verified are separate states.

---

## The Validated Failure Mode

**Symptom:** A 1,577-character LinkedIn post (well under the 3,000-char documented limit) silently truncated at exactly "preya" — character ~1,003 — on TWO consecutive publish attempts via this MCP. User had to delete both manually.

**Root cause:** LinkedIn's ingest pipeline (via this MCP route) cannot handle certain non-ASCII byte sequences. When it hits one, it silently drops the rest of the post. The API returns success and a valid URN. The LinkedIn UI shows a fully-formed post — just truncated.

**The fix that worked:** Same content rewritten to pure ASCII published cleanly at 1,548 chars with all paragraphs intact.

---

## Legacy Recovery Rule: Pure ASCII After A Proven Truncation

The April 2026 legacy path truncated certain non-ASCII sequences. The current cloud path has since preserved approved Unicode punctuation through exact draft read-back. Do not mutate approved text pre-emptively. Run the conversion below only after a real publication mismatch or when deliberately using the historical recovery path.

| Original | Convert to | Reason |
|---|---|---|
| Em-dash `—` (U+2014) | Hyphen `-` | TRIGGERS TRUNCATION |
| En-dash `–` (U+2013) | Hyphen `-` | TRIGGERS TRUNCATION |
| Smart quotes `"` `"` | Straight `"` | Risk of truncation |
| Smart apostrophe `'` | Straight `'` | Risk of truncation |
| Diacritic `ī` `ā` `ū` `ē` `ō` etc. | Drop diacritic (`i` `a` `u` `e` `o`) | TRIGGERS TRUNCATION |
| Ellipsis `…` (U+2026) | Three dots `...` | Risk of truncation |
| Non-breaking space (U+00A0) | Regular space | Risk of truncation |

**Legacy recovery validation script (run only after a proven public-body mismatch or when deliberately using the historical recovery path):**

```bash
# Detect any non-ASCII byte in the post text
python3 -c "
import sys
text = open('/tmp/linkedin-post.txt').read()
for i, c in enumerate(text):
    if ord(c) > 127:
        print(f'❌ Non-ASCII at position {i}: U+{ord(c):04X} ({c!r})')
        sys.exit(1)
print('✅ Pure ASCII')
"
```

If the script flags any character, replace it before the explicitly approved recovery re-publication. Do not use this result to alter already approved copy on the current owner-bound cloud path.

---

## Legacy Recovery Detail: Sanskrit / Non-English Transliteration

You CAN keep Sanskrit conceptual terms — they earn the post's voice — but they must be transliterated without diacritics:

| ✅ ALLOWED (ASCII transliteration) | ❌ BANNED (diacritic transliteration) |
|---|---|
| `vivek` | `vivēk`, `viveka` (with bar over a) |
| `vivinakti` | `vivinakti` with macrons |
| `gurukul` | `gurukula` (with bar over a) |
| `dharma` | `dhárma`, `dhárma` (with diacritics) |
| `karma`, `moksha`, `atma` | with any diacritics |
| Drop entirely: `dhīra`, `preya`, `shreya` | These transliterations require macrons in scholarly form — translate inline instead |

**Practical rule for the linguistic killer move:** Keep 1-2 Sanskrit anchor terms in ASCII form. Translate the rest inline ("the discerning one" instead of *dhīra*; "the pleasant" instead of *preya*; "the good" instead of *shreya*).

---

## 🔴 HARD RULE 3: Hashtag format

LinkedIn hashtags only support alphanumeric + underscore. A dot in the hashtag (`#tryrehearsal.ai`) parses as `#tryrehearsal` followed by plain text `.ai`.

| ✅ Use | ❌ Don't use |
|---|---|
| `#tryrehearsal` | `#tryrehearsal.ai` |
| `#SystemsThinking` | `#AI_in_Education_2026` (overlong / underscore-heavy) |

If you want to mention the URL: put `tryrehearsal.ai` in the post body or a comment, not in a hashtag.

---

## Current Mandatory Delivery Protocol

Direct `linkedin_post` is banned. The full current cycle is:

```
Step 1  STATUS + DUPLICATE GATE
        Require healthy database and connected owner. Search one stable tag.

Step 2  DRAFT SAVE + CONFIRM
        Call linkedin-cloudflare linkedin_drafts_save with exact approved text,
        visibility and content type. For each image send data or verified URL,
        mime_type, filename and authored alt_text. Confirm with CONFIRM.

Step 3  FULL DRAFT READBACK
        Read the saved draft. Diff text, visibility, content type, internal tags,
        image hash, MIME type, filename metadata, bytes and authored alt text.

Step 4A SCHEDULE (future time)
        Convert approved Asia/Kolkata time to UTC ISO 8601 ending in Z. Call
        linkedin_schedule_add and confirm with CONFIRM. Do not publish the draft.

Step 4B PUBLISH (now)
        Call linkedin_drafts_publish and confirm with POST IT. Do not schedule it.

Step 5  RECEIPT READBACK
        For schedules, verify Schedule ID, Draft ID, UTC time, artifact fingerprint
        and pending status. For publication, history is a receipt only.

Step 6  PUBLIC VERIFY / RECOVER
        After the due time or immediate publication, use public LinkedIn readback
        for exact body/media proof. If truncation is observed, delete only with
        explicit DELETE IT confirmation, ASCII-sanitise as recovery, and retry at
        most twice.
```

**Why all six steps are mandatory:** the route separates identity, exact artifact preservation, consequential action, and public proof. A healthy draft cannot prove a schedule; a pending schedule cannot prove publication; history cannot prove the exact public body.

---

## 🟡 SOFT RULE: Content moderation triggers (suspected, unconfirmed)

Words/phrase combinations to handle carefully — may interact with LinkedIn's automated content moderation:

| Phrase | Risk |
|---|---|
| "beautiful women" + religious/death context | May flag — paraphrase or omit |
| Specific religious/scriptural names with violence proximity | Soften ("lord of death" instead of "god of death") |
| Political/communal references (any form) | Avoid in dharmic-content posts |

Validated 2026-04-25: removed "beautiful women" from the Yama-Nachiketa scriptural reference along with ASCII sanitization. Cannot isolate which fix was load-bearing — both applied together. Default to applying both.

---

## 🟢 LEGACY ENABLEMENT EVIDENCE: What worked on the 2026-04-25 path

**Validated to publish cleanly at 1,548 chars with image attached:**
- Pure ASCII text
- Hyphens for em-dashes
- 1-2 Sanskrit anchor terms (vivek, vivinakti) without diacritics
- English translations for the rest of the foreign vocabulary
- 5-6 hashtags, all alphanumeric
- Image via public HTTPS URL (catbox.moe)
- Two-line hook → segue → main paragraphs
- Straight quotes `"..."` for dialogue

This is historical recovery evidence, not the current default template. On the owner-bound cloud path, preserve the exact approved artifact, prefer managed image bytes, and require metadata plus public read-back.

---

## Legacy Reference: the 2026-04-25 working template

```
[HOOK - one short line]

[SEGUE - one line bridge]

[OH-YEAH EXAMPLE - one paragraph, ~75 words, authentic to writer's domain]

[TRANSITIONAL CLAIM + four "which..." dilemmas]

[VIVEK + GURUKUL paragraph - one Sanskrit anchor, English everywhere else]

[SCRIPTURAL ANCHOR - Yama-Nachiketa story, ENGLISH translations of preya/shreya/dhira inline]

[LINGUISTIC KILLER MOVE - vivinakti as verbal root of vivek; ASCII only]

[CIRCLE-BACK CLOSE - one short paragraph ending on contrarian punch]

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5 #tryrehearsal
```

This template is historical evidence, not a current universal length or ASCII requirement. Current genre-specific length, caption, and metadata rules win.
