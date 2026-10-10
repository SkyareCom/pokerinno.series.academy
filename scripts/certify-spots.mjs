import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

// Independent, fail-closed certification. Input is an evidence bundle, never a UI spot flag.
export const sha256 = value => createHash('sha256').update(value).digest('hex');
const hex = x => typeof x==='string' && /^[a-f0-9]{64}$/.test(x);
const finite = x => typeof x==='number' && Number.isFinite(x);
const validStrategy = x => x && typeof x==='object' && !Array.isArray(x) &&
  Object.keys(x).length>0 && Object.values(x).every(actions =>
    actions && typeof actions==='object' && !Array.isArray(actions) &&
    Object.keys(actions).length>0 && Object.values(actions).every(v=>finite(v)&&v>=0&&v<=1) &&
    Math.abs(Object.values(actions).reduce((a,b)=>a+b,0)-1)<=0.001);
const compare = (a,b,tolerance) => {
  const hands=Object.keys(a).sort();
  if(JSON.stringify(hands)!==JSON.stringify(Object.keys(b).sort()))return false;
  return hands.every(h=> {
    const keys=Object.keys(a[h]).sort();
    return JSON.stringify(keys)===JSON.stringify(Object.keys(b[h]).sort()) &&
      keys.every(k=>Math.abs(a[h][k]-b[h][k])<=tolerance);
  });
};
export function certifySpot(spot,evidence,options={}) {
  const failures=[];
  const requireGate=(name,ok)=>{if(!ok)failures.push(name)};
  const tolerance=options.tolerance??0.03;
  const target=options.maxExploitabilityPercent??0.3;
  requireGate('spot_id',Number.isInteger(spot?.id)&&spot.id>=1&&spot.id<=1500);
  requireGate('evidence_id',evidence?.spotId===spot?.id);
  requireGate('source_hash',hex(evidence?.sourceHash)&&evidence.sourceHash===sha256(JSON.stringify(spot)));
  requireGate('range_provenance',evidence?.ranges?.verified===true&&hex(evidence.ranges.sourceHash)&&
    typeof evidence.ranges.sourceId==='string'&&evidence.ranges.sourceId.length>0 &&
    evidence.ranges.method!=='heuristic'&&evidence.ranges.method!=='ACADEMY_HEURISTIC_UNVERIFIED');
  const runs=Array.isArray(evidence?.runs)?evidence.runs:[];
  requireGate('two_independent_engines',runs.length>=2&&new Set(runs.map(r=>r.engine)).size>=2);
  for(const [i,r] of runs.entries()){
    requireGate('run_'+i+'_identity',typeof r.engine==='string'&&r.engine.length>0&&hex(r.engineCommit)&&hex(r.inputHash)&&hex(r.outputHash));
    requireGate('run_'+i+'_convergence',r.exitCode===0&&r.converged===true&&finite(r.exploitabilityPercent)&&r.exploitabilityPercent>=0&&r.exploitabilityPercent<=target);
    requireGate('run_'+i+'_strategy',validStrategy(r.strategy));
    requireGate('run_'+i+'_same_source',r.sourceHash===evidence?.sourceHash&&r.rangeSourceHash===evidence?.ranges?.sourceHash);
    requireGate('run_'+i+'_output_integrity',hex(r.outputHash)&&r.outputHash===sha256(JSON.stringify(r.strategy)));
  }
  if(runs.length>=2&&runs.every(r=>validStrategy(r.strategy))){
    requireGate('cross_engine_action_agreement',runs.slice(1).every(r=>compare(runs[0].strategy,r.strategy,tolerance)));
  }else requireGate('cross_engine_action_agreement',false);
  const certified=failures.length===0;
  return {schemaVersion:1,spotId:spot?.id??null,status:certified?'CERTIFIED':'BLOCKED',certified,
    failures,engineCount:new Set(runs.map(r=>r.engine)).size,
    policy:{maxExploitabilityPercent:target,maxActionFrequencyDifference:tolerance},
    evidenceHash:sha256(JSON.stringify(evidence))};
}
export function auditCatalog(spots,bundles,options={}) {
  const seen=new Set();
  const records=spots.map(spot=>{
    const bundle=bundles.find(x=>x?.spotId===spot.id);
    const record=certifySpot(spot,bundle,options);
    if(seen.has(spot.id))record.failures.push('duplicate_spot_id');
    seen.add(spot.id);
    record.certified=record.failures.length===0;
    record.status=record.certified?'CERTIFIED':'BLOCKED';
    return record;
  });
  return {schemaVersion:1,total:records.length,certified:records.filter(x=>x.certified).length,
    blocked:records.filter(x=>!x.certified).length,records};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
  const [spotsPath,evidencePath,outputPath='reports/solver/certification-ledger.json']=process.argv.slice(2);
  if(!spotsPath||!evidencePath)throw Error('Usage: node scripts/certify-spots.mjs spots.json evidence-bundles.json [output.json]');
  const spots=JSON.parse(readFileSync(spotsPath,'utf8'));
  const bundles=JSON.parse(readFileSync(evidencePath,'utf8'));
  if(!Array.isArray(spots)||!Array.isArray(bundles))throw Error('Expected arrays of spots and evidence bundles');
  const ledger=auditCatalog(spots,bundles);
  mkdirSync(dirname(outputPath),{recursive:true});
  writeFileSync(outputPath,JSON.stringify(ledger,null,2)+'\n');
  console.log(JSON.stringify({total:ledger.total,certified:ledger.certified,blocked:ledger.blocked,outputPath}));
  if(ledger.blocked)process.exitCode=1;
}
