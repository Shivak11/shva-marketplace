# Stage 2 — Research Protocol (parallel, exhaustive)

The worksheet is only as good as the frame underneath it. Ground every claim in **Shiva's own corpus**,
not generic web content. Then strip every author and book name out of the participant-facing sheet.

## Rule 0 — run sources in parallel, never serially

Fire the content sources together in **one batch of tool calls** (multiple tool_use blocks in a single
turn). Waiting for one before starting the next is the "half research" failure Shiva called out. The
design source (Mobbin) can go in the same batch.

If some MCP tools are deferred, load them all in ONE `ToolSearch` `select:` call first, then batch the
queries.

## The sources (use every one that the topic touches)

### 1. Course knowledge bases — `mcp__llamacloud__query_*`
The richest source for Shiva's teaching frames and their exact phrasing.
- `mcp__llamacloud__query_AI-Change-and-leadership("<topic> + org change + power/hierarchy")`
- `mcp__llamacloud__query_AI-Strategy-Studies("<topic> + prediction vs judgment + point vs system + constraints")`
- `mcp__llamacloud__query_Persuasion_and_communication_OB("<topic> + persuasion / OB framing")`
Pull the frame and the verbatim phrasing. Note: results may name authors/books — keep those in your
notes only, never on the sheet.

### 2. The Obsidian wiki — `mcp__claude_ai_Shiva_s_Brain__search_notes`
Shiva's own synthesized methods, in his voice. Prefer these over any external framework.
- `search_notes("<topic> method 2x2 constraint power")`
- Then **read the top map(s) in full** from `~/Python Projects/Obsidian Wiki/` (e.g.
  `maps/two-lens-genai-use-case-method.md`, `concepts/work-charts-for-agentic-organizations.md`,
  `maps/session-worksheet-design-method.md`). The wiki is the source of truth; read files directly.

### 3. Readwise highlights — `mcp__readwise-cloudflare__readwise_search_highlights`
Verbatim lines, counterintuitive findings, concrete examples Shiva has saved.
- `readwise_search_highlights({textQuery: "<topic core terms>", limit: 15})`
- **Flaky (502s happen).** If it fails, retry once, then proceed without it. Do not block the run.

### 4. YouTube transcripts — `mcp__claude_ai_Youtube__*`
Use when Shiva names a talk/video, or when the topic has a canonical talk.
- `search_youtube` / `get_youtube_transcript` to pull a quote, a story, or a counterexample.

### 5. Book search — `mcp__shivas-book-search__*`
Confirm a frame is in a book Shiva actually owns before leaning on it (defensibility).
- `search_book` / `search_store` for the specific claim.

### 6. Design taste — `mcp__mobbin__search_screens`
For layout, helper-text, and fill-in-prompt patterns. See `04-design-taste.md` for the standing
reference patterns; only re-search Mobbin if the topic needs a new interaction shape.

## Synthesis gate (research is "done" only when both are true)

1. You can state the **core frame in Shiva's own phrasing** (from llamacloud / wiki), with the
   point-vs-system / prediction-vs-judgment / constraint-moves logic where relevant.
2. You have **one concrete worked example** (a real-feeling plant, role, number) to thread through
   every stage's Example line.

Write a 6–10 line research brief for yourself (frame, the 4–5 stage moves, the worked example, any
verbatim lines worth echoing in plain words). Then build the arc (`00-method.md` §arc).

## Provenance discipline

Keep a private list of where each frame came from (for Shiva, and for an optional wiki capture). The
participant sheet shows **none** of it. No "Goldratt", no "Power and Prediction", no citations.
