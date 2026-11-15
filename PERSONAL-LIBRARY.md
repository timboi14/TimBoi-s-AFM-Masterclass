# Your March 2027 study rooms

Open your subject site at `/study-room`, choose **Import personal library folder**, and select the corresponding extracted AFM-library or APM-library folder beside this file. Import once per browser/device. Originals are verified against their SHA-256 checksums. Keep these folders; Settings backups cover progress, not the books themselves.

## Coverage

- All 13 supplied files, unchanged originals and searchable extracts; plus the two official ACCA 2026–27 syllabuses.
- AFM: 16 chapter guides, 164 reading/practice/revision tasks, 82 kit/specimen questions. 36 of the Top 51 are in the supplied kit; 15 missing questions are labelled in the site.
- APM: 16 chapter guides, 233 tasks, 66 kit/specimen questions. 27 mixed/older reading blocks remain accessible but are excluded from default planning.
- Question and answer ranges use physical PDF pages. Amberle's incorrect answer-page index was corrected against the source.
- The supplied APM mock contains solutions only; it is revision material, not an unseen mock.
- Topic grouping is a keyword-assisted navigation aid. Read the full requirements; questions can cover several syllabus areas.

## Your routine

APM Monday/Wednesday 19:30–20:30; AFM Tuesday/Thursday 19:30–20:30. Friday off. Saturday: APM 09:00–11:00, AFM 14:00–16:00. Sunday: APM 09:00–10:30, AFM 14:00–15:30. Edit these in Plan and export a calendar. March dates are provisional; confirm your docket.

Read the original examples, retrieve from memory, attempt requirements under time, compare with the original solution, record checked marks and a specific correction, then return for scheduled retests. The optional AI marker uses your source question/solution and is advisory. Two successful attempts on different days support a secure status; overdue reviews still resurface.

The initial material is about 300 estimated hours before repeat attempts. Eleven hours a week may not cover every task by March; each planner displays the remaining capacity and overflow explicitly. Adjust hours or prioritise consciously.

## Syllabus sources

AFM: https://www.accaglobal.com/content/dam/acca/global/PDF-students/acca/p4/studyguides/afm_s26_j27_syllabus_and_study_guide.pdf
APM: https://www.accaglobal.com/content/dam/acca/global/PDF-students/acca/p5/studyguides/apm_s26_j27%20syllabus%20and%20study%20guide.pdf

Older site exercises remain supplementary. The 2026–27 source room is the main study route. No exam outcome is inferred from reading completion or self-assessed scores.

## Rebuild locally

Install pypdf, openpyxl and PyMuPDF. Run `python3 scripts/extract-personal-library.py`, then `python3 scripts/build-personal-library.py`. Sources default to Downloads; cache defaults to .private-library-build. The public/personal-library folder is local-only, ignored by Git and removed from production dist. Do not publish the original books.
