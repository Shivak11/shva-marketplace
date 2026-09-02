# Query Protocol

Tool sequence, argument shapes, and the failure modes observed when this skill was built.

## Call sequence

1. `list_stores` with no arguments. Returns every store with `display_name`, `book_count`, and the full book list. This is the map. Call it first, every time.
2. Route to a store using `references/library-map.md`.
3. Then one of:
   - `search_book` with `store_name`, `book_name`, `query`. The precision path. `book_name` is the title as it appears in the `list_stores` book list.
   - `search_store` with `store_name`, `query`. Use when no single book is named.
   - `list_books` with `store_name`. Use for "what do I own on X".
4. `list_chapters` with `store_name`, `book_slug`. Rarely useful. See below.

## Argument shapes

`store_name` is the full generated identifier from `list_stores`, not the display name. Copy it from the live result. `book_name` in `search_book` is the display title. `book_slug` in `list_chapters` is the slugged form, which `search_book` returns in its `book` object.

## Known failure modes

**Chapter titles are placeholders.** `list_chapters` returns "Chapter 1", "Chapter 2" and so on, with no real titles. It is useless for topic navigation and for finding where a subject lives. Use it only to learn how many chapters a book has or to check `image_count`. Never present these numbers to the reader as if they were chapter names.

**`document_count` is zero on every store.** The stores hold books, not loose documents. A zero document count does not mean the store is empty. Read `book_count` instead.

**The `sources` array can come back empty.** A `search_book` result may return a well-composed answer with an empty `sources` array while carrying opaque citation tokens inline in the answer text. Those tokens are not page numbers and not chapter names, and they do not resolve to anything the reader can open. Do not print them. Do not convert them into page citations. Cite the book, and the chapter only when the answer states one in plain form.

**The answer is composed, not quoted.** The server returns a synthesized answer rather than raw retrieved passages. It is a strong summary, but it is a second-hand account of the book. When the question turns on exact wording, say that the wording is the server's rather than the author's, and if the exact phrasing matters, ask a narrower query to surface the line itself.

**`full_results_uri` is returned but is not a fetchable link.** Ignore it unless a tool exists in the session that can resolve it.

## Verification standard

Every claim attributed to a book must come from a tool result in this session. Recognising a book from training data is not retrieval. If the corpus and memory disagree, the corpus wins and the disagreement gets named.

When a search returns nothing useful, try one reformulation with the book's own vocabulary rather than the question's vocabulary. If that also fails, report the absence. Do not fill the gap from memory of the book.
