import {readdirSync,readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {inspectTexasEvidence} from './audit-twenty-certification-evidence-tasks.mjs';

const read=p=>{try{return JSON.parse(readFileSync(p,'utf8'))}catch{return null}};
export function inventorySolverEvidence(root='reports/solver/certification/raw-artifacts'){
const entries=existsSync(root)?readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name)):[];
const records=entries.map(entry=>{
 const dir=join(root,entry.name);
 const gates=read(join(dir,'twenty-evidence-tasks.json'));
 const files=Object.fromEntries(readdirSync(dir,{withFileTypes:true}).filter(x=>x.isFile()).sort((a,b)=>a.name.localeCompare(b.name)).map(file=>{
  const bytes=readFileSync(join(dir,file.name));
  const details={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
  if(file.name.endsWith('.json')){
   try{JSON.parse(bytes.toString('utf8'));details.jsonParseable=true}catch{details.jsonParseable=false}
  }
  return [file.name,details];
 }));
 // Recompute against raw input, manifest, strategy, log, exit, and current source; old gate claims are only metadata.
 const evidence=inspectTexasEvidence(dir);
 return {artifact:entry.name,files,spotId:evidence.spotId,
  reportedSpotId:gates?.spotId??null,reportedEvidenceChecksPassed:gates?.passed??null,reportedEvidenceChecksTotal:gates?.total??null,
  evidenceChecksPassed:evidence.passed,evidenceChecksTotal:evidence.total,
  failedEvidenceChecks:evidence.tasks.filter(x=>!x.passed).map(x=>x.task),
  sourceInputSha256:evidence.sourceInputSha256,
  matchingManifestSpotIds:evidence.matchingManifestSpotIds,matchingSourceSpotIds:evidence.matchingSourceSpotIds,
  selectedInputUnique:evidence.selectedInputUnique,selectedSpotIdentityValid:evidence.selectedSpotIdentityValid,
  selectedInputIntegrityValid:evidence.selectedInputIntegrityValid,selectedSourceIntegrityValid:evidence.selectedSourceIntegrityValid,
  sourceIntegrityScope:evidence.sourceIntegrityScope,
  executionExitCode:evidence.executionExitCode,finalExploitabilityPercent:evidence.finalExploitabilityPercent,
  exploitabilityPercentSamples:evidence.exploitabilityPercentSamples,
  strategyJsonValid:evidence.strategyJsonValid,solverConverged:evidence.solverConverged,
  integrityProblems:evidence.integrityProblems,
  recoveryStatus:evidence.rawSolverConverged&&evidence.matchingManifestSpotIds.length>0&&evidence.matchingSourceSpotIds.length>0?'DIAGNOSTIC_EVIDENCE_ONLY':'INCOMPLETE_OR_INVALID_RAW_EVIDENCE',
  independentlyCertified:false,
  blockers:[...evidence.integrityProblems,'Cross-engine strategy comparison absent','Verified range provenance absent']};
});
return {schemaVersion:2,artifactCount:records.length,independentlyCertified:0,records};
}
function main(){
const output='reports/solver/certification/diagnostic-inventory.json';
const report=inventorySolverEvidence();
mkdirSync('reports/solver/certification',{recursive:true});
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({artifactCount:report.artifactCount,independentlyCertified:0}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main();
