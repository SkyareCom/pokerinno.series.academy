import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {trainingSpots} from '../dist/simulator-spots.js';
import {strategicSpotKey} from '../dist/simulator-uniqueness.js';

execFileSync(process.execPath,['scripts/export-9max-solver-queue.mjs'],{stdio:'pipe'});
const file=JSON.parse(readFileSync('reports/solver/9max-postflop-pending.json','utf8'));
test('exported 9max solver queue is exact, unique and never misrepresented as solved',()=>{
 const pending=trainingSpots.filter(s=>s.street!=='pre'&&!s.solver);
 assert.equal(file.total,pending.length);
 assert.equal(file.requests.length,pending.length);
 assert.equal(file.certified,0);
 assert.deepEqual(file.counts,{flop:450,turn:225,river:105});
 const keys=new Set();
 for(let i=0;i<pending.length;i++){
  const s=pending[i],r=file.requests[i];
  assert.equal(r.id,s.id);
  assert.equal(r.strategicKey,strategicSpotKey(s));
  assert.equal(r.tableSize,9);
  assert.equal(r.status,'BLOCKED_MISSING_SOLVER_INPUT');
  assert.equal(r.certified,false);
  assert.equal(Object.keys(r.villainRange).length,169);
  assert.equal(Object.keys(r.heroRange).length,169);
  assert.ok(r.unresolved.some(x=>x.includes('villainRange')));
  assert.ok(r.unresolved.some(x=>x.includes('heroRange')));
  assert.ok(r.unresolved.some(x=>x.includes('solver run')));
  assert.ok(!keys.has(r.strategicKey));
  keys.add(r.strategicKey);
 }
});
