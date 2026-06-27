---
name: persona-profile-from-text
description: >-
  Use when Shiva wants a mirror profile of a person built only from their own
  text: voice notes, journals, transcripts, posts, document uploads. Produces an
  evidence-anchored, qualitative profile of who the person is (recurring
  interests, stated values, what they keep circling back to, stated-versus-revealed
  tensions), where every observation quotes the actual source lines. Never prints
  trait scores, percentiles, or type codes. Two modes. Mirror mode reflects a
  Rehearsal user's own recorded content back to them to deepen self-fascination
  and pull the next recording (engagement, not coaching). Voice-harvest mode
  profiles a target leader from public text to understand their voice and
  concerns (voice-harvest, not size-scoring). Triggers on "profile from
  transcripts", "mirror profile", "voice-harvest", "what does this person care
  about", "profile this person from their notes", "reflect my recordings back to
  me", "read this leader's voice".
---

# Persona Profile from Text

Build a **mirror profile** of one person from their own words: what they keep returning to, what they say they value, where the words they choose quietly disagree with the life they describe. Every line of the output quotes the actual source. This is a mirror held up to a person, not a verdict passed on them.

The method comes from Shiva's design note (the bundled copy is `references/00-method.md`; the canonical note is in the wiki at `_raw/2026-06-22-psychological-profiling-from-text-design.md`). It has two named use modes, set in STEP 0.

**Golden rule: questions, not verdicts. Frameworks are a lens, never a score.** You may reason with validated frameworks (Big Five, Schwartz values, affect) to organize your thinking, but you never print a trait name, a number, a percentile, or a type code. A surprising read is offered as an invitation to reflect, never as a diagnosis. A false or preachy read is the fastest way to lose the person's trust.

**Paths:** when this skill loads, its base directory is announced. Capture it as `$SKILL_DIR` and use it for bundled files. Reads of `references/*.md` may use bare relative paths, but Bash runs must use the absolute base (the runtime CWD is the user's project, not this skill): `SKILL_DIR="<announced base directory>"`, then `bash "$SKILL_DIR/scripts/lint.sh" <file...>`.

---

## STEP 0: Which mode (decide first)

Produce a profile in exactly ONE mode per request.

- **Mirror mode.** The text belongs to a Rehearsal user and the profile is shown back to that same person. The purpose is engagement: reflect their own topics and words so they feel seen and record again. Simple Indian-English, warm, inviting. Never grade, never coach, never tell them how to improve. Default when the person is profiling themselves.
- **Voice-harvest mode.** The text belongs to a target leader (public posts, talks, articles) and the profile is read by Shiva or a sales or content team. The purpose is to understand that leader's voice and their stated concerns so outreach can speak in their register. This is voice-harvest, not size-scoring: it captures how they sound and what they worry about, not how big or important they are.

If the mode is not obvious from the brief, ask in Stage 1 before extracting.

---

## The pipeline (6 stages, in order)

| # | Stage | What happens | Gate |
|---|---|---|---|
| 1 | **Intake and consent** | Confirm the mode, whose text it is, what source types were provided, and the consent tier. | Read `references/01-intake-questions.md`. Use AskUserQuestion. Consent is a gate, not a formality. |
| 2 | **Ingest and classify source type** | Sort every input into upload, reflective, or transactional. The source type decides the extraction, not the topic. | Read `references/02-extraction-by-source-type.md`. |
| 3 | **Extract to a signal log** | Run the source-type-specific extraction. Append every signal to an append-only log. Tag transactional noise out. Never dedup. | Read `references/02-extraction-by-source-type.md`. |
| 4 | **Reason through the framework lens** | Use OCEAN, Schwartz, and affect to organize the reasoning over the log. Turn each read into a quoted, source-cited observation. | Read `references/03-framework-lens.md`. Lens stays internal. |
| 5 | **Confidence-gate the surprises** | Keep only well-supported reads. Surface a stated-versus-revealed tension or a blind spot only as an invitation, and only when the evidence is strong. | Read `references/03-framework-lens.md`. |
| 6 | **Compose the mirror output** | Write the profile in the mode's template: quotes first, observations second, invitations last. | Read `references/04-output-format.md` and `references/05-writing-rules.md`. |

Synthesis in Stages 4 and 5 always runs over the append-only signal log from Stage 3, never over a deduped store. Dedup removes repetition, and repetition is the signal: the thing a person says five times matters more than the thing they say once.

---

## What "good" looks like (design backward from this)

- **Every observation carries its own quote.** No claim about the person stands without a line from their own text under it. If you cannot quote it, you cannot say it.
- **Source type decided the extraction.** A single uploaded PDF became one behavioral signal ("engaged with material on genai"), not a list of beliefs. An interest only appears once many uploads point the same way. A voice note became a content signal because the words are the person's own.
- **The framework never shows.** The reasoning used a values lens or an affect lens, but the page says "you keep returning to whether your work matters to anyone", not a value type or a score.
- **Surprises are questions.** A tension between what the person says they want and what their notes chase is offered as "you say you want calm, yet your notes keep chasing the next big thing, what is that about", never as a label for the person.
- **Mirror mode pulls the next recording.** The profile ends by reflecting one live thread back and inviting the person to record on it, not by ranking them or telling them to improve.
- **The profile stays clean.** Grocery lists and logistics were stored for recall but tagged out of profiling, so nothing was lost and nothing transactional leaked into the read.

---

## The hard rules (never violate, full list in `references/05-writing-rules.md`)

- **No em-dashes and no en-dashes.** Use periods, colons, commas, parentheses.
- **Never print a trait score, a percentile, or a type code.** Text-to-trait inference is unreliable, and a number like a neuroticism score is fabricated precision and a trust liability. Output quoted, qualitative observations.
- **Never diagnose.** A surprising read is an invitation to reflect, gated on strong evidence, never a verdict about the person.
- **Never display the confidence number.** The threshold decides whether an invitation surfaces. The number stays internal. Band it in words if needed (tentative versus well-supported), never as a figure.
- **Mirror mode never coaches.** No grading, no "here is how to improve", no FOMO, no invented personality labels. Reflect, invite, do not demand. Simple Indian-English.
- **Plain language, complete-sentence helper text, flag any coinage.**
- **Run the lint before declaring done:** `bash "$SKILL_DIR/scripts/lint.sh" <file...>`.

---

## Tooling

Possible inputs, in rough order of richness:

- **Voice-note exports.** Voicenotes (`mcp__voicenotes-cloudflare__voicenotes_list_recordings`, `voicenotes_search`, `voicenotes_get_recording`) and Plaud (`mcp__plaud-cloudflare__plaud_list_files` / `mcp__plaud-local__plaud_list_files`, `plaud_get_file_data`). These are reflective first-person content: the words are the signal.
- **Pasted text.** Journals, transcripts, message dumps the person hands over directly.
- **Files.** Uploaded documents (PDFs, slides, notes). Treat each as a behavioral signal by default (see principle 1), not as a list of the person's beliefs.
- **Public posts** for voice-harvest mode: a leader's LinkedIn, articles, talk transcripts. Reflective in form (first person), so they go through content extraction, but read for voice and concern, not for private fact.

Classify every input by source type at ingest (Stage 2) before any extraction. The source type, not the topic, picks the prompt.

---

## References (load on demand)

- `references/00-method.md` is the method spine: the four principles, the append-only signal log and why frequency is signal, and the consent tiers.
- `references/01-intake-questions.md` is the Stage 1 question set, including the consent gate.
- `references/02-extraction-by-source-type.md` is the branching extraction with the three actual prompts (upload, reflective, transactional).
- `references/03-framework-lens.md` is how to use OCEAN, Schwartz, and affect as a reasoning lens without printing scores, plus the confidence gate.
- `references/04-output-format.md` is the two output templates (mirror and voice-harvest) and the verdict-to-question rewrite table.
- `references/05-writing-rules.md` is the hard writing rules and the safety and consent rules.
- `scripts/lint.sh` is the deterministic banned-string check.

---

## After shipping (optional)

When a profile is delivered, offer to:

- **Append to the signal log.** Each new voice note or post is one more signal. Offer to add it to the person's append-only log so the next profile is richer. Never overwrite or dedup the log.
- **Reconfirm consent on any new use.** Profiling consent is a higher tier than plain fact-memory consent. If the person now wants the profile used for something they did not agree to in Stage 1 (shared with a third party, used for outreach, fed into another system), stop and get fresh consent for that specific use before proceeding.
