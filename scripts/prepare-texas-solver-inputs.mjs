import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const out='reports/solver/independent';
mkdirSync(out,{recursive:true});
const selected=Number(process.env.ACADEMY_SOLVER_SPOT_ID??721);
const rows=[];
const fmt=r=>Object.entries(r??{}).filter(([,v])=>v>0).map(([k,v])=>k+':'+Number(v).toFixed(6)).join(',');
for(const s of trainingSpots.filter(s=>s.street!=='pre')){
 const lines=[
  'set_pot '+Math.round(s.pot*4),
  'set_effective_stack '+Math.round(s.effectiveStack*4),
  'set_board '+s.board.join(','),
  'set_range_ip '+fmt(s.heroRange),
  'set_range_oop '+fmt(s.villainRange),
  ...['oop','ip'].flatMap(p=>['flop','turn','river'].flatMap(st=>[
   'set_bet_sizes '+p+','+st+',bet,50',
   'set_bet_sizes '+p+','+st+',raise,50'
  ])),
  'build_tree',
  'set_thread_num 2',
  'set_accuracy 0.3',
  'set_max_iteration 200',
  'set_print_interval 10',
  'set_use_isomorphism 1',
  'start_solve',
  'set_dump_rounds 3',
  'dump_result academy-texas-result.json'
 ];
 const input=lines.join('\n')+'\n';
 rows.push({id:s.id,street:s.street,sha256:createHash('sha256').update(input).digest('hex'),input,status:'PROVISIONAL_UNVERIFIED',rangeProvenance:s.rangeProvenance});
}
const row=rows.find(r=>r.id===selected);
if(!row)throw Error('Invalid postflop ID '+selected);
writeFileSync(out+'/selected-texas-input.txt',row.input);
writeFileSync(out+'/texas-input-manifest.json',JSON.stringify({engine:'bupticybee/TexasSolver console',total:rows.length,certified:0,inputs:rows},null,2)+'\n');
console.log(JSON.stringify({selected,total:rows.length,certified:0,sha256:row.sha256}));
