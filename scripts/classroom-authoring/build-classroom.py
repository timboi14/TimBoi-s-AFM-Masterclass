from pathlib import Path
import json,html,re,csv,collections
out=Path('/Users/timboi/Documents/Codex/2026-09-05/afm-classroom'); data=json.loads((out/'.build/data.json').read_text()); lessons=json.loads((out/'.build/lessons.json').read_text())
b='https://www.acowtancy.com/exams/acca-afm/cbe-question/'
# Exact slugs observed in the expanded public catalogue, not inferred date URLs.
links={
'MJ26':['aug-2026-genuine-1i-t','aug-2026-genuine-2a-t','aug-2026-genuine-3a-t'],
'SD25':['feb-2026-genuine-1a-t','feb-2026-genuine-2a-t','feb-2026-genuine-3a-t'],
'MJ25':['feb-2026-genuine-1i-t','feb-2026-genuine-2a-t-1','jul-2025-genuine-3-t'],
'SD24':['mar-2025-genuine-1i-t','dec-2024-genuine-q2a-i','dec-2024-genuine-q3a'],
'MJ24':['jan-2025-genuine-1a-t-4','jan-2025-genuine-2a-i-t','dec-2024-genuine-3a-t'],
'SD23':['dec-2024-genuine-1i-t','dec-2024-genuine-2-t','dec-2024-genuine-3a-t-2'],
'MJ23':['dec-2024-genuine-1a-t-1','dec-2024-genuine-2a-t','dec-2024-genuine-3a-t-1'],
'D22':['jan-2025-genuine-1a-t-2','jan-2025-genuine-2a-t-2','jan-2025-genuine-3a-t-1'],
'S22':['jan-2025-genuine-1a-t-3','jan-2025-genuine-2a-t-3','jan-2025-genuine-3a-t-2']}
for q in data['questions']:
 q['answerUrl']= b+links[q['paper']][q['q']-1] if q['paper'] in links else ''
 q['answerStatus']='Company/exhibit match and answer control verified' if q['paper'] in ['MJ26','SD25'] else ('Catalogue link located; content match still needs checking' if q['answerUrl'] else 'No matching answer located')
 q['lessonNumbers']=[i+1 for i,l in enumerate(lessons) if q['id'] in l['refs']]
 dataq=q.copy()
# Simple source renderer preserves text, lists and Markdown tables as readable HTML.
def inline(t):
 t=html.escape(t);t=re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',t);t=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',t);return t

def md(t):
 result=[];table=[];para=[]
 def flush():
  if para: result.append('<p>'+' '.join(para)+'</p>');para.clear()
 def ft():
  if table:
   body=[]
   for i,line in enumerate(table):
    cells=line.strip('|').split('|')
    if all(re.fullmatch(r'[\s:\-]+',c) for c in cells):continue
    tag='th' if i==0 else 'td';body.append('<tr>'+''.join('<'+tag+'>'+inline(c.strip())+'</'+tag+'>' for c in cells)+'</tr>')
   result.append('<div class="table-wrap"><table>'+''.join(body)+'</table></div>');table.clear()
 for line in t.splitlines():
  if not line.strip() and table:continue
  if line.startswith('|'):flush();table.append(line);continue
  ft()
  if not line.strip():flush();continue
  if line.startswith('#'):
   flush();n=min(6,len(line)-len(line.lstrip('#')));result.append(f'<h{n}>'+inline(line.lstrip('# '))+f'</h{n}>')
  elif re.match(r'^[-•–] ',line):flush();result.append('<p class="list-item">'+inline(line[2:])+'</p>')
  elif line.strip()=='---':flush();result.append('<hr>')
  else:para.append(inline(line))
 flush();ft();return '\n'.join(result)
css='body{font:18px/1.65 system-ui,sans-serif;background:#f6f5ef;color:#203c39;max-width:1050px;margin:50px auto;padding:0 25px}a{color:#315f59}table{border-collapse:collapse;width:100%;font-size:16px}th,td{text-align:left;padding:10px;border-bottom:1px solid #cbd3ca}h1,h2{line-height:1.2;margin-top:2em}.table-wrap{overflow:auto}.list-item{padding-left:1em;border-left:2px solid #bac7b8} @media print{body{font-size:12px;margin:0}a{color:inherit}h2{break-after:avoid}}'
def page(title,content):return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(title)+'</title><style>'+css+'</style><body><a href="../index.html">Classroom</a>'+content+'</body></html>'
for p in data['papers']:
 text=(out/'papers'/p['file']).read_text();(out/'papers'/p['file'].replace('.md','.html')).write_text(page(p['title'],md(text)))
for q in data['questions']:
 q['requirementsHtml']=md(q['requirements'])
 q['fullHtml']=md(q['full'])
# A reusable coverage tracker and source-grounded guide.
columns=['id','paperTitle','name','q','marks','day','topic','methods','mode','deepMinutes','summary','deliverable','pitfall','source','line','requirementLine','answerUrl','answerStatus']
with (out/'materials/coverage-tracker.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=columns+['attempted','confidence_0_to_3','error_type','next_retry','retrieved_without_notes']);w.writeheader()
 for q in data['questions']:w.writerow({**{c:q[c] for c in columns},'attempted':'','confidence_0_to_3':'','error_type':'','next_retry':'','retrieved_without_notes':''})
matrix=['# Coverage matrix: 42 questions','Every question receives a 12-minute active exposure and a later recall check. Deep slots and full rehearsal are additional. Categories and expected outputs below are teaching classifications. Original requirements remain authoritative.','| ID | Company | Day | Marks | Methods | Practice | Source |','|---|---|---:|---:|---|---|---|']
guide=['# Question guide','Original requirements are reproduced from the supplied Markdown. Expected outputs, pitfalls and tutor follow-ups are inferred teaching guidance, not official model answers. Each question has a source line reference.']
for q in data['questions']:
 source=f"../papers/{q['source']}";matrix.append(f"| {q['id']} | {q['name']} | {q['day']} | {q['marks']} | {q['methods']} | {q['mode']} | [{q['source']}]({source}) line {q['line']} |")
 guide.extend([f"## {q['id']} — {q['name']}",f"Source: [{q['source']}]({source}), question line {q['line']}, requirements line {q['requirementLine']}. Day {q['day']}. {q['marks']} marks.",q['requirements'],f"### Teaching route\n{q['summary']}\n\nExpected output: {q['deliverable']}\n\nPitfall: {q['pitfall']}",f"### Tutor sequence\n1. What decision and outputs does this requirement ask for?\n2. Which of these methods fits, and why: {q['methods']}?\n3. Set up the first calculation using the actual exhibit. State units and timing.\n4. Explain one implication of your result for {q['name']}.\n5. Identify an assumption which could reverse your advice and explain how.\n6. Retry the weakest step later without the notes.",f"Answer source: {q['answerUrl'] or 'No matching solution located'}\n\nStatus: {q['answerStatus']}. aCOWtancy authorship is not independently established as ACCA official."])
(out/'materials/coverage-matrix.md').write_text('\n\n'.join(matrix));(out/'materials/question-guide.md').write_text('\n\n'.join(guide))
count=collections.Counter(q['topic'] for q in data['questions'])
analysis=['# Recurring requirements and methods','Primary category counts use one manually assigned category per question. Mixed questions also contain secondary methods, so these figures do not measure technical marks or predict a future exam.','| Primary category | Questions | IDs |','|---|---:|---|']
for c,n in count.items():analysis.append('| '+c+' | '+str(n)+' | '+', '.join(q['id'] for q in data['questions'] if q['topic']==c)+' |')
analysis+=['## The repeated answer patterns','Across the corpus, calculations routinely lead to recommendations, assumptions and scenario-specific discussion. Reconstruct the method and its interpretation together. Treasury comparisons need final cash outcomes and practical suitability. Acquisitions need value creation separately from the distribution to shareholder groups. Investment appraisal needs timing, tax, currency and assumptions. Performance questions explicitly ask for missing information.','## Official ACCA guidance used','[AFM essentials](https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/introduction/advanced-financial-management-essentials-on-one-page.html) establishes the 195-minute, 50/25/25-mark format and 20 professional skills marks.','[Examining-team advice, 28 April 2025](https://studentaccountant.accaglobal.com/2025/04/28/afm-qcl/content.html) emphasises planning, the requirement verb and scepticism.',"[March/June 2024 examiner report](https://www.accaglobal.com/content/dam/acca/global/PDF-students/acca/p4/examinersreports/J24%20AFM%20examiner%27s%20report.pdf), pages 5–8 and 14: follow hedge rounding/residual instructions, develop the effect of assumptions, use a clear report, and tie recommendations to your own calculations. This is official commentary, not a full answer key for the 42 questions.",'## Practical priority','Start with methods common to multiple papers, then rotate to the less frequent questions. The curriculum retains both performance questions and the specialised VaR, bond, dividend and divestment requirements. Keep the 42-row coverage matrix as the audit of what you actually attempted.']
(out/'materials/topic-analysis.md').write_text('\n\n'.join(analysis))
source=['# Answer sources and provenance','Checked 5 September 2026. The supplied files contain complete question sections but no full answer keys or mark schemes. Some questions provide intermediate results. Preserve those as supplied facts.','## aCOWtancy alternative','The public [AFM Exam Centre](https://www.acowtancy.com/exams/acca-afm/) lists nine matching historical sittings, with separate subrequirement pages and Show answer / marks-available controls. URL month/year labels often differ from displayed exam dates. Use the company and requirement, not the slug, to match a source.','Six top-level questions in MJ26 and SD25 were checked for company/exhibit match and answer controls. Pittu Q1(ii) explanation and marking guide were actually opened and read. Other links below were observed in the catalogue and remain unverified for full content. No claim is made that all linked answers have been downloaded or checked.','### Verified Pittu margin checkpoint','[June 2026 Q1(ii)](https://www.acowtancy.com/exams/acca-afm/cbe-question/aug-2026-genuine-1ii-t): the displayed answer uses 994 short contracts, an initial margin of W£9,940,000, a Day-1 top-up of W£372,750 and a Day-2 balance of W£10,076,675. The displayed guide allocates credit to maintenance margin, Day-1 and Day-2 impacts and explanation, with a five-mark total. Our one-contract worked example reconciles to these totals. This is an aCOWtancy-displayed solution. Independent evidence that ACCA authored this exact explanation was not established.','## Coverage of answer links','| Paper/question | Link | Verification |','|---|---|---|']
for q in data['questions']:
 source.append(f"| {q['id']} | "+(f"[First subrequirement]({q['answerUrl']})" if q['answerUrl'] else 'Not located')+f" | {q['answerStatus']} |")
source+=['## Remaining answer gaps','The current specimen, both practice exams and both pre-exam mocks were not matched to complete answer sets on the public catalogue. Older historic versions may contain similar companies, but no equivalence is assumed. Use the ACCA Practice Platform’s matching sample answers/marking guides when accessible. A scheme for an older version is not automatically valid for the adapted 50/25/25-mark paper.','## ACCA browser access','The former exam tabs pointed to administrator/student-allocation pages. Automatic approval review rejected access because the target no longer matched the authorised examiner page. No exam was submitted or reset. Opening the intended AFM marking page would allow further official-answer retrieval.','## What is authoritative','Original requirements: copied source files. Official general examiner expectations: the cited ACCA pages/report. aCOWtancy answer text: third-party displayed solution, provenance qualified. Classroom methods, examples and scoring prompts: teaching guidance. Confidence, completion and readiness checks are learning diagnostics, not marks or a passing guarantee.']
(out/'materials/answer-sources.md').write_text('\n\n'.join(source))
for f in (out/'materials').glob('*.md'):(out/'materials'/f.name.replace('.md','.html')).write_text(page(f.stem.replace('-',' '),md(f.read_text())))
# Compact data only in local assets, with no external requests.
(out/'data.js').write_text('window.AFM_DATA='+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+';\nwindow.AFM_LESSONS='+json.dumps(lessons,ensure_ascii=False).replace('</','<\\/')+';')
print('Generated coverage, study materials, 14 readable paper pages and classroom data')
