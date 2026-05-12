# Operation Playbook — 7 Procedures

Each operation is a self-contained recipe with concrete steps, JS snippets, retry rules, and verification checks. The state machine in `SKILL.md` chains these together.

---

## Op 1 — Import a Story

**Goal**: Take a shivakakkar.com URL and create a Medium draft from it, preserving formatting and auto-setting canonical URL.

```
1. Call `mcp__claude-in-chrome__navigate` with url=`https://medium.com/p/import`
2. Wait 3s for render
3. Find the URL input (a <div contenteditable="true"> — NOT an <input>):
   - Use `find` with query "Paste your story link textbox"
   - OR JS-query: document.querySelector('[contenteditable="true"]')
4. Click into the input (real-keyboard click on its bounding-rect center)
5. Real-keyboard type the source URL: https://www.shivakakkar.com/posts/<slug>/
6. Find and click the "Import" button (find query "Import button")
7. Wait 10s for fetch + render
8. Verify: location.href now matches /p/<new-id>/edit
   - Capture the new id; persist for subsequent ops
```

**Gotchas**:
- The URL input is `<div contenteditable>` — `form_input` will not work
- Coordinate-based clicks shift when the viewport changes; always re-query from `getBoundingClientRect()`
- First-click occasionally misses; if `location.href` doesn't change after 10s, retry the Import button click once

**Verification**: After 10s, `mcp__claude-in-chrome__javascript_tool` runs `location.pathname` and expects `/p/<some-id>/edit`.

---

## Op 2 — Close the Tutorial Overlay

**Goal**: Dismiss the overlay that covers the editor on first import. **You cannot type into title or body while it's open.**

```
1. Screenshot to confirm overlay presence
2. Find the close X (top-right):
   - Use `find` with query "close tutorial overlay X button"
   - Coordinates fallback: top-right of viewport, ~(viewport.width - 50, 35)
3. real-keyboard click on the X
4. Wait 1s
5. Verify: re-screenshot or JS `document.querySelector('[role="dialog"]')` returns null
```

If the first click misses, retry once. If two clicks fail, escalate — keystroke routing will not work past this step.

---

## Op 3 — Cache-Staleness Check

**Goal**: Verify the imported content reflects the latest shivakakkar.com deploy (Medium's importer is cached, ~1hr TTL).

```
1. JS: document.querySelector('.postArticle-content').innerText.slice(0, 3000)
2. Check for the `expected_sentinel` string (default: "Gradeless")
3. If absent: halt and surface to user:
   "Imported content does not contain expected sentinel '<sentinel>'.
    Medium's importer is likely serving cached pre-deploy content.
    Options: (a) wait ~1 hour and retry, (b) bump the source slug,
    (c) pass force_proceed: true to skip this check."
4. If present: proceed.
```

**Cache-busting via query params (`?fresh=1`, `?v=2`, apex vs. www, fragment URLs) does NOT work.** Medium keys by the canonical link extracted from the source page. The only reliable bust is waiting or changing the source slug.

See `cache-detection.md` for sentinel-string design notes.

---

## Op 4 — Image Cleanup (Delete Imported Figures)

**Goal**: Remove all `figure.graf` blocks (Astro OG-generated section dividers become embedded images on Medium import).

```
Loop while document.querySelectorAll('figure.graf').length > 0:
  1. JS:
     const fig = document.querySelector('figure.graf');
     fig.scrollIntoView({block: 'center'});
     const img = fig.querySelector('img');
     const r = img.getBoundingClientRect();
     return {x: r.left + r.width/2, y: r.top + r.height/2};
  2. real-keyboard click on (x, y)  → image gets green border (selected state)
  3. real-keyboard press Backspace key
  4. wait 2s for DOM to settle
  5. Re-query count; if unchanged, retry once; if still unchanged, escalate
```

**Anti-pattern**: `fig.remove()` desyncs React state and breaks save. Must use keyboard.

**Gotcha**: Click coordinates must land on the image bounds; clicks above/below don't select. Always recompute `getBoundingClientRect()` per iteration.

**Gotcha**: Order matters — `scrollIntoView()` first, then click. Reverse order drops the selection.

---

## Op 5 — Gap Cleanup (Delete Empty Paragraphs)

**Goal**: Remove all `.graf--empty` placeholders. These render as visible gaps for readers. Each post typically has 8–14 after import + image cleanup.

**Two-phase approach** — title-adjacent empties need Backspace; others need Forward-Delete.

### Phase A — Title-adjacent empties (Backspace from start of first content)

Runs when there's an empty between the title and the first content paragraph (very common after image cleanup).

```js
const grafs = Array.from(document.querySelectorAll('.graf'));
const firstContent = grafs.find(g =>
  g.textContent.trim().length > 0
  && !g.classList.contains('graf--title')
  && !g.classList.contains('graf--empty')
);
if (!firstContent) return;
firstContent.scrollIntoView({block: 'center'});
const r = document.createRange();
r.setStart(firstContent.firstChild || firstContent, 0);
r.collapse(true);  // collapse to START
const s = window.getSelection();
s.removeAllRanges();
s.addRange(r);
document.querySelector('.postArticle-content').focus();
```

Then real-keyboard press `Backspace` once. Loop and re-evaluate: if there's still an empty immediately after the title, repeat. **Never call `Cmd+A`-equivalent on the whole editor.**

### Phase B — Forward-Delete from end of previous content

For empties between body paragraphs (not title-adjacent).

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
if (!e) return null;
const prev = e.previousElementSibling;
const r = document.createRange();
r.selectNodeContents(prev);
r.collapse(false);  // collapse to END
const s = window.getSelection();
s.removeAllRanges();
s.addRange(r);
prev.scrollIntoView({block: 'center'});
return eligible.length;
```

Then real-keyboard press `Delete` key (FORWARD delete). Loop until JS returns null or 0.

**Anti-patterns**:
- `document.execCommand('delete', false)` — desyncs save state ("Something is wrong" banner)
- `empty.remove()` — same React desync
- Backspace twice on a blockquote — first turns it to paragraph, second eats period from previous text

---

## Op 6 — Title Trim (Strip " | Dr. Shiva Kakkar" Suffix)

**Goal**: Replace the H3 title with a clean version (suffix stripped, optionally FOMO-rewritten).

```js
const h = document.querySelector('h3.graf--title');
h.scrollIntoView({block: 'center'});
const range = document.createRange();
range.selectNodeContents(h);
const sel = window.getSelection();
sel.removeAllRanges();
sel.addRange(range);
```

Then real-keyboard type the clean title (or `fomo_title` if provided).

**Gotchas**:
- **Avoid leading unicode chars** like `₹`. Medium's editor sometimes registers only the unicode char and drops subsequent letters. Confirmed broken: typing `"₹4 Lakh ..."` resulted in just `"₹"`. Workaround: use `"Rs 4"` or move the unicode mid-string.
- The selection covers entire H3 contents; real-keyboard type REPLACES the selection. Do not press Backspace first — Medium sometimes merges the title with what's above it.

**Verification**: `document.querySelector('h3.graf--title').innerText` matches the expected clean title.

---

## Op 7 — Tags (Reader Interests) + Submission

### 7a — Add Tags

Navigate to `medium.com/p/<id>/settings#reader_interests`. Wait 2s.

For each tag (max 5):

```
1. JS-compute combobox bounding rect; click into the center of it
   const cb = document.querySelector('[role="combobox"]');
   const r = cb.getBoundingClientRect();
   return {x: r.left + 20, y: r.top + r.height/2};
2. real-keyboard click on (x, y)
3. real-keyboard type the tag text (e.g., "AI")
4. wait 3s for autocomplete dropdown (async)
5. JS:
   const tagName = "AI";  // current tag
   const re = new RegExp("^" + tagName.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&") + "\\s*\\(");
   const btn = Array.from(document.querySelectorAll('button'))
     .find(b => re.test(b.textContent.trim()));
   if (btn) { btn.click(); return true; } else { return false; }
6. If returned false on first tag, wait 5s and retry once (first-tag-fails race is documented)
```

**Constraints**:
- Max 5 tags
- Max 25 chars per tag
- Letters, numbers, spaces, dashes only — comma forbidden
- Dropdown auto-closes on outside click — use the button's native `.click()`, not coordinate clicks

### 7b — Submit to Publication

Navigate back to `medium.com/p/<id>/edit`.

```
1. Find and click Publish button (header, top-right)
2. wait 4s for modal
3. Verify URL contains "/submission?" or modal is visible
4. Scroll modal down 6 ticks
5. Find link "Submit your story to connect with community." → click
6. wait 3s
7. Find publication card "Built at Rehearsal" → click
8. wait 3s, scroll modal down 10 ticks
9. Find button "Send for review" (default) OR "Approve and publish" (if submission_mode=approve-and-publish AND user confirmed)
10. Click it
11. wait 4s — URL should redirect to /me/stories?tab=submissions-outbox
12. Verify success banner / outbox row for the new submission
```

**Gotcha**: First Publish click sometimes only scrolls the page. If after 5s the URL hasn't changed to include `/submission?` or the modal isn't visible, retry the click.

**Decision default**: `Send for review` (safe — editorial queue). Only `Approve and publish` if user explicitly opted in via `submission_mode=approve-and-publish`. Approve-and-publish is irreversible.

---

## Op Sequencing — When to run what

```
Op 1 → Op 2 → Op 3 → [if cache stale: halt] → Op 4 → Op 5 (phase A then phase B) → Op 6 → Op 7a → Op 7b
```

Image cleanup (Op 4) is run BEFORE gap cleanup (Op 5) because deleting images creates new empty paragraphs.
Title trim (Op 6) is run AFTER gap cleanup (Op 5) because Phase A of gap cleanup operates from the first content paragraph relative to the title; keeping the title untouched until after gap cleanup avoids cursor-position edge cases.
