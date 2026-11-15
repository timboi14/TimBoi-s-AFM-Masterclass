from pathlib import Path
import json,re,shutil,hashlib
import argparse
REPO=Path(__file__).resolve().parents[1];ROOT=REPO.parent
parser=argparse.ArgumentParser();parser.add_argument('--cache-dir',type=Path,default=REPO/'.private-library-build');args=parser.parse_args();WORK=args.cache_dir;EX=WORK/'extracted'
source=(REPO/'src/data/curriculum.ts').read_text();SUBJECT=re.search(r'export const SUBJECT = \"(AFM|APM)\"',source).group(1)
def read(id):return json.loads((EX/f'{id}.json').read_text())
APM_WORDS=[('Performance reports for management',['performance report','reporting','information needs']),('Information systems and technology',['information system','big data','data analytics','technology','information technology','data science']),('Budgeting and control',['budget','variance']),('Financial performance measures',['eva','shareholder','return on','residual income','financial performance']),('Non-financial performance indicators',['non-financial','balanced scorecard','customer satisfaction','net promoter']),('Not-for-profit performance',['not-for-profit','value for money','public sector','hospital','university']),('Quality and performance improvement',['quality','six sigma','target cost','activity-based','business process','lean','just in time']),('Human resource aspects',['reward','remuneration','bonus','appraisal','motivation']),('Environmental, social and governance factors',['environmental','sustainability','carbon']),('Strategy and performance',['critical success','mission','strategy','benchmark']),('Business structure and performance management',['structure','outsourcing','service level','divisional'])]
AFM_WORDS=[('Foreign exchange hedging',['currency futures','currency options','money market hedge','exchange rate risk','foreign exchange risk']),('Interest rate hedging',['interest rate futures','interest rate swap','forward rate agreement','interest rate risk']),('Corporate reconstruction and reorganisation',['reconstruction','demerger','restructuring','unbundling']),('Acquisitions and mergers',['acquisition','synergy','takeover','merger']),('Risk-adjusted WACC and APV',['adjusted present value','apv','ungeared','unlevered']),('Option pricing',['black-scholes','black–scholes','option to','real option']),('International operations and investment',['remitt','overseas','withholding','international investment']),('Business valuation',['free cash flow','valuation','dividend growth']),('Dividend policy',['dividend policy','dividend capacity']),('Weighted average cost of capital',['wacc','cost of capital','cost of equity']),('Investment appraisal',['net present value','npv','investment appraisal'])]
legacy=re.compile(r'\b(transfer pric\w*|BCG|five forces|McKinsey|MIRR|IRR|performance prism|corporate failure|Altman|Argenti)\b',re.I)
def classify(text,subject):
 choices=APM_WORDS if subject=='APM' else AFM_WORDS
 scores=[(sum(len(re.findall(re.escape(k),text,re.I))*max(1,len(k.split())) for k in terms),label) for label,terms in choices]
 score,label=max(scores)
 return label if score else ('Introduction to performance management' if subject=='APM' else 'Role and responsibility of the financial manager')
TITLES={'afm-text':'AFM Study Text · Kaplan','afm-kit':'AFM Exam Kit · 2026–27','afm-top51':'Top 51 AFM questions and study guide','afm-gamechanger':'AFM December 2026 Game Changer · annotated','afm-sauce':'AFM Super Secret Sauce · September 2026','apm-pocket':'APM Pocket Notes · mixed edition','apm-text':'APM Study Text · 2026–27','apm-kit':'APM Exam Kit · 2026–27','apm-summary':'APM Summarized Notes · September 2026–June 2027','apm-revision':'APM 102-page Revision Summary','apm-vifhe':'APM Summarized Notes · VIFHE','apm-slides':'APM Revision Summary · slides','apm-mock':'APM 2026 Mock · supplied solutions','afm-syllabus':'ACCA AFM syllabus · 2026–27','apm-syllabus':'ACCA APM syllabus · 2026–27'}
report=[]
for subject,repo in [(SUBJECT,REPO.name)]:
 pre=subject.lower(); out=ROOT/repo/'public/personal-library';out.mkdir(parents=True,exist_ok=True);(out/'originals').mkdir(exist_ok=True);(out/'extracts').mkdir(exist_ok=True)
 docs=[];tasks=[];modules=json.loads(source.split('export const MODULES = ',1)[1].rstrip().removesuffix(';'))
 ids=[i for i in TITLES if i.startswith(pre+'-')]
 for id in ids:
  d=read(id);src=Path(d['path']);kind='pdf' if src.suffix=='.pdf' else 'slides' if src.suffix=='.pptx' else 'workbook'
  original=f'originals/{id}{src.suffix}';content=f'extracts/{id}.json';shutil.copy2(src,out/original)
  # Keep no machine-local file paths or extraction metadata in the browser payload.
  (out/content).write_text(json.dumps({'pages':d['pages']},ensure_ascii=False))
  note='Unchanged original supplied by you. Physical page numbers include front matter.'
  if id=='apm-pocket':note='Older syllabus material: transfer pricing and other retired areas remain in this original. Mixed blocks are excluded from the current plan.'
  if id in ['apm-revision','apm-vifhe','apm-slides']:note='Supplementary notes contain some retired topics. Mixed blocks are labelled and excluded from current scheduling. Check current teachings against the 2026–27 text.'
  if id=='apm-mock':note='Solutions only: the original question paper was not supplied. Use for debrief and answer technique, not as an unseen mock.'
  if id=='afm-top51':note='Tutor recommendations, not a prediction of exam coverage. The sheet contains 51 named entries plus a general recommendation in row 52.'
  if id=='afm-gamechanger':note='Image-based questions and handwritten notes. Original page images are included so extraction cannot omit the questions.'
  if id=='afm-text':note='The supplied text is copyright 2025. ACCA reports no AFM syllabus changes for 2026–27. Use the current kit for adapted practice.'
  if id.endswith('syllabus'):note='Official ACCA September 2026–June 2027 study guide, checked 15 November 2026.'
  docs.append(dict(id=id,title=TITLES[id],filename=src.name,pages=len(d['pages']),kind=kind,sha256=d['sha256'],original=original,content=content,note=note))
 # Entire textbook chapters divided into manageable sessions, including illustrations and tests.
 for module in modules:
  for start in range(module['start'],module['end']+1,8):
   end=min(start+7,module['end']);tasks.append(dict(id=f'{pre}-text-{start}',title=f'{module["title"]} · pp. {start}–{end}',source=f'{pre}-text',start=start,end=end,topic=module['title'],kind='learn',minutes=(end-start+1)*4,status='current'))
 # Parse the publisher's index instead of guessing where questions and solutions end.
 kit=read(f'{pre}-kit');index='\n'.join(p['text'] for p in kit['pages'][7:10]);offset=27 if pre=='afm' else 29
 entries=[]
 for line in index.splitlines():
  m=re.match(r'^\s*(\d+)\s+(.+?)\s+(\d+)\s+(\d+)\s+((?:Mar|Jun|Sep|Dec).*)$',line)
  if m: entries.append(dict(number=int(m[1]),name=m[2].strip(),q=int(m[3])+offset,a=int(m[4])+offset,session=m[5].strip()))
 assert len(entries)==(79 if pre=='afm' else 63),(pre,len(entries))
 # Verified publisher index erratum: Amberle answer begins on printed 371 (PDF 398), not 372.
 if pre=='afm': next(e for e in entries if e['number']==40)['a']=398
 for i,e in enumerate(entries):
  end=entries[i+1]['q']-1 if i+1<len(entries) else (150 if pre=='afm' else 148)+offset
  ae=entries[i+1]['a']-1 if i+1<len(entries) else (518 if pre=='afm' else 432)+offset
  text='\n'.join(p['text'] for p in kit['pages'][e['q']-1:end])
  assert e['name'].split()[0].lower() in kit['pages'][e['q']-1]['text'].lower(),e
  # Publisher index is the primary boundary; OCR sometimes drops letters in headings.
  if e['name'].split()[0].lower() not in kit['pages'][e['a']-1]['text'].lower(): print('CHECK answer heading',pre,e)
  tasks.append(dict(id=f'{pre}-kit-{e["number"]}',title=f'{e["number"]}. {e["name"]} · {e["session"]}',source=f'{pre}-kit',start=e['q'],end=end,answerStart=e['a'],answerEnd=ae,topic=classify(text,subject),kind='practice',minutes=125 if e['number']<=(23 if pre=='afm' else 21) else 65,status='current',caution='Publisher-adapted past question. Use the marks and requirements in this source version.'))
 specimens=[('Kingtim',546,548,554,560),('Colvin',549,550,561,563),('Boullain',551,552,564,569)] if pre=='afm' else [('Deeland Police',462,464,470,475),('Coruisk',465,466,476,478),('Totaig',467,469,479,482)]
 for i,(name,a,b,c,d) in enumerate(specimens,1):
  text='\n'.join(p['text'] for p in kit['pages'][a-1:b]);tasks.append(dict(id=f'{pre}-specimen-{i}',title=f'Specimen Q{i} · {name}',source=f'{pre}-kit',start=a,end=b,answerStart=c,answerEnd=d,topic=classify(text,subject),kind='practice',minutes=125 if i==1 else 65,status='current'))
 # Textbook final question section remains complete, with answers accessible in original.
 if pre=='afm':tasks.append(dict(id='afm-text-consolidation',title='Textbook Questions and Answers · consolidation',source='afm-text',start=579,end=623,topic='Mixed consolidation',kind='revision',minutes=120,status='current',caution='This chapter includes both questions and answers. Cover the answers before attempting.'))
 for doc in docs:
  if doc['id'].endswith(('-text','-kit','-top51')):continue
  data=read(doc['id']);size=4 if doc['id']=='apm-summary' else 6
  for start in range(1,doc['pages']+1,size):
   end=min(start+size-1,doc['pages']);text='\n'.join(p['text'] for p in data['pages'][start-1:end]);terms=sorted(set(x.lower() for x in legacy.findall(text))) if pre=='apm' and not doc['id'].endswith('-syllabus') else []
   status='mixed' if terms else 'current';caution='Contains historical material: '+', '.join(terms)+'. Use only current-syllabus portions.' if terms else ''
   if doc['id']=='apm-mock':caution='Solutions only. Original mock questions were not supplied.'
   tasks.append(dict(id=f'{doc["id"]}-{start}',title=f'{doc["title"]} · {"slides" if doc["kind"]=="slides" else "pp."} {start}–{end}',source=doc['id'],start=start,end=end,topic=classify(text,subject),kind='revision',minutes=(end-start+1)*3,status=status,caution=caution))
 # Preserve all 51 recommendations and only link explicit, verified name variants.
 top51=[]
 if pre=='afm':
  rows=read('afm-top51')['pages'][0]['rows']
  aliases={'hathway':'hathaway','chithrust':'chithurst','fitzharis':'fitzharris','parafuel':'para fuels','littlebrid':'littlebredy','fonder':'fondir','kerrin and danton':'kerrin','armstrong':'the armstrong group'}
  norm=lambda s:re.sub(r'\b(co|company|limited|group)\b|[^a-z0-9 ]','',s.lower()).strip()
  for row in rows:
   c=row['cells']; vals=list(c.values())
   if not vals or not re.fullmatch(r'\d+',vals[0]) or not 1<=int(vals[0])<=51:continue
   name=vals[1];key=norm(name);key=aliases.get(key,key);matched=next((e for e in entries if norm(e['name'])==norm(key)),None)
   item=dict(name=name,reference=vals[2],topic=c.get('E',''),row=row['row'])
   if matched:
    item['matchedTask']=f'afm-kit-{matched["number"]}'
    next(t for t in tasks if t['id']==item['matchedTask'])['priority']=True
   top51.append(item)
  assert len(top51)==51,len(top51)
  next(r for r in top51 if r['name']=='Colvin')['matchedTask']='afm-specimen-2'
  next(t for t in tasks if t['id']=='afm-specimen-2')['priority']=True
 # Render the image-based annotated handout when PyMuPDF is available.
 if pre=='afm':
  try:
   import fitz
   (out/'images').mkdir(exist_ok=True);pdf=fitz.open(out/'originals/afm-gamechanger.pdf');p=out/'extracts/afm-gamechanger.json';data=json.loads(p.read_text())
   for i,page in enumerate(pdf):
    image=f'images/afm-gamechanger-{i+1}.png';page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(str(out/image));data['pages'][i]['image']=image
   p.write_text(json.dumps(data,ensure_ascii=False))
  except ImportError:
   raise SystemExit('Install PyMuPDF to preserve the scanned Game Changer pages, then rerun the build.')
 # Interleave concept blocks with practice within each topic, then supplementary revision.
 ordered=[]; primary=[t for t in tasks if t['kind']!='revision']; supplementary=[t for t in tasks if t['kind']=='revision']
 for topic in [m['title'] for m in modules]+list(dict.fromkeys(t['topic'] for t in primary)):
  learn=[t for t in primary if t['topic']==topic and t['kind']=='learn' and t not in ordered]; qs=[t for t in primary if t['topic']==topic and t['kind']=='practice' and t not in ordered]
  qs.sort(key=lambda t: not t.get('priority',False))
  while learn or qs:
   ordered.extend(learn[:2]);learn=learn[2:]
   if qs:ordered.append(qs.pop(0))
 ordered+=supplementary
 assert len(ordered)==len(tasks)
 catalog=dict(version=1,subject=subject,verifiedOn='2026-11-15',documents=docs,tasks=ordered,top51=top51 or None)
 (out/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
 (out/'README.txt').write_text(f'{subject} PERSONAL STUDY LIBRARY\nOpen /study-room on your {subject} site and choose Import personal library folder. Select this entire folder.\nOriginal files are unchanged and verified by SHA-256 during import.\nSources live in browser IndexedDB. Progress is included in the site Settings backup. Keep this folder for source recovery.\nQuestion numbers and physical PDF page boundaries come from each publisher index.\nDo not treat Top 51 as an exam prediction. Mixed APM blocks are excluded from the current plan.\n')
 for t in tasks:
  doc=next(d for d in docs if d['id']==t['source']);assert 1<=t['start']<=t['end']<=doc['pages'],t
  if 'answerStart'in t:assert t['end']<t['answerStart']<=t['answerEnd']<=doc['pages'],t
 report.append(dict(subject=subject,documents=len(docs),pages=sum(d['pages'] for d in docs),tasks=len(tasks),practice=sum(t['kind']=='practice' for t in tasks),mixed=sum(t['status']=='mixed' for t in tasks),top51Matched=sum('matchedTask'in r for r in top51),hours=sum(t['minutes']for t in tasks if t['status']=='current')/60))
print(json.dumps(report,indent=2));(WORK/'coverage.json').write_text(json.dumps(report,indent=2))
