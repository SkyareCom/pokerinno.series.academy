import {t} from './i18n.js?v=procedures-direct-20261008';
import {academyVerde9} from './academy-verde9-content.js';
import {dealingSections} from './data.js?v=learn-five-20261008';
const originals=academyVerde9.FUND.find(x=>x.id==='rules').sub;
const sections=Object.fromEntries(dealingSections.map(s=>[s.title,s]));
const block=title=>{const s=sections[title];return `<div class="lc"><h3>${s.title}</h3>${s.items?`<ul>${s.items.map(item=>`<li>${item}</li>`).join('')}</ul>`:`<p>${s.text}</p>`}</div>`};
export const procedures=originals.filter(x=>['emb','mis','irr'].includes(x.id)).map(item=>{
 let html=item.html;
 if(item.id==='mis')html=html.replace(/(<h3>DEPOIS DA AÇÃO SUBSTANCIAL<\/h3>)([\s\S]*?)(<\/div>)/,(_,heading,body,end)=>heading+body+'<p>'+t('procedure.'+'quantity')+'</p>'+end);
 if(item.id==='irr'){
 html=html.replace(/<div class="lc"><h3>TURN OU RIVER ABERTO ANTES DA HORA<\/h3>[\s\S]*?<\/div>/,block('TURN PREMATURO')+block('RIVER PREMATURO'));
 html=html.replace(/(<h3>FLOP COM 4 CARTAS<\/h3>)([\s\S]*?)(<\/div>)/,(_,heading,body,end)=>heading+body+'<p>'+t('procedure.'+'flop')+'</p>'+end);
 html=html.replace(/(<h3>BARALHO VICIADO \/ FOULED DECK<\/h3>)([\s\S]*?)(<\/div>)/,(_,heading,body,end)=>heading+body+'<p>'+t('procedure.'+'deck')+'</p>'+end);
 html=html.replace(/<div class="lc note"><h3>REGRA DE OURO<\/h3>[\s\S]*?<\/div>/,block('COMO AGIR DIANTE DE UM ERRO')+'<p>'+t('procedure.'+'authority')+'</p>');
 }
 return {...item,html};
});
export function procedureCards(){return `<div class="section-top"><h2>${t('learn.procedures')}</h2></div><div class="list procedure-cards">${procedures.map((item,i)=>`<a class="chapter" href="#procedure/${item.id}"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${item.t.pt.toUpperCase()}</h3><p>${item.d.pt}</p></div></a>`).join('')}</div>`}
export function procedureDetail(id){const item=procedures.find(x=>x.id===id);if(!item)return procedureCards();return `<div class="page-heading"><div><span class="eyebrow">${t('learn.procedures')}</span><h1>${item.t.pt.toUpperCase()}</h1><p>${item.d.pt}</p></div></div><div class="source-body procedure-body">${item.html}</div>`}
