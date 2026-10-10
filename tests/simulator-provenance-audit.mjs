// Audit only: this does not run or certify a solver.
import {trainingSpots,checkTrainingAction} from '../dist/simulator-spots.js';
const count={total:trainingSpots.length,street:{},importedRfiReference:0,independentlyCertified:0,missingReference:0,invalidContext:0,invalidPot:0,scoreable:0,missingBettingContext:0,missingConcreteHoleCards:0,positionDisplayMismatch:0,invalidCardCollision:0,invalidPotFromBettingLine:0};
for(const s of trainingSpots){
 count.street[s.street]=(count.street[s.street]||0)+1;
 if(s.solver)count.importedRfiReference++;else count.missingReference++;
 if(s.street==='pre'&&s.pot!==1.5)count.invalidPot++;
 if(!Array.isArray(s.heroCards)||s.heroCards.length!==2)count.missingConcreteHoleCards++;
 if(!['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'].includes(s.position))count.positionDisplayMismatch++;
 if(new Set([...(s.heroCards||[]),...(s.board||[])]).size!==(s.heroCards||[]).length+(s.board||[]).length)count.invalidCardCollision++;
 if(s.street!=='pre'&&Array.isArray(s.bettingLine)){
  const contributions=s.bettingLine.filter(a=>a.action==='raise'||a.action==='call'||a.action==='bet').reduce((sum,a)=>sum+a.sizeBB,0);
  const derived=contributions+0.5; // SB 0.5 BB remains in the pot after BB defends
  if(Math.abs(derived-s.pot)>0.001)count.invalidPotFromBettingLine++;
 }
 if(s.street!=='pre'&&!s.bettingLine)count.missingBettingContext++;
 if(s.street!=='pre'&&(!s.aggressor||!s.bettingLine||!s.effectiveStack||!s.villainRange))count.invalidContext++;
 for(const action of ['CALL','CHECK','FOLD','RAISE','ALL IN']){
  const result=checkTrainingAction(s,action);
  if(result.scorable)count.scoreable++;
 }
}
console.log(JSON.stringify(count,null,2));
if(count.scoreable>0||count.invalidPot>0||count.invalidCardCollision>0||count.invalidPotFromBettingLine>0||count.independentlyCertified>count.importedRfiReference)process.exitCode=1;
