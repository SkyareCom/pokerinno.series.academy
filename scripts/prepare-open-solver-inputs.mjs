import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Adapter for the MIT-licensed kfg021/Postflop-Poker-Solver YAML CLI.
// Produces input manifests, NOT solved strategies. Weighted ranges remain provisional.
const cards=xs=>xs.map(x=>x[0]+({s:'s',h:'h',d:'d',c:'c'}[x[1]])).join(', ');
const deck=/^[2-9TJQKA][shdc]$/;
const quote=x=>JSON.stringify(x);
const weightedRange=range=>Object.entries(range??{}).filter(([,v])=>v>0).map(([hand,v])=>hand+':'+v.toFixed(6)).join(', ');
const out='reports/solver/postflop-inputs';
mkdirSync(out,{recursive:true});
const rows=[];
for(const s of trainingSpots.filter(s=>s.street!=='pre')){
 const known=[...s.heroCards,...s.board];
 if(known.some(card=>!deck.test(card))||new Set(known).size!==known.length)throw Error('Invalid cards for spot '+s.id);
 if(!s.heroRange||!s.villainRange||Object.keys(s.heroRange).length!==169||Object.keys(s.villainRange).length!==169)throw Error('Incomplete 169-class weighted ranges for spot '+s.id);
 const scenario={
  id:s.id,street:s.street,board:s.board,pot:s.pot,effectiveStack:s.effectiveStack,
  ranges:{oop:s.villainRange,ip:s.heroRange},provenance:s.rangeProvenance,
  bettingLine:s.bettingLine,
  blockers:[...s.heroCards,...s.board],
  solver:'kfg021/Postflop-Poker-Solver',
  status:'EXECUTABLE_CONFIG_NOT_CERTIFIED',
  warning:'Provisional ranges and illustrative bet sizing; executable tree does not reconstruct historical action reach probabilities or certify the spot.'
 };
 const digest=createHash('sha256').update(JSON.stringify(scenario)).digest('hex');
 const yaml=[
  '# PROVISIONAL INPUT ONLY - DO NOT LABEL AS SOLVED',
  '# Academy spot '+s.id+' SHA256 '+digest,
  'ranges:',
  '  oop: '+quote(weightedRange(s.villainRange)),
  '  ip: '+quote(weightedRange(s.heroRange)),
  'board: '+quote(cards(s.board)),
  'tree:',
  '  starting-wager-per-player: '+(s.pot/2),
  '  dead-money-in-pot: 0',
  '  effective-stack-remaining: '+s.effectiveStack,
  '  use-isomorphism: true',
  '  actions:',
  ...['oop','ip'].flatMap(player=>[
   '    '+player+':',
   ...['flop','turn','river'].flatMap(street=>[
    '      '+street+':',
    '        bet-sizes: [33, 75]',
    '        raise-sizes: [50]'
   ])
  ]),
  'solver:',
  '  threads: 2',
  '  target-exploitability-percent: 0.3',
  '  max-iterations: 1000',
  '  exploitability-check-frequency: 10'
 ].join('\n')+'\n';
 // Avoid writing 780 files into GitHub Actions artifacts: use one combined manifest.
 rows.push({id:s.id,sha256:digest,scenario,yaml});
}
const selected=Number(process.env.ACADEMY_SOLVER_SPOT_ID??721);
const selectedRow=rows.find(row=>row.id===selected);
if(!selectedRow)throw Error('Unknown Academy solver spot ID '+selected);
writeFileSync(out+'/selected-spot.yml',selectedRow.yaml);
writeFileSync(out+'/academy-postflop-inputs.json',JSON.stringify({
 engine:'kfg021/Postflop-Poker-Solver',license:'MIT',total:rows.length,
 certified:0,execution:'NOT_PERFORMED',inputs:rows
},null,2)+'\n');
console.log(JSON.stringify({total:rows.length,certified:0,output:out+'/academy-postflop-inputs.json'}));
