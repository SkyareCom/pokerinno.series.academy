import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export const formatTexasRange=r=>Object.entries(r??{}).filter(([,v])=>v>0).map(([k,v])=>k+':'+Number(v).toFixed(6)).join(',');
export function sourceSpotSha256(s){
 // Hero decision identity is separate from solver-game identity: two hands may share one game.
 const source={id:s.id,tableSize:s.tableSize,street:s.street,position:s.position,stack:s.stack,
  effectiveStack:s.effectiveStack,hand:s.hand,heroCards:s.heroCards,board:s.board,pot:s.pot,
  aggressor:s.aggressor,heroRange:s.heroRange,villainRange:s.villainRange,
  rangeProvenance:s.rangeProvenance,bettingLine:s.bettingLine};
 return createHash('sha256').update(JSON.stringify(source)).digest('hex');
}
export function matchesTexasSource(input,s){
 if(!s||s.street==='pre'||typeof input!=='string')return false;
 const commands=input.trim().split(/\r?\n/);
 const expected={set_pot:String(Math.round(s.pot*4)),set_effective_stack:String(Math.round(s.effectiveStack*4)),
  set_board:s.board.join(','),set_range_ip:formatTexasRange(s.heroRange),set_range_oop:formatTexasRange(s.villainRange)};
 return s.board.length===({flop:3,turn:4,river:5}[s.street]??-1)&&Object.entries(expected).every(([name,value])=>{
  const lines=commands.filter(line=>line.startsWith(name+' '));
  return lines.length===1&&lines[0]===name+' '+value;
 });
}
function main(){
 const out='reports/solver/independent';
 const selected=Number(process.env.ACADEMY_SOLVER_SPOT_ID??721);
 const maxIterations=Number(process.env.ACADEMY_SOLVER_MAX_ITERATIONS??100);
 const dumpRounds=Number(process.env.ACADEMY_SOLVER_DUMP_ROUNDS??1);
 if(!Number.isInteger(dumpRounds)||dumpRounds<1||dumpRounds>3)throw Error('Invalid dump round count');
 if(!Number.isInteger(maxIterations)||maxIterations<1||maxIterations>10000)throw Error('Invalid iteration limit');
 const rows=[];
 for(const s of trainingSpots.filter(s=>s.street!=='pre')){
 const lines=[
  'set_pot '+Math.round(s.pot*4),
  'set_effective_stack '+Math.round(s.effectiveStack*4),
  'set_board '+s.board.join(','),
  'set_range_ip '+formatTexasRange(s.heroRange),
  'set_range_oop '+formatTexasRange(s.villainRange),
  ...['oop','ip'].flatMap(p=>['flop','turn','river'].flatMap(st=>[
   'set_bet_sizes '+p+','+st+',bet,50',
   'set_bet_sizes '+p+','+st+',raise,50'
  ])),
  'build_tree',
  'set_thread_num 2',
  'set_accuracy 0.3',
  'set_max_iteration '+maxIterations,
  'set_print_interval 10',
  'set_use_isomorphism 1',
  'start_solve',
  'set_dump_rounds '+dumpRounds,
  'dump_result academy-texas-result.json'
 ];
 const input=lines.join('\n')+'\n';
 rows.push({id:s.id,street:s.street,sha256:createHash('sha256').update(input).digest('hex'),sourceSpotSha256:sourceSpotSha256(s),input,status:'PROVISIONAL_UNVERIFIED',rangeProvenance:s.rangeProvenance});
 }
 const row=rows.find(r=>r.id===selected);
 if(!row)throw Error('Invalid postflop ID '+selected);
 mkdirSync(out,{recursive:true});
 writeFileSync(out+'/selected-texas-input.txt',row.input);
 writeFileSync(out+'/texas-input-manifest.json',JSON.stringify({schemaVersion:2,engine:'bupticybee/TexasSolver console',selectedSpotId:row.id,selectedInputSha256:row.sha256,total:rows.length,certified:0,inputs:rows},null,2)+'\n');
 console.log(JSON.stringify({selected,total:rows.length,certified:0,sha256:row.sha256}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main();
