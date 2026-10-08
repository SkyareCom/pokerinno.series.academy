const key='academy.activity.results.v1';let memory=[];let blocked=false;
export function results(){if(blocked)return memory;try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(value))memory=value.filter(x=>x&&typeof x.module==='string'&&typeof x.question==='string'&&typeof x.correct==='boolean'&&Number.isFinite(x.at));}catch{}return memory}
export function record(result){memory=[...results(),{...result,at:Date.now()}];try{localStorage.setItem(key,JSON.stringify(memory));return true}catch{blocked=true;return false}}
export const percent=(n,total)=>total?Math.round(n/total*100):0;
