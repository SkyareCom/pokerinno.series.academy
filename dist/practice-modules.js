import {academyVerde9} from './academy-verde9-content.js';
import {t} from './i18n.js?v=learn-titles-20261008';
import {sourceQuiz} from './source-quiz.js?v=cards-no-arrows-20261008';
const fund=academyVerde9.FUND||[],rules=fund.find(x=>x.id==='rules')?.sub||[];
const pick=ids=>fund.filter(x=>ids.includes(x.id));
export const practiceThemes=[
 {key:'rules',modules:[...pick(['rank','pos','blinds','streets','seq']),...rules]},
 {key:'staff',modules:pick(['staff','etq'])},
 {key:'formats',modules:[...pick(['cash','tour']),...(academyVerde9.MOD||[])]},
 {key:'terms',modules:pick(['term','prof'])},
 {key:'math',modules:(academyVerde9.PRAT||[]).filter(x=>x.id==='math')},
 {key:'decisions',modules:[...(academyVerde9.PRAT||[]).filter(x=>x.id==='quiz'),{id:'situations',t:{pt:t('practice.situations')},quiz:academyVerde9.SIMB||[]}]}
].map(theme=>({...theme,modules:theme.modules.filter(x=>x.quiz?.length)}));
export const practiceModules=practiceThemes.flatMap(theme=>theme.modules.map(module=>({...module,key:theme.key+'-'+module.id,theme:theme.key})));
export function practiceCatalog(){return `<div class="practice-catalog">${practiceThemes.map(theme=>`<section class="source-group"><h2 class="practice-theme-title">${t('practice.'+theme.key)}</h2><div class="list journey-chapters">${theme.modules.map((module,i)=>`<a class="learn-extra learn-extra-pokerinno" href="#practice-module/${theme.key}-${module.id}"><div class="learn-extra-host"><span class="pokerinno-sprite ${['curious','learning','focused','analyzing','evolving','thinking','confident','practicing','studying','motivated'][(i+practiceThemes.findIndex(x=>x.key===theme.key)*2)%10]}" role="img" aria-label="Pokerinno"></span></div><div class="learn-extra-copy"><h3>${module.t?.pt||module.title}</h3><p>${module.d?.pt||module.lead||module.description||`${module.quiz.length} ${t('practice.activities')}`}</p></div></a>`).join('')}</div></section>`).join('')}</div>`}
export function practiceModule(key){const module=practiceModules.find(x=>x.key===key);if(!module)return practiceCatalog();return `<a class="back" href="#practice">← ${t('practice.back')}</a><div class="page-heading"><div><span class="eyebrow">${t('practice.'+module.theme)}</span><h1>${module.t?.pt||module.title}</h1></div></div>${sourceQuiz(module.quiz,module.key,module.theme)}`}
