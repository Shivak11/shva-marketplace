---
name: search-books
description: >-
  Search the books Dr. Shiva Kakkar actually owns and has uploaded, using the
  shivas-book-search MCP server (Gemini file search). Answers from the owned
  corpus with book-level citations instead of from training memory or the open
  web. Use when he asks what a book says about something, wants a passage or
  mechanism located, wants a claim checked against a source he owns, is
  assembling teaching material and needs the primary text, or asks whether he
  already owns a book on a topic. Triggers on "what does <book> say about",
  "search my books", "find in my library", "which of my books covers", "do I
  have anything on", "pull the passage on", "cite from my library". This skill
  reads the owned shelf only. It does NOT evaluate books he has not read or
  decide whether a new book is worth buying: hand that to book-taste-curator.
---

# Search Books

The owned shelf, searchable. This skill answers from books Shiva has actually uploaded, so an answer can be cited and trusted. Anything not in the store is out of scope for this skill.

## Boundary

| Question | Skill |
|---|---|
| What does a book I own say about X? | This skill |
| Which of my books covers X? | This skill |
| Do I already own something on X? | This skill |
| Should I read X, is X worth it? | book-taste-curator |
| What should I read about X? | book-taste-curator |
| Mine X for prompt vocabulary | book-taste-curator, after this skill retrieves the passages |

When a search here returns nothing on a topic, say so plainly and offer the handoff. An empty shelf is a real answer, not a failure.

## Server

Tools come from the `shivas-book-search` MCP server, which must already be configured in the user's own MCP settings. This skill never carries credentials, store identifiers, or endpoint URLs. If the tools are absent, say the server is not connected and stop. Do not substitute web search and present the result as if it came from the library.

Tools used: `list_stores`, `list_books`, `search_book`, `search_store`, `list_chapters`.

## Load order

1. Read `references/library-map.md` for what is on the shelf and how to route a topic to a store.
2. Read `references/query-protocol.md` before the first tool call. It carries the call sequence and the known failure modes.

## Workflow

1. **Always call `list_stores` first.** Never hardcode a store identifier. Store names carry a generated suffix that changes when a store is rebuilt, and the shelf changes as books are added. The live call is the only reliable map.
2. **Route by `display_name`, not by the identifier.** Match the topic to a store using `references/library-map.md`. If two stores plausibly hold the answer, search both and say which one answered.
3. **Pick the tool by how specific the question is.**
   - A named book: `search_book`. This is the precision path and the default.
   - A topic with no named book: `search_store` on the routed store, then follow up with `search_book` on whichever title the answer leans on.
   - "What do I own on X": `list_books` across stores. No search needed.
4. **Read the answer critically before relaying it.** The server returns a composed answer, not raw passages. Treat it as a research assistant's summary that still needs checking: if it states something as the book's claim, the claim should be traceable to a named chapter or a quoted line. Where it is not, say the attribution is loose.
5. **Cite at book and chapter level.** Name the book and, when the answer gives one, the chapter. Do not invent page numbers. See `references/query-protocol.md` for what the citation payload actually contains.
6. **Answer the question asked.** Do not summarize the book.

## Voice rules

Inherit the house rules from book-taste-curator and apply them here:

- Lead with the answer, not with what you searched.
- No italics. Font weight only.
- No closing sermon, no "what I did" summary, no pre-announcement of length.
- No "insights", "game-changing", "must-read", "paradigm-shifting".
- Assume a PhD-level OB researcher who teaches this material. Never explain what a framework is. Explain what the book actually says and what it lets him teach.
- When the corpus and his memory of a book disagree, quote the corpus and name the discrepancy. Do not smooth it over.

## Extraction handoff

When the retrieved passage is going to become a session, a prompt, or a Rehearsal feature, apply the conversion test from the wiki's reading constitution before extracting: ask whether converting the passage will enlarge it or shrink it. If conversion would shrink it, retrieve it and leave it unspent. Say so in one line.

For the full extraction workflow, structural commands and style commands, hand off to book-taste-curator's Extraction mode with the retrieved passages in hand.

## Quality control before sending

- `list_stores` was called live in this session; no identifier was assumed
- The store that answered is named
- Every claim attributed to a book came from a tool result in this session, not from memory of the book
- Duplicate titles across stores were resolved, and the near-miss pair in `references/library-map.md` was not confused
- A topic absent from the shelf was reported as absent, with the handoff offered
- No page numbers were invented
