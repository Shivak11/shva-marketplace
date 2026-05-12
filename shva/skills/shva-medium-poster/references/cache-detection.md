# Cache-Staleness Detection

Medium's importer has a **server-side content cache keyed by `<link rel="canonical">`** extracted from the source page. Cache TTL observed empirically at ~1 hour (cleared between Post 1 import and Post 2 import within the same session). Cache-busting via query params, www vs apex, or fragment URLs **does not work** because the cache key is the canonical link, not the request URL.

## The Problem

If you push a content update to shivakakkar.com and immediately re-import, Medium serves you the pre-deploy content. Two real failure modes:

1. **Stale bio**: After PR #2 updated the bio across all 4 posts, the first re-import returned PR #1's bio (`"Jaipuria AI Labs (now Gradeless)"`). Required manual bio replacement in the Medium draft.
2. **Stale body**: If you fix a typo and re-import within the hour, the fix may not appear.

## Detection — Sentinel String

A sentinel is a unique-enough phrase that should appear in the latest shivakakkar.com version but NOT in any prior version. Pick a phrase from the most recent edit.

**Default sentinel for shivakakkar.com (as of 2026-05-12)**: `"Gradeless, the AI venture"` (appears in the v1.0 bio shipped via PR #2).

**Custom sentinels** when content changes invalidate the default:
- After bio v2.0 ships → update the default sentinel in this file
- For per-post edits, set `expected_sentinel` to a phrase unique to that edit

## Detection Procedure

After Op 1 (Import) completes:

```js
const body = document.querySelector('.postArticle-content').innerText.slice(0, 5000);
return body.includes(EXPECTED_SENTINEL);
```

If returns `false`:

1. Halt the pipeline
2. Surface to user:
   ```
   ⚠️ Cache-staleness detected.
   Imported content does not contain expected sentinel: "<sentinel>"
   Medium's importer is likely serving cached content from before your latest deploy.
   
   Options:
     a) Wait ~1 hour and rerun /shva:shva-medium-poster <slug>
     b) Bump the source slug (requires PR + redeploy + loses canonical SEO)
     c) Pass force_proceed: true to skip this check and edit the Medium draft manually
   ```
3. Wait for user input before continuing

## Why query-param cache-busting fails

Medium fetches the URL, parses HTML, and reads `<link rel="canonical" href="...">`. The canonical URL is the cache key. Adding `?fresh=1` to your request URL changes the request but the page's canonical link still points at the canonical URL → Medium uses the cached entry for that canonical.

`shivakakkar.com` sets canonical via `src/layouts/Layout.astro` to `https://www.shivakakkar.com/posts/<slug>/` regardless of how the page was requested.

## Why apex vs www doesn't bust the cache

Same reason — apex (`shivakakkar.com`) redirects to www (`www.shivakakkar.com`), but the canonical link in the served HTML is always the www form. Cache key unchanged.

## What DOES work to bust the cache

1. **Wait the TTL out** — observed ~1 hour, no longer than 2 hours in practice
2. **Change the slug** — different canonical URL, new cache entry. Bad SEO trade-off (loses any inbound links to the old slug)
3. **Delete and re-create the Medium draft** — doesn't help if Medium's server-side cache is upstream of the import handler
