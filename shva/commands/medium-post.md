---
description: "Publish a shivakakkar.com essay to Medium under 'Built at Rehearsal' via Chrome automation. Trims title, sets tags, deletes embedded images + empty-paragraph gaps, submits for editorial review."
allowed-tools: ["Read", "Write", "Bash", "Grep", "Glob"]
model: sonnet
argument-hint: "<url-or-slug, e.g. 'https://www.shivakakkar.com/posts/india-ai-readiness-tier-2-problem/' or just 'india-ai-readiness-tier-2-problem'>"
---

# /shva:medium-post — Publish To Medium

> Takes a shivakakkar.com URL or slug and creates a Medium draft under the **Built at Rehearsal** publication. Imports via Medium's native flow (auto-canonical preserves shivakakkar.com SEO), cleans up imported artifacts, sets tags, and submits for editorial review.

**Input:** `/shva:medium-post <url-or-slug>` *(or run blank to be prompted)*
**Output:** Medium draft submitted to "Built at Rehearsal" with status "Pending review"

---

## Step 1 — Load the skill

Open and read this skill in full before doing anything else:

```
/Users/shivakakkar/.claude/plugins/marketplaces/shva/shva/skills/shva-medium-poster/SKILL.md
```

Also read the 4 reference files under `shva-medium-poster/references/`:
- `chrome-dom-landmarks.md` — selectors for Medium's editor (verify on every run)
- `operation-playbook.md` — 7 concrete operations as numbered procedures
- `cache-detection.md` — sentinel-string verification for cache-staleness
- `failure-recovery.md` — failure modes table with recovery procedures

## Step 2 — Resolve the input

If `$ARGUMENTS` is empty, ask:
> Which post to publish? Provide a shivakakkar.com URL or just the slug.

If a slug is provided (no `https://`), resolve to: `https://www.shivakakkar.com/posts/<slug>/`

## Step 3 — Pre-flight checks

Run all 5 pre-flight checks from the skill:

1. **Logged into Medium** — Navigate to `medium.com/me`. If redirected to `/m/signin`, halt and ask user to sign in.
2. **Source URL responds 200** — `curl -sI <url>` returns HTTP 200.
3. **Source URL contains sentinel** — `curl -s <url> | grep -F "Gradeless"` (default sentinel) returns at least one hit.
4. **Chrome MCP connected** — Call `mcp__claude-in-chrome__tabs_context_mcp`.
5. **Built at Rehearsal accessible** — Navigate to `medium.com/built-at-rehearsal` and confirm 200.

If any check fails, halt with explanation. Do not proceed.

## Step 4 — Confirm tags + submission mode with user

Tags are NOT auto-derived — ask the user:

> What 5 tags should the Medium post have? (max 25 chars each; letters/numbers/spaces/dashes only; no commas)

If the source post's frontmatter has tags, propose them as defaults but require user confirmation (Medium tag autocomplete may not match all of them).

Default submission mode: `send-for-review` (safe). Confirm with user if they want `approve-and-publish` (irreversible).

## Step 5 — Execute the state machine

Follow the skill's state machine in order:

```
IDLE → IMPORTING → EDITOR_READY → TUTORIAL_CLOSED → CACHE_VERIFIED
     → IMAGES_CLEANED → GAPS_CLEANED → TITLE_TRIMMED → SETTINGS_OPEN
     → TAGS_SET → PUBLISH_MODAL → PUBLICATION_PICKER → SUBMITTED
```

For each transition: Action → Wait → Success-Check → Retry-Once → Escalate-to-User if still failing. Concrete recipes for each transition are in `references/operation-playbook.md`.

## Step 6 — Verify and report

After SUBMITTED:

1. Confirm URL is now `medium.com/me/stories?tab=submissions-outbox` with success banner
2. Optionally navigate to `medium.com/built-at-rehearsal/submissions` and confirm the post appears with "Pending review"
3. Print to the user:
   - The Medium draft URL
   - Confirmation of trimmed title, set tags, deleted images count, deleted gaps count
   - Submission status (Pending review under Built at Rehearsal)

## Hard Rules (Never Violate)

1. **Never `Cmd+A` in Medium's body editor** — selects entire post; one Cmd+A + type nukes the draft.
2. **Never `document.execCommand('insertHTML')` or synthetic paste** — strips links + breaks save state.
3. **Never `element.remove()` for images/empties** — React desyncs from DOM → save fails.
4. **Default to `send-for-review`** — `approve-and-publish` is irreversible.
5. **Never push to main on shivakakkar.com** — auto-mode blocks it; use PR flow.
6. **Always `editor.focus()` before JS cursor placement** — otherwise keystrokes don't fire.

## Notes

- The `medium-mcp` tool's `publish-article` is broken (stale selectors). This command uses Chrome browser automation exclusively.
- If Medium changes its UI, expect selectors to break. Update `chrome-dom-landmarks.md` first, then re-run.
- Cache-staleness is detected via sentinel string. If detected, the command halts and asks the user to wait, bump the slug, or force_proceed.

---

*Skill source: `~/.claude/plugins/marketplaces/shva/shva/skills/shva-medium-poster/`*
*Companion: `/shva:medium-write` (writes the source essay BEFORE this command)*
*Source playbook: `~/Python Projects/Obsidian Wiki/skills/medium-publishing-automation.md`*
