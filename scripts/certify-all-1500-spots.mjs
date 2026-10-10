import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {trainingSpots} from '../dist/simulator-spots.js';
import {spawnSync} from 'node:child_process';
// Only independent, per-spot evidence can grant certification. No heuristic shortcuts.
const evidenceDir=process.env.ACADEMY_CERT_EVIDENCE_DIR??'reports/solver/certification/evidence';
const outDir='reports/solver/certification';
mkdirSync(outDir,{recursive:true});
const sha=v=>createHash('sha256').update(v).digest('hex');
const read=p=>{try{return JSON.parse(readFileSync(p,'utf8'))}catch{return null}};
const isHash=v=>typeof v==='string'&&/^[0-9a-f]{64}$/.test(v);
const tolerance=Number(process.env.ACADEMY_STRATEGY_TOLERANCE??0.03);
if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>0.03)throw Error('Invalid action frequency tolerance (maximum 3 percentage points)');
const expectedCounts={pre:720,flop:450,turn:225,river:105};
for(const [street,count] of Object.entries(expectedCounts))if(trainingSpots.filter(s=>s.street===street).length!==count)throw Error('Street distribution changed: '+street);
const checks=[];
for(const spot of trainingSpots){
 const evidence=read(evidenceDir+'/'+spot.id+'.json');
 const reasons=[];
 if(!evidence){
  reasons.push('MISSING_EVIDENCE');
  if(spot.street==='pre')reasons.push('PREFLOP_MODEL_NOT_INDEPENDENTLY_REPRODUCED');
  else{
   reasons.push('MISSING_TWO_VERIFIED_POSTFLOP_EXPORTS');
   if(spot.rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED')reasons.push('HEURISTIC_RANGE_UNVERIFIED');
  }
  checks.push({id:spot.id,street:spot.street,certified:false,reasons});continue;
 }
 if(evidence.spotId!==spot.id)reasons.push('WRONG_SPOT_ID');
 if(evidence.schemaVersion!==1)reasons.push('WRONG_SCHEMA');
 if(!isHash(evidence.sourceInputSha256))reasons.push('MISSING_SOURCE_HASH');
 if(!isHash(evidence.spotSourceSha256)||evidence.spotSourceSha256!==sha(JSON.stringify(spot)))reasons.push('SPOT_SOURCE_INTEGRITY_MISMATCH');
 if(!isHash(evidence.rangeSourceSha256)||!evidence.rangeSourceVerified)reasons.push('RANGE_SOURCE_NOT_VERIFIED');
 if(!Array.isArray(evidence.rangeSourceReferences)||evidence.rangeSourceReferences.length<1)reasons.push('MISSING_RANGE_REFERENCES');
 if(!Array.isArray(evidence.engines)||evidence.engines.length<2)reasons.push('MISSING_TWO_ENGINES');
 const engines=Array.isArray(evidence.engines)?evidence.engines:[];
 if(new Set(engines.map(e=>e?.name)).size<2||engines.some(e=>typeof e?.name!=='string'||!e.name.trim()))reasons.push('NOT_INDEPENDENT_ENGINES');
 for(const e of engines){
  if(!e?.name||!isHash(e.commitSha256)&&!(/^[a-f0-9]{40}$/.test(e?.commit??'')))reasons.push('MISSING_ENGINE_PROVENANCE');
  if(!isHash(e?.strategySha256)||!e?.converged||!Number.isFinite(e?.exploitabilityPercent)||e.exploitabilityPercent<0||e.exploitabilityPercent>0.3)reasons.push('UNVERIFIED_SOLVER_RESULT');
  if(!isHash(e?.inputSha256)||e.inputSha256!==evidence.sourceInputSha256)reasons.push('ENGINE_INPUT_INTEGRITY_MISMATCH');
  if(!isHash(e?.rangeSourceSha256)||e.rangeSourceSha256!==evidence.rangeSourceSha256)reasons.push('ENGINE_RANGE_INTEGRITY_MISMATCH');
  if(!e?.actionFrequencies||e.strategySha256!==sha(JSON.stringify(e.actionFrequencies)))reasons.push('ENGINE_STRATEGY_HASH_MISMATCH');
 }
 const [a,b]=engines;
 const x=a?.actionFrequencies,y=b?.actionFrequencies;
 if(!x||!y||typeof x!=='object'||typeof y!=='object')reasons.push('MISSING_ACTION_FREQUENCIES');
 else{
  const keys=Object.keys(x);
  if(!keys.length||keys.length!==Object.keys(y).length||keys.some(k=>!(k in y)))reasons.push('MISMATCHED_ACTION_SET');
  else if(keys.some(k=>!Number.isFinite(x[k])||!Number.isFinite(y[k])||x[k]<0||y[k]<0||x[k]>1||y[k]>1||Math.abs(x[k]-y[k])>tolerance))reasons.push('STRATEGY_DISAGREEMENT');
  else if(Math.abs(keys.reduce((s,k)=>s+x[k],0)-1)>0.01||Math.abs(keys.reduce((s,k)=>s+y[k],0)-1)>0.01)reasons.push('INVALID_STRATEGY_NORMALIZATION');
 }
 if(spot.street==='pre'&&evidence.preflopModelVerified!==true)reasons.push('PREFLOP_MODEL_NOT_VERIFIED');
 if(spot.street!=='pre'&&spot.rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED'&&evidence.heuristicRangeReplaced!==true)reasons.push('HEURISTIC_RANGE_UNVERIFIED');
 // A JSON file claiming successful execution is not proof. Re-read raw outputs,
 // exact configurations, source inputs and measured convergence through the comparator.
 if(!Array.isArray(evidence.comparisonFiles)||evidence.comparisonFiles.length!==2||evidence.comparisonFiles.some(p=>typeof p!=='string'||!existsSync(p)))reasons.push('MISSING_REPRODUCIBLE_COMPARISON');
 else{
  const output=outDir+'/registry-comparison-'+spot.id+'.json';
  const run=spawnSync(process.execPath,['scripts/compare-solver-exports.mjs',...evidence.comparisonFiles,output],{encoding:'utf8'});
  const comparison=read(output),normalized=evidence.comparisonFiles.map(read);
  if(run.status!==0||comparison?.crossEngineMatched!==true||comparison.spotId!==spot.id)reasons.push('REPRODUCIBLE_COMPARISON_REJECTED');
  for(let i=0;i<2;i++){
   const n=normalized[i],e=engines[i];
   if(!n||!e||n.spotId!==spot.id||n.inputHash!==evidence.sourceInputSha256||n.rangeHash!==evidence.rangeSourceSha256||
    n.engine!==e.name||n.engineCommit!==e.commit||JSON.stringify(n.actionFrequencies)!==JSON.stringify(e.actionFrequencies))reasons.push('CERTIFICATE_EXPORT_MISMATCH');
  }
 }
 checks.push({id:spot.id,street:spot.street,certified:reasons.length===0,reasons:[...new Set(reasons)]});
}
const certified=checks.filter(x=>x.certified).length;
const report={schemaVersion:1,total:trainingSpots.length,certified,uncertified:checks.length-certified,allCertified:certified===1500,tolerance,spotChecks:checks};
report.byStreet=Object.fromEntries(Object.keys(expectedCounts).map(street=>{
 const rows=checks.filter(r=>r.street===street),certified=rows.filter(r=>r.certified).length;
 return [street,{total:rows.length,certified,blocked:rows.length-certified}];
}));
report.blockReasonCounts={};
for(const check of checks)for(const reason of check.reasons)report.blockReasonCounts[reason]=(report.blockReasonCounts[reason]??0)+1;
writeFileSync(outDir+'/certification-registry.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,certified,uncertified:report.uncertified,allCertified:report.allCertified,firstUncertified:checks.filter(x=>!x.certified).slice(0,5)}));
if(!report.allCertified)process.exitCode=1;
