import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
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
mkdirSync('reports/solver/certification',{recursive:true});
writeFileSync(outPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(reasons.length)process.exitCode=1;
