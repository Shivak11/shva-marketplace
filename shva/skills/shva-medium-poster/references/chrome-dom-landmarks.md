# Chrome DOM Landmarks — Medium Editor

Empirically observed on 2026-05-12 during the 4-essay publishing session. **Medium ships frontend changes monthly — verify these on every run.** When a selector breaks, fall back to semantic queries via `mcp__claude-in-chrome__find` using aria-label / role / name, not CSS.

## Editor page (`medium.com/p/{id}/edit`)

| Element | Selector | Purpose |
|---|---|---|
| Editor root | `.postArticle-content.js-postField.js-notesSource.editable` | Single contenteditable div containing both title and body |
| Title | `h3.graf--title` | The post title (H3 in DOM, displayed as H1 visually) |
| Any paragraph | `.graf` | Generic paragraph class (H1/H2/H3/P/BLOCKQUOTE all share this) |
| Empty paragraph | `.graf--empty` | Empty placeholder paragraphs — the "gap" culprits |
| Title-styled paragraph | `.graf--title` | Only the post title has this — useful as a "skip the title" filter |
| Image figure | `figure.graf` | Wraps imported images |
| Image element | `figure.graf img` | The actual `<img>` |
| Caption | `figcaption` | Image caption (placeholder text "Type caption for image (optional)" when empty) |
| Publish button | `button` containing "Publish" text (top-right of header) | Opens the publish modal |
| Kebab menu | three-dot button next to Publish | Opens Story Settings, Change topics, etc. |
| Save status indicator | text "Saved" or "Saving..." (top header) | Orange = save-in-progress; black = saved |

## Import page (`medium.com/p/import`)

| Element | Selector | Purpose |
|---|---|---|
| URL input | `<div contenteditable="true">` with placeholder "Paste your story link" | NOT a `<input>` — accessibility tree reports as "textbox" but type is DIV |
| Import button | `<button>` with text "Import" | Triggers the fetch + parse |

**Gotcha**: The URL input is a `contenteditable` DIV. Browser automation tools expecting `INPUT/TEXTAREA` (like `form_input`) will fail. Use click-then-type.

## Settings page (`medium.com/p/{id}/settings`)

| Element | Selector | Purpose |
|---|---|---|
| Reader Interests combobox | `[role="combobox"]` (placeholder "Add a topic...") | Tag input |
| Autocomplete buttons | `<button>` containing tag text like `"AI (966K)"` | Dropdown options after typing |
| SEO Title input | textbox under "SEO Title" heading | Distinct from H3 title — auto-generated suffix lives here |
| Sidebar nav | links: "Reader Interests", "SEO Settings", "Advanced Settings" | Jump between settings sections |

## Submission modal (after clicking Publish)

| Element | Purpose |
|---|---|
| `"Submit your story to connect with community."` link | First step of publication submission flow |
| Publication card (e.g., `"Built at Rehearsal"`) | Choose target publication |
| `"Send for review"` button | Queue in publication editorial review (SAFE default) |
| `"Approve and publish"` button | Immediately publish (IRREVERSIBLE — opt-in only) |
| `"Schedule for later"` link | Schedule publication for future date |

## Tutorial Overlay

After every import, Medium shows a tutorial overlay covering the editor. **You cannot type into the title or body until this is dismissed.**

| Element | Coordinates (viewport-dependent) |
|---|---|
| Close X button (top-right) | ~(1175, 47) at 1223×598 · ~(1313, 28) at 1342×676 · ~(1500, 35) at 1568×745 |

Use `find` with query `"close tutorial overlay X button"` to get a stable ref. Re-screenshot after the click to confirm dismissal — sometimes the first click misses.

## Viewport-Coordinate Tip

When the Chrome window is at different sizes, click coordinates shift. **Re-query coordinates from the DOM** instead of hardcoding:

```js
const el = document.querySelector('selector');
const r = el.getBoundingClientRect();
return {x: r.left + r.width/2, y: r.top + r.height/2};
```

## URLs You Will Hit

| URL pattern | Purpose |
|---|---|
| `medium.com/p/import` | The import flow entry |
| `medium.com/p/{id}/edit` | The post editor after import |
| `medium.com/p/{id}/settings#reader_interests` | Tag settings |
| `medium.com/p/{id}/settings#seo` | SEO settings |
| `medium.com/built-at-rehearsal` | The publication landing page |
| `medium.com/built-at-rehearsal/submissions` | The publication's submission queue (post-submit verification) |
| `medium.com/me/stories?tab=submissions-outbox` | Your outbox; lands here after `Send for review` |
| `medium.com/m/signin` | The sign-in page (pre-flight: confirm you don't land here from `/me`) |
