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
   const expected=s.solver.actions.find(a=>a[0]===action);
   assert.equal(result.status,expected?'solver-reference':'unvalidated');
   if(expected)assert.equal(result.frequency,expected[1]);
  }
 }
});

test('no spot can receive a diagnostic score before independent solver certification',()=>{
 for(const s of trainingSpots){
  for(const action of ['CALL','CHECK','FOLD','RAISE','ALL IN']){
   const result=checkTrainingAction(s,action);
   assert.equal(result.scorable,false,'spot '+s.id+' action '+action+' must not be scored');
   assert.ok(['solver-reference','unvalidated'].includes(result.status));
  }
 }
});
test('only RFI preflop is eligible for the imported solver reference',()=>{
 const byStreet={pre:0,flop:0,turn:0,river:0},withReference={pre:0,flop:0,turn:0,river:0};
 for(const s of trainingSpots){byStreet[s.street]++;if(s.solver)withReference[s.street]++;}
 assert.deepEqual(byStreet,{pre:720,flop:450,turn:225,river:105});
 assert.equal(withReference.pre>0,true);
 assert.equal(withReference.flop+withReference.turn+withReference.river,0);
});

test('RFI starts with 1.5 BB and never reports call or check as validated',()=>{
 for(const s of trainingSpots.filter(s=>s.street==='pre')){
  assert.equal(s.pot,1.5);
  for(const a of ['CALL','CHECK']){
   assert.equal(checkTrainingAction(s,a).status,'unvalidated');
  }
 }
});

test('solver must never invent an absent action frequency',()=>{
 for(const s of trainingSpots.filter(s=>s.solver)){
  for(const a of ['RAISE','FOLD','ALL IN']){
   const result=checkTrainingAction(s,a);
   if(!s.solver.actions.some(([name])=>name===a.toLowerCase())){
    assert.equal(result.status,'unvalidated');
    assert.equal(result.frequency,undefined);
   }
  }
 }
});

test('all-in is not equated with an unsized generic RFI raise',()=>{
 for(const s of trainingSpots){
  const result=checkTrainingAction(s,'ALL IN');
  assert.equal(result.status,'unvalidated');
  assert.equal(result.scorable,false);
 }
});
test('imported solver references have bounded numeric action frequencies',()=>{
 for(const s of trainingSpots.filter(s=>s.solver)){
  for(const [action,freq] of s.solver.actions){
   assert.ok(['fold','raise','call','check','allin'].includes(action));
   assert.ok(Number.isFinite(freq)&&freq>=0&&freq<=100);
  }
 }
});
