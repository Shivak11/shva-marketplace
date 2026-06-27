# 02 - Extraction by source type (Stages 2 and 3)

This is principle 1 in operation, and it is where a generic approach fails. The source type, not the topic, picks the extraction prompt. Classify first, then extract. One prompt cannot serve all three, because an upload and a voice note carry opposite kinds of evidence.

The test that you have done this right: your UPLOAD prompt and your REFLECTIVE prompt should be impossible to swap. If swapping them would change nothing, you have flattened the principle and the read will be wrong.

---

## Stage 2: classify every input

Sort each input into exactly one bucket before extracting:

- **Upload.** A document the person consumed but did not author: a PDF, an article, a slide deck, a saved link, a book. Evidence of an act (they engaged with this), not of a belief.
- **Reflective.** First-person content the person authored about their own life or thinking: a voice note, a journal entry, a personal message, a post, a talk transcript. The words are the person's own, so the content is the signal.
- **Transactional.** Logistics with no reflective content: a grocery list, a calendar admin note, an address, a reminder to pay a bill. Stored for recall, tagged out of profiling.

When an input is mixed (a journal entry that ends with a grocery list), split it: the reflective part goes to reflective extraction, the list is tagged transactional.

---

## Stage 3: run the matching prompt, append to the log

Each extraction appends to the append-only signal log. Never dedup. A repeat is appended again, because frequency is signal (see `00-method.md`).

### Prompt A: UPLOAD to behavioral signal

> You are reading a document the person CONSUMED, not wrote. Do not extract the document's claims as the person's beliefs, values, or facts. The only thing you know is that this person engaged with material on a topic. Emit exactly one behavioral signal in the form: "engaged with material on <topic>", plus the date if known. Topic should be a short noun phrase (for example "genai", "stoic philosophy", "supply chain logistics"). Do NOT record the document's arguments, conclusions, or quotes as belonging to the person. If the document reveals nothing beyond the topic engaged with, that is the complete and correct output. One upload, one behavioral signal.

Hard constraint: an upload never produces a "the person believes X" or "the person values Y" signal. The interest is only inferred later, in Stage 4, when many upload signals point the same way (five engagements with genai material across a month is an interest signal; one is not).

### Prompt B: REFLECTIVE to content signal

> You are reading first-person content the person AUTHORED about their own life or thinking. The words are their own, so the content is the signal. Extract the substantive signals, each anchored to a verbatim quote from the text. For each signal capture: (a) the quote, verbatim, (b) what kind of signal it is (a recurring topic, a stated value, a stated feeling or mood, a stated goal, a tension between two things they said), and (c) the date if known. Do not interpret yet and do not assign any score. Stay close to the words. If they say it plainly, log it plainly. If they circle a theme without naming it, log the theme and quote the circling. Preserve repetition: if they say the same thing three times, log three signals, because frequency is the point.

Hard constraint: every reflective signal carries a verbatim quote. A signal you cannot quote does not get logged. No scoring at this stage: this is capture, not judgement.

### Prompt C: TRANSACTIONAL to quarantine

> You are reading logistics with no reflective content. Store it for recall, but tag it so it is excluded from profiling. Emit the item with a quarantine tag (for example tag: transactional). Do not extract any value, interest, mood, or trait from it. A grocery list is a grocery list. Nothing is deleted, nothing reaches the profile.

Hard constraint: transactional content is tagged, not deleted (recall is preserved) and never profiled (the read stays clean).

---

## What the signal log looks like after Stage 3

A flat, append-only list. Each entry knows its source type and, for reflective signals, carries its quote. For example:

- reflective | quote: "I keep telling people I want a calm year and then I sign up for the next big thing" | tension | 2026-06-01
- reflective | quote: "I want a calm year" | stated value | 2026-06-09
- upload | engaged with material on genai | 2026-06-10
- upload | engaged with material on genai | 2026-06-14
- transactional | tag: transactional | milk, dal, onions | 2026-06-14
- reflective | quote: "honestly the only time I feel switched on is when something is on fire" | stated feeling | 2026-06-15

Note: the calm theme appears twice and the genai engagement appears twice. The log keeps both copies. Stage 4 reads recurrence off exactly this.
