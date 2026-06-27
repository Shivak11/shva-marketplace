# 02 - Research protocol (parallel, exhaustive, honest)

The talk is only as good as the frame and the evidence underneath it. Ground it in Shiva's own corpus first, then the open web for current, citable evidence. Fire sources concurrently in one batch (multiple tool calls in a single turn). Serial research is the "half research" failure. If MCP tools are deferred, load them all in one ToolSearch select call first.

## Shiva's corpus (use every source the topic touches)

- `mcp__claude_ai_Shiva_s_Brain__search_notes`, then read the top maps and concept notes in full from `~/Python Projects/Obsidian Wiki/`. This is the source of truth and his own phrasing. For AI-and-org topics, check `concepts/work-charts-for-agentic-organizations.md`, `synthesis/research-genai-skills-from-wiki.md`, `concepts/ai-native-managerial-skills.md`, and the `projects/xlri-genai-hr/` folder.
- `mcp__llamacloud__query_*`: AI-Change-and-leadership, AI-Strategy-Studies, Persuasion_and_communication_OB. The richest source of his teaching frames and exact phrasing.
- `mcp__readwise-cloudflare__*` (or `mcp__claude_ai_Readwise-Cloudflare__*`): verbatim lines, counterintuitive findings, examples. It rate-limits and throttles (worker-side throttle messages). Retry once, then proceed without it rather than blocking the run; mine it later for verbatim quotes once it clears.
- `mcp__claude_ai_Youtube__*`: find a real clip and pull a transcript when the topic ties to a talk. Verify length and that the segment actually makes the point before recommending it.
- `mcp__shivas-book-search__*`: confirm a frame is in a book Shiva owns before leaning on it.

## Open-web evidence via parallel research subagents

For current statistics, named studies, and quotable lines, dispatch parallel general-purpose research subagents (the Agent tool), one per evidence stream, in a single message. Brief each one to return:

1. The primary source: exact title, author or institution, year, URL. Confirm the real statistic and what it measures.
2. Three to five short verbatim quotable lines with attribution, so you can put them on a slide.
3. One or two corroborating sources (a larger or more conventional study).
4. The caveats and critiques, so you do not overclaim in front of a sharp audience.

This is how the XLRI session sourced the MIT "GenAI Divide" 95% figure, the BCG 10-20-70 rule, the Jesuthasan and Boudreau redesign framework, and the Microsoft Work Chart plus Jensen Huang lines. Tell each subagent: verify quotes verbatim or label them as paraphrase, and do not fabricate a source to satisfy a term.

## Synthesis discipline

1. State the core idea in Shiva's own phrasing before building anything.
2. Label every claim by provenance: verbatim, paraphrase, or synthesis. Never present a paraphrase as a quote.
3. Find the authoritative primary source, not a blog about it.
4. Carry a mandatory caveat for any strong statistic (small sample, vendor interest, definitional scope). The honest, defensible version of a claim beats the loud version. Hold the caveat in the facilitation notes, not on the headline slide.
5. Write a short research brief for yourself: the core idea in his phrasing, the 3 acts, the worked example, the evidence with citations and caveats, and 2 or 3 candidate clips.

## Provenance for the artifact

Participant-facing surfaces show no names. The facilitator doc may carry citations inside dedicated framework and evidence cards and a sources block at the end. The spoken script keeps names as light verbal garnish only. See `04-writing-rules.md`.
