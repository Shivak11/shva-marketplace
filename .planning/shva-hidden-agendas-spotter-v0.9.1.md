# SHVA Hidden Agendas Spotter v0.9.1

## Objective

Add a discoverable SHVA skill surfaced as **Hidden Agendas Spotter**. It should analyse the reality beneath presented claims, images, rituals, partnerships, metrics, and behaviour, including reciprocal arrangements where actors certify each other.

## Scope

- Add `shva/skills/read-hidden-agendas/SKILL.md`.
- Add the historical and methodological reference.
- Present the skill in `/shva:help` as `/shva:read-hidden-agendas` with the label **Hidden Agendas Spotter**.
- Update plugin and marketplace metadata to v0.9.1.
- Update both marketplace and plugin READMEs with usage and release notes.
- Preserve automatic skill discovery and existing skills unchanged.

## Behavioural invariants

- Analyse functions, incentives, apparatus, reciprocal credibility, audiences, proof substitution, cost-bearing behaviour, counterfactuals, and recurrence.
- Do not infer private motives as facts.
- Distinguish observed evidence, strong inference, plausible reading, and speculation.
- Treat humour/cartoon compression as a final step after analysis.
- Do not name phenomena merely to manufacture originality.

## Verification

- Parse all edited JSON files.
- Validate skill YAML frontmatter and name.
- Confirm no unfinished placeholders.
- Confirm help and README invocation strings resolve to the added folder.
- Inspect the complete Git diff and staging set before commit.
