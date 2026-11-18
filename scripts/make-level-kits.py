"""Generate the focused N5 and N6 student packs from original scenario data."""
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

ROOT = Path(__file__).resolve().parent.parent
script = "import {focusedChallenges,clinicRows} from './src/focused-challenges.js';console.log(JSON.stringify([focusedChallenges,clinicRows]))"
(challenges, rows) = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", script], cwd=ROOT))
n5, n6 = challenges[:2]

def workbook(sheets):
    book = Workbook()
    book.remove(book.active)
    for name, data in sheets.items():
        sheet = book.create_sheet(name)
        for line in data:
            sheet.append(line)
        sheet.freeze_panes = "A2"
        for cell in sheet[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="173E31")
            sheet.column_dimensions[get_column_letter(cell.column)].width = 23
    output = BytesIO()
    book.save(output)
    return output.getvalue()

def brief(case):
    tasks = []
    for task in case["tasks"]:
        tasks.append(f'<h2>{escape(task["title"])} ({task["marks"]} marks)</h2>')
        tasks.extend(f'<p>{escape(line)}</p>' for line in task["prompt"])
    evidence = [f'<li>{escape(line)}</li>' for line in case["evidence"]]
    total = sum(task["marks"] for task in case["tasks"])
    return "".join([
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>Sankofa practice kit</title><style>body{font:1em/1.6 system-ui;max-width:54em;margin:auto;padding:1em;color:#172f25}h1,h2{line-height:1.2}</style>',
        f'<h1>{escape(case["title"])}</h1><p>Sankofa practice · {case["minutes"]} minutes · {total} marks</p>',
        f'<p>{escape(case["scenario"])}</p>', *tasks, '<h2>Evidence to save</h2><ul>', *evidence,
        '</ul><p>Return to the Challenge Lab after completing the work to self-mark and try the transfer task.</p></html>'
    ])

def package(case, files):
    filename = ROOT / "public" / case["pack"]["path"].lstrip("/")
    with ZipFile(filename, "w", ZIP_DEFLATED) as archive:
        archive.writestr("START-HERE.html", brief(case))
        for name, contents in files.items():
            archive.writestr(name, contents)

bookings = [["ID","Delegate","Session","Places","Rate","Status","Gross","Follow-up"], *rows]
letter = Document()
for line in ["Careers clinic briefing", "Date\t26 August", "Time\t09:00", "Venue\tTraining Lab", "Priority action", "Summarise the bookings that require follow-up."]:
    letter.add_paragraph(line)
word = BytesIO()
letter.save(word)
package(n5, {
    "Briefing_Starter.docx":word.getvalue(),
    "Clinic_Bookings_Approved.xlsx":workbook({"Bookings":bookings,"Control":[["Control","Value"],["Status","Approved"],["Revision","R4"],["Levy",.05]]}),
    "Clinic_Bookings_Working_Draft.xlsx":workbook({"Bookings":[bookings[0],*rows[:-1]],"Control":[["Control","Value"],["Status","Draft"],["Revision","R5"],["Levy",.04]]})
})
package(n6,{
    "Formula_Lab_Starter.xlsx":workbook({
        "Loan":[["Principal","Annual Rate","Months","Monthly Repayment","Total Interest"],[120000,.108,36],[120000,.108,60]],
        "Savings":[["Deposit","Annual Rate","Years","Timing","Future Value","Growth"],[900,.072,6,0],[900,.072,6,1]],
        "Eligibility":[["ID","Average","Attendance","Conduct","Owner Code","Decision","Review Owner"],["A15",72,.84,"Clear","REG"],["A16",72,.83,"Clear","REG"],["A17",64,.9,"Clear","ZZZ"],["A18",71.995,.86,"Clear","ADM"]],
        "Owners":[["Code","Owner"],["REG","Registration"],["ADM","Administration"]]
    })
})
