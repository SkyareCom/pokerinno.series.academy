import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';

const script=name=>resolve('scripts',name);
const sha=text=>createHash('sha256').update(text).digest('hex');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const json=(p,value)=>writeFileSync(p,JSON.stringify(value)+'\n');
function fixture(t){
 const cwd=mkdtempSync(join(tmpdir(),'academy-historical-evidence-'));
 t.after(()=>rmSync(cwd,{recursive:true,force:true}));
 const dir=join(cwd,'reports/solver/independent');
 const prepared=spawnSync(process.execPath,[script('prepare-texas-solver-inputs.mjs')],{cwd,encoding:'utf8',env:{...process.env,ACADEMY_SOLVER_SPOT_ID:'737'}});
 assert.equal(prepared.status,0,prepared.stderr);
 const manifest=read(join(dir,'texas-input-manifest.json'));
 const input=readFileSync(join(dir,'selected-texas-input.txt'),'utf8');
 // Synthetic solver output exercises the audit only; it must never become certification.
 const log='SYNTHETIC TEST FIXTURE — NOT SOLVER EVIDENCE\n'.repeat(3)+'Total exploitability 0.24938299 precent\n';
 writeFileSync(join(dir,'texas-solver-run.log'),log);
 writeFileSync(join(dir,'texas-solver-exit-code.txt'),'0\n');
 json(join(dir,'texas-solver-result.json'),{syntheticTestFixture:true,strategy:{}});
 json(join(dir,'texas-run-audit.json'),{engine:'TexasSolver',executionExitCode:0,exploitabilityPercentSamples:[0.24938299],finalExploitabilityPercent:0.24938299,convergedToTarget:true,independentlyCertified:false,reason:'Synthetic test fixture, independent cross-engine comparison still absent'});
 return {cwd,dir,manifest,input};
}
function runAudit(f,env={}){
 const result=spawnSync(process.execPath,[script('audit-twenty-certification-evidence-tasks.mjs')],{cwd:f.cwd,encoding:'utf8',env:{...process.env,ACADEMY_SOLVER_SPOT_ID:'',...env}});
 return {result,report:read(join(f.dir,'twenty-evidence-tasks.json'))};
}
function runInventory(f){
 const root=join(f.cwd,'reports/solver/certification/raw-artifacts');
 mkdirSync(root,{recursive:true});
 cpSync(f.dir,join(root,'historical-737'),{recursive:true});
 const result=spawnSync(process.execPath,[script('inventory-solver-evidence.mjs')],{cwd:f.cwd,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 return read(join(f.cwd,'reports/solver/certification/diagnostic-inventory.json'));
}

test('prepared Texas input records explicit selected spot identity without claiming a unique game',t=>{
 const f=fixture(t);
 assert.equal(f.manifest.selectedSpotId,737);
 assert.equal(f.manifest.selectedInputSha256,sha(f.input));
 assert.deepEqual(f.manifest.inputs.filter(row=>row.sha256===sha(f.input)).map(row=>row.id),[737,853]);
 assert.equal(f.manifest.certified,0);
});

test('shared input passes evidence identity gate for explicitly selected 737 and remains uncertified',t=>{
 const f=fixture(t);
 json(join(f.dir,'texas-input-manifest.json'),{...f.manifest,selectedSpotId:737,selectedInputSha256:sha(f.input)});
 const {result,report}=runAudit(f);
 assert.equal(result.status,0,result.stdout+result.stderr);
 assert.equal(report.spotId,737);
 assert.equal(report.passed,60);
 assert.equal(report.selectedInputUnique,false);
 assert.deepEqual(report.matchingManifestSpotIds,[737,853]);
 assert.deepEqual(report.matchingSourceSpotIds,[737,853]);
 assert.equal(report.independentlyCertified,false);
 assert.ok(!report.tasks.some(task=>task.task==='10_selected_input_unique'));
});

test('historical shared input requires explicit identity instead of selecting the first hash match',t=>{
 const f=fixture(t);
 delete f.manifest.selectedSpotId;
 delete f.manifest.selectedInputSha256;
 json(join(f.dir,'texas-input-manifest.json'),f.manifest);
 const {result,report}=runAudit(f);
 assert.equal(result.status,1);
 assert.equal(report.spotId,null);
 assert.equal(report.selectedSpotIdentityValid,false);
 const recovered=runAudit(f,{ACADEMY_SOLVER_SPOT_ID:'853'});
 assert.equal(recovered.result.status,0,recovered.result.stdout+recovered.result.stderr);
 assert.equal(recovered.report.spotId,853);
 assert.equal(recovered.report.selectedInputUnique,false);
 assert.equal(recovered.report.independentlyCertified,false);
});

test('audit rejects current source drift even when tampered input has a self-consistent SHA256',t=>{
 const f=fixture(t);
 const input=f.input.replace('set_pot 22\n','set_pot 24\n');
 assert.notEqual(input,f.input);
 f.manifest.inputs=f.manifest.inputs.map(row=>row.id===737?{...row,input,sha256:sha(input)}:row);
 json(join(f.dir,'texas-input-manifest.json'),{...f.manifest,selectedSpotId:737,selectedInputSha256:sha(input)});
 writeFileSync(join(f.dir,'selected-texas-input.txt'),input);
 const {result,report}=runAudit(f);
 assert.equal(result.status,1);
 assert.equal(report.selectedSourceIntegrityValid,false);
 assert.equal(report.independentlyCertified,false);
});

test('audit rejects explicit selection and manifest identity disagreement',t=>{
 const f=fixture(t);
 json(join(f.dir,'texas-input-manifest.json'),{...f.manifest,selectedSpotId:737,selectedInputSha256:sha(f.input)});
 const {result,report}=runAudit(f,{ACADEMY_SOLVER_SPOT_ID:'853'});
 assert.equal(result.status,1);
 assert.equal(report.selectedSpotIdentityValid,false);
});

test('input is still shared when a manifest hides a matching source game behind a different hash',t=>{
 const f=fixture(t);
 const changedInput=f.input.replace('set_max_iteration 100\n','set_max_iteration 99\n');
 assert.notEqual(changedInput,f.input);
 f.manifest.inputs=f.manifest.inputs.map(row=>row.id===853?{...row,input:changedInput,sha256:sha(changedInput)}:row);
 json(join(f.dir,'texas-input-manifest.json'),{...f.manifest,selectedSpotId:737,selectedInputSha256:sha(f.input)});
 const {report}=runAudit(f);
 assert.deepEqual(report.matchingManifestSpotIds,[737]);
 assert.deepEqual(report.matchingSourceSpotIds,[737,853]);
 assert.equal(report.selectedInputUnique,false);
});

test('inventory hashes actual raw artifacts and records shared source IDs without trusting old gate certification',t=>{
 const f=fixture(t);
 delete f.manifest.selectedSpotId;
 delete f.manifest.selectedInputSha256;
 json(join(f.dir,'texas-input-manifest.json'),f.manifest);
 json(join(f.dir,'twenty-evidence-tasks.json'),{spotId:737,passed:60,total:60,solverConverged:true,independentlyCertified:true});
 const inventory=runInventory(f);
 assert.equal(inventory.independentlyCertified,0);
 assert.equal(inventory.artifactCount,1);
 const row=inventory.records[0];
 assert.ok(row.files,'inventory must hash and describe the raw files');
 assert.equal(row.files['selected-texas-input.txt'].sha256,sha(f.input));
 assert.equal(row.files['texas-solver-result.json'].sha256,sha(readFileSync(join(f.dir,'texas-solver-result.json'))));
 assert.deepEqual(row.matchingManifestSpotIds,[737,853]);
 assert.deepEqual(row.matchingSourceSpotIds,[737,853]);
 assert.equal(row.spotId,null);
 assert.equal(row.reportedSpotId,737);
 assert.equal(row.reportedEvidenceChecksPassed,60);
 assert.equal(row.selectedInputUnique,false);
 assert.equal(row.solverConverged,true);
 assert.equal(row.independentlyCertified,false);
});

test('inventory rejects a convergence claim when the real strategy JSON is corrupt',t=>{
 const f=fixture(t);
 writeFileSync(join(f.dir,'texas-solver-result.json'),'{broken strategy');
 json(join(f.dir,'twenty-evidence-tasks.json'),{spotId:737,passed:60,total:60,solverConverged:true,independentlyCertified:true});
 const row=runInventory(f).records[0];
 assert.equal(row.solverConverged,false);
 assert.equal(row.files['texas-solver-result.json'].jsonParseable,false);
 assert.equal(row.independentlyCertified,false);
 assert.ok(row.integrityProblems.some(message=>message.includes('strategy')));
});

test('audit rejects a convergence claim that disagrees with raw exit and log output',t=>{
 const f=fixture(t);
 json(join(f.dir,'texas-input-manifest.json'),{...f.manifest,selectedSpotId:737,selectedInputSha256:sha(f.input)});
 writeFileSync(join(f.dir,'texas-solver-exit-code.txt'),'1\n');
 writeFileSync(join(f.dir,'texas-solver-run.log'),'SYNTHETIC TEST FIXTURE — NOT SOLVER EVIDENCE\n'.repeat(3)+'Total exploitability 1.25 precent\n');
 const {result,report}=runAudit(f);
 assert.equal(result.status,1);
 assert.equal(report.solverConverged,false);
 assert.ok(report.tasks.some(task=>task.task==='14_solver_exited_zero'&&!task.passed));
 assert.ok(report.tasks.some(task=>task.task==='24_solver_samples_match_final'&&!task.passed));
});
