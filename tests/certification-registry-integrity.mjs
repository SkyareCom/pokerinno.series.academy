import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {trainingSpots} from '../dist/simulator-spots.js';
const hash=v=>createHash('sha256').update(v).digest('hex');

test('registry rejects a complete self-declared certificate without original solver files',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-registry-'));
 try{
  const actions={CHECK:.9,BET:.1},inputHash='a'.repeat(64),rangeHash='b'.repeat(64);
  const evidence={schemaVersion:1,spotId:737,sourceInputSha256:inputHash,spotSourceSha256:hash(JSON.stringify(trainingSpots.find(s=>s.id===737))),
   rangeSourceSha256:rangeHash,rangeSourceVerified:true,rangeSourceReferences:['unverified-claim'],heuristicRangeReplaced:true,
   engines:['one','two'].map(name=>({name,commit:'c'.repeat(40),strategySha256:hash(JSON.stringify(actions)),converged:true,
    exploitabilityPercent:0,inputSha256:inputHash,rangeSourceSha256:rangeHash,actionFrequencies:actions}))};
  writeFileSync(join(dir,'737.json'),JSON.stringify(evidence));
  spawnSync(process.execPath,['scripts/certify-all-1500-spots.mjs'],{env:{...process.env,ACADEMY_CERT_EVIDENCE_DIR:dir},encoding:'utf8'});
  const report=JSON.parse(readFileSync('reports/solver/certification/certification-registry.json'));
  assert.equal(report.certified,0,'self-declaration is not evidence');
  assert.ok(report.spotChecks.find(s=>s.id===737).reasons.includes('MISSING_REPRODUCIBLE_COMPARISON'));
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('registry preserves required counts per street even with no certificates',()=>{
 spawnSync(process.execPath,['scripts/certify-all-1500-spots.mjs'],{encoding:'utf8'});
 const report=JSON.parse(readFileSync('reports/solver/certification/certification-registry.json'));
 assert.deepEqual(report.byStreet,{pre:{total:720,certified:0,blocked:720},flop:{total:450,certified:0,blocked:450},turn:{total:225,certified:0,blocked:225},river:{total:105,certified:0,blocked:105}});
});
