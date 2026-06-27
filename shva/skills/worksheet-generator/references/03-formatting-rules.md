# Stage 4 — The Hard Formatting Rules (non-negotiable)

These are Shiva's standing rules. He has corrected each repeatedly. A single leak reads as "didn't
listen." Run the lint (`scripts/lint.sh`) before declaring any draft done.

## On the participant-facing sheet

1. **No author or source names. Anywhere.** No "Goldratt / Agrawal / Gans / Goldfarb / Choudary /
   Power and Prediction / Reshuffle / Two-Lens Method / Wardley / Shirky". The frameworks are HIS
   combination. Sources stay in your private notes only.
2. **No em-dashes (—) and no en-dashes (–).** He reads them as "GPT-cloud language". Use periods,
   colons, commas, parentheses, or the word "is". (Hyphens in "90-day" are fine.)
3. **No stylish / cute parallelism.** Say it plainly. Not "one half is the machine's, one half is
   yours" → "separating prediction from judgment".
4. **Hints are complete sentences in parentheses**, written for a casual reader: *"(These are the
   people, positions, or roles who would resist this change.)"* Not terse fragments.
5. **Add a short plain description** of what each thing is about before diving in.
6. **"Be Mindful!"** (with the exclamation) is the standing name for the think-about-it panel, never
   "The trap". It teaches *how to think* via a small analogy or worked mini-example.
7. **The companion GPT is the "Decision Decomposer GPT"** pattern (rename per topic if it interrogates
   a non-decision unit), never "Socratic GPT".
8. **Boxes are proportional to the ask.** A "draw a 5–9 step workflow" prompt gets a large drawing
   area; a "one decision in a sentence" gets 2–3 lines. **Never shrink a writing box to hit a page
   count.** If content overruns, cut content or add a page, not box height.
9. **Every field is self-contained:** real-question label + complete-sentence helper + box + faint
   `Example:` line. The Example uses the one worked case threaded through the sheet.
10. **Signature block has real signing space** (blank gap above the line, label below).

## The lint (run it)

```bash
bash "$SKILL_DIR/scripts/lint.sh" <worksheet.html or build_worksheet.py> [companion-gpt.md ...]
```

It greps for em/en-dashes and the banned author/source names across every file you pass and exits
non-zero on a hit. Expected output: `CLEAN`.

## Voice

Plain, explanatory Indian-English. Calm and direct. The worksheet should read like a thoughtful
colleague set it, not a chatbot. When in doubt, load `shiva-teaching-designer` for voice and the wiki
page `maps/shiva-persona-and-taste.md`.
