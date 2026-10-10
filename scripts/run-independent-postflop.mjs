import {trainingSpots} from '../dist/simulator-spots.js';
import {canonicalScenario,pinnedEngines,renderTexasInput,renderDcfrInput,normalizeRun,sha256,allocateRunDirectory} from './lib/independent-solver-adapters.mjs';
import {mkdirSync,writeFileSync,readFileSync,existsSync,openSync,closeSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';

const args=process.argv.slice(2),get=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const prepareOnly=args.includes('--prepare-only');
const idsText=get('--ids',process.env.ACADEMY_SOLVER_IDS??'1396');
const all=trainingSpots.filter(s=>s.street!=='pre');
const ids=idsText==='all'?all.map(s=>s.id):idsText.split(',').map(Number);
if(!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!Number.isInteger(id)||!all.some(s=>s.id===id)))throw Error('Invalid or duplicate postflop ID');
const shard=Number(get('--shard','0')),shards=Number(get('--shards','1'));
if(!Number.isInteger(shards)||shards<1||!Number.isInteger(shard)||shard<0||shard>=shards)throw Error('Invalid shard');
const selected=all.filter(s=>ids.includes(s.id)).filter((_,i)=>i%shards===shard);
const out=resolve(get('--out','reports/solver/certification/dual-engine'));
const iterations=Number(get('--iterations','2000')),accuracy=Number(get('--accuracy','0.05')),timeout=Number(get('--timeout','180'));
if(!Number.isInteger(iterations)||iterations<1||iterations>10000||!Number.isFinite(accuracy)||accuracy<=0||accuracy>.3||!Number.isInteger(timeout)||timeout<1||timeout>1800)throw Error('Invalid solver limits');
const parameters={iterations,accuracy};
const paths={TexasSolver:process.env.ACADEMY_TEXAS_DIR,'Postflop-Poker-Solver':process.env.ACADEMY_DCFR_DIR};
const binaries={},patchHashes={};
if(!prepareOnly){
 for(const [engine,pin] of Object.entries(pinnedEngines)){
  const dir=paths[engine];if(!dir)throw Error('Missing source directory for '+engine);
  const commit=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
  if(commit!==pin.commit)throw Error('Wrong source commit for '+engine);
  const diff=execFileSync('git',['-C',dir,'diff','HEAD'],{encoding:'utf8'});
  const approved=pin.capacityPatch?readFileSync(pin.capacityPatch,'utf8'):null;
  if(diff&&diff!==approved)throw Error('Unapproved modified solver source '+engine);
  patchHashes[engine]=diff?sha256(diff):null;
  binaries[engine]=engine==='Postflop-Poker-Solver'&&process.env.ACADEMY_DCFR_BINARY?resolve(process.env.ACADEMY_DCFR_BINARY):resolve(dir,engine==='TexasSolver'?'install/console_solver':'build/PostflopSolver');
  if(!existsSync(binaries[engine]))throw Error('Missing built binary '+engine);
 }
}
mkdirSync(out,{recursive:true});
const records=[];
const artifactRef=p=>{const r=relative(process.cwd(),p);return r.startsWith('..')?p:r;};
for(const spot of selected){
 const dir=allocateRunDirectory(out,spot.id,prepareOnly);
 const scenario=canonicalScenario(spot),scenarioPath=join(dir,'scenario.json');
 writeFileSync(scenarioPath,JSON.stringify(scenario,null,2)+'\n');
 const texasInput=join(dir,'texas-input.txt'),dcfrInput=join(dir,'dcfr-input.yml'),texasRaw=join(dir,'texas-raw.json');
 writeFileSync(texasInput,renderTexasInput(scenario,texasRaw,parameters));writeFileSync(dcfrInput,renderDcfrInput(scenario,parameters));
 const record={spotId:spot.id,street:spot.street,status:'PREPARED',certified:false,rangeVerified:false,scope:scenario.scope,evidenceDirectory:artifactRef(dir)};
 if(!prepareOnly){
  const normalized=[];
  for(const engine of Object.keys(pinnedEngines)){
   const stem=engine==='TexasSolver'?'texas':'dcfr',logPath=join(dir,stem+'-run.log'),executionPath=join(dir,stem+'-execution.json');
   const inputPath=engine==='TexasSolver'?texasInput:dcfrInput,binaryPath=binaries[engine];
   const commandArgs=engine==='TexasSolver'?['-i',inputPath]:[];
   const stdin=engine==='TexasSolver'?undefined:`holdem ${inputPath}\nsolve\naction 0\ninfo\nstrategy ${spot.hand}\nexit\n`;
   const fd=openSync(logPath,'w'),startedAt=new Date().toISOString();
   const result=spawnSync(binaryPath,commandArgs,{cwd:engine==='TexasSolver'?join(resolve(paths[engine]),'install'):dir,
    input:stdin,stdio:['pipe',fd,fd],timeout:timeout*1000,killSignal:'SIGKILL'});closeSync(fd);
   const execution={engine,engineCommit:pinnedEngines[engine].commit,binarySha256:sha256(readFileSync(binaryPath)),
    startedAt,finishedAt:new Date().toISOString(),exitCode:result.status,signal:result.signal,error:result.error?.message??null,
    args:commandArgs,stdin:stdin??null,parameters,outputPath:engine==='TexasSolver'?texasRaw:logPath,sourceCommitVerified:true,sourceWorktreeClean:patchHashes[engine]===null,
    enginePatchSha256:patchHashes[engine],sourcePatch:patchHashes[engine]?pinnedEngines[engine].capacityPatch:null,
    actionsRun:process.env.GITHUB_RUN_ID??null,actionsCommit:process.env.GITHUB_SHA??null};
   writeFileSync(executionPath,JSON.stringify(execution,null,2)+'\n');
   try{
    const row=normalizeRun({engine,scenario,inputPath,rawPath:engine==='TexasSolver'?texasRaw:logPath,logPath,exitCode:result.status,binaryPath,enginePatchSha256:patchHashes[engine]});
    row.scenarioPath=artifactRef(scenarioPath);row.executionPath=artifactRef(executionPath);
    for(const key of ['input','raw','log'])row.artifacts[key].path=artifactRef(row.artifacts[key].path);
    const p=join(dir,stem+'-normalized.json');writeFileSync(p,JSON.stringify(row,null,2)+'\n');normalized.push(p);
   }catch(e){record[stem+'Error']=e.message;}
  }
  if(normalized.length===2){
   const p=join(dir,'comparison.json');
   spawnSync(process.execPath,['scripts/compare-solver-exports.mjs',...normalized.map(artifactRef),p],{encoding:'utf8'});
   if(existsSync(p)){
    const comparison=JSON.parse(readFileSync(p));record.status=comparison.status;
    record.strategyAgreement=comparison.strategyAgreement;record.maxFrequencyDelta=comparison.maxFrequencyDelta;
    record.reasons=comparison.reasons;
   }else{record.status='COMPARATOR_FAILED';}
  }else{record.status='EXECUTION_BLOCKED';}
 }
 records.push(record);console.log(JSON.stringify(record));
 writeSummary();
}
function writeSummary(){
 const report={schemaVersion:1,requested:ids.length,selected:selected.length,processed:records.length,certified:0,
  byStreet:Object.fromEntries(['flop','turn','river'].map(st=>[st,selected.filter(s=>s.street===st).length])),
  measuredComparisons:records.filter(r=>r.maxFrequencyDelta!==undefined).length,
  strategyAgreements:records.filter(r=>r.strategyAgreement).length,
  substitutionCandidates:selected.length,appliedSubstitutions:0,
  limitations:['All existing opponent ranges are heuristic and unverified','Prior-street reach probabilities absent',
   'Check/all-in tree is a diagnostic simplification, not an original scenario certificate'],records};
 writeFileSync(join(out,'batch-summary.json'),JSON.stringify(report,null,2)+'\n');
}
writeSummary();
if(!prepareOnly&&records.some(r=>r.status==='EXECUTION_BLOCKED'||r.status==='COMPARATOR_FAILED'||
 (r.reasons??[]).some(reason=>!['A_RANGE_UNVERIFIED','B_RANGE_UNVERIFIED'].includes(reason))))process.exitCode=1;
