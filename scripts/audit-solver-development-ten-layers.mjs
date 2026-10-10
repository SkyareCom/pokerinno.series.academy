import {trainingSpots} from '../dist/simulator-spots.js';
import {createHash} from 'node:crypto';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const out='reports/solver/independent';mkdirSync(out,{recursive:true});
const post=trainingSpots.filter(s=>s.street!=='pre');
const ids=new Set(),fingerprints=new Set();
const checks=[
 ['01_total_1500',()=>trainingSpots.length===1500],
 ['02_postflop_780',()=>post.length===780],
 ['03_unique_ids',()=>trainingSpots.every(s=>!ids.has(s.id)&&!!ids.add(s.id))],
 ['04_valid_9max',()=>trainingSpots.every(s=>s.tableSize===9)],
 ['05_board_lengths',()=>post.every(s=>s.board?.length===({flop:3,turn:4,river:5}[s.street]))],
 ['06_distinct_cards',()=>post.every(s=>new Set([...s.board,...s.heroCards]).size===s.board.length+2)],
 ['07_positive_pots_stacks',()=>post.every(s=>Number.isFinite(s.pot)&&s.pot>0&&Number.isFinite(s.effectiveStack)&&s.effectiveStack>0)],
 ['08_ranges_numeric',()=>post.every(s=>[s.heroRange,s.villainRange].every(r=>r&&Object.keys(r).length===169&&Object.values(r).every(v=>Number.isFinite(v)&&v>=0&&v<=1)))],
 ['09_provenance_no_fake_certification',()=>post.every(s=>s.solver===null&&s.rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED')],
 ['10_unique_decision_fingerprints',()=>post.every(s=>{const fp=createHash('sha256').update(JSON.stringify([s.street,s.position,s.stack,s.heroCards,s.board,s.bettingLine])).digest('hex');if(fingerprints.has(fp))return false;fingerprints.add(fp);return true;})]
];
const results=checks.map(([layer,fn])=>{try{return {layer,pass:!!fn()};}catch(e){return {layer,pass:false,error:String(e)}}});
const report={schemaVersion:1,scope:'ACADEMY_LOCAL',layers:results,passed:results.filter(x=>x.pass).length,total:results.length,independentlyCertified:0,disclaimer:'Structural and provenance checks only. No GTO or independent solver certification.'};
writeFileSync(out+'/ten-layer-development-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(report.passed!==report.total)process.exitCode=1;
