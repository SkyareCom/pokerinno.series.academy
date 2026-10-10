import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {trainingSpots} from '../dist/simulator-spots.js';
// Only independent, per-spot evidence can grant certification. No heuristic shortcuts.
const evidenceDir=process.env.ACADEMY_CERT_EVIDENCE_DIR??'reports/solver/certification/evidence';
const outDir='reports/solver/certification';
mkdirSync(outDir,{recursive:true});
const sha=v=>createHash('sha256').update(v).digest('hex');
const read=p=>{try{return JSON.parse(readFileSync(p,'utf8'))}catch{return null}};
const isHash=v=>typeof v==='string'&&/^[0-9a-f]{64}$/.test(v);
const tolerance=Number(process.env.ACADEMY_STRATEGY_TOLERANCE??0.03);
if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>0.1)throw Error('Invalid action frequency tolerance');
const checks=[];
for(const spot of trainingSpots){
 const evidence=read(evidenceDir+'/'+spot.id+'.json');
 const reasons=[];
 if(!evidence){reasons.push('MISSING_EVIDENCE');checks.push({id:spot.id,certified:false,reasons});continue}
 if(evidence.spotId!==spot.id)reasons.push('WRONG_SPOT_ID');
 if(evidence.schemaVersion!==1)reasons.push('WRONG_SCHEMA');
 if(!isHash(evidence.sourceInputSha256))reasons.push('MISSING_SOURCE_HASH');
 if(!isHash(evidence.rangeSourceSha256)||!evidence.rangeSourceVerified)reasons.push('RANGE_SOURCE_NOT_VERIFIED');
 if(!Array.isArray(evidence.rangeSourceReferences)||evidence.rangeSourceReferences.length<1)reasons.push('MISSING_RANGE_REFERENCES');
 if(!Array.isArray(evidence.engines)||evidence.engines.length<2)reasons.push('MISSING_TWO_ENGINES');
 const engines=Array.isArray(evidence.engines)?evidence.engines:[];
 if(new Set(engines.map(e=>e?.name)).size<2)reasons.push('NOT_INDEPENDENT_ENGINES');
 for(const e of engines){
  if(!e?.name||!isHash(e.commitSha256)&&!(/^[a-f0-9]{40}$/.test(e?.commit??'')))reasons.push('MISSING_ENGINE_PROVENANCE');
  if(!isHash(e?.strategySha256)||!e?.converged||!Number.isFinite(e?.exploitabilityPercent)||e.exploitabilityPercent>0.3)reasons.push('UNVERIFIED_SOLVER_RESULT');
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
 checks.push({id:spot.id,certified:reasons.length===0,reasons:[...new Set(reasons)]});
}
const certified=checks.filter(x=>x.certified).length;
const report={schemaVersion:1,total:trainingSpots.length,certified,uncertified:checks.length-certified,allCertified:certified===1500,tolerance,spotChecks:checks};
writeFileSync(outDir+'/certification-registry.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,certified,uncertified:report.uncertified,allCertified:report.allCertified,firstUncertified:checks.filter(x=>!x.certified).slice(0,5)}));
if(!report.allCertified)process.exitCode=1;
