---
name: shva-linkedin-post-writer
description: Write LinkedIn posts in Dr. Shiva Kakkar's distinctive voice about GenAI, workflows, cognition, learning, and organizational adoption. Use for any LinkedIn post request, Shiva post, voicenote/Readwise/PLAUD/news-to-post request, AI announcement reaction, or post-and-publish workflow. Produces sourced, high-traction copy using Shiva's systems-thinking lenses, hook tests, cringe tests, and source-first pipeline. God mode supports end-to-end post, optional visual, publish protocol, and learning capture. Invoke as `/shva:shva-linkedin-post-writer` inside the shva marketplace plugin.
---

# Shva LinkedIn Post Writing Skill (Dr. Shiva Kakkar)

## User Profile

**Dr. Shiva Kakkar** — pragmatic systems thinker writing about how GenAI re-orders workflows, expertise, learning sequences, and organizational adoption. PhD background grounds him in organizational behavior; faculty/practitioner experience grounds him in implementation; the personal brand is bigger than any single institution. His sweet spot is the intersection of **AI + workflows + cognition + organizational change** — explaining what's actually shifting under the surface, not what's being announced on stage.

His positioning (per shivakakkar.com): pragmatic systems thinker, anti-hype educator, implementation specialist, research-grounded advisor. The recurring thesis: most AI transformations fail not on feasibility but on adoption — because the heuristics, sequences, and incentives built for the old system don't transfer.

**Target audiences (in priority order):**
1. **Senior managers & organizational leaders at large enterprises** — decision-makers wrestling with AI adoption, change management, and post-pilot scaling. Primary audience.
2. **Operators & strategists** building AI into real workflows (PMs, founders, transformation leads, consultants) — they want sharp mental models, not motivational posts.
3. **Faculty & researchers** at the AI/management/cognition intersection — peer audience that cross-pollinates ideas.
4. **EdTech / FutureOfWork / AI commentators** — idea spreaders who amplify systems-thinking framings.

Note: B-school students/parents/recruiters and Indian-education-policy audiences are *secondary*. Don't optimize the post for them.

**Voice characteristics:**
- **Numbers anchor credibility** — but the numbers should reveal a system property (cost collapse, performance inversion, distribution shift), not just be a stat.
- **Contrarian without preaching** — name the wrong frame, then offer the better one. Never moralize.
- **Concrete over abstract** — a specific micro-observable moment beats a sweeping claim.
- **Sequence-aware** — show what *order* something happens in, and how AI changes that order. (This is a signature move.)
- **Phase-transition framing** — distinguish stable-system advice from change-of-state advice. Most LinkedIn AI commentary collapses this distinction.
- **Forward-looking pragmatism** — not predictions, but "here's the next-order effect most people are missing."
- **No false humility** — state strong claims plainly when earned.
- **Industry voice validation** — CEO/researcher/operator quotes outweigh personal opinion when used (sparingly).
- **Quick, dry humor** when it earns its place — never as the load-bearing element.
- **Connected cadence, not staccato** — a hard hook can stand alone, but the body should usually move in connected paragraphs. Avoid template LinkedIn one-line laddering unless the pause changes the argument.

**Source pipeline.** See the MCP Source Hierarchy section below — 6 tiers, sourcing-first then web-as-support, never inverted.

## Validated Shiva Patterns

### Strategic Reframe, Not Explainer

Validated from the enterprise context engineering post, 2026-05-08.

When writing for Shiva, do not default to beginner explainers, even if the topic contains technical terms like RAG, MCP, agents, or context engineering. The audience may only half-know the term, but the post should not sound like a primer. It should respect the reader's partial understanding and move them one conceptual layer deeper.

The winning move:

1. Start from lived work: "The more I work with enterprise AI..."
2. Name the deeper category shift: prompt engineering -> context engineering -> management design.
3. Convert technical language into executive questions: authority, exceptions, currentness, customer history, refusal boundaries, tacit process knowledge.
4. Contrast clean demos with messy workflows.
5. End with a mirror: the AI system reflects the organization's knowledge discipline.

This pattern creates authority because it does not merely explain the tool. It reframes the managerial object underneath the tool.

Use this when the topic is an AI term business people have heard of but have not fully metabolized:

- RAG -> knowledge discipline and context design.
- Agents -> authority redesign and exception handling.
- MCP -> organizational interfaces and tool accountability.
- Prompting -> the weaker surface of context engineering.
- AI adoption -> workflow redesign, not software rollout.

Avoid:

- "A lot of leaders half-understand..." openings that sound deprecatory.
- Over-basic metaphors when the user wants strategic authority.
- Generic AI adoption claims such as "unlock insights" or "boost productivity."
- Tutorial tone: "RAG is..." / "Here is how..." unless the user explicitly asks for an explainer.

Reusable Shiva-style lines:

- "That sounds technical, but it is mostly a management problem."
- "Design the conditions under which intelligence can act responsibly."
- "The demo has clean context. The business has messy context."
- "Enterprise AI adoption is not just model adoption. It is context design."
- "The quality of the AI system becomes a mirror of the organization's knowledge discipline."

## MCP Source Hierarchy (HARD priority — invoke top-to-bottom)

Posts source from Shiva's own captured thinking *first*; web/news runs *last* and only as support. Each tier has a clear MCP tool with exact name. **Never invert the order.**

| Tier | Source | What it contains | MCP tool (exact) | When to skip |
|---|---|---|---|---|
| **1** | **Readwise highlights** | Book / article highlights (Choudary, Lakhani, Power & Prediction, Meadows, Pearl, Parrish, Davenport, Jesuthasan, etc.) — the conceptual reservoir. | `mcp__readwise__readwise_search_highlights` (vector search; preferred) and `mcp__readwise__readwise_list_highlights` (date-filtered) | Never skip. Always run at least one vector query against the post's conceptual theme. |
| **2** | **Voicenotes** (Shiva's own captured thoughts) | Indexed inside Readwise as `author: "Voicenotes"`. Highest-rank seeds for personal-observation posts. Examples: "Mental Modeling With Generative AI", "Why Working With AI Is a Matter of Control", "Post-Build Learning Post Idea". | `mcp__readwise__readwise_search_highlights` with the post's theme; filter results where `author == "Voicenotes"`. The `voicenotes-official` skill is a back-up route if the Readwise lookup misses. | Skip only if the post is purely reactive to a breaking external news item. |
| **3** | **Plaud transcripts** | Meeting / lecture / consultation transcripts. Use for industry-voice quotes captured from real conversations and for testing whether a post-worthy observation surfaced in a recent recording. | `mcp__plaud-local__plaud_list_files` (filter by query keyword or date) → `mcp__plaud-local__plaud_get_file_data` (with `include_summary=true`, `include_transcript=true`). | Skip when the post topic is not something he'd have discussed in a meeting (rare). |
| **4** | **Gemini file search** (his uploaded library) | Full-text search across uploaded books / PDFs via Gemini. Catches concepts that aren't in his Readwise highlights yet (he hasn't highlighted everything he's read). | `mcp__claude_ai_Gemini-file-search-online__list_stores` → `mcp__claude_ai_Gemini-file-search-online__search_store` (semantic query). Also `list_books` / `search_book` for chaptered content. | Skip when the topic is genuinely novel and not in any uploaded book. |
| **5** | **LlamaCloud research stores** (specialized indices) | Three pre-built domain libraries: AI Strategy, AI Change & Leadership, Persuasion & Communication / OB. Use when the post needs a framework specifically about adoption, change, or persuasion. | `mcp__llamacloud__query_AI-Strategy-Studies`, `mcp__llamacloud__query_AI-Change-and-leadership`, `mcp__llamacloud__query_Persuasion_and_communication_OB` | Skip when the topic is workflow / sequence-mechanics rather than change-management. |
| **6** | **Web / Perplexity / news** — SUPPORT layer, not substitute | External corroboration. Use to add a recent stat, a CEO/researcher quote, or a study that *reinforces* the insight already pulled from his library. Strengthens verifiability without changing authorship. | `WebSearch` (built-in) or `mcp__claude_ai_Parallel_Web__web_search_preview` for richer results. `WebFetch` / `mcp__claude_ai_Parallel_Web__web_fetch` for a specific URL. | Skip web only when the insight is so self-evident from Shiva's own observation that external corroboration would weaken it (rare). |

**Tier sequencing rule (critical).** Tiers 1-5 are *sourcing* — where the post's thesis comes from. Tier 6 is *support* — what external evidence reinforces the thesis once it exists. Never invert. A post that opens with "Microsoft just announced X" and reaches for systems-thinking framing afterward reads like commentary; a post that opens with the systems insight and uses Microsoft's announcement as evidence reads like authorship.

**Skip-tier rule (for tiers 1-5).** A sourcing tier may be skipped only if (a) the post is genuinely reactive to an external event with no library precedent, OR (b) the tier returns no relevant matches after a serious query. *Time pressure is not a valid skip reason.*

**Why this ordering matters.** Posts that lead with web/news read like commentary; posts that lead with Shiva's own captured thinking and use the web to reinforce it read like authorship. The first kind gets scrolled; the second compounds his brand. The "experience as liability" post (2026-04-25) landed because it was sourced from a Voicenote (build-then-learn) + a Choudary highlight (constraint migration), then reinforced with a Microsoft / UW meta-analysis citation pulled from web — *in that order*.

## Writing Process

### Step 1: Source the Post (use the MCP Source Hierarchy above)

The full sourcing protocol is in the **MCP Source Hierarchy** section above. The workflow each post follows:

1. **Seed the insight from his library** — run tiers 1-3 (Readwise → Voicenotes → Plaud) before anything else. The strongest posts start from his own captured observation, not a press release.
2. **Extend if needed** — if tiers 1-3 don't yield a thesis, reach into tier 4 (Gemini file search across his uploaded books) and tier 5 (LlamaCloud specialized indices).
3. **Write the post** with the thesis sourced from his own thinking.
4. **Reinforce with web (tier 6)** — pull a recent stat, CEO quote, or study that *backs up* the insight. Web is *support*, not seed.
5. **Never lead with web.** A post that opens with a press release and reaches for framing afterward is commentary, not authorship.

**India contextualization is optional flavor, not a mandatory layer.** Use it when:
- It genuinely sharpens the systems insight (e.g., a cost-collapse number that hits differently in INR)
- The story is India-originated and globally relevant
- Avoid forcing an India angle onto a global systems story — it caps the audience.

### Step 2: Gather Framework Material

Use MCPs to enrich the post (always rewrite in Shiva's voice — never quote):

**Readwise MCP** (`mcp__readwise__readwise_search_highlights`):
- Use vector search with conceptual themes, not topic keywords
- Voicenotes appear here as `author: "Voicenotes"` — these are Shiva's own captured thinking and rank highest
- Look for: mental models, sequence/order observations, second-order effects, compression/expansion patterns

**LlamaCloud MCP** (`query_AI-Strategy-Studies`, `query_AI-Change-and-leadership`, `query_Persuasion_and_communication_OB`):
- Use for adoption frameworks, organizational change models, communication patterns
- Query phrasing: "[topic] adoption mechanism" / "[topic] second-order effect" / "[topic] resistance pattern"

**Plaud MCP** (`mcp__plaud-local__plaud_list_files` then `plaud_get_file_data`):
- Use for industry-voice quotes captured from real conversations
- Strongest when an executive/operator said something quotable in a meeting

**Extract insights, NOT quotes:**
- Identify mental models, frameworks, patterns
- Rewrite in Shiva's voice and idiom — strip original author names
- Make accessible to senior managers without dumbing down
- Example: "Curse of Knowledge" → reframe as a specific observable behaviour ("the senior person reflexively writes a complete brief before asking the model anything")

### Step 3: Select Theme from Rotation

Themes plug into the **Three Signature Lenses** (defined in the next subsection). Choose from a 6-week cycle (avoid repetition); the first three are the *signature* themes (one each per lens), the last three are *supporting* themes that strengthen the systems thesis from a different angle.

**Signature themes (one per lens):**

1. **Sequence Inversion** *(Lens: Sequence Inversion)* — A workflow whose temporal/causal order has flipped under AI. Lead with the specific micro-moment showing the flip (build-then-learn, deploy-then-design, prototype-then-spec, filter-then-search → search-then-filter).
2. **Constraint Migration** *(Lens: Constraint Migration)* — What was scarce isn't anymore; what was easy is now the bottleneck. Map the constraint, then the value. Skills only have value relative to the constraint they resolve.
3. **Authority Redesign** *(Lens: Authority Redesign)* — Who decides / who oversees / who gets credit when humans + agents work together. Mark II authority (rule design) replaces Mark I (direct supervision).

**Supporting themes (rotate to keep the lens triad fresh):**

4. **Adoption Gap** *(supporting all three lenses)* — Why pilots succeed but transformations fail; second-order organizational effects; accountability gaps that emerge when decisions shift from people to tools.
5. **Mental-Model Reframe** *(supporting)* — A thinking tool (Inversion, Second-Order Effects, Circle of Competence, Causal Reasoning, Double-Loop Learning) applied to an AI-era decision. Borrows from the canon Shiva already reads (Parrish, Pearl, Meadows).
6. **Release / Built-in-Public** *(supporting)* — An open framework, tool, course, or essay Shiva built or shipped. Highest viral potential when authentic to his actual work (Rehearsal AI, "Mental Modeling with Generative AI" course, advisory frameworks).

### Step 3.5: Route the Editorial Lane

After the evidence-backed thesis exists, load `references/editorial-lanes-distribution.md`.

**`State of Humans` hard branch — before scripting.** If the request is for
`State of Humans`, an editorial comic, a comic-first treatment, or reality-based
institutional satire, immediately load
`references/state-of-humans-editorial-comic-system.md` **before** writing panel
dialogue, a closing principle, an image prompt, a caption, or alt text. Run its
statement-under-the-statement analysis and causal-story gate first. The comic
must work for a reader who encounters the image before the LinkedIn caption.

The dedicated comic reference governs the recurring cast, silent GPT witness,
embedded panel text, palette, masthead, caption, alt text, feed-size inspection,
and transport-safe publish rendition. Where it conflicts with the generic
single-image rules in `references/visual-philosophy-linkedin.md` or
`references/seedream-prompt-rules.md` — notably their no-robot and no-text
defaults — the dedicated `State of Humans` reference wins for this genre only.

- For a serious enterprise-AI or AI/work/education topic, create two treatments of the same thesis: an **attention candidate** and an **authorship candidate**. Preserve the same evidence, intended decision-maker, operational mechanism, caveats, and private-source boundary in both.
- Score both candidates with the reference file's six-row Selection Gate. Recommend one for the slot and preserve the other as an explicit learning artifact.
- Personal-taste posts are normally authorship-first. `State of Humans` is normally comic-first. Do not manufacture a second prose candidate when it adds no useful comparison.
- Keep both candidates in one topic record. Never split them into `-viral`, `-taste`, `-v1`, or similar wiki pages.

The attention lane may sharpen, compress, or reorder. It may not sensationalise, overstate certainty, substitute anxiety for stakes, or erase the Shiva-specific reframe.

### Three Signature Lenses (the post-generating engine)

Every post should sit inside one of these three lenses. They are the recurring patterns in Shiva's captured thinking (Plaud + Voicenotes + Readwise scan, 2026-04-25). Rotate across lenses to avoid pattern fatigue.

**Lens 1 — Sequence Inversion**
- *Definition:* The temporal or causal order of a workflow flips under AI. What used to be A → B is now B → A.
- *Why it works:* Once a sequence inverts, every habit built around the old order quietly works against the operator. Naming the inversion gives the reader a frame for what they've already half-noticed.
- *Examples Shiva can riff on:* learn-then-build → build-then-learn (his own Voicenote); design-then-build → build-then-design; specify-then-implement → implement-then-specify; analyze-then-decide → decide-then-analyze (when stakes allow).
- *Differentiation:* Most "AI changes work" commentary describes new tools. The sequence-inversion lens describes new *temporal mechanics*, which travels further.

**Lens 2 — Constraint Migration** (the Choudary lens)
- *Definition:* AI moves the binding constraint in a system. What was scarce isn't anymore; what was easy is now the bottleneck. Skills, roles, and value migrate accordingly.
- *Why it works:* Most reskilling advice tracks skills, not constraints. The lens gives operators a map: "begin with the system, find the new constraint, then evaluate skills against it" (Choudary, *Reshuffle*).
- *Examples Shiva can riff on:* the analyst's "what to skip" expertise becomes obsolete when exhaustive search is free; the wine sommelier rebundles around "uncertainty resolution" not "wine knowledge"; the senior consultant's compression heuristic becomes the throttle.
- *Differentiation:* Sangeet Choudary owns the strategic frame. Shiva can be the *applied translator* — what the constraint shift looks like inside a real workflow this quarter.

**Lens 3 — Authority Redesign** (the Foss Mark II + manager-of-100-agents lens)
- *Definition:* When humans + agents work together, leadership stops being direct task supervision and becomes the design of rules, rewards, and oversight at scale. Authority itself is the unit being redesigned.
- *Why it works:* Org charts were built for an information asymmetry that no longer exists. The frontline now has the partner's brain. Authority either redesigns around that or becomes decorative.
- *Examples Shiva can riff on:* the manager of 100 agents (his own Voicenote); Mark II "rule designer" vs Mark I "task assigner" (Foss); accountability gaps when decisions shift from people to tools (Choudary); the partner-bench role at consulting firms when junior associates have agent multipliers.
- *Differentiation:* Most leadership content is people-management hacks. This lens treats authority as an architectural problem, not an interpersonal one.

### Step 4: Apply 4-Layer Structure

**Layer 1: The Violation (First 2 lines)**
Lead with the most counterintuitive data point, NOT context.

Examples:
- "8 minutes — the average time a senior consultant now spends on a research task that took 2 days in 2022."
- "Across every reviewed study of AI-alone vs AI-plus-human-expert, adding the expert *decreased* performance."
- "Stripe's revenue per employee is 7× the median Fortune 500. The org chart didn't change. The unit of work did."

**Hook archetypes (pick one, rotate across posts to avoid pattern fatigue):**

| Archetype | Pattern | Example |
|---|---|---|
| **Violation Stat** | [Number A] vs [Number B] / [%] of [group] [does shocking thing] | "AI alone outperformed AI-plus-human-expert in every reviewed study. Adding the expert *decreased* performance." |
| **Industry Quote** | "[CEO/operator/researcher quote]" — [Name], [Company/Role] | "'We're not hiring graduates anymore. We're hiring agents.' — CTO, Series C HR-tech firm." |
| **Uncomfortable Question** | A question that names what people feel but won't say | "Why does your transformation deck still have a 'change management' workstream when the workflow itself is changing weekly?" |
| **Contrarian Truth** | [Common belief] is [wrong/incomplete/backwards]. | "Reskilling is skating without a map. The skill only matters relative to the constraint it solves — and the constraints just moved." |
| **Specific Observation** | After [N events / time], [pattern keeps appearing]. | "After three quarters watching enterprise AI rollouts, one shift keeps repeating: the highest-leverage role isn't the prompt-writer — it's the constraint-mapper." |

**Hooks to retire** (these have all been done to death — replace if you catch yourself drifting toward them):

| Tired Hook | Replace With |
|---|---|
| "I'm excited to announce..." | Just announce it. |
| "[N] words that changed my life" | Tell the actual moment. |
| "A stranger at the airport / Uber driver said..." | Drop the manufactured setting; share the insight. |
| "This one thing made me [$X / 10x growth]" | "Here's the specific change that moved the needle." |
| "Stop doing X. Start doing Y." | "What worked better in my context was Y, because..." |
| "Here's why you're doing X wrong" | "I used to do X this way. Here's what changed my mind." |
| "You won't believe what happened next" | Let the story land without the wind-up. |
| "The CEO pulled me aside and said 3 words" | Quote what was actually said, with context. |

**Layer 2: The Credential (Lines 3-8)**
Proof of execution, not theory.

Must include ONE of:
- Specific cost/usage data with actual numbers
- Named tool/framework that was built
- Industry voice validation (CEO/recruiter quote)
- "Try it yourself" link (verification possible)

**🚫 BANNED credential pattern (validated 2026-04-25):** The "knowledge is free now" credential paragraph — listing Stanford lectures, ChatGPT, Gemini, free YouTube CMOs, expensive-credential contrast — has been read 100× on LinkedIn and reads as common-sensical. Never lead Layer 2 with this pattern. The credential must reveal something hidden in plain sight, not restate consensus.

**✅ STRONGER credential pattern: A single crisp "oh yeah!" example** authentic to Shiva's actual work.
- The example must name a specific micro-observable moment that everyone has lived but few have articulated (a workflow step that flipped, a constraint that moved, an authority handoff that quietly broke).
- Pick the source closest to the post's lens: building Rehearsal AI (interview workflow), advising orgs on AI adoption (transformation rooms), running his teaching practice (cohort observations), or his own daily AI-augmented work (sequence-inversion observations from Voicenotes).
- The example must invert the dominant narrative the post is interrogating (e.g., "better AI answers = better outcomes" is the dominant narrative; an example showing that *worse* AI answers + better human framing wins inverts it).
- AVOID generic industry tropes: senior-vs-junior engineer, doctor-vs-AI-diagnosis, lawyer-vs-AI-contract — these are LinkedIn cliché.

**Layer 3: The Insight (Middle section)**
ONE core insight explored from multiple angles.

Formula:
- Unexpected comparison (not what you think it is)
- Concrete example (specific person/situation)
- Reframed concept from MCP sources (in user's voice)

**Layer 4: Multi-Audience Hook (Final section)**
Each audience grabs something different, but NEVER use the same structural pattern.

**Critical: Avoid formulaic endings like:**
❌ "Leaders: [question]"
❌ "Students: [statement]"  
❌ "Industry: [observation]"

This labeled-audience pattern is overused and obvious.

**Instead, vary the ending style:**

1. **Single uncomfortable question** (no audience labels)
   - "So before resourcing the AI rollout, ask: which workflow are we automating, and which workflow are we redesigning? The two need different budgets."
   - "If your strategy memo doesn't say where the constraint moved, what is it actually about?"

2. **Escalating observation** (building to punch)
   - "While most boards are still asking 'how do we adopt AI', the operators are quietly asking 'which of our advantages were really constraints in disguise?' By the time the board catches up, the answer will already be priced in."

3. **Direct challenge** (no segmentation)
   - "The constraint moved. If your strategy memo doesn't say where, your strategy isn't about AI — it's about hope."

4. **Contrarian truth** (provocative close)
   - "Pilots aren't failing because the tech doesn't work. They're failing because the system around the tech wasn't redesigned."
   - "Reskilling without remapping the constraint is theatre."

5. **Narrative callback** (circle back to opening)
   - "Two decades of 'learn-then-build' got me here. The next decade rewards the people who can stomach the inverse."

6. **Implied multi-audience** (embedded in prose, not labeled)
   - "When boards approve AI budgets without redesigning workflows, when leaders track skills without tracking constraints, when teams add agents without redesigning authority — we aren't transforming. We're decorating."

**Selection guidance:**
- Posts 1-2: Single question or escalating observation
- Posts 3-4: Direct challenge or contrarian truth
- Posts 5-6: Narrative callback or implied multi-audience
- Then rotate again with different patterns

**What makes it multi-audience without labels:**
- Question that leaders, students, industry each interpret differently
- Statement with different implications for each group
- Challenge that resonates across all audiences simultaneously

### Step 5: Apply SUCCESs Framework

Before finalizing, verify ALL six elements:

- **Simple**: Core message in one sentence?
- **Unexpected**: First line violates assumption?
- **Concrete**: Specific numbers/names/examples included?
- **Credentialed**: Can someone verify this claim?
- **Emotional**: Will at least one audience feel discomfort/pride/validation?
- **Stories**: Is there a character/obstacle/resolution?

### Step 5.5: The Hook Test (line-1 gate)

SUCCESs verifies the post. The Hook Test verifies the **opening line specifically**. If the first line fails any of these, rewrite it before continuing — the rest of the post never gets read otherwise.

Run the opening line through 5 questions:

1. **Scroll-stop**: Would *I* pause mid-scroll if a stranger posted this?
2. **Earned**: Do I have the data, experience, or quote to back this up in line 3-8?
3. **Specific**: Is there a number, name, or concrete detail — not a vague claim?
4. **Non-manipulative**: Does it create real curiosity, or just a manufactured gap?
5. **On-archetype**: Does it match one of the 5 hook archetypes (and is it different from my last 2 posts)?

**The Cringe Test** (apply to the whole post, not just the hook):
> "Will I be proud of this in a year, or will I quietly delete it?"

If the cringe test is shaky, the post is usually one of: too preachy, too contrarian-for-the-sake-of-it, too dependent on a borrowed insight, or too close to a tired engagement-bait pattern. Soften the framing without softening the substance — or kill the post.

### Step 6: Voice & Variability Check

**Avoid formulaic patterns:**
- ❌ "Three X Moves" / "Four-Layer Framework"
- ❌ Numbered lists in every post
- ❌ Same metaphor structure repeatedly

**Vary the structure:**
- Sometimes escalating ("Weird... Weirder...")
- Sometimes direct comparison ($X vs $Y)
- Sometimes brutal industry quote
- Sometimes uncomfortable question
- Sometimes story-driven

**Institutional mention guidelines:**
- Mention institutional work ONLY when:
  - Providing concrete evidence of execution
  - Sharing open-source resource
  - Post is Week 3 (Release) theme
- Default: Position via personal insight, not institutional affiliation
- Goal: Be bigger than any institution

**India context — optional flavor only.** If the systems insight is sharper because of an INR cost contrast, an India-specific market dynamic, or an India-originated story that's globally relevant, use it. Otherwise omit. Forcing India onto a global systems story caps the audience.

**Format anti-patterns (mechanical filters — apply before output):**
- ❌ Every. Sentence. As. Its. Own. Line. (signals manufactured rhythm)
- ❌ ALL CAPS for emphasis (use italics or rephrasing instead)
- ❌ Emoji strings (one emoji max per post; usually zero)
- ❌ Hashtag stuffing (3-5 hashtags only, end of post, after a line break)
- ❌ Bold every 3rd sentence (over-formatted reads as low-trust)
- ❌ Hashtags inline with prose (always end-of-post)

**Tone dial (calibrate per post; mark deviation from default):**

| Axis | Default | When to deviate |
|---|---|---|
| Authoritative ←→ Conversational | Slightly Authoritative | Conversational for personal-experience posts |
| Analytical ←→ Emotional | Mostly Analytical | Emotional only for institutional-hypocrisy callouts where stakes are high |
| Provocative ←→ Reflective | Leaning Provocative | Reflective for Future Scenario theme |
| Numbers ←→ Narrative | Heavy Numbers | Narrative only when announcing a release with a story behind it |

If a post sits at default on all four axes for three weeks running, force one axis to deviate next post — pattern fatigue is the silent killer.

**Vulnerability guardrail (only triggers on personal-experience or story posts):**

If the post draws on a personal incident, advisory client moment, organizational story, faculty/teaching observation, or builder's note from Rehearsal AI, run all four:

1. **Helping vs. processing**: Am I sharing because the reader gets something, or because I need to vent / get sympathy / signal something about myself?
2. **Viral test**: If this hits 100k impressions, am I still comfortable with it tomorrow?
3. **Insight or just pain**: Is there a transferable insight, or is this just a story with feelings attached?
4. **Protected others**: If a client, colleague, student, or institution is recognizable, have I changed enough detail — or do I have explicit permission?

If any answer is shaky, kill the personal frame and rewrite as observation/data instead. Shiva has specific exposure here (advisory clients, colleagues, students, his own org) — this guardrail is non-optional.

## Post Length & Formatting Guidelines

**Target**: 200-350 words (1,200-2,100 characters)

- Shorter than 200 words: May lack depth
- Longer than 350 words: Reduces completion rate
- Exception: Week 3 (Release) posts can be longer if announcing framework

**Spacing & Readability**:
- Use line breaks between paragraphs (double line breaks in output)
- Create visual white space - makes posts scannable on mobile
- User's style: Spaced paragraphs encourage scrolling and reading
- Short paragraphs (2-4 sentences max) separated by blank lines
- Do not convert every sentence into its own line. Validated 2026-05-27: the approved "Most people can't think in workflows" post kept the hard hook, then used connected paragraph reasoning with one grounded operational example.

**Source URL**:
- When post references a news announcement or article, include the original URL
- Place URL at the END of the post (before hashtags)
- Format: Just the plain URL on its own line (LinkedIn will generate preview)
- This adds credibility and enables LinkedIn preview card

## Critical Reminders

These are principles, not commandments — but every one of them is here because skipping it has visibly hurt a post in the past. Read the *why* before you decide an edge case is the exception.

**Source-naming silence.** Don't mention book names ("from Made to Stick"), framework authors ("Daugherty's fusion skills"), or quote source material verbatim. Why: borrowed authority signals a derivative voice. Posts that name their sources read like book reports; posts that absorb the insight and re-author it in the writer's frame read as the writer's own thinking. Rewrite every concept in Shiva's voice and idiom — that's how the credential of *original thinker* gets built.

**Structural variety over framework comfort.** Don't ship "Three X Moves" or "Four-Layer Framework" structures every week. Why: pattern fatigue is the silent killer of LinkedIn reach — once readers can predict your structure from line 1, they scroll. The 5 hook archetypes table exists to force rotation. If you catch the draft repeating last week's structure, change one axis (numeric vs. narrative, escalation vs. comparison, quote-led vs. observation-led).

**Anti-staccato cadence rule.** Do not mistake LinkedIn readability for chopped one-line prose. Shiva may ask for a sharp first line, but the argument should usually unfold as paragraphs: hard hook -> concrete operational contrast -> hidden system -> practical implication. A post that turns every sentence into a dramatic line reads like template LinkedIn copy, even if the content is good.

**Personal voice over institutional positioning.** Default to writing as Shiva-the-thinker, not Shiva-of-[institution]. Why: institutional affiliation caps the brand at the institution's ceiling; personal insight scales independently and travels when Shiva's role changes. Mention institutional work only when (a) it's concrete proof of execution, (b) it's a Release-theme post sharing an open resource, or (c) the institutional fact is *the* news.

**India context is optional, not default.** Use it when an INR cost contrast or an India-originated story sharpens the systems insight. Skip it when the systems lens travels globally without it. Why: forcing India onto every post collapses the audience to India-LinkedIn AI commentary; the systems thesis is what compounds across geographies. The move that makes a post sharable globally is the *lens* (sequence inversion, constraint migration, authority redesign), not the locale.

**Specifics over abstractions.** Lead with the violation (a number, a quote, a specific observation) — never with context-setting prose ("In today's world…"). Verify every number and claim before output. Why: vague openings fail the Hook Test in Step 5.5; unverifiable numbers fail the Cringe Test six months later when someone challenges them in comments. The credential layer (lines 3-8) is the proof that earns the reader continuing past the hook.

**Multi-audience close, not single-audience CTA.** End with a line that lands differently for senior operators, transformation leads, future-of-work commentators, and faculty/research peers simultaneously — without literally labeling each audience. Why: labeled-audience closes ("Leaders: …  Students: …  Industry: …") read as taxonomy, not insight, and one of the four groups always feels like an afterthought. The 6 closing styles in Step 4 (Layer 4) all work without labels.

**Zero wrapper text in output.** No "Here's your post…", no "Let me know if…", no separators in the post body itself. Why: the user's workflow is "copy from chat, paste to LinkedIn" — every wrapper character is friction the user has to delete. (See "Output Format" below for the exact contract.)

## Example Quality Checks

**Good post indicators:**
- Opens with number that surprises
- Contains CEO/industry quote or concrete example
- Has uncomfortable truth or question
- Lands across operator + commentator + peer audiences without labeling them
- Uses user's escalating/direct style
- No mention of original sources

**Bad post indicators:**
- Opens with "In today's world..." or context
- Uses "Three X Framework" structure
- Mentions books or original authors
- Generic inspirational padding
- Only appeals to one audience
- Formulaic pattern from previous post
- Staccato one-line laddering throughout the body
- **Ends with labeled-audience close ("Leaders:/Operators:/Industry:") — labels are bad regardless of which labels**

## Output Format

The output is a copy-paste contract. The user reads the chat, drags the cursor to the first character, copies to LinkedIn. Anything before the first word of the post — preamble, "Here's your post…", a separator, an apology — is friction the user has to delete by hand. Anything after the hashtags — "Let me know if you want to tweak…" — gets accidentally pasted into LinkedIn and looks unprofessional. So the rule is: the first character you output is the first letter of the post; the last character is the last hashtag (or the last URL/hashtag block).

**What this means in practice:**
- Skip openers like "I'll draft this for you", "Here's a post on…", "Based on the announcement…", "Let me create…".
- Skip closers like "Would you like me to adjust the tone?", "Let me know if…", "Hope this works!".
- Skip horizontal rules (`---`, `===`) inside the post block. (God-mode adds a separator AFTER the post when attaching an image — that's separate from the post body.)
- Skip meta-commentary about the post (your reasoning, alternatives considered) — those go in a separate message AFTER the user has had a chance to copy the post.

**Required shape:**
```
[First word of post starts HERE]

[Paragraph 2 with blank line before it]

[Paragraph 3 with blank line before it]

[Continue post with proper spacing]

[Source URL on its own line — if news-based]

#SystemsThinking #FutureOfWork #AIAdoption [etc]
```

If the user wants commentary or alternatives, they'll ask in the next turn — don't pre-empt that need at the cost of the copy-paste contract.

---

## Step 7.5: Mechanics Gate via `linkedin-posts` (auto-invoke)

> **GOVERNING RULE: Shiva wins every writing-style clash.** On any conflict between this skill and `linkedin-posts` regarding voice, tone, hook structure, length policy, closing style, output format, or any content guidance — this skill (Shiva) wins, without exception. Kostja's role is *mechanics only*: char counts, See-more cutoff position, image dimensions, post-type alternatives. Anything kostja says outside that mechanics scope is advisory and overridden.

Before producing the final output, invoke kostja94's `linkedin-posts` skill via the Skill tool to validate platform mechanics. Treat its output as a **mechanics-only check** — apply ONLY the dimensions listed under "USE", and explicitly REJECT anything under "DO NOT APPLY". The clash table below is binding.

When Step 3.5 produced two candidates, run this mechanics gate on **both**, then apply the Selection Gate in `references/editorial-lanes-distribution.md`. The user-facing zero-wrapper copy is the recommended or explicitly approved candidate. Preserve the alternate, scores, recommendation, and prediction in the single wiki topic record; do not silently discard it.

**How to invoke:** Call `Skill(skill="linkedin-posts")`. Read its output. Apply the filter rules below.

**USE from `linkedin-posts`:**
- **Char count of full post** — verify within ~1,200-2,100 chars (Shiva's 200-350 word band). Release-theme posts may exceed this if announcing a framework.
- **First-2-lines char count vs 235-char "See more" cutoff** — does the Violation+Credential opener land in the visible portion before "See more"? If not, tighten line 1 (do NOT fall back to 140-char rule).
- **Image dimensions** if the post includes an image: 1200×627 (1.91:1) for link previews, 1200×1200 for single square, vertical preferred, ≤10MB JPG/PNG.
- **Post-type alternatives** — only as a suggestion: if this is a Release-theme post announcing a framework, consider whether a 5-slide document carousel or LinkedIn Article would outperform a feed post. Decision stays with the writer.
- **Hashtag rules** — 3-5 relevant tags, end of post, after line break (already aligned with Shiva's existing rule).

**DO NOT APPLY from `linkedin-posts`:**

| Kostja says | Why we ignore it |
|---|---|
| "B2B tone: Professional and constructive" | Shiva's voice is deliberately contrarian/provocative. Override: voice rules in this skill win. |
| "Place key message in first 140 chars" | Shiva uses Violation+Credential in first 2 lines (often >140 chars). Use the 235-char "See more" cutoff instead. |
| "Optimal: 1,300-1,600 chars; avoid >2,000" | Shiva's 200-350 word band governs. Release exception allows >2,000. |
| "Match CTA to form" | Shiva uses 6 specific closing styles, not generic CTAs. |
| Kostja's Output Format spec ("first line + full post with char count + hashtags + image specs + form note") | Shiva's strict zero-wrapper output format is non-negotiable. Kostja's spec is for INTERNAL mechanics reference, NOT the user-facing output. |

**Override priority (re-stated for clarity — this is the same Governing Rule from the top of this section):** If `linkedin-posts` recommendations conflict with anything in this skill — **especially anything related to writing style, voice, tone, hook structure, length policy, closing style, or output format** — this skill wins. Without exception. Kostja's role is to verify mechanics, not to govern any aspect of how the post is written.

**If the mechanics check flags an issue:**
- Char count out of band → tighten the post (preserve voice and structure first; trim redundancy, not edge).
- First 2 lines exceed 235-char cutoff → tighten line 1 only, keep the Violation intact.
- Image dimensions wrong → fix before publishing.
- All clear → proceed to Step 7's output (which remains the canonical user-facing format).

---

## Step 8: Post-Publish Playbook (after the post is live)

Reach is partly a writing problem and partly a behavior problem. The first 60 minutes after publishing determine the algorithmic ceiling.

**First 60 minutes:**
- Reply to every substantive comment within the hour. The algorithm weighs early reply velocity heavily.
- No one-word thanks ("Great point!" / "Agree!"). Reply with a follow-up question or a refinement of your own argument.
- If a recognized industry voice (CEO, recruiter, faculty peer) comments, save the exchange — that quote becomes credential material for a future post.

**First 24 hours:**
- Comment substantively on 3-5 posts in your niche. Other people's comment sections are where new readers find you.
- Add insight, not agreement. "Adding to this — in the rollouts I've watched, the constraint usually moves to [X]..." beats "100%."
- Do NOT engage with engagement-pod requests, "comment Y for the resource" posts, or any reciprocal-like schemes. LinkedIn detects these and it suppresses your account, not theirs.

**Pattern to avoid:**
- Posting and disappearing for the day — kills momentum.
- Replying only to high-status commenters — visible favoritism.
- Editing the post within the first hour (resets some of the distribution signal).

### Outcome learning, not vanity-score learning

For posts in `linkedin-12-post-v1`, capture the qualified outcomes defined in `references/editorial-lanes-distribution.md`: inquiries and relevant invitations first; then profile/site movement and relevant followers; then substantive intended-audience comments, saves, and sends; impressions and reactions remain context. Compare the result with the pre-publication prediction at 24 hours, 7 days, and 30 days when the data exists.

Do not derive a new voice rule, lane preference, visual rule, or timing rule from one post. Keep the four benchmark slots frozen until 12 posts have been both published and publication-verified, then review copy, topic, visual, timing, audience fit, and external events as separate explanations.

---

## Step 9: Wiki Save + Taste Capture (MANDATORY — after Step 7 output)

Every post becomes a dual artifact: the ship-ready text the user copies, *and* a wiki page that thinks about itself. The post text was already delivered in Step 7 (zero-wrapper, first character = first letter of post — that contract is sacred). Step 9 runs *after* the user has copied the post. Wiki save is **non-optional** — a post without a wiki page leaves no audit trail for taste evolution, and the next post can't be checked against this one's voice.

**Why this step exists (the why before the how).** Posts that don't get captured back into the wiki turn into one-shot artifacts. The wiki is Shiva's thinking partner — recurring taste patterns (which hook archetypes age well, which lens pairs land, which tone-dial deviations earn their place) only become visible when each post's *decisions* are written down beside it. Without Step 9, every post starts cold; with it, every post adds to a working theory of voice that Step 9 of the next post can read.

### 9.1 Target path

```
/Users/shivakakkar/Python Projects/Obsidian Wiki/linkedin-posts/YYYY-MM-DD-slug.md
```

- **One file per topic.** No `-v1`/`-v2`/`-viral`/`-taste`/`-shipped` suffix variants — the personal-vault pattern of artifact-snapshots is *not* the wiki idiom. When the dual-lane route fires, the attention candidate, authorship candidate, selection decision, approved post, visual, and outcomes all live in this one record.
- **Slug**: first 4-6 meaningful words of the H1 or post opener, lowercased, hyphen-joined, no stopwords. e.g. `experience-as-liability`, `by-2028-you-wont-manage-5-people`.
- **Attachments** (god-mode images, etc.) go to `linkedin-posts/attachments/YYYY-MM-DD-slug-<descriptor>.png` and are wikilinked from the post file as `![[attachments/...]]`.

### 9.2 Frontmatter contract

```yaml
---
title: >-
  [post H1 or working title — folded scalar style, wiki convention]
category: linkedin-posts
tags: [linkedin, content-system, <2-3 more from _meta/taxonomy.md>]   # ≤5 total; prefer canonical thinking tags (distribution, workflow-design, taste-system, etc.)
date: YYYY-MM-DD                                                       # the post date — preserved from personal-vault format
status: draft | scheduled | shipped                                    # preserved — drives downstream behavior
portfolio_genre: executive | education | personal_taste | state_of_humans
editorial_lane: attention | authorship | comic_first | pending
selected_candidate: attention | authorship | comic | pending
publication_state: researched | drafted | approved | saved | scheduled | published | publication_verified
benchmark_cycle: linkedin-12-post-v1
hook_archetype: Violation Stat | Industry Quote | Uncomfortable Question | Contrarian Truth | Specific Observation | Future Scenario
lenses_applied:
  - <lens> (primary)
  - <lens> (secondary)                                                 # optional; omit if mono-lens
sources:                                                                # preserved + expanded with attribution
  - Voicenote — "<title>" (Readwise; date if known)
  - Readwise — <Author>, *<Book>*
  - Plaud — <recording title> (date)
  - Web — <URL>                                                         # only when Tier 6 was actually used
source_url: "<news-url-if-news-anchored>"                               # wiki convention; omit if not news-based
draft_id: <linkedin-mcp-draft-uuid>                                     # preserved when applicable
schedule_id: <linkedin-mcp-schedule-uuid>                               # preserved when applicable
scheduled_for: <ISO-timestamp>                                          # preserved when applicable
slot: "<weekday + time IST>"                                            # preserved when applicable
created: <ISO-timestamp-with-IST-offset>                                # first time this file is written
updated: <ISO-timestamp-with-IST-offset>                                # bump on every edit
summary: >-
  [one-line summary, ≤200 chars, folded-scalar style — wiki convention. Answers "what is this post really saying?"]
provenance:
  extracted: 0.50    # share that came directly from Tier 1-5 (his library) — verbatim ideas, not verbatim text
  inferred: 0.45     # share that's voice-shaping, sequencing, framing — Claude's interpolation in Shiva's idiom
  ambiguous: 0.05    # share that's neither clearly his nor clearly synthesized
---
```

**Notes on the contract:**
- The `provenance` fractions are *estimated*, not measured — same convention the rest of the wiki uses. Be honest: a post sourced entirely from a single Voicenote is ~0.70/0.25/0.05; a post built mostly from web Tier-6 reactive commentary is ~0.20/0.70/0.10.
- `tags` must use the controlled vocabulary in `_meta/taxonomy.md`. Always include `linkedin` and `content-system`. Add `taste-system` when the post discusses taste/judgment, `workflow-design` for sequence-inversion posts, `distribution` for release posts, `agentic-ai-use-case` for agent-economy posts.
- Use `>-` (folded scalar) for `title` and `summary` to stay parser-safe.

### 9.3 Body shape — 6 sections

Write in this order. Each section earns its place; skip none.

```markdown
# [Title — same as frontmatter title]

## Editorial Candidates and Selection

When Step 3.5 produced two candidates, use the exact candidate, scoring, recommendation, prediction, and outcome-ledger structure in `references/editorial-lanes-distribution.md`. Preserve both clean bodies. For personal-taste and comic-first posts, record the lane decision and omit an empty alternate.

## Post (as published)

[Verbatim copy of the ship-ready post text from Step 7. Include the source URL line and hashtag block exactly as published. No wrapper text, no commentary inside this section.]

## Sources & Lens Application

- **Lens(es)**: [primary lens — why this lens fit the topic]. [If secondary: how it stacked.]
- **MCP tier hit rate**: Tier 1 (Readwise) ✓/✗, Tier 2 (Voicenotes) ✓/✗, Tier 3 (Plaud) ✓/✗, Tier 4 (Gemini files) ✓/✗, Tier 5 (LlamaCloud) ✓/✗, Tier 6 (Web) ✓/✗ — was authorship sourced from his library before web reinforcement?
- **Specific source → line attribution**:
  - "[line from post]" ← seeded by [source]
  - "[stat or quote in post]" ← reinforced by Tier 6 [URL]

## Taste Notes

Capture the *decisions* (not the post — the decisions behind it). Future posts read this section to check for voice drift.

- **Tone dial deviations from default** (per Step 6's tone dial — Authoritative/Analytical/Provocative/Numbers): which axes deviated, why deviation earned its place.
- **Hook Test observations**: did the line-1 hook pass cleanly, or did it need 2-3 rewrites? What almost-tired pattern was rejected? (e.g., "First draft opened with a 'stranger at the airport' construction — replaced with the specific number.")
- **Cringe Test residuals**: anything in this post that might age badly. If nothing — say so, briefly.
- **Banned-pattern near-misses**: did the draft drift toward "knowledge is free now" credential, "Three X Moves" framework, labeled-audience close, or any retired hook? What was tightened?
- **Vulnerability guardrail trigger** (if personal-experience post): which of the four checks were run, what changed because of them.
- **What worked**: one line on what the post does well that the next post should remember. This is the seed for the promotion rule below.

## Generated Visual (if god-mode produced an image)

If no image — omit this section entirely.

- **Type**: Company-Driven / Personality-Driven / Lateral
- **Key moment**: "[the single sentence the image renders]"
- **Subject / Treatment / Palette / Composition**: from G3 spec
- **Principles applied**: list ≥3 of the 8
- **One-sentence pitch**: from G3 VD6 pitch test
- **Audit findings**: aspect ratio ✓, no-text ✓, no-face ✓, no-white-bg ✓, hand-glitch ✓, cream-border ✓ (or note what failed and was regenerated)
- **Engine**: SeedDream 4.5 / Gemini Nano Banana 2 / text-only-fallback + elapsed time
- **Image**: `![[attachments/YYYY-MM-DD-slug-<descriptor>.png]]`

## Connections

- [[linkedin-post-niche-pipeline]] — content-side pipeline this post sits inside
- [[linkedin-roster-theme-system]] — twelve theme pillars; this post sits under [pillar name]
- [[<synthesis-or-references-page>]] — any wiki page whose argument this post extends or contradicts
- [[<entity-page>]] — any tool/person/org centered in the post (e.g., [[sangeet-choudary]], [[rehearsal-app]])
```

### 9.4 Promotion rule (recurring patterns → synthesis page)

When the **same taste observation surfaces in ≥3 posts** (check the Taste Notes sections of recent posts under `linkedin-posts/`), append it as a new bullet under "Taste Topics" in:

```
/Users/shivakakkar/Python Projects/Obsidian Wiki/synthesis/linkedin-roster-theme-system.md
```

That page already has 12 seeded taste bullets. **Do not** spin up a new `skills/linkedin-voice-taste.md` page — the synthesis page is the canonical home, and fragmenting taste thinking across two pages defeats the wiki's "synthesize into existing pages" invariant (per `Obsidian Wiki/CLAUDE.md`).

Examples of promotion-worthy patterns:
- "Future Scenario hook + Authority Redesign lens has shipped 3 winning posts" → promote.
- "Tier-6 web reinforcement consistently strengthens Sequence Inversion posts but weakens Constraint Migration posts" → promote.
- One-off "this draft almost used 'A stranger at the airport'" → do NOT promote (single instance).

### 9.5 Wiki index/log/hot updates (after writing the post file)

After the post file is written, **either**:

**(a) Direct append (always works, no config needed):**

1. **`log.md`** — append one line at the end of the file:
   ```
   - [<ISO-timestamp-with-IST-offset>] LINKEDIN_POST status=<status> page="linkedin-posts/YYYY-MM-DD-slug.md" title="<title>" lenses="<primary+secondary>" hook_archetype="<hook>" focus="<one-line gist>"
   ```

2. **`index.md`** — add an entry under a "## LinkedIn Posts" section (create the section if missing, place it after "## Synthesis (Recent)"):
   ```
   - [[linkedin-posts/YYYY-MM-DD-slug|<title>]] — <one-line summary>. <status>.
   ```

3. **`hot.md`** — if the post represents an active thread or a fresh decision worth surfacing, add a line to "Recent Activity" or "Key Takeaways". If it's a routine post, skip hot.md — not everything earns space there.

**(b) Delegate to `wiki-update` skill (richer, requires config):**

If `~/.obsidian-wiki/config` exists (check first via `ls ~/.obsidian-wiki/config`), invoke `Skill(skill="wiki-update")` after writing the post file — it will handle `index.md` / `log.md` / `hot.md` / `.manifest.json` per the canonical wiki protocol. If the config does not exist, default to path (a) above and *don't* prompt the user to set up wiki-update mid-post-flow — that's a separate concern.

### 9.6 Output-contract safety (Step 7 must still hold)

- Step 9 runs *after* Step 7's zero-wrapper post output is in the chat. Nothing in Step 9 leaks into the post body.
- After Step 9 completes, the user-facing message that follows the post should be ONE short line: e.g., "📝 Saved to wiki: `linkedin-posts/2026-05-12-<slug>.md`" — nothing more. The user reads the post first; the wiki confirmation is incidental.
- In god-mode, the image block (Step G7's `─────────────` separator block) appears between the post and the wiki confirmation line.

### 9.7 Skip rule (the ONE case where Step 9 is deferred)

If the user explicitly says "don't save this one" or "draft only — don't write to wiki" or "throwaway / test post", skip Step 9 and capture nothing. This is rare. Default is always SAVE.

If the post failed the Hook Test or Cringe Test and is being discarded mid-flow (Step 5.5 kill), Step 9 also doesn't fire — there's no post to save.

---

## Post Creation Workflow Summary

1. **Source**: Run MCP Source Hierarchy tiers 1-5 (Readwise → Voicenotes → Plaud → Gemini-files → LlamaCloud) before web. Web is support, not seed.
2. **Gather**: Use MCPs for frameworks (rewrite in user voice)
3. **Select**: Choose theme from 6-week rotation (avoid repetition)
3.5. **Route editorial lane**: Load `references/editorial-lanes-distribution.md`; for `State of Humans` or editorial-comic work, load `references/state-of-humans-editorial-comic-system.md` before scripting; for serious enterprise and education topics, create attention + authorship candidates from one thesis, score both, recommend one, preserve both in one topic record
4. **Structure**: Apply 4-layer structure (Violation → Credential → Insight → Hook); pick a hook archetype, avoid retired patterns
5. **Verify (SUCCESs)**: Check all 6 elements present
5.5. **Hook Test + Cringe Test**: Line-1 gate (5 questions) + year-from-now self-check
6. **Polish**: Voice authenticity, structural variety, format anti-patterns, tone-dial calibration, vulnerability guardrail (if personal)
7. **Output**: Post text only (no wrapper text)
7.5. **Mechanics Gate**: Auto-invoke `linkedin-posts` for char/See-more/image/format validation on every surviving candidate. Apply clash table — voice/length/CTA prescriptions REJECTED; mechanics fixes APPLIED. Shiva wins every writing-style clash.
8. **After publish**: First-hour reply discipline; 24-hour substantive commenting on others; no pods; capture qualified outcomes without overlearning from one post
9. **Wiki Save + Taste Capture (MANDATORY)**: Write one topic record containing candidate ledger, selected copy, prediction, outcome, frontmatter, and Taste Notes to `Obsidian Wiki/linkedin-posts/YYYY-MM-DD-slug.md`. Append `log.md`, add to `index.md` under "LinkedIn Posts" section. If pattern recurs across ≥3 posts, promote into `synthesis/linkedin-roster-theme-system.md` "Taste Topics". Skip ONLY on explicit "don't save" or Step 5.5 kill.

---

## God Mode (Autonomous Pipeline with Visual Generation + Self-Learning Loop)

**Trigger:** When the user invokes the skill with the explicit keyword `god mode`, `god-mode`, `gm`, or `--god-mode` (e.g., `/shva:shva-linkedin-post-writer god mode write a post on ambient AI`).

**Purpose:** Run the full pipeline autonomously — write the post, decide if a visual is needed, determine the visual style, generate the image, run the visual audit, capture learnings, and (if requested) publish via the validated six-step publish protocol. No `AskUserQuestion` gates inside god mode (atom-creator pattern). All decisions auto-resolve via heuristics in the reference files.

**🔗 LOAD `references/god-mode-pipeline.md` for the full step-by-step playbook.** That file contains detailed instructions for G0-G7, the publish protocol invocation pattern, and the post-run learning capture routing. The body of SKILL.md keeps only the high-level shape below.

**Reference files loaded progressively as god-mode steps fire:**
- `references/editorial-lanes-distribution.md` — dual candidates, selection gate, genre visual route, distribution benchmark, and outcome ledger (G1, G2, G8, post-run)
- `references/state-of-humans-editorial-comic-system.md` — mandatory for every `State of Humans` or editorial-comic route; load before scripting, captioning, or image prompting (G1, G2, G3, G6, G7, G8)
- `references/visual-philosophy-linkedin.md` — visual types, Lateral Thinking Principles, classification (G2, G3)
- `references/seedream-prompt-rules.md` — prompt construction rules (G4)
- `references/learnings-protocol.md` — JSONL self-evolution loop (G0, G6, post-run)
- `references/linkedin-publish-rules.md` — six-step publish protocol (G7 publish)

### Pipeline Overview

| Step | What | Loads | Output |
|---|---|---|---|
| **G0** | Learnings checkpoint | `references/learnings-protocol.md` | Display NEW count + promotion candidates |
| **G1** | Steps 1-7.5 (existing flow) | — | Post drafted + mechanics-gated |
| **G2** | Genre route + Visual Need Decision | `references/editorial-lanes-distribution.md`; for `State of Humans`, load `references/state-of-humans-editorial-comic-system.md` before scripting; otherwise use `references/visual-philosophy-linkedin.md` "Visual Need Decision Gate" | genre, yes/no + contribution reason |
| **G3** | Visual Style Determination (only if G2 = yes) | Dedicated `State of Humans` reference for comic-first work; otherwise `references/visual-philosophy-linkedin.md` (full file) | Comic production brief or general Visual Style Spec |
| **G4** | Prompt / production-brief construction (only if G2 = yes) | Dedicated `State of Humans` reference for comic-first work; otherwise `references/seedream-prompt-rules.md` | Continuity-locked comic brief or final two-part SeedDream prompt |
| **G5** | Image Generation via fal.ai SeedDream (only if G2 = yes) | — | PNG saved to `linkedin-images/{date}-{slug}.png` |
| **G6** | Visual Audit + Learnings Capture | Dedicated `State of Humans` continuity/feed-size checks when comic-first; `references/learnings-protocol.md` for capture | Audit report + JSONL entries for any HIGH findings |
| **G7** | Final Output + Publish (if requested) | `references/linkedin-publish-rules.md` | Post text + image block + (optional) live LinkedIn post |
| **G8** | Wiki Save + Taste Capture | Step 9 of basic skill (above) | Wiki page at `Obsidian Wiki/linkedin-posts/...` + `log.md` entry + image attachment copied |

### Step Details

For the full step-by-step playbook (G0 through G7, plus the post-run learning capture), **load `references/god-mode-pipeline.md`**. That file contains:
- Per-step instructions with the rationale for each decision
- Visual Style Spec template (G3)
- SeedDream two-part prompt structure (G4)
- Engine fallback chain and last-resort path (G5)
- Visual audit checks (G6)
- Final output composition + publish protocol invocation (G7)
- Post-run learning signal table (capture domain by user signal)

The body of SKILL.md keeps only the high-level shape (the table above) plus the critical rules below. The pipeline file is loaded once when god-mode triggers, not on every basic-skill invocation — progressive disclosure.

### God Mode Critical Rules

1. **NO AskUserQuestion at ANY point.** All decisions auto-resolve via heuristics in this skill + reference files.
2. **NEVER override Shiva's voice** to accommodate visual style. Step 7.5's Governing Rule still applies — Shiva wins every writing-style clash, including any clash with the visual.
3. **STILL run mandatory mechanical checks** (aspect ratio, audit, prompt length) — these are mechanical, not voice-related.
4. **Capture learnings on every HIGH-severity finding** — this is the loop's lifeblood. No quiet failures.
5. **Image is supportive, not the headline.** If god mode produces a perfect post but a glitched image, ship the post text-only and log the failure. Do NOT hold up the post for a perfect image.
6. **Output the post FIRST** (zero-wrapper, first letter is first character) — image block follows after a separator.
7. **Verify with `sips`** after every image generation. Always.
8. **🚨 PUBLISH PROTOCOL: Six-step ASCII-sanitize → draft → publish → verify → auto-retry.**
   
   Validated 2026-04-25 across 3 publish attempts. **Direct `linkedin_post` is BANNED for any post over 200 chars.** The draft-first protocol alone is INSUFFICIENT — drafts store full text correctly even when LinkedIn's publish step silently truncates non-ASCII content.
   
   **Load `references/linkedin-publish-rules.md` for the full HARD constraints.** The mandatory cycle:
   
   ```
   Step 1  ASCII SANITIZE  — em-dash → hyphen, drop diacritics (ī ā ē ū ō),
                            replace smart quotes with straight, simplify hashtags
                            (#tryrehearsal NOT #tryrehearsal.ai). Validate with
                            python3 ord()>127 scan. NEVER publish with non-ASCII.
   
   Step 2  DRAFT SAVE      — linkedin_drafts_save(text, images, content_type="image")
   
   Step 3  DRAFT READBACK  — linkedin_drafts_get(id) — diff vs intended.
                            (This catches MCP-storage issues, not LinkedIn-publish issues.)
   
   Step 4  PUBLISH         — linkedin_drafts_publish(draft_id) + confirm POST IT.
   
   Step 5  POST-PUBLISH    — linkedin_posts_history(limit=1) — fetch the just-
       VERIFY                published post and diff returned text vs intended.
                            (THIS IS THE LOAD-BEARING STEP. Truncation is detected here.)
   
   Step 6  AUTO-RETRY      — On Step-5 truncation: linkedin_delete(urn) + DELETE IT,
                            stricter ASCII sanitization, return to Step 1.
                            Max 2 retries before alerting user.
   ```
   
   **Sanskrit / non-English anchors are OK only as pure-ASCII transliterations (vivek, vivinakti, gurukul, dharma).** Drop diacritics. Translate `dhīra`/`preya`/`shreya` and similar inline. The linguistic killer move survives translation — keep 1-2 Sanskrit anchors max.

### Post-Run Self-Learning

After god mode finishes, if the user gives any feedback signal:
- "this image doesn't fit" → capture `lk_visual_style` HIGH
- "voice is off" → capture `lk_post_voice` HIGH
- "regenerate but [reason]" → capture `lk_visual_*` based on reason
- "this is great" / "ship it" → no capture needed (positive confirmation)

Also update the single topic's candidate/outcome ledger when an alternate is preferred, a visual is rejected, or qualified post-publication evidence arrives. Treat the event as one observation. Promote a durable lane, timing, or visual rule only under the 12-post review rule in `references/editorial-lanes-distribution.md`.

If the user explicitly invokes `/shva:shva-linkedin-post-writer learn` (separate command), walk through promotion candidates with their approval.

### What god mode is NOT

- ❌ A replacement for the basic skill — the basic flow (Steps 1-8) still works without god mode for fast post-only drafts
- ❌ A free pass on quality — every audit check still HARD-blocks if it fails
- ❌ A way to bypass Shiva's voice rules — Step 7.5 Governing Rule applies to visual style too (kostja's "professional B2B" cannot soften the image)
- ❌ A guarantee of an image — if the post genuinely doesn't need one (Constraint Migration with pure numerical-lead violation), god mode SKIPS the image and ships text-only

---

## God Mode Workflow Summary

```
G0  Learnings checkpoint     → 📚 N NEW, M PROMOTED, K candidates
G1  Run Steps 1-7.5          → Post drafted + mechanics-gated
G2  Genre + visual decision → genre route + yes/no + contribution reason
G3  Visual style spec        → TYPE/KEY MOMENT/SUBJECT/TREATMENT/PALETTE/PITCH
G4  SeedDream prompt         → Two-part: content + style cluster + Chinese keywords
G5  Image generation         → fal.ai → Gemini fallback → text-only last resort
G6  Audit + learnings        → Aspect/text/face/bg/hands checks + JSONL capture
G7  Final output + publish   → Post (zero-wrapper) + image block + (optional) 6-step LinkedIn publish protocol
G8  Wiki save + taste        → linkedin-posts/YYYY-MM-DD-slug.md + log.md + index.md ; attachments mirrored ; ≥3-recurrence patterns promoted into synthesis/linkedin-roster-theme-system.md
```
