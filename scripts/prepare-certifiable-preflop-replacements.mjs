import ranges from '../dist/ranges-dcfr-9max.json' with {type:'json'};
import {mkdirSync,writeFileSync} from 'node:fs';
const positions=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB'];
const stacks=[10,15,30,100];
const candidates=[];
for(const stack of stacks)for(const position of positions){
 const scenario=ranges.scenarios?.[stack+'|'+position];
 if(!scenario||!Array.isArray(scenario.actions))continue;
 for(const row of scenario.actions){
  if(!Array.isArray(row)||typeof row[0]!=='string')continue;
  const frequencies=row.slice(1);
  const valid=frequencies.length>0&&frequencies.every(a=>Array.isArray(a)&&typeof a[0]==='string'&&Number.isFinite(a[1])&&a[1]>=0&&a[1]<=100);
  if(!valid)continue;
  const sum=frequencies.reduce((n,a)=>n+a[1],0);
  if(Math.abs(sum-100)>0.2)continue;
  candidates.push({tableSize:9,street:'pre',stack,position,hand:row[0],
   actions:frequencies,referenceSolveId:scenario.solveId??null,
   certificationStatus:'PENDING_INDEPENDENT_VALIDATION'});
 }
}
const unique=new Map();
for(const candidate of candidates)unique.set([candidate.stack,candidate.position,candidate.hand].join('|'),candidate);
const pool=[...unique.values()];
const selected=pool.slice(0,1500).map((x,i)=>({replacementId:i+1,...x}));
const report={schemaVersion:1,purpose:'REPLACEMENT_CANDIDATES_ONLY',required:1500,
  available:pool.length,selected:selected.length,certified:0,
  blockedReason:'Independent solver evidence and range provenance have not been verified',
  candidates:selected};
mkdirSync('reports/solver/certification',{recursive:true});
writeFileSync('reports/solver/certification/preflop-replacement-candidates.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({required:1500,available:pool.length,selected:selected.length,certified:0}));
if(selected.length!==1500)process.exitCode=1;
