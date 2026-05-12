---
name: shva-medium-poster
description: Publish a shivakakkar.com essay to Medium under the "Built at Rehearsal" publication via Chrome automation. Imports the source URL (Medium preserves formatting + auto-sets canonical), trims the " | Dr. Shiva Kakkar" title suffix, deletes embedded images + empty-paragraph gaps, sets up to 5 tags, and submits to publication for editorial review. Use when the user asks to "post to Medium", "publish on Medium", "cross-post to Medium", "send to Built at Rehearsal", or mentions Medium publishing for any shivakakkar.com URL or local slug. The medium-mcp `publish-article` tool is broken (stale selectors) — this skill is the only working path.
---

# Shva Medium Poster

End-to-end Chrome-automation pipeline for publishing a shivakakkar.com essay to Medium's "Built at Rehearsal" publication. Ported from the empirical playbook in `~/Python Projects/Obsidian Wiki/skills/medium-publishing-automation.md` — every gotcha discovered during the 4-essay session on 2026-05-12 is encoded here.

## When To Invoke

Invoke this skill when the user asks for any of:

- "Post X to Medium" / "publish X on Medium" / "cross-post X to Medium"
- "Submit X to Built at Rehearsal"
- "Send X to Medium for review"
- Anything that involves taking a deployed shivakakkar.com post and creating its Medium mirror

If the user is **writing a new post** (not yet on shivakakkar.com), defer to `shva-medium-writer` instead — that skill produces the source markdown file. This skill picks up after that file has been merged + deployed.

## Inputs

| Input | Type | Required | Notes |
|---|---|---|---|
| `url-or-slug` | string | yes | Either a full `https://www.shivakakkar.com/posts/<slug>/` URL or just the slug |
| `submission_mode` | enum | no | `send-for-review` (default, safe) or `approve-and-publish` (irreversible) |
| `tags` | string[] (max 5) | no | If omitted, this skill asks the user for tags before proceeding |
| `fomo_title` | string | no | Optional FOMO-style title rewrite. If omitted, only the " \| Dr. Shiva Kakkar" suffix is trimmed |
| `expected_sentinel` | string | no | A sentinel string expected in the imported content (cache-staleness check). Default: `"Gradeless"` |

If a slug is provided without URL, resolve to `https://www.shivakakkar.com/posts/<slug>/` (the canonical form `SITE.website` produces).

## Pre-Flight Checks (run before state machine)

1. **Logged into Medium** — navigate to `medium.com/me`. If redirected to `/m/signin`, halt and ask user to log in via `mcp__claude-in-chrome__navigate` + manual sign-in.
2. **Source URL responds 200** — `curl -sI` the URL. If 404, halt with explanation.
3. **Source URL contains sentinel** — `curl -s` the URL, grep for `expected_sentinel`. If absent, warn user (deploy may still be propagating).
4. **Chrome MCP connected** — call `mcp__claude-in-chrome__tabs_context_mcp`. If empty, halt.
5. **`Built at Rehearsal` publication accessible** — navigate to `medium.com/built-at-rehearsal` and confirm 200. If not, halt and ask user to confirm publication name.

## State Machine

Execute in order. Each transition has Action → Wait → Success-Check → Retry-Once → Escalate-to-User.

```
IDLE
 → IMPORTING                  (open medium.com/p/import, type URL in contenteditable, click Import)
 → EDITOR_READY               (verify .postArticle-content present at medium.com/p/{id}/edit)
 → TUTORIAL_CLOSED            (close tutorial overlay top-right X if visible — required before keyboard works)
 → CACHE_VERIFIED             (read body, grep for expected_sentinel; halt with explanation if stale)
 → IMAGES_CLEANED             (loop: figure.graf scroll-into-view → click image → Backspace → wait 2s → re-query)
 → GAPS_CLEANED               (two-phase: title-adjacent empties via Backspace from first content para's start, then forward-Delete loop from end of previous content)
 → TITLE_TRIMMED              (JS Range.selectNodeContents(h3.graf--title) → real-keyboard type clean title)
 → SETTINGS_OPEN              (navigate /p/{id}/settings#reader_interests)
 → TAGS_SET                   (for each tag: click combobox → type → wait 3s → JS .click() the matching button; retry first tag once)
 → PUBLISH_MODAL              (return to /p/{id}/edit, click Publish button, wait 4s)
 → PUBLICATION_PICKER         (scroll modal, click "Submit your story to connect with community", choose "Built at Rehearsal")
 → SUBMITTED                  (click "Send for review" — NOT "Approve and publish" unless submission_mode=approve-and-publish)
```

For the full action-level recipe for each transition, see `references/operation-playbook.md`.
For DOM selectors observed on 2026-05-12, see `references/chrome-dom-landmarks.md`.
For cache-staleness sentinel detection, see `references/cache-detection.md`.
For failure-mode recovery, see `references/failure-recovery.md`.

## Hard Rules (Do Not Violate)

1. **Never use `Cmd+A` in Medium's body editor.** It selects the entire post, not the current line/paragraph. One stray `Cmd+A` + type nukes the post. Use `JS Range.selectNodeContents(element)` + `Selection.addRange()` instead.
2. **Never use `document.execCommand('insertHTML')` or synthetic ClipboardEvent paste.** Medium's sanitiser strips `<a>` tags and breaks save state. Use Medium's native Import flow.
3. **Never use `element.remove()` to delete figures or empty paragraphs.** React state desyncs from DOM → "Something is wrong and we cannot save your story" → reload loses work. Use the keyboard-driven approach in `operation-playbook.md`.
4. **Never default to `approve-and-publish`.** Only `send-for-review` is the safe default. `approve-and-publish` is irreversible — require explicit user opt-in via `submission_mode` arg.
5. **Never push directly to main on shivakakkar.com.** If a source-edit is needed before re-import, use the PR flow (`gh pr create`) — auto-mode classifier blocks direct main pushes.
6. **Never click outside the autocomplete dropdown bounds.** It dismisses the dropdown. Use the matched button's native `.click()` method, not coordinate clicks.
7. **Always call `editor.focus()` before placing JS cursor.** Without explicit focus, keystrokes don't fire even when the selection is "correctly" placed.

## Decision Defaults

| Question | Default | Override |
|---|---|---|
| Title suffix to strip | `" \| Dr. Shiva Kakkar"` | Pass full new title via `fomo_title` arg |
| Submission mode | `send-for-review` | `submission_mode=approve-and-publish` (requires user confirmation) |
| Tutorial overlay handling | Auto-close on first detect | None |
| Image cleanup | Delete all embedded `figure.graf` | Pass `keep_images: true` |
| Empty paragraph cleanup | Delete all `.graf--empty` (two-phase) | Pass `keep_gaps: true` |
| Cache-stale recovery | Halt and ask user | Pass `force_proceed: true` |

## Working Patterns You Will Need

### Pattern: Trim title (replace `h3.graf--title` content)

```js
const h = document.querySelector('h3.graf--title');
h.scrollIntoView({block: 'center'});
const range = document.createRange();
range.selectNodeContents(h);
const sel = window.getSelection();
sel.removeAllRanges();
sel.addRange(range);
```

Then via `mcp__claude-in-chrome__shortcuts_execute` or real-keyboard type the clean title.

**Avoid leading unicode chars** like `₹` — Medium's editor sometimes registers only the unicode char and drops following letters. Workaround: use `Rs` instead of `₹` or move the unicode mid-string.

### Pattern: Forward-Delete an empty paragraph from end-of-previous-content

```js
const editor = document.querySelector('.postArticle-content');
editor.focus();
const empties = Array.from(document.querySelectorAll('.graf--empty'));
const eligible = empties.filter(x => {
  const p = x.previousElementSibling;
  return p && !p.classList.contains('graf--title')
           && !p.classList.contains('graf--empty')
           && p.textContent.trim().length > 0;
});
const e = eligible[0];
if (e) {
  const prev = e.previousElementSibling;
  const r = document.createRange();
  r.selectNodeContents(prev);
  r.collapse(false);
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(r);
  prev.scrollIntoView({block: 'center'});
}
```

Then real-keyboard `Delete` key (FORWARD delete). Loop until `eligible.length === 0`.

### Pattern: Backspace title-adjacent empties from start of first content paragraph

```js
const grafs = Array.from(document.querySelectorAll('.graf'));
const firstContent = grafs.find(g =>
  g.textContent.trim().length > 0
  && !g.classList.contains('graf--title')
  && !g.classList.contains('graf--empty')
);
firstContent.scrollIntoView({block: 'center'});
const r = document.createRange();
r.setStart(firstContent.firstChild || firstContent, 0);
r.collapse(true);
const s = window.getSelection();
s.removeAllRanges();
s.addRange(r);
```

Then real-keyboard `Backspace` repeatedly until no empties immediately precede the title-content region.

### Pattern: Delete an embedded image

```js
const fig = document.querySelector('figure.graf');
fig.scrollIntoView({block: 'center'});
const img = fig.querySelector('img');
const r = img.getBoundingClientRect();
return {x: r.left + r.width/2, y: r.top + r.height/2};
```

Then real-keyboard click on (x, y) → image gets green border → real-keyboard `Backspace` → wait 2s → re-query. Loop until `document.querySelectorAll('figure.graf').length === 0`.

### Pattern: Add a tag

```
1. JS-compute combobox bounding rect, click center coords
2. real-keyboard type "AI" (or whatever tag)
3. wait 3s (autocomplete fetch is async)
4. JS:
   const btn = Array.from(document.querySelectorAll('button'))
     .find(b => /^AI\s*\(\d+/.test(b.textContent.trim()));
   if (btn) btn.click();
5. If first attempt fails ("not found"), retry once after 5s
```

**Comma is forbidden** in tag text — Medium rejects. **Max 25 chars per tag.** **Max 5 tags total.**

## Verification After Each Run

1. Confirm URL ends in `/me/stories?tab=submissions-outbox` with success banner
2. Open the publication's queue at `medium.com/built-at-rehearsal/submissions` and verify the post appears with "Pending review" status
3. Open the draft itself and verify:
   - Title has no `| Dr. Shiva Kakkar` suffix
   - No `figure.graf` elements present
   - No `.graf--empty` elements present
   - Canonical URL (visible in story settings) points back to shivakakkar.com

## Related

- Skill: `shva-medium-writer` (drafts the source essay; runs BEFORE this skill)
- Wiki: `~/Python Projects/Obsidian Wiki/skills/medium-publishing-automation.md` (source playbook)
- Wiki: `~/Python Projects/Obsidian Wiki/projects/shivakakkar-com/shivakakkar-com.md` (project context)
