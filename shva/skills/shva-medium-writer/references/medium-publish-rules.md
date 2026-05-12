# Publish Rules — Hard Constraints

Constraints that apply at the Astro frontmatter level AND at the Medium import level. The output of `shva-medium-writer` must satisfy both, because the same markdown file feeds both pipelines.

## Frontmatter Schema (Astro Zod)

The shivakakkar.com content collection (`src/content.config.ts`) validates this schema. Failure = `pnpm run build` fails.

```yaml
---
author: Dr. Shiva Kakkar              # default; omit to inherit from SITE.author
pubDatetime: 2026-MM-DDTHH:MM:00Z     # REQUIRED. ISO 8601 UTC
modDatetime: 2026-MM-DDTHH:MM:00Z     # optional; only on edits
title: "Why ...?"                     # REQUIRED. See title rules below
slug: <kebab-case>                    # optional; derived from filename otherwise
featured: false                       # default false; true to surface on homepage
draft: false                          # default false; true to hide
tags:                                  # default ["others"]
  - <tag-1>
  - <tag-2>
  - <tag-3>
  - <tag-4>
  - <tag-5>
ogImage: ""                           # leave empty unless explicit override
description: "<140-156 chars>"        # REQUIRED. SEO meta + Medium subtitle
timezone: "Asia/Kolkata"              # optional; override SITE.timezone
---
```

## Title Rules

| Rule | Why |
|---|---|
| 40-55 characters optimal | Medium feed CTR + SERP truncation |
| Question form for Medium feed | FOMO — interrogative gets more clicks than declarative |
| No leading unicode chars | Medium's editor sometimes registers only the unicode char (e.g., `₹`) and drops following letters. Use `Rs` or move the unicode mid-string. |
| No site-suffix | Site-suffix `" \| Dr. Shiva Kakkar"` is added by the Astro layout — do not include in frontmatter |
| Title case OR sentence case, not screaming | Avoid ALL CAPS or `Click Here Now` patterns |
| Avoid clickbait that doesn't deliver | Medium downranks misleading titles |

### Approved patterns (from current 4 essays)

- `"Why That ₹4 Lakh IIM Course Won't Make You AI-Ready? — I"` (rhetorical question, part marker)
- `"Why most people are not good AI users?"` (curiosity-gap question)
- `"The People Deciding India's AI Future Won't Spend ₹400 on It."` (declarative paradox — works for non-question titles too)
- `"Your Expertise Is Now a Liability. Here's Why the Intern Outperforms You with AI."` (paradox + payoff teaser)

## Description Rules

| Rule | Why |
|---|---|
| 140-156 characters | Google SERP description limit + Medium subtitle limit |
| Compress the thesis to one sentence | This is the elevator pitch |
| Numbers help | "Stanford, Harvard, and CMU all found ..." beats "Research shows ..." |
| End without a period if cleaner | Optional; both work |

## Tag Rules (CRITICAL — Medium compatibility)

These rules apply at Medium import time. **Violations are hard rejections by Medium's tag input.**

| Rule | Limit | Source |
|---|---|---|
| Max tags | 5 | Medium UI cap |
| Max chars per tag | 25 | Medium UI cap |
| Allowed chars | letters, numbers, spaces, dashes | Medium UI validator |
| Forbidden chars | comma, slash, period, ampersand, parenthesis | Medium UI rejects |
| Plural vs singular | Use the form Medium's autocomplete prefers (check by typing the singular first; if no match, try plural) | Autocomplete-driven discovery only |

### Tag selection strategy

- **One topic anchor** (e.g., `AI`, `Education`)
- **Two domain refiners** (e.g., `Executive Education`, `Edtech`)
- **One audience tag** (e.g., `Management`, `Leadership`, `Founders`)
- **One thesis tag** (e.g., `AI Adoption`, `Future of Work`, `Credentialism`)

### Verified tags (autocomplete-confirmed during 2026-05-12 session)

- `AI` (966K)
- `Management` (76K)
- `Education` (192K)
- `Edtech` (143K)
- `Future of Work` (43K)
- `Leadership` (430K)
- `Executive Education` (8K)
- `AI Adoption`
- `Indian Education`
- `Genai`
- `Consumer Behavior`
- `Digital Economy`
- `India`
- `SaaS`

## File Naming

- Filename should match slug: `src/data/blog/<slug>.md`
- Slug should be kebab-case, no special chars
- For Part I / Part II essays, suffix with `-I` and `-II` (not `-part-1` — already established by `iim-genai-courses-I.md`)
- Slugs prefixed `_` are excluded from URL paths (Astro convention — used for `_releases/`)

## Body Markdown Rules

- **Use `##` and `###` for headers** — Astro's prose styling expects them
- **Use `>` for blockquotes** — render as pull-quote on shivakakkar.com and on Medium
- **Bold sparingly** — `**X**` should mark structural anchors (TL;DR label) or essay-level claims, not just emphasis
- **No raw HTML** — Astro converts Markdown via remark/rehype; HTML survives but is fragile across Medium import
- **Images optional** — most essays have no images; if used, place in `public/` and reference as `/path.png`. Note: Medium import converts these to embedded figures that the poster skill will delete by default.

## Per-Post `pubDatetime` Convention

- New essays: set to now in UTC (`date -u +%Y-%m-%dT%H:%M:00Z`)
- Backdated essays (when migrating older content): use the original publish date, NOT today
- Future-dated (scheduled): set to future ISO timestamp. `postFilter.ts` honors this in production (15-min margin) but shows future posts in dev mode

## Compatibility Check Before Output

```bash
cd ~/Python\ Projects/shivakakkar.com
pnpm run build
```

Should return: `0 errors, 0 warnings, 0 hints`. If errors, the most common is frontmatter Zod validation — fix and re-run.

## Compatibility Check For Medium Import (After Deploy)

Once the post is live on shivakakkar.com:

```bash
curl -sI https://www.shivakakkar.com/posts/<slug>/ | head -5
```

Should return `HTTP/2 200`. If `404`, deploy not propagated — wait.

Then verify the canonical link in the served HTML:

```bash
curl -s https://www.shivakakkar.com/posts/<slug>/ | grep -i 'canonical'
```

Should contain `<link rel="canonical" href="https://www.shivakakkar.com/posts/<slug>/" ... />`. The Medium importer uses this as its cache key.
