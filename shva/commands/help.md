---
description: "Show what /shva can do. Lists all commands in the personal pack with examples."
allowed-tools: []
model: haiku
---

# /shva:help — What's in the personal pack

> Personal command pack. The `shva` namespace = "this is mine, not work."
> If the prefix is `shva`, Shiva built it for cross-cutting personal use.

---

## Available commands

| Command | What it does | When to use |
|---|---|---|
| `/shva:brief-me [project-type]` | Returns a 20–25 term domain glossary in three buckets (Creative/Style · Technical/Process · Prompt/Direction), then 3 clarifying questions, then a "flag terms I'm using incorrectly" coda. | **Before starting any new GenAI build.** Code, design, video, music, art — domain-agnostic. The 5-minute step that prevents 5-hour drifts. |
| `/shva:shva-medium-writer <topic>` | Drafts a 1500-2000 word Medium-grade essay in Shiva's voice. Uses wiki + 6-tier MCP source hierarchy. Outputs to `src/data/blog/<slug>.md` with Astro frontmatter, FOMO question title, ≥3 tier-1 institutional co-citations, and the v1.0 bio footer. | **Before opening a PR on shivakakkar.com.** Anywhere you'd write a long-form post. |
| `/shva:shva-medium-poster <url-or-slug>` | Publishes a deployed shivakakkar.com post to Medium under "Built at Rehearsal" via Chrome automation. Trims " \| Dr. Shiva Kakkar" title suffix, deletes embedded images + empty-paragraph gaps, sets up to 5 tags, submits for editorial review (default). | **After the post is live on shivakakkar.com.** Once Vercel deploy is propagated. |
| `/shva:shva-linkedin-post-writer` | Write LinkedIn posts in Shiva's systems-thinker voice. For serious enterprise and education topics it produces attention + authorship candidates from one thesis, selects through an evidence-and-audience gate, records a prediction/outcome taste ledger, and routes visuals across four portfolio genres. | **For any LinkedIn post request.** Voicenote-to-post, news reaction, content system runs, weekly authority batches. |
| `/shva:worksheet-generator [topic]` | Turns a topic plus rough ideas into an AI-resistant, self-contained teaching worksheet (HTML first, then a ReportLab PDF) in Shiva's voice. Asks intake questions, researches in parallel across the wiki + LlamaCloud + Readwise + YouTube + book-search + Mobbin, builds a carried-forward arc with one worked example, applies the hard formatting rules, and ships clean print pages. | **When you need a hands-on workshop or session sheet.** A decision, tension, workflow, or skill traced to its end. |
| `/shva:teaching-designer [topic]` | The facilitator-side sibling. Turns a teaching brief into a light, discussion-led executive keynote: a session plan, a spoken script, and an aesthetic interactive HTML doc (lesson plan plus click-to-expand script). Same parallel research, contrarian story-driven voice, evidence cards with citations, and before/after Mermaid diagrams. | **When you need what you teach FROM, not what participants fill in.** Session plans, teaching scripts, course outlines, executive keynotes (XLRI/MDP). |
| `/shva:genai-use-case-finder [function-or-process]` | Fills a prioritized GenAI use-case portfolio for a REAL org. Runs the four-move method: MAP both lenses (point vs system), GATE every candidate on the five-question tell, SCORE on value by feasibility with risk as a veto and verifiability as the autonomy axis, SEQUENCE into named quadrants. Outputs the filled matrix plus a signed one-page worksheet, with an optional HTML 2x2. | **When a CXO asks "where do we actually use GenAI, and which first?"** An analysis for a real org, not a lesson. If you want to TEACH the method, use teaching-designer instead. |
| `/shva:mdp-source-finder [topic]` | Assembles a source pack for an MDP, FDP, or workshop, indexed by session beat (hands-on lab, opening hook, case, live demo, pre-read, scaffold to borrow). Queries Raindrop and the wiki LIVE, re-indexes for this brief, and names the 4 to 6 skills to anchor the course. | **When you sit down to design a session and need credible repos, tools, and demos.** Feeds teaching-designer. |
| `/shva:persona-profile-from-text [whose-text]` | Builds an evidence-anchored profile of a person from their own text, every line quoting the source. Two modes: mirror (reflect a Rehearsal user's recordings back, for engagement) and voice-harvest (read a target leader's voice and concerns, for outreach). Frameworks are a reasoning lens, never printed as scores. Surprises are offered as questions, never verdicts. | **When you want to understand who someone is from what they wrote.** Rehearsal mirror, or B2B voice-harvest. |
| `/shva:meditate [artifact\|session\|taste] [subject]` | Runs Shiva's reflection and judgment ritual. Uses the five R's plus the five-question Aliveness Review, tests the emerging rule against counterexamples, and ends with a named insight, next experiment, and explicit record/no-record verdict. It never promotes private material or writes to the wiki automatically. | **After meaningful work, when an artifact feels lifeless, or when you want to understand a recurring preference without flattening different surfaces.** |
| `/shva:hidden-agendas-spotter [claim-or-artifact]` | **Hidden Agendas Spotter.** Reads the reality beneath a claim, image, partnership, metric, ritual, or behaviour. Reconstructs the apparatus, maps what actors certify for each other, finds the real audience and payoff, compares visible proof with costly reality, tests alternatives, and labels confidence before optional satirical compression. | **Before accepting the official explanation or writing a truth-bomb cartoon.** Especially useful when two parties appear to validate each other. |
| `/shva:help` | This screen. | When you forget what's installed. |

> **Two teaching siblings:** `worksheet-generator` makes the **participant** artifact (a fillable worksheet); `teaching-designer` makes the **facilitator** artifact (plan, script, interactive lesson). Use both for one session.
>
> **Three workflow skills (v0.8.0), each promoted from a matured wiki method:** `genai-use-case-finder` fills a GenAI use-case portfolio for a real org (analysis, not a lesson); `mdp-source-finder` gathers the live source pack for a session and feeds `teaching-designer`; `persona-profile-from-text` mirrors a person from their own writing (Rehearsal engagement, or B2B voice-harvest).

---

## Quick examples

```
/shva:brief-me 2D browser game in Phaser
/shva:brief-me AI music track in Suno — lo-fi hip-hop
/shva:brief-me Midjourney editorial photography series
/shva:brief-me                                          # asks you what you're building

/shva:worksheet-generator GenAI change management for HR leaders
/shva:worksheet-generator                              # asks you what you want to teach

/shva:teaching-designer the AI expertise paradox for senior managers
/shva:teaching-designer                                # asks you what you're teaching

/shva:genai-use-case-finder claims at a mid-size insurer
/shva:genai-use-case-finder the CHRO hiring funnel
/shva:genai-use-case-finder                            # asks you the function or process

/shva:mdp-source-finder AI workflows with open-source tools
/shva:mdp-source-finder                                # asks you the course topic

/shva:persona-profile-from-text reflect my last month of voice notes back to me
/shva:persona-profile-from-text profile this leader from their LinkedIn posts
/shva:persona-profile-from-text                        # asks you whose text and which mode

/shva:meditate artifact outputs/taste-meditation.html
/shva:meditate session today's Rehearsal design work
/shva:meditate taste what connects my books, interfaces, and writing?
/shva:meditate                                         # asks for mode and subject

/shva:hidden-agendas-spotter TCS and Anthropic provide Claude to 50,000 employees
/shva:hidden-agendas-spotter this photograph of a leader meditating alone
/shva:hidden-agendas-spotter                           # asks for the claim or artifact

/shva:shva-medium-writer AI expertise paradox
/shva:shva-medium-writer Why India's AI talent builds for Americans
/shva:shva-medium-writer                                      # asks you for a topic

/shva:shva-medium-poster https://www.shivakakkar.com/posts/india-ai-readiness-tier-2-problem/
/shva:shva-medium-poster india-ai-readiness-tier-2-problem
/shva:shva-medium-poster                                       # asks you for a URL or slug
```

---

## Typical Medium workflow

```
1. /shva:shva-medium-writer "AI in Indian B-schools"
   → drafts src/data/blog/why-ai-in-iim-courses-fails.md
2. Review the draft; edit if needed
3. gh pr create  (PR flow — auto-mode blocks pushes to main)
4. User merges via GitHub UI
5. Wait ~60s for Vercel deploy to propagate
6. /shva:shva-medium-poster why-ai-in-iim-courses-fails
   → Medium draft submitted to Built at Rehearsal, pending review
```

---

## Philosophy

> "In the GenAI era, syntax is cheap. Vocabulary is the bottleneck."

Every command in `shva` exists to sharpen the **input** to AI tools, not
the output. They're prompt scaffolds, not generators. The bet is that a
5-minute briefing in front saves hours of back-and-forth later.

---

*Plugin source: `~/Python Projects/shva-marketplace/shva/`*
*Issues / changes: edit the markdown directly, then `/plugin uninstall shva@shva && /plugin install shva@shva` to reload.*
