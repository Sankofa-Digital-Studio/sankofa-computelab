"""Rebuild the student-only Open Day ZIP. Requires openpyxl and python-docx."""
from html import escape
from io import BytesIO
import json
from pathlib import Path
import subprocess
from zipfile import ZipFile, ZIP_DEFLATED

from docx import Document
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter

root = Path(__file__).resolve().parent.parent
data = json.loads((root / "src/open-day-data.json").read_text())
script = "import { challenges } from './src/challenge-data.js';console.log(JSON.stringify(challenges[0]))"
challenge = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", script], cwd=root))

workbook = Workbook()
bookings = workbook.active
bookings.title = "Bookings"
bookings.append(["Session", "Activity code", "Booked seats", "Capacity", "Unit cost", "Base cost", "Contingency", "Total cost", "Review flag"])
for row in data["bookings"]:
    bookings.append(row)
rates = workbook.create_sheet("Rates")
rates.append(["Activity code", "Activity", "Cost per seat", None, "Contingency rate"])
for i, row in enumerate(data["rates"], start=2):
    rates.append(row)
    if i == 2:
        rates["E2"] = .08
        rates["E2"].number_format = "0%"
recipients = workbook.create_sheet("Recipients")
recipients.append(["FullName", "Programme", "Session"])
for row in data["recipients"]:
    recipients.append(row)
summary = workbook.create_sheet("Summary")
summary.append(["Session", "Booked seats", "Total capacity", "Total cost"])
for name in ["Friday", "Saturday AM", "Saturday PM"]:
    summary.append([name])
for sheet in workbook:
    sheet.freeze_panes = "A2"
    for cell in sheet[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="184838")
        sheet.column_dimensions[get_column_letter(cell.column)].width = 22
excel = BytesIO()
workbook.save(excel)

letter = Document()
letter.add_paragraph("Campus Open Day")
letter.add_paragraph("You are invited to visit the campus and explore our workshops. Confirm the time and venue with your facilitator.")
letter.add_paragraph("Add the schedule and explain how visitors can ask for access assistance.")
letter.add_paragraph("Kind regards")
letter.add_paragraph("Open Day Coordination Team")
word = BytesIO()
letter.save(word)

parts = [
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Sankofa · Campus Open Day exam kit</title><style>body{font:1rem/1.6 system-ui;max-width:58rem;margin:auto;padding:1rem;color:#183329}h1,h2{line-height:1.2}article{padding:.5rem 0;border-bottom:1px solid #ddd}@media print{article{break-inside:avoid}}</style>',
    '<h1>Campus Open Day</h1><p>Computer Practice N6 · Independent practice simulation · 180 minutes · 180 marks</p>',
    f'<p>{escape(challenge["scenario"])}</p>',
    '<p>Open the editable Word and Excel starter files locally. Create the OneNote notebook from the brief. Save work regularly and review print output before the time ends.</p>',
    '<h2>Timing</h2><ul>',
]
for label, minutes, marks in challenge["sections"]:
    parts.append(f'<li>{escape(label)} · {minutes} minutes · {marks} marks</li>')
parts.append('</ul><h2>Candidate tasks</h2>')
for row in challenge["tasks"]:
    parts.append(f'<article><h3>{escape(row["title"])} [{row["marks"]}]</h3><p>{escape(row["outcome"])}</p>')
    parts.extend(f'<p>{escape(prompt)}</p>' for prompt in row["prompt"])
    parts.append('</article>')
parts.append('<h2>Evidence checklist</h2><ul>')
parts.extend(f'<li>{escape(item)}</li>' for item in challenge["evidence"])
parts.append('</ul><p>Open the Site to self-mark and complete the follow-up challenge.</p></html>')

with ZipFile(root / "public/packs/n6-open-day-exam-kit.zip", "w", ZIP_DEFLATED) as kit:
    kit.writestr("START-HERE.html", "\n".join(parts))
    kit.writestr("Invitation_Starter.docx", word.getvalue())
    kit.writestr("Open_Day_Starter.xlsx", excel.getvalue())
