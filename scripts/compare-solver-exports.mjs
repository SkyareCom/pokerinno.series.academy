import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname} from 'node:path';
import {canonicalScenario,pinnedEngines,parseTexasResult,parseDcfrResult,readConvergence,renderTexasInput,renderDcfrInput} from './lib/independent-solver-adapters.mjs';
import {trainingSpots} from '../dist/simulator-spots.js';
const hash=s=>createHash('sha256').update(s).digest('hex');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const [aPath,bPath,outPath='reports/solver/certification/cross-engine-comparison.json']=process.argv.slice(2);
if(!aPath||!bPath)throw Error('Usage: node scripts/compare-solver-exports.mjs texas.json dcfr-or-gtoplus.json [report.json]');
const a=read(aPath),b=read(bPath);
const reasons=[];
const fail=(reason,ok)=>{if(!ok)reasons.push(reason)};
fail('SPOT_MISMATCH',Number.isInteger(a.spotId)&&a.spotId===b.spotId);
fail('INDEPENDENT_ENGINE_REQUIRED',typeof a.engine==='string'&&typeof b.engine==='string'&&a.engine!==b.engine);
fail('INPUT_HASH_MISMATCH',typeof a.inputHash==='string'&&a.inputHash.length===64&&a.inputHash===b.inputHash);
fail('RANGE_HASH_MISMATCH',typeof a.rangeHash==='string'&&a.rangeHash.length===64&&a.rangeHash===b.rangeHash);
fail('TREE_HASH_MISMATCH',typeof a.treeHash==='string'&&a.treeHash.length===64&&a.treeHash===b.treeHash);
for(const [name,r] of [['A',a],['B',b]]){
 fail(name+'_NOT_CONVERGED',r.converged===true&&Number.isFinite(r.exploitabilityPercent)&&r.exploitabilityPercent>=0&&r.exploitabilityPercent<=0.3);
 fail(name+'_MISSING_PROVENANCE',typeof r.engineCommit==='string'&&r.engineCommit.length>=40&&typeof r.rawOutputHash==='string'&&r.rawOutputHash.length===64);
 fail(name+'_RANGE_UNVERIFIED',r.rangeVerified===true);
 const pin=pinnedEngines[r.engine];
 fail(name+'_UNSUPPORTED_ENGINE_PROVENANCE',!!pin&&pin.commit===r.engineCommit&&pin.repository===r.engineRepository);
 const patchHash=r.enginePatchSha256??null;
 const approvedPatch=pin?.capacityPatch?hash(readFileSync(pin.capacityPatch)):null;
 fail(name+'_UNAPPROVED_ENGINE_PATCH',patchHash===null||(approvedPatch!==null&&patchHash===approvedPatch));
 fail(name+'_MISSING_RAW_ARTIFACTS',r.schemaVersion===2&&!!r.artifacts&&typeof r.scenarioPath==='string');
 if(r.schemaVersion===2&&pin&&r.artifacts&&typeof r.scenarioPath==='string'){
  try{
   const spot=trainingSpots.find(s=>s.id===r.spotId);
   if(!spot)throw Error('Unknown spot');
   const scenario=read(r.scenarioPath),expected=canonicalScenario(spot);
   if(JSON.stringify(scenario)!==JSON.stringify(expected))throw Error('Scenario/source mismatch');
   for(const k of ['inputHash','rangeHash','treeHash'])if(r[k]!==expected[k])throw Error('Canonical hash mismatch');
   if(r.spotSourceHash!==expected.spotSourceHash||r.rangeVerified!==expected.rangeVerified)throw Error('Source/provenance mismatch');
   for(const k of ['input','raw','log']){
    const v=r.artifacts[k];if(!v||hash(readFileSync(v.path))!==v.sha256)throw Error('Artifact integrity mismatch '+k);
   }
   const execution=read(r.executionPath);
   if(execution.exitCode!==0||execution.engineCommit!==pin.commit||execution.binarySha256!==r.artifacts.binary?.sha256)throw Error('Execution provenance mismatch');
   if((execution.enginePatchSha256??null)!==patchHash||execution.sourceWorktreeClean!==(patchHash===null))throw Error('Source patch provenance mismatch');
   const input=readFileSync(r.artifacts.input.path,'utf8');
   const rendered=r.engine==='TexasSolver'?renderTexasInput(scenario,execution.outputPath,execution.parameters):renderDcfrInput(scenario,execution.parameters);
   if(input!==rendered)throw Error('Executed configuration mismatch');
   const raw=readFileSync(r.artifacts.raw.path),log=readFileSync(r.artifacts.log.path,'utf8');
   if(hash(raw)!==r.rawOutputHash)throw Error('Raw hash mismatch');
   const measured=readConvergence(r.engine,log,execution.exitCode);
   if(measured!==r.exploitabilityPercent||r.converged!==(measured<=.3))throw Error('Convergence mismatch');
   const parsed=r.engine==='TexasSolver'?parseTexasResult(JSON.parse(raw),scenario):parseDcfrResult(log,scenario);
   if(JSON.stringify(parsed)!==JSON.stringify(r.actionFrequencies))throw Error('Strategy was not derived from raw output');
  }catch(e){reasons.push(name+'_ARTIFACT_VERIFICATION_FAILED:'+e.message);}
 }
}
const x=a.actionFrequencies,y=b.actionFrequencies;
const keys=x&&typeof x==='object'?Object.keys(x).sort():[];
fail('MISSING_ACTION_FREQUENCIES',keys.length>0&&y&&typeof y==='object');
if(keys.length&&y&&typeof y==='object'){
 fail('ACTION_SET_MISMATCH',JSON.stringify(keys)===JSON.stringify(Object.keys(y).sort()));
 const valid=z=>keys.every(k=>Number.isFinite(z[k])&&z[k]>=0&&z[k]<=1)&&Math.abs(keys.reduce((s,k)=>s+z[k],0)-1)<=0.001;
 fail('INVALID_FREQUENCIES',valid(x)&&valid(y));
 fail('ACTION_DISAGREEMENT',keys.every(k=>Number.isFinite(x[k])&&Number.isFinite(y[k])&&Math.abs(x[k]-y[k])<=0.03));
}
const report={schemaVersion:1,spotId:a.spotId??null,engines:[a.engine??null,b.engine??null],
 status:reasons.length?'BLOCKED':'CROSS_ENGINE_MATCH',crossEngineMatched:reasons.length===0,
 independentlyCertified:false,reasons,sourceFiles:[{path:aPath,sha256:hash(readFileSync(aPath))},{path:bPath,sha256:hash(readFileSync(bPath))}]};
report.maxFrequencyDelta=keys.length&&y?Math.max(...keys.map(k=>Math.abs(x[k]-y[k]))):null;
report.strategyAgreement=keys.length>0&&reasons.every(r=>r==='A_RANGE_UNVERIFIED'||r==='B_RANGE_UNVERIFIED');
report.actionFrequencies={a:x??null,b:y??null};
report.scope=a.scope??null;
mkdirSync(dirname(outPath),{recursive:true});
writeFileSync(outPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(reasons.length)process.exitCode=1;
