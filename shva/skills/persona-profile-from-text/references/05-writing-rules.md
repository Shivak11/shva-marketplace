# 05 - Writing rules and safety rules

The hard rules apply to every profile, both modes, and every file this skill writes. The safety rules exist because a profile touches a private layer of a person, and a wrong or careless read does real harm.

---

## The hard writing rules (never violate)

- **No em-dashes and no en-dashes.** Use periods, colons, commas, parentheses. This includes ranges: write "two to three threads", never "two-three" with a dash.
- **Never print a trait score, a percentile, or a type code.** No "neuroticism" with a number, no "high openness" as a label, no type-code badges. The frameworks are a reasoning lens only (see `03-framework-lens.md`). Output quoted, qualitative observations.
- **Never display the confidence number.** Confidence gates whether an observation surfaces. The figure stays internal. If a qualitative band is needed, use words (tentative, well-supported), never a number.
- **Never diagnose.** No clinical labels (avoidant, narcissist, anxious as a verdict). A surprising read is an invitation to reflect, gated on strong evidence, framed as a question.
- **Every observation carries a quote.** If you cannot quote the source line, you cannot make the claim. No unquoted reads.
- **Plain language.** Simple Indian-English in mirror mode. No stylish or cloud-language phrasing in either mode. Say it plainly.
- **Helper and hint text are complete sentences** a casual reader understands.
- **Flag any coinage.** If you invent a term, mark it as a coinage. Do not present a made-up label as established.
- **Run the lint before declaring done:** `bash "$SKILL_DIR/scripts/lint.sh" <file...>` over every file you wrote. It must print CLEAN.

---

## Mirror-mode tone laws (Rehearsal cardinal rule, hard)

Rehearsal's objective is engagement, the habit of self-recording, not improvement or coaching or prep. The mirror exists to pull the next recording.

- **Mirror, not coach.** Reflect the person's own topics and words back. Never grade, never give a "here is how to improve" read, never assess skill.
- **The only thing the output chases is the next recording.** Every mirror profile ends by reflecting one live thread back and inviting a recording on it.
- **Invite, do not demand.** "Want to", "if you feel like it". Never "you must", "you need to", "you should".
- **No invented personality labels, no FOMO, no streak-shaming.**
- **Simple Indian-English.** Short sentences. The person should feel met, not measured.

---

## Safety and consent rules

- **Consent for profiling is a higher tier than consent for fact-memory.** Do not build a profile without explicit profiling consent confirmed at intake (see `01-intake-questions.md` and `00-method.md`). If only fact-memory consent exists, stop at facts.
- **Consent is per-use.** Any new use of a profile beyond what was agreed (sharing it, feeding it into another system, using it for outreach it was not gathered for) needs fresh consent for that specific use.
- **A surprise must clear the confidence gate before it is shown.** Roughly 0.6 and above, held internally. Below that, hold it back. A wrong surprise costs more trust than a missed one is worth.
- **Quarantine, do not profile, transactional content.** Grocery lists and logistics are tagged out of the read. Nothing transactional reaches the profile.
- **Profile over the append-only signal log, never a deduped store.** Dedup erases frequency, and frequency is the signal.
- **When in doubt, say less.** A thinner profile that the person trusts beats a fuller one that names something false. If the evidence is weak, leave it out.
