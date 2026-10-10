import {trainingSpots} from '../dist/simulator-spots.js';
import {auditStrategicDuplicates} from '../dist/simulator-uniqueness.js';
import {mkdirSync,writeFileSync} from 'node:fs';

const errors=[],streets={pre:0,flop:0,turn:0,river:0};
const deck=/^[2-9TJQKA][shdc]$/;
for(const s of trainingSpots){
 const fail=reason=>errors.push({id:s.id,reason});
 streets[s.street]=(streets[s.street]??0)+1;
 if(s.tableSize!==9)fail('not_9max');
 if(!Number.isInteger(s.id)||s.id<1||s.id>1500)fail('invalid_id');
 if(!['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB'].includes(s.position))fail('invalid_hero_position');
 if(typeof s.hand!=='string'||!/^(?:[2-9TJQKA]{2}|[2-9TJQKA]{2}[so])$/.test(s.hand))fail('invalid_hand_class');

 if(!Array.isArray(s.heroCards)||s.heroCards.length!==2)fail('missing_hero_cards');
 const cards=[...(s.heroCards??[]),...(s.board??[])];
 if(cards.some(c=>!deck.test(c))||new Set(cards).size!==cards.length)fail('invalid_or_colliding_cards');
 if(s.heroCards?.length===2&&typeof s.hand==='string'){
  const [a,b]=s.heroCards;
  const rankA=a[0],rankB=b[0],suited=a[1]===b[1];
  const pair=rankA===rankB;
  const expected=pair?rankA+rankB:rankA+rankB+(suited?'s':'o');
  const reversed=pair?expected:rankB+rankA+(suited?'s':'o');
  if(s.hand!==expected&&s.hand!==reversed)fail('hand_class_mismatch');
  if(pair&&suited)fail('impossible_suited_pair');
 }

 const count={pre:0,flop:3,turn:4,river:5}[s.street];
 if(s.street!=='pre'&&s.board?.length>=3){
  if(s.board.some(card=>s.heroCards.includes(card)))fail('hero_board_collision');
 }
 if(count===undefined||(s.board??[]).length!==count)fail('invalid_board_street');
 if(!Number.isFinite(s.stack)||!Number.isFinite(s.effectiveStack)||s.effectiveStack<0||s.effectiveStack>s.stack)fail('invalid_stack');
 if(!Number.isFinite(s.pot)||s.pot<=0)fail('invalid_pot');
 if(s.street==='pre'){
  if(s.position==='BB')fail('unopened_bb_position_invalid');
  if(s.board?.length||s.bettingLine?.length||s.pot!==1.5||s.effectiveStack!==s.stack)fail('invalid_unopened_preflop');
  if(!s.solver?.solveId||!Array.isArray(s.solver.actions))fail('missing_preflop_source_reference');
  else {
   const seen=new Set();let sum=0;
   for(const [action,freq] of s.solver.actions){
    if(seen.has(action)||!Number.isFinite(freq)||freq<0||freq>100)fail('invalid_preflop_action_frequency');
    seen.add(action);sum+=freq;
   }
   if(Math.abs(sum-100)>0.2)fail('preflop_frequency_sum');
  }
 }else{
  const line=s.bettingLine??[];
  const expected=[['pre','BTN','raise',2.5],['pre','BB','call',2.5]];
  if(s.street!=='flop')expected.push(['flop','BB','check',0],['flop','BTN','bet',2],['flop','BB','call',2]);
  if(s.street==='river')expected.push(['turn','BB','check',0],['turn','BTN','bet',4],['turn','BB','call',4]);
  expected.push([s.street,'BB','check',0]);
  if(JSON.stringify(line.map(a=>[a.street,a.position,a.action,a.sizeBB]))!==JSON.stringify(expected))fail('inconsistent_betting_sequence');
  const expectedPot=1.5+4+ (s.street==='flop'?0:s.street==='turn'?4:12);
  if(Math.abs(s.pot-expectedPot)>1e-9)fail('pot_conservation');
  const expectedStack=s.stack-2.5-(s.street==='flop'?0:s.street==='turn'?2:6);
  if(Math.abs(s.effectiveStack-expectedStack)>1e-9)fail('stack_conservation');
  if(s.solver!==null)fail('postflop_not_independently_solved');
  if(s.position!=='BTN'||s.aggressor!=='BTN')fail('postflop_role_mismatch');
  if(s.villainRange!=='BB_DEFEND_VS_BTN_OPEN_UNVERIFIED')fail('postflop_range_provenance_mismatch');
 }
}
const ids=trainingSpots.map(s=>s.id);
if(new Set(ids).size!==ids.length)errors.push({reason:'duplicate_ids'});
if(ids.some((id,i)=>id!==i+1))errors.push({reason:'noncontiguous_ids'});
const uniqueness=auditStrategicDuplicates(trainingSpots);
if(uniqueness.duplicateCount)errors.push({reason:'duplicate_strategic_decisions',count:uniqueness.duplicateCount});
const report={schemaVersion:1,scope:'ACADEMY_LOCAL_9MAX',source:'academy dist/simulator-spots.js',counts:streets,total:trainingSpots.length,unique:uniqueness.unique,structuralErrors:errors.length,errors,independentSolverCertification:'NOT_PERFORMED'};
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/academy-local-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,unique:report.unique,structuralErrors:report.structuralErrors,counts:streets}));
if(errors.length)process.exitCode=1;
