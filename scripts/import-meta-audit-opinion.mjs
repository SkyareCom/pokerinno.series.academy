import {mkdirSync,writeFileSync,existsSync,readFileSync,realpathSync} from 'node:fs';
import {resolve,dirname,basename,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyBundle,readJson,inside} from './lib/meta-audit-bundle.mjs';
const args=process.argv.slice(2),get=k=>{const i=args.indexOf(k);if(i<0||!args[i+1])throw Error('Missing '+k);return args[i+1];};
function canonicalDestination(path){
 let parent=resolve(path);const missing=[];
 while(!existsSync(parent)){missing.unshift(basename(parent));parent=dirname(parent);}
 return resolve(realpathSync(parent),...missing);
}
const within=(root,path)=>{const p=relative(root,path);return p===''||(!p.startsWith('..')&&!isAbsolute(p));};
const repo=realpathSync(fileURLToPath(new URL('../',import.meta.url)));
const root=realpathSync(get('--bundle')),input=realpathSync(get('--opinion')),output=canonicalDestination(get('--out'));
// Opinion imports may only create a separate review file. They cannot replace evidence or app files.
const protectedRoots=['dist','scripts','tests','docs','.git','.github','reports/solver/certification'].map(p=>canonicalDestination(resolve(repo,p)));
if(existsSync(output)||!/\.json$/.test(output)||output===input||within(root,output)||protectedRoots.some(p=>within(p,output))||
 (within(repo,output)&&!within(canonicalDestination(resolve(repo,'reports/meta-audit')),output)))throw Error('Output must be a new supplemental review file outside source and solver evidence');
const {manifest,spots}=verifyBundle(root),opinion=readJson(input);
const allowed=new Set(['schemaVersion','bundleSha256','reviewer','reviewedSpotIds','verdict','findings']);
if(Object.keys(opinion).some(k=>!allowed.has(k)))throw Error('Unrecognized opinion field: external opinions cannot grant certification');
if(opinion.schemaVersion!==1||opinion.bundleSha256!==manifest.bundleSha256)throw Error('Opinion refers to a different bundle');
if(typeof opinion.reviewer!=='string'||!opinion.reviewer.trim()||opinion.reviewer.length>200)throw Error('Missing reviewer label');
if(!['NO_FINDINGS_IN_REVIEWED_SCOPE','CHANGES_REQUIRED','INSUFFICIENT_EVIDENCE'].includes(opinion.verdict))throw Error('Unsupported review verdict');
const ids=opinion.reviewedSpotIds;
if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!Number.isInteger(id)||!spots.some(s=>s.id===id)))throw Error('Invalid reviewed spot coverage');
if(!Array.isArray(opinion.findings))throw Error('Missing findings array');
if(opinion.verdict==='NO_FINDINGS_IN_REVIEWED_SCOPE'&&opinion.findings.length)throw Error('Verdict disagrees with findings');
if(opinion.verdict==='CHANGES_REQUIRED'&&!opinion.findings.length)throw Error('Changes verdict requires findings');
for(const finding of opinion.findings){
 if(!finding||typeof finding!=='object'||Object.keys(finding).some(k=>!['severity','file','fileSha256','line','spotIds','description','recommendation'].includes(k)))throw Error('Invalid finding fields');
 const file=manifest.files.find(f=>f.path===finding.file);
 if(!file||file.sha256!==finding.fileSha256)throw Error('Finding references a different file/hash');
 if(!['CRITICAL','HIGH','MEDIUM','LOW'].includes(finding.severity))throw Error('Invalid severity');
 if(!Number.isInteger(finding.line)||finding.line<1||finding.line>readFileSync(inside(root,file.path),'utf8').split('\n').length)throw Error('Invalid cited line');
 if(!Array.isArray(finding.spotIds)||new Set(finding.spotIds).size!==finding.spotIds.length||finding.spotIds.some(id=>!ids.includes(id)))throw Error('Finding references an unreviewed spot');
 for(const key of ['description','recommendation'])if(typeof finding[key]!=='string'||!finding[key].trim()||finding[key].length>10000)throw Error('Missing finding '+key);
}
const unreviewedByStreet=Object.fromEntries(['pre','flop','turn','river'].map(st=>[st,spots.filter(s=>s.street===st&&!ids.includes(s.id)).length]));
const report={...opinion,importedAt:new Date().toISOString(),reviewedSpotCount:ids.length,fullCoverage:ids.length===1500,unreviewedByStreet,
 reviewerIdentityVerified:false,certificationEffect:'NONE',independentlyCertified:false,
 limitation:'This is an attributed supplemental opinion. Identity and conclusions require human review; solver and release gates remain unchanged.'};
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({reviewedSpotCount:ids.length,fullCoverage:report.fullCoverage,findings:opinion.findings.length,certificationEffect:'NONE'}));
