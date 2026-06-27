---
name: teaching-designer
description: >-
  Use when Dr. Shiva Kakkar wants an executive teaching artifact: a course or
  program outline, a session plan, a teaching script, or a light discussion-led
  keynote delivered as an aesthetic interactive HTML doc (lesson plan plus
  click-to-expand spoken script). Produces contrarian, story-driven, research-grounded
  teaching material in Shiva's voice for senior B-school and executive audiences.
  Triggers on "session plan", "teaching script", "course outline", "design a session
  on <topic>", "build the HTML for this lesson", "keynote for executives", "XLRI/MDP
  session". Sibling of worksheet-generator: that one makes a participant fillable
  worksheet, this one makes the facilitator plan, script, and interactive teaching doc.
---

# Teaching Designer for Dr. Shiva Kakkar

Turn a teaching brief into an executive session that lands: a **light, discussion-led keynote** for a senior audience, grounded in Shiva's own corpus and real evidence, delivered (when asked) as an **aesthetic interactive HTML document** that holds the lesson plan and the full spoken script, with the script behind click-to-expand so the page stays scannable.

Validated on the XLRI "Change Management for AI Adoption" session, "Not Deeper, Wider," June 2026. The canonical method lives in the wiki at `maps/executive-teaching-keynote-method.md`; `references/00-method.md` is the bundled copy. This skill is the facilitator-facing sibling of `worksheet-generator` (participant fillable worksheet). Keep the two distinct.

**Golden rule: do not skip stages and do not do half research.** A keynote's quality is set before any HTML, in the discovery, the research, and the arc. Run the pipeline in order.

**Paths:** when this skill loads, its base directory is announced. Capture it as `$SKILL_DIR` and use it for bundled files. Reads of `references/*.md` may use bare relative paths, but Bash runs and asset copies must use the absolute base (the runtime CWD is the user's project, not this skill): `SKILL_DIR="<announced base directory>"`, then e.g. `cp "$SKILL_DIR/assets/teaching-doc-template.html" .` and `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>`.

---

## STEP 0: What is being asked for (decide first)

Produce exactly ONE artifact per request unless told otherwise:

- **Course or program outline** is a table of sessions. Read `references/00-method.md`.
- **Session plan** is the tabular run of show (objectives, takeaways, time blocks). Default when ambiguous about a single session.
- **Teaching script** is spoken-word prose with delivery cues. Only when "script" is asked.
- **Interactive HTML doc** is the plan plus expandable script plus exercises plus diagrams, in the house style. When Shiva asks to "build the HTML", "make it interactive", or "make it aesthetic".

When the request is a fresh topic and the deliverable is open, run the full pipeline below and let Shiva converge before building.

---

## The pipeline (6 stages, in order)

| # | Stage | What happens | Gate |
|---|---|---|---|
| 1 | **Discovery** | Learn topic, the single central idea, audience, length, how light, deliverable. | Read `references/01-intake-questions.md`. Use AskUserQuestion. |
| 2 | **Research** | Fan out across ALL of Shiva's sources and the open web in parallel. | Read `references/02-research-protocol.md`. Parallel, not serial. |
| 3 | **Recommend and converge** | Propose the scaled-spine topic structure; let Shiva pick the cut, theory weight, and next deliverable. | AskUserQuestion. Converge BEFORE building. |
| 4 | **Plan** | Write the tabular session plan: objectives, takeaways, time-blocked run of show. | Read `references/00-method.md` and `references/03-pedagogy-and-taste.md`. |
| 5 | **Build HTML** | Build the interactive doc from the house style; validate diagrams; render-verify. | Read `references/05-build-html.md`. Use `assets/teaching-doc-template.html`. |
| 6 | **Iterate** | Open it for Shiva, refine. Every refinement keeps the whole arc consistent. | HUMAN GATE. |

Stage 5 happens only when Shiva wants the HTML. Outline, plan, and script can be the final deliverable on their own.

---

## What "good" looks like (design backward from this)

- **One idea, scaled across altitudes.** Pick a single contrarian idea and trace it through Individual, then Team, then Organization. The same idea at three resolutions, not three topics.
- **A running thread**, carried through every section and shown as a small recurring chip (for example "Where does the human stand").
- **A wrapper analogy** opened cold (sounds nothing like the topic) and closed at higher resolution.
- **A memorable named principle per section**, plus an end revision recap that lists all of them with a short "Apply it" action each.
- **Light, not dense.** For senior audiences: one analogy, one short clip, one discussion prompt per act. No worksheets here (that is the other skill). Frameworks and author names are garnish, not the spine.
- **Experience before explanation.** A micro-exercise or poll lets the room discover the point before it is named. Two validated exercises: the JD rewrite, and the Jesuthasan task decomposition (tag each task E for execution, A for augment, D for decision). See `references/03-pedagogy-and-taste.md`.
- **Evidence with honesty.** Real citations, quotable lines, and a caveat held in the facilitation notes so a sharp room cannot puncture the claim.

Full detail: `references/00-method.md` (arc and section anatomy) and `references/03-pedagogy-and-taste.md`.

---

## The hard rules (never violate, full list in `references/04-writing-rules.md`)

- **No em-dashes and no en-dashes.** Use periods, colons, commas, parentheses, "is". This includes time ranges: "0 to 12 min", never "0-12" written with a dash.
- **Author and source names are artifact-dependent.** Participant-facing surfaces (worksheets, slides) carry no names; it is Shiva's synthesis. The facilitator's teaching doc may carry citations, but only inside dedicated framework and evidence cards and a sources block, never across the spoken script. The script keeps names as light verbal garnish.
- **No stylish or GPT-cloud language.** Say it plainly.
- **Helper and hint text are complete sentences** a casual reader understands.
- **Flag uncertain terminology.** Label a coinage as a coinage.
- **Validate diagrams and render-verify the HTML** before declaring done: `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>`.

---

## Tooling

- **HTML:** `cp "$SKILL_DIR/assets/teaching-doc-template.html" .`, adapt content, keep the editorial house style and the collapsible color-coded block taxonomy. Invoke the frontend-design skill for the aesthetic. Verify with `bash "$SKILL_DIR/scripts/render_check.sh" <file.html>` (headless Chrome, reports page count and fill). Read the PNG before sending.
- **Diagrams:** build before/after structures as Mermaid. Validate with the Mermaid MCP (`mcp__claude_ai_Mermaid_Chart__validate_and_render_mermaid_diagram`) before embedding. If it is down, harden the syntax to forms that validated earlier and rely on the render-verify.
- **Research:** see `references/02-research-protocol.md` for the parallel source batch and the research-subagent pattern.

---

## References (load on demand)

- `references/00-method.md` is the full method: target shape, the scaled-spine arc, section anatomy, the revision recap.
- `references/01-intake-questions.md` is the Stage 1 discovery question set.
- `references/02-research-protocol.md` is the parallel research playbook, exact tools, the research-subagent brief, synthesis and provenance and caveats.
- `references/03-pedagogy-and-taste.md` is the pedagogy laws, the micro-exercise patterns, evidence cards, diagrams.
- `references/04-writing-rules.md` is the hard writing rules and the author-name nuance.
- `references/05-build-html.md` is the interactive HTML house style and the render-verify loop.
- `assets/teaching-doc-template.html` is the HTML skeleton with the block taxonomy.
- `scripts/render_check.sh` is the headless render check.

---

## After shipping (optional)

When a session is finalized, offer to: capture any new content frame into the wiki, save the files to the relevant project folder, and prepare the verified video and Readwise quote pack (real clips with in and out timestamps, plus verbatim lines).
