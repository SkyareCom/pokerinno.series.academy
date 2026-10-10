import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
const counts={flop:450,turn:225,river:105};
const streets=['flop','turn','river'];
const seen=new Set();
const candidates=[];
for(const street of streets){
 const source=trainingSpots.filter(s=>s.street===street);
 if(source.length!==counts[street])throw Error('Unexpected '+street+' count: '+source.length);
 for(const spot of source){
  const board=spot.board;
  if(new Set([...spot.heroCards,...board]).size!==spot.heroCards.length+board.length)throw Error('Card collision '+spot.id);
  // Deliberately keep the existing 9max preflop history, then isolate a heads-up postflop decision.
  // Existing heuristic ranges MUST be replaced with independently verified ranges before certification.
  const candidate={id:spot.id,street,tableSize:9,playersAtDecision:2,position:spot.position,
   heroCards:spot.heroCards,board,stack:spot.stack,pot:spot.pot,
   scenarioType:'HU_POSTFLOP_SINGLE_DECISION',actions:['CHECK','BET'],
   bettingLine:spot.bettingLine,
   rangeSourceStatus:'MISSING_VERIFIED_RANGES',
   solveStatus:'NOT_RUN',certificationStatus:'BLOCKED',
   requiredEngines:['TexasSolver','Postflop-Poker-Solver'],
   sourceSpotHash:sha(JSON.stringify(spot))};
  const key=[street,candidate.heroCards.join(''),board.join(''),spot.stack,spot.position].join('|');
  if(seen.has(key))throw Error('Duplicate postflop decision '+spot.id);
  seen.add(key);candidates.push(candidate);
 }
}
const byStreet=Object.fromEntries(streets.map(s=>[s,candidates.filter(x=>x.street===s).length]));
const report={schemaVersion:1,purpose:'POSTFLOP_CERTIFICATION_QUEUE',byStreet,total:candidates.length,
 certified:0,requiresIndependentRangeEvidence:true,requiresTwoIndependentSolves:true,candidates};
mkdirSync('reports/solver/certification',{recursive:true});
writeFileSync('reports/solver/certification/postflop-queue.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,byStreet,certified:0}));
if(candidates.length!==780)process.exitCode=1;
