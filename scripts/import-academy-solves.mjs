import {trainingSpots} from '../dist/simulator-spots.js';
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const input='solver-results/academy-9max.json';
const hash=s=>createHash('sha256').update(s).digest('hex');
const summary={schemaVersion:1,source:input,imported:0,rejected:0,errors:[],certified:0,policy:'INDEPENDENT_SOLVER_EVIDENCE_REQUIRED'};
const certified=[];
if(existsSync(input)){
 const raw=JSON.parse(readFileSync(input,'utf8'));
 if(!Array.isArray(raw.solves))throw Error('Expected solves array');
 const byId=new Map(trainingSpots.map(s=>[s.id,s]));
 for(const solve of raw.solves){
  const spot=byId.get(solve.spotId);
  const fail=reason=>{summary.rejected++;summary.errors.push({spotId:solve.spotId,reason});};
  if(!spot){fail('unknown_spot');continue;}
  if(solve.tableSize!==9||solve.street!==spot.street||solve.position!==spot.position||solve.stack!==spot.stack||
   JSON.stringify(solve.heroCards)!==JSON.stringify(spot.heroCards)||JSON.stringify(solve.board)!==JSON.stringify(spot.board)||
   JSON.stringify(solve.bettingLine)!==JSON.stringify(spot.bettingLine)){fail('scenario_mismatch');continue;}
  if(!solve.engine||!solve.version||!solve.solveId||!solve.inputSha256||!solve.outputSha256||
   !/^[a-f0-9]{64}$/.test(solve.inputSha256)||!/^[a-f0-9]{64}$/.test(solve.outputSha256)){fail('missing_reproducibility_metadata');continue;}
  if(!solve.outputArtifact||!existsSync(solve.outputArtifact)){fail('missing_solver_output_artifact');continue;}
  const output=readFileSync(solve.outputArtifact);
  if(hash(output)!==solve.outputSha256){fail('solver_output_hash_mismatch');continue;}
  if(!Array.isArray(solve.actions)||!solve.actions.length||solve.actions.some(x=>!Array.isArray(x)||x.length!==2||typeof x[0]!=='string'||!Number.isFinite(x[1])||x[1]<0||x[1]>100)||
   Math.abs(solve.actions.reduce((a,x)=>a+x[1],0)-100)>0.2){fail('invalid_action_frequencies');continue;}
  // Hash and schema validation alone do not prove that a solver actually produced these actions.
  // Keep these records as imported evidence pending independent replay/verification.
  certified.push({spotId:spot.id,engine:solve.engine,version:solve.version,solveId:solve.solveId,inputSha256:solve.inputSha256,outputSha256:solve.outputSha256,actions:solve.actions,status:'EVIDENCE_IMPORTED_PENDING_INDEPENDENT_REPLAY'});
  summary.imported++;
 }
}
mkdirSync('reports/solver',{recursive:true});
writeFileSync('reports/solver/academy-solve-import-audit.json',JSON.stringify({...summary,evidenceRecords:certified},null,2)+'\n');
console.log(JSON.stringify({imported:summary.imported,rejected:summary.rejected,certified:0}));
if(summary.rejected)process.exitCode=1;
