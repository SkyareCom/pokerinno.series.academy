import {loadAcademy,chapters} from './data.js';
import {resolveRoute} from './navigation.js';
import {readPreferences,savePreferences} from './preferences.js';
import {createTranslator,supportedLanguages} from './i18n.js';

let storage;
try{storage=localStorage}catch{storage={getItem:()=>null,setItem:()=>{throw Error()}}}
let preferences=readPreferences(storage);
let currentLanguage='pt-BR';
try{currentLanguage=storage.getItem('academy.language')||'pt-BR'}catch{}
if(!supportedLanguages.includes(currentLanguage))currentLanguage='pt-BR';
let t=createTranslator(currentLanguage);
document.documentElement.lang=currentLanguage;
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

const navItems=[
  ['home','home','home'],
  ['journey','menu_book','journey'],
  ['practice','school','practice'],
  ['evolution','casino','evolution'],
  ['profile','person','profile']
];

function navFor(mobile=false){
  return navItems.map(([key,symbol,label])=>[
    key,
    symbol,
    t(`nav.${label}${mobile?'M':''}`)
  ]);
}

const swipeRoutes=['home','journey','practice','evolution','profile'];
let swipeStartX=0;
let swipeStartY=0;
let swipeDeltaX=0;
let swipeLocked=false;
let swipeAnimating=false;
let swipeDirection=0;

const materialIcon=(name,extra='')=>`<span class="material-symbols-rounded ${extra}" aria-hidden="true">${name}</span>`;

const heading=(tag,title,description)=>`<div class="page-heading"><div><span class="eyebrow">${tag}</span><h1>${title}</h1><p>${description}</p></div></div>`;
const empty=(symbol,title,description)=>`<section class="empty"><div class="empty-symbol">${materialIcon(symbol)}</div><h2>${title}</h2><p>${description}</p><a href="#journey" class="primary">${t('common.exploreJourney')} <span>→</span></a></section>`;

function nextApps(){
  return `<section class="next-apps"><span class="eyebrow">${t('series.tag')}</span><h2>${t('series.title')}</h2><p>${t('series.desc')}</p><div class="next-grid">${[
    ['HEROES',t('series.heroes')],
    ['GRINDER EVO',t('series.grinder')],
    ['REVOLUTION',t('series.revolution')],
    ['D ACTION',t('series.daction')],
    ['WRAPS',t('series.wraps')],
    ['CHIPS UP',t('series.chips')]
  ].map(([name,desc])=>`<button class="next-app" data-series="${name}"><strong>${name}</strong><span>${desc}</span></button>`).join('')}</div></section>`;
}

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
  document.querySelector('#dialog-action').textContent=t('common.understood');
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
      <p>${t('login.intro')}</p>
    </div>
    <div class="language-switch" aria-label="${t('login.language')}">
      <button type="button" class="language ${currentLanguage==='pt-BR'?'active':''}" data-language="pt-BR">PR BR</button>
      <button type="button" class="language ${currentLanguage==='en-US'?'active':''}" data-language="en-US">EN US</button>
      <button type="button" class="language ${currentLanguage==='es-ES'?'active':''}" data-language="es-ES">ES ES</button>
    </div>
    <div class="login-card">
      <button type="button" class="login-option" data-auth="google"><strong>G</strong><span>${t('login.google')}</span><i>→</i></button>
      <button type="button" class="login-option" data-auth="biometric"><strong>◎</strong><span>${t('login.biometric')}</span><i>→</i></button>
      <div class="login-divider"><span>${t('login.or')}</span></div>
      <form data-stackup-form>
        <label for="stackup-id">STACKUP ID</label>
        <input id="stackup-id" name="stackupId" type="email" inputmode="email" autocomplete="email" placeholder="${t('login.emailPlaceholder')}" required>
        <button class="primary login-submit" type="submit">${t('login.stackup')} <span>→</span></button>
      </form>
    </div>
    <a class="create-account-link" href="#create-account">${t('login.create')} <span>→</span></a>
  </section>`;
}

function createAccount(){
  return `<section class="login-page">
    <a href="#login" class="back">← ${t('common.back')}</a>
    <div class="login-brand compact">
      <span class="eyebrow">STACKUP HOLD’EM</span>
      <h1>${t('login.createTitle')}</h1>
      <p>${t('login.createDesc')}</p>
    </div>
    <div class="login-card">
      <form data-create-account-form>
        <label for="new-email">E-MAIL</label>
        <input id="new-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="${t('login.emailPlaceholder')}" required>
        <button class="primary login-submit" type="submit">${t('common.continue')} <span>→</span></button>
      </form>
    </div>
  </section>`;
}

function home(){
  return `<section class="hero">
    <div class="hero-logo" aria-label="Pokerinno Academy"><span class="hero-logo-mark" aria-hidden="true">♠</span><span class="hero-logo-copy"><strong>POKERINNO</strong><span>ACADEMY</span></span></div>
    <img class="hero-image" src="assets/pokerinno-hero.webp" alt="Pokerinno recebe você em uma academia de poker iluminada em dourado">
    <div class="hero-copy">
      <h2>${t('home.hero')}</h2>
      <p>${t('home.quote')}</p>
      <small class="quote-author">— MIKE SEXTON</small>
      <a href="#journey" class="primary">${t('home.cta')} <span>→</span></a>
    </div>
    <div class="hero-note">${t('home.note')}</div>
  </section>
  <div class="section-top"><h2>${t('home.section')}</h2></div>
  <div class="grid">${[
    ['journey','menu_book',t('home.base'),t('home.baseDesc')],
    ['modalities','category',t('home.modalities'),t('home.modalitiesDesc')],
    ['practice','school',t('home.practice'),t('home.practiceDesc')],
    ['evolution','trending_up',t('home.evolution'),t('home.evolutionDesc')]
  ].map(([route,symbol,title,desc])=>`<a class="feature" href="#${route}"><span class="badge">${materialIcon(symbol)}</span><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>`;
}

async function invokeAuth(method,payload={}){
  const adapter=window.StackUpAuthAdapter;
  if(!adapter||typeof adapter.signIn!=='function'){
    openDialog(t('auth.integrationTitle'),t('auth.integrationBody'));
    return;
  }
  try{
    const result=await adapter.signIn(method,payload);
    if(result?.ok||result?.user){authenticated=true;location.hash='#home';return}
    openDialog(t('auth.signInError'),result?.message||t('auth.checkData'));
  }catch{
    openDialog(t('auth.signInError'),t('auth.serviceError'));
  }
}

async function invokeCreateAccount(payload={}){
  const adapter=window.StackUpAuthAdapter;
  if(!adapter||typeof adapter.createAccount!=='function'){
    openDialog(t('auth.accountIntegrationTitle'),t('auth.accountIntegrationBody'));
    return;
  }
  try{
    const result=await adapter.createAccount(payload);
    if(result?.ok){
      openDialog(t('auth.accountCreated'),t('auth.accountCreatedBody'));
      location.hash='#login';
      return;
    }
    openDialog(t('auth.accountError'),result?.message||t('auth.checkData'));
  }catch{
    openDialog(t('auth.accountError'),t('auth.accountServiceError'));
  }
}

function applyStaticTranslations(){
  document.title=t('common.pageTitle');
  const description=document.querySelector('meta[name="description"]');
  if(description)description.setAttribute('content',t('common.pageDescription'));
  const breadcrumb=document.querySelector('.breadcrumb');
  if(breadcrumb)breadcrumb.textContent=t('common.breadcrumb');
  const profileLink=document.querySelector('a.avatar[href="#profile"]');
  if(profileLink)profileLink.setAttribute('aria-label',t('common.profileLabel'));
  const companion=document.querySelector('#dialog .eyebrow');
  if(companion)companion.textContent=t('common.companion');
}

function render(){
  applyStaticTranslations();
  const route=resolveRoute(location.hash);
  if(!authenticated&&route!=='login'&&route!=='create-account'){
    location.hash='#login';
    return;
  }
  const active=route.startsWith('chapter')?'journey':route;
  const authRoute=route==='login'||route==='create-account';
  document.body.classList.toggle('auth-route',authRoute);

  for(const id of ['navigation','mobile-navigation']){
    const items=navFor(id==='mobile-navigation');
    document.getElementById(id).innerHTML=items.map(([key,symbol,title])=>`<a class="${id==='navigation'?'nav-link ':''}${active===key?'active':''}" ${active===key?'aria-current="page"':''} href="#${key}"><span class="nav-symbol material-symbols-rounded" aria-hidden="true">${symbol}</span>${title}</a>`).join('');
  }

  document.documentElement.classList.toggle('reduced-motion',preferences.reducedMotion);

  if(route==='login'){app.innerHTML=login();return}
  if(route==='create-account'){app.innerHTML=createAccount();return}

  if(state.status==='error'){
    app.innerHTML=heading(t('system.loadTag'),t('system.loadTitle'),t('system.loadDesc'))+
      `<section class="empty"><h2>${t('system.loadError')}</h2><p>${t('system.loadErrorDesc')}</p><button class="primary" data-retry>${t('system.retry')} →</button></section>`;
    return;
  }

  if(route==='home')app.innerHTML=home();
  else if(route==='journey')app.innerHTML=heading(t('journey.tag'),t('journey.title'),t('journey.desc'))+
    `<div class="list">${chapters.map(c=>`<a class="chapter" href="#chapter/${c.id}"><span class="number">0${c.order}</span><div><h3>${t(`chapters.${c.id}.title`)}</h3><p>${t(`chapters.${c.id}.description`)}</p></div></a>`).join('')}</div>`;
  else if(route.startsWith('chapter/')){
    const c=chapters.find(c=>c.id===route.split('/')[1]);
    app.innerHTML=`<div class="chapter-back-row"><a href="#journey" class="back">${t('common.backJourney')}</a></div>`+
      heading(`${t('journey.chapterTag')} 0${c.order}`,t(`chapters.${c.id}.title`),t(`chapters.${c.id}.description`))+
      empty('menu_book',t('journey.pendingTitle'),t('journey.pendingDesc'));
  }
  else if(route==='modalities')app.innerHTML=heading(t('modalities.tag'),t('modalities.title'),t('modalities.desc'))+
    empty('category',t('modalities.pendingTitle'),t('modalities.pendingDesc'));
  else if(route==='practice')app.innerHTML=heading(t('practice.tag'),t('practice.title'),t('practice.desc'))+
    `<div class="grid">${[
      ['timer',t('practice.quick'),t('practice.quickDesc')],
      ['tune',t('practice.custom'),t('practice.customDesc')],
      ['military_tech',t('practice.challenges'),t('practice.challengesDesc')],
      ['playing_cards',t('practice.review'),t('practice.reviewDesc')]
    ].map(([s,title,d])=>`<button class="feature" data-pending="${title}"><span class="badge">${materialIcon(s)}</span><h3>${title}</h3><p>${d}</p></button>`).join('')}</div>`+
    empty('playing_cards',t('practice.pendingTitle'),t('practice.pendingDesc'));
  else if(route==='evolution')app.innerHTML=heading(t('evolution.tag'),t('evolution.title'),t('evolution.desc'))+
    empty('trending_up',t('evolution.pendingTitle'),t('evolution.pendingDesc'));
  else if(route==='profile')app.innerHTML=heading(t('profile.tag'),t('profile.title'),t('profile.desc'))+
    `<section class="empty"><div class="empty-symbol">${materialIcon('person')}</div><h2>${t('profile.hello')}</h2><p>${t('profile.connect')}</p><a class="primary" href="#login">${t('profile.account')} →</a></section>
    <div class="setting"><div><h3>${t('profile.sounds')}</h3><p>${t('profile.soundsDesc')}</p></div><input type="checkbox" id="sound" aria-label="${t('profile.sounds')}" ${preferences.sound?'checked':''}></div>
    <div class="setting"><div><h3>${t('profile.motion')}</h3><p>${t('profile.motionDesc')}</p></div><input type="checkbox" id="reducedMotion" aria-label="${t('profile.motion')}" ${preferences.reducedMotion?'checked':''}></div>
    <div class="setting"><div><h3>${t('profile.privacy')}</h3><p>${t('profile.privacyDesc')}</p></div><a class="quiet" href="#login">${t('profile.consult')} →</a></div>`+nextApps();
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

  if(series)openDialog(series.dataset.series,t('system.seriesBody'));
  if(pokerinno)openPokerinno();
  if(help)openPokerinno();
  if(pending)openDialog(pending.dataset.pending,t('system.pendingBody'));
  if(auth)await invokeAuth(auth.dataset.auth);
  if(language){
    currentLanguage=language.dataset.language;
    t=createTranslator(currentLanguage);
    document.documentElement.lang=currentLanguage;
    try{storage.setItem('academy.language',currentLanguage)}catch{}
    render();
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
    if(!saved)openDialog(t('system.prefTitle'),t('system.prefBody'));
  }
});

function resetSwipePosition(){
  app.style.transition='transform .22s ease, opacity .22s ease';
  app.style.transform='translateX(0)';
  app.style.opacity='1';
  setTimeout(()=>{
    app.style.transition='';
    app.style.transform='';
    app.style.opacity='';
    swipeAnimating=false;
  },230);
}

function navigateBySwipe(direction){
  const route=resolveRoute(location.hash);
  const index=swipeRoutes.indexOf(route);
  if(index<0)return resetSwipePosition();

  const nextIndex=index+direction;
  if(nextIndex<0||nextIndex>=swipeRoutes.length)return resetSwipePosition();

  swipeAnimating=true;
  swipeDirection=direction;
  app.style.transition='transform .16s ease, opacity .16s ease';
  app.style.transform=`translateX(${direction>0?'-24%':'24%'})`;
  app.style.opacity='.35';

  setTimeout(()=>{
    location.hash='#'+swipeRoutes[nextIndex];
  },165);
}

app.addEventListener('touchstart',e=>{
  if(swipeAnimating||e.touches.length!==1)return;
  const route=resolveRoute(location.hash);
  if(!swipeRoutes.includes(route))return;

  swipeStartX=e.touches[0].clientX;
  swipeStartY=e.touches[0].clientY;
  swipeDeltaX=0;
  swipeLocked=false;
  app.style.transition='none';
},{passive:true});

app.addEventListener('touchmove',e=>{
  if(swipeAnimating||e.touches.length!==1)return;
  const route=resolveRoute(location.hash);
  if(!swipeRoutes.includes(route))return;

  const dx=e.touches[0].clientX-swipeStartX;
  const dy=e.touches[0].clientY-swipeStartY;

  if(!swipeLocked){
    if(Math.abs(dx)<12&&Math.abs(dy)<12)return;
    if(Math.abs(dy)>=Math.abs(dx)){
      swipeDeltaX=0;
      return;
    }
    swipeLocked=true;
  }

  if(!swipeLocked)return;
  e.preventDefault();
  swipeDeltaX=dx;
  const resisted=dx*.82;
  app.style.transform=`translateX(${resisted}px)`;
  app.style.opacity=String(Math.max(.72,1-Math.abs(dx)/900));
},{passive:false});

app.addEventListener('touchend',()=>{
  if(!swipeLocked||swipeAnimating)return;
  const threshold=Math.min(90,window.innerWidth*.18);

  if(Math.abs(swipeDeltaX)>=threshold){
    navigateBySwipe(swipeDeltaX<0?1:-1);
  }else{
    resetSwipePosition();
  }

  swipeLocked=false;
  swipeDeltaX=0;
},{passive:true});

window.addEventListener('hashchange',()=>{
  render();
  window.scrollTo({top:0,behavior:'instant'});

  if(swipeAnimating){
    app.style.transition='none';
    app.style.transform=`translateX(${swipeDirection>0?'18%':'-18%'})`;
    app.style.opacity='.55';
    requestAnimationFrame(()=>requestAnimationFrame(resetSwipePosition));
  }
});

render();
