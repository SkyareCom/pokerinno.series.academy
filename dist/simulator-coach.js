export const coachKey='academy.pokerinno.predecision';
export const coachSections=[
['POSIÇÃO E AÇÃO PRÉVIA',['Onde estou posicionado na mesa em relação aos outros jogadores?','Quem foi o agressor pré-flop e quem detém a iniciativa da mão?','Qual foi a sequência exata de ações até este momento?']],
['PERFIL DOS OPONENTES E RANGES',['Qual é o perfil do vilão envolvido?','Qual é o range provável que o adversário jogaria dessa forma?']],
['MATEMÁTICA E STACKS',['Qual é o stack efetivo em jogo?','Qual é o SPR neste momento?','As pot odds justificam o call considerando minha equidade?']],
['TEXTURA DO BOARD',['A quem o board favorece em vantagem de range?','O turn ou river completou sequências, flushes ou mudou a dinâmica?']],
['INTENÇÃO DA APOSTA',['Se eu apostar por valor, mãos piores vão pagar?','Se eu blefar, mãos melhores vão desistir?','Qual será meu plano diante de um raise?']],
['PLANEJAMENTO FUTURO',['Qual é meu plano para a próxima rua?']]
];
export function coachEnabled(){try{return localStorage.getItem(coachKey)!=='off'}catch{return true}}
export function setCoachEnabled(value){try{localStorage.setItem(coachKey,value?'on':'off')}catch{}}
export function coachProfileSetting(){return '<div class="setting"><div><h3>REFLEXÃO COM POKERINNO ANTES DA DECISÃO</h3><p>Exibir perguntas didáticas antes de cada decisão na mesa.</p></div><input type="checkbox" id="pokerinnoPredecision" aria-label="Ativar reflexão do Pokerinno" '+(coachEnabled()?'checked':'')+'></div>'}
export function buildDecisionQuestions(spot){
 const street=spot.street||'pre',position=spot.position||'BTN',pot=Number(spot.pot)||0;
 const effective=Number(spot.effectiveStack??spot.stack);
 const line=Array.isArray(spot.bettingLine)?spot.bettingLine:[];
 const current=line.filter(a=>a.street===street);
 const last=current.at(-1);
 const facingBet=last&&['bet','raise','all in'].includes(String(last.action).toLowerCase())&&last.position!==position;
 const isIP=['BTN','CO','HJ'].includes(position);
 const q=[];
 const add=(category,question)=>q.push({category,question});
 add('1 · ENTENDA A SITUAÇÃO',`Você está no ${position} ${isIP?'(posição geralmente tardia)':'(posição inicial ou intermediária)'} com ${spot.hand||'sua mão'}. Quem ainda pode agir depois de você?`);
 if(street==='pre'){
  if(!line.length){add('2 · AÇÃO ANTERIOR','O pote está sem aumentos registrados. Quais mãos você abriria desta posição e por quê?');}
  else add('2 · AÇÃO ANTERIOR','Quais ações pré-flop estão registradas e como alteram os ranges de quem entrou no pote?');
  add('3 · STACK E RISCO',`Com aproximadamente ${effective} BB efetivos, qual tamanho de abertura preserva suas opções futuras?`);
  add('4 · RANGES','Que mãos mais fortes e mais fracas fazem sentido no seu range de abertura nesta posição?');
  add('5 · DECISÃO','Seu objetivo é abrir por valor, exercer pressão ou desistir? O que faria diante de um 3-bet?');
  add('6 · PLANO','Se houver call, quais tipos de flop favorecem seu range e como você pretende reagir?');
 }else{
  const cards=(spot.board||[]).join(' ');
  add('2 · HISTÓRICO',`No ${street.toUpperCase()}, o board é ${cards}. Quem teve a iniciativa pré-flop e como as ações anteriores influenciam os ranges?`);
  if(facingBet){add('3 · APOSTA RECEBIDA','Qual foi o tamanho da aposta enfrentada? Calcule pot odds e compare com sua equidade antes de pagar.');}
  else add('3 · AÇÃO DISPONÍVEL','Você enfrenta um check ou nenhuma aposta registrada. É melhor apostar por valor, blefar ou controlar o pote?');
  if(Number.isFinite(effective)&&pot>0)add('4 · MATEMÁTICA',`Com stack efetivo aproximado de ${effective} BB e pote de ${pot} BB, o SPR é cerca de ${(effective/pot).toFixed(1)}. Como isso muda seu plano?`);
  add('5 · TEXTURA',street==='flop'?'Este flop é seco ou conectado? Quem tem vantagem de range e quais draws existem?':street==='turn'?'O turn completou draws ou mudou a vantagem de range em relação ao flop?':'O river completou draws? Quais mãos agora apostam por valor ou podem blefar?');
  add('6 · RANGE ADVERSÁRIO','Quais mãos do adversário chegam a esta street pela linha de ações registrada? O perfil dele é conhecido ou ainda precisa ser observado?');
  add('7 · DECISÃO',facingBet?'Você tem odds e equidade para pagar, motivos para aumentar ou deve desistir?':'Mãos piores pagariam uma aposta por valor? Mãos melhores desistiriam de um blefe?');
  if(street!=='river')add('8 · PRÓXIMA STREET','Qual é seu plano diante de um raise agora e das possíveis cartas da próxima street?');
  else add('8 · CONCLUSÃO','Se houver raise no river, quais mãos de valor e blefes plausíveis você espera encontrar?');
 }
 return q;
}
export function showDecisionCoach(page,spot,proceed){
 page.querySelector('.simulator-coach-overlay')?.remove();
 if(!coachEnabled()){proceed();return}
 const host=page.querySelector('.simulator-actions')||page;
 const overlay=document.createElement('section');
 overlay.className='simulator-coach-overlay';
 overlay.setAttribute('role','group');
 overlay.setAttribute('aria-label','Orientação do Pokerinno antes da decisão');
 const questions=buildDecisionQuestions(spot);
 let index=-1,closing=false;
 const faces=['pokerinno-happy.webp','pokerinno-curious.webp','pokerinno-thinking.webp','pokerinno-analyzing.webp','pokerinno-focused.webp','pokerinno-studying.webp','pokerinno-confident.webp'];
 overlay.innerHTML='<div class="simulator-coach-stage"><img class="simulator-coach-character" src="assets/pokerinno-happy.webp" alt="Pokerinno" /><div class="simulator-coach-talk"><div class="simulator-coach-bubble" aria-live="polite"></div><div class="simulator-coach-buttons"><button type="button" data-coach-skip>PULAR ETAPA</button><button type="button" data-coach-next>PRÓXIMO</button></div></div></div>';
 const character=overlay.querySelector('.simulator-coach-character'),bubble=overlay.querySelector('.simulator-coach-bubble'),next=overlay.querySelector('[data-coach-next]');
 function show(){const item=questions[index];character.src='assets/'+(index<0?faces[0]:faces[Math.floor(index/2+1)%faces.length]);bubble.textContent=index<0?'Olá, sou Pokerinno e vou ajudar você a tomar a melhor decisão.':item.question;next.textContent=index===questions.length-1?'DECIDIR':'PRÓXIMO';bubble.classList.remove('simulator-coach-bubble-enter');void bubble.offsetWidth;bubble.classList.add('simulator-coach-bubble-enter');}
 function finish(){if(closing)return;closing=true;overlay.classList.add('simulator-coach-exit');const done=()=>{overlay.remove();proceed()};if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){done();return}overlay.addEventListener('animationend',e=>{if(e.target===overlay)done()},{once:true});setTimeout(()=>{if(overlay.isConnected)done()},550)}
 overlay.querySelector('[data-coach-skip]').addEventListener('click',finish);
 next.addEventListener('click',()=>{if(index>=questions.length-1){finish();return}index++;show()});
 host.append(overlay);show();
}