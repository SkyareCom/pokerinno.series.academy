import {trainingSpots} from '../dist/simulator-spots.js';
import {writeFileSync,mkdirSync} from 'node:fs';
import {auditStrategicDuplicates,strategicSpotKey} from '../dist/simulator-uniqueness.js';

const pending=trainingSpots.filter(s=>s.street!=='pre'&&!s.solver);
const report=auditStrategicDuplicates(pending);
if(report.duplicateCount)throw new Error('Duplicate postflop decisions: '+report.duplicateCount);
const requests=pending.map(s=>{
 const unresolved=[];
 if(!s.villainRange||s.villainRange.includes('UNVERIFIED'))unresolved.push('villainRange: solver-defined 9max BB defense range');
 if(!s.heroRange)unresolved.push('heroRange: solver-defined 9max BTN opening range');
 if(!s.solver?.solveId)unresolved.push('original 9max solver run and artifact');
 return {
  id:s.id,strategicKey:strategicSpotKey(s),status:'BLOCKED_MISSING_SOLVER_INPUT',
  tableSize:9,street:s.street,position:s.position,hand:s.hand,
  heroCards:s.heroCards,board:s.board,effectiveStack:s.effectiveStack,
  pot:s.pot,bettingLine:s.bettingLine,aggressor:s.aggressor,
  unresolved,certified:false
 };
});
const counts=Object.fromEntries(['flop','turn','river'].map(street=>[street,requests.filter(r=>r.street===street).length]));
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/9max-postflop-pending.json',JSON.stringify({
 schemaVersion:1,source:'pokerinno.series.academy',purpose:'solver input preparation; NOT solver output',
 total:requests.length,counts,unique:report.unique,certified:0,requests
},null,2)+'\n');
console.log(JSON.stringify({total:requests.length,counts,unique:report.unique,certified:0,output:'reports/solver/9max-postflop-pending.json'}));
