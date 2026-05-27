# LinkedIn Publishing Rules — Hard Constraints (validated 2026-04-25)

> **What this covers:** The LinkedIn API's actual ingest behavior via this MCP path, validated through 3 publish attempts on the same post (2 truncations, 1 clean). These are HARD CONSTRAINTS — not preferences.
>
> **When to load:** During god-mode Step G7 (Final Output) — BEFORE saving the LinkedIn draft, run the post text through the ASCII sanitizer described here.
>
> **Status of these rules:** PROMOTED — recurrence ≥ 2 on truncation evidence.

---

## The Validated Failure Mode

**Symptom:** A 1,577-character LinkedIn post (well under the 3,000-char documented limit) silently truncated at exactly "preya" — character ~1,003 — on TWO consecutive publish attempts via this MCP. User had to delete both manually.

**Root cause:** LinkedIn's ingest pipeline (via this MCP route) cannot handle certain non-ASCII byte sequences. When it hits one, it silently drops the rest of the post. The API returns success and a valid URN. The LinkedIn UI shows a fully-formed post — just truncated.

**The fix that worked:** Same content rewritten to pure ASCII published cleanly at 1,548 chars with all paragraphs intact.

---

## 🔴 HARD RULE 1: Pure ASCII text only

LinkedIn posts via this MCP MUST be 7-bit ASCII. Convert before publishing:

| Original | Convert to | Reason |
|---|---|---|
| Em-dash `—` (U+2014) | Hyphen `-` | TRIGGERS TRUNCATION |
| En-dash `–` (U+2013) | Hyphen `-` | TRIGGERS TRUNCATION |
| Smart quotes `"` `"` | Straight `"` | Risk of truncation |
| Smart apostrophe `'` | Straight `'` | Risk of truncation |
| Diacritic `ī` `ā` `ū` `ē` `ō` etc. | Drop diacritic (`i` `a` `u` `e` `o`) | TRIGGERS TRUNCATION |
| Ellipsis `…` (U+2026) | Three dots `...` | Risk of truncation |
| Non-breaking space (U+00A0) | Regular space | Risk of truncation |

**Validation script (run before every LinkedIn publish):**

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

If the script flags any character, REPLACE it before publishing. Do not attempt to publish with non-ASCII content.

---

## 🔴 HARD RULE 2: Sanskrit / non-English transliterations are OK only if pure ASCII

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

## 🔴 HARD RULE 4: Mandatory publish protocol — six steps

Direct `linkedin_post` is BANNED for any post over 200 chars. The full mandatory cycle:

```
Step 1  ASCII Sanitize
        Run the validation script. Fix any non-ASCII char before proceeding.
        Replace em-dashes with hyphens, drop diacritics, simplify hashtags.

Step 2  Draft Save  (linkedin_drafts_save)
        Save the sanitized text + image as a draft.

Step 3  Draft Readback Verify  (linkedin_drafts_get)
        Read the saved draft. Diff returned text vs intended text.
        If any character mismatch, fix and re-save.

Step 4  Publish Draft  (linkedin_drafts_publish + confirm POST IT)
        Promote the draft to published.
        Cloudflare MCP confirmation is a separate call: when the preview
        returns an Action ID, call linkedin_confirm with that
        pending_action_id and confirmation="POST IT". Do not rerun
        linkedin_drafts_publish or linkedin_post; that creates a new preview.

Step 5  Post-Publish History Verify  (linkedin_posts_history limit=1)
        Fetch the just-published post from history. Diff returned text
        against the intended text — character-for-character.

Step 6  On Truncation: Auto-delete + Retry
        If Step 5 reveals truncation:
        - Call linkedin_delete on the truncated URN
        - Confirm DELETE IT
        - Return to Step 1 with stricter ASCII sanitization
        - Maximum 2 retry attempts before alerting user
```

**Why all six steps are mandatory:**
- Steps 1-3 catch issues before publish (saves the user from seeing a broken post).
- Steps 4-5 catch the LinkedIn-side truncation (which Steps 2-3 cannot detect, because drafts store full text correctly even when publish truncates — validated 2026-04-25).
- Step 6 is the recovery loop — never leave a truncated post live for the user to clean up.

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

## 🟢 ENABLEMENT: What works

**Validated to publish cleanly at 1,548 chars with image attached:**
- Pure ASCII text
- Hyphens for em-dashes
- 1-2 Sanskrit anchor terms (vivek, vivinakti) without diacritics
- English translations for the rest of the foreign vocabulary
- 5-6 hashtags, all alphanumeric
- Image via public HTTPS URL (catbox.moe)
- Two-line hook → segue → main paragraphs
- Straight quotes `"..."` for dialogue

This is the validated post template — start from this shape and adapt content.

---

## Reference: the validated working template

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

Total target: 1,400-1,700 chars (well clear of the 3,000-char documented ceiling and the ~1,000-char Sanskrit-truncation tripwire).
