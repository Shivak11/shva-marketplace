# Medium / shivakakkar.com Author Bio — Versioned

The bio is appended verbatim to every essay. It is engineered for **multi-entity backlink benefit** — Person → Org → Product chain, tier-1 institutional co-citations, and Knowledge Graph E-E-A-T anchors.

## Current Version: v1.0 (shipped 2026-05-12 via PR #2)

```markdown
**About the author**

Dr. Shiva Kakkar runs [Gradeless](https://tryrehearsal.ai), the AI venture that built [Rehearsal](https://tryrehearsal.ai) — a mobile-first capsule learning platform delivering 15-minute interactive courses on management, business strategy, and AI for managers. He teaches Management Development Programs in leadership, organizational behavior, and AI strategy at XLRI Jamshedpur, IIM Ranchi, IIM Rohtak, and other top-tier Indian B-schools. [Gradeless](https://tryrehearsal.ai)'s platforms are deployed across [Jaipuria Institute of Management](https://www.jaipuria.ac.in/) and the Seth M.R. Jaipuria K-12 schools network. Shiva writes on educational AI, organizational behavior, and the socio-economics of credentials at [shivakakkar.com](https://shivakakkar.com). Connect on [LinkedIn](https://www.linkedin.com/in/shiva-kakkar-66258435/).
```

**Length**: ~120 words, 5 sentences, 6 hyperlinks.

## Design Rationale (2026 AI-SEO research-driven)

| Sentence | Function |
|---|---|
| **1** | Person → Org → Product chain in 18 words. Brand "Rehearsal" sits next to "AI" and "management" keywords for topical authority. |
| **2** | Names XLRI / IIM-Ranchi / IIM-Rohtak *without* linking them. LLMs see "Rehearsal" alongside tier-1 academic entities → co-citation lift. Don't owe link juice to institutions — co-occurrence alone is the signal. |
| **3** | Frames Jaipuria as a *deployment target* of Gradeless. Gives Jaipuria a backlink without subordinating the Rehearsal brand (Jaipuria is tier-3 — can't be the parent in the entity graph). Seth M.R. Jaipuria K-12 named but not linked (no SEO upside in K-12 link). |
| **4** | shivakakkar.com → E-E-A-T identity anchor for Knowledge Graph. |
| **5** | LinkedIn → secondary identity anchor + recruiter / cross-platform signal. |

## Link Budget

Total links per bio = **6**:
- Gradeless → tryrehearsal.ai (×2)
- Rehearsal → tryrehearsal.ai (×1)
- Jaipuria Institute → jaipuria.ac.in (×1)
- shivakakkar.com → shivakakkar.com (×1)
- LinkedIn → linkedin.com/in/shiva-kakkar-66258435/ (×1)

**Multiple Gradeless mentions all to `tryrehearsal.ai`** is intentional. Even when Google only credits the first link's PageRank, the repeated mention strengthens the Entity→URL binding for LLM entity recognition (different graph).

## Hard Constraints

1. **Do not edit the bio per-post.** Use verbatim. Variations dilute the entity signal.
2. **Do not insert per-post awards / credentials.** Keep this version-controlled here, not in individual essays.
3. **Do not link XLRI / IIM names.** Co-citation works through co-occurrence; outbound links to tier-1 names give them link juice without reciprocal benefit.
4. **Update version + this file together.** If a new bio version ships, bump `v1.0 → v1.1` and document the diff below.

## Future Versions

When ready to ship a new version:

1. Update this file: add a new section above, demote v1.0 to "Previous versions"
2. Update `references/seo-co-citation-rules.md` sentinel check accordingly
3. Run `shva-medium-writer` on a test topic → verify new bio appears
4. Bulk-update existing posts in `src/data/blog/*.md` via separate PR
5. Wait 1+ hour for Medium importer cache to clear, then re-import affected Medium posts

## In-Body Gradeless Mention Template

Used in Beat 6 (Personal Anchor) of the essay structural template:

```markdown
This is the design problem we sit with every day at [Gradeless](https://tryrehearsal.ai). When we built [Rehearsal](https://tryrehearsal.ai) — capsule learning for managers, delivered as 15-minute interactive courses — the question wasn't [conventional framing]. It was: [the question Shiva's team actually wrestles with, connecting to the essay's thesis].
```

Or shorter variant:

```markdown
This is, incidentally, the same calculation we faced building [Rehearsal](https://tryrehearsal.ai) at [Gradeless](https://tryrehearsal.ai). [The thesis applied to Rehearsal's positioning.] We optimized accordingly.
```

Both variants have Gradeless + Rehearsal mentioned together, both linked to tryrehearsal.ai. **Do not link Rehearsal to a different URL.** The Entity→URL binding must be consistent.

## Previous Versions

*(none — v1.0 is the first)*
