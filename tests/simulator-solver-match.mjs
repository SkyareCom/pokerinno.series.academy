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

test('hero has two distinct physical cards without collision with the board',()=>{
 for(const s of trainingSpots){
  assert.equal(s.heroCards.length,2);
  assert.equal(new Set([...s.heroCards,...s.board]).size,2+s.board.length,'spot '+s.id);
  assert.ok(s.heroCards.every(card=>/^[2-9TJQKA][shdc]$/.test(card)));
  const [a,b]=s.heroCards;
  assert.equal(a[0],s.hand[0]);
  assert.equal(b[0],s.hand[1]);
  if(s.hand.endsWith('s'))assert.equal(a[1],b[1]);
  if(s.hand.endsWith('o'))assert.notEqual(a[1],b[1]);
 }
});

test('all 1500 candidate scenarios have a complete nonduplicated deck and distinct strategic key',async()=>{
 const {auditStrategicDuplicates}=await import('../dist/simulator-uniqueness.js');
 const report=auditStrategicDuplicates(trainingSpots);
 assert.equal(report.total,1500);
 assert.equal(report.duplicateCount,0,JSON.stringify(report.duplicates.slice(0,5)));
 for(const s of trainingSpots){
  assert.equal(new Set([...s.heroCards,...s.board]).size,2+s.board.length);
  assert.ok(s.effectiveStack>0);
  if(s.street!=='pre'){
   assert.ok(s.bettingLine.length>=3);
   assert.ok(s.villainRange);
   assert.ok(s.aggressor);
   assert.equal(s.solver,null);
  }
 }
});

test('each imported 9max RFI decision exactly matches its source record',async()=>{
 const {default:ranges}=await import('../dist/ranges-dcfr-9max.json',{with:{type:'json'}});
 for(const s of trainingSpots.filter(s=>s.street==='pre')){
  const scenario=ranges.scenarios[s.stack+'|'+s.position];
  assert.ok(scenario,'missing scenario for spot '+s.id);
  const row=scenario.actions.find(a=>a[0]===s.hand);
  assert.ok(row,'missing source hand for spot '+s.id);
  assert.ok(s.solver,'missing imported reference for spot '+s.id);
  assert.equal(s.solver.solveId,scenario.solveId);
  assert.deepEqual(s.solver.actions,row.slice(1));
 }
});

test('imported RFI strategy has finite frequencies that total approximately 100 percent',async()=>{
 const {default:ranges}=await import('../dist/ranges-dcfr-9max.json',{with:{type:'json'}});
 for(const [scenarioKey,scenario] of Object.entries(ranges.scenarios)){
  assert.ok(scenario.solveId,'missing solve ID for '+scenarioKey);
  for(const [hand,...actions] of scenario.actions){
   assert.ok(actions.length>0,scenarioKey+' '+hand);
   const names=new Set();
   let total=0;
   for(const [name,freq] of actions){
    assert.ok(!names.has(name),'duplicate action '+scenarioKey+' '+hand+' '+name);
    names.add(name);
    assert.ok(Number.isFinite(freq)&&freq>=0&&freq<=100,scenarioKey+' '+hand);
    total+=freq;
   }
   assert.ok(Math.abs(total-100)<=0.2,scenarioKey+' '+hand+' totals '+total);
  }
 }
});
