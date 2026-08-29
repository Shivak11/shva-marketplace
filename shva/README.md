# shva

> Shiva's personal Claude Code command pack.
> Commands in this plugin start with `/shva:` — that's the `shva` namespace tag.
> (Yes, the missing "i" is on purpose. Easier to remember, impossible to collide.)

## v0.9.2 — LinkedIn Dual-Lane Editorial System

The LinkedIn writer now separates the quality of a thesis from its packaging. Serious enterprise-AI and AI/work/education topics produce two evidence-identical candidates: an **attention candidate** optimised for rapid relevance and an **authorship candidate** closest to Shiva's durable taste. Both pass the same evidence, voice, Hook, Cringe, SUCCESs, and mechanics gates; one is recommended, while both remain in one wiki topic record.

Each record now preserves the candidate scores, pre-publication prediction, approved selection, qualified outcomes, and what the comparison taught. The system gives priority to inquiries, relevant invitations, profile/site movement, and intended-audience engagement; impressions remain context. Lane, visual, and timing rules change only after a 12-post publication-verified benchmark.

The four portfolio genres now have different visual jobs and benchmark slots: personal systems thought on Monday 18:00 IST, executive enterprise AI on Wednesday 16:00, AI/work/education on Thursday 16:30, and monochrome `State of Humans` on Friday 15:30. These are approval slots, never unattended publishing authority.

## v0.9.1 — Hidden Agendas Spotter

**`/shva:hidden-agendas-spotter` sees the reality beneath presented reality.** Use it on a claim, photograph, partnership, metric, policy, ritual, product launch, or everyday performance.

It reads the scene backwards: reconstructs what produced the display, maps what each actor helps the other appear to be, identifies the audience and operative payoff, compares visible proof with costly reality, follows cost-bearing behaviour, tests counterfactuals, and decides whether recurrence reveals the real rule. Every conclusion is labelled as observed, strong inference, plausible reading, or speculation.

The reciprocal-agenda lens is essential. A partnership can create real value while also allowing both parties to certify each other. For example, a technology vendor lends frontier capability to an enterprise partner; the partner lends the vendor scale, market access, and an enterprise success story. The skill asks what each side could not credibly claim alone.

Only after the evidence ledger holds does it compress the suppressed premise into a cartoon situation or memorable principle. It never names a phenomenon merely to sound original and never presents private motive as fact.

```
/shva:hidden-agendas-spotter TCS and Anthropic provide Claude to 50,000 employees
/shva:hidden-agendas-spotter this photograph of a leader meditating alone
/shva:hidden-agendas-spotter
```

## v0.9.0 — `/shva:meditate`

**A personal reflection and judgment ritual for real work.** Run it on an artifact, a completed session, or a cross-surface taste question. It adapts the five R's of meditation — Review, Relate, Reinforce, Record, Resolve — to Shiva's working system and adds the five-question Aliveness Review:

1. What is the particular bet here?
2. Where is the charge, and what contains it?
3. What proves this is real?
4. What have I over-explained?
5. Would I recognise this with the logo removed?

The skill ends with one named insight, evidence and confidence, a counterexample or unresolved tension, a next experiment, and an explicit record/no-record verdict. It treats charged specificity as a hypothesis to test rather than a universal doctrine. Private attraction may sharpen contrast, but never automatically explains professional taste, generalizes about women, or crosses into public doctrine. Wiki writes and promotions always require explicit approval.

```
/shva:meditate artifact outputs/taste-meditation.html
/shva:meditate session today's Rehearsal design work
/shva:meditate taste what connects my books, interfaces, and writing?
```

## v0.8.0 — three workflow skills from matured wiki methods

Three personal accelerators, each promoted from a method that had stabilised in the Obsidian wiki.

**`/shva:genai-use-case-finder`** is an analysis generator. Feed it a function, org, industry, or process and it fills a prioritized GenAI use-case portfolio for that real organization by running the four-move method: MAP (dual-lens discovery, Stream lens for point candidates and Flip-It lens for system candidates), GATE (the five-question point-versus-system tell), SCORE (value by feasibility, risk as a veto, verifiability as the autonomy axis), and SEQUENCE (the named quadrants: Lighthouses, Strategic Bets, Quick Wins, Park or Kill). It is the analysis sibling of the two teaching skills: it fills the matrix for a real org, it does not teach the method.

**`/shva:mdp-source-finder`** is a raw-material assembler. Give it a course, MDP, FDP, or workshop brief and it returns a source pack of repos, tools, references, and demos indexed by session beat (hands-on lab, opening hook, case study, live demo, pre-read, course scaffold to borrow), with a "why this, here" line on each. It queries Raindrop and the wiki live rather than echoing a frozen list, and hands off to `teaching-designer` to build the session.

**`/shva:persona-profile-from-text`** builds an evidence-anchored profile of a person from their own text, with every observation quoting the source line. Two modes: mirror mode reflects a Rehearsal user's recordings back to deepen self-fascination (engagement, not coaching), and voice-harvest mode reads a target leader's voice and concerns for B2B outreach. Frameworks (Big Five, Schwartz values, affect) organize the reasoning but are never printed as scores or type codes, surprises are offered as questions not verdicts, extraction branches by source type over an append-only signal log, and profiling consent sits at a higher tier than plain fact-memory.

```
/shva:genai-use-case-finder claims at a mid-size insurer
/shva:mdp-source-finder AI workflows with open-source tools
/shva:persona-profile-from-text reflect my last month of voice notes back to me
```

## v0.7.0 — `/shva:teaching-designer`

**The facilitator-side teaching artifact.** Where `worksheet-generator` makes the sheet participants fill in, `teaching-designer` makes what you teach *from*: a light, discussion-led executive keynote delivered as a session plan, a spoken script, and an aesthetic interactive HTML doc (lesson plan plus click-to-expand script).

Pipeline: AskUserQuestion discovery, then parallel research across the Obsidian wiki, LlamaCloud, Readwise, YouTube, and book-search (with provenance labels and caveats), then a scaled-spine arc (one contrarian idea traced across Individual, Team, and Organization with a single running thread and a wrapper analogy opened cold and closed at higher resolution), a memorable named principle per section, micro-exercises, evidence cards with real citations, before and after Mermaid diagrams (validated before embedding), and a collapsible colour-coded HTML house style with a render-check.

```
/shva:teaching-designer <topic>      # or run blank to be asked
```

## v0.6.0 — `/shva:worksheet-generator`

**Hands-on workshop worksheets from a topic plus rough ideas.** Produces an AI-resistant, self-contained, print-ready participant worksheet (HTML first for review, then a ReportLab PDF) in Shiva's voice.

Seven-stage pipeline: AskUserQuestion intake; parallel research across LlamaCloud, the Obsidian wiki, Readwise, YouTube, book-search, and Mobbin design taste; a carried-forward content arc with one worked example threaded through; the hard formatting rules (no author names, no em or en dashes, plain language, proportional boxes, contextual "Be Mindful!" panels, real signing space); an HTML house-style template with a render-and-eyeball verify loop; and a ReportLab print build. Bundles the aesthetic-pdf-creator guide, a worked builder, the HTML template, a banned-string lint, and a render-check script.

```
/shva:worksheet-generator <topic>    # or run blank to be asked
```

## v0.5.0 — LinkedIn Cadence + Publish Confirmation

The SHVA LinkedIn writer now treats anti-staccato cadence as a durable voice rule: a hard hook can stand alone, but the body should usually move as connected paragraph reasoning rather than template one-line laddering.

The LinkedIn publish rules also now document the Cloudflare MCP confirmation path: preview tools return an Action ID, and publishing requires `linkedin_confirm` with `confirmation="POST IT"` rather than rerunning the post tool.

## v0.1.0 — `/shva:brief-me`

**Pre-project vocabulary briefing for any GenAI build.**

In the GenAI era, syntax is cheap and vocabulary is the bottleneck. The sharper you can name what you want, the better the AI's output. This command generates a domain-specific glossary *before* you start a project, so your first instructions land cleanly instead of triggering hours of drift.

### Usage

```
/shva:brief-me <project-type>
```

Or run blank to be prompted:

```
/shva:brief-me
```

### What you get

1. **20–25 term glossary** in three buckets:
   - 🎨 **Creative / Style** — how things look, sound, feel
   - ⚙️  **Technical / Process** — how things are built or run
   - 💬 **Prompt / Direction** — words you'll actually say to the AI
2. **3 sharp clarifying questions** — aesthetic refs, scope, constraints
3. **A correction-coda prompt** to paste before your real project brief — turns Claude into a real-time vocabulary coach
4. **Optional save** — write the glossary to `.shva/glossaries/<slug>-<date>.md` in the current project

### Domains it handles

Domain-agnostic by design:

- 🕹️ Browser games (Phaser, p5.js, Three.js)
- 📊 Web apps & dashboards (Next.js, shadcn, Tailwind)
- 🛒 E-commerce
- 📱 Mobile-first apps
- 🎬 AI video (Runway, Kling, Pika)
- 🎵 AI music (Suno, Udio, ElevenLabs Music)
- 🖼️ AI art (Midjourney, Flux, Nano Banana)
- 🗣️ Podcasts & audio drama (ElevenLabs, voice acting)
- 📑 Slide decks & docs
- ✍️ Copywriting & editorial

If your domain isn't listed, the command still works — `brief-me` infers the relevant vocabulary from the project type you describe.

### Why this is `/shva:` and not `/brief-me`

Personal namespace. Three reasons:

1. **Memory tag** — when I see `/shva:*` in any skill list, I know it's mine.
2. **Future-proof** — more personal commands will live here (`/shva:rip`, `/shva:think-with-me`, etc.) without polluting global namespace.
3. **Collision-proof** — "shva" (no `i`) doesn't conflict with anything in the wider Claude ecosystem.

## Installation

```bash
# 1. Add the marketplace (one-time)
/plugin marketplace add ~/Python\ Projects/shva-marketplace

# 2. Install the plugin
/plugin install shva@shva
```

After editing any command file, reload with:

```bash
/plugin uninstall shva@shva
/plugin install shva@shva
```

To update an existing Claude Code installation from the GitHub marketplace:

```bash
claude plugin marketplace update shva
claude plugin update shva@shva --scope user
```

To install `meditate` and `hidden-agendas-spotter` as global skill copies for Codex, Cursor, and Claude Code:

```bash
npx skills add https://github.com/Shivak11/shva-marketplace \
  --skill meditate --skill hidden-agendas-spotter --global \
  --agent codex --agent cursor --agent claude-code \
  --yes --copy
```

The full Claude Code plugin preserves the `/shva:` namespace; the standalone parity install exposes the same skill procedures directly in each harness.

## Source

The `/shva:brief-me` workflow is distilled from a 17-page Perplexity exchange in May 2026 about pre-project vocabulary briefings — the realisation that in the GenAI era, the developer's leverage moved from syntax to vocabulary and intent. The Perplexity transcript is preserved in the workspace where this plugin was first scaffolded.

## License

Personal use. Fork freely if useful — drop the `shva` prefix and rename to your own.
