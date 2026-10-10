import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Adapter for the MIT-licensed kfg021/Postflop-Poker-Solver YAML CLI.
// Produces input manifests, NOT solved strategies. Weighted ranges remain provisional.
const cards=xs=>xs.map(x=>x[0]+({s:'s',h:'h',d:'d',c:'c'}[x[1]])).join(', ');
const quote=x=>JSON.stringify(x);
const weightedRange=range=>Object.entries(range??{}).filter(([,v])=>v>0).map(([hand,v])=>hand+':'+v.toFixed(6)).join(', ');
const out='reports/solver/postflop-inputs';
mkdirSync(out,{recursive:true});
const rows=[];
for(const s of trainingSpots.filter(s=>s.street!=='pre')){
 const scenario={
  id:s.id,street:s.street,board:s.board,pot:s.pot,effectiveStack:s.effectiveStack,
  ranges:{oop:s.villainRange,ip:s.heroRange},provenance:s.rangeProvenance,
  bettingLine:s.bettingLine,
  blockers:[...s.heroCards,...s.board],
  solver:'kfg021/Postflop-Poker-Solver',
  status:'INPUT_ONLY_NOT_CERTIFIED',
  warning:'Ranges are not independently solver-certified; action tree, rake and sizing must be configured and verified before solving.'
 };
 const digest=createHash('sha256').update(JSON.stringify(scenario)).digest('hex');
 const yaml=[
  '# PROVISIONAL INPUT ONLY - DO NOT LABEL AS SOLVED',
  '# Academy spot '+s.id+' SHA256 '+digest,
  'ranges:',
  '  oop: '+quote(weightedRange(s.villainRange)),
  '  ip: '+quote(weightedRange(s.heroRange)),
  'board: '+quote(cards(s.board)),
  '# The upstream solver requires additional scenario-specific pot, stack,',
  '# bet sizing and tree configuration; do not run this incomplete YAML as a certified solve.',
  '# pot: '+s.pot,
  '# effective_stack: '+s.effectiveStack
 ].join('\n')+'\n';
 const file=out+'/spot-'+String(s.id).padStart(4,'0')+'.yml';
 // Avoid writing 780 files into GitHub Actions artifacts: use one combined manifest.
 rows.push({id:s.id,sha256:digest,scenario,yaml});
}
writeFileSync(out+'/academy-postflop-inputs.json',JSON.stringify({
 engine:'kfg021/Postflop-Poker-Solver',license:'MIT',total:rows.length,
 certified:0,execution:'NOT_PERFORMED',inputs:rows
},null,2)+'\n');
console.log(JSON.stringify({total:rows.length,certified:0,output:out+'/academy-postflop-inputs.json'}));
