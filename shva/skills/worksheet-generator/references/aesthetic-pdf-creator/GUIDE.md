---
name: aesthetic-pdf-creator
description: Create beautiful, professional PDF documents with proper formatting, no text overlapping, and consistent styling. Use this skill when asked to create PDFs, event documents, reports, brochures, proposals, presentations, certificates, or any professional document. Handles multi-page layouts, tables, color schemes, headers/footers, cover pages, and avoids common ReportLab pitfalls like br tag issues that cause text overlap.
---

# Aesthetic PDF Creator

Create professional, visually appealing PDFs using ReportLab with proper text handling.

## Critical Rules - Avoid Text Overlap

**NEVER use `<br/>` tags in Paragraph elements** - they cause text overlap in ReportLab.

```python
# ❌ WRONG - causes text overlap
story.append(Paragraph("Title<br/>Subtitle", style))

# ✅ CORRECT - separate paragraphs for each line
story.append(Paragraph("Title", title_style))
story.append(Paragraph("Subtitle", subtitle_style))
```

**For boxed multi-line content, use Tables:**

```python
# ✅ Multi-line box using Table
data = [
    [Paragraph("GRAND CHAMPION", label_style)],
    [Paragraph("Winner Name 2025", title_style)]
]
box = Table(data, colWidths=[5*inch])
box.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), HexColor("#fffde7")),
    ('BOX', (0,0), (-1,-1), 2, HexColor("#ffc107")),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (0,0), 12),
    ('BOTTOMPADDING', (-1,-1), (-1,-1), 12),
]))
story.append(box)
```

## Style Rules

Always set `leading` (line height) greater than `fontSize`:

```python
ParagraphStyle('Body',
    fontSize=10,
    leading=14,       # Must be > fontSize (1.3-1.5x recommended)
    spaceAfter=8,     # Vertical space after paragraph
    spaceBefore=0     # Vertical space before paragraph
)
```

## Quick Reference

| Element | Method |
|---------|--------|
| Page title + subtitle | Two separate Paragraph() elements |
| Multi-line box | Table with rows, styled with BOX |
| Bullet lists | Separate Paragraph per item with leftIndent |
| Dividers | HRFlowable() |
| Section spacing | Spacer(1, height) |
| Page breaks | PageBreak() |

## Implementation

Use the template script at `scripts/pdf_template.py` which provides:
- Cover page with decorative elements
- Styled page backgrounds with headers/footers
- Pre-configured color schemes
- Table generators for common patterns
- Proper style definitions

Run: `python scripts/pdf_template.py` to generate example output.

## Color Schemes

See `references/color_schemes.md` for predefined professional color palettes.
