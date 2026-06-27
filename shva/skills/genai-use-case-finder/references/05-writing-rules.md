# 05 - Writing rules (hard, non-negotiable)

These apply to every artifact this skill produces: the portfolio, the 2x2, the worksheet, and any HTML.

## The hard rules

- No em-dashes and no en-dashes anywhere. Use periods, colons, commas, parentheses, or the word "to" for ranges. Write "0 to 5", never a dashed range. Grep the artifact for the em-dash and en-dash glyphs before declaring it done. The `scripts/lint.sh` check enforces exactly this.
- No stylish or GPT-cloud language. Say it plainly. Drop cute parallelism. "Separating execution from judgment" beats a clever turn of phrase.
- Hints and helper text are complete sentences a casual reader understands, not terse fragments.
- Add a short plain description of what a thing is before diving into it.
- Flag any coinage as a coinage. If you invent a label for something, say once that it is your label and name the established term if there is one.

## The author-name rule (different from the sibling skills, do not get this wrong)

This skill produces an ANALYSIS artifact, not a participant-facing worksheet. So the flat "no names anywhere" rule from worksheet-generator does NOT apply here. Citing the underlying books (Power and Prediction, The Goal, Reengineering the Corporation, Thinking in Systems, and so on) is allowed in the method reference and in the analysis rationale, because a leader reading this portfolio benefits from knowing where a claim comes from.

But author names are garnish, not the spine. The portfolio's value is the filled matrix for the real organization, not a reading list. Keep citations light and to the rationale. Do not open every row with an author's name. If you stripped every name, the analysis should still stand on its own logic.

This is why `scripts/lint.sh` here bans only the dash glyphs and does NOT ban author names: the author-name ban from the sibling skills was deliberately removed for this analysis skill.

## Check before done

Run `bash scripts/lint.sh` over every markdown and HTML file you wrote. Confirm it prints CLEAN. Confirm every coined term is flagged. Confirm the artifact fills the matrix for a real organization and has not drifted into teaching the method.
