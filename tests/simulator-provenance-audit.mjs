// Audit only: this does not run or certify a solver.
import {trainingSpots,checkTrainingAction} from '../dist/simulator-spots.js';
const count={total:trainingSpots.length,street:{},importedRfiReference:0,independentlyCertified:0,missingReference:0,invalidContext:0,invalidPot:0,scoreable:0};
for(const s of trainingSpots){
 count.street[s.street]=(count.street[s.street]||0)+1;
 if(s.solver)count.importedRfiReference++;else count.missingReference++;
 if(s.street==='pre'&&s.pot!==1.5)count.invalidPot++;
 if(s.street!=='pre'&&(!s.aggressor||!s.bettingLine||!s.effectiveStack||!s.villainRange))count.invalidContext++;
 for(const action of ['CALL','CHECK','FOLD','RAISE','ALL IN']){
  const result=checkTrainingAction(s,action);
  if(result.scorable)count.scoreable++;
 }
}
console.log(JSON.stringify(count,null,2));
if(count.scoreable>0||count.independentlyCertified>count.importedRfiReference)process.exitCode=1;
