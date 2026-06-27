---
name: mdp-source-finder
description: >-
  Use when Dr. Shiva Kakkar is sourcing raw material for a course, MDP, FDP, or
  executive workshop and needs the repos, tools, references, and demos worth
  pulling in. Assembles a curated source pack indexed by SESSION BEAT (hands-on
  lab, opening hook, case study, live demo, pre-read, course scaffold to borrow),
  with a short "why this, here" line on each item. Triggers on "MDP", "FDP",
  "course sources", "what repos for this session", "find me labs for", "source
  pack for a workshop on <topic>". This skill assembles raw material only. It
  does NOT design the session, write the script, or teach. When the source pack
  is ready and Shiva wants the session built, hand off to teaching-designer.
---

# MDP Source Finder for Dr. Shiva Kakkar

Turn a course brief into a curated **source pack**: the repos, tools, references, and demos worth pulling into a GenAI MDP, FDP, or executive workshop, indexed by the session beat they serve. This skill is a raw-material assembler. It finds and organizes the ingredients. It does not cook the meal.

The whole point is an inversion. Raindrop and GitHub index sources by what they are (a repo, a tool, an article). A teacher needs them indexed by when you reach for them in a session: a hands-on lab to run live, an opening hook, a case study, a live demo, a pre-read, or a course scaffold to borrow. The pedagogical question ("what session beat is this for?") sits in front of the topical question. The output of this skill is that re-indexed pack.

**Golden rule: query live, then re-index. Do not echo a frozen list.** The source map is a late-May 2026 snapshot and it will rot. Pull candidates live from Raindrop and the wiki for THIS brief, then assemble the pack fresh each run.

**Boundary and handoff:** this skill stops at the source pack. It does not produce a session plan, a script, or HTML. When Shiva has the pack and wants the actual session designed, hand off to the `teaching-designer` skill (its sibling at `shva:teaching-designer`). The two compose: this one gathers the ingredients, that one builds the session.

**Paths:** when this skill loads, its base directory is announced. Capture it as `$SKILL_DIR` and use it for bundled files. Reads of `references/*.md` may use bare relative paths, but Bash runs must use the absolute base (the runtime CWD is the user's project, not this skill): `SKILL_DIR="<announced base directory>"`, then e.g. `bash "$SKILL_DIR/scripts/lint.sh" <file.md>`.

---

## The pipeline (4 stages, in order)

| # | Stage | What happens | Gate |
|---|---|---|---|
| 1 | **Intake** | Learn topic, audience function and seniority, format, show vs make, session length, which beats are needed. | Read `references/01-intake-questions.md`. Use AskUserQuestion. |
| 2 | **Live query** | Pull candidate sources live from Raindrop (by adjacent tags and keywords) and read the wiki map. De-dupe and freshness-check. | Read `references/02-live-query-protocol.md`. Query, do not echo. |
| 3 | **Re-index by beat** | Sort every candidate into session beats for THIS brief. Drop weak fits. Write the "why this, here" line on each. | Read `references/00-method.md` and `references/03-output-format.md`. |
| 4 | **Recommend the spine** | Name the 4 to 6 skills that should anchor the course, one per session. Offer the teaching-designer handoff. | See `references/03-output-format.md`. |

Run the stages in order. The pack's value is set in Stage 2 (what you find) and Stage 3 (how you re-index it), not in formatting.

---

## What "good" looks like (design backward from this)

- **Indexed by beat, not by artifact.** Every item lives under the session beat it serves (Hands-On Lab, Opening Hook, Case Study, Live Demo, Pre-Read or Post-Read, Course Scaffold To Borrow), not under "repos" or "tools". The same OpenWork link is a live demo in one brief and a hands-on lab in another. The beat is decided by the brief, not by the source.
- **A "why this, here" line on every item.** One complete sentence: why this source fits this beat for this audience. No line, no item.
- **Show vs make is explicit per item.** Mark each as a watch-a-demo posture or an install-it-yourself posture. Default to install when the friction is low.
- **Skills are the unit of teaching.** The cleanest GenAI session installs, invokes, and watches a Claude Code skill. Build the course around 4 to 6 chosen skills, one anchoring each session, rather than around abstract topics hunting for demos. The skill picks the topic.
- **Fresh, not frozen.** The pack reflects what Raindrop and the wiki hold today, re-indexed for this brief. The wiki map is the curated seed. Raindrop is the live layer. The output is assembled this run.
- **Lean, not exhaustive.** Three or four strong items per needed beat beats a dump of twenty. The point was always "stop searching ten minutes each time", not "list everything".

---

## The hard rules (never violate)

- **No em-dashes and no en-dashes.** Use periods, colons, commas, parentheses, and "to" for ranges. Write "0 to 12 min", never with a dash.
- **Author and source names are fine here.** This is a source list. Name the repo, the author, the tool. (This is the opposite of the participant-artifact rule in worksheet-generator and teaching-designer, where names are stripped.)
- **No stylish or GPT-cloud language.** Say it plainly. The "why this, here" lines are complete sentences a casual reader understands.
- **Flag uncertain terminology.** Label a coinage as a coinage.
- **Stay inside the boundary.** Assemble sources. Do not design the session. When asked to build it, hand off to teaching-designer.
- **Lint before shipping.** `bash "$SKILL_DIR/scripts/lint.sh" <file.md>` over any file you write. Expect CLEAN.

---

## Tooling

- **Raindrop MCP (the live layer):** `mcp__claude_ai_Raindrop__find_bookmarks` (search by tag and keyword), `mcp__claude_ai_Raindrop__find_tags` (see what tags exist), `mcp__claude_ai_Raindrop__find_collections`, and `mcp__claude_ai_Raindrop__fetch_popular_keywords`. Query by the brief's topic plus adjacent tags. See `references/02-live-query-protocol.md` for the exact recipe.
- **Wiki (the curated seed):** read `/Users/shivakakkar/Python Projects/Obsidian Wiki/maps/mdp-course-source-router.md` for the human-curated picks and the session-beat taxonomy. Optionally run `qmd query` or the Obsidian MCP for topic matches across the wider vault.
- **Web (the gap-filler):** when Raindrop and the wiki are thin on a beat, a targeted web search for a fresh repo or tool is fair. Note in the pack that the item came from a live search, not the curated library.

---

## References (load on demand)

- `references/00-method.md` is the method: the session-beat taxonomy, the index-inversion principle, the "skills as teaching primitive" pattern, and the open-source tool-suite framing.
- `references/01-intake-questions.md` is the Stage 1 question set.
- `references/02-live-query-protocol.md` is the exact Raindrop and wiki query recipe, the tag and keyword strategy, the mdp-tagged-vs-mdp-useful tension, and de-dupe and freshness handling.
- `references/03-output-format.md` is the session-beat-keyed source pack format and the "4 to 6 skills to anchor the course" recommendation block.

---

## After shipping (optional)

When a pack is finalized, offer to:

- **Tag new saves.** If the live query surfaced strong items that are not yet tagged for teaching, offer to tag them `mdp-example` in Raindrop (via `mcp__claude_ai_Raindrop__update_bookmarks`) so the next run surfaces them automatically. This is how the library self-heals the mdp-tagged-vs-mdp-useful gap.
- **Save the pack** to the relevant project folder so the brief and its sources stay together.
- **Hand off to teaching-designer** to turn the pack into the actual session plan, script, or interactive HTML.
