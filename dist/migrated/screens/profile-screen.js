(() => {
  const t=(k,f='')=>window.AcademyI18n?.t(k,f)||f||k;
  const C=()=>window.AcademyComponents;
  const esc=v=>window.AcademyDOM?.esc(v)||String(v??'');

  if(!document.getElementById('academy-profile-style')){
    const s=document.createElement('style');s.id='academy-profile-style';s.textContent=`
      .academy-profile{padding:0 16px calc(32px + env(safe-area-inset-bottom))!important}.academy-profile-head{height:176px;min-height:176px;max-height:176px;margin:0 -16px 16px!important;padding:20px 16px!important;display:block;overflow:hidden;box-sizing:border-box;border-bottom:1px solid var(--academy-line-strong)!important}.academy-profile-hero-grid{height:135px;display:grid;grid-template-rows:18px 18px 54px;row-gap:6px;align-content:end;width:100%;max-width:430px}.academy-profile-hero-grid .academy-kicker{margin:0;align-self:end}.academy-profile-hero-grid .academy-title{margin:0;align-self:end}.academy-profile-hero-grid .academy-copy{margin:0;align-self:start;max-width:430px;line-height:1.5;max-height:54px;overflow:hidden}
      .academy-profile-section{padding:20px 0 0}.academy-profile .academy-section-heading h2{font-size:15px!important}.academy-profile-list{display:grid;gap:9px;border-top:0!important}.academy-profile .academy-row{min-height:64px!important}.academy-profile .academy-lang-toggle button{border-radius:14px!important}.academy-profile .academy-lang-toggle button.active{background:linear-gradient(135deg,#ffd455,#f2aa25)!important;color:#171006!important}.academy-profile .academy-save-training-toggle{border-radius:14px!important;background:#092219!important}.academy-profile .academy-save-training-toggle.active{background:linear-gradient(135deg,#173e30,#0b281e)!important;color:#fff!important}.academy-save-training-toggle{width:100%;min-height:52px;display:flex;align-items:center;justify-content:flex-start;gap:12px;padding:12px 14px!important;border-color:var(--academy-card-border-color)!important;text-align:left;white-space:nowrap}.academy-save-training-toggle.active{background:var(--academy-ivory)!important;color:var(--academy-bg)!important;border-color:var(--academy-card-border-color)!important}.academy-save-training-check{width:22px;height:22px;flex:0 0 22px;display:grid;place-items:center;border:1px solid var(--academy-card-border-color);border-radius:6px}.academy-save-training-toggle.active .academy-save-training-check{background:var(--academy-bg);color:var(--academy-ivory)}.academy-profile-list{border-top:1px solid var(--academy-line)}
      .academy-plan-grid{display:grid;gap:12px}.academy-plan{padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-surface)}
      .academy-plan.current{border-color:var(--academy-card-border-color)}.academy-plan-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.academy-plan-price{margin-top:12px;display:flex;align-items:baseline;gap:6px}.academy-plan-benefits{display:grid;gap:6px;margin-top:12px;color:var(--academy-muted)}.academy-plan-benefits span{display:block}.academy-addon{margin-top:12px;padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-bg-2)}.academy-plan strong{font-size:12px}.academy-plan-top span,.academy-plan-price span{font-size:12px;letter-spacing:.08em;color:var(--academy-muted);text-transform:uppercase}.academy-plan-benefits span{font-size:12px;letter-spacing:0;color:var(--academy-muted);text-transform:none;font-weight:400}
      .academy-cross-sell{padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-bg-2)}
      .academy-cross-sell p{margin:6px 0 14px;color:var(--academy-muted);font-size:12px;line-height:1.45}
      .academy-apps-grid{display:grid;gap:12px}.academy-app-card{padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-bg-2);display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .academy-app-card strong,.academy-app-card span{display:block}.academy-app-card p{margin:5px 0 0;color:var(--academy-muted);font-size:12px;line-height:1.4}.academy-soon-tag{flex:0 0 auto;padding:5px 8px;border:1px solid var(--academy-card-border-color);border-radius:999px;color:var(--academy-ivory);font-size:12px;font-weight:600;text-transform:uppercase}
      .academy-lang-toggle{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.academy-lang-toggle button{min-width:0;padding-inline:8px}.academy-lang-toggle button.active{background:var(--academy-ivory);color:var(--academy-bg);border-color:var(--academy-card-border-color)}.academy-save-training-toggle{width:100%;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;justify-items:start;gap:10px;text-align:left}.academy-save-training-toggle.active{background:var(--academy-ivory);color:var(--academy-bg);border-color:var(--academy-card-border-color)}.academy-save-training-check{display:grid;place-items:center;width:22px;height:22px;border:1px solid var(--academy-card-border-color);border-radius:7px;font-size:12px;line-height:1}.academy-save-training-toggle.active .academy-save-training-check{border-color:currentColor}.academy-coach-box{padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-surface)}.academy-coach-box p{margin:0 0 12px;color:var(--academy-muted)}.academy-coach-box label{display:block;margin:0 0 6px;font-weight:600;text-transform:uppercase}.academy-coach-box input[type="tel"]{width:100%;min-height:44px;padding:10px 12px;margin-bottom:12px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-bg-2);color:var(--academy-ivory);font:400 12px 'Saira Semi Condensed',system-ui,sans-serif}.academy-coach-consent{display:flex!important;align-items:flex-start;gap:10px;margin:12px 0!important;text-transform:none!important;font-weight:400!important}.academy-coach-consent input{margin-top:2px}.academy-coach-box button{width:100%}.academy-privacy-actions{display:grid;gap:12px}.academy-privacy-actions button,.academy-privacy-actions a{width:100%;min-height:44px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none}
    `;document.head.appendChild(s);
  }

  const accessSection=()=>{
    const CC=C(),status=window.AuthService?.getStatus?.()||{authenticated:false,provider:null},user=window.AuthService?.getCurrentUser?.()||null;
    const meta=user?.user_metadata||{},name=meta.full_name||meta.name||user?.name||'',email=user?.email||'',provider=status.provider||meta.provider||'';
    const method=status.authenticated?(provider==='google'?'GOOGLE':provider==='biometric'?t('biometrics','BIOMETRIA'):String(provider||t('account','CONTA')).toUpperCase()):t('directAccess','ACESSO DIRETO');
    const rows=[
      CC.LessonRow({num:'01',title:t('accessMethod','FORMA DE ACESSO'),note:method})
    ];
    if(name)rows.push(CC.LessonRow({num:'02',title:t('name','NOME'),note:name}));
    if(email)rows.push(CC.LessonRow({num:String(rows.length+1).padStart(2,'0'),title:'E-MAIL',note:email}));
    if(status.authenticated)rows.push(CC.LessonRow({num:String(rows.length+1).padStart(2,'0'),title:t('session','SESSÃO'),note:t('connected','CONECTADA'),attrs:'data-profile-signout'}));
    else rows.push(CC.LessonRow({num:'02',title:t('session','SESSÃO'),note:t('directAccessCopy','O Academy está liberado sem login obrigatório durante os testes.')}));
    return '<section class="academy-profile-section" id="profile-access">'+CC.CourseSection({title:t('accessData','DADOS DE ACESSO'),content:'<div class="academy-profile-list">'+rows.join('')+'</div>'})+'</section>';
  };

  const COACH_KEY='academy.coach.v1';
  const readCoach=()=>{try{return JSON.parse(localStorage.getItem(COACH_KEY)||'{}')||{}}catch(_){return {}}};
  const coachSection=current=>{
    if(!['semiannual','annual'].includes(current))return '';
    const pref=readCoach(),number=esc(pref.number||''),checked=pref.optIn===true?'checked':'';
    return `<section class="academy-profile-section" id="profile-coach">${C().CourseSection({title:t('academyCoach','ACADEMY COACH'),content:`<div class="academy-coach-box"><p>${t('coachIncludedCopy','Seu plano inclui até 2 mensagens do Coach por semana, sem custo adicional.')}</p><label for="academy-coach-phone">${t('coachPhone','WHATSAPP COM CÓDIGO DO PAÍS')}</label><input id="academy-coach-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+55 11 91234-5678" value="${number}"><label class="academy-coach-consent"><input type="checkbox" data-coach-consent ${checked}><span>${t('coachConsent','Autorizo o Academy Coach a enviar até 2 mensagens por semana pelo WhatsApp.')}</span></label>${C().PrimaryButton(t('saveCoach','SALVAR CONFIGURAÇÃO'),'data-save-coach')}</div>`})}</section>`;
  };

  function render(focus=''){
    const root=document.getElementById('root');if(!root)return;
    const nav=document.getElementById('navtools');if(nav){nav.classList.add('show');nav.innerHTML='<button class="navbtn" id="backBtn" type="button"><span class="navicon">‹</span><span>VOLTAR</span></button><button class="navbtn" id="homeBtn" type="button"><span class="navicon">⌂</span><span>MENU PRINCIPAL</span></button>'};
    const CC=C(),plans=window.BillingService?.getPlans?.()||[],addons=window.BillingService?.getAddons?.()||[],current=window.BillingService?.getCurrentPlan?.()?.id||'free',lang=window.AcademyI18n?.lang?.()||'pt-BR',historyMode=window.TrainingPreferenceService?.getMode?.()||'auto';
    root.innerHTML=`<section class="screen academy-profile">
      <header class="academy-profile-head academy-section-intro photo" style="position:relative;background:linear-gradient(rgba(5,5,5,.52),rgba(5,5,5,.82)),url('${window.academyTheme?.backgrounds?.home||''}') center/cover no-repeat;filter:grayscale(1)"><div class="academy-profile-hero-grid" style="position:relative;z-index:1"><div class="academy-kicker">STACKUP HOLD'EM · ACADEMY</div><h1 class="academy-title">${t('profile','PERFIL')}</h1><p class="academy-copy">${t('profileCopy','Preferências, plano do Academy e acesso ao ecossistema.')}</p></div></header>
      ${accessSection()}
      <section class="academy-profile-section" id="profile-language">${CC.CourseSection({title:t('language','IDIOMA'),content:`<div class="academy-lang-toggle"><button type="button" class="academy-secondary ${lang==='pt-BR'?'active':''}" data-profile-lang="pt-BR">PT-BR</button><button type="button" class="academy-secondary ${lang==='en-US'?'active':''}" data-profile-lang="en-US">EN-US</button><button type="button" class="academy-secondary ${lang==='es-ES'?'active':''}" data-profile-lang="es-ES">ES-ES</button></div>`})}</section>
      <section class="academy-profile-section" id="profile-history-mode">${CC.CourseSection({title:t('historySaving','SALVAMENTO DOS TREINOS'),content:`<button type="button" class="academy-secondary academy-save-training-toggle ${historyMode==='auto'?'active':''}" data-history-toggle aria-pressed="${historyMode==='auto'?'true':'false'}"><span class="academy-save-training-check" aria-hidden="true">${historyMode==='auto'?'✓':''}</span><span>${t('saveTraining','SALVAR TREINOS')}</span></button><div class="academy-plan-benefits"><span>— ${historyMode==='auto'?t('autoSaveCopy','Treinos serão salvos automaticamente.'):t('noSaveCopy','Treinos não serão salvos.')}</span></div>`})}</section>
      <section class="academy-profile-section" id="profile-plans">${CC.CourseSection({title:t('plans','PLANOS'),content:`<div class="academy-plan-grid">${plans.map(p=>`<div class="academy-plan ${p.id===current?'current':''}"><div class="academy-plan-top"><strong>${esc(t(p.id,p.name))}</strong><span>${p.id===current?t('currentPlan','PLANO ATUAL'):t('prepared','DISPONÍVEL EM BREVE')}</span></div><div class="academy-plan-price"><strong>${esc(p.price||'')}</strong><span>${esc(p.period||'')}</span></div><div class="academy-plan-benefits">${(p.benefits||[]).map(b=>`<span>— ${esc(b)}</span>`).join('')}</div></div>`).join('')}</div>${addons.map(a=>`<div class="academy-addon"><div class="academy-plan-top"><strong>${esc(t(a.id,a.name))}</strong><span>${t('prepared','DISPONÍVEL EM BREVE')}</span></div><div class="academy-plan-price"><strong>${esc(a.price||'')}</strong><span>${esc(a.period||'')}</span></div><div class="academy-plan-benefits">${(a.benefits||[]).map(b=>`<span>— ${esc(b)}</span>`).join('')}</div></div>`).join('')}`})}</section>
      <section class="academy-profile-section" id="profile-apps">${CC.CourseSection({title:t('otherApps','OUTROS APPS'),content:`<div class="academy-apps-grid">${[
        ['GRINDER',t('grinderAppCopy',"Treinamento de No-Limit Hold'em")],
        ['HEROES',t('heroesAppCopy',"Aperfeiçoamento em No-Limit Hold'em")],
        ['REVOLUTION',t('revolutionAppCopy','Simulador de treino e jogo interativo de NLH')],
        ['WRAPS',t('wrapsAppCopy','Treinamento de Pot-Limit Omaha')],
        ['D ACTION',t('dActionAppCopy','Aperfeiçoamento em Pot-Limit Omaha')],
        ['ENDURANCE',t('enduranceAppCopy','Performance mental e gestão de sessão no poker')],
        ['ENTERPRISE',t('enterpriseAppCopy','Gestão para clubes e operações de poker')]
      ].map(([name,desc])=>`<div class="academy-app-card"><div><strong>${name}</strong><p>${desc}</p></div><span class="academy-soon-tag">${t('comingSoon','EM BREVE')}</span></div>`).join('')}</div>`})}</section>
      ${coachSection(current)}
      <section class="academy-profile-section" id="profile-privacy">${CC.CourseSection({title:t('aboutPrivacy','SOBRE E PRIVACIDADE'),content:`<div class="academy-privacy-actions"><a class="academy-secondary" href="./privacy.html#pt">${t('privacyPolicy','POLÍTICA DE PRIVACIDADE')}</a><button type="button" class="academy-secondary" data-profile-clear-local>${t('deleteLocalData','APAGAR DADOS DESTE APARELHO')}</button><button type="button" class="academy-secondary" data-profile-delete-account>${t('requestAccountDeletion','SOLICITAR EXCLUSÃO DA CONTA')}</button></div>`})}</section>
    </section>`;
    window.AnalyticsService?.screen?.('profile');
    if(focus){const id=focus==='plans'?'profile-plans':focus==='apps'?'profile-apps':focus==='history-mode'?'profile-history-mode':focus==='access'?'profile-access':'profile-language';setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}),80)}
  }
  function open(focus=''){
    history.pushState({type:'academy-profile',focus},'','#profile');
    render(focus);
  }
  window.AcademyScreens=window.AcademyScreens||{};window.AcademyScreens.profile=open;window.AcademyScreens.renderProfile=render;

  document.addEventListener('click',e=>{
    const save=e.target.closest('[data-save-coach]');
    if(save){
      e.preventDefault();
      const number=String(document.getElementById('academy-coach-phone')?.value||'').replace(/[\s()\-]/g,'');
      const optIn=!!document.querySelector('[data-coach-consent]')?.checked;
      if(!/^\+[1-9][0-9]{7,14}$/.test(number)){alert(t('coachInvalid','Informe um número válido com código do país.'));return}
      if(!optIn){alert(t('coachConsentRequired','Confirme a autorização para receber as mensagens do Coach.'));return}
      const pref={number,optIn:true,optInAt:new Date().toISOString(),frequency:'included_2_week'};
      try{localStorage.setItem(COACH_KEY,JSON.stringify(pref))}catch(_){}
      const sync=window.StackUpProductionAuth?.saveAcademyCoachPreference?.(pref);
      if(sync&&typeof sync.then==='function'){
        sync.then(r=>alert(r?.synced?t('coachSaved','Configuração do Academy Coach salva.'):t('coachSavedLocal','Configuração salva neste aparelho.')))
            .catch(err=>alert(err?.message||t('coachSaveError','Não foi possível sincronizar a configuração do Academy Coach.')));
      }else alert(t('coachSavedLocal','Configuração salva neste aparelho.'));
      return;
    }
    const hm=e.target.closest('[data-history-toggle]');
    if(hm){
      e.preventDefault();
      const mode=window.TrainingPreferenceService?.isEnabled?.()?'off':'auto';
      window.TrainingPreferenceService?.setMode?.(mode);
      render('history-mode');
      return;
    }
    const signout=e.target.closest('[data-profile-signout]');
    if(signout){e.preventDefault();Promise.resolve(window.AuthService?.signOut?.()).finally(()=>render('access'));return}
    const l=e.target.closest('[data-profile-lang]');if(l){const code=l.dataset.profileLang;try{localStorage.setItem('stackup-language-v1',code)}catch(_){};document.documentElement.lang=code;location.reload();return}
    const clear=e.target.closest('[data-profile-clear-local]');
    if(clear){
      e.preventDefault();
      if(!confirm(t('deleteLocalConfirm','Apagar progresso, histórico, preferências e sessão local deste Academy?')))return;
      const exact=new Set(['stackup-fundamentals-progress-v1','stackup-modalities-progress-v1','stackup-mixed-games-progress-v2','stackup-practice-progress-v1','stackup-practice-advanced-v2','stackup-language-v1','stackup-academy-weekly-v1','stackup-academy-last-route-v1','academy.hist.v1','academy.pref.v1','academy.plan.v1','academy.coach.v1','academy.smart-review.v1','academy.exam.last.v1','academy.events.v1']);
      try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&(exact.has(key)||key.startsWith('stackup-academy-')))localStorage.removeItem(key)}}catch(_){}
      alert(t('localDataDeleted','Dados locais do Academy apagados deste aparelho.'));location.reload();return;
    }
    const del=e.target.closest('[data-profile-delete-account]');
    if(del){
      e.preventDefault();
      const subject=encodeURIComponent(t('accountDeletionSubject','Excluir minha conta - Academy'));
      const body=encodeURIComponent(t('accountDeletionBody','Solicito a exclusão da minha conta e dos dados sincronizados do StackUp Hold\'em Academy.'));
      location.href='mailto:skyare.company@gmail.com?subject='+subject+'&body='+body;return;
    }
  });
  const old=window.onpopstate;
  window.onpopstate=e=>{if(e.state?.type==='academy-profile'){render(e.state.focus||'');return}old?.(e)};
})();