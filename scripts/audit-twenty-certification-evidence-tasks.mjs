import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {trainingSpots} from '../dist/simulator-spots.js';
const dir='reports/solver/independent/';
mkdirSync(dir,{recursive:true});
const read=(name)=>{try{return JSON.parse(readFileSync(dir+name,'utf8'))}catch{return null}};
const manifest=read('texas-input-manifest.json');
const audit=read('texas-run-audit.json');
const result=read('texas-solver-result.json');
const rows=manifest?.inputs??[];
const selectedText=existsSync(dir+'selected-texas-input.txt')?readFileSync(dir+'selected-texas-input.txt','utf8'):'';
const selectedHash=createHash('sha256').update(selectedText).digest('hex');
const selected=rows.filter(r=>r.sha256===selectedHash);
const sourceSpot=trainingSpots.find(s=>s.id===selected[0]?.id);
const board=sourceSpot?.board??[];
const allCards=[...(board??[]),...(sourceSpot?.heroCards??[])];
const solveLog=existsSync(dir+'texas-solver-run.log')?readFileSync(dir+'texas-solver-run.log','utf8'):'';
const sampleValues=audit?.exploitabilityPercentSamples??[];
const solverInputIds=rows.map(r=>r.id);
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
 ['05_manifest_unique_ids',new Set(rows.map(r=>r.id)).size===780],
 ['06_manifest_contiguous_ids',rows.every((r,i)=>r.id===i+721)],
 ['07_manifest_input_nonempty',rows.every(r=>typeof r.input==='string'&&r.input.length>100)],
 ['08_manifest_hash_valid',rows.every(r=>createHash('sha256').update(r.input).digest('hex')===r.sha256)],
 ['09_selected_input_exists',selectedText.length>100],
 ['10_selected_input_unique',selected.length===1],
 ['11_selected_input_matches_manifest',selected.length===1&&selected[0].input===selectedText],
 ['12_selected_spot_exists',selected.length===1&&trainingSpots.some(s=>s.id===selected[0].id)],
 ['13_selected_cards_valid',selected.length===1&&board.length>=3&&board.every(c=>cards.has(c))&&new Set(board).size===board.length],
 ['14_solver_exited_zero',audit?.executionExitCode===0],
 ['15_strategy_json_parseable',!!result&&typeof result==='object'],
 ['16_exploitability_numeric',Number.isFinite(audit?.finalExploitabilityPercent)],
 ['17_exploitability_threshold',audit?.convergedToTarget===true&&audit.finalExploitabilityPercent<=0.3],
 ['18_source_provenance_explicit',selected.length===1&&!!selected[0].rangeProvenance?.villain],
 ['19_no_false_manifest_certification',manifest?.certified===0&&rows.every(r=>r.status==='PROVISIONAL_UNVERIFIED')],
 ['20_no_false_independent_certification',audit?.independentlyCertified===false],
 ['21_solver_log_present',solveLog.length>100],
 ['22_solver_samples_finite',sampleValues.length>0&&sampleValues.every(Number.isFinite)],
 ['23_solver_samples_nonnegative',sampleValues.length>0&&sampleValues.every(x=>x>=0)],
 ['24_solver_samples_match_final',sampleValues.length>0&&sampleValues.at(-1)===audit?.finalExploitabilityPercent],
 ['25_manifest_ids_sorted',solverInputIds.every((id,i)=>i===0||id>solverInputIds[i-1])],
 ['26_selected_board_matches_input',selected.length===1&&selected[0].input.includes('set_board '+board.join(','))],
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
 ['40_unverified_range_provenance_explicit',selected.length===1&&selected[0].rangeProvenance?.villain==='ACADEMY_HEURISTIC_UNVERIFIED'],
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
const report={schemaVersion:1,spotId:selected[0]?.id??null,sourceInputSha256:selectedHash,tasks:layers,passed:layers.filter(x=>x.passed).length,total:checks.length,solverConverged:checks[16][1]===true,independentlyCertified:false,certificationBlockers:['Cross-engine agreement not established','Postflop opponent ranges are heuristic and unverified','720 preflop scenarios lack independent certification'],note:'Evidence-quality gate; passing 60 checks is not GTO certification'};
writeFileSync(dir+'twenty-evidence-tasks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({spotId:report.spotId,passed:report.passed,total:checks.length,independentlyCertified:false}));
if(report.passed!==checks.length)process.exitCode=1;
