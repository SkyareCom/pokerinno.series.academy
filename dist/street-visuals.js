import {t} from './i18n.js?v=streets-table-v1';
import {cardFigure} from './quiz-visuals.js?v=cards-no-arrows-20261008';

const heroCards=['A♠','K♥'];
const boardCards=['A♦','7♣','2♥','10♠','Q♦'];
const stages=[
 {id:'preflop',heading:'PRÉ-FLOP',count:0,newFrom:0},
 {id:'flop',heading:'FLOP',count:3,newFrom:0},
 {id:'turn',heading:'TURN',count:4,newFrom:3},
 {id:'river',heading:'RIVER',count:5,newFrom:4}
];
const visual=stage=>{
 const board=boardCards.slice(0,stage.count).map((card,i)=>i>=stage.newFrom?cardFigure(card).replace('class="playing-card ','class="playing-card street-card-new '):cardFigure(card)).join('');
 return `<figure class="street-visual" data-street="${stage.id}"><div class="street-scene" role="group" aria-label="${t('streets.tableLabel',{street:t('streets.'+stage.id),count:stage.count})}"><div class="street-felt" aria-hidden="true"></div><div class="street-board"><span class="street-label">${t('streets.boardCount',{count:stage.count})}</span><div class="street-board-cards" style="--board-count:${Math.max(1,stage.count)}">${board||`<span class="street-empty-board">${t('streets.emptyBoard')}</span>`}</div></div><div class="street-hero"><div class="street-hero-cards" role="group" aria-label="${t('visual.hero')}">${heroCards.map(cardFigure).join('')}</div><div class="street-hero-seat"><img src="assets/pokerinno-focused.webp" alt="" width="32" height="36"><strong>${t('streets.hero')}</strong></div></div></div></figure>`;
};
export function decorateStreetLesson(html){
 for(const stage of stages){
  const section=new RegExp('(<h3>'+stage.heading+'</h3><p>[\\s\\S]*?</p>)');
  html=html.replace(section,match=>match+visual(stage));
 }
 return html;
}
