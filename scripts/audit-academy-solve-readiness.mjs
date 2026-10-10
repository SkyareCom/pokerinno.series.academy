import {trainingSpots} from '../dist/simulator-spots.js';
import {writeFileSync,mkdirSync} from 'node:fs';
const stages={pre:{total:0,sourceReference:0,missingIndependentProof:0},flop:{total:0,missingRange:0,missingSolve:0},turn:{total:0,missingRange:0,missingSolve:0},river:{total:0,missingRange:0,missingSolve:0}};
for(const s of trainingSpots){
 const stage=stages[s.street];stage.total++;
 if(s.street==='pre'){
  if(s.solver?.solveId&&s.solver.actions?.length)stage.sourceReference++;
  if(s.solver?.independentlyVerified!==true)stage.missingIndependentProof++;
 }else{
  if(!s.heroRange||!s.villainRange)stage.missingRange++;
  if(!s.solver?.solveId)stage.missingSolve++;
 }
}
const report={scope:'POKERINNO_ACADEMY_ONLY',tableSize:9,required:1500,stages,blockedBy:[
 'No independently reproducible source artifact and SHA256 proof for 720 imported preflop references',
 'Weighted 9max ranges now present, but BB defend weights are educational heuristic and not solver-certified',
 'No independently executed 9max postflop solves and action-frequency outputs for 780 scenarios'
],readyForCertifiedScoring:0};
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/academy-solve-readiness.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({stages,readyForCertifiedScoring:0}));
