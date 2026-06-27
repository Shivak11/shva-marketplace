# 02 - Live query protocol (Stage 2)

The source map rots. Treat the wiki map as the curated seed and Raindrop as the live layer. Pull candidates fresh for the brief in hand, then re-index. Do not echo the frozen list from the wiki map as if it were the answer.

## The two layers

1. **Wiki map (curated seed).** Read `/Users/shivakakkar/Python Projects/Obsidian Wiki/maps/mdp-course-source-router.md` in full. It carries the session-beat taxonomy, the human-vetted picks under each beat, the open-source tool-suite table, and the tensions. These are the trusted, already-judged items. Start here.
2. **Raindrop (live layer).** Query the bookmark library for anything saved since the map was last updated, plus anything the map missed. This is where freshness comes from.
3. **Web (gap-filler).** Only when both layers are thin on a beat the brief needs. Mark web finds as un-vetted live results in the pack.

## The Raindrop recipe

The trap: only about three bookmarks are tagged `mdp`, but 40-plus items are mdp-useful. Querying the `mdp` tag alone misses almost everything. Query by adjacent tags and by keyword instead.

Tools and how to use them:

- `mcp__claude_ai_Raindrop__find_tags` first, to see what tags actually exist in the library right now. The tag vocabulary drifts. Do not assume.
- `mcp__claude_ai_Raindrop__fetch_popular_keywords` to surface the live keyword landscape and catch terms the brief implies but you did not think to search.
- `mcp__claude_ai_Raindrop__find_bookmarks` is the workhorse. Run several searches, not one:
  - By teaching tags: `mdp`, `mdp-example`, `hands-on-repo`, `faculty-training`, `corporate-training`, `fdp`, `pedagogy`, `training`, `ai in teaching`.
  - By the capability tag that recurs most: `skills` (the library's largest cluster), plus `mcp`, `rag`, `agents`, `workflow`.
  - By the brief's topic keywords: the function (marketing, PM, finance, HR), the technique (prompting, RAG, browser agents, orchestration), and the named tools from the tool-suite table.
- `mcp__claude_ai_Raindrop__find_collections` if the library is organized into collections worth scanning whole.
- `mcp__claude_ai_Raindrop__fetch_bookmark_content` on a shortlisted item when you need to judge fit before placing it.

Cast wide on the first pass (adjacent tags plus topic keywords), then narrow to the items that genuinely serve a needed beat.

## De-dupe and freshness

- **De-dupe across layers.** The same repo often sits in both the wiki map and Raindrop. Keep one entry. Prefer the richer note (usually the wiki map's, which carries Shiva's framing).
- **Freshness flag.** When the wiki map's note and a live Raindrop save diverge, trust the live save for the link and status, and the map for the teaching framing. If a map item looks stale (dead link, superseded tool), say so in the pack rather than dropping it silently.
- **Recency.** Prefer recently saved items for live demos and labs, where tool churn is fastest. Pre-reads and scaffolds age more gracefully.
- **Provenance.** In the pack, it is fine to note where an item came from (wiki map, live Raindrop, web search) when it helps Shiva judge trust. Web finds always carry the un-vetted flag.

## The tagging feedback loop

When the live query surfaces a strong item that is not yet tagged for teaching, note it for the after-shipping step. Offering to tag it `mdp-example` (and, where they fit, `hands-on-repo` or `faculty-training`) at the end of the run is how the library stops losing 40-plus useful items behind a 3-item tag. This closes the mdp-tagged-vs-mdp-useful gap one run at a time.
