import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {trainingSpots} from '../dist/simulator-spots.js';
import {matchesTexasSource,sourceSpotSha256} from './prepare-texas-solver-inputs.mjs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function inspectTexasEvidence(directory='reports/solver/independent',explicitSpotId){
const dir=directory.replace(/\/$/,'')+'/';
const read=(name)=>{try{return JSON.parse(readFileSync(dir+name,'utf8'))}catch{return null}};
const text=(name)=>{try{return readFileSync(dir+name,'utf8')}catch{return ''}};
const manifest=read('texas-input-manifest.json');
const audit=read('texas-run-audit.json');
const result=read('texas-solver-result.json');
const rows=Array.isArray(manifest?.inputs)?manifest.inputs:[];
const selectedText=text('selected-texas-input.txt');
const selectedHash=createHash('sha256').update(selectedText).digest('hex');
const matchingInputs=rows.filter(r=>r?.sha256===selectedHash&&r.input===selectedText);
const explicitProvided=explicitSpotId!==undefined&&explicitSpotId!==null&&String(explicitSpotId).trim()!=='';
const manifestProvided=manifest?.selectedSpotId!==undefined;
const requestedId=explicitProvided?Number(explicitSpotId):manifest?.selectedSpotId;
const identityRows=rows.filter(r=>r?.id===requestedId);
// A hash identifies a game, not a hero decision. Never infer the selected ID from its first match.
const selectedSpotIdentityValid=Number.isInteger(requestedId)&&identityRows.length===1&&
 (!manifestProvided||manifest.selectedSpotId===requestedId);
const selectedRow=selectedSpotIdentityValid?identityRows[0]:null;
const selectedInputIntegrityValid=!!selectedRow&&typeof selectedRow.input==='string'&&
 selectedRow.input===selectedText&&selectedRow.sha256===selectedHash&&
 (manifest?.selectedInputSha256===undefined||manifest.selectedInputSha256===selectedHash);
const sourceSpot=selectedRow?trainingSpots.find(s=>s.id===selectedRow.id):null;
const selectedSourceIntegrityValid=selectedInputIntegrityValid&&matchesTexasSource(selectedText,sourceSpot)&&
 selectedRow.street===sourceSpot.street&&
 JSON.stringify(selectedRow.rangeProvenance)===JSON.stringify(sourceSpot.rangeProvenance)&&
 (selectedRow.sourceSpotSha256===undefined||selectedRow.sourceSpotSha256===sourceSpotSha256(sourceSpot));
const matchingSourceSpotIds=trainingSpots.filter(s=>matchesTexasSource(selectedText,s)).map(s=>s.id);
const board=sourceSpot?.board??[];
const allCards=[...(board??[]),...(sourceSpot?.heroCards??[])];
const solveLog=text('texas-solver-run.log');
const exitText=text('texas-solver-exit-code.txt').trim();
const executionExitCode=/^-?\d+$/.test(exitText)?Number(exitText):null;
const sampleValues=Array.isArray(audit?.exploitabilityPercentSamples)?audit.exploitabilityPercentSamples:[];
const rawSamples=[...solveLog.matchAll(/Total exploitability\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s+precent/gi)].map(m=>Number(m[1]));
const samplesMatch=rawSamples.length>0&&rawSamples.length===sampleValues.length&&rawSamples.every((x,i)=>x===sampleValues[i]);
const finalExploitabilityPercent=rawSamples.at(-1)??null;
const strategyJsonValid=!!result&&typeof result==='object'&&!Array.isArray(result);
const rawSolverConverged=executionExitCode===0&&strategyJsonValid&&rawSamples.length>0&&
 rawSamples.every(x=>Number.isFinite(x)&&x>=0)&&finalExploitabilityPercent<=0.3;
const solverConverged=rawSolverConverged&&audit?.convergedToTarget===true&&audit.executionExitCode===executionExitCode&&
 samplesMatch&&audit.finalExploitabilityPercent===finalExploitabilityPercent;
const solverInputIds=rows.map(r=>r?.id);
const commands=selectedText.trim().split(/\r?\n/).filter(Boolean);
const countCommand=(name)=>commands.filter(line=>line.startsWith(name+' ')).length;
const valueOf=(name)=>commands.find(line=>line.startsWith(name+' '))?.slice(name.length+1);
const numeric=(v)=>v!==undefined&&v.trim()!==''&&Number.isFinite(Number(v));
const cards=new Set([...'23456789TJQKA'].flatMap(r=>[...'shdc'].map(s=>r+s)));
const checks=[
 ['01_total_spots',trainingSpots.length===1500],
 ['02_postflop_count',rows.length===780],
 ['03_preflop_count',trainingSpots.filter(s=>s.street==='pre').length===720],
 ['04_manifest_engine',typeof manifest?.engine==='string'&&manifest.engine.includes('TexasSolver')],
 ['05_manifest_unique_ids',new Set(solverInputIds).size===780],
 ['06_manifest_contiguous_ids',rows.every((r,i)=>r?.id===i+721)],
 ['07_manifest_input_nonempty',rows.every(r=>typeof r?.input==='string'&&r.input.length>100)],
 ['08_manifest_hash_valid',rows.every(r=>typeof r?.input==='string'&&createHash('sha256').update(r.input).digest('hex')===r.sha256)],
 ['09_selected_input_exists',selectedText.length>100],
 ['10_selected_spot_identity_unique',selectedSpotIdentityValid],
 ['11_selected_input_matches_manifest',selectedInputIntegrityValid],
 ['12_selected_source_matches_input',selectedSourceIntegrityValid],
 ['13_selected_cards_valid',selectedSpotIdentityValid&&board.length>=3&&board.every(c=>cards.has(c))&&new Set(board).size===board.length],
 ['14_solver_exited_zero',executionExitCode===0&&audit?.executionExitCode===0],
 ['15_strategy_json_parseable',!!result&&typeof result==='object'],
 ['16_exploitability_numeric',Number.isFinite(finalExploitabilityPercent)&&Number.isFinite(audit?.finalExploitabilityPercent)],
 ['17_exploitability_threshold',solverConverged],
 ['18_source_provenance_explicit',selectedSpotIdentityValid&&!!selectedRow.rangeProvenance?.villain],
 ['19_no_false_manifest_certification',manifest?.certified===0&&rows.every(r=>r?.status==='PROVISIONAL_UNVERIFIED')],
 ['20_no_false_independent_certification',audit?.independentlyCertified===false],
 ['21_solver_log_present',solveLog.length>100],
 ['22_solver_samples_finite',rawSamples.length>0&&rawSamples.every(Number.isFinite)&&sampleValues.length>0&&sampleValues.every(Number.isFinite)],
 ['23_solver_samples_nonnegative',rawSamples.length>0&&rawSamples.every(x=>x>=0)&&sampleValues.length>0&&sampleValues.every(x=>x>=0)],
 ['24_solver_samples_match_final',samplesMatch&&finalExploitabilityPercent===audit?.finalExploitabilityPercent],
 ['25_manifest_ids_sorted',solverInputIds.every((id,i)=>i===0||id>solverInputIds[i-1])],
 ['26_selected_board_matches_input',selectedInputIntegrityValid&&valueOf('set_board')===board.join(',')],
 ['27_input_has_solver_start',selectedText.includes('start_solve')],
 ['28_input_has_strategy_dump',selectedText.includes('dump_result')],
 ['29_input_has_two_player_ranges',selectedText.includes('set_range_ip ')&&selectedText.includes('set_range_oop ')],
 ['30_input_has_solver_iteration_limit',/set_max_iteration [1-9][0-9]*/.test(selectedText)],
 ['31_input_has_accuracy_target',/set_accuracy [0-9.]+/.test(selectedText)],
 ['32_source_board_unique',new Set(allCards).size===allCards.length],
 ['33_source_has_street',typeof sourceSpot?.street==='string'],
 ['34_selected_spot_is_postflop',sourceSpot?.street!=='pre'&&!!sourceSpot],
 ['35_manifest_spot_count_matches',rows.length===trainingSpots.filter(s=>s.street!=='pre').length],
 ['36_audit_solver_engine',audit?.engine==='TexasSolver'],
 ['37_audit_certification_reason',typeof audit?.reason==='string'&&audit.reason.length>10],
 ['38_result_nonarray_object',!!result&&typeof result==='object'&&!Array.isArray(result)],
 ['39_solver_input_hash_sha256',/^[a-f0-9]{64}$/.test(selectedHash)],
 ['40_unverified_range_provenance_explicit',selectedSpotIdentityValid&&selectedRow.rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED'],
 ['41_one_build_tree',countCommand('build_tree')===0&&commands.filter(x=>x==='build_tree').length===1],
 ['42_one_start_solve',commands.filter(x=>x==='start_solve').length===1],
 ['43_one_dump_result',countCommand('dump_result')===1],
 ['44_one_pot',countCommand('set_pot')===1],
 ['45_positive_pot',numeric(valueOf('set_pot'))&&Number(valueOf('set_pot'))>0],
 ['46_one_stack',countCommand('set_effective_stack')===1],
 ['47_positive_stack',numeric(valueOf('set_effective_stack'))&&Number(valueOf('set_effective_stack'))>0],
 ['48_one_board',countCommand('set_board')===1],
 ['49_board_card_count',board.length>=3&&board.length<=5],
 ['50_board_matches_street',board.length===({flop:3,turn:4,river:5}[sourceSpot?.street]??-1)],
 ['51_one_ip_range',countCommand('set_range_ip')===1],
 ['52_one_oop_range',countCommand('set_range_oop')===1],
 ['53_ip_range_nonempty',valueOf('set_range_ip')?.length>10],
 ['54_oop_range_nonempty',valueOf('set_range_oop')?.length>10],
 ['55_one_thread_count',countCommand('set_thread_num')===1],
 ['56_positive_thread_count',Number.isInteger(Number(valueOf('set_thread_num')))&&Number(valueOf('set_thread_num'))>0],
 ['57_one_accuracy_target',countCommand('set_accuracy')===1],
 ['58_positive_accuracy_target',numeric(valueOf('set_accuracy'))&&Number(valueOf('set_accuracy'))>0],
 ['59_one_max_iteration',countCommand('set_max_iteration')===1],
 ['60_one_dump_rounds',countCommand('set_dump_rounds')===1]
];
const layers=checks.map(([task,passed])=>({task,passed:Boolean(passed)}));
const integrityProblems=[];
if(!selectedSpotIdentityValid)integrityProblems.push('Explicit selected spot identity is absent, invalid, duplicated, or conflicts with the manifest');
if(!selectedInputIntegrityValid)integrityProblems.push('Selected input does not match the explicitly selected manifest row and SHA256');
if(!selectedSourceIntegrityValid)integrityProblems.push('Selected input, provenance, or source fingerprint does not match the current source spot');
if(!strategyJsonValid)integrityProblems.push('Raw strategy JSON is missing, corrupt, or not an object');
if(executionExitCode!==0||audit?.executionExitCode!==executionExitCode)integrityProblems.push('Raw solver exit code is missing, unsuccessful, or disagrees with the run audit');
if(!samplesMatch||audit?.finalExploitabilityPercent!==finalExploitabilityPercent)integrityProblems.push('Raw exploitability log samples disagree with the run audit');
if(layers.some(x=>x.task==='08_manifest_hash_valid'&&!x.passed))integrityProblems.push('Manifest contains an invalid input SHA256');
return {schemaVersion:2,spotId:selectedRow?.id??null,sourceInputSha256:selectedHash,
 selectedSpotIdentityValid,selectedInputIntegrityValid,selectedSourceIntegrityValid,
 selectedIdentitySource:selectedSpotIdentityValid?(explicitProvided?'EXPLICIT_SPOT_ID':'MANIFEST_SELECTED_SPOT_ID'):null,
 sourceIntegrityScope:selectedRow?.sourceSpotSha256?'SOURCE_SPOT_FINGERPRINT_AND_SOLVER_GAME':'SOLVER_GAME_PARAMETERS_AND_MANIFEST_PROVENANCE',
 selectedInputUnique:matchingInputs.length===1&&matchingSourceSpotIds.length===1,
 matchingManifestSpotIds:matchingInputs.map(r=>r.id),matchingSourceSpotIds,
 executionExitCode,finalExploitabilityPercent,exploitabilityPercentSamples:rawSamples,
 strategyJsonValid,rawSolverConverged,integrityProblems,tasks:layers,passed:layers.filter(x=>x.passed).length,total:checks.length,
 solverConverged,independentlyCertified:false,
 certificationBlockers:['Cross-engine agreement not established','Postflop opponent ranges are heuristic and unverified','720 preflop scenarios lack independent certification'],
 note:'Evidence-quality gate; passing 60 checks is not GTO certification. Input hashes can be shared by multiple hero decisions.'};
}
function main(){
const dir='reports/solver/independent/';
const report=inspectTexasEvidence(dir,process.env.ACADEMY_SOLVER_SPOT_ID);
mkdirSync(dir,{recursive:true});
writeFileSync(dir+'twenty-evidence-tasks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({spotId:report.spotId,passed:report.passed,total:report.total,failed:report.tasks.filter(x=>!x.passed).map(x=>x.task),matchingManifestSpotIds:report.matchingManifestSpotIds,independentlyCertified:false}));
if(report.passed!==report.total)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main();
