import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const root='reports/solver/independent/';
const log=existsSync(root+'texas-solver-run.log')?readFileSync(root+'texas-solver-run.log','utf8'):'';
const exit=existsSync(root+'texas-solver-exit-code.txt')?Number(readFileSync(root+'texas-solver-exit-code.txt','utf8').trim()):null;
const matches=[...log.matchAll(/Total exploitability\s+([\d.]+)\s+precent/gi)];
const samples=matches.map(m=>Number(m[1])).filter(Number.isFinite);
const resultPath=root+'texas-solver-result.json';
let jsonValid=false;
if(existsSync(resultPath)){try{const j=JSON.parse(readFileSync(resultPath,'utf8'));jsonValid=!!j&&typeof j==='object';}catch{}}
const report={engine:'TexasSolver',executionExitCode:exit,exploitabilityPercentSamples:samples,finalExploitabilityPercent:samples.at(-1)??null,solverExitedSuccessfully:exit===0,hasParseableStrategyJson:jsonValid,convergedToTarget:exit===0&&samples.length>0&&samples.at(-1)<=0.3&&jsonValid,independentlyCertified:false,reason:'Independent cross-engine strategy comparison and source-provenance verification remain required'};
writeFileSync(root+'texas-run-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(!report.convergedToTarget)process.exitCode=1;
