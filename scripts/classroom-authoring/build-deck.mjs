import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/timboi/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs';
const base='/Users/timboi/Documents/Codex/2026-09-05/afm-classroom';
const lessons=JSON.parse(await fs.readFile(base+'/.build/lessons.json','utf8'));
const data=JSON.parse(await fs.readFile(base+'/.build/data.json','utf8'));
const font=resolvePresentationFont(); console.log('FONT',font);
const p=Presentation.create({slideSize:{width:1280,height:720}});
function text(s,t,x,y,w,h,size,color='#203C39',bold=false){let a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none'};return a;}
for(let i=0;i<lessons.length;i++){
 const l=lessons[i],s=p.slides.add();s.background.fill='#F6F5EF';
 text(s,l.title,76,62,1128,104,48,'#203C39',true);
 text(s,l.body,76,192,1128,265,31);
 text(s,'YOUR TURN',76,502,1128,30,18,'#526D65',true);
 text(s,l.prompt,76,543,1100,100,27);
 text(s,`${String(i+1).padStart(2,'0')} / ${lessons.length}     Answer and sources in speaker notes`,76,668,1128,25,15,'#526D65');
 const refs=l.refs.map(r=>{let q=data.questions.find(q=>q.id===r);return q?`${q.id}: ../papers/${q.source}, Question starts line ${q.line}, requirements line ${q.requirementLine}.`:r});
 s.speakerNotes.textFrame.setText(`TEACHING CHECKPOINT. Attempt before reading.\nHint: ${l.hint}\n\n${l.answer}\n\nSources:\n${refs.join('\n')||'User study dates and source-corpus classification. Teaching workflow is author-created.'}\n\nFull original requirements and staged practice are in the local classroom. No complete official mark schemes were included in the supplied Markdown files.`);
}
await (await PresentationFile.exportPptx(p)).save(base+'/.build/candidate.pptx');
const sk='/Users/timboi/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
await finalizePresentation({workspaceDir:base,candidatePath:base+'/.build/candidate.pptx',finalPath:base+'/materials/AFM-learning-deck.pptx',pythonExecutable:'/Users/timboi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:sk+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:sk+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:base+'/.build/deck-validation.json'});
await fs.mkdir(base+'/.build/render',{recursive:true});
for(let i=0;i<p.slides.items.length;i++){const bytes=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(base+`/.build/render/slide-${String(i+1).padStart(2,'0')}.png`,new Uint8Array(await bytes.arrayBuffer()));console.log('rendered',i+1);}
