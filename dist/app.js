import {loadAcademy,chapters} from './data.js';
import {resolveRoute} from './navigation.js';
import {readPreferences,savePreferences} from './preferences.js';

let storage;
try{storage=localStorage}catch{storage={getItem:()=>null,setItem:()=>{throw Error()}}}
let preferences=readPreferences(storage);
let currentLanguage='pt-BR';
try{currentLanguage=storage.getItem('academy.language')||'pt-BR'}catch{}
const app=document.querySelector('#app');
const dialog=document.querySelector('#dialog');
const pokerinnoDialog=document.querySelector('#pokerinno-dialog');
const pokerinnoVideo=document.querySelector('#pokerinno-video');
const pokerinnoFallback=document.querySelector('#pokerinno-fallback');
let state=await loadAcademy(window.StackUpAcademyAdapter);
let previousFocus;
const previewMode=new URLSearchParams(location.search).get('preview')==='1';
let authenticated=previewMode;
if(!previewMode&&window.StackUpAuthAdapter?.getSession){
  try{
    const session=await window.StackUpAuthAdapter.getSession();
    authenticated=Boolean(session?.user||session?.authenticated);
  }catch{authenticated=false}
}

const pokerinnoMessages={
  'pt-BR':{
    title:'Olá! Eu sou o Pokerinno.',
    message:'Vou acompanhar sua primeira aventura no poker. Aqui você aprende o essencial, pratica o básico e chega à mesa entendendo cada passo. Quando precisar, é só me chamar.',
    replay:'Repetir mensagem',
    continue:'Continuar',
    video:'assets/pokerinno-intro-pt-BR.mp4'
  },
  'en-US':{
    title:"Hi! I'm Pokerinno.",
    message:"I'll guide you through your first poker adventure. Here you'll learn the essentials, practice the basics, and reach the table understanding every step. Call me whenever you need help.",
    replay:'Replay message',
    continue:'Continue',
    video:'assets/pokerinno-intro-en-US.mp4'
  },
  'es-ES':{
    title:'¡Hola! Soy Pokerinno.',
    message:'Voy a acompañarte en tu primera aventura en el poker. Aquí aprenderás lo esencial, practicarás lo básico y llegarás a la mesa entendiendo cada paso. Cuando me necesites, solo tienes que llamarme.',
    replay:'Repetir mensaje',
    continue:'Continuar',
    video:'assets/pokerinno-intro-es-ES.mp4'
  }
};

const nav=[
  ['home','⌂','Início'],
  ['journey','▤','Jornada'],
  ['practice','♠','Prática'],
  ['evolution','↗','Evolução'],
  ['profile','♙','Perfil']
];

const heading=(tag,title,description)=>`<div class="page-heading"><div><span class="eyebrow">${tag}</span><h1>${title}</h1><p>${description}</p></div></div>`;
const empty=(symbol,title,description)=>`<section class="empty"><div class="empty-symbol">${symbol}</div><h2>${title}</h2><p>${description}</p><a href="#journey" class="primary">Explorar a jornada <span>→</span></a></section>`;

const nextApps=`<section class="next-apps"><span class="eyebrow">DEPOIS DO BÁSICO · A HISTÓRIA CONTINUA</span><h2>Aprender é o começo.</h2><p>O Academy prepara você para participar da mesa. Evolução, especialização e busca pelo domínio continuam nos demais apps StackUp Hold’em.</p><div class="next-grid">${[
['HEROES','Descubra seu Poker DNA.'],
['GRINDER EVO','Aprofunde suas decisões em Texas Hold’em.'],
['REVOLUTION','Explore o jogo em simulações.'],
['D ACTION','Identifique pontos de melhoria no Omaha.'],
['WRAPS','Aprofunde suas decisões no Omaha.'],
['CHIPS UP','Desenvolva a gestão do seu bankroll.']
].map(([name,desc])=>`<button class="next-app" data-series="${name}"><strong>${name}</strong><span>${desc}</span><i>↗</i></button>`).join('')}</div></section>`;

function getPokerinnoMessage(){
  return pokerinnoMessages[currentLanguage]||pokerinnoMessages['pt-BR'];
}

function showPokerinnoFallback(){
  pokerinnoVideo.pause();
  pokerinnoVideo.classList.remove('ready');
  pokerinnoFallback.classList.remove('hidden');
}

function openPokerinno(){
  const content=getPokerinnoMessage();
  document.querySelector('#pokerinno-title').textContent=content.title;
  document.querySelector('#pokerinno-message').textContent=content.message;
  document.querySelector('[data-pokerinno-replay]').textContent=content.replay;
  document.querySelector('[data-pokerinno-close]').firstChild.textContent=content.continue+' ';
  showPokerinnoFallback();

  pokerinnoVideo.src=content.video;
  pokerinnoVideo.load();
  pokerinnoDialog.showModal();

  pokerinnoVideo.onloadeddata=()=>{
    pokerinnoFallback.classList.add('hidden');
    pokerinnoVideo.classList.add('ready');
    pokerinnoVideo.play().catch(()=>{});
  };
  pokerinnoVideo.onerror=showPokerinnoFallback;
}

function closePokerinno(){
  pokerinnoVideo.pause();
  pokerinnoDialog.close();
}

function openDialog(title,body){
  previousFocus=document.activeElement;
  document.querySelector('#dialog-title').textContent=title;
  document.querySelector('#dialog-body').textContent=body;
  dialog.showModal();
}
dialog.querySelector('.close').onclick=()=>dialog.close();
dialog.querySelector('#dialog-action').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>previousFocus?.focus());
dialog.addEventListener('click',e=>{
  if(e.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
});

function login(){
  return `<section class="login-page">
    <div class="login-brand">
      <span class="login-spade">♠</span>
      <span class="eyebrow">STACKUP HOLD’EM</span>
      <h1>ACADEMY</h1>
      <p>Entre para continuar sua primeira aventura.</p>
    </div>
    <div class="language-switch" aria-label="Idioma">
      <button type="button" class="language ${currentLanguage==='pt-BR'?'active':''}" data-language="pt-BR">PR BR</button>
      <button type="button" class="language ${currentLanguage==='en-US'?'active':''}" data-language="en-US">EN US</button>
      <button type="button" class="language ${currentLanguage==='es-ES'?'active':''}" data-language="es-ES">ES ES</button>
    </div>
    <div class="login-card">
      <button type="button" class="login-option" data-auth="google"><strong>G</strong><span>Entrar com Google</span><i>→</i></button>
      <button type="button" class="login-option" data-auth="biometric"><strong>◎</strong><span>Entrar com Biometria</span><i>→</i></button>
      <div class="login-divider"><span>OU</span></div>
      <form data-stackup-form>
        <label for="stackup-id">STACKUP ID</label>
        <input id="stackup-id" name="stackupId" type="email" inputmode="email" autocomplete="email" placeholder="seuemail@exemplo.com" required>
        <button class="primary login-submit" type="submit">Entrar com StackUp ID <span>→</span></button>
      </form>
    </div>
    <a class="create-account-link" href="#create-account">Criar conta StackUp <span>→</span></a>
  </section>`;
}

function createAccount(){
  return `<section class="login-page">
    <a href="#login" class="back">← Voltar</a>
    <div class="login-brand compact">
      <span class="eyebrow">STACKUP HOLD’EM</span>
      <h1>Criar conta StackUp</h1>
      <p>Uma conta para acessar os aplicativos StackUp.</p>
    </div>
    <div class="login-card">
      <form data-create-account-form>
        <label for="new-email">E-MAIL</label>
        <input id="new-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="seuemail@exemplo.com" required>
        <button class="primary login-submit" type="submit">Continuar <span>→</span></button>
      </form>
    </div>
  </section>`;
}

function home(){
  return `<div class="page-heading"><div><span class="eyebrow">ACADEMY · A PRIMEIRA DESCOBERTA</span></div></div>`+
  `<section class="hero">
    <img class="hero-image" src="assets/pokerinno-hero.webp" alt="Pokerinno recebe você em uma academia de poker iluminada em dourado">
    <div class="hero-copy">
      <h2>APRENDER.<br>PRATICAR.<br><em>JOGAR.</em></h2>
      <p>“Poker é um jogo que demora minutos para aprender. Mas leva uma vida para dominar.”</p>
      <small class="quote-author">— MIKE SEXTON</small>
      <a href="#journey" class="primary">Começar a aprender <span>→</span></a>
    </div>
    <div class="hero-note">COM POKERINNO, CADA PASSO CONTA.</div>
  </section>
  <div class="section-top"><h2>Escolha sua aventura</h2></div>
  <div class="grid">${[
    ['journey','▤','Sua base','Os primeiros passos para entender o jogo.'],
    ['modalities','✧','Modalidades','Novas mesas. Diferentes possibilidades.'],
    ['practice','♠','Prática','Um espaço para suas próximas decisões.'],
    ['evolution','↗','Sua evolução','Cada descoberta faz parte da sua história.']
  ].map(([route,symbol,title,desc])=>`<a class="feature" href="#${route}"><span class="badge">${symbol}</span><span class="arrow">↗</span><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>
  <div class="section-top"><h2>Um passo de cada vez</h2></div>
  <div class="trail-preview"><span class="trail-number">01</span><div><h3>Descobrir o jogo</h3><p>Aprenda o jogo, pratique o básico e prepare-se para jogar.</p></div><a href="#journey">Ver capítulos →</a></div>`;
}

async function invokeAuth(method,payload={}){
  const adapter=window.StackUpAuthAdapter;
  if(!adapter||typeof adapter.signIn!=='function'){
    openDialog('Login em integração','A tela está pronta, mas o serviço real de autenticação ainda não está conectado neste repositório. Nenhuma sessão foi simulada.');
    return;
  }
  try{
    const result=await adapter.signIn(method,payload);
    if(result?.ok||result?.user){authenticated=true;location.hash='#home';return}
    openDialog('Não foi possível entrar',result?.message||'Confira os dados e tente novamente.');
  }catch{
    openDialog('Não foi possível entrar','O serviço de autenticação não respondeu. Tente novamente.');
  }
}

async function invokeCreateAccount(payload={}){
  const adapter=window.StackUpAuthAdapter;
  if(!adapter||typeof adapter.createAccount!=='function'){
    openDialog('Conta StackUp em integração','O formulário está pronto, mas a criação real da conta ainda precisa ser conectada ao serviço StackUp.');
    return;
  }
  try{
    const result=await adapter.createAccount(payload);
    if(result?.ok){
      openDialog('Conta criada','Sua conta foi criada. Volte para entrar no Academy.');
      location.hash='#login';
      return;
    }
    openDialog('Não foi possível criar a conta',result?.message||'Confira os dados e tente novamente.');
  }catch{
    openDialog('Não foi possível criar a conta','O serviço de cadastro não respondeu. Tente novamente.');
  }
}

function render(){
  const route=resolveRoute(location.hash);
  if(!authenticated&&route!=='login'&&route!=='create-account'){
    location.hash='#login';
    return;
  }
  const active=route.startsWith('chapter')?'journey':route;
  const authRoute=route==='login'||route==='create-account';
  document.body.classList.toggle('auth-route',authRoute);

  for(const id of ['navigation','mobile-navigation']){
    document.getElementById(id).innerHTML=nav.map(([key,symbol,title])=>`<a class="${id==='navigation'?'nav-link ':''}${active===key?'active':''}" ${active===key?'aria-current="page"':''} href="#${key}"><span class="nav-symbol" aria-hidden="true">${symbol}</span>${title}</a>`).join('');
  }

  document.documentElement.classList.toggle('reduced-motion',preferences.reducedMotion);

  if(route==='login'){app.innerHTML=login();return}
  if(route==='create-account'){app.innerHTML=createAccount();return}

  if(state.status==='error'){
    app.innerHTML=heading('SUA JORNADA','Vamos tentar novamente?','Sua navegação continua disponível.')+
      `<section class="empty"><h2>Não conseguimos carregar os conteúdos</h2><p>${state.error}</p><button class="primary" data-retry>Tentar novamente →</button></section>`;
    return;
  }

  if(route==='home')app.innerHTML=home();
  else if(route==='journey')app.innerHTML=heading('PRIMEIRA AVENTURA','APRENDER','Aprenda o essencial para acompanhar o jogo e participar da mesa.')+
    `<div class="list">${chapters.map(c=>`<a class="chapter" href="#chapter/${c.id}"><span class="number">0${c.order}</span><div><h3>${c.title}</h3><p>${c.description}</p></div><span class="status">↗</span></a>`).join('')}</div>`;
  else if(route.startsWith('chapter/')){
    const c=chapters.find(c=>c.id===route.split('/')[1]);
    app.innerHTML=`<a href="#journey" class="back">← Voltar à jornada</a>`+
      heading(`CAPÍTULO 0${c.order}`,c.title,c.description)+
      empty('▤','Seu próximo capítulo está sendo preparado.','As aulas aparecerão aqui quando o conteúdo da jornada estiver disponível. Seu aprendizado começa com uma base bem construída.');
  }
  else if(route==='modalities')app.innerHTML=heading('NOVOS CAMINHOS','Um jogo. Muitas possibilidades.','Descubra as diferentes formas de viver o poker.')+
    empty('✧','Novas mesas estão a caminho.','As modalidades e seus percursos serão apresentados aqui quando os conteúdos estiverem disponíveis.');
  else if(route==='practice')app.innerHTML=heading('DA DESCOBERTA À DECISÃO','Pratique o básico.','Entenda a dinâmica antes de enfrentar a mesa.')+
    `<div class="grid">${[
      ['◷','Treino rápido','Pratique as decisões básicas.'],
      ['☷','Treino personalizado','Reforce o que você aprendeu.'],
      ['♜','Desafios','Confira sua compreensão do jogo.'],
      ['♠','Revisão de mãos','Entenda o básico das suas decisões.']
    ].map(([s,t,d])=>`<button class="feature" data-pending="${t}"><span class="badge">${s}</span><span class="arrow">↗</span><h3>${t}</h3><p>${d}</p></button>`).join('')}</div>`+
    empty('♠','As primeiras decisões estão a caminho.','Quando os treinos estiverem disponíveis, você encontrará aqui seus desafios e a revisão das suas decisões.');
  else if(route==='evolution')app.innerHTML=heading('SUA HISTÓRIA','Sua preparação para a mesa.','Acompanhe os fundamentos que você está aprendendo.')+
    empty('↗','Sua história ainda vai começar.','Você ainda não possui aulas concluídas, treinos ou conquistas. O progresso aparecerá a partir das suas atividades reais.');
  else if(route==='profile')app.innerHTML=heading('DO SEU JEITO','Seu espaço no Academy.','Pequenos ajustes para acompanhar a sua jornada.')+
    `<section class="empty"><div class="empty-symbol">♙</div><h2>Olá, explorador.</h2><p>Conecte sua conta StackUp para sincronizar a jornada.</p><a class="primary" href="#login">Acessar minha conta →</a></section>
    <div class="setting"><div><h3>Sons da jornada</h3><p>Preferência preparada para as experiências com áudio.</p></div><input type="checkbox" id="sound" aria-label="Sons da jornada" ${preferences.sound?'checked':''}></div>
    <div class="setting"><div><h3>Reduzir movimentos</h3><p>Uma navegação mais tranquila, com menos animações.</p></div><input type="checkbox" id="reducedMotion" aria-label="Reduzir movimentos" ${preferences.reducedMotion?'checked':''}></div>
    <div class="setting"><div><h3>Privacidade e conta</h3><p>Conta e sincronização ficam disponíveis após a autenticação.</p></div><a class="quiet" href="#login">Consultar →</a></div>`+nextApps;
  else if(route==='welcome')app.innerHTML=home();

  app.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none'}));
}

document.addEventListener('click',async e=>{
  const help=e.target.closest('[data-help]');
  const pokerinno=e.target.closest('[data-pokerinno]');
  const pending=e.target.closest('[data-pending]');
  const series=e.target.closest('[data-series]');
  const auth=e.target.closest('[data-auth]');
  const language=e.target.closest('[data-language]');

  if(series)openDialog(series.dataset.series,'Este é um dos próximos caminhos da série StackUp Hold’em. Cada app tem sua própria proposta.');
  if(pokerinno)openPokerinno();
  if(help)openPokerinno();
  if(pending)openDialog(pending.dataset.pending,'Este espaço está pronto para receber os treinos. Assim que os desafios estiverem disponíveis, você poderá praticar por aqui.');
  if(auth)await invokeAuth(auth.dataset.auth);
  if(language){
    currentLanguage=language.dataset.language;
    app.querySelectorAll('[data-language]').forEach(btn=>btn.classList.toggle('active',btn===language));
    document.documentElement.lang=currentLanguage;
    try{storage.setItem('academy.language',currentLanguage)}catch{}
  }
  if(e.target.closest('[data-retry]')){
    state=await loadAcademy(window.StackUpAcademyAdapter);
    render();
  }
});

document.querySelector('.pokerinno-close').addEventListener('click',closePokerinno);
document.querySelector('[data-pokerinno-close]').addEventListener('click',closePokerinno);
document.querySelector('[data-pokerinno-replay]').addEventListener('click',()=>{
  if(pokerinnoVideo.classList.contains('ready')){
    pokerinnoVideo.currentTime=0;
    pokerinnoVideo.play().catch(()=>{});
    return;
  }
  const bubble=document.querySelector('.pokerinno-bubble');
  bubble.style.animation='none';
  requestAnimationFrame(()=>{
    bubble.style.animation='';
  });
});
pokerinnoDialog.addEventListener('close',()=>pokerinnoVideo.pause());
pokerinnoDialog.addEventListener('click',e=>{
  if(e.target!==pokerinnoDialog)return;
  const r=pokerinnoDialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePokerinno();
});

document.addEventListener('submit',async e=>{
  if(e.target.matches('[data-stackup-form]')){
    e.preventDefault();
    const fd=new FormData(e.target);
    await invokeAuth('stackup',{stackupId:String(fd.get('stackupId')||'').trim()});
  }
  if(e.target.matches('[data-create-account-form]')){
    e.preventDefault();
    const fd=new FormData(e.target);
    await invokeCreateAccount({email:String(fd.get('email')||'').trim()});
  }
});

document.addEventListener('change',e=>{
  if(['sound','reducedMotion'].includes(e.target.id)){
    preferences[e.target.id]=e.target.checked;
    const saved=savePreferences(storage,preferences);
    document.documentElement.classList.toggle('reduced-motion',preferences.reducedMotion);
    if(!saved)openDialog('Preferência aplicada','Seu navegador não permitiu salvar este ajuste. Ele permanece ativo durante esta visita.');
  }
});

window.addEventListener('hashchange',()=>{
  render();
  window.scrollTo({top:0,behavior:'instant'});
});

render();
