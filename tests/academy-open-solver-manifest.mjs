import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

test('open-solver manifest preserves all 780 9max scenarios and unverified provenance',()=>{
 execFileSync(process.execPath,['scripts/prepare-open-solver-inputs.mjs'],{stdio:'pipe'});
 const report=JSON.parse(readFileSync('reports/solver/postflop-inputs/academy-postflop-inputs.json','utf8'));
 assert.equal(report.total,780);
 assert.equal(report.certified,0);
 assert.equal(report.execution,'NOT_PERFORMED');
 assert.equal(new Set(report.inputs.map(r=>r.id)).size,780);
 for(const row of report.inputs){
  assert.match(row.sha256,/^[a-f0-9]{64}$/);
  assert.equal(row.scenario.status,'EXECUTABLE_CONFIG_NOT_CERTIFIED');
  assert.equal(Object.keys(row.scenario.ranges.oop).length,169);
  assert.equal(Object.keys(row.scenario.ranges.ip).length,169);
  assert.equal(row.scenario.provenance.villain,'ACADEMY_HEURISTIC_UNVERIFIED');
  assert.ok(row.yaml.includes('PROVISIONAL INPUT ONLY'));
  assert.ok(row.yaml.includes('ranges:'));
 }
});
