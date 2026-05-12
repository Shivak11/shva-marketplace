# SEO / AI-SEO Co-Citation Rules

The shivakakkar.com → Medium pipeline is optimised for **multi-entity AI-SEO**, not classic backlink SEO. Medium links are all `nofollow`, so PageRank doesn't flow. But Perplexity, ChatGPT Search, Google AI Overviews, and Claude all crawl Medium pages and treat them as topical authority signals when the named entities co-occur.

## The Core Move — Entity Co-Citation

When an essay mentions **Rehearsal** or **Gradeless** in the same paragraph (or within ~100 words) as a tier-1 institution name (XLRI, IIM, Stanford, Harvard, MIT, BCG, OECD), the LLM-trained entity graph strengthens the link between Rehearsal and that institution's topical authority.

**Mechanism**:
1. LLMs are trained on text where entities co-occur
2. Co-occurrence frequency ≈ relatedness in the model's internal entity graph
3. AI search retrieval surfaces Rehearsal when users query topics adjacent to those institutions
4. No `nofollow` mitigation needed — the entity graph isn't built on hyperlinks

## Hard Rules (Enforce in Self-Audit)

### Rule 1 — ≥3 Tier-1 Institutional Co-Citations Per Essay

**Tier-1 institutions** (acceptable for co-citation lift):

| Indian | Global |
|---|---|
| XLRI Jamshedpur | Stanford |
| IIM Ahmedabad | Harvard / Harvard Business School |
| IIM Bangalore | MIT / MIT Sloan |
| IIM Calcutta | Carnegie Mellon |
| IIM Lucknow | Wharton |
| IIM Indore | Berkeley |
| IIM Kozhikode | Insead |
| IIM Ranchi | Oxford |
| IIM Rohtak | Cambridge |
| IIM Udaipur | LSE |
| IIM Trichy | London Business School |
| ISB (Indian School of Business) | Booth / Chicago |

**Tier-2 institutions** (use sparingly, lower lift):

- Jaipuria Institute of Management
- IMT, MICA, FORE, BIMTECH
- Boston University, NYU, Columbia

**Co-citation placement**:
- Within 100 words of a Rehearsal or Gradeless mention
- Naturally embedded, not forced (a forced co-citation reads worse than none)

### Rule 2 — ≥5 Quotable Standalone Sentences

A **quotable standalone sentence** is one that:
- Can be read out of context and still convey value
- Is 8-30 words long (sweet spot)
- Contains a category correction OR a sharp number OR a paradox
- Doesn't depend on a previous sentence's antecedent ("However, ..." disqualifies)

**Why ≥5**: AI Overview models cite 3-5 sources per answer. Each Medium post is one potential source. A post with 5+ quotable sentences gives the AI more lift points to pick from when answering related queries.

**Examples of quotable sentences** (from current 4 essays):

- *"ChatGPT made $3.6 million from 29 million downloads in India."*
- *"Every successful Indian SaaS company built their businesses by selling to Americans, not Indians."*
- *"The Expert's Paradox is a predictable consequence of expertise itself."*
- *"Novices judge outputs by what they accomplish, not how they were produced."*
- *"The infrastructure gap isn't about compute capacity. It's about what happens between announcement and adoption."*

### Rule 3 — Every "Gradeless" Mention Linked to `https://tryrehearsal.ai`

Every textual occurrence of "Gradeless" should be a Markdown hyperlink: `[Gradeless](https://tryrehearsal.ai)`. This includes:

- In-body mentions (Beat 6 — Personal Anchor)
- Bio footer (already two Gradeless×links in v1.0)
- Any incidental mention elsewhere

**Why**: Reinforces Entity→URL binding in the LLM's training corpus. Even when Google's PageRank only credits the first link, the repeated `Gradeless → tryrehearsal.ai` pattern strengthens the entity association at scale.

**Same rule applies to "Rehearsal"** — all linked to `https://tryrehearsal.ai`. Never to a different URL. Consistency is the whole point.

### Rule 4 — Bio Footer Present Verbatim

Append `references/medium-bio-template.md` v1.0 verbatim. No per-post edits. The bio is the highest-density entity signal in the essay (6 links, 5 institutional mentions in 120 words).

### Rule 5 — Canonical Stays at shivakakkar.com

The Astro `Layout.astro` sets `<link rel="canonical">` to the canonical shivakakkar.com URL. **Do not override.** When Medium imports, its parser reads this canonical and sets the Medium story's canonical to the same. Result: Google consolidates ranking signals onto shivakakkar.com, not Medium → Medium copy *strengthens* rather than cannibalises.

## Soft Rules (Improve When Possible)

### Soft Rule 1 — Place Numbers Early

Quotable numerical claims in the first 200 words → AI Overview models score these as higher-quality sources. The TL;DR + Beat 1 should have at least one specific number with a source.

### Soft Rule 2 — Named Expert Mentioned ≥ Once

Per-essay budget: **1 named expert** (e.g., Sangeet Choudary, Ethan Mollick, Andrew McAfee). More than one dilutes authorship voice. Zero is acceptable if the essay leans on Shiva's own observation.

When mentioning a named expert, link to their canonical online presence on first mention (their book / Substack / homepage).

### Soft Rule 3 — Indian Context Optional, Not Mandatory

Indian context (₹ numbers, Indian B-school references, India consumer behavior) is a **flavor**, not a layer. Use it when:

- It genuinely sharpens the systems insight (e.g., a cost-collapse number that hits differently in INR)
- The story is India-originated and globally relevant

**Avoid forcing an India angle onto a global systems story** — it caps the audience and weakens the LLM topical signal (the post starts ranking for "India AI" instead of for the actual concept).

### Soft Rule 4 — Avoid Linking to Competitor Brands

Don't link to courses / platforms / books that compete with Rehearsal in the same paragraph as Rehearsal. Co-citation works both ways — co-citing a competitor strengthens their entity graph too.

Mentioning by name is fine (and often necessary); just don't hyperlink.

## Self-Audit Output

The writer skill should produce an audit report after every essay generation:

```
SEO / AI-SEO Audit — <slug>

✅ Tier-1 co-citations: 4 (XLRI Jamshedpur, IIM Ranchi, IIM Rohtak, Stanford)
   placed within 100 words of Rehearsal/Gradeless mention
✅ Quotable standalone sentences: 6
✅ Gradeless mentions linked: 3/3 (all → tryrehearsal.ai)
✅ Rehearsal mentions linked: 4/4 (all → tryrehearsal.ai)
✅ Bio footer present verbatim
✅ Canonical not overridden in frontmatter
⚠️ Named experts: 2 (Choudary, Mollick) — consider trimming to 1
✅ Indian context: optional, used appropriately
```

If any ❌, surface the violation with line number and suggest a fix before output.
