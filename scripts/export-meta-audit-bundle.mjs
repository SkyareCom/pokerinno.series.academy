import {trainingSpots} from '../dist/simulator-spots.js';
import {mkdirSync,readFileSync,writeFileSync,readdirSync,existsSync,realpathSync} from 'node:fs';
import {resolve,dirname,relative,isAbsolute,join} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {sha256,readJson,manifestHash,inside,verifyBundle} from './lib/meta-audit-bundle.mjs';
const args=process.argv.slice(2),get=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const repo=realpathSync('.'),out=resolve(get('--out','reports/meta-audit/bundle'));
if(existsSync(out)&&readdirSync(out).length)throw Error('Audit output must be empty to avoid mixing snapshots');
mkdirSync(out,{recursive:true});
const files=[],written=new Set();
function write(path,bytes){
 if(written.has(path))return;written.add(path);
 const target=resolve(out,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);
 files.push({path,bytes:Buffer.byteLength(bytes),sha256:sha256(bytes)});
}
function copy(path){write(path,readFileSync(inside(repo,path)));}
const sourcePaths=['AGENTS.md','package.json','docs/meta-ai-audit.md','dist/simulator-spots.js','dist/simulator.js','dist/simulator-uniqueness.js',
 'dist/ranges-library.js','dist/ranges-dcfr-9max.json','scripts/lib/independent-solver-adapters.mjs',
 'scripts/lib/meta-audit-bundle.mjs','scripts/patches/dcfr-stack-capacity.patch',
 'scripts/build-independent-solvers.sh','scripts/run-independent-postflop.mjs','scripts/compare-solver-exports.mjs',
 'scripts/certify-all-1500-spots.mjs','scripts/build-academy-weighted-ranges.mjs','scripts/prepare-postflop-certification-queue.mjs',
 'scripts/export-meta-audit-bundle.mjs','scripts/verify-meta-audit-bundle.mjs','scripts/import-meta-audit-opinion.mjs'];
for(const path of sourcePaths)copy(path);
for(const dir of ['tests','.github/workflows'])for(const name of readdirSync(dir).sort())if(/solver|certification|simulator|meta-audit/.test(name))copy(dir+'/'+name);
for(let i=0;i<trainingSpots.length;i+=50)write('spots/batch-'+String(i/50+1).padStart(2,'0')+'.json',JSON.stringify(trainingSpots.slice(i,i+50),null,2)+'\n');
const byStreet=Object.fromEntries(['pre','flop','turn','river'].map(st=>[st,trainingSpots.filter(s=>s.street===st).length]));
const registryDir=join(out,'reports/solver/certification');
const registryRun=spawnSync(process.execPath,['scripts/certify-all-1500-spots.mjs'],{encoding:'utf8',env:{...process.env,ACADEMY_CERT_OUT_DIR:registryDir}});
const registryPath=join(registryDir,'certification-registry.json');
if(![0,1].includes(registryRun.status)||!existsSync(registryPath))throw Error('Unable to recompute official certification registry: '+registryRun.stderr);
const registry=readJson(registryPath);
write('reports/solver/certification/certification-registry.json',readFileSync(registryPath));
const evidenceRoot=resolve(get('--evidence-root','reports/solver/certification/dual-engine'));
const records=[];
function scan(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.isSymbolicLink())throw Error('Symlink in evidence tree');
  const path=join(dir,entry.name);
  if(entry.isDirectory())scan(path);
  else if(entry.name==='texas-normalized.json'){
   const other=join(dir,'dcfr-normalized.json');if(!existsSync(other))throw Error('Missing second normalized engine export');
   const paths=[path,other].map(p=>relative(repo,p));
   if(paths.some(p=>p.startsWith('..')||isAbsolute(p)))throw Error('Evidence must be inside repository');
   const normalized=paths.map(readJson),spotId=normalized[0].spotId;
   const resultPath=join(out,'replays',String(spotId)+'-'+sha256(paths.join('|')).slice(0,12)+'.json');
   const replay=spawnSync(process.execPath,['scripts/compare-solver-exports.mjs',...paths,resultPath],{encoding:'utf8'});
   if(![0,1].includes(replay.status)||!existsSync(resultPath))throw Error('Raw comparison replay failed: '+replay.stderr);
   const result=readJson(resultPath);
   write(relative(out,resultPath),readFileSync(resultPath));
   for(const [i,row] of normalized.entries()){
    copy(paths[i]);copy(row.scenarioPath);copy(row.executionPath);
    for(const k of ['input','raw','log'])copy(row.artifacts[k].path);
   }
   records.push({spotId,street:normalized[0].street,rawEvidenceReplayed:true,strategyAgreement:result.strategyAgreement,
    maxFrequencyDelta:result.maxFrequencyDelta,reasons:result.reasons,scope:result.scope,
    independentlyCertified:false,sourceExports:paths});
  }
 }
}
if(existsSync(evidenceRoot))scan(evidenceRoot);
const buildDir='reports/solver/certification/build-evidence';
if(existsSync(buildDir))for(const name of readdirSync(buildDir).sort())if(/\.(txt|log|patch)$|-LICENSE$/.test(name))copy(buildDir+'/'+name);
const provenance=get('--provenance',null);if(provenance)copy(provenance);
const summary={schemaVersion:1,spotCount:trainingSpots.length,byStreet,officialCertified:registry.certified,
 rawComparisons:records.length,uniqueComparedSpots:new Set(records.map(r=>r.spotId)).size,
 strategyAgreements:records.filter(r=>r.strategyAgreement).length,records,
 limitations:['External review cannot replace two independent solver results.',
  'Existing opponent ranges are heuristic and prior-street reach probabilities are absent.',
  'Recorded binary hashes are CI provenance; solver binaries are not embedded in this package.'],certificationEffect:'NONE'};
write('review-summary.json',JSON.stringify(summary,null,2)+'\n');
write('PROMPT_META_AI.md',`# Auditoria independente do POKERINNO ACADEMY\n\nRevise o motor, os 1.500 spots e as evidências anexadas. Distribuição obrigatória: 720 pré-flop, 450 flop, 225 turn e 105 river. Preserve os 780 pós-flop.\n\nComece por manifest.json e review-summary.json. Confira SHA-256 dos arquivos; identifique explicitamente os arquivos/lotes que você conseguiu ler. Os 30 arquivos spots/batch-*.json contêm 50 decisões cada. Não trate uma amostra como revisão de todas as decisões.\n\nExamine cartas e blockers, ranges por combo, histórico e pot/stacks, posição e ações legais, reconstrução dos ranges nas streets anteriores, árvore original versus CHECK/ALL-IN simplificado, normalização, convergência, independência dos motores, logs brutos e vínculo de cada resultado ao spot. Revise também os gates de certificação e testes contra adulteração.\n\nA existência de hash ou concordância de dois motores num jogo simplificado não certifica o cenário original. Ranges heurísticos permanecem não verificados. Não crie resultados, ranges, solves, EVs, exploitabilidade ou declarações de execução. Separe inspeção de código, inspeção de dados e execução efetivamente realizada.\n\nRetorne somente JSON no formato abaixo. Copie exatamente o campo bundleSha256 de manifest.json (não o hash dos bytes do próprio manifest), os IDs efetivamente revisados e arquivos/linhas/hash de cada achado. Use CHANGES_REQUIRED, INSUFFICIENT_EVIDENCE ou NO_FINDINGS_IN_REVIEWED_SCOPE. O parecer é complementar e não libera publicação. A identidade declarada do auditor não é autenticada pelo importador.\n\n\`\`\`json\n{"schemaVersion":1,"bundleSha256":"COPIAR_DE_MANIFEST_JSON","reviewer":"Meta AI","reviewedSpotIds":[737],"verdict":"INSUFFICIENT_EVIDENCE","findings":[{"severity":"HIGH","file":"dist/simulator-spots.js","fileSha256":"COPIAR_HASH_DO_ARQUIVO","line":33,"spotIds":[737],"description":"DESCREVER_ACHADO_COM_EVIDENCIA","recommendation":"DESCREVER_CORRECAO"}]}\n\`\`\`\n\nEnvie lotes adicionais em sequência se o serviço limitar anexos ou contexto. Consolide apenas os IDs realmente revisados. Não responda com certificação matemática: ela exige o gate do repositório e artefatos reproduzíveis.\n`);
write('LEIA_PRIMEIRO.md',`# POKERINNO ACADEMY — revisão Meta AI\n\nSituação medida: ${registry.certified}/1500 certificados. ${records.length} comparações brutas recuperadas; ${summary.strategyAgreements} concordâncias diagnósticas.\n\nAnexe este pacote à Meta AI e use PROMPT_META_AI.md. O pacote inclui o motor e os 1.500 spots em 30 lotes. Para limites de anexos, envie código e lotes em sequência. Peça um parecer com os IDs efetivamente revisados.\n\nValide os arquivos com Node 22+ no repositório: node scripts/verify-meta-audit-bundle.mjs --bundle DIRETORIO. Importe o JSON devolvido: node scripts/import-meta-audit-opinion.mjs --bundle DIRETORIO --opinion parecer.json --out reports/meta-audit/parecer-importado.json. O destino deve ser novo.\n\nOs pareceres não alteram o app, ranges, certificados nem o bloqueio de publicação. Nenhum parecer da Meta AI está incluído: falta a revisão externa real.\n`);
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const manifest={schemaVersion:1,repository:'SkyareCom/pokerinno.series.academy',branch:'feat/pokerinno-frontend',sourceCommit,
 sourceState:'CONTENT_HASHED_WORKTREE_SNAPSHOT',createdAt:new Date().toISOString(),spotCount:1500,byStreet,
 spotSourceSha256:sha256(JSON.stringify(trainingSpots)),certificationEffect:'NONE',files:files.sort((a,b)=>a.path.localeCompare(b.path))};
manifest.bundleSha256=manifestHash(manifest);
writeFileSync(join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
verifyBundle(out);
console.log(JSON.stringify({out,bundleSha256:manifest.bundleSha256,spots:1500,byStreet,rawComparisons:records.length,strategyAgreements:summary.strategyAgreements,officialCertified:registry.certified}));
