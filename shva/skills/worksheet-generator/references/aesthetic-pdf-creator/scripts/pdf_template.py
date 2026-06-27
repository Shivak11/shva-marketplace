#!/usr/bin/env python3
"""
Aesthetic PDF Creator Template
Professional PDF generation with ReportLab - No text overlap guaranteed

Usage:
    1. Import this module and use the helper functions
    2. Or copy/adapt the patterns for your specific needs
    
Key Features:
    - Pre-defined color schemes
    - Cover page generator
    - Styled page backgrounds
    - Table generators
    - Proper paragraph styles (no overlap)
"""

from reportlab.lib.pagesizes import A4, LETTER
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Flowable
)
from reportlab.pdfgen import canvas
from reportlab.platypus.flowables import HRFlowable

# ============================================================================
# COLOR SCHEMES - Pick one or create your own
# ============================================================================

COLOR_SCHEMES = {
    'corporate_blue': {
        'PRIMARY': HexColor("#1a237e"),      # Deep indigo
        'SECONDARY': HexColor("#0d47a1"),    # Royal blue
        'ACCENT': HexColor("#ff6f00"),       # Vibrant orange
        'ACCENT2': HexColor("#00acc1"),      # Teal
        'ACCENT3': HexColor("#ffc107"),      # Gold
        'DARK_BG': HexColor("#0a1628"),      # Dark background
        'TEXT_DARK': HexColor("#1a2332"),
        'TEXT_MED': HexColor("#4a5568"),
        'TEXT_LIGHT': HexColor("#8896a6"),
        'LIGHT_GRAY': HexColor("#e0e4e8"),
    },
    'professional_dark': {
        'PRIMARY': HexColor("#0f0f23"),
        'SECONDARY': HexColor("#1a1a3e"),
        'ACCENT': HexColor("#ff6b6b"),
        'ACCENT2': HexColor("#4ecdc4"),
        'ACCENT3': HexColor("#ffe66d"),
        'DARK_BG': HexColor("#0f0f23"),
        'TEXT_DARK': HexColor("#1e293b"),
        'TEXT_MED': HexColor("#475569"),
        'TEXT_LIGHT': HexColor("#94a3b8"),
        'LIGHT_GRAY': HexColor("#e2e8f0"),
    },
    'modern_green': {
        'PRIMARY': HexColor("#1b5e20"),
        'SECONDARY': HexColor("#2e7d32"),
        'ACCENT': HexColor("#ff9800"),
        'ACCENT2': HexColor("#00bcd4"),
        'ACCENT3': HexColor("#ffeb3b"),
        'DARK_BG': HexColor("#0d2818"),
        'TEXT_DARK': HexColor("#1a2e1a"),
        'TEXT_MED': HexColor("#4a5d4a"),
        'TEXT_LIGHT': HexColor("#7a8a7a"),
        'LIGHT_GRAY': HexColor("#e0e8e0"),
    },
    'elegant_purple': {
        'PRIMARY': HexColor("#4a148c"),
        'SECONDARY': HexColor("#6a1b9a"),
        'ACCENT': HexColor("#ff4081"),
        'ACCENT2': HexColor("#00e5ff"),
        'ACCENT3': HexColor("#ffea00"),
        'DARK_BG': HexColor("#1a0a28"),
        'TEXT_DARK': HexColor("#2a1a3a"),
        'TEXT_MED': HexColor("#5a4a6a"),
        'TEXT_LIGHT': HexColor("#8a7a9a"),
        'LIGHT_GRAY': HexColor("#e8e0f0"),
    },
    'warm_red': {
        'PRIMARY': HexColor("#b71c1c"),
        'SECONDARY': HexColor("#c62828"),
        'ACCENT': HexColor("#ff6f00"),
        'ACCENT2': HexColor("#00acc1"),
        'ACCENT3': HexColor("#ffd600"),
        'DARK_BG': HexColor("#1a0a0a"),
        'TEXT_DARK': HexColor("#2a1a1a"),
        'TEXT_MED': HexColor("#5a4a4a"),
        'TEXT_LIGHT': HexColor("#8a7a7a"),
        'LIGHT_GRAY': HexColor("#f0e0e0"),
    }
}

# ============================================================================
# PAGE DIMENSIONS
# ============================================================================

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 0.6 * inch

# ============================================================================
# STYLE CREATOR - Generates all paragraph styles with proper leading
# ============================================================================

def create_styles(colors):
    """
    Create paragraph styles with proper leading to prevent text overlap.
    
    Args:
        colors: Dictionary with color definitions
        
    Returns:
        Dictionary of ParagraphStyle objects
    """
    styles = {}
    
    # Page titles - ALWAYS use separate paragraphs for title + subtitle
    styles['PageTitle'] = ParagraphStyle(
        'PageTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors['PRIMARY'],
        alignment=TA_CENTER,
        spaceAfter=4,
        spaceBefore=0,
        leading=26  # 1.3x fontSize
    )
    
    styles['PageSubtitle'] = ParagraphStyle(
        'PageSubtitle',
        fontName='Helvetica',
        fontSize=11,
        textColor=colors['TEXT_MED'],
        alignment=TA_CENTER,
        spaceAfter=15,
        spaceBefore=0,
        leading=15
    )
    
    # Section headers
    styles['SectionHead'] = ParagraphStyle(
        'SectionHead',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors['PRIMARY'],
        alignment=TA_LEFT,
        spaceAfter=10,
        spaceBefore=16,
        leading=18
    )
    
    styles['SubSectionHead'] = ParagraphStyle(
        'SubSectionHead',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors['SECONDARY'],
        alignment=TA_LEFT,
        spaceAfter=6,
        spaceBefore=12,
        leading=14
    )
    
    # Body text
    styles['Body'] = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=10,
        textColor=colors['TEXT_DARK'],
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        spaceBefore=0,
        leading=14
    )
    
    styles['BodyCenter'] = ParagraphStyle(
        'BodyCenter',
        fontName='Helvetica',
        fontSize=10,
        textColor=colors['TEXT_DARK'],
        alignment=TA_CENTER,
        spaceAfter=8,
        spaceBefore=0,
        leading=14
    )
    
    # Bullet items
    styles['BulletItem'] = ParagraphStyle(
        'BulletItem',
        fontName='Helvetica',
        fontSize=9,
        textColor=colors['TEXT_DARK'],
        alignment=TA_LEFT,
        leftIndent=15,
        spaceAfter=4,
        spaceBefore=0,
        leading=13
    )
    
    # Labels and small text
    styles['SmallLabel'] = ParagraphStyle(
        'SmallLabel',
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=colors['TEXT_MED'],
        alignment=TA_LEFT,
        spaceAfter=4,
        spaceBefore=10,
        leading=11
    )
    
    # Highlight/accent text
    styles['Highlight'] = ParagraphStyle(
        'Highlight',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors['ACCENT'],
        alignment=TA_LEFT,
        spaceAfter=8,
        spaceBefore=6,
        leading=14
    )
    
    # Table styles
    styles['TableHead'] = ParagraphStyle(
        'TableHead',
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=white,
        alignment=TA_CENTER,
        leading=12
    )
    
    styles['TableCell'] = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=9,
        textColor=colors['TEXT_DARK'],
        alignment=TA_LEFT,
        leading=12
    )
    
    styles['TableCellCenter'] = ParagraphStyle(
        'TableCellCenter',
        fontName='Helvetica',
        fontSize=9,
        textColor=colors['TEXT_DARK'],
        alignment=TA_CENTER,
        leading=12
    )
    
    # Quote/callout
    styles['Quote'] = ParagraphStyle(
        'Quote',
        fontName='Helvetica-Oblique',
        fontSize=11,
        textColor=colors['TEXT_MED'],
        alignment=TA_CENTER,
        spaceAfter=15,
        spaceBefore=10,
        leftIndent=30,
        rightIndent=30,
        leading=15
    )
    
    # Footer
    styles['Footer'] = ParagraphStyle(
        'Footer',
        fontName='Helvetica',
        fontSize=8,
        textColor=colors['TEXT_LIGHT'],
        alignment=TA_CENTER,
        spaceBefore=8,
        spaceAfter=0,
        leading=11
    )
    
    # Prize/Award box labels
    styles['PrizeLabel'] = ParagraphStyle(
        'PrizeLabel',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors['ACCENT'],
        alignment=TA_CENTER,
        spaceAfter=4,
        spaceBefore=0,
        leading=18
    )
    
    styles['PrizeTitle'] = ParagraphStyle(
        'PrizeTitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors['PRIMARY'],
        alignment=TA_CENTER,
        spaceAfter=0,
        spaceBefore=0,
        leading=22
    )
    
    return styles

# ============================================================================
# DIVIDERS
# ============================================================================

def create_divider(color=None):
    """Create a simple horizontal divider"""
    if color is None:
        color = HexColor("#e0e4e8")
    return HRFlowable(width="100%", thickness=1, color=color, 
                      spaceBefore=12, spaceAfter=12)

def create_accent_divider(color=None):
    """Create a short centered accent divider"""
    if color is None:
        color = HexColor("#ff6f00")
    return HRFlowable(width="25%", thickness=2, color=color, 
                      spaceBefore=8, spaceAfter=15, hAlign='CENTER')

# ============================================================================
# TABLE GENERATORS
# ============================================================================

def create_data_table(data, col_widths, header_color, styles):
    """
    Create a styled data table.
    
    Args:
        data: List of lists (first row is header)
        col_widths: List of column widths
        header_color: HexColor for header background
        styles: Styles dictionary
        
    Returns:
        Table flowable
    """
    # Convert string data to Paragraphs
    formatted_data = []
    for row_idx, row in enumerate(data):
        formatted_row = []
        for cell in row:
            if row_idx == 0:
                formatted_row.append(Paragraph(f"<b>{cell}</b>", styles['TableHead']))
            else:
                formatted_row.append(Paragraph(str(cell), styles['TableCell']))
        formatted_data.append(formatted_row)
    
    table = Table(formatted_data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor("#e0e0e0")),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, HexColor("#f8f9fa")]),
    ]))
    return table

def create_highlight_box(lines, styles, bg_color=None, border_color=None):
    """
    Create a highlighted box with multiple lines - NO BR TAGS.
    
    Args:
        lines: List of tuples [(text, style_name), ...]
        styles: Styles dictionary
        bg_color: Background color (default: light yellow)
        border_color: Border color (default: gold)
        
    Returns:
        Table flowable styled as a box
    """
    if bg_color is None:
        bg_color = HexColor("#fffde7")
    if border_color is None:
        border_color = HexColor("#ffc107")
    
    data = []
    for text, style_name in lines:
        data.append([Paragraph(text, styles[style_name])])
    
    table = Table(data, colWidths=[5.2*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_color),
        ('BOX', (0, 0), (-1, -1), 2, border_color),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (0, 0), 15),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 15),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ]))
    return table

# ============================================================================
# PAGE BACKGROUND GENERATORS
# ============================================================================

def create_cover_page_function(colors, title, subtitle, org_name=None, tagline=None):
    """
    Create a cover page drawing function.
    
    Args:
        colors: Color scheme dictionary
        title: Main title text
        subtitle: Subtitle text
        org_name: Organization name (optional)
        tagline: Tagline text (optional)
        
    Returns:
        Function to draw cover page
    """
    def draw_cover(canvas, doc):
        canvas.saveState()
        
        # Background
        canvas.setFillColor(colors['DARK_BG'])
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
        
        # Decorative circles
        canvas.setFillColor(colors['ACCENT'])
        canvas.setFillAlpha(0.15)
        canvas.circle(PAGE_WIDTH + 80, PAGE_HEIGHT - 150, 250, fill=1, stroke=0)
        
        canvas.setFillColor(colors['ACCENT2'])
        canvas.setFillAlpha(0.12)
        canvas.circle(-100, 200, 280, fill=1, stroke=0)
        
        canvas.setFillAlpha(1.0)
        
        # Accent lines
        canvas.setStrokeColor(colors['ACCENT'])
        canvas.setLineWidth(4)
        canvas.line(60, PAGE_HEIGHT - 100, 180, PAGE_HEIGHT - 100)
        
        canvas.setStrokeColor(colors['ACCENT2'])
        canvas.line(PAGE_WIDTH - 180, 100, PAGE_WIDTH - 60, 100)
        
        # Organization name
        if org_name:
            canvas.setFillColor(colors['ACCENT'])
            canvas.setFont("Helvetica-Bold", 12)
            canvas.drawCentredString(PAGE_WIDTH/2, PAGE_HEIGHT - 200, org_name.upper())
            
            canvas.setFillColor(colors['TEXT_LIGHT'])
            canvas.setFont("Helvetica", 10)
            canvas.drawCentredString(PAGE_WIDTH/2, PAGE_HEIGHT - 218, "presents")
        
        # Main title
        title_y = PAGE_HEIGHT - 300 if org_name else PAGE_HEIGHT - 250
        canvas.setFillColor(white)
        canvas.setFont("Helvetica-Bold", 42)
        canvas.drawCentredString(PAGE_WIDTH/2, title_y, title)
        
        # Subtitle
        if subtitle:
            canvas.setFillColor(colors['ACCENT'])
            canvas.setFont("Helvetica-Bold", 42)
            canvas.drawCentredString(PAGE_WIDTH/2, title_y - 50, subtitle)
        
        # Tagline box
        if tagline:
            box_width = 360
            box_height = 40
            box_x = (PAGE_WIDTH - box_width) / 2
            box_y = title_y - 150
            
            canvas.setFillColor(HexColor("#162447"))
            canvas.roundRect(box_x, box_y, box_width, box_height, 6, fill=1, stroke=0)
            
            canvas.setStrokeColor(colors['ACCENT2'])
            canvas.setLineWidth(1.5)
            canvas.roundRect(box_x, box_y, box_width, box_height, 6, fill=0, stroke=1)
            
            canvas.setFillColor(white)
            canvas.setFont("Helvetica-Bold", 10)
            canvas.drawCentredString(PAGE_WIDTH/2, box_y + 14, tagline)
        
        # Bottom bar
        canvas.setFillColor(HexColor("#1a2744"))
        canvas.rect(0, 0, PAGE_WIDTH, 80, fill=1, stroke=0)
        
        canvas.setStrokeColor(colors['ACCENT'])
        canvas.setLineWidth(2)
        canvas.line(0, 80, PAGE_WIDTH, 80)
        
        canvas.restoreState()
    
    return draw_cover

def create_page_background_function(colors, header_left="", header_right=""):
    """
    Create a page background drawing function.
    
    Args:
        colors: Color scheme dictionary
        header_left: Left header text
        header_right: Right header text
        
    Returns:
        Function to draw page background
    """
    def draw_background(canvas, doc):
        canvas.saveState()
        
        # Top bar
        canvas.setFillColor(colors['PRIMARY'])
        canvas.rect(0, PAGE_HEIGHT - 32, PAGE_WIDTH, 32, fill=1, stroke=0)
        
        # Accent line
        canvas.setFillColor(colors['ACCENT'])
        canvas.rect(0, PAGE_HEIGHT - 34, PAGE_WIDTH, 2, fill=1, stroke=0)
        
        # Bottom bar
        canvas.setFillColor(colors['PRIMARY'])
        canvas.rect(0, 0, PAGE_WIDTH, 26, fill=1, stroke=0)
        
        # Page number
        canvas.setFillColor(white)
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(PAGE_WIDTH/2, 9, f"Page {doc.page}")
        
        # Header text
        canvas.setFillColor(HexColor("#b0bec5"))
        canvas.setFont("Helvetica", 8)
        if header_left:
            canvas.drawString(MARGIN, PAGE_HEIGHT - 22, header_left)
        if header_right:
            canvas.drawRightString(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 22, header_right)
        
        canvas.restoreState()
    
    return draw_background

# ============================================================================
# DOCUMENT BUILDER
# ============================================================================

class AestheticPDFBuilder:
    """
    High-level PDF builder with aesthetic styling.
    
    Example:
        builder = AestheticPDFBuilder("output.pdf", "corporate_blue")
        builder.set_cover("My Document", "Subtitle", org_name="Company")
        builder.add_title("Section 1", "Introduction")
        builder.add_body("This is the content...")
        builder.add_bullet_list(["Point 1", "Point 2"])
        builder.build()
    """
    
    def __init__(self, output_path, color_scheme='corporate_blue', pagesize=A4):
        """
        Initialize the PDF builder.
        
        Args:
            output_path: Path to output PDF file
            color_scheme: Name of color scheme or custom colors dict
            pagesize: Page size (A4, LETTER, etc.)
        """
        self.output_path = output_path
        self.pagesize = pagesize
        
        if isinstance(color_scheme, str):
            self.colors = COLOR_SCHEMES.get(color_scheme, COLOR_SCHEMES['corporate_blue'])
        else:
            self.colors = color_scheme
        
        self.styles = create_styles(self.colors)
        self.story = []
        self.cover_func = None
        self.page_func = None
        self.header_left = ""
        self.header_right = ""
    
    def set_cover(self, title, subtitle="", org_name=None, tagline=None):
        """Set cover page content"""
        self.cover_func = create_cover_page_function(
            self.colors, title, subtitle, org_name, tagline
        )
        # Add spacer for cover page
        self.story.append(Spacer(1, PAGE_HEIGHT - 2*inch))
        self.story.append(PageBreak())
    
    def set_headers(self, left="", right=""):
        """Set page header text"""
        self.header_left = left
        self.header_right = right
        self.page_func = create_page_background_function(
            self.colors, left, right
        )
    
    def add_title(self, title, subtitle=""):
        """Add page title (and optional subtitle as SEPARATE paragraphs)"""
        self.story.append(Paragraph(title, self.styles['PageTitle']))
        if subtitle:
            self.story.append(Paragraph(subtitle, self.styles['PageSubtitle']))
        self.story.append(create_accent_divider(self.colors['ACCENT']))
    
    def add_section(self, title):
        """Add section header"""
        self.story.append(Paragraph(title, self.styles['SectionHead']))
    
    def add_subsection(self, title):
        """Add subsection header"""
        self.story.append(Paragraph(title, self.styles['SubSectionHead']))
    
    def add_body(self, text):
        """Add body paragraph"""
        self.story.append(Paragraph(text, self.styles['Body']))
    
    def add_centered(self, text):
        """Add centered text"""
        self.story.append(Paragraph(text, self.styles['BodyCenter']))
    
    def add_quote(self, text):
        """Add styled quote"""
        self.story.append(Paragraph(f'"{text}"', self.styles['Quote']))
    
    def add_bullet_list(self, items, prefix="•"):
        """Add bullet list (each item as separate paragraph)"""
        for item in items:
            self.story.append(Paragraph(f"{prefix} {item}", self.styles['BulletItem']))
    
    def add_numbered_list(self, items):
        """Add numbered list"""
        for i, item in enumerate(items, 1):
            self.story.append(Paragraph(f"{i}. {item}", self.styles['BulletItem']))
    
    def add_highlight(self, text):
        """Add highlighted/accent text"""
        self.story.append(Paragraph(text, self.styles['Highlight']))
    
    def add_table(self, data, col_widths, header_color=None):
        """Add data table"""
        if header_color is None:
            header_color = self.colors['PRIMARY']
        self.story.append(create_data_table(data, col_widths, header_color, self.styles))
    
    def add_highlight_box(self, lines):
        """
        Add highlighted box with multiple lines.
        
        Args:
            lines: List of tuples [(text, style_name), ...]
        """
        self.story.append(create_highlight_box(lines, self.styles, 
                         self.colors.get('LIGHT_BG', HexColor("#fffde7")),
                         self.colors['ACCENT3']))
    
    def add_divider(self):
        """Add horizontal divider"""
        self.story.append(create_divider(self.colors['LIGHT_GRAY']))
    
    def add_spacer(self, height=12):
        """Add vertical space"""
        self.story.append(Spacer(1, height))
    
    def add_page_break(self):
        """Add page break"""
        self.story.append(PageBreak())
    
    def add_footer_text(self, *lines):
        """Add footer text (each line as separate paragraph)"""
        for line in lines:
            self.story.append(Paragraph(line, self.styles['Footer']))
    
    def build(self):
        """Build and save the PDF"""
        doc = SimpleDocTemplate(
            self.output_path,
            pagesize=self.pagesize,
            rightMargin=MARGIN,
            leftMargin=MARGIN,
            topMargin=MARGIN + 0.3*inch,
            bottomMargin=MARGIN + 0.2*inch
        )
        
        first_page = self.cover_func if self.cover_func else self.page_func
        later_pages = self.page_func if self.page_func else (lambda c, d: None)
        
        if first_page:
            doc.build(self.story, onFirstPage=first_page, onLaterPages=later_pages)
        else:
            doc.build(self.story)
        
        return self.output_path


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Create a sample document
    builder = AestheticPDFBuilder("/tmp/example_aesthetic.pdf", "corporate_blue")
    
    # Cover page
    builder.set_cover(
        title="Sample",
        subtitle="Document",
        org_name="Your Organization",
        tagline="Professional PDF Generation with Python"
    )
    
    # Set headers
    builder.set_headers("Your Organization", "Sample Document")
    
    # Page 1: Introduction
    builder.add_title("Introduction", "Getting Started with Aesthetic PDFs")
    
    builder.add_body(
        "This document demonstrates the aesthetic PDF creator template. "
        "It provides beautiful, professional styling with proper text handling "
        "that prevents common issues like text overlap."
    )
    
    builder.add_quote("Every line is a separate paragraph. No br tags needed.")
    
    builder.add_section("Key Features")
    builder.add_bullet_list([
        "Professional color schemes",
        "Cover page with decorative elements", 
        "Styled page backgrounds",
        "Tables with alternating row colors",
        "No text overlap guaranteed"
    ])
    
    builder.add_divider()
    
    builder.add_section("Sample Table")
    builder.add_table(
        data=[
            ["Feature", "Status", "Notes"],
            ["Cover Pages", "✓", "With decorative elements"],
            ["Tables", "✓", "Styled headers and rows"],
            ["Lists", "✓", "Bullets and numbered"],
            ["Colors", "✓", "5 predefined schemes"]
        ],
        col_widths=[1.5*inch, 0.8*inch, 2.5*inch]
    )
    
    builder.add_page_break()
    
    # Page 2
    builder.add_title("Color Schemes", "Available Options")
    
    builder.add_body("The template includes five predefined color schemes:")
    
    builder.add_bullet_list([
        "<b>corporate_blue</b> - Professional indigo and orange",
        "<b>professional_dark</b> - Dark navy with coral accents",
        "<b>modern_green</b> - Forest green with amber",
        "<b>elegant_purple</b> - Rich purple with pink accents",
        "<b>warm_red</b> - Bold red with gold highlights"
    ])
    
    builder.add_spacer(20)
    builder.add_footer_text(
        "Generated with Aesthetic PDF Creator",
        "No text overlap. Clean formatting. Professional output."
    )
    
    # Build
    output = builder.build()
    print(f"✅ PDF created: {output}")
