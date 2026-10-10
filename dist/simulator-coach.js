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
export function showDecisionCoach(page,spot,proceed){
 page.querySelector('.simulator-coach-overlay')?.remove();
 if(!coachEnabled()){proceed();return}
 const host=page.querySelector('.simulator-actions')||page;
 const overlay=document.createElement('section');
 overlay.className='simulator-coach-overlay';
 overlay.setAttribute('role','group');
 overlay.setAttribute('aria-label','Orientação do Pokerinno antes da decisão');
 const questions=coachSections.flatMap(([category,items])=>items.map(question=>({category,question})));
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