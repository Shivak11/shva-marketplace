# 03 - Output format (Stages 3 and 4)

The deliverable is one source pack: candidates re-indexed by session beat for this brief, plus a short recommendation of the skills that should anchor the course. Keep it lean. Three or four strong items per needed beat, not a dump.

## The pack: one block per session beat

Write a block only for the beats the brief asked for in Stage 1. Drop beats with no good fit rather than padding them.

Each beat is a short header plus its items. Each item is one line:

```
### Hands-On Lab (run live in session)

- [Source name](link) - why this, here: one complete sentence on why this source fits this beat for this audience. Posture: install / watch.
- [Source name](link) - why this, here: ... Posture: install / watch.

### Opening Hook (cold open)

- [Source name](link) - why this, here: ... Posture: watch.
```

Rules for each item:

- **Name and link.** Author names and tool names are fine here. This is a source list, not a participant artifact.
- **"Why this, here" is mandatory and specific.** It names the beat and the audience, not just the topic. "Good for marketers" is weak. "For the marketing cohort, this makes the AI-in-your-function point concrete in 10 minutes because they install and run it on their own copy" is right. One complete sentence. No line, no item.
- **Posture is explicit.** Mark install (participants run it) or watch (facilitator demos it). Default to install when friction is low. Senior audiences trend toward watch.
- **Re-staging flags.** If an item assumes self-paced use but the brief is a live cohort, say what would need re-staging.
- **Provenance when it helps.** Note web finds as un-vetted live results. Curated wiki-map items can be left unmarked.

## The anchor-skills recommendation (Stage 4)

After the beat blocks, add one short block: the 4 to 6 skills that should anchor the course, one per session. This operationalizes "skills as the unit of teaching": the course is built around chosen skills, each anchoring a session, rather than around abstract topics.

```
## Anchor skills for this course (4 to 6, one per session)

1. [Skill name](link) - anchors a session on <topic>, because <one sentence>.
2. ...
```

Pick for coverage, not just quality: aim for a spread across the relevant tool families and audience functions (for example one prompting foundation, one domain-specific skill for the cohort's function, one governance or production-grade skill, one creative or workflow skill). Note where a custom or Rehearsal-specific skill would fit if one is wanted.

## Close with the handoff

End the pack by naming the boundary and the next step plainly:

> This is the source pack. It assembles raw material. It does not design the session. To turn this into a session plan, teaching script, or interactive HTML, hand off to the teaching-designer skill (shva:teaching-designer), which takes a pack like this and builds the session.

Then offer the after-shipping options from SKILL.md: tag strong new finds `mdp-example` in Raindrop, save the pack to the project folder, or hand off to teaching-designer now.
