# 00 - Method: the session-beat index and the inversion

This is the thinking behind the skill. Read it before re-indexing (Stage 3).

## The inversion (the whole point)

Raindrop, GitHub, and a browser bookmark bar all index sources by **what something is**: a repo, a tool, an article, a video. In a teaching context that is the wrong axis. What a teacher actually needs to know is **when they reach for it in a session**: is this the lab participants run in their terminal, the cold-open hook, the case to dissect, the 90-second "look at this" demo, the pre-read, or the curriculum shape to borrow?

So this skill inverts the index. The pedagogical question ("what session beat is this for?") sits in front of the topical question ("what is this about?"). The same source moves between beats depending on the brief. OpenWork is a live demo for a CXO audience that only needs to see AI act, and a hands-on lab for a cohort with laptops open. The beat is a property of the brief, not of the source.

## The session-beat taxonomy

Sort every candidate into these beats. A source can appear under more than one beat if it genuinely serves both, but say why each time.

1. **Hands-On Lab (run live in session).** Repos, skills, or tools participants can clone, install, or try in a browser during the workshop. The strongest GenAI sessions move out of slides and into the participant's terminal within 20 minutes. The cleanest lab vehicle is a Claude Code skill: install, invoke, watch it work, leave with a runnable artifact.
2. **Opening Hook (cold open).** A demo, clip, or story that opens a session before the topic is named. Often a tool acting on real work (the "AI does the job, it does not just answer" moment).
3. **Case Study (dissect together).** A worked example, a company story, a contrast pair (for example one system against another) the room can analyze.
4. **Live Demo (show, do not tell).** A 90-second "look at what this can do" moment. The facilitator drives. Participants watch. Use when a hands-on lab would cost too much session time or the audience is too senior to type.
5. **Pre-Read or Post-Read (before or after).** Articles and longer pieces participants read on their own, outside session time.
6. **Course Scaffold To Borrow (structure, not content).** A curriculum shape, module-and-deliverable architecture, or participant-experience template to riff off when designing the MDP itself. Borrow the skeleton, not the content.

The wiki map at `maps/mdp-course-source-router.md` carries example items under each of these. Treat those as illustrations of the shape, not as the skill's answer. The answer is assembled live for the brief in hand.

## Skills as the unit of teaching

A pattern runs through what gets saved most: **the skill is the pedagogical primitive of AI-native teaching**, the way the case is the primitive of HBS-style teaching. A skill is the smallest piece of GenAI capability that can be installed, demonstrated, modified, and retained inside a single 90-minute session.

The design move that follows: build a course around 4 to 6 carefully chosen skills, and let each one anchor a session, rather than building around abstract topics and hunting for demos to fit. The skill picks the topic, not the other way around. Stage 4 of this skill names those anchor skills for the brief.

Skills also split by audience. Domain-specific skills (marketing, PM, finance, HR, research) make the "AI in your function" point concrete in 10 minutes for a functional cohort. General skills (prompting tutorials, spec-driven-development skills) suit a mixed or leadership audience.

## The open-source tool-suite framing

A recurring classroom signal: participants respond to AI **acting on real work**, not merely answering prompts. The strong MDP framing is not "prompt engineering". It is "AI Workflows With Open-Source Tools" or "Build Your First AI Coworker Stack". The tool families to draw demos and labs from:

| Tool family | What it shows | Demo posture |
|---|---|---|
| AI coworker / desktop agent | AI as a work-doing colleague, not a chatbot | Show file, browser, and code actions with a visible trace |
| Workflow orchestration | From a prompt to a governed workflow | Build a real HR, compliance, or sales flow live |
| Private enterprise assistant | Private ChatGPT for teams with documents and governance | Upload policy docs, show RAG, roles, model switching |
| RAG / document intelligence | Source-grounded answers for document-heavy functions | Show grounded answers and refusal when evidence is missing |
| Browser agents | Agents operating real web workflows | Show research, form-filling, scraping, or an application task |
| Skills as course primitive | Installable capability blocks for participants | Install, modify, and run one skill in-session |
| AI-native education systems | AI-mediated teaching for FDP or education MDPs | Show AI classmates, course generation, learning-quest building |

Match the family to the audience maturity. Start a session with the coworker or demo beat (AI acting), then graduate into orchestration tools as the cohort matures.

## The useful tensions (carry these into every pack)

- **MDP-tagged vs MDP-useful.** Only a handful of bookmarks are explicitly tagged `mdp`, but the actually-useful material is scattered across 40-plus items. The wiki map does the work the tag should have done. This is why Stage 2 queries by adjacent tags and keywords, not by the `mdp` tag alone, and why the after-shipping step offers to tag strong new finds `mdp-example`.
- **Cohort vs self-paced.** Most repos assume self-paced learning. For a cohort MDP, session-time pedagogy matters as much as the artifact. Flag items that would need re-staging for live cohort use.
- **Show vs make.** Every session has a real choice: do participants watch a demo or install a skill themselves? Default to make when the friction is low (with these particular repos it usually is). Mark the posture on every item.
