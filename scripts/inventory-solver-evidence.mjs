import {readdirSync,readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const root='reports/solver/certification/raw-artifacts';
const output='reports/solver/certification/diagnostic-inventory.json';
const entries=existsSync(root)?readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory()):[];
const read=p=>{try{return JSON.parse(readFileSync(p,'utf8'))}catch{return null}};
const records=entries.map(entry=>{
 const dir=join(root,entry.name);
 const audit=read(join(dir,'texas-run-audit.json'));
 const gates=read(join(dir,'twenty-evidence-tasks.json'));
 return {artifact:entry.name,spotId:gates?.spotId??null,
  evidenceChecksPassed:gates?.passed??null,evidenceChecksTotal:gates?.total??null,
  solverConverged:audit?.convergedToTarget===true,
  independentlyCertified:false,
  blockers:['Cross-engine strategy comparison absent','Verified range provenance absent']};
});
mkdirSync('reports/solver/certification',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,artifactCount:records.length,independentlyCertified:0,records},null,2)+'\n');
console.log(JSON.stringify({artifactCount:records.length,independentlyCertified:0}));
