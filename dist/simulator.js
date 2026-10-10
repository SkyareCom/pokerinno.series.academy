import {showDecisionCoach,coachEnabled,setCoachEnabled} from './simulator-coach.js?v=45dcf7e';
import {trainingSpots,checkTrainingAction} from './simulator-spots.js';
const seats=[{pos:'UTG',x:22,y:25},{pos:'UTG+1',x:39,y:12},{pos:'UTG+2',x:61,y:12},{pos:'LJ',x:78,y:25},{pos:'HJ',x:88,y:51},{pos:'CO',x:76,y:76},{pos:'BTN',x:50,y:88},{pos:'SB',x:24,y:76},{pos:'BB',x:12,y:51}];
const stackBB=[100,85,125,62,110,73,90,48,100];
const bbValue=2;
export function simulatorPage(){return `<div class="simulator-page"><div class="simulator-controls" role="group" aria-label="Unidade dos stacks"><span>EXIBIR STACKS EM</span><div class="simulator-switch"><button type="button" data-sim-random aria-label="Sortear cenário">RANDOM</button><button type="button" data-stack-unit="bb" aria-pressed="true">BB</button><button type="button" data-stack-unit="chips" aria-pressed="false">FICHAS</button><button type="button" data-stack-unit="money" aria-pressed="false">MOEDA</button></div><button type="button" class="simulator-start" data-sim-start>INICIAR SIMULAÇÃO</button></div><section class="simulator-table-area" aria-label="Mesa de poker com nove jogadores"><div class="simulator-table"><div class="simulator-felt"><div class="simulator-board-label">BOARD</div><div class="simulator-board"><span>?</span><span>?</span><span>?</span><span>?</span><span>?</span></div><div class="simulator-pot">POTE · 0 BB</div></div></div>${seats.map((seat,i)=>`<div class="simulator-seat " style="--seat-x:${seat.x}%;--seat-y:${seat.y}%"><strong class="simulator-seat-position">${seat.pos}</strong><span class="simulator-stack" data-stack-bb="${stackBB[i]}">${stackBB[i]} BB</span><span class="simulator-seat-action" aria-label="Ação do jogador">—</span><span class="simulator-bet" aria-live="polite"></span><span class="simulator-hole-cards" aria-label="Duas cartas fechadas"><span class="simulator-card-back" aria-hidden="true"></span><span class="simulator-card-back" aria-hidden="true"></span></span></div>`).join('')}</section><div class="simulator-action-history" aria-live="polite"></div><div class="simulator-actions" role="group" aria-label="Ações do jogador">${["CALL","CHECK","FOLD","RAISE","ALL IN","PRÓXIMO"].map(a=>`<button type="button" data-sim-action="${a}">${a}</button>`).join("")}</div><div class="simulator-feedback" aria-live="polite"></div><section class="simulator-decision-card" aria-live="polite" hidden><strong class="simulator-decision-comment"></strong><div class="simulator-decision-lines"></div><small class="simulator-decision-source"></small></section><div class="simulator-legend">9 JOGADORES · BLINDS 1 / 2 · STACKS ILUSTRATIVOS</div><div class="simulator-pokerinno"><strong>POKERINNO EXPLICA</strong><p>Observe as posições e os stacks. Alterne entre BB, fichas e moeda para visualizar a mesma mesa em unidades diferentes. Esta é a tela inicial do simulador; use os botões para experimentar decisões. Os cenários são didáticos, não solves certificados.</p></div><button type="button" class="simulator-coach-toggle" data-sim-coach-toggle></button></div>`}
export function setupSimulator(root){
 const page=root.querySelector('.simulator-page');if(!page)return;
 let index=0,selectedUnit='bb',potBB=0,heroIndex=6,audioCtx=null,runToken=0,started=false;
 const feedback=page.querySelector('.simulator-feedback'),board=page.querySelectorAll('.simulator-board span'),pot=page.querySelector('.simulator-pot'),legend=page.querySelector('.simulator-legend'),explain=page.querySelector('.simulator-pokerinno p'),history=page.querySelector('.simulator-action-history');
 const avatars=[...page.querySelectorAll('.simulator-seat')];
 const coachToggle=page.querySelector('[data-sim-coach-toggle]');
 function updateCoachToggle(){coachToggle.textContent=coachEnabled()?'DESATIVAR AJUDA DO POKERINNO':'ATIVAR AJUDA DO POKERINNO';coachToggle.setAttribute('aria-pressed',String(!coachEnabled()));}
 coachToggle.addEventListener('click',()=>{setCoachEnabled(!coachEnabled());updateCoachToggle();if(!coachEnabled()){const skip=page.querySelector('[data-coach-skip]');if(skip)skip.click();}});
 updateCoachToggle();
 const decisionCard=page.querySelector('.simulator-decision-card');
 const positions=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'];
 let currentPositions=positions.slice(),folded=new Set(),log=[],stakes=[];
 function compact(n){if(!Number.isFinite(n))return '—';const v=Math.abs(n);const display=v>=1000?((n/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k'):n.toLocaleString('pt-BR',{maximumFractionDigits:1});return display;}
 function fmt(bb){const value=selectedUnit==='bb'?bb:bb*bbValue;return compact(value);}
 function fullUnit(bb){const value=selectedUnit==='bb'?bb:bb*bbValue;return value.toLocaleString('pt-BR',{maximumFractionDigits:2})+(selectedUnit==='bb'?' BB':selectedUnit==='chips'?' FICHAS':'');}

 function refresh(){pot.textContent='POTE · '+fullUnit(potBB);avatars.forEach((el,i)=>{el.querySelector('.simulator-stack').textContent=fmt(stakes[i]);el.querySelector('.simulator-stack').title=fullUnit(stakes[i]);const b=el.querySelector('.simulator-bet');b.textContent=Number(b.dataset.bet||0)>0?fmt(Number(b.dataset.bet)):'';});}
 function sound(action){try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const notes={FOLD:[180,110],CHECK:[390],CALL:[330,440],RAISE:[420,560], 'ALL IN':[300,450,620]};const ns=notes[action]||[350];ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime+i*.09;o.type='sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.13);});}catch{}}
 function animateFold(el){const cards=el.querySelector('.simulator-hole-cards');if(!cards)return;const origin=cards.getBoundingClientRect(),center=page.querySelector('.simulator-table').getBoundingClientRect();const ghost=cards.cloneNode(true);ghost.className='simulator-fold-flying';ghost.style.cssText='position:fixed;left:'+origin.left+'px;top:'+origin.top+'px;width:'+origin.width+'px;height:'+origin.height+'px;z-index:9999;pointer-events:none;display:flex;justify-content:center;gap:2px;';document.body.append(ghost);ghost.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:'translate('+(center.left+center.width/2-origin.left)+'px,'+(center.top+center.height/2-origin.top)+'px) rotate(140deg)',opacity:0}],{duration:520,easing:'ease-in',fill:'forwards'}).onfinish=()=>ghost.remove();el.classList.add('simulator-folded');}
 function act(i,action,amount=0,withSound=false){const el=avatars[i];el.querySelector('.simulator-seat-action').textContent=action;el.querySelector('.simulator-bet').dataset.bet=String(amount);if(amount>0){stakes[i]=Math.max(0,stakes[i]-amount);potBB+=amount;}if(action==='FOLD'){folded.add(i);animateFold(el);}log.push(currentPositions[i]+' '+action+(amount>0?' '+fmt(amount):''));history.textContent=log.join(' · ');if(withSound)sound(action);refresh();}
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function enableActions(value){page.querySelectorAll('[data-sim-action]').forEach(b=>b.disabled=!value);}
 function resetStart(){runToken++;started=false;page.querySelector('[data-sim-start]').hidden=false;page.querySelector('.simulator-coach-overlay')?.remove();page.querySelector('.simulator-turn-alert')?.remove();enableActions(false);}
 async function startSimulation(){if(started)return;started=true;const token=++runToken;page.querySelector('[data-sim-start]').hidden=true;const s=trainingSpots[index];const first=s.street==='pre'?'UTG':'SB';const startPos=positions.indexOf(first);const heroPos=positions.indexOf(s.position);const prior=[];for(let n=startPos;n!==heroPos;n=(n+1)%9){prior.push(positions[n]);if(prior.length>=9)break;}
 const recorded=Array.isArray(s.bettingLine)?s.bettingLine:[];
 for(const pos of prior){if(token!==runToken||!page.isConnected)return;const seat=currentPositions.indexOf(pos);if(seat<0)continue;const step=recorded.find(a=>a.position===pos);const action=step?String(step.action||'CHECK').toUpperCase():(s.street==='pre'?'FOLD':'CHECK');const amount=step?Number(step.sizeBB)||0:0;avatars.forEach((el,i)=>el.classList.toggle('simulator-acting',i===seat));act(seat,action,amount,true);await delay(500);}
 if(token!==runToken||!page.isConnected)return;avatars.forEach((el,i)=>el.classList.toggle('simulator-acting',i===heroIndex));const alert=document.createElement('div');alert.className='simulator-turn-alert';alert.textContent='SUA AÇÃO';alert.setAttribute('role','status');page.querySelector('.simulator-table-area').append(alert);sound('CALL');await delay(2000);alert.remove();if(token!==runToken||!page.isConnected)return;showDecisionCoach(page,s,()=>{if(token===runToken)enableActions(true)});
 }
 function renderDecision(spot,action,result){
  decisionCard.hidden=false;
  const comment=decisionCard.querySelector('.simulator-decision-comment'),lines=decisionCard.querySelector('.simulator-decision-lines'),source=decisionCard.querySelector('.simulator-decision-source');
  lines.replaceChildren();
  const solver=spot.solver,labels={raise:'RAISE',fold:'FOLD',call:'CALL',check:'CHECK',bet:'BET',allin:'ALL IN'};
  const label=a=>labels[String(a).toLowerCase()]||String(a).toUpperCase();
  const percent=n=>Number(n).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
  const addRow=t=>{const row=document.createElement('div');row.textContent=t;lines.append(row);};
  // EV and action frequency are distinct quantities. Only use independently
  // verified EV when the spot explicitly supplies comparable per-action values.
  const ev=solver?.independentlyVerified===true&&Array.isArray(solver?.actionEV)?
   solver.actionEV.filter(a=>Array.isArray(a)&&a.length===2&&typeof a[1]==='number'&&Number.isFinite(a[1])).sort((a,b)=>b[1]-a[1]):[];
  if(ev.length){
   const top=ev[0],chosen=ev.find(a=>label(a[0])===action);
   const gap=chosen?top[1]-chosen[1]:Infinity;
   comment.textContent=gap<=0.0001?'Parabéns!!! Excelente decisão!!!':gap<=0.1?'Boa decisão!!! Mas poderia ser melhor!!!':'Poxa, decisão ruim!!! Estude mais!!!';
   [top,...ev.filter(a=>a!==top).slice(0,2)].forEach((a,i)=>addRow((i===0?'Maior EV = ':'Outra ação = ')+label(a[0])+' '+a[1].toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' BB'));
   while(lines.children.length<3)addRow('Outra ação = não disponível');
   source.textContent='EV em BB por ação; percentuais não representam EV.';
   return;
  }
  const frequencies=Array.isArray(solver?.actions)?solver.actions.filter(a=>Array.isArray(a)&&a.length===2&&typeof a[1]==='number'&&Number.isFinite(a[1])&&a[1]>=0&&a[1]<=100).sort((a,b)=>b[1]-a[1]):[];
  comment.textContent='Decisão registrada. Avaliação de EV ainda indisponível.';
  if(frequencies.length){
   [frequencies[0],...frequencies.slice(1,3)].forEach((a,i)=>addRow((i===0?'Maior frequência = ':'Outra ação = ')+label(a[0])+' '+percent(a[1])));
   while(lines.children.length<3)addRow('Outra ação = não disponível');
   source.textContent='Frequências de referência DCFR 9-max, não certificadas. Frequência não é EV.';
  }else{
   addRow('Maior EV = não disponível');addRow('Outra ação = não disponível');addRow('Outra ação = não disponível');
   source.textContent='Este cenário não possui resultados de solver comparáveis.';
  }
 }
 function draw(){resetStart();decisionCard.hidden=true;const s=trainingSpots[index];folded=new Set();log=[];history.textContent='';potBB=0;heroIndex=6;
 // Keep the hero physically fixed at the lower seat; rotate position labels for each hand.
 const heroPos=positions.indexOf(s.position);currentPositions=avatars.map((_,i)=>positions[(heroPos+i-heroIndex+9)%9]);
 stakes=avatars.map((_,i)=>i===heroIndex?s.stack:stackBB[i]);
 avatars.forEach((el,i)=>{el.classList.toggle('simulator-hero',i===heroIndex);el.classList.toggle('simulator-acting',i===heroIndex);el.classList.remove('simulator-folded');el.querySelector('.simulator-seat-position').textContent=currentPositions[i];el.querySelector('.simulator-seat-action').textContent='—';const hole=el.querySelectorAll('.simulator-hole-cards .simulator-card-back');hole.forEach((card,j)=>{const face=i===heroIndex?s.heroCards?.[j]:null;card.classList.toggle('simulator-card-face',!!face);card.classList.toggle('simulator-card-red',!!face&&/[hd]$/i.test(face));card.textContent=face?face.slice(0,-1).replace('T','10')+({s:'♠',h:'♥',d:'♦',c:'♣'}[face.slice(-1).toLowerCase()]||''):'';card.setAttribute('aria-label',face?'Carta do herói '+card.textContent:'Carta fechada');});el.querySelector('.simulator-bet').dataset.bet='0';});
 board.forEach((el,i)=>{el.textContent=s.board[i]||'?';el.classList.toggle('simulator-card-dealt',i<s.board.length)});
 // Blinds are paid into the pot before action reaches the hero.
 const sb=currentPositions.indexOf('SB'),bb=currentPositions.indexOf('BB');act(sb,'BLIND',.5);act(bb,'BLIND',1);
 // Actions are replayed sequentially only after INICIAR SIMULAÇÃO.
 // Respect the source pot without fabricating missing historical decisions.
 potBB=Math.max(potBB,Number(s.pot)||0);refresh();
 legend.textContent='CENÁRIO '+s.id+' / 1500 · '+s.street.toUpperCase()+' · '+s.stack+' BB · '+s.position+' · '+s.hand+' · '+s.heroCards.join(' ');
 feedback.textContent='Sua vez. As ações anteriores são ilustrativas quando não há histórico registrado.';feedback.dataset.validationStatus='unvalidated';
 explain.textContent='Observe as ações, apostas externas aos avatares e o pote atualizado. As situações são didáticas, não soluções certificadas do solver.';
 page.querySelectorAll('[data-sim-action]').forEach(b=>b.disabled=true);
 // Waiting for user to select unit and press INICIAR SIMULAÇÃO.
 }
 page.querySelector('[data-sim-start]').addEventListener('click',startSimulation);
 page.querySelectorAll('[data-sim-action]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.simAction;if(action==='PRÓXIMO'){index=(index+1)%trainingSpots.length;draw();startSimulation();return;}const s=trainingSpots[index];const result=checkTrainingAction(s,action);const bet=action==='CALL'?2:action==='RAISE'?3:action==='ALL IN'?stakes[heroIndex]:0;act(heroIndex,action,bet,true);feedback.textContent='AÇÃO: '+action+' · '+result.message;feedback.dataset.validationStatus=result.status;renderDecision(s,action,result);}));
 page.querySelector('[data-sim-random]')?.addEventListener('click',()=>{if(trainingSpots.length<2)return;let next=index;while(next===index)next=Math.floor(Math.random()*trainingSpots.length);index=next;draw();});
 page.querySelectorAll('[data-stack-unit]').forEach(b=>b.addEventListener('click',()=>{selectedUnit=b.dataset.stackUnit;page.querySelectorAll('[data-stack-unit]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));refresh();}));
 draw();
}
