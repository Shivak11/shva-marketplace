# 7-Beat Long-Form Template

Adapted from `shva-linkedin-post-writer`'s 4-layer structure, extended for Medium-grade long-form (~1500-2000 words).

The template is descriptive of how the 4 essays in `src/data/blog/*.md` are actually built, not prescriptive in a rigid way. Word counts are targets, not constraints — flex ±30% as the essay needs.

## The Spine

```
[TL;DR (60-90 words, plain text, no formatting)]
---
[Beat 1] Lived opening               100-150 words
[Beat 2] Visible category             200-300 words
[Beat 3] Hidden category              300-400 words
       └─ ★ Pull-quote (~30% mark)    ~30 words
[Beat 5] Consequences                 400-500 words
[Beat 6] Personal anchor              100-200 words
[Beat 7] Open close                    50-100 words
---
[Optional sources line]
---
[Author bio — verbatim from medium-bio-template.md]
```

Total: ~1500-2000 words.

## TL;DR (Top of post)

4-6 sentences of plain text, no markdown formatting. Capture the post's thesis, the surprising claim, and the consequence. Reader should decide whether to read on within 8 seconds.

**Example** (from `india-ai-readiness-tier-2-problem.md`):

> **TL;DR:** Minister Vaishnaw told the IMF their Tier 2 ranking for India is wrong. He's right—but not how he thinks. The problem isn't infrastructure or talent. It's that Indians won't pay for AI. ChatGPT made just $3.6M from 29 million Indian downloads. The same people who won't spend ₹400 on ChatGPT happily pay ₹500 for Zomato Gold. Every successful Indian SaaS—Freshworks, Zoho—makes money selling to Americans, not Indians. We produce AI talent for export and consume AI products for free. That's not Tier 2. That's optimizing ourselves out of the race entirely.

Note: TL;DR is the only place where short-declarative-stacks are okay. The body should let ideas unfold.

## Beat 1 — Lived Opening (100-150 words)

A concrete observation, paradox in current discourse, or a category mismatch you've noticed. **No press release ledes.** No "Recently, OpenAI announced ..." Open with the deeper signal, not the news event.

Three valid opening forms:

1. **Stat trinity** — three converging research findings (Stanford + Harvard + Carnegie Mellon all found X). Builds credibility fast.
2. **Lived observation** — "At Davos last week, India's IT Minister told the IMF ..." → followed by the deeper signal.
3. **Paradox statement** — "If expertise equals advantage, then AI should amplify that advantage. Instead, the relationship is inverted."

The opening should make the reader feel that *something is off* about the conventional framing.

## Beat 2 — The Visible Category (200-300 words)

What most people call this thing. Name the existing frame **fairly** — don't strawman. The reader should recognize themselves in this section.

- State the conventional framing in 1-2 sentences
- Cite the canonical sources / commentators / institutions that hold this frame
- Acknowledge what's right about it (this is what makes the correction land)

This is the "wide shot" before the zoom-in.

## Beat 3 — The Hidden Category (300-400 words)

The category correction. What's actually happening underneath. **This is the spine — the rest of the essay services this beat.**

- Use one theory deeply if needed (Curse of Knowledge, Constraint Migration, Process-Identity Fusion). Don't stack theories.
- Define the construct through consequences ("X means that managers must now ...") not abstract genealogy
- One named expert max — too many citations dilute authorship

## Beat 4 — Pull-Quote Blockquote (~30% mark)

The sharpest claim of the essay, formatted as:

```markdown
> **A single, declarative sentence that captures the essay's category correction. Use no more than 30 words.**
```

**One per essay — never two.** Pull-quotes used twice look like a Twitter thread, not an essay.

Place at roughly the 30% word mark — after Beat 3 has built the case but before Beat 5 unfolds the consequences.

**Examples** (from the 4 reference essays):

- *"If expertise equals advantage, then AI should amplify that advantage. Instead, the relationship is inverted. Your decades of experience have become the very thing holding you back."*
- *"ChatGPT made $3.6 million from 29 million downloads in India. That's roughly ₹12 per download."*

## Beat 5 — Consequences (400-500 words)

What this means for design, judgment, workflow, evidence, accountability. **This is where the essay earns its 1500 words.** Concrete examples, lived implications, second-order effects.

- One worked example minimum (a specific scenario, named org, concrete decision)
- Identify what flips: what was true under the old frame and is now false
- Surface one tension or trade-off (essays without tension feel preachy)
- Optional: a 2x2 framework or a table — but only if it earns its place

## Beat 6 — Personal Anchor (100-200 words)

A skin-in-the-game disclosure. First-person observation grounding the abstract in lived work.

**This is where Gradeless and Rehearsal get mentioned in-body**, with link to `https://tryrehearsal.ai`.

Template phrasing:

> "This is the design problem we sit with every day at [Gradeless](https://tryrehearsal.ai). When we built [Rehearsal](https://tryrehearsal.ai) — capsule learning for managers, delivered as 15-minute interactive courses — the question wasn't ... It was: ..."

> "This is, incidentally, the same calculation we faced building [Rehearsal](https://tryrehearsal.ai) at [Gradeless](https://tryrehearsal.ai). ... We optimized accordingly."

The personal anchor must connect to the essay's thesis — not just a Gradeless plug. The reader should think *"Of course Shiva would have wrestled with this — he runs the thing."*

## Beat 7 — Open Close (50-100 words)

End with **consequence statement OR forward-looking question.** Never a summary. Never "In conclusion."

Two valid closings:

1. **Consequence claim** — "That's not Tier 2. That's something the IMF doesn't have a category for: a country that produces AI talent for export and consumes AI products for free. We're not behind in the race. We've optimized ourselves out of it entirely."
2. **Forward-looking question** — "If Indians won't pay for the AI tools that will determine their economic future, who exactly is all this 'AI talent' building for?"

## Footer Order

```
---

*Sources: [optional one-liner with research citations]*

---

**About the author**

[bio v1.0 verbatim from medium-bio-template.md]
```

## Self-Audit Checklist (Apply Before Output)

- [ ] TL;DR present, 60-90 words, plain text
- [ ] Beat 1 opens with a lived observation, not a press release lede
- [ ] Beat 3 contains the category correction explicitly
- [ ] Exactly ONE pull-quote blockquote, at ~30% mark, ≤30 words
- [ ] Beat 5 contains a concrete worked example
- [ ] Beat 6 mentions Gradeless + Rehearsal, both linked to tryrehearsal.ai
- [ ] Beat 7 is a consequence claim OR an open question — no summary
- [ ] Author bio footer is appended verbatim from medium-bio-template.md
- [ ] Total word count between 1200-2200
