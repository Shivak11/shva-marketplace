# SHVA Meditate v0.9.0 Implementation Plan

Status: approved by user request on 2026-08-22
Authority: this committed plan is the implementation specification

## Objective

Add `/shva:meditate` as Shiva's first-party reflection and judgment skill, release SHVA plugin v0.9.0, publish the source to GitHub, and update the installed skill for Codex, Cursor, and Claude Code.

## Locked product decisions

1. Add the new skill; do not replace or modify the independently installed upstream `meditation` skill.
2. Skill folder and frontmatter name: `meditate`, yielding the plugin invocation `/shva:meditate`.
3. Support three modes:
   - `artifact`: inspect a draft, interface, lesson, decision, or other concrete work.
   - `session`: consolidate what happened through Review, Relate, Reinforce, Record, Resolve.
   - `taste`: compare preferences across surfaces without collapsing their medium-specific adapters.
4. Embed the five-question **Aliveness Review** inside the workflow:
   - What is the particular bet here?
   - Where is the charge, and what contains it?
   - What proves this is real?
   - What have I over-explained?
   - Would I recognise this with the logo removed?
5. Treat `charged specificity` as a working hypothesis. Require a counterexample or falsifier check before promoting it as a durable rule.
6. Preserve a strict private boundary: private desire may be a contrast instrument, never an automatic explanation of professional taste; never generalize about women; never move private material into public or core doctrine without Shiva's explicit approval.
7. No automatic wiki writes. The skill may propose a record and destination, but must obtain explicit authorization before writing or promoting anything.
8. End every run with one named insight, confidence/provenance, one counterexample or unresolved tension, one next experiment, and an explicit record/no-record verdict.

## File ownership

Orchestrator owns all shared release surfaces and commits:

- `.planning/shva-meditate-v0.9.0.md`
- `.claude-plugin/marketplace.json`
- `shva/.claude-plugin/plugin.json`
- `README.md`
- `shva/README.md`
- `shva/commands/help.md`

Skill builder owns only:

- `shva/skills/meditate/SKILL.md`
- `shva/skills/meditate/references/aliveness-review.md`
- `shva/skills/meditate/agents/openai.yaml`

All agents must stat owned files before writing. If any owned file appears or its mtime advances unexpectedly, immediately copy it and its diff to `/private/tmp/shva-meditate-collision/`, stop, and report the collision. Do not revert foreign work.

## Release updates

- Bump marketplace and plugin manifests from `0.8.8` to `0.9.0`.
- Add a concise v0.9.0 description to both manifests.
- Update root README version table, plugin README release section, and `/shva:help` command list/examples.
- Do not hand-edit any user-level marketplace registry merely to refresh Codex; use the supported plugin/skill installer flows after source validation.

## Verification gates

1. Skill frontmatter contains only `name` and `description` and passes `quick_validate.py`.
2. `agents/openai.yaml` names `$meditate` in its default prompt.
3. Both JSON manifests parse and report exactly `0.9.0`.
4. Help and both READMEs name `/shva:meditate` and describe all three modes.
5. Search gate confirms all five Aliveness Review questions are present exactly once in the reusable reference.
6. Search gate confirms privacy, counterexample, and explicit-write-authorization rules exist.
7. Forward-test the skill with a fresh agent on an artifact-oriented prompt; verify from the returned output, not the agent's completion claim.
8. Commit the verified source and audit staged files against full git status.
9. GitHub push is the publication boundary. Do not push until the required Super-outer publication approval is present.
10. After push, update/install the `meditate` skill for Codex, Cursor, and Claude Code; then verify the installed files and versions from disk.

## Non-goals

- No automatic Obsidian promotion, QMD refresh, or private-vault transfer.
- No Dream runner integration in v0.9.0.
- No change to the upstream `meditation` installation.
- No standalone `aliveness-review` skill until the module has been tested across writing, product/interface, and teaching contexts.
