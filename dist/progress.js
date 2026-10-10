const key='academy.activity.results.v1',preferenceKey='academy.training.save';let pending=[],savedMemory=[];
const valid=x=>x&&typeof x.module==='string'&&typeof x.question==='string'&&typeof x.correct==='boolean'&&Number.isFinite(x.at)&&['rules','staff','formats','terms','math','decisions','discover','betting','floor','etiquette','house-rules','ranges'].includes(x.theme);
export function savedResults(){try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(value))savedMemory=value.filter(valid);}catch{}return savedMemory}
export function results(){return [...savedResults(),...pending]}
export function autoSave(){try{return localStorage.getItem(preferenceKey)!=='off'}catch{return true}}
export function pendingCount(){return pending.length}
export function saveActivities(){if(!pending.length)return true;const combined=[...savedResults(),...pending];try{localStorage.setItem(key,JSON.stringify(combined));savedMemory=combined;pending=[];return true}catch{return false}}
export function setAutoSave(enabled){try{localStorage.setItem(preferenceKey,enabled?'on':'off')}catch{return false}if(enabled)return saveActivities();return true}
export function record(result){pending.push({...result,at:Date.now()});return autoSave()?saveActivities():false}
export const percent=(n,total)=>total?Math.round(n/total*100):0;
