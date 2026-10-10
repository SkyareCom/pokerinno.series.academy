import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,symlinkSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {manifestHash} from '../scripts/lib/meta-audit-bundle.mjs';

const run=(script,...args)=>spawnSync(process.execPath,['scripts/'+script,...args],{encoding:'utf8'});
test('Meta review bundle exports all 1500 source decisions with hash-checked coverage',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-meta-'));
 try{
  const exported=run('export-meta-audit-bundle.mjs','--out',dir);
  assert.equal(exported.status,0,exported.stderr);
  const manifest=JSON.parse(readFileSync(join(dir,'manifest.json')));
  assert.deepEqual(manifest.byStreet,{pre:720,flop:450,turn:225,river:105});
  assert.equal(manifest.spotCount,1500);
  assert.equal(manifest.certificationEffect,'NONE');
  const rows=manifest.files.filter(f=>f.path.startsWith('spots/'));
  assert.equal(rows.length,30,'50 source decisions per review batch');
  const spots=rows.flatMap(f=>JSON.parse(readFileSync(join(dir,f.path))));
  assert.equal(new Set(spots.map(s=>s.id)).size,1500);
  assert.equal(spots.filter(s=>s.street!=='pre').length,780);
  assert.equal(run('verify-meta-audit-bundle.mjs','--bundle',dir).status,0);
  const originalManifest=readFileSync(join(dir,'manifest.json'));
  manifest.spotSourceSha256='0'.repeat(64);manifest.bundleSha256=manifestHash(manifest);
  writeFileSync(join(dir,'manifest.json'),JSON.stringify(manifest));
  assert.notEqual(run('verify-meta-audit-bundle.mjs','--bundle',dir).status,0,'source snapshot hash must match the actual exported decisions');
  writeFileSync(join(dir,'manifest.json'),originalManifest);
  writeFileSync(join(dir,rows[0].path),'[]\n');
  const tampered=run('verify-meta-audit-bundle.mjs','--bundle',dir);
  assert.notEqual(tampered.status,0);
  assert.match(tampered.stderr,/integrity|hash/i);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('a supplemental external opinion never supplies solver certification or verified reviewer identity',()=>{
 const dir=mkdtempSync(join(tmpdir(),'academy-opinion-'));
 try{
  assert.equal(run('export-meta-audit-bundle.mjs','--out',join(dir,'bundle')).status,0);
  const manifest=JSON.parse(readFileSync(join(dir,'bundle/manifest.json')));
  const file=manifest.files.find(f=>f.path==='scripts/certify-all-1500-spots.mjs');
  const opinion={schemaVersion:1,bundleSha256:manifest.bundleSha256,reviewer:'Meta AI',
   reviewedSpotIds:[737,1171,1396],verdict:'CHANGES_REQUIRED',
   findings:[{severity:'HIGH',file:file.path,fileSha256:file.sha256,line:1,spotIds:[737],
    description:'The ranges need independent evidence.',recommendation:'Provide verified source ranges.'}]};
  const input=join(dir,'opinion.json'),out=join(dir,'accepted.json');
  writeFileSync(input,JSON.stringify(opinion));
  const imported=run('import-meta-audit-opinion.mjs','--bundle',join(dir,'bundle'),'--opinion',input,'--out',out);
  assert.equal(imported.status,0,imported.stderr);
  const accepted=JSON.parse(readFileSync(out));
  assert.equal(accepted.certificationEffect,'NONE');
  assert.equal(accepted.independentlyCertified,false);
  assert.equal(accepted.reviewerIdentityVerified,false);
  assert.equal(accepted.reviewedSpotCount,3);
  assert.equal(accepted.fullCoverage,false);
  assert.deepEqual(accepted.unreviewedByStreet,{pre:720,flop:449,turn:224,river:104});
  opinion.independentlyCertified=true;
  writeFileSync(input,JSON.stringify(opinion));
  const forged=run('import-meta-audit-opinion.mjs','--bundle',join(dir,'bundle'),'--opinion',input,'--out',join(dir,'forged.json'));
  assert.notEqual(forged.status,0);assert.match(forged.stderr,/certification/i);
  delete opinion.independentlyCertified;
  opinion.reviewedSpotIds=[1501];
  writeFileSync(input,JSON.stringify(opinion));
  assert.notEqual(run('import-meta-audit-opinion.mjs','--bundle',join(dir,'bundle'),'--opinion',input,'--out',join(dir,'invalid-id.json')).status,0);
  opinion.reviewedSpotIds=[737,1171,1396];opinion.findings[0].fileSha256='0'.repeat(64);
  writeFileSync(input,JSON.stringify(opinion));
  assert.notEqual(run('import-meta-audit-opinion.mjs','--bundle',join(dir,'bundle'),'--opinion',input,'--out',join(dir,'invalid-hash.json')).status,0);
  opinion.findings[0].fileSha256=file.sha256;
  writeFileSync(input,JSON.stringify(opinion));
  const protectedDir=mkdtempSync('reports/solver/certification/opinion-isolation-');
  try{
   symlinkSync(resolve(protectedDir),join(dir,'review-alias'),'dir');
   const escaped=run('import-meta-audit-opinion.mjs','--bundle',join(dir,'bundle'),'--opinion',input,'--out',join(dir,'review-alias','737.json'));
   assert.notEqual(escaped.status,0,'a symlink must not let an opinion create solver evidence');
   assert.equal(existsSync(join(protectedDir,'737.json')),false);
   const otherCwd=spawnSync(process.execPath,[resolve('scripts/import-meta-audit-opinion.mjs'),'--bundle',join(dir,'bundle'),
    '--opinion',input,'--out',resolve(protectedDir,'alternate-cwd.json')],{encoding:'utf8',cwd:dir});
   assert.notEqual(otherCwd.status,0,'protected repository roots must not depend on the caller cwd');
   assert.equal(existsSync(join(protectedDir,'alternate-cwd.json')),false);
  }finally{rmSync(protectedDir,{recursive:true,force:true});}
 }finally{rmSync(dir,{recursive:true,force:true});}
});
