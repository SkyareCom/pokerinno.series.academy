import {creativeActivities} from './creative-activities.js?v=2282527';
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
 {id:'terms',title:()=>t('learn.terms'),description:'Atividades de vocabulário e conceitos.',themes:['terms']},
 {id:'decisions',title:()=>t('decisions.title'),description:'Misture situações e decisões para aumentar a dificuldade.',themes:['decisions']}
];
const groupModules=id=>{const byId={
 discover:['rank','pos'],rules:['rank','pos','blinds','streets','seq'],
 betting:['seq','quiz','situations'],floor:['staff'],formats:[],
 math:[],etiquette:['etq'], 'house-rules':['staff'],terms:[],
 decisions:['quiz','situations']
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
const groupQuestionBank=new Map(groups.filter(g=>!g.ranges).map(g=>[g.id,uniqueGroupQuestions(g.id)]));
for(const [id,questions] of Object.entries(creativeActivities)){const group=groupQuestionBank.get(id);if(!group)continue;for(const q of questions){const fingerprint=normalizedQuestion(q);if(assigned.has(fingerprint)||assignedIds.has(q.id))continue;assigned.set(fingerprint,id);assignedIds.add(q.id);group.push(q)}}
const mix=questions=>{const a=[...questions];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
export function practiceCatalog(){return `<div class="practice-catalog"><div class="list journey-chapters">${groups.map((g,i)=>`<a class="learn-extra learn-extra-pokerinno" href="#practice-module/${g.id}"><div class="learn-extra-host"><span class="pokerinno-sprite ${['curious','learning','focused','analyzing','evolving','thinking','confident','practicing','studying','motivated'][i%10]}" role="img" aria-label="Pokerinno"></span></div><div class="learn-extra-copy"><h3>${g.title()}</h3><p>${g.description}</p></div></a>`).join('')}</div></div>`}
export function practiceModule(key){const group=groups.find(g=>g.id===key);if(group?.ranges){location.hash='practice-ranges';return ''}if(group){const questions=groupQuestionBank.get(key)||[];return `<a class="back" href="#practice">← ${t('practice.back')}</a><div class="page-heading"><div><span class="eyebrow">PRATICAR</span><h1>${group.title()}</h1></div></div>${questions.length?'<p class="practice-mix-note">Atividades relacionadas reunidas neste tema, sem subdivisões.</p>':''}${questions.length?sourceQuiz(mix(questions),'group-'+key,key):'<p class="practice-mix-note">Atividades deste tema em preparação.</p>'}`}
const module=practiceModules.find(x=>x.key===key);if(!module)return practiceCatalog();return `<a class="back" href="#practice">← ${t('practice.back')}</a><div class="page-heading"><div><span class="eyebrow">${t('practice.'+module.theme)}</span><h1>${learningTitle(module)}</h1></div></div>${sourceQuiz(module.quiz,module.key,module.theme)}`}
