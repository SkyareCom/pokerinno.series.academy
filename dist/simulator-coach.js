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
 const street=spot.street||'pre',position=spot.position||'BTN';
 const line=Array.isArray(spot.bettingLine)?spot.bettingLine:[];
 const current=line.filter(a=>a.street===street);
 const last=current.at(-1);
 const bet=last&&['bet','raise','all in','all-in'].includes(String(last.action).toLowerCase())&&last.position!==position;
 const unopened=street==='pre'&&!line.some(a=>['raise','bet','all in','all-in'].includes(String(a.action).toLowerCase()));
 const order=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'];
 const after=Math.max(0,order.length-1-order.indexOf(position));
 const eff=Number(spot.effectiveStack??spot.stack),pot=Number(spot.pot);
 const board=Array.isArray(spot.board)?spot.board:[];
 const multiway=spot.playersInHand>2;
 const short=Number.isFinite(eff)&&eff<=20;
 const q=[];
 const add=(category,question)=>q.push({category,question});
 add('POSIÇÃO',`Você está em ${position}. Quantos jogadores ainda precisam agir depois de você?`);
 if(street==='pre'){
  if(unopened){
   add('AÇÃO PRÉVIA','Ninguém aumentou até agora. Sua mão faz parte de um range de abertura adequado para esta posição?');
   add('RANGE',position==='UTG'||position==='UTG+1'?'Em posição inicial, por que devemos selecionar mãos mais fortes para abrir?':'Quais mãos fortes e mãos especulativas fazem sentido abrir nesta posição?');
   add('DECISÃO',short?'Com stack curto, sua mão justifica colocar fichas em risco agora?':'Qual tamanho de abertura combina com sua posição e com os stacks da mesa?');
  }else{
   add('AÇÃO PRÉVIA','Quem aumentou antes de você e de qual posição veio a agressão?');
   add('RANGE','Sua mão joga melhor como call, novo aumento ou fold contra esse range provável?');
   add('DECISÃO',bet?'Quanto precisa pagar e o que pode acontecer se alguém aumentar novamente?':'Há jogadores que ainda podem fazer uma 3-bet depois de você?');
  }
  if(position==='SB'||position==='BB')add('BLINDS','Quanto você já investiu obrigatoriamente neste pote e como isso afeta sua decisão?');
  else add('JOGADORES RESTANTES','Quais jogadores atrás de você ainda podem entrar no pote ou aumentar?');
  add('PLANO',short?'Se entrar no pote, quanto do seu stack ficará comprometido?':'Se receber um call, qual será seu plano para o flop?');
 }else{
  add('HISTÓRICO',`No ${street.toUpperCase()}, quem foi o agressor pré-flop e como a ação chegou até você?`);
  add('BOARD',street==='flop'?'Com estas três cartas do flop, sua mão acertou algo ou possui algum projeto?':street==='turn'?'A quarta carta melhorou sua mão ou completou algum projeto?':'Com as cinco cartas na mesa, qual é a força final da sua mão?');
  add('TEXTURA',street==='flop'?'O flop é seco, conectado ou apresenta possibilidade de flush?':street==='turn'?'O turn mudou a textura ou a vantagem de range?':'O river completou sequência, flush ou outra combinação que muda o valor das mãos?');
  if(bet)add('APOSTA RECEBIDA','Quanto você precisa pagar em relação ao pote? Quais pot odds precisa considerar?');
  else add('AÇÃO DISPONÍVEL','Como não há aposta a pagar agora, apostar por valor, blefar ou fazer check faz mais sentido?');
  if(multiway)add('POTE MULTIWAY','Sua mão perde valor por enfrentar vários adversários ao mesmo tempo?');
  else if(short)add('STACK CURTO','Quanto do seu stack efetivo ficaria comprometido se você apostasse ou pagasse?');
  else if(Number.isFinite(eff)&&Number.isFinite(pot)&&pot>0)add('STACK E POTE',`O pote é de cerca de ${pot} BB e o stack efetivo de ${eff} BB. Como a relação stack/pote muda o risco?`);
  else add('RANGE','Quais mãos fortes e projetos o adversário pode ter pela linha de ações apresentada?');
  add('DECISÃO',bet?'Você está pagando por valor de showdown, por um projeto com odds adequadas, ou deveria desistir?':street==='river'?'Quais mãos piores pagariam sua aposta de valor e quais mãos melhores desistiriam de um blefe?':'Quais mãos piores pagariam sua aposta e o que você faria diante de um raise?');
  if(street==='river')add('CONCLUSÃO','Se enfrentar um raise no river, quais mãos de valor e possíveis blefes explicam essa ação?');
  else add('PRÓXIMA STREET',street==='flop'?'Quais cartas do turn seriam boas ou perigosas e como você reagiria?':'Quais cartas do river mudariam sua decisão e como você reagiria a uma aposta?');
 }
 // Academy: a short guided path, never the entire question bank at once.
 // Rotate one optional contextual question across scenarios while preserving the decision sequence.
 const limit=street==='pre'?5:5;
 const first=q[0],lastQuestion=q.at(-1),middle=q.slice(1,-1);
 const selected=middle.length<=limit-2?middle:middle.filter((_,i)=>i!==((Number(spot.id)||0)%middle.length)).slice(0,limit-2);
 return [first,...selected,lastQuestion];
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