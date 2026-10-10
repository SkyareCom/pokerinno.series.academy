import compact from '../dist/ranges-dcfr-9max.json' with {type:'json'};
import full from '../dist/ranges-dcfr-9max-100bb.json' with {type:'json'};
import {mkdirSync,writeFileSync} from 'node:fs';
const errors=[],comparisons=[];const tolerance=0.011;
if(compact.tableSize!==9||full.tableSize!==9)errors.push('9max_table_size_required');
for(const [key,scenario] of Object.entries(compact.scenarios)){
 const [stack,position]=key.split('|');
 if(stack!=='100')continue;
 const counterpart=full.scenarios[position];
 if(!counterpart){errors.push('missing_100bb_position:'+position);continue;}
 const source=new Map(counterpart.actions.map(([hand,...actions])=>[hand,new Map(actions)]));
 for(const [hand,...actions] of scenario.actions){
  const exact=source.get(hand);
  if(!exact){errors.push('missing_hand:'+position+':'+hand);continue;}
  for(const [action,frequency] of actions){
   const reference=exact.get(action);
   if(!Number.isFinite(reference)||Math.abs(reference-frequency)>tolerance)
    errors.push('frequency_mismatch:'+position+':'+hand+':'+action);
   comparisons.push({position,hand,action,compact:frequency,full:reference,delta:Number(Math.abs(reference-frequency).toFixed(8))});
  }
 }
 if(scenario.actions.length!==169||counterpart.actions.length!==169)errors.push('incomplete_range:'+position);
}
const report={scope:'ACADEMY_9MAX_100BB',comparison:'DCFR compact vs DCFR full precision',independentEngine:false,texasSolverArtifactAvailable:false,tolerancePercentagePoints:tolerance,comparisons:comparisons.length,mismatches:errors.length,errors,maxAbsoluteDelta:Math.max(0,...comparisons.map(x=>x.delta)),certification:'CROSS_CHECK_ONLY_NOT_INDEPENDENT_SOLVER_CERTIFICATION'};
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/academy-dcfr-crosscheck.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(errors.length)process.exitCode=1;
