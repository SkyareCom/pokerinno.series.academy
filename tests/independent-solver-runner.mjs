import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

test('runner prepares both real engine configs and preserves selected postflop streets',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-runner-'));
 try{
  const r=spawnSync(process.execPath,['scripts/run-independent-postflop.mjs','--ids','721,1171,1396','--prepare-only','--out',dir],{encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
  const q=JSON.parse(readFileSync(join(dir,'batch-summary.json')));
  assert.equal(q.certified,0);assert.equal(q.selected,3);
  assert.deepEqual(q.byStreet,{flop:1,turn:1,river:1});
  for(const id of [721,1171,1396]){
   assert.ok(existsSync(join(dir,String(id),'texas-input.txt')));
   assert.ok(existsSync(join(dir,String(id),'dcfr-input.yml')));
   assert.equal(JSON.parse(readFileSync(join(dir,String(id),'scenario.json'))).rangeVerified,false);
  }
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('runner rejects preflop IDs instead of silently replacing postflop decisions',()=>{
 const r=spawnSync(process.execPath,['scripts/run-independent-postflop.mjs','--ids','1','--prepare-only'],{encoding:'utf8'});
 assert.notEqual(r.status,0);assert.match(r.stderr,/postflop/i);
});
