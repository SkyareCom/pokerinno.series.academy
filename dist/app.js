import {saveMessagePreference,trackMessageVisit} from './pokerinno-messages.js?v=pokerinno-balloons-v1';
import {showPokerinno,messageSettings,closePokerinno} from './pokerinno-balloons.js?v=pokerinno-balloons-v1';
import {procedureCards,procedureDetail} from './procedure-content.js?v=cards-no-arrows-20261008';
import {standardizeBack} from './back-navigation.js?v=cards-no-arrows-20261008';
import {autoSave,setAutoSave,saveActivities,results,pendingCount} from './progress.js?v=cards-no-arrows-20261008';
import {statsDashboard} from './stats.js?v=cards-no-arrows-20261008';
import {practiceCatalog,practiceModule} from './practice-modules.js?v=fix-cache-20261008-b';
import {sourceQuiz} from './source-quiz.js?v=cards-no-arrows-20261008';
import {journeyIds,extraCard,staffRoles,decisionCycle} from './learn-ui.js?v=staff-removed-a5275e59';
import {t} from './i18n.js?v=pokerinno-balloons-v1';
import {enablePageSwipe} from './swipe.js';
import {loginPage} from './login.js?v=cards-no-arrows-20261008';
import {loadAcademy,chapters,discoverLessons,discoverSections,rulesSections,rulesGroups,rulesBasicSections,bettingSections,dealingSections,floorSections,pokerTermsGroups,pokerExtraTermsGroups,mathTermsGroups} from './data.js?v=learn-five-20261008';import {academyVerde9} from './academy-verde9-content.js?v=remove-floor-3e63f900';import {legacyAcademy} from './legacy-academy-data.js';import {legacyProfile} from './legacy-profile-data.js';import {resolveRoute} from './navigation.js?v=cards-no-arrows-20261008';import {readPreferences,savePreferences} from './preferences.js';
let storage;try{storage=localStorage}catch{storage={getItem:()=>null,setItem:()=>{throw Error()}}}let preferences=readPreferences(storage);const app=document.querySelector('#app'),dialog=document.querySelector('#dialog');let state=await loadAcademy(window.StackUpAcademyAdapter);let previousFocus;
const nav=[['home','⌂','HOME'],['journey','▤','APRENDER'],['practice','♠','PRATICAR'],['evolution','<svg viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v19h19"/><path d="M7 17v-5m5 5V8m5 9V4"/><path d="m5 9 5-4 5 1 6-4"/></svg>','STATS'],['profile','♙','PERFIL']];
const chapterTitle=c=>journeyIds.includes(c.id)?t('learn.'+c.id):c.title;
const chapterDescription=c=>c.id==='floor'?t('learn.floorDesc'):c.description;
const heading=(tag,title,description)=>`<div class="page-heading"><div><span class="eyebrow">${tag}</span><h1>${title}</h1><p>${description}</p></div><span class="chapter-tag"></span></div>`;
const empty=(symbol,title,description)=>`<section class="empty"><div class="empty-symbol">${symbol}</div><h2>${title}</h2><p>${description}</p><a href="#journey" class="primary">EXPLORAR A JORNADA </a></section>`;
const nextApps=`<section class="next-apps"><div class="next-grid">${[['HEROES','Descubra seu Poker DNA.'],['GRINDER EVO','Decisões em Texas Hold’em.'],['REVOLUTION','Simulações de jogo.'],['D ACTION','Leaks no Omaha.'],['WRAPS','Decisões no Omaha.'],['CHIPS UP','Gestão de bankroll.']].map(([name,desc])=>`<button class="next-app" data-series="${name}"><strong>${name}</strong><span>${desc}</span></button>`).join('')}</div></section>`;
const verdeFund=Object.fromEntries((academyVerde9.FUND||[]).map(x=>[x.id,x]));
const verdeMods=academyVerde9.MOD||[];
const verdePrat=Object.fromEntries((academyVerde9.PRAT||[]).map(x=>[x.id,x]));
const verdeRuleSubs=Object.fromEntries(((verdeFund.rules&&verdeFund.rules.sub)||[]).map(x=>[x.id,x]));
const sourceLesson=(item,tag='APROFUNDAMENTO')=>item?`<details class="source-lesson"><summary>${tag?`<span>${tag}</span>`:''}<strong>${item.t?.pt||item.title||'CONTEÚDO'}</strong><small>${item.d?.pt||item.lead||''}</small></summary><div class="source-body">${item.html||`<p>${item.lead||item.d?.pt||''}</p>`}</div></details>`:'';
/* Betting chapter: merge complete reference lessons into the main reading flow, without expandable cards. */
/* Progressive betting lessons: structured cards with full original teaching material. */
// One example presentation across every Academy chapter and practice view.
const standardizeExamples=root=>{
 for(const example of root.querySelectorAll('.ex,.betting-inline-example')){
  if(example.dataset.exampleStandardized==='true')continue;
  const walker=document.createTreeWalker(example,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
   if(!node.textContent.trim())continue;
   const original=node.textContent;
   const cleaned=original.replace(/^\s*(?:EXEMPLOS?|EX\.)\s*[:：–—-]?\s*/i,'');
   if(cleaned!==original){node.textContent=cleaned;const parent=node.parentElement;if(parent&&['STRONG','B','SPAN'].includes(parent.tagName)&&!parent.textContent.trim())parent.remove()}
   break;
  }
  for(const child of [...example.children]){
   if(child.classList.contains('betting-example-label'))child.remove();
   else if(['STRONG','B'].includes(child.tagName)&&/^EXEMPLOS?\\s*:?$/i.test(child.textContent.trim()))child.remove();
  }
  const label=document.createElement('span');label.className='academy-example-label';label.textContent='Exemplo: ';const first=example.firstElementChild;if(first&&first.tagName==='P')first.prepend(label);else example.prepend(label);
  example.classList.add('academy-example');example.dataset.exampleStandardized='true';
 }
};
const bettingIntegratedLessons=()=>{
 const parse=item=>{const root=document.createElement('div');root.innerHTML=item?.html||'';return [...root.querySelectorAll('.lc')].filter(el=>el.querySelector(':scope > h3')).map(el=>({title:el.querySelector(':scope > h3').textContent.trim(),nodes:[...el.children].filter(n=>n.tagName!=='H3')}))};
 const seq=parse(verdeFund.seq),chips=parse(verdeRuleSubs.fichas),seats=parse(verdeRuleSubs.assentos);
 const pick=(arr,...names)=>names.map(name=>arr.find(e=>e.title===name)).filter(Boolean);
 const sections=[
 ['01','COMO FUNCIONA UMA RODADA',pick(seq,'COMO FUNCIONA UMA RODADA DE APOSTAS?','QUEM AGE PRIMEIRO?','QUANDO A RODADA TERMINA?')],
 ['02','AÇÕES DO JOGADOR',pick(seq,'BET × RAISE','CHECK','CALL','FOLD','ALL-IN')],
 ['03','AUMENTOS E REGRAS DE APOSTAS',pick(seq,'RAISE E AUMENTO MÍNIMO','3-BET','4-BET','SQUEEZE','DONK BET','ALL-IN MENOR QUE O RAISE MÍNIMO')],
 ['04','STACK, FICHAS E BUY-IN',chips],
 ['05','BUTTON E ASSENTOS',seats],
 ['06','REVISÃO DA LÓGICA',pick(seq,'RESUMO DA LÓGICA')]
 ];
 const seen=new Set();
 const card=(title,html)=>`<article class="betting-info-card"><h4>${title}</h4><div class="betting-info-content source-body">${html}</div></article>`;
 const split=entry=>{
  const parts=[];const actionCards=[];
  for(const node of entry.nodes){
   if(node.classList.contains('cg')){
    for(const child of [...node.children]){
     const term=child.querySelector('strong,b')?.textContent.trim()||entry.title;
     const description=[...child.childNodes].filter(x=>!(x.nodeType===1&&['STRONG','B'].includes(x.tagName))).map(x=>x.nodeType===3?x.textContent:x.outerHTML).join('').trim();
     actionCards.push(card(term,'<p>'+description+'</p>'));
    }
   }else if(node.classList.contains('ex')){
    const example=node.cloneNode(true);
    const walker=document.createTreeWalker(example,NodeFilter.SHOW_TEXT);
    let textNode;
    while((textNode=walker.nextNode())){
     if(!textNode.textContent.trim())continue;
     textNode.textContent=textNode.textContent.replace(/^\s*(?:EXEMPLO|EXEMPLOS|EX\.)\s*[:：–—-]?\s*/i,'');
     break;
    }
    for(const el of [...example.querySelectorAll('strong,b')])if(!el.textContent.trim())el.remove();
    parts.push('<div class="betting-inline-example">'+example.innerHTML+'</div>');
   }else{
    parts.push(node.outerHTML);
   }
  }
  return [...(parts.length?[card(entry.title,parts.join(''))]:[]),...actionCards];
 };
 return '<div class="betting-learning-path">'+sections.map(([number,title,entries])=>{
  const unique=entries.filter(e=>{const key=e.title.toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
  const procedure=(name)=>bettingSections.find(s=>s.title===name);
  const cards=unique.flatMap(entry=>{
   const base=split(entry);
   if(entry.title==='ALL-IN'){
    return [card('ALL-IN','<p>All-in significa colocar todas as fichas restantes do seu stack na mão. Pode ser uma aposta (bet), um pagamento (call) ou um aumento (raise), conforme a ação anterior.</p><p>Depois de entrar em all-in, o jogador continua disputando os potes aos quais tem direito, mas não pode realizar novas ações naquela mão. Ele só concorre aos valores que conseguiu cobrir com suas fichas. Se outros jogadores continuarem apostando entre si, o dealer separa o pote principal dos potes laterais, que são disputados apenas por quem contribuiu para cada um.</p><div class="betting-inline-example"><p>Três jogadores colocam 100, 200 e 200 fichas. O pote principal reúne 300 fichas e pode ser disputado pelos três. As outras 200 fichas formam um pote lateral, disputado apenas pelos dois jogadores que colocaram 200.</p></div>')];
   }
   return base;
  }).join('')+(number==='03'?['STRING BET E STRING RAISE','APOSTA FORA DA VEZ'].map(name=>procedure(name)).filter(Boolean).map(s=>card(s.title,'<p>'+s.text+'</p>')).join(''):'')+(number==='04'?(()=>{const chip=procedure('UMA FICHA GRANDE');return chip?card(chip.title,'<p>Em muitas regras de poker ao vivo, colocar uma única ficha de valor superior à aposta, sem anunciar raise, é interpretado como call. Para aumentar, anuncie claramente o raise e o valor antes de colocar a ficha.</p><div class="betting-inline-example"><p>Exemplo: diante de uma aposta de 400, colocar silenciosamente uma ficha de 1.000 pode significar apenas call de 400, com devolução de 600 em troco.</p></div>'):''})():'');
  return cards?`<section class="betting-learning-module"><div class="betting-info-grid">${cards}</div></section>`:'';
 }).join('')+'</div>';
};
const staffDirectLessons=items=>{
 const cards=items.filter(Boolean).flatMap(item=>{
  const root=document.createElement('div');root.innerHTML=item.html||'';
  return [...root.querySelectorAll('.lc')].map(lesson=>{
   const heading=lesson.querySelector(':scope > h3');
   const title=heading?.textContent.trim()||'';
   const body=[...lesson.children].filter(el=>el!==heading).map(el=>el.outerHTML).join('');
   if(!body.trim()||title.toUpperCase().replace(/[?!]/g,'').trim()==='QUANDO CHAMAR O FLOOR')return '';
   return '<article class="betting-info-card staff-topic-card">'+(title&&title.toUpperCase()!=='FUNÇÕES DO STAFF'?'<h4>'+title+'</h4>':'')+'<div class="betting-info-content source-body">'+body+'</div></article>';
  }).filter(Boolean);
 });
 return '<div class="betting-learning-path staff-direct-lessons"><section class="betting-learning-module"><div class="betting-info-grid">'+cards.join('')+'</div></section></div>';
};
const sourceGroup=(title,items,tag)=>`<section class="source-group"><div class="section-top"><h2>${title}</h2><span>BASE ACADEMY</span></div>${items.filter(Boolean).map(x=>sourceLesson(x,tag)).join('')}</section>`;
const quote=`<div class="quote">“Poker é um jogo que demora minutos para aprender. Mas leva uma vida para dominar.”<small>— MIKE SEXTON</small></div>`;
const migratedList=(section,prefix,tag)=>heading(tag,section.title,section.description)+`<div class="list">${section.items.map((item,i)=>`<a class="chapter" href="#${prefix}/${i}"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${String(item[0]).toUpperCase()}</h3><p>${item[1]}</p></div></a>`).join('')}</div>`;
const migratedDetail=(section,index,back,tag)=>{const item=section.items[index];if(!item)return empty('▤','Conteúdo não encontrado.','Volte para a etapa anterior e escolha outro conteúdo.');return `<a href="#${back}" class="back">← VOLTAR</a>`+heading(tag,String(item[0]).toUpperCase(),item[1])+`<section class="empty"><div class="empty-symbol">▤</div><h2>${String(item[0]).toUpperCase()}</h2><p>${item[1]}</p></section>`};
const secondaryContent=blocks=>`<div class="list secondary-content">${blocks.map(([title,body],i)=>`<section class="chapter lesson-block"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${body}</p></div></section>`).join('')}</div>`;
const pokerinnoMood=mood=>`<span class="pokerinno-sprite ${mood||'tips'}" role="img" aria-label="Pokerinno"></span>`;
const pokerinnoPanel=(mood,label,title,text)=>`<section class="pokerinno-context"><div class="pokerinno-context-art">${pokerinnoMood(mood)}</div><div><span>${label}</span><h3>${title}</h3><p>${text}</p></div></section>`;
const discoverSection=section=>{
  const host=section.host?`<div class="pokerinno-host">${pokerinnoMood(section.mood)}<div><span>POKERINNO</span><p>${section.host}</p></div></div>`:'';
  if(section.type==='host')return `<section class="discover-hero-card"><div class="discover-copy"><span class="eyebrow">${section.eyebrow}</span><h2>${section.title}</h2><p>${section.text}</p></div>${host}</section>`;
  if(section.type==='steps')return `<section class="discover-section"><h3>${section.title}</h3><div class="discover-steps">${section.items.map((item,i)=>`<div class="discover-step"><span>${String(i+1).padStart(2,'0')}</span><p>${item}</p></div>`).join('')}</div></section>`;
  if(section.type==='compare')return `<section class="discover-section"><h3>${section.title}</h3><div class="discover-compare"><article><h4>${section.leftTitle}</h4><p>${section.leftText}</p></article><article><h4>${section.rightTitle}</h4><p>${section.rightText}</p></article></div>${host}</section>`;
  if(section.type==='timeline')return `<section class="discover-section"><h3>${section.title}</h3><div class="discover-timeline">${section.items.map(([t,b])=>`<div><strong>${t}</strong><p>${b}</p></div>`).join('')}</div></section>`;
  if(section.type==='summary')return `<section class="discover-section discover-summary"><h3>${section.title}</h3><ul>${section.items.map(item=>`<li>${item}</li>`).join('')}</ul>${host}</section>`;
  return `<section class="discover-section"><h3>${section.title}</h3><p>${section.text}</p>${host}</section>`;
};
let messageVisitStarted=false,messageReturn=false,messageAutoShown=false;
function openMessages(){showPokerinno({storage,activities:results(),pending:pendingCount(),absent:messageReturn})}
function openDialog(title,body){previousFocus=document.activeElement;document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-body').textContent=body;dialog.showModal()}
dialog.querySelector('.close').onclick=()=>dialog.close();dialog.querySelector('#dialog-action').onclick=()=>dialog.close();dialog.addEventListener('close',()=>previousFocus?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function home(){return heading('ACADEMY · A PRIMEIRA DESCOBERTA','Aprenda. Pratique. Jogue.','Entenda o jogo, pratique o básico e chegue à mesa com segurança.')+`<section class="hero"><div class="pokerinno-logo" role="img" aria-label="POKERINNO ACADEMY"><svg viewBox="0 0 32 38" aria-hidden="true"><path d="M16 1C12 8 1 13 1 23c0 7 8 10 13 5l-3 9h10l-3-9c5 5 13 2 13-5C31 13 20 8 16 1Z"/></svg><div><strong>POKERINNO</strong><span>ACADEMY</span></div></div><img class="hero-image" src="assets/pokerino-hero.webp" alt="Pokerinno recebe você em uma academia de poker iluminada em dourado"><div class="hero-copy"><span class="eyebrow">SUA JORNADA · APRENDER → PRATICAR → JOGAR</span><h2>APRENDER.<br>PRATICAR.<br><em>JOGAR.</em></h2><p>“Poker é um jogo que demora minutos para aprender. Mas leva uma vida para dominar.”</p><small class="quote-author">— MIKE SEXTON</small><a href="#journey" class="primary">COMEÇAR A APRENDER </a></div><div class="hero-note">COM POKERINNO, CADA PASSO CONTA.</div></section>${pokerinnoPanel('curious',t('home.hostLabel'),t('home.hostTitle'),t('home.hostText'))}<div class="section-top"><h2>ESCOLHA SUA AVENTURA</h2><span></span></div><div class="grid">${[['base','▤','SUA BASE','Fundamentos do jogo.'],['modalities','✧','MODALIDADES','Principais modalidades.'],['practice','♠','PRÁTICA','Decisões e treino.'],['evolution','▥','SUA EVOLUÇÃO','Progresso e evolução.']].map(([route,symbol,title,desc])=>`<a class="feature" href="#${route}"><span class="badge">${symbol}</span><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>`}
function render(){if(!location.hash||location.hash==='#login'){closePokerinno();loginPage(app,'ACADEMY');return}document.body.classList.remove('login-screen');if(!messageVisitStarted){messageReturn=trackMessageVisit(storage);messageVisitStarted=true}else trackMessageVisit(storage);document.querySelector('header [data-help]')?.setAttribute('aria-label',t('messages.title'));const route=resolveRoute(location.hash),active=(route.startsWith('chapter/')||route.startsWith('procedure/'))?'journey':((route.startsWith('practice-'))?'practice':(route.startsWith('profile/')?'profile':route));for(const id of ['navigation','mobile-navigation'])document.getElementById(id).innerHTML=nav.map(([key,symbol,title])=>`<a class="${id==='navigation'?'nav-link ':''}${active===key?'active':''}" ${active===key?'aria-current="page"':''} href="#${key}"><span class="nav-symbol" aria-hidden="true">${symbol}</span>${title}</a>`).join('');document.documentElement.classList.toggle('reduced-motion',preferences.reducedMotion);
if(state.status==='error'){app.innerHTML=heading('SUA JORNADA','Vamos tentar novamente?','Sua navegação continua disponível.')+`<section class="empty"><h2>Não conseguimos carregar os conteúdos</h2><p>${state.error}</p><button class="primary" data-retry>TENTAR NOVAMENTE</button></section>`;return}
if(route==='home')app.innerHTML=home();
else if(route==='journey')app.innerHTML=heading('PRIMEIRA AVENTURA','APRENDER','Aprenda o essencial para acompanhar o jogo e participar da mesa.')+`<div class="list journey-chapters">${journeyIds.map((id,i)=>{const c=chapters.find(c=>c.id===id);return `<a class="learn-extra learn-extra-pokerinno" href="#chapter/${id}"><div class="learn-extra-host">${pokerinnoMood(['curious','learning','focused','analyzing','evolving'][i%5])}</div><div class="learn-extra-copy"><h3>${t('learn.'+id)}</h3><p>${id==='floor'?t('learn.floorDesc'):c.description}</p></div></a>`}).join('')}</div>`+extraCard('math','thinking','learn.math','learn.mathDesc',pokerinnoMood)+extraCard('terms','confident','learn.terms','terms.quickDescription',pokerinnoMood)+decisionCycle(pokerinnoMood);
else if(route==='chapter/rules'){const c=chapters.find(c=>c.id==='rules');const concepts=[verdeFund.rank,verdeFund.pos,verdeFund.blinds,verdeFund.streets].filter(Boolean);app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO ${String(c.order).padStart(2,'0')}`,chapterTitle(c),'Aprenda os fundamentos diretamente pelos conteúdos completos do Academy.')+discoverSection({type:'host',mood:'tips',eyebrow:'POKERINNO EXPLICA',title:'ANTES DE AVANÇAR',text:'Estes conceitos formam a base para entender qualquer mão de poker. Leia na ordem e observe como cada tema prepara o próximo.',host:'Primeiro entenda a estrutura. Depois, as decisões começam a fazer sentido.'})+`<div class="source-group primary-source-group">${concepts.map(item=>sourceLesson(item,'')).join('')}${procedureCards()}</div>`}
else if(route==='chapter/terms'){app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading('EXTRA · GLOSSÁRIO','TERMINOLOGIA DO POKER','Termos, gírias, abreviações e apelidos usados no jogo.')+discoverSection({type:'host',mood:'confident',eyebrow:'POKERINNO · SEU ANFITRIÃO',title:'FALAR POKER É ENTENDER A MESA',text:'Você vai encontrar palavras em inglês, abreviações, gírias e apelidos o tempo todo. Aqui eu traduzo esse vocabulário para o que realmente acontece na mão — quando o termo aparece, por que importa e como ele afeta sua decisão.',host:'Não decore palavras. Entenda situações.'})+`<div class="discover-page glossary-page">${[...pokerTermsGroups,...pokerExtraTermsGroups].map(group=>`<section class="discover-section glossary-group"><h3>${group.title}</h3><div class="glossary-list">${group.terms.map(([term,meaning])=>`<div class="glossary-term"><strong>${term}</strong><p>${meaning}</p></div>`).join('')}</div></section>`).join('')}</div>`+sourceGroup('BASE COMPLETA DE TERMINOLOGIA',[verdeFund.term,verdeFund.prof])}
else if(route==='chapter/betting'){const c=chapters.find(c=>c.id==='betting');app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO ${String(c.order).padStart(2,'0')}`,chapterTitle(c),chapterDescription(c))+`<div class="discover-page">${bettingSections.filter(s=>s.type==='host').map(discoverSection).join('')}</div>`+bettingIntegratedLessons()+`<div class="betting-review-pokerinno">${pokerinnoPanel('tips','POKERINNO REFORÇA','ANTES DE COLOCAR AS FICHAS','Confira o valor da aposta atual, identifique se sua ação é bet, call ou raise, respeite o aumento mínimo, anuncie o valor quando necessário e espere sua vez de agir.')}</div>`}
else if(route==='chapter/math'){const c=chapters.find(c=>c.id==='math');app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(t('learn.extra'),t('learn.math'),c.description)+`<section class="editorial-note"><strong>ENTENDA ANTES DE CALCULAR.</strong><p>Cada conceito matemático será ligado à decisão que ele ajuda a tomar, às alternativas disponíveis e ao impacto de errar essa leitura.</p></section><div class="discover-page glossary-page">${mathTermsGroups.map(group=>`<section class="discover-section glossary-group"><h3>${group.title}</h3><div class="glossary-list">${group.terms.map(([term,meaning])=>`<div class="glossary-term"><strong>${term}</strong><p>${meaning}</p></div>`).join('')}</div></section>`).join('')}</div>`+sourceGroup('MATEMÁTICA COMPLETA DO ACADEMY',[verdePrat.math])}
else if(route==='chapter/dealing')app.innerHTML=procedureCards();
else if(route.startsWith('procedure/'))app.innerHTML=procedureDetail(route.split('/')[1]);
else if(route==='chapter/floor'){const c=chapters.find(c=>c.id==='floor');app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO ${String(c.order).padStart(2,'0')}`,chapterTitle(c),chapterDescription(c))+`<div class="discover-page">${floorSections.filter(s=>s.type==='host').map((section,i)=>discoverSection(i===0?{...section,mood:'thinking'}:section)).join('')}</div>`+staffDirectLessons([verdeFund.staff])+`<div class="staff-extra-lessons">${[verdeFund.etq,verdeRuleSubs.casa].filter(Boolean).map((item,i)=>i===0?`<div class="staff-etiquette-feature"><div class="staff-etiquette-portrait">${pokerinnoMood('tips')}</div><div class="staff-etiquette-lesson">${sourceLesson(item,'')}</div></div>`:sourceLesson(item,'')).join('')}</div>`+`<div class="discover-page">${floorSections.filter(s=>s.type!=='host').map(discoverSection).join('')}</div>`}
else if(route==='chapter/discover'){const c=chapters.find(c=>c.id==='discover');app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO ${String(c.order).padStart(2,'0')}`,chapterTitle(c),'Entenda o jogo antes de entrar nas regras.')+`<div class="discover-page">${discoverSections.map((section,i)=>discoverSection(i===0?{...section,mood:'curious'}:section)).join('')}</div>`}
else if(route==='chapter/decisions')app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+decisionCycle(pokerinnoMood);
else if(route==='chapter/practice'){const c=chapters.find(c=>c.id==='practice');app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO ${String(c.order).padStart(2,'0')}`,chapterTitle(c),chapterDescription(c))+secondaryContent([
['RECONHEÇA A SITUAÇÃO','Identifique rapidamente cartas, posição, ação e objetivo da mão.'],
['TOME UMA DECISÃO','Escolha a ação que faz mais sentido com as informações disponíveis.'],
['REVISE O RACIOCÍNIO','Compare sua escolha com os conceitos aprendidos e entenda o motivo da decisão.'],
['REPITA','Treinar situações semelhantes ajuda a transformar conhecimento em hábito.']
])+`<div class="section-top"><h2>PRATICAR AGORA</h2><span>TREINOS</span></div><a class="primary" href="#practice">IR PARA PRATICAR </a>`}
else if(route==='chapter/formats'){app.innerHTML=pokerinnoPanel('studying','POKERINNO ESTUDA COM VOCÊ','CADA MODALIDADE MUDA A LÓGICA','Compare regras, quantidade de cartas e objetivos antes de levar conceitos de uma modalidade para outra.')+sourceGroup('CASH GAME E TORNEIOS',[verdeFund.cash,verdeFund.tour],'')+sourceGroup('MODALIDADES EM PROFUNDIDADE',verdeMods,'')}
else if(route.startsWith('chapter/')){const c=chapters.find(c=>c.id===route.split('/')[1]);app.innerHTML=`<a href="#journey" class="back back-journey">← VOLTAR À JORNADA</a>`+heading(`CAPÍTULO 0${c.order}`,chapterTitle(c),chapterDescription(c))+empty('▤','Conteúdo em preparação.','Este capítulo será desenvolvido dentro da mesma estrutura de até três camadas.')}
else if(route==='practice'||route==='practice-bank')app.innerHTML=heading(t('practice.label'),t('practice.title'),t('practice.description'))+practiceCatalog();
else if(route.startsWith('practice-module/'))app.innerHTML=practiceModule(route.split('/')[1]);
else if(route.startsWith('practice-tool/'))app.innerHTML=migratedDetail(legacyAcademy.practice,Number(route.split('/')[1]),'practice','PRATICAR');
else if(route==='evolution')app.innerHTML=statsDashboard();
else if(route==='profile')app.innerHTML=heading('DO SEU JEITO','Seu espaço no Academy.','Pequenos ajustes para acompanhar a sua jornada.')+pokerinnoPanel('confident','POKERINNO COM VOCÊ','SEU ESPAÇO DE EVOLUÇÃO','Acompanhe preferências, histórico e próximos caminhos sem perder o fio da sua jornada.')+`<section class="empty"><div class="empty-symbol">♙</div><h2>Olá, explorador.</h2><p>Você está conhecendo o Academy. Conecte sua conta quando o acesso estiver disponível.</p><button class="primary" data-login>ACESSAR MINHA CONTA</button></section><div class="section-top"><h2>EVOLUA COM POKERINNO</h2><span>PRÓXIMOS CAMINHOS</span></div>`+nextApps+messageSettings(storage)+`<div class="setting"><div><h3>Sons da jornada</h3><p>Preferência preparada para as experiências com áudio.</p></div><input type="checkbox" id="sound" aria-label="Sons da jornada" ${preferences.sound?'checked':''}></div><div class="setting"><div><h3>Reduzir movimentos</h3><p>Uma navegação mais tranquila, com menos animações.</p></div><input type="checkbox" id="reducedMotion" aria-label="Reduzir movimentos" ${preferences.reducedMotion?'checked':''}></div><div class="setting"><div><h3>Privacidade e conta</h3><p>Conta e sincronização disponíveis após a integração.</p></div><button class="quiet" data-login>CONSULTAR</button></div><div class="section-top"><h2>CONFIGURAÇÕES DO ACADEMY</h2><span>PERFIL</span></div><div class="list">${legacyProfile.items.map(([key,title,desc],i)=>`<a class="chapter" href="#profile/${key}"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${desc}</p></div></a>`).join('')}</div>`;
else if(route==='profile/access')app.innerHTML=`<a href="#profile" class="back">← VOLTAR</a>`+heading('PERFIL','DADOS DE ACESSO','Forma de acesso e dados da sessão atual.')+`<div class="setting"><div><h3>FORMA DE ACESSO</h3><p>Integração será conectada ao serviço de autenticação do app.</p></div></div><div class="setting"><div><h3>SESSÃO</h3><p>Acesso exploratório ativo enquanto a autenticação real não estiver conectada.</p></div></div>`;
else if(route==='profile/language')app.innerHTML=`<a href="#profile" class="back">← VOLTAR</a>`+heading('PERFIL','IDIOMA','Escolha o idioma do Academy.')+`<div class="entry-languages"><button data-profile-lang="pt-BR">PT-BR</button><button data-profile-lang="en-US">EN-US</button><button data-profile-lang="es-ES">ES-ES</button></div>`;
else if(route==='profile/history')app.innerHTML=heading(t('training.profile'),t('training.autoSave'),t('training.autoSaveDesc'))+`<div class="setting"><h3>${t('training.autoSave')}</h3><input type="checkbox" id="autoSaveActivities" aria-label="${t('training.autoSave')}" ${autoSave()?'checked':''}></div><div class="manual-save-profile">${!autoSave()?`<button class="save-activities" data-save-activities>${t('training.saveNow')}</button>`:''}</div>`;
else if(route==='profile/plans')app.innerHTML=`<a href="#profile" class="back">← VOLTAR</a>`+heading('PERFIL','PLANOS','Estrutura de planos migrada do Academy anterior.')+`<div class="list">${legacyProfile.plans.map((p,i)=>`<div class="chapter"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${p.name}</h3><p>${p.price} ${p.period}</p></div></div>`).join('')}</div>`;
else if(route==='profile/coach')app.innerHTML=`<a href="#profile" class="back">← VOLTAR</a>`+heading('PERFIL','ACADEMY COACH','Configuração migrada para edição posterior.')+`<div class="setting"><div><h3>WHATSAPP</h3><p>Contato e consentimento serão reconectados nesta página.</p></div></div>`;
else if(route==='profile/privacy')app.innerHTML=`<a href="#profile" class="back">← VOLTAR</a>`+heading('PERFIL','SOBRE E PRIVACIDADE','Controles de privacidade e dados do Academy.')+`<div class="setting"><div><h3>POLÍTICA DE PRIVACIDADE</h3><p>Documento e ações de conta serão conectados aqui.</p></div></div><div class="setting"><div><h3>DADOS LOCAIS</h3><p>Limpeza de progresso, histórico e preferências será reconectada nesta página.</p></div></div>`;
else if(route==='welcome')app.innerHTML=home();
if(route.startsWith('chapter/')||route.startsWith('procedure/'))app.insertAdjacentHTML('beforeend',`<a class="primary reinforce-learning" href="#practice">${t('practice.reinforce')}</a>`);
if(route==='chapter/floor'){
 for(const el of [...app.querySelectorAll('h1,h2,h3,h4,.section-title')]){
  if(el.textContent.trim().toUpperCase()==='STAFF, ETIQUETA E REGRAS DA CASA'){
   const container=el.closest('.source-group,.source-section,.source-group-header,.source-group-heading');
   if(container&&container.querySelectorAll('details').length===0)container.remove();
   else el.remove();
  }
 }
 for(const detail of app.querySelectorAll('details.source-lesson')){
  const summary=detail.querySelector('summary');
  if(!summary)continue;
  for(const label of [...summary.querySelectorAll('span')]){
   if(label.textContent.trim().toUpperCase()==='APROFUNDAMENTO')label.remove();
  }
 }
}
standardizeExamples(app);
standardizeBack(app,route);
app.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none'}));if(route==='home'&&!messageAutoShown){messageAutoShown=true;openMessages()}}
document.addEventListener('click',async e=>{if(e.target.closest('[data-message-training]')){dialog.close();return}if(e.target.closest('[data-message-save]')){if(saveActivities()){window.dispatchEvent(new CustomEvent('academy:activities-saved'));dialog.close();openMessages()}else openDialog(t('training.saveFailed'),t('stats.unsaved'));return}if(e.target.closest('[data-save-activities]')){if(saveActivities())window.dispatchEvent(new CustomEvent('academy:activities-saved'));else openDialog(t('training.saveFailed'),t('stats.unsaved'));return}const langBtn=e.target.closest('[data-profile-lang]');if(langBtn){try{localStorage.setItem('stackup.locale',langBtn.dataset.profileLang)}catch{}location.reload();return}const help=e.target.closest('[data-help]'),pending=e.target.closest('[data-pending]'),practiceRoute=e.target.closest('[data-practice-route]');const series=e.target.closest('[data-series]');if(series)openDialog(series.dataset.series,'Este é um dos próximos caminhos da série StackUp Hold’em. Cada app tem sua própria proposta. O acesso será conectado quando esse app estiver disponível nesta jornada.');if(help&&help.closest('header')){openMessages();return}if(help)openDialog('Oi! Eu sou o Pokerinno.','Vou ajudar você a entender o jogo, praticar o básico e chegar à mesa sabendo o que está acontecendo. O Academy prepara o iniciante; a especialização e a busca pelo domínio continuam nos demais apps da série StackUp Hold’em.');if(practiceRoute){location.hash=practiceRoute.dataset.practiceRoute;return}if(pending)openDialog(pending.dataset.pending,'Este espaço está pronto para receber os treinos. Assim que os desafios estiverem disponíveis, você poderá praticar por aqui.');if(e.target.closest('[data-login]'))location.hash='login';if(e.target.closest('[data-retry]')){state=await loadAcademy(window.StackUpAcademyAdapter);render()}});
document.addEventListener('change',e=>{if(e.target.matches('[data-message-preference]')){const saved=saveMessagePreference(storage,e.target.dataset.messagePreference,e.target.checked);closePokerinno();if(!saved){e.target.checked=!e.target.checked;openDialog(t('messages.settings'),t('messages.saveError'))}return}if(e.target.id==='autoSaveActivities'){const ok=setAutoSave(e.target.checked);const prompt=app.querySelector('.manual-save-profile');if(prompt)prompt.innerHTML=e.target.checked?'':`<button class="save-activities" data-save-activities>${t('training.saveNow')}</button>`;if(!ok)openDialog(t('training.saveFailed'),t('stats.unsaved'));return}if(e.target.id==='saveTraining'){try{storage.setItem('academy.training.save',e.target.checked?'on':'off')}catch{}}if(['sound','reducedMotion'].includes(e.target.id)){preferences[e.target.id]=e.target.checked;const saved=savePreferences(storage,preferences);document.documentElement.classList.toggle('reduced-motion',preferences.reducedMotion);if(!saved)openDialog('Preferência aplicada','Seu navegador não permitiu salvar este ajuste. Ele permanece ativo durante esta visita.')}});window.addEventListener('hashchange',()=>{closePokerinno();render();window.scrollTo({top:0,behavior:'instant'})});render();

document.addEventListener('visibilitychange',()=>{if(messageVisitStarted&&document.visibilityState==='visible')trackMessageVisit(storage)});
enablePageSwipe(nav.map(item=>item[0]));
