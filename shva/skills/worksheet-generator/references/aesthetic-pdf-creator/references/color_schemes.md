# Color Schemes Reference

Pre-defined color palettes for professional PDF documents.

## Corporate Blue (Default)
Best for: Business documents, reports, proposals

```python
PRIMARY = "#1a237e"      # Deep indigo
SECONDARY = "#0d47a1"    # Royal blue
ACCENT = "#ff6f00"       # Vibrant orange
ACCENT2 = "#00acc1"      # Teal
ACCENT3 = "#ffc107"      # Gold
DARK_BG = "#0a1628"      # Cover background
```

## Professional Dark
Best for: Tech documents, modern reports

```python
PRIMARY = "#0f0f23"      # Dark navy
SECONDARY = "#1a1a3e"    # Purple-blue
ACCENT = "#ff6b6b"       # Coral
ACCENT2 = "#4ecdc4"      # Teal
ACCENT3 = "#ffe66d"      # Yellow gold
```

## Modern Green
Best for: Sustainability, finance, nature-related

```python
PRIMARY = "#1b5e20"      # Forest green
SECONDARY = "#2e7d32"    # Medium green
ACCENT = "#ff9800"       # Amber
ACCENT2 = "#00bcd4"      # Cyan
ACCENT3 = "#ffeb3b"      # Yellow
```

## Elegant Purple
Best for: Creative, luxury, events

```python
PRIMARY = "#4a148c"      # Deep purple
SECONDARY = "#6a1b9a"    # Purple
ACCENT = "#ff4081"       # Pink
ACCENT2 = "#00e5ff"      # Cyan
ACCENT3 = "#ffea00"      # Yellow
```

## Warm Red
Best for: Bold statements, alerts, important docs

```python
PRIMARY = "#b71c1c"      # Deep red
SECONDARY = "#c62828"    # Red
ACCENT = "#ff6f00"       # Orange
ACCENT2 = "#00acc1"      # Teal
ACCENT3 = "#ffd600"      # Gold
```

## Custom Color Scheme

Create your own:

```python
my_colors = {
    'PRIMARY': HexColor("#your_color"),
    'SECONDARY': HexColor("#your_color"),
    'ACCENT': HexColor("#your_color"),
    'ACCENT2': HexColor("#your_color"),
    'ACCENT3': HexColor("#your_color"),
    'DARK_BG': HexColor("#your_color"),
    'TEXT_DARK': HexColor("#1a2332"),
    'TEXT_MED': HexColor("#4a5568"),
    'TEXT_LIGHT': HexColor("#8896a6"),
    'LIGHT_GRAY': HexColor("#e0e4e8"),
}

builder = AestheticPDFBuilder("output.pdf", my_colors)
```

## Color Usage Guidelines

| Color | Usage |
|-------|-------|
| PRIMARY | Headers, titles, table headers, page bars |
| SECONDARY | Subheadings, secondary elements |
| ACCENT | Highlights, important text, CTAs |
| ACCENT2 | Decorative elements, secondary highlights |
| ACCENT3 | Boxes, badges, special callouts |
| DARK_BG | Cover page background |
| TEXT_DARK | Body text |
| TEXT_MED | Secondary text, labels |
| TEXT_LIGHT | Captions, footer text |
| LIGHT_GRAY | Borders, dividers, table lines |
