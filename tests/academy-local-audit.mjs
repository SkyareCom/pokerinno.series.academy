import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {trainingSpots} from '../dist/simulator-spots.js';

test('Academy local audit checks all streets and zero structural errors',()=>{
 execFileSync(process.execPath,['scripts/audit-academy-spots.mjs'],{stdio:'pipe'});
 const report=JSON.parse(readFileSync('reports/solver/academy-local-audit.json','utf8'));
 assert.equal(report.scope,'ACADEMY_LOCAL_9MAX');
 assert.equal(report.total,trainingSpots.length);
 assert.equal(report.total,1500);
 assert.equal(report.unique,1500);
 assert.equal(report.structuralErrors,0);
 assert.deepEqual(report.counts,{pre:720,flop:450,turn:225,river:105});
 assert.equal(report.independentSolverCertification,'NOT_PERFORMED');
});
