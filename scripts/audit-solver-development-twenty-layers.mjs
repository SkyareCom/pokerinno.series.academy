import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,writeFileSync} from 'node:fs';
const pre=trainingSpots.filter(s=>s.street==='pre');
const post=trainingSpots.filter(s=>s.street!=='pre');
const deck=new Set([... '23456789TJQKA'].flatMap(r=>[...'shdc'].map(s=>r+s)));
const cls=/^(?:[2-9TJQKA]{2}|[2-9TJQKA]{2}[so])$/;
const checks=[
 ['11_preflop_720',()=>pre.length===720],
 ['12_flop_450',()=>post.filter(s=>s.street==='flop').length===450],
 ['13_turn_225',()=>post.filter(s=>s.street==='turn').length===225],
 ['14_river_105',()=>post.filter(s=>s.street==='river').length===105],
 ['15_ids_contiguous',()=>trainingSpots.every((s,i)=>s.id===i+1)],
 ['16_valid_positions',()=>trainingSpots.every(s=>['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB'].includes(s.position))],
 ['17_valid_hole_cards',()=>trainingSpots.every(s=>Array.isArray(s.heroCards)&&s.heroCards.length===2&&s.heroCards.every(c=>deck.has(c)))],
 ['18_valid_board_cards',()=>post.every(s=>s.board.every(c=>deck.has(c)))],
 ['19_valid_hand_classes',()=>trainingSpots.every(s=>typeof s.hand==='string'&&cls.test(s.hand))],
 ['20_nonnegative_stack',()=>trainingSpots.every(s=>Number.isFinite(s.stack)&&s.stack>0)],
 ['21_postflop_stack_bounded',()=>post.every(s=>s.effectiveStack<=s.stack)],
 ['22_postflop_aggressor',()=>post.every(s=>s.aggressor==='BTN')],
 ['23_postflop_position',()=>post.every(s=>s.position==='BTN')],
 ['24_postflop_betting_line',()=>post.every(s=>Array.isArray(s.bettingLine)&&s.bettingLine.length>=3)],
 ['25_preflop_no_board',()=>pre.every(s=>s.board.length===0)],
 ['26_preflop_solver_reference',()=>pre.every(s=>s.solver===null||typeof s.solver.solveId==='string')],
 ['27_no_postflop_fake_solver',()=>post.every(s=>s.solver===null)],
 ['28_hero_range_provenance',()=>post.every(s=>s.rangeProvenance?.hero==='IMPORTED_9MAX_RFI_REFERENCE')],
 ['29_villain_range_provenance',()=>post.every(s=>s.rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED')],
 ['30_no_independent_certification_claim',()=>trainingSpots.every(s=>s.solver?.independentlyVerified!==true)]
];
const layers=checks.map(([name,fn])=>{try{return {name,pass:!!fn()}}catch(e){return {name,pass:false,error:String(e)}}});
mkdirSync('reports/solver/independent',{recursive:true});
const report={scope:'ACADEMY_LOCAL',additionalLayers:20,passed:layers.filter(x=>x.pass).length,layers,certificationClaim:false};
writeFileSync('reports/solver/independent/twenty-layer-development-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(report.passed!==20)process.exitCode=1;
