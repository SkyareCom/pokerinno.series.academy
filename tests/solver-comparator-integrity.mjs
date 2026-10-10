import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

test('pinned engine identities without original files cannot establish diagnostic agreement',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-pinned-compare-'));
 try{
  const common={schemaVersion:1,spotId:1396,inputHash:'a'.repeat(64),rangeHash:'b'.repeat(64),treeHash:'c'.repeat(64),rangeVerified:false,
   converged:true,exploitabilityPercent:0,rawOutputHash:'d'.repeat(64),actionFrequencies:{CHECK:1}};
  const engines=[['TexasSolver','6dfb65b4d7ed081da509e8d8c3d82138c4708267','bupticybee/TexasSolver'],
   ['Postflop-Poker-Solver','2319e0d5f1bd6f5976faf4d1041ff0b49605e192','kfg021/Postflop-Poker-Solver']];
  const paths=engines.map(([engine,engineCommit,repo],i)=>{
   const p=join(dir,i+'.json');writeFileSync(p,JSON.stringify({...common,engine,engineCommit,engineRepository:'https://github.com/'+repo}));return p;
  });
  spawnSync(process.execPath,['scripts/compare-solver-exports.mjs',...paths,join(dir,'report.json')]);
  const report=JSON.parse(readFileSync(join(dir,'report.json')));
  assert.equal(report.strategyAgreement,false);assert.equal(report.crossEngineMatched,false);
  assert.ok(report.reasons.includes('A_MISSING_RAW_ARTIFACTS'));
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('self-declared hashes and arbitrary engine names cannot pass as independent evidence',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-compare-'));
 try{
  const obj={spotId:721,inputHash:'a'.repeat(64),rangeHash:'b'.repeat(64),treeHash:'c'.repeat(64),converged:true,
   exploitabilityPercent:0,engineCommit:'d'.repeat(40),rawOutputHash:'e'.repeat(64),rangeVerified:true,actionFrequencies:{CHECK:1}};
  writeFileSync(join(dir,'a.json'),JSON.stringify({...obj,engine:'engine-a'}));
  writeFileSync(join(dir,'b.json'),JSON.stringify({...obj,engine:'engine-b'}));
  const r=spawnSync(process.execPath,['scripts/compare-solver-exports.mjs',join(dir,'a.json'),join(dir,'b.json'),join(dir,'report.json')],{encoding:'utf8'});
  assert.notEqual(r.status,0,'self-declared outputs must be rejected');
  const report=JSON.parse(readFileSync(join(dir,'report.json')));
  assert.ok(report.reasons.some(x=>/PROVENANCE|ARTIFACT|ENGINE/.test(x)));
  assert.equal(report.strategyAgreement,false,'missing raw artifacts cannot establish even diagnostic agreement');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
