import {supplementalActivities} from './supplemental-activities.js?v=fb98065';
import {results} from './progress.js?v=733a7b1';
import {activityDifficulty} from './xp.js';
import {creativeActivities} from './creative-activities.js?v=3ffb838';
import {academyVerde9} from './academy-verde9-content.js';
import {t} from './i18n.js?v=learn-titles-20261008';
import {sourceQuiz} from './source-quiz.js?v=cards-no-arrows-20261008';
const fund=academyVerde9.FUND||[],rules=fund.find(x=>x.id==='rules')?.sub||[];
const pick=ids=>fund.filter(x=>ids.includes(x.id));
// Shared editorial titles: corresponding Learn and Practice cards use the same source title.
const learningTitle=module=>module.t?.pt||module.title||'';

export const practiceThemes=[
 {key:'rules',modules:[...pick(['rank','pos','blinds','streets','seq']),...rules]},
 {key:'staff',modules:pick(['staff','etq'])},
 {key:'formats',modules:[...pick(['cash','tour']),...(academyVerde9.MOD||[])]},
 {key:'terms',modules:pick(['term','prof'])},
 {key:'math',modules:(academyVerde9.PRAT||[]).filter(x=>x.id==='math')},
 {key:'decisions',modules:[...(academyVerde9.PRAT||[]).filter(x=>x.id==='quiz'),{id:'situations',t:{pt:t('practice.situations')},quiz:academyVerde9.SIMB||[]}]}
].map(theme=>({...theme,modules:theme.modules.filter(x=>x.quiz?.length)}));
export const practiceModules=practiceThemes.flatMap(theme=>theme.modules.map(module=>({...module,key:theme.key+'-'+module.id,theme:theme.key})));

const groups=[
 {id:'discover',title:()=>t('learn.discover'),description:'Atividades introdutórias para conhecer o poker.',themes:['rules']},
 {id:'rules',title:()=>t('learn.rules'),description:'Exercícios das regras e fundamentos.',themes:['rules']},
 {id:'betting',title:()=>t('learn.betting'),description:'Pratique apostas e decisões durante a mão.',themes:['rules','decisions']},
 {id:'floor',title:()=>t('learn.floor'),description:'Situações e procedimentos de jogo.',themes:['staff']},
 {id:'formats',title:()=>t('learn.formats'),description:'Atividades sobre formatos e modalidades.',themes:['formats']},
 {id:'ranges',title:()=>'NOÇÃO DE RANGES',description:'300 atividades introdutórias para mesas de 9 jogadores.',ranges:true},
 {id:'math',title:()=>t('learn.math'),description:'Exercícios de matemática aplicada ao poker.',themes:['math']},
 {id:'etiquette',title:()=>t('staff.etiquette.title'),description:'Pratique boas maneiras e comportamento na mesa.',themes:['staff']},
 {id:'house-rules',title:()=>t('learn.houseRules'),description:'Pratique regras e situações de jogo.',themes:['staff']},
 {id:'terms',title:()=>t('learn.terms'),description:'Atividades de vocabulário e conceitos.',themes:['terms']}
];
const groupModules=id=>{const byId={
 discover:['rank','pos'],rules:['rank','pos','blinds','streets','seq'],
 betting:['seq','quiz'],floor:['staff','emb','mis','irr','fichas','assentos'],formats:[],
 math:[],etiquette:['etq'], 'house-rules':['casa'],terms:[],
 decisions:[]
 };const ids=byId[id];return practiceModules.filter(m=>ids?.length?ids.includes(m.id):groups.find(g=>g.id===id)?.themes.includes(m.theme))};
// Assign each original question to only one Practice card. Never duplicate it across themes.
const assigned=new Map();
const assignedIds=new Set();
const normalizedQuestion=q=>JSON.stringify([q.question||q.prompt||q.q||q.text||q.title||'',q.options||q.items||[],q.answer||'']).normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
const uniqueGroupQuestions=id=>{
 const questions=[];
 for(const m of groupModules(id))for(let i=0;i<(m.quiz||[]).length;i++){
  const q=m.quiz[i],fingerprint=normalizedQuestion(q);
  const originalId=m.key+'-'+(q.id??i);
  if(assigned.has(fingerprint)||assignedIds.has(originalId))continue;
  assignedIds.add(originalId);
  assigned.set(fingerprint,id);
  questions.push({...q,id:originalId});
 }
 return questions;
};
// Audit each of the 300 historical simulator situations by its actual learning objective.
// Showdowns: rules of hand ranking (Hold'em) or formats (Omaha/PLO).
// Pot-odds decisions: mathematical application. No separate 'continuous decisions' topic.
const classifyScenario=q=>q.kind==='decisao'?'math':/omaha|plo|o8|hi.lo/i.test(String(q.game||''))?'formats':'rules';
const scenarioAllocation={rules:[],formats:[],math:[]};
for(const q of academyVerde9.SIMB||[]){const topic=classifyScenario(q);scenarioAllocation[topic].push({...q,id:'decisions-situations-'+q.id});}
const groupQuestionBank=new Map(groups.filter(g=>!g.ranges).map(g=>[g.id,uniqueGroupQuestions(g.id)]));
for(const [topic,questions] of Object.entries(scenarioAllocation)){const bank=groupQuestionBank.get(topic);for(const q of questions){const fingerprint=normalizedQuestion(q);if(assigned.has(fingerprint)||assignedIds.has(q.id))continue;assigned.set(fingerprint,topic);assignedIds.add(q.id);bank.push(q)}}
for(const [id,questions] of Object.entries({...creativeActivities,...Object.fromEntries(Object.entries(supplementalActivities).map(([id,items])=>[id,[...(creativeActivities[id]||[]),...items]]))})){const group=groupQuestionBank.get(id);if(!group)continue;for(const q of questions){const fingerprint=normalizedQuestion(q);if(assigned.has(fingerprint)||assignedIds.has(q.id))continue;assigned.set(fingerprint,id);assignedIds.add(q.id);group.push(q)}}
const mix=questions=>{
 const a=[...questions],out=[];
 const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}return items};
 const category=q=>{const id=String(q.id||'').replace(/^NEW-[^-]+-/,'').replace(/[0-9]+/g,'#');const prompt=String(q.prompt||q.question||q.q||q.text||'').normalize('NFKC').toLowerCase().replace(/\\d+/g,'#').replace(/\\s+/g,' ').trim();return (q.kind||q.type||'')+'|'+(id.split('-').slice(0,2).join('-')||prompt.slice(0,55))};
 shuffle(a);
 while(a.length){
  const recent=out.slice(-2).map(category);
  const choices=a.map((q,i)=>({i,penalty:recent.reduce((n,k,j)=>n+(category(q)===k?(j===recent.length-1?8:3):0),0)}));
  const min=Math.min(...choices.map(x=>x.penalty));
  const eligible=choices.filter(x=>x.penalty===min);
  const picked=eligible[Math.floor(Math.random()*eligible.length)].i;
  out.push(a.splice(picked,1)[0]);
 }
 return out;
};
const practiceCardStats=(g,rows)=>{const questions=groupQuestionBank.get(g.id)||[];const total=g.ranges?300:questions.length;const module='group-'+g.id;const ids=new Set(questions.map(q=>String(q.id)));const done=g.ranges?new Set(rows.filter(row=>row.module==='group-ranges'&&/^range-\d+$/.test(row.question)).map(row=>row.question)).size:new Set(rows.filter(row=>row.module===module&&ids.has(row.question)).map(row=>row.question)).size;const pct=total?Math.round(done*100/total):0;const maxXp=g.ranges?6000:questions.reduce((sum,q)=>sum+activityDifficulty(q,g.id).xp,0);return {done,total,pct,maxXp};};
export function practiceCatalog(){const rows=results();return `<div class="practice-catalog"><div class="list journey-chapters">${groups.map((g,i)=>{const stats=practiceCardStats(g,rows);return `<a class="learn-extra learn-extra-pokerinno" href="#practice-module/${g.id}"><div class="learn-extra-host"><span class="pokerinno-sprite ${['curious','learning','focused','analyzing','evolving','thinking','confident','practicing','studying','motivated'][i%10]}" role="img" aria-label="Pokerinno"></span></div><div class="learn-extra-copy"><h3>${g.title()}</h3><p class="practice-card-progress">${stats.done} / ${stats.total} REALIZADOS · ${stats.pct}%</p><p class="practice-card-xp">XP MÁXIMO: ${stats.maxXp.toLocaleString('pt-BR')}</p></div></a>`}).join('')}</div></div>`}
export function practiceModule(key){const group=groups.find(g=>g.id===key);if(group?.ranges){location.hash='practice-ranges';return ''}if(group){const questions=groupQuestionBank.get(key)||[];return `<a class="back" href="#practice">← ${t('practice.back')}</a><div class="page-heading"><div><span class="eyebrow">PRATICAR</span><h1>${group.title()}</h1></div></div>${questions.length?'<p class="practice-mix-note">Atividades relacionadas reunidas neste tema, sem subdivisões.</p>':''}${questions.length?sourceQuiz(mix(questions),'group-'+key,key):'<p class="practice-mix-note">Atividades deste tema em preparação.</p>'}`}
const module=practiceModules.find(x=>x.key===key);if(!module)return practiceCatalog();return `<a class="back" href="#practice">← ${t('practice.back')}</a><div class="page-heading"><div><span class="eyebrow">${t('practice.'+module.theme)}</span><h1>${learningTitle(module)}</h1></div></div>${sourceQuiz(module.quiz,module.key,module.theme)}`}
