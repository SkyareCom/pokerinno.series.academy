import {trainingSpots,independentlyCertifiedSpots} from '../dist/simulator-spots.js';
import {auditStrategicDuplicates} from '../dist/simulator-uniqueness.js';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
const unique=auditStrategicDuplicates(trainingSpots);
const certified=independentlyCertifiedSpots();
const ids=new Set(certified.map(s=>s.id));
const records=trainingSpots.map(s=>{
 const v=s.solver;
 return {id:s.id,street:s.street,tableSize:s.tableSize,
  fingerprint:createHash('sha256').update(JSON.stringify({position:s.position,stack:s.stack,hand:s.hand,heroCards:s.heroCards,board:s.board,bettingLine:s.bettingLine})).digest('hex'),
  sourceSolveId:v?.solveId??null,hasActionFrequencies:!!v?.actions?.length,
  sourceHash:v?.sourceHash??null,independentlyCertified:ids.has(s.id),
  reason:ids.has(s.id)?null:s.street==='pre'?'IMPORTED_REFERENCE_WITHOUT_INDEPENDENT_REPRODUCTION':'NO_EXECUTED_POSTFLOP_SOLVE'};
});
const result={schemaVersion:1,policy:'STRICT_SOLVED_ONLY',scope:'ACADEMY_LOCAL',total:trainingSpots.length,unique:unique.unique,duplicates:unique.duplicateCount,certified:certified.length,uncertified:records.length-certified.length,records};
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/academy-certification-ledger.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({total:result.total,unique:result.unique,certified:result.certified,uncertified:result.uncertified}));
if(unique.duplicateCount)process.exitCode=1;
