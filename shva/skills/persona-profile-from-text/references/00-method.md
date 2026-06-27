# 00 - Method spine

This skill builds a self-knowledge profile from a person's own text. The whole method rests on four principles from Shiva's design note. Read them as constraints, not suggestions. A generic "profile this person" approach violates all four and is wrong.

---

## The four principles

### 1. Source-type-specific extraction

One extraction prompt cannot serve every input. The source type decides how the content is read, before you look at the topic.

- A document **upload** emits a lightweight behavioral signal only: the act plus the topic, for example "engaged with material on genai". The content of the document does NOT become a personal fact about the person. Someone reading a paper on a subject is not stating a belief about it. The interest emerges only in aggregate, when many uploads point the same way.
- **Reflective first-person content** (voice notes, journals, posts) is the opposite. Here the content itself is the signal. The person is speaking in their own voice about their own life, so the words go through content extraction.
- **Transactional content** (grocery lists, admin, logistics) is neither. It is quarantined (principle 4).

Branch by source type at ingest. The three prompts live in `02-extraction-by-source-type.md`.

### 2. Frameworks are a reasoning lens, never displayed output

You may use validated frameworks to organize the reasoning: Big Five (OCEAN), Schwartz basic values, and affect. They help you ask better questions of the text. But you never print a trait score, a percentile, or a type code.

The reason is honest measurement. Text-to-trait inference has weak test-retest reliability. A number like a neuroticism score read off someone's journal is fabricated precision: it looks exact, it is not, and it is a trust liability (the Cambridge and Apply Magic Sauce lineage learned this publicly). The framework name and the value type also stay off the page. The output is an evidence-anchored qualitative observation that quotes the actual source note. The transform from lens to observation is in `03-framework-lens.md`.

### 3. Surprise is a question, not a verdict

The most valuable reads reveal something the person has not noticed: a tension between what they say and what they do, a theme they keep circling, a blind spot. These are also the most dangerous, because a wrong or preachy read destroys trust in a reflective app instantly.

So a surprising read is double-gated:

- It surfaces only when the evidence is strong (the confidence gate, roughly 0.6 and above, kept internal and never displayed).
- It is framed as an invitation to reflect, never as a diagnosis. "You say you want calm, yet your notes keep chasing the next big thing, what is that about" is an invitation. "You are avoidant" is a verdict. Never write the verdict.

### 4. Quarantine transactional noise, do not delete it

Grocery lists, admin, and logistics still get stored, because the person may want to recall them. But they are tagged so they are excluded from profiling. Nothing is lost, and the profile stays clean. Deleting would lose recall; profiling over the noise would pollute the read. Tagging does both jobs.

---

## The append-only signal log (why frequency is signal)

Profiling synthesis runs over an append-only signal log, never over a deduped recall store.

A recall store dedups: it keeps one copy of each fact so lookup stays clean. That is correct for recall and wrong for profiling, because dedup throws away frequency, and frequency is the strongest signal you have. The topic a person returns to five times across five weeks matters far more than the one they mentioned once. If you profile over a deduped store, both look identical, and you have erased the single most important pattern.

So the signal log is append-only. Every signal, including a repeat of a signal already logged, is appended. When you synthesize in Stages 4 and 5, you count and weight by recurrence. "You keep coming back to whether the work matters to anyone" is a claim you can only make from an append-only log.

This pairs with the wiki note on deduplicating memory losing frequency. Keep the recall store and the signal log as two separate things.

---

## Consent is a higher tier

Consent for psychological profiling is a higher tier than consent for plain fact-memory.

Storing that a person likes filter coffee is fact-memory. Inferring what they value, fear, or keep avoiding from their voice notes is profiling, and it touches a more private layer. So:

- Profiling needs its own explicit consent, confirmed at intake (`01-intake-questions.md`), separate from any consent to store facts.
- In voice-harvest mode, the text is public, but the use still needs to be stated: profiling a public leader's voice for outreach is a different act from profiling a Rehearsal user for their own reflection. Name the use.
- Any new use of an existing profile (sharing it, feeding it elsewhere, using it for outreach it was not gathered for) needs fresh consent for that specific use. Consent is per-use, not once-forever.

If consent for profiling is not clearly given, stop at fact-memory and do not build the profile.
