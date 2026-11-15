from pathlib import Path
import json,hashlib,zipfile,xml.etree.ElementTree as ET, urllib.request
from pypdf import PdfReader
from openpyxl import load_workbook
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--source-dir',type=Path,default=Path.home()/'Downloads');parser.add_argument('--cache-dir',type=Path,default=Path(__file__).resolve().parents[1]/'.private-library-build');args=parser.parse_args()
root=args.cache_dir;root.mkdir(parents=True,exist_ok=True);out=root/'extracted';out.mkdir(exist_ok=True)
files=[('afm-text','AFM (text).pdf'),('afm-kit','AFM Exam Kit 2026-27 ISDC_260905_165351.pdf'),('afm-top51','TOP 51 AFM QUESTIONS FOR SEPT 2026 and relevant guide.xlsx'),('afm-gamechanger','ACCA AFM DEC 26 - Game Changer Day # 1 - with notings.pdf'),('afm-sauce','Super Secret Sauce - Sept 2026.pdf'),('apm-pocket','APM Pocket Notes .pdf'),('apm-text','APM Study Text 2026-27 ISDC.pdf'),('apm-kit','APM Exam Kit 2026-27 ISDC.pdf'),('apm-summary','APM Summarized Notes_Sep26-Jun27_260902_132823.pdf'),('apm-revision','ACCA APM 102 pages Revision Summary.pdf'),('apm-vifhe','ACCA APM Summarized notes VIFHE.pdf'),('apm-slides','ACCA APM Revision Summary.pptx'),('apm-mock','APM 2026 Mock Exam Solution.pdf')]
for subject,part,name in [('afm','p4','afm_s26_j27_syllabus_and_study_guide.pdf'),('apm','p5','apm_s26_j27%20syllabus%20and%20study%20guide.pdf')]:
 url=f'https://www.accaglobal.com/content/dam/acca/global/PDF-students/acca/{part}/studyguides/{name}'
 target=root/f'{subject}-syllabus.pdf'
 if not target.exists(): urllib.request.urlretrieve(url,target)
 files.append((f'{subject}-syllabus',str(target)))
manifest=[]
for id,name in files:
 p=Path(name) if name.startswith('/') else args.source_dir/name
 dest=out/f'{id}.json'
 if dest.exists() and json.loads(dest.read_text()).get('sha256') == hashlib.sha256(p.read_bytes()).hexdigest():
  data=json.loads(dest.read_text())
 else:
  pages=[]; toc=[]
  if p.suffix=='.pdf':
   reader=PdfReader(p)
   for i,page in enumerate(reader.pages):
    text=page.extract_text() or ''
    pages.append({'page':i+1,'text':text})
  elif p.suffix=='.xlsx':
   book=load_workbook(p,data_only=True)
   for i,s in enumerate(book):
    rows=[{'row':r[0].row,'cells':{c.column_letter:str(c.value) for c in r if c.value is not None}} for r in s if any(c.value is not None for c in r)]
    pages.append({'page':i+1,'title':s.title,'rows':rows,'text':'\n'.join(' | '.join(r['cells'].values()) for r in rows)})
  else:
   with zipfile.ZipFile(p) as z:
    names=sorted([n for n in z.namelist() if __import__('re').match(r'ppt/slides/slide\d+.xml$',n)],key=lambda n:int(__import__('re').search(r'slide(\d+)',n).group(1)))
    for i,n in enumerate(names):
     x=ET.fromstring(z.read(n)); txt='\n'.join(t.text or '' for t in x.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'))
     pages.append({'page':i+1,'text':txt})
  data={'id':id,'filename':p.name,'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'pages':pages}
  dest.write_text(json.dumps(data,ensure_ascii=False))
  (out/f'{id}.txt').write_text('\n\n'.join(f'=== PAGE {x["page"]} ===\n{x["text"]}' for x in pages))
 info={k:v for k,v in data.items() if k!='pages'}; info['pageCount']=len(data['pages']); info['lowTextPages']=[x['page'] for x in data['pages'] if len(x['text'].strip())<70]
 manifest.append(info); print(id,info['pageCount'],'pages; low text',info['lowTextPages'][:25],flush=True)
(root/'manifest.json').write_text(json.dumps(manifest,indent=2))
