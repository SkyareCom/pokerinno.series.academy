import test from 'node:test';
import assert from 'node:assert/strict';
import {trainingSpots,checkTrainingAction} from '../dist/simulator-spots.js';
test('1500 educational spots have a board matching their street',()=>{
 assert.equal(trainingSpots.length,1500);
 for(const s of trainingSpots){
  assert.equal(s.board.length,{pre:0,flop:3,turn:4,river:5}[s.street]);
  assert.ok([10,15,30,100].includes(s.stack));
  if(s.solver){assert.equal(s.street,'pre');assert.notEqual(s.position,'BB');assert.ok(s.solver.solveId);}
  else assert.equal(checkTrainingAction(s,'RAISE').status,'unvalidated');
 }
});
test('solver frequencies are only taken from the exact RFI hand and scenario',()=>{
 for(const s of trainingSpots.filter(s=>s.solver)){
  for(const [label,action] of [['FOLD','fold'],['RAISE','raise']]){
   const result=checkTrainingAction(s,label);
   assert.equal(result.status,'solver-reference');
   assert.equal(result.frequency,s.solver.actions.find(a=>a[0]===action)?.[1]??0);
  }
 }
});
