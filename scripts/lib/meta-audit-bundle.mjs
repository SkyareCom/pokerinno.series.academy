import {readFileSync,realpathSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {createHash} from 'node:crypto';

export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export const readJson=path=>JSON.parse(readFileSync(path,'utf8'));
export function inside(root,path){
 if(typeof path!=='string'||!path||isAbsolute(path)||path.includes('\\')||path.split('/').some(p=>p==='..'||p==='.'||!p))throw Error('Unsafe bundle path');
 const target=resolve(root,path),rel=relative(realpathSync(root),realpathSync(target));
 if(rel.startsWith('..')||isAbsolute(rel))throw Error('Bundle path escapes root');
 return target;
}
export function manifestHash(manifest){
 const {bundleSha256,...content}=manifest;
 return sha256(JSON.stringify(content));
}
export function verifyBundle(root){
 const manifest=readJson(resolve(root,'manifest.json'));
 if(manifest.schemaVersion!==1||manifest.bundleSha256!==manifestHash(manifest)||manifest.certificationEffect!=='NONE')throw Error('Manifest hash integrity failure');
 if(!Array.isArray(manifest.files)||!manifest.files.length)throw Error('Empty file manifest');
 const seen=new Set(),spots=[];
 for(const entry of manifest.files){
  if(seen.has(entry.path))throw Error('Duplicate bundle path');seen.add(entry.path);
  const bytes=readFileSync(inside(root,entry.path));
  if(bytes.length!==entry.bytes||sha256(bytes)!==entry.sha256)throw Error('File hash integrity failure: '+entry.path);
  if(entry.path.startsWith('spots/'))spots.push(...JSON.parse(bytes.toString('utf8')));
 }
 const counts=Object.fromEntries(['pre','flop','turn','river'].map(st=>[st,spots.filter(s=>s.street===st).length]));
 if(sha256(JSON.stringify(spots))!==manifest.spotSourceSha256)throw Error('Source snapshot hash integrity failure');
 if(spots.length!==1500||new Set(spots.map(s=>s.id)).size!==1500||spots.some(s=>!Number.isInteger(s.id)||s.id<1||s.id>1500)||JSON.stringify(counts)!==JSON.stringify({pre:720,flop:450,turn:225,river:105})||manifest.spotCount!==1500||JSON.stringify(manifest.byStreet)!==JSON.stringify(counts))throw Error('Required spot coverage mismatch');
 return {manifest,spots};
}
