#!/usr/bin/env python3
# DHRL worksheet builder. ReportLab, table-based boxes (no overlap), no author names, no em-dashes.

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Flowable, KeepTogether,
)

import sys, os
# Output path: pass as argv[1], else write worksheet.pdf next to this script.
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "worksheet.pdf")

# ---------- palette ----------
INK    = HexColor("#1f1c17")
RUST   = HexColor("#9a3b2e")
GREEN  = HexColor("#2f5d3a")
PAPER  = HexColor("#f4f1ea")
CREAM  = HexColor("#fbf9f4")
LINE   = HexColor("#c2bba9")
SOFT   = HexColor("#ded7c6")
MUTED  = HexColor("#5d5849")
GREENBG= HexColor("#eef3ec")
RUSTBG = HexColor("#fbf2ef")
BLUEBG = HexColor("#eef1f4")

PAGE_W, PAGE_H = A4
LM = RM = 0.62 * inch
TM = 0.45 * inch
BM = 0.42 * inch
CONTENT_W = PAGE_W - LM - RM

# ---------- styles ----------
def P(name, **kw):
    base = dict(fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK,
                alignment=TA_LEFT, spaceBefore=0, spaceAfter=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

st = {
    "title":   P("title", fontName="Helvetica-Bold", fontSize=24, leading=26, textColor=INK),
    "subtitle":P("subtitle", fontName="Helvetica-Oblique", fontSize=12, leading=15, textColor=MUTED),
    "h1cover": P("h1cover", fontName="Helvetica-Bold", fontSize=33, leading=36, textColor=INK),
    "body":    P("body", fontSize=10.5, leading=15, textColor=INK),
    "bodysm":  P("bodysm", fontSize=10, leading=14, textColor=INK),
    "label":   P("label", fontName="Helvetica-Bold", fontSize=11.5, leading=14.5, textColor=INK),
    "hint":    P("hint", fontName="Helvetica-Oblique", fontSize=9.7, leading=12.8, textColor=MUTED),
    "callh":   P("callh", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=RUST),
    "callb":   P("callb", fontSize=10, leading=12.5, textColor=INK),
    "mindh":   P("mindh", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=GREEN),
    "carryh":  P("carryh", fontName="Helvetica-Bold", fontSize=10.3, leading=13.5, textColor=GREEN),
    "carryl":  P("carryl", fontName="Helvetica-Bold", fontSize=10.3, leading=13.5, textColor=INK),
    "stagenum":P("stagenum", fontName="Helvetica-Bold", fontSize=38, leading=38, textColor=RUST),
    "arcnum":  P("arcnum", fontName="Helvetica-Bold", fontSize=18, leading=20, textColor=RUST),
    "arch":    P("arch", fontName="Helvetica-Bold", fontSize=12.5, leading=16, textColor=INK),
    "arcb":    P("arcb", fontSize=10, leading=14, textColor=MUTED),
    "arcc":    P("arcc", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=GREEN),
    "quadt":   P("quadt", fontName="Helvetica-Bold", fontSize=10.5, leading=13),
    "quadd":   P("quadd", fontSize=8.6, leading=11, textColor=MUTED),
    "axis":    P("axis", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK, alignment=TA_CENTER),
    "axisl":   P("axisl", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK, alignment=TA_CENTER),
    "pathh":   P("pathh", fontName="Helvetica-Bold", fontSize=12, leading=15),
    "pathli":  P("pathli", fontSize=9.6, leading=12.2, textColor=INK),
    "fillbig": P("fillbig", fontSize=11.5, leading=22, textColor=INK),
}

# ---------- ruled writing box ----------
class Box(Flowable):
    def __init__(self, w, h, lines=0, border=True, bcolor=LINE, bg=None, radius=4, dash=None, lcolor=SOFT, pad=10):
        super().__init__()
        self.w, self.h, self.lines = w, h, lines
        self.border, self.bcolor, self.bg, self.radius = border, bcolor, bg, radius
        self.dash, self.lcolor, self.pad = dash, lcolor, pad
    def wrap(self, aw, ah):
        return self.w, self.h
    def draw(self):
        c = self.canv
        if self.bg:
            c.setFillColor(self.bg)
            c.roundRect(0, 0, self.w, self.h, self.radius, fill=1, stroke=0)
        if self.border:
            c.setStrokeColor(self.bcolor)
            c.setLineWidth(1)
            if self.dash:
                c.setDash(self.dash, 0)
            c.roundRect(0, 0, self.w, self.h, self.radius, fill=0, stroke=1)
            c.setDash([], 0)
        if self.lines:
            c.setStrokeColor(self.lcolor)
            c.setLineWidth(0.7)
            gap = self.h / (self.lines + 1)
            for i in range(1, self.lines + 1):
                y = self.h - i * gap
                c.line(self.pad, y, self.w - self.pad, y)

def hrule(color=SOFT, w=CONTENT_W, thick=0.8, sb=0, sa=0):
    t = Table([[""]], colWidths=[w], rowHeights=[0.1])
    t.setStyle(TableStyle([("LINEABOVE", (0,0), (-1,0), thick, color),
                           ("TOPPADDING",(0,0),(-1,-1),sb),("BOTTOMPADDING",(0,0),(-1,-1),sa)]))
    return t

# ---------- composite blocks (all as Tables so nothing overlaps) ----------
def panel(rows, bg, border, leftbar=None, pad=11):
    """rows: list of flowables stacked vertically inside one bordered cell."""
    inner = []
    for r in rows:
        inner.append([r])
    t = Table(inner, colWidths=[CONTENT_W - (4 if leftbar else 0)])
    style = [("BACKGROUND",(0,0),(-1,-1),bg),
             ("BOX",(0,0),(-1,-1),1,border),
             ("LEFTPADDING",(0,0),(-1,-1),pad),("RIGHTPADDING",(0,0),(-1,-1),pad),
             ("TOPPADDING",(0,0),(0,0),pad-2),("BOTTOMPADDING",(0,-1),(-1,-1),pad-2),
             ("TOPPADDING",(0,1),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-2),2)]
    if leftbar:
        style.append(("LINEBEFORE",(0,0),(0,-1),4,leftbar))
    t.setStyle(TableStyle(style))
    return t

def how_panel(text):
    return panel([Paragraph("How to use this page", st["callh"]),
                  Paragraph(text, st["callb"])], CREAM, SOFT, leftbar=RUST, pad=9)

def mindful_panel(text):
    return panel([Paragraph("Be Mindful!", st["mindh"]),
                  Paragraph(text, st["callb"])], GREENBG, HexColor("#bcd0b8"), leftbar=GREEN, pad=9)

def carry_in(label, value_line=True):
    rows = [Paragraph("From the previous page: " + label, st["carryh"])]
    box = Box(CONTENT_W-24, 17, lines=1, border=False, lcolor=HexColor("#aac0a4"))
    rows.append(box)
    return panel(rows, HexColor("#f1f5ef"), HexColor("#bcd0b8"), pad=8)

def carry_out(items):
    rows = [Paragraph("Carry this forward to the next page", st["carryh"])]
    for lab in items:
        rows.append(Paragraph(lab, st["carryl"]))
        rows.append(Box(CONTENT_W-24, 15, lines=1, border=False, lcolor=HexColor("#aac0a4")))
    return KeepTogether([panel(rows, GREENBG, GREEN, pad=8)])

def field(num, label, hint, box, gapafter=5):
    head = Paragraph(f'<b>{num}.&nbsp;&nbsp;{label}</b>', st["label"])
    hintp = Paragraph(hint, st["hint"])
    flows = [head, Spacer(1,2), hintp, Spacer(1,4), box, Spacer(1,gapafter)]
    return KeepTogether(flows)

def stage_header(num, title, subtitle):
    cell_num = Paragraph(str(num), st["stagenum"])
    cell_txt = [Paragraph(title, st["title"]), Spacer(1,2), Paragraph(subtitle, st["subtitle"])]
    t = Table([[cell_num, cell_txt]], colWidths=[58, CONTENT_W-58])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                           ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                           ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
                           ("LINEBELOW",(0,0),(-1,-1),2.5,INK),
                           ("BOTTOMPADDING",(0,0),(-1,-1),8)]))
    return t

def continuation(label):
    t = Table([[Paragraph(label, st["callh"])]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([("LINEBELOW",(0,0),(-1,-1),1.5,RUST),
                           ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                           ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
    return t

# ---------- document ----------
FOOT = {}
TOTAL = 7
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(SOFT); canvas.setLineWidth(0.8)
    canvas.line(LM, BM+10, PAGE_W-RM, BM+10)
    canvas.setFont("Helvetica", 8); canvas.setFillColor(MUTED)
    canvas.drawString(LM, BM-2, "Change Management Through GenAI   .   DHRL")
    canvas.drawRightString(PAGE_W-RM, BM-2, f"Page {doc.page} of {TOTAL}")
    canvas.restoreState()

story = []

# ============ PAGE 1 : COVER ============
FOOT[1] = "Change Management Through GenAI"
story += [
    Paragraph("Change Management Through GenAI", st["callh"]),
    Spacer(1,4),
    Paragraph("From One Decision", st["h1cover"]),
    Paragraph("to a New Org Chart", st["h1cover"]),
    Spacer(1,4),
    Paragraph("In this session you will take one real decision that you keep putting off, open it up, "
              "follow it through your own workflow, and see how it changes who does the work and who holds "
              "power. By the last page you will have redrawn a part of your own organisation on paper.",
              st["body"]),
    Spacer(1,4),
]
story.append(panel([
    Paragraph("One rule before you start", st["callh"]),
    Paragraph("Every box on these pages should hold something real from your own organisation: a name, a "
              "number, a place, or a consequence. You can use the GPT to think along with you. But if a "
              "sentence you write could have been written by someone who has never seen your workplace, it "
              "is too general, and it is the wrong answer for this worksheet.", st["callb"]),
], PAPER, INK, pad=13))
story.append(Spacer(1,4))

arc = [
    ("0","Find the real decision",
     "You think the problem is a pending task, such as a vacancy to fill. A short conversation with the GPT helps you see the decision sitting underneath it.",
     "Carries forward: the decision."),
    ("1","Separate prediction from judgment",
     "You split that decision into the part a machine can do, which is predicting what is likely, and the part only you can own, which is the judgment you are answerable for.",
     "Carries forward: the prediction part and the judgment part."),
    ("2","Trace the workflow, then choose",
     "The decision sits inside a chain of steps. You map it, find where GenAI can help, and decide between a small fix and a full redesign.",
     "Carries forward: your chosen path."),
    ("3","See where the power moves",
     "When the work changes, the hardest part of the job moves, and influence moves with it. You map who gains, who loses, and who should now own the process.",
     "Ends with: the new owner of the process."),
]
arc_rows = []
for n,h,b,c in arc:
    cell = [Paragraph(h, st["arch"]), Spacer(1,2), Paragraph(b, st["arcb"]), Spacer(1,3), Paragraph(c, st["arcc"])]
    arc_rows.append([Paragraph(n, st["arcnum"]), cell])
at = Table(arc_rows, colWidths=[40, CONTENT_W-40])
at.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                        ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                        ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
                        ("LINEBELOW",(0,0),(-1,-1),0.6,SOFT),
                        ("LINEABOVE",(0,0),(-1,0),0.6,SOFT)]))
story.append(at)
story.append(PageBreak())

# ============ PAGE 2 : STAGE 0 ============
FOOT[2] = "Stage 0  .  Find the real decision"
story += [
    stage_header(0, "Find the Real Decision",
                 "The thing slowing you down is often a decision no one has made, not a task that is pending."),
    Spacer(1,4),
    how_panel("Open the Decision Decomposer GPT. Tell it, in your own words, the pressure you are feeling at "
              "work right now. It will not give you advice. It will only keep asking questions until you can "
              "see the decision sitting underneath the pressure. Write your answers in the boxes as you go."),
    Spacer(1,4),
    mindful_panel("A task is something you do. A decision is a choice you make. “We are short of people in "
                  "sales” is a task you can feel. The decision hiding under it might be whether to promote "
                  "someone from inside or to hire a senior person from outside. Keep asking yourself what choice "
                  "you are avoiding, until you reach something that only you can decide."),
    Spacer(1,4),
    field("1","The pressure I would name first",
          "(Write the symptom in your own words, the way you would describe it to a colleague.)",
          Box(CONTENT_W, 40, lines=3)),
    field("2","The decision that is actually stuck",
          "(Write it as one sentence that starts with a verb, such as Whether to, Which, or How much.)",
          Box(CONTENT_W, 70, lines=3)),
    field("3","How long it has been open, and what the delay is costing",
          "(Write how long it has stayed open, and what each week of waiting costs you: in money, in a missed "
          "opportunity, in a person, or in a risk you keep carrying.)",
          Box(CONTENT_W, 40, lines=3)),
    field("4","Say it plainly",
          "(Fill in the blanks.)",
          Box(CONTENT_W, 2, lines=0, border=False), gapafter=6),
]
story.append(Paragraph('This was never a ___________________ problem.', st["fillbig"]))
story.append(Paragraph('It is a ___________________ decision I have been avoiding.', st["fillbig"]))
story.append(Spacer(1,4))
story.append(carry_out(["The decision, written in one sentence:"]))
story.append(PageBreak())

# ============ PAGE 3 : STAGE 1 ============
FOOT[3] = "Stage 1  .  Separate prediction from judgment"
story += [
    stage_header(1, "Separate Prediction from Judgment",
                 "It helps to separate what machines do well from what only a person can be answerable for."),
    Spacer(1,4),
    carry_in("the decision you wrote on the last page."),
    Spacer(1,4),
    how_panel("Every decision is really two things joined together. One part is prediction: working out what is "
              "likely, from facts, patterns and past cases. Machines are now very good, and very cheap, at this. "
              "The other part is judgment: making the actual call, weighing what matters, and being answerable if "
              "it goes wrong. Only a person can hold this. On this page you separate the two for your own decision."),
    Spacer(1,4),
    mindful_panel("Think of hiring. Sorting CVs and predicting who is likely to perform is prediction, and a tool "
                  "can do most of it. Deciding whether this person fits the team you are building, and standing by "
                  "that choice, is judgment. A common mistake is to write a judgment in the prediction box. If your "
                  "sentence contains words like decide, weigh, or who is answerable, it belongs on the judgment side."),
    Spacer(1,4),
    field("1","The prediction inside this decision",
          "(Write what is mostly about working out what is likely: the facts, the scores, the forecasts, and the "
          "first drafts that a machine could produce.)",
          Box(CONTENT_W, 40, lines=3)),
    field("2","The judgment inside this decision",
          "(Write the part that only a person can own: the trade-off, the final call, and what you would be "
          "answerable for if it went wrong.)",
          Box(CONTENT_W, 40, lines=3)),
    field("3","A simple test",
          "(Imagine a machine handed you a perfect prediction tomorrow. What would still be left for you to "
          "decide? Whatever remains is the real judgment.)",
          Box(CONTENT_W, 32, lines=2)),
    field("4","Who decides this today",
          "(Write who actually makes the judgment call now. Are they truly paying attention to it, or have they "
          "quietly left it to a tool, a junior, or a default, while keeping the title?)",
          Box(CONTENT_W, 32, lines=2)),
]
story.append(carry_out(["The prediction part, which a machine could take over:",
                        "The judgment part, which you keep:"]))
story.append(PageBreak())

# ============ PAGE 4 : STAGE 2 ============
FOOT[4] = "Stage 2  .  Trace the workflow, then choose"
story += [
    stage_header(2, "Trace the Workflow, Then Choose",
                 "The decision sits inside a chain of steps. Map the chain, then decide how far to change it."),
    Spacer(1,4),
    carry_in("the prediction part and the judgment part."),
    Spacer(1,4),
    how_panel("First, draw the full set of steps that this decision passes through, from the moment the work "
              "starts to the moment it is finished. Then look at it in two ways. The first way asks where GenAI "
              "could make a single step faster, leaving everything else as it is, which gives a small and safe "
              "improvement. The second way asks a bigger question: if predicting and drafting were free and "
              "instant, would you build the process this way at all? That points to a redesign."),
    Spacer(1,4),
    mindful_panel("A small fix is like giving a clerk a faster calculator. The work still flows the same way. A "
                  "redesign is like asking whether you need that step at all, once the calculator does the "
                  "thinking. Both are valid. The small fix is low risk and gives a quick gain. The redesign is "
                  "harder and slower, but it is what separates the companies that lead from the ones that keep up."),
    Spacer(1,4),
    field("A","Draw the workflow",
          "(Draw the steps from left to right, from the trigger that starts the work to the final outcome, "
          "usually five to nine steps. Put a circle around every step where GenAI could do the work or assist it.)",
          Box(CONTENT_W, 215, lines=0, bg=CREAM)),
]
# B: two lenses side by side
def lens_cell(title, hint, bg, bcol, tcol):
    rows = [[Paragraph(title, P("lt", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=tcol))],
            [Paragraph(hint, st["hint"])],
            [Box((CONTENT_W-14)/2 - 22, 42, lines=3)]]
    t = Table(rows, colWidths=[(CONTENT_W-14)/2])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),1,bcol),
                           ("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),
                           ("TOPPADDING",(0,0),(0,0),9),("TOPPADDING",(0,1),(-1,-1),3),
                           ("BOTTOMPADDING",(0,-1),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-2),3)]))
    return t
lensB = Table([[lens_cell("The small fix",
                          "(Where could GenAI make one single step faster or more consistent, without changing anything else around it?)",
                          CREAM, SOFT, INK),
                lens_cell("The redesign",
                          "(If predicting and drafting were free, which steps would you remove, and how would the process look if you built it fresh?)",
                          RUSTBG, RUST, RUST)]],
              colWidths=[(CONTENT_W)/2, (CONTENT_W)/2])
lensB.setStyle(TableStyle([("LEFTPADDING",(0,0),(0,0),0),("RIGHTPADDING",(0,0),(0,0),7),
                           ("LEFTPADDING",(1,0),(1,0),7),("RIGHTPADDING",(1,0),(1,0),0),
                           ("VALIGN",(0,0),(-1,-1),"TOP"),
                           ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
story.append(PageBreak())
story.append(continuation("Stage 2, continued  .  Trace the workflow, then choose"))
story.append(Spacer(1,9))
story.append(Paragraph('<b>B.&nbsp;&nbsp;Look at it in two ways</b>', st["label"]))
story.append(Spacer(1,4))
story.append(lensB)
story.append(Spacer(1,4))
story.append(Paragraph('<b>C.&nbsp;&nbsp;How much else has to change</b>', st["label"]))
story.append(Spacer(1,2))
story.append(Paragraph("(Tick each item below that would also have to change for your idea to actually work.)", st["hint"]))
story.append(Spacer(1,4))
story.append(Paragraph("[ &nbsp;]&nbsp; an approval or sign-off step &nbsp;&nbsp;&nbsp; [ &nbsp;]&nbsp; another team’s work "
                       "&nbsp;&nbsp;&nbsp; [ &nbsp;]&nbsp; a standard procedure or policy &nbsp;&nbsp;&nbsp; [ &nbsp;]&nbsp; who holds authority",
                       st["bodysm"]))
story.append(Spacer(1,4))
story.append(Paragraph("Number of ticks: ________ . &nbsp; Zero or one means a small fix. Two means run a small trial first. "
                       "Three or more means a redesign.", st["bodysm"]))
story.append(Spacer(1,4))
# D: compare paths
def path_cell(title, items, bg, bcol, tcol):
    rows = [[Paragraph(title, P("pt", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=tcol))]]
    for it in items:
        rows.append([Paragraph("• " + it, st["pathli"])])
    t = Table(rows, colWidths=[(CONTENT_W-14)/2])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),1.2,bcol),
                           ("LEFTPADDING",(0,0),(-1,-1),12),("RIGHTPADDING",(0,0),(-1,-1),10),
                           ("TOPPADDING",(0,0),(0,0),6),("TOPPADDING",(0,1),(-1,-1),2),
                           ("BOTTOMPADDING",(0,-1),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-2),2)]))
    return t
pathD = Table([[path_cell("A small fix",
                          ["Low risk, and easy to undo.","A quick but limited gain.","Keeps the current structure.",
                           "Quietly locks in the old way of working."], CREAM, HexColor("#8a8470"), INK),
                path_cell("A redesign",
                          ["Higher risk, and hard to undo.","A large gain, but it takes time.",
                           "Sets up the next generation of the company.","Forces the structure to change."],
                          RUSTBG, RUST, RUST)]],
              colWidths=[CONTENT_W/2, CONTENT_W/2])
pathD.setStyle(TableStyle([("LEFTPADDING",(0,0),(0,0),0),("RIGHTPADDING",(0,0),(0,0),7),
                           ("LEFTPADDING",(1,0),(1,0),7),("RIGHTPADDING",(1,0),(1,0),0),
                           ("VALIGN",(0,0),(-1,-1),"TOP"),
                           ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
story.append(Paragraph('<b>D.&nbsp;&nbsp;Compare the two paths</b>', st["label"]))
story.append(Spacer(1,4))
story.append(pathD)
story.append(Spacer(1,4))
story.append(carry_out(["My choice (tick one):   [ &nbsp;] a small fix     [ &nbsp;] a redesign.   In one line, why:"]))
story.append(PageBreak())

# ============ PAGE 5 : STAGE 3 ============
FOOT[5] = "Stage 3  .  See where the power moves"
story += [
    stage_header(3, "See Where the Power Moves",
                 "When the work changes, the hardest part of the job moves, and influence moves with it."),
    Spacer(1,4),
    carry_in("your chosen path: a small fix or a redesign."),
    Spacer(1,4),
    how_panel("When GenAI takes over the old hard part of a process, the difficulty does not disappear. It moves to "
              "a new place, usually to judgment, to handling risk, or to coordinating people. Influence and ownership "
              "tend to follow wherever the new hard part sits. So the useful question is not what the tool can do, but "
              "what the tool makes easy, and who now holds the part it cannot do."),
    Spacer(1,4),
    mindful_panel("For years a manager’s value might have come from being the person who gathered information and "
                  "passed it upward. Once a tool gathers and drafts that information for everyone, that part of the role "
                  "loses its value. The person who rises is the one who now owns the judgment and carries the risk. The "
                  "same change that weakens one role can strengthen another."),
    Spacer(1,4),
]
# fields 1 and 2
story.append(field("1","The old hard part",
                   "(Write what used to be scarce or difficult, the thing this workflow was really built around.)",
                   Box(CONTENT_W, 40, lines=2), gapafter=6))
story.append(Paragraph('<b>2.&nbsp;&nbsp;Where the hard part moves</b>', st["label"]))
story.append(Spacer(1,3))
story.append(Paragraph("(Tick one, then describe it for your own workplace.)", st["hint"]))
story.append(Spacer(1,4))
story.append(Paragraph("[ &nbsp;]&nbsp; judgment &nbsp;&nbsp;&nbsp; [ &nbsp;]&nbsp; handling risk &nbsp;&nbsp;&nbsp; "
                       "[ &nbsp;]&nbsp; coordinating people", st["bodysm"]))
story.append(Spacer(1,4))
story.append(Box(CONTENT_W, 34, lines=1))
story.append(Spacer(1,4))

# 3. Power map (clean table, axis labels as header row / left column)
story.append(Paragraph('<b>3.&nbsp;&nbsp;The Power Map</b>', st["label"]))
story.append(Spacer(1,2))
story.append(Paragraph("(Write a real role or person from your workplace in each box. The two questions across the "
                       "top and down the side are the same two halves you separated in Stage 1.)", st["hint"]))
story.append(Spacer(1,4))

def quad(title, desc, tcolor, bg, bcol):
    rows = [[Paragraph(title, P("qt", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=tcolor))],
            [Paragraph(desc, st["quadd"])],
            [Paragraph("Role: ______________________", P("qr", fontName="Helvetica", fontSize=9, leading=13, textColor=INK))]]
    t = Table(rows, colWidths=[QW])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),1,bcol),
                           ("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),
                           ("TOPPADDING",(0,0),(0,0),5),("TOPPADDING",(0,1),(-1,-1),2),
                           ("BOTTOMPADDING",(0,-1),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-2),3)]))
    return t

LEFTW = 86
QW = (CONTENT_W - LEFTW - 16) / 2
colhead = lambda l1, l2: [Paragraph(l1, st["axis"]), Paragraph(l2, st["axis"])]
rowhead = lambda txt: Paragraph(txt, st["axisl"])

q_stable  = quad("Stable, for now",
                 "They still hold the judgment, and a tool has not yet taken over their prediction work.",
                 INK, CREAM, LINE)
q_rises   = quad("Rises: the new owner",
                 "This role gains. It lets go of prediction and focuses on the judgment the new process needs. Influence moves here.",
                 GREEN, GREENBG, GREEN)
q_exposed = quad("Exposed soon",
                 "A tool will take their prediction work next, and they do not yet hold judgment. They need to move towards the new hard part.",
                 INK, CREAM, LINE)
q_dissolve= quad("At risk of dissolving",
                 "A tool already does their prediction work, and they hold no judgment. The reason for the role is fading.",
                 RUST, RUSTBG, RUST)

matrix = Table(
    [[ "", colhead("Their prediction work is", "NOT yet automated"), colhead("Their prediction work", "is now automated") ],
     [ rowhead("They own the new judgment or risk"), q_stable, q_rises ],
     [ rowhead("They do not own it"), q_exposed, q_dissolve ]],
    colWidths=[LEFTW, QW+8, QW+8],
    rowHeights=[34, None, None],
)
matrix.setStyle(TableStyle([
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("ALIGN",(1,0),(2,0),"CENTER"),
    ("VALIGN",(0,1),(0,-1),"MIDDLE"),
    ("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),
    ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
    ("LEFTPADDING",(0,1),(0,-1),0),("RIGHTPADDING",(0,1),(0,-1),6),
]))
# allow newlines in axis header -> use <br/>? skill says no br in body; but header cells are short. Use two paragraphs via list.
story.append(matrix)
story.append(Spacer(1,4))

story.append(PageBreak())
story.append(continuation("Stage 3, continued  .  See where the power moves"))
story.append(Spacer(1,9))
story.append(field("4","The new owner",
                   "(Write the role that should now own this process: the one that manages the new hard part and "
                   "sits closest to the decision.)",
                   Box(CONTENT_W, 56, lines=2), gapafter=9))
story.append(field("5","The likely resistance",
                   "(These are the people, positions, or roles who would resist this change. Write who they are, and "
                   "what they are really protecting, which is often a committee or a routine that the tool makes "
                   "unnecessary.)",
                   Box(CONTENT_W, 78, lines=3), gapafter=12))

# closing sentence box
close_rows = [
    Paragraph("Put it together in one sentence", st["callh"]),
    Spacer(1,4),
    Paragraph("When I bring GenAI into ____________________ (the decision),", st["fillbig"]),
    Paragraph("the workflow becomes ____________________ (its new shape),", st["fillbig"]),
    Paragraph("and ownership moves from ______________ to ______________ .", st["fillbig"]),
]
story.append(panel(close_rows, PAPER, INK, pad=9))
story.append(Spacer(1,4))
sign = Table([[Paragraph("Signature", st["hint"]), Paragraph("Date", st["hint"]), Paragraph("90-day review", st["hint"])]],
             colWidths=[CONTENT_W/3]*3)
sign.setStyle(TableStyle([("LINEABOVE",(0,0),(-1,0),1,INK),("TOPPADDING",(0,0),(-1,-1),4),
                          ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),14)]))
story.append(Spacer(1,4))
story.append(sign)

# ---------- build ----------
doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)
frame = Frame(LM, BM+16, CONTENT_W, PAGE_H-TM-BM-16, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])
doc.build(story)
print("built", OUT)