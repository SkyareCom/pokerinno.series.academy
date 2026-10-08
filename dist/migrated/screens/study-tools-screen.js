(() => {
  const t=(k,f='')=>window.AcademyI18n?.t(k,f)||f||k;
  const C=()=>window.AcademyComponents;
  const esc=v=>window.AcademyDOM?.esc(v)||String(v??'');
  let exam=null,timerId=0,reviewSession=null,historySession=null;
  const REVIEW_KEY='academy.smart-review.v1';
  const safeParse=(raw,fallback={})=>{try{return JSON.parse(raw||'')||fallback}catch(_){return fallback}};
  const readLocal=key=>{try{return safeParse(localStorage.getItem(key),{})}catch(_){return {}}};

  if(!document.getElementById('academy-study-tools-style')){
    const s=document.createElement('style');s.id='academy-study-tools-style';
    s.textContent='.academy-study-grid{display:grid;gap:12px}.academy-study-card{padding:16px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-md);background:var(--academy-surface);text-align:left}.academy-study-card strong,.academy-study-card span{display:block}.academy-study-card span{margin-top:5px;color:var(--academy-muted)}.academy-study-card button{width:100%;margin-top:14px}.academy-skill-row{padding:14px 0;border-bottom:1px solid var(--academy-line)}.academy-skill-row:first-child{border-top:1px solid var(--academy-line)}.academy-skill-head{display:flex;justify-content:space-between;gap:12px}.academy-skill-row small{display:block;margin-top:4px;color:var(--academy-muted)}.academy-certificate{padding:20px;border:1px solid var(--academy-card-border-color);border-radius:var(--academy-radius-lg);background:var(--academy-surface);text-align:center}.academy-certificate strong,.academy-certificate span{display:block}.academy-certificate span{margin-top:8px;color:var(--academy-muted)}.academy-exam-meta{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--academy-line)}.academy-exam-question{padding:20px 0}.academy-exam-question p{margin:0 0 14px;color:var(--academy-ivory);line-height:1.5}.academy-exam-options{display:grid;gap:10px}.academy-exam-options button{width:100%;text-align:left}.academy-exam-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--academy-line);border:1px solid var(--academy-card-border-color);margin-bottom:20px}.academy-exam-summary div{padding:14px 6px;background:var(--academy-bg-2);text-align:center}.academy-exam-summary b,.academy-exam-summary span{display:block}.academy-exam-summary span{margin-top:4px;color:var(--academy-muted);text-transform:uppercase}.academy-xp-timeline{margin-top:20px;border-top:1px solid var(--academy-line)}.academy-xp-day{display:grid;grid-template-columns:72px 1fr auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--academy-line)}.academy-xp-day span{color:var(--academy-muted)}';
    document.head.appendChild(s);
  }

  const stageName=k=>({fundamentals:'BASE',modalities:'MODALIDADES',practice:'PRÁTICA',quiz:'QUIZ',math:'MATEMÁTICA DO POKER',sim:'SIMULADOR'}[k]||String(k||'').toUpperCase());
  const stageKey=k=>({fundamentals:'fundamentos',modalities:'modalidades',practice:'pratica',quiz:'pratica',math:'pratica',sim:'pratica'}[k]||'pratica');

  const loadBankScript=(name,version,test)=>{
    if(test())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const key='academy-bank-'+name.replace(/[^a-z0-9]/gi,'-');
      const existing=document.querySelector('script[data-bank-key="'+key+'"]');
      if(existing){
        if(test())return resolve();
        existing.addEventListener('load',()=>test()?resolve():reject(new Error('Banco não exposto: '+name)),{once:true});
        existing.addEventListener('error',reject,{once:true});
        return;
      }
      const s=document.createElement('script');s.dataset.bankKey=key;s.src='./'+name+'?v='+version;s.async=false;
      s.onload=()=>test()?resolve():reject(new Error('Banco não exposto: '+name));
      s.onerror=()=>reject(new Error('Não foi possível carregar '+name+'.'));
      document.body.appendChild(s);
    });
  };
  async function ensureStudyBanks(){
    await loadBankScript('fundamentals-interactive-bank.js',1,()=>!!window.StackupFundamentalsSpotBank);
    await loadBankScript('modalities-module.js',7,()=>!!window.StackupModalitiesSpotBank);
    await loadBankScript('mixed-games-module.js',8,()=>!!window.StackupMixedGamesSpotBank);
    await loadBankScript('practice-advanced-bank.js',2,()=>!!window.StackupPracticeAdvancedBank);
  }
  const normalizeQuestion=(q,source,skill)=>{
    if(!q||!Array.isArray(q.options)||q.options.length<2||Array.isArray(q.answer))return null;
    return {
      id:source+':'+String(q.id||Math.random()),
      question:q.question||q.prompt||'',
      options:[...q.options],
      answer:q.answer,
      analysis:q.analysis||q.why||'',
      source,skill
    };
  };
  async function generalQuestionBank(){
    await ensureStudyBanks();
    const out=[];
    Object.entries(window.StackupFundamentalsSpotBank||{}).forEach(([chapter,rows])=>{
      (rows||[]).forEach(q=>{const n=normalizeQuestion(q,'BASE',chapter);if(n)out.push(n)});
    });
    Object.entries(window.StackupModalitiesSpotBank||{}).forEach(([game,rows])=>{
      (rows||[]).forEach(q=>{const n=normalizeQuestion(q,'MODALIDADES',game);if(n)out.push(n)});
    });
    (window.StackupMixedGamesSpotBank||[]).forEach(q=>{const n=normalizeQuestion(q,'MIXED','MIXED GAMES');if(n)out.push(n)});
    const adv=window.StackupPracticeAdvancedBank||{};
    (adv.sim||[]).forEach(q=>{
      const enriched={...q,question:(q.context?String(q.context).trim()+' ':'')+String(q.question||''),analysis:q.analysis||q.why||''};
      const n=normalizeQuestion(enriched,'SIM',[q.game,q.kind].filter(Boolean).join(' · ')||'SIMULADOR');if(n)out.push(n);
    });
    (adv.quiz||[]).forEach(q=>{const n=normalizeQuestion(q,'QUIZ',q.topic||'QUIZ');if(n)out.push(n)});
    (adv.math||[]).forEach(q=>{const n=normalizeQuestion(q,'MATEMÁTICA',q.topic||'MATEMÁTICA');if(n)out.push(n)});
    const seen=new Set();
    return out.filter(q=>q.question&&q.answer!=null&&!seen.has(q.id)&&(seen.add(q.id),true));
  }
  const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  const wrongQuestionIds=()=>{
    const ids=new Set();
    const f=readLocal('stackup-fundamentals-progress-v1');
    Object.values(f||{}).forEach(section=>Object.entries(section?.answers||{}).forEach(([id,a])=>{if(a?.correct===false)ids.add('BASE:'+id)}));
    const m=readLocal('stackup-modalities-progress-v1');
    Object.values(m||{}).forEach(section=>Object.entries(section?.answers||{}).forEach(([id,a])=>{if(a?.correct===false)ids.add('MODALIDADES:'+id)}));
    const mixed=readLocal('stackup-mixed-games-progress-v2');
    Object.entries(mixed?.answers||{}).forEach(([id,a])=>{if(a?.correct===false)ids.add('MIXED:'+id)});
    const adv=readLocal('stackup-practice-advanced-v2');
    for(const [mode,source] of [['quiz','QUIZ'],['math','MATEMÁTICA']]){
      Object.entries(adv?.[mode]?.results||{}).forEach(([id,ok])=>{if(ok===false)ids.add(source+':'+id)});
    }
    return ids;
  };
  const REVIEW_INTERVAL_DAYS=[0,1,2,4,8,16];
  const reviewStore=()=>readLocal(REVIEW_KEY);
  const reviewBox=rec=>{
    let box=0;
    for(const a of (Array.isArray(rec?.attempts)?rec.attempts:[]))box=a?.correct?Math.min(box+1,REVIEW_INTERVAL_DAYS.length-1):0;
    return box;
  };
  const saveReviewResult=(q,correct)=>{
    const store=reviewStore(),now=Date.now(),day=86400000,rec=store[q.id]||{attempts:[]};
    rec.source=q.source;rec.skill=q.skill;rec.attempts=Array.isArray(rec.attempts)?rec.attempts:[];
    rec.attempts.push({at:now,correct:!!correct});rec.attempts=rec.attempts.slice(-20);
    rec.lastAt=now;rec.lastCorrect=!!correct;rec.box=reviewBox(rec);
    rec.dueAt=now+REVIEW_INTERVAL_DAYS[rec.box]*day;
    store[q.id]=rec;try{localStorage.setItem(REVIEW_KEY,JSON.stringify(store))}catch(_){}
  };
  const boxFromAttempts=rows=>{
    let box=0;
    for(const a of (Array.isArray(rows)?rows:[]).slice().sort((x,y)=>Number(x.at||0)-Number(y.at||0))){
      box=a?.correct?Math.min(box+1,REVIEW_INTERVAL_DAYS.length-1):0;
    }
    return box;
  };
  const reviewCandidates=bank=>{
    const attempts=storedAttempts(),now=Date.now(),day=86400000,maxBox=REVIEW_INTERVAL_DAYS.length-1;
    return bank.map(q=>{
      const rows=(attempts[q.id]||[]).slice().sort((a,b)=>Number(a.at||0)-Number(b.at||0));
      if(!rows.length)return null;
      const last=rows[rows.length-1],box=boxFromAttempts(rows);
      if(box>=maxBox&&last.correct)return null;
      const due=Number(last.at||0)+REVIEW_INTERVAL_DAYS[Math.min(box,maxBox)]*day;
      return due<=now?{...q,_reviewBox:box,_reviewDue:due}:null;
    }).filter(Boolean).sort((a,b)=>a._reviewBox-b._reviewBox||a._reviewDue-b._reviewDue);
  };


  const storedAttempts=()=>{
    const out={};
    const add=(id,correct,at=0)=>{
      if(!id)return;(out[id]=out[id]||[]).push({correct:!!correct,at:Number(at||0)});
    };
    const addFallback=(id,correct,at=0)=>{if(!out[id]?.length)add(id,correct,at)};
    const historyRuns=window.TrainingHistoryService?.list?.({limit:250})||[];
    historyRuns.slice().reverse().forEach(run=>{
      for(const [id,rows] of Object.entries(run?.questionAttempts||{})){
        for(const a of (Array.isArray(rows)?rows:[]))add(id,a?.correct===true,a?.at||run.updatedAt);
      }
    });
    const fundamentals=readLocal('stackup-fundamentals-progress-v1');
    Object.values(fundamentals||{}).forEach(section=>Object.entries(section?.answers||{}).forEach(([id,a])=>addFallback('BASE:'+id,a?.correct===true,a?.updatedAt)));
    const modalities=readLocal('stackup-modalities-progress-v1');
    Object.values(modalities||{}).forEach(section=>Object.entries(section?.answers||{}).forEach(([id,a])=>addFallback('MODALIDADES:'+id,a?.correct===true,a?.updatedAt)));
    const mixed=readLocal('stackup-mixed-games-progress-v2');
    Object.entries(mixed?.answers||{}).forEach(([id,a])=>addFallback('MIXED:'+id,a?.correct===true,a?.updatedAt));
    const advanced=readLocal('stackup-practice-advanced-v2');
    for(const [mode,source] of [['sim','SIM'],['quiz','QUIZ'],['math','MATEMÁTICA']]){
      Object.entries(advanced?.[mode]?.results||{}).forEach(([id,a])=>addFallback(source+':'+id,a?.correct===true||a===true,0));
    }
    const review=reviewStore();
    for(const [id,rec] of Object.entries(review||{}))for(const a of (rec?.attempts||[]))add(id,a?.correct===true,a?.at);
    for(const rows of Object.values(out))rows.sort((a,b)=>Number(a.at||0)-Number(b.at||0));
    return out;
  };
  const competencyReport=bank=>{
    const attempts=storedAttempts(),byId=new Map(bank.map(q=>[q.id,q])),groups={};
    for(const [id,rows] of Object.entries(attempts)){
      const q=byId.get(id);if(!q)continue;
      const key=String(q.skill||q.source||'GERAL'),g=groups[key]||(groups[key]={skill:key,source:q.source,questions:{},attempts:[]});
      g.questions[id]=g.questions[id]||[];
      rows.forEach(a=>{g.questions[id].push(a);g.attempts.push(a)});
    }
    const result=[];
    for(const g of Object.values(groups)){
      const att=g.attempts.slice().sort((a,b)=>Number(b.at||0)-Number(a.at||0));
      const n=att.length;if(!n)continue;
      let weight=0,weightedCorrect=0;
      att.forEach((a,i)=>{const w=Math.pow(.85,i);weight+=w;if(a.correct)weightedCorrect+=w});
      const weightedAccuracy=Math.round(((weightedCorrect+1)/(weight+2))*100);
      const correct=att.filter(a=>a.correct).length,accuracy=Math.round(correct/n*100);
      const persistentErrors=Object.values(g.questions).filter(rows=>rows.length&&!rows[rows.length-1].correct).length;
      const repeatedErrors=Object.values(g.questions).filter(rows=>rows.filter(a=>!a.correct).length>=2).length;
      const chronological=att.slice().reverse();let trend=0;
      if(chronological.length>=6){
        const half=Math.floor(chronological.length/2),first=chronological.slice(0,half),last=chronological.slice(half);
        const p1=first.filter(a=>a.correct).length/first.length,p2=last.filter(a=>a.correct).length/last.length;
        trend=Math.round((p2-p1)*100);
      }
      const score=(1-weightedAccuracy/100)*(1+.5*Math.min(persistentErrors,5))*(1+.3*Math.min(repeatedErrors,5))*Math.min(1,n/3)*(trend<-15?1.25:1);
      result.push({...g,n,correct,accuracy,weightedAccuracy,persistentErrors,repeatedErrors,trend,score});
    }
    return result.sort((a,b)=>b.score-a.score||a.weightedAccuracy-b.weightedAccuracy);
  };
  async function startCompetencyReview(skill){
    shell(t('smartReview','REVISÃO INTELIGENTE'),t('reviewPreparing','Preparando reforço direcionado...'),'<div class="academy-state">'+t('loading','CARREGANDO...')+'</div>');
    try{
      const bank=await generalQuestionBank(),wrong=wrongQuestionIds(),store=reviewStore();
      const pool=bank.filter(q=>String(q.skill||q.source)===String(skill));
      const ordered=[
        ...pool.filter(q=>wrong.has(q.id)),
        ...pool.filter(q=>!wrong.has(q.id)&&!store[q.id]),
        ...pool.filter(q=>!wrong.has(q.id)&&store[q.id]).sort((a,b)=>Number(store[a.id]?.lastAt||0)-Number(store[b.id]?.lastAt||0))
      ];
      const seen=new Set(),questions=ordered.filter(q=>!seen.has(q.id)&&(seen.add(q.id),true)).slice(0,10);
      if(!questions.length)throw new Error(t('noCompetencyQuestions','Não há questões disponíveis para esta competência.'));
      reviewSession={questions,index:0,correct:0,answered:0,feedback:null,skill:String(skill)};
      window.AnalyticsService?.track?.('competency_review_started',{skill:String(skill),questions:questions.length});
      renderReviewQuestion();
    }catch(error){shell(t('smartReview','REVISÃO INTELIGENTE'),'',C().ErrorState(error?.message||t('reviewLoadError','Não foi possível preparar a revisão.')))}
  }

  function shell(title,description,body){
    const root=document.getElementById('root');if(!root)return;
    const nav=document.getElementById('navtools');if(nav){nav.classList.add('show');nav.innerHTML='<button class="navbtn" id="backBtn" type="button"><span class="navicon">‹</span><span>VOLTAR</span></button><button class="navbtn" id="homeBtn" type="button"><span class="navicon">⌂</span><span>MENU PRINCIPAL</span></button>'};
    root.innerHTML='<section class="screen academy-stage-screen"><header class="academy-stage-intro"><div class="academy-stage-hero-grid"><div class="academy-kicker">'+t('advancedStudy','ESTUDO AVANÇADO')+'</div><h1 class="academy-title">'+esc(title)+'</h1><p class="academy-copy">'+esc(description)+'</p></div></header><section class="academy-group">'+body+'</section></section>';
  }

  function renderHub(){
    const body='<div class="academy-study-grid">'+
      card('smartReview','REVISÃO INTELIGENTE','Priorize as competências com menor aproveitamento.')+
      card('timedExam','SIMULADO CRONOMETRADO','20 questões sorteadas · 12 minutos.')+
      card('certificates','CERTIFICADOS','Critério: 80% da seção respondida com 80% de acertos.')+
      card('skillReport','RELATÓRIO POR COMPETÊNCIA','Compare as competências já treinadas, da mais fraca à mais forte.')+
    '</div>';
    shell(t('advancedStudy','ESTUDO AVANÇADO'),t('advancedStudyCopy','Use seus dados de treino para direcionar a próxima etapa.'),body);
  }
  function card(kind,title,description){
    return '<div class="academy-study-card"><strong>'+t(kind,title)+'</strong><span>'+description+'</span>'+C().SecondaryButton(t('open','ABRIR'),'data-study-kind="'+kind+'"')+'</div>';
  }

  function reviewSummary(){
    const attempts=storedAttempts(),now=Date.now(),day=86400000,maxBox=REVIEW_INTERVAL_DAYS.length-1;
    let due=0,wrong=0,mastered=0,tracked=0;
    for(const rowsRaw of Object.values(attempts)){
      const rows=(rowsRaw||[]).slice().sort((a,b)=>Number(a.at||0)-Number(b.at||0));
      if(!rows.length)continue;tracked++;
      const last=rows[rows.length-1],box=boxFromAttempts(rows);
      if(!last.correct)wrong++;
      if(box>=maxBox&&last.correct){mastered++;continue}
      const at=Number(last.at||0)+REVIEW_INTERVAL_DAYS[Math.min(box,maxBox)]*day;
      if(at<=now)due++;
    }
    const E=window.EvolutionService?.snapshot?.()||{weakest:[]};
    const weak=E.weakest?.[0]||null;
    return {due,wrong,mastered,tracked,weakest:weak?{key:weak.key,accuracy:weak.accuracy,answered:weak.answered}:null};
  }

  async function renderReview(){
    shell(t('smartReview','REVISÃO INTELIGENTE'),t('smartReviewCopy','As questões erradas retornam em ciclos de reforço.'),'<div class="academy-state">'+t('loading','CARREGANDO...')+'</div>');
    try{
      const bank=await generalQuestionBank(),due=reviewCandidates(bank);
      if(!due.length){
        const E=window.EvolutionService?.snapshot?.()||{weakest:[]};
        const rows=E.weakest.length?E.weakest.map(s=>'<div class="academy-skill-row"><div class="academy-skill-head"><strong>'+stageName(s.key)+'</strong><b>'+s.accuracy+'%</b></div><small>'+s.correct+'/'+s.answered+' '+t('correct','acertos').toLowerCase()+' · '+s.xp+' XP</small>'+C().SecondaryButton(t('studyNow','ESTUDAR AGORA'),'data-review-stage="'+stageKey(s.key)+'"')+'</div>').join(''):'<div class="academy-state">'+t('reviewEmpty','Nenhuma revisão pendente. Continue treinando para gerar novas recomendações.')+'</div>';
        shell(t('smartReview','REVISÃO INTELIGENTE'),t('reviewClear','Nenhuma questão errada está pendente para revisão agora.'),rows);
        return;
      }
      reviewSession={questions:shuffle(due).slice(0,10),index:0,correct:0,answered:0,feedback:null};
      renderReviewQuestion();
    }catch(error){shell(t('smartReview','REVISÃO INTELIGENTE'),'',C().ErrorState(error?.message||t('reviewLoadError','Não foi possível preparar a revisão.')))}
  }
  function renderReviewQuestion(){
    if(!reviewSession)return renderReview();
    if(reviewSession.index>=reviewSession.questions.length){
      const total=reviewSession.questions.length,correct=reviewSession.correct;
      const body='<div class="academy-exam-summary"><div><b>'+total+'</b><span>'+t('reviewed','REVISADAS')+'</span></div><div><b>'+correct+'</b><span>'+t('correct','ACERTOS')+'</span></div><div><b>'+(total?Math.round(correct/total*100):0)+'%</b><span>'+t('accuracy','APROVEITAMENTO')+'</span></div></div>'+C().SecondaryButton(t('reviewAgain','REVISAR NOVAMENTE'),'data-study-kind="smartReview"');
      shell(t('reviewResult','RESULTADO DA REVISÃO'),t('reviewSchedule','Acertos voltam em 7 dias; erros voltam a partir de amanhã.'),body);
      return;
    }
    const q=reviewSession.questions[reviewSession.index],feedback=reviewSession.feedback;
    const options=(q.options||[]).map(o=>{
      const encoded=encodeURIComponent(o),disabled=feedback?'disabled':'';
      let extra='';
      if(feedback){if(o===q.answer)extra=' data-review-correct="1"';else if(o===feedback.selected)extra=' data-review-wrong="1"'}
      return '<button type="button" class="academy-secondary" data-review-answer="'+encoded+'" '+disabled+extra+'>'+esc(o)+'</button>';
    }).join('');
    const note=feedback?'<div class="academy-study-card"><strong>'+(feedback.correct?t('correct','ACERTO'):t('review','REVISAR'))+'</strong><span>'+esc(q.analysis||'')+'</span></div>':'';
    const next=feedback?C().PrimaryButton(reviewSession.index===reviewSession.questions.length-1?t('finish','FINALIZAR'):t('next','PRÓXIMO'),'data-review-next'):'';
    const body='<div class="academy-exam-meta"><strong>'+String(reviewSession.index+1).padStart(2,'0')+' / '+reviewSession.questions.length+'</strong><strong>'+esc(q.skill||q.source)+'</strong></div><div class="academy-exam-question"><p>'+esc(q.question)+'</p><div class="academy-exam-options">'+options+'</div></div>'+note+next;
    shell(t('smartReview','REVISÃO INTELIGENTE'),t('reviewQuestionCopy','Reforce apenas questões que já apresentaram erro.'),body);
  }
  function answerReview(value){
    if(!reviewSession||reviewSession.feedback)return;
    const q=reviewSession.questions[reviewSession.index];if(!q)return;
    const correct=value===q.answer;reviewSession.answered++;if(correct)reviewSession.correct++;
    saveReviewResult(q,correct);reviewSession.feedback={selected:value,correct};renderReviewQuestion();
  }
  function nextReview(){
    if(!reviewSession?.feedback)return;
    reviewSession.index++;reviewSession.feedback=null;renderReviewQuestion();
  }

  async function startHistoryRetrain(run){
    if(!run)return false;
    shell(t('retrainSession','REFAZER SESSÃO'),esc(run.label||t('history','HISTÓRICO')),'<div class="academy-state">'+t('loading','CARREGANDO...')+'</div>');
    try{
      const bank=await generalQuestionBank(),byId=new Map(bank.map(q=>[q.id,q]));
      const questions=(run.questionIds||[]).map(id=>byId.get(id)).filter(Boolean);
      if(!questions.length)return false;
      historySession={runId:run.id,label:run.label||'',questions,index:0,correct:0,feedback:null};
      window.AnalyticsService?.track?.('history_retrain_started',{run_id:run.id,questions:questions.length});
      renderHistoryRetrainQuestion();
      return true;
    }catch(error){
      shell(t('retrainSession','REFAZER SESSÃO'),'',C().ErrorState(error?.message||t('sessionReplayError','Não foi possível reconstruir esta sessão.')));
      return false;
    }
  }
  function renderHistoryRetrainQuestion(){
    if(!historySession)return;
    if(historySession.index>=historySession.questions.length){
      const total=historySession.questions.length,correct=historySession.correct;
      const body='<div class="academy-exam-summary"><div><b>'+total+'</b><span>'+t('reviewed','REVISADAS')+'</span></div><div><b>'+correct+'</b><span>'+t('correct','ACERTOS')+'</span></div><div><b>'+(total?Math.round(correct/total*100):0)+'%</b><span>'+t('accuracy','APROVEITAMENTO')+'</span></div></div>'+C().SecondaryButton(t('backToHistory','VOLTAR AO HISTÓRICO'),'data-history-retrain-back');
      window.AnalyticsService?.track?.('history_retrain_finished',{run_id:historySession.runId,questions:total,correct});
      shell(t('sessionReplayResult','RESULTADO DA SESSÃO'),t('sessionReplayDone','Sessão refeita sem alterar o progresso original.'),body);
      return;
    }
    const q=historySession.questions[historySession.index],feedback=historySession.feedback;
    const options=(q.options||[]).map(o=>{
      const encoded=encodeURIComponent(o),disabled=feedback?'disabled':'';
      let extra='';
      if(feedback){if(o===q.answer)extra=' data-review-correct="1"';else if(o===feedback.selected)extra=' data-review-wrong="1"'}
      return '<button type="button" class="academy-secondary" data-history-retrain-answer="'+encoded+'" '+disabled+extra+'>'+esc(o)+'</button>';
    }).join('');
    const note=feedback?'<div class="academy-study-card"><strong>'+(feedback.correct?t('correct','ACERTO'):t('review','REVISAR'))+'</strong><span>'+esc(q.analysis||'')+'</span></div>':'';
    const next=feedback?C().PrimaryButton(historySession.index===historySession.questions.length-1?t('finish','FINALIZAR'):t('next','PRÓXIMO'),'data-history-retrain-next'):'';
    const body='<div class="academy-exam-meta"><strong>'+String(historySession.index+1).padStart(2,'0')+' / '+historySession.questions.length+'</strong><strong>'+esc(q.skill||q.source)+'</strong></div><div class="academy-exam-question"><p>'+esc(q.question)+'</p><div class="academy-exam-options">'+options+'</div></div>'+note+next;
    shell(t('retrainSession','REFAZER SESSÃO'),esc(historySession.label),body);
  }
  function answerHistoryRetrain(value){
    if(!historySession||historySession.feedback)return;
    const q=historySession.questions[historySession.index];if(!q)return;
    const correct=value===q.answer;if(correct)historySession.correct++;
    saveReviewResult(q,correct);
    window.AnalyticsService?.track?.('history_retrain_answer',{run_id:historySession.runId,question_id:q.id,correct});
    historySession.feedback={selected:value,correct};renderHistoryRetrainQuestion();
  }
  function nextHistoryRetrain(){
    if(!historySession?.feedback)return;
    historySession.index++;historySession.feedback=null;renderHistoryRetrainQuestion();
  }

  async function startExam(){
    shell(t('timedExam','SIMULADO CRONOMETRADO'),t('examPreparing','Preparando 20 questões sorteadas do Academy...'),'<div class="academy-state">'+t('loading','CARREGANDO...')+'</div>');
    try{
      const bank=await generalQuestionBank();
      const questions=shuffle(bank).slice(0,20);
      if(questions.length<20)throw new Error('Banco geral insuficiente para o simulado.');
      exam={questions,index:0,answers:{},startedAt:Date.now(),endsAt:Date.now()+12*60*1000,finished:false};
      renderExam();
    }catch(error){shell(t('timedExam','SIMULADO CRONOMETRADO'),'',C().ErrorState(error.message||'Não foi possível iniciar o simulado.'))}
  }

  function timeLeft(){
    if(!exam)return 0;
    return Math.max(0,Math.ceil((exam.endsAt-Date.now())/1000));
  }
  function clock(sec){const m=Math.floor(sec/60),s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
  function armTimer(){
    clearInterval(timerId);
    timerId=setInterval(()=>{
      const node=document.querySelector('[data-exam-time]');const left=timeLeft();
      if(node)node.textContent=clock(left);
      if(left<=0){clearInterval(timerId);finishExam(true)}
    },1000);
  }
  function renderExam(){
    if(!exam||exam.finished)return renderExamResult();
    const q=exam.questions[exam.index],left=timeLeft();
    if(!q||left<=0)return finishExam(left<=0);
    const options=shuffle(q.options||[]).map(o=>C().SecondaryButton(esc(o),'data-exam-answer="'+encodeURIComponent(o)+'"')).join('');
    const body='<div class="academy-exam-meta"><strong>'+String(exam.index+1).padStart(2,'0')+' / '+exam.questions.length+'</strong><strong data-exam-time>'+clock(left)+'</strong></div><div class="academy-exam-question"><p>'+esc(q.question||q.prompt||'')+'</p><div class="academy-exam-options">'+options+'</div></div>';
    shell(t('timedExam','SIMULADO CRONOMETRADO'),t('examNoFeedback','Responda sem feedback imediato. O resultado aparece ao final.'),body);
    armTimer();
  }
  function answerExam(value){
    if(!exam||exam.finished)return;
    const q=exam.questions[exam.index];if(!q)return;
    exam.answers[q.id||String(exam.index)]={selected:value,correct:value===q.answer};
    exam.index++;
    if(exam.index>=exam.questions.length)finishExam(false);else renderExam();
  }
  function finishExam(timeout=false){
    if(!exam||exam.finished)return;
    clearInterval(timerId);exam.finished=true;exam.timeout=timeout;exam.finishedAt=Date.now();
    try{localStorage.setItem('academy.exam.last.v1',JSON.stringify(exam))}catch(_){}
    renderExamResult();
  }
  function renderExamResult(){
    if(!exam)return renderTimedExamIntro();
    const rows=Object.values(exam.answers||{}),correct=rows.filter(x=>x.correct).length,total=exam.questions?.length||20,answered=rows.length,acc=answered?Math.round(correct/answered*100):0;
    const body='<div class="academy-exam-summary"><div><b>'+answered+'/'+total+'</b><span>'+t('answeredShort','RESPONDIDAS')+'</span></div><div><b>'+correct+'</b><span>'+t('correct','ACERTOS')+'</span></div><div><b>'+acc+'%</b><span>'+t('accuracy','APROVEITAMENTO')+'</span></div></div>'+C().SecondaryButton(t('newExam','NOVO SIMULADO'),'data-start-exam');
    shell(t('examResult','RESULTADO DO SIMULADO'),exam.timeout?t('examTimeout','O tempo terminou. Veja o resultado das questões respondidas.'):t('examFinished','Simulado concluído.'),body);
  }
  function renderTimedExamIntro(){
    let last=null;try{last=JSON.parse(localStorage.getItem('academy.exam.last.v1')||'null')}catch(_){}
    const lastInfo=last?'<div class="academy-study-card"><strong>'+t('lastExam','ÚLTIMO SIMULADO')+'</strong><span>'+Object.keys(last.answers||{}).length+'/20 '+t('answeredShort','respondidas').toLowerCase()+'</span></div>':'';
    shell(t('timedExam','SIMULADO CRONOMETRADO'),t('timedExamCopy','20 questões sorteadas de todo o banco geral, com limite de 12 minutos.'),lastInfo+C().PrimaryButton(t('startExam','INICIAR SIMULADO'),'data-start-exam'));
  }

  function renderCertificates(){
    const S=window.ProgressService?.snapshot?.()||{sections:{}};
    const rows=['fundamentals','modalities','practice'].map(key=>{
      const s=S.sections?.[key]||{answered:0,correct:0,total:0,pct:0},accuracy=s.answered?Math.round(s.correct/s.answered*100):0,qualified=s.pct>=80&&accuracy>=80;
      return '<div class="academy-certificate"><strong>'+stageName(key)+'</strong><span>'+Math.round(s.pct||0)+'% '+t('progress','PROGRESSO').toLowerCase()+' · '+accuracy+'% '+t('accuracy','APROVEITAMENTO').toLowerCase()+'</span><span>'+(qualified?t('certificateEarned','CERTIFICADO CONQUISTADO'):t('certificateRule','Necessário 80% de progresso e 80% de acertos.'))+'</span>'+(qualified?C().SecondaryButton(t('viewCertificate','VER CERTIFICADO'),'data-certificate-stage="'+key+'"'):'')+'</div>';
    }).join('');
    shell(t('certificates','CERTIFICADOS'),t('certificatesCopy','A conquista é liberada por seção ao atingir os dois critérios.'),'<div class="academy-study-grid">'+rows+'</div>');
  }
  function renderCertificateDetail(key){
    const S=window.ProgressService?.snapshot?.()||{sections:{}},s=S.sections?.[key]||{answered:0,correct:0,pct:0};
    const accuracy=s.answered?Math.round(s.correct/s.answered*100):0;
    if(!(s.pct>=80&&accuracy>=80))return renderCertificates();
    const user=window.AuthService?.getCurrentUser?.(),name=String(user?.user_metadata?.full_name||user?.user_metadata?.name||user?.email?.split('@')?.[0]||t('player','JOGADOR')).toUpperCase();
    const section=stageName(key),date=new Date().toLocaleDateString(window.AcademyI18n?.lang?.()||'pt-BR');
    const template=t('certificateText',"certifica que {n} concluiu a seção {s} do StackUp Hold'em Academy com {p}% de acertos em {q} questões.")
      .replace('{n}',name).replace('{s}',section).replace('{p}',String(accuracy)).replace('{q}',String(s.answered||0));
    const body='<div class="academy-certificate"><span>STACKUP HOLD\'EM ACADEMY</span><strong>'+t('certificateOf','CERTIFICADO')+' · '+section+'</strong><span>'+esc(template)+'</span><span>'+t('issuedOn','EMITIDO EM')+' · '+date+'</span></div>';
    shell(t('certificateOf','CERTIFICADO'),section,body);
  }

  async function renderReport(){
    shell(t('skillReport','RELATÓRIO POR COMPETÊNCIA'),t('skillReportCopy','Veja as competências mais fortes e as que precisam de reforço.'),'<div class="academy-state">'+t('loading','CARREGANDO...')+'</div>');
    try{
      const bank=await generalQuestionBank(),skills=competencyReport(bank),E=window.EvolutionService?.snapshot?.()||{log:{},xp:0};
      const rows=skills.length?skills.map(s=>{
        const trend=(s.trend>=0?'+':'')+s.trend+' pp';
        const meta=t('currentPerformance','ATUAL')+' '+s.weightedAccuracy+'% · '+s.n+' '+t('answeredShort','respondidas').toLowerCase()+' · '+s.persistentErrors+' '+t('persistentErrors','erros persistentes').toLowerCase()+' · '+t('trend','tendência').toLowerCase()+' '+trend;
        const action=s.score>0?C().SecondaryButton(t('reinforceCompetency','REFORÇAR COMPETÊNCIA'),'data-competency-review="'+encodeURIComponent(s.skill)+'"'):'';
        return '<div class="academy-skill-row"><div class="academy-skill-head"><strong>'+esc(s.skill)+'</strong><b>'+s.weightedAccuracy+'%</b></div><small>'+esc(meta)+'</small>'+action+'</div>';
      }).join(''):C().EmptyState(t('noCompetencyData','Ainda não há dados suficientes por competência.'));
      const comparisonValues=Object.values(E.comparison||{});
      const comparisonCount=comparisonValues.reduce((n,x)=>n+Number(x?.count||0),0);
      const comparisonFirst=comparisonCount?Math.round(comparisonValues.reduce((n,x)=>n+Number(x?.firstPct||0)*Number(x?.count||0),0)/comparisonCount):0;
      const comparisonCurrent=comparisonCount?Math.round(comparisonValues.reduce((n,x)=>n+Number(x?.lastPct||0)*Number(x?.count||0),0)/comparisonCount):0;
      const comparison=comparisonCount?'<div class="academy-skill-row"><div class="academy-skill-head"><strong>'+t('firstAttempt','1ª TENTATIVA')+' × '+t('currentPerformance','ATUAL')+'</strong><b>'+comparisonCurrent+'%</b></div><small>'+comparisonFirst+'% → '+comparisonCurrent+'%</small></div>':'';
      const days=Object.entries(E.log||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14);
      const timeline=days.length?'<div class="academy-xp-timeline"><div class="academy-kicker" style="padding:12px 0 2px">'+t('xpTimeline','XP AO LONGO DOS DIAS')+'</div>'+days.map(([day,xp])=>'<div class="academy-xp-day"><span>'+day.slice(8,10)+'/'+day.slice(5,7)+'</span><div>'+C().LearningProgress(Math.min(100,E.xp?Math.round(Number(xp)/E.xp*100):0))+'</div><b>'+xp+' XP</b></div>').join('')+'</div>':'';
      shell(t('skillReport','RELATÓRIO POR COMPETÊNCIA'),t('skillReportDetailedCopy','Competências priorizadas por precisão recente, erros persistentes, repetição e tendência.'),comparison+rows+timeline);
    }catch(error){shell(t('skillReport','RELATÓRIO POR COMPETÊNCIA'),'',C().ErrorState(error?.message||t('skillReportError','Não foi possível montar o relatório por competência.')))}
  }

  function render(kind){
    clearInterval(timerId);
    if(kind==='smartReview')return renderReview();
    if(kind==='timedExam')return renderTimedExamIntro();
    if(kind==='certificates')return renderCertificates();
    if(kind==='skillReport')return renderReport();
    renderHub();
  }
  function open(kind='hub'){history.pushState({type:'academy-study-tool',kind},'','#study-'+kind);render(kind)}

  window.AcademyScreens=window.AcademyScreens||{};
  window.AcademyScreens.studyTool=open;
  window.AcademyStudyService={reviewSummary};
  window.dispatchEvent(new CustomEvent('academy:studyready',{detail:reviewSummary()}));
  window.AcademyScreens.retrainHistory=startHistoryRetrain;

  document.addEventListener('click',e=>{
    const k=e.target.closest('[data-study-kind]');if(k){e.preventDefault();open(k.dataset.studyKind);return}
    const cr=e.target.closest('[data-competency-review]');if(cr){e.preventDefault();startCompetencyReview(decodeURIComponent(cr.dataset.competencyReview));return}
    const s=e.target.closest('[data-review-stage]');if(s){e.preventDefault();window.stage?.(s.dataset.reviewStage,1);return}
    const hra=e.target.closest('[data-history-retrain-answer]');if(hra){e.preventDefault();answerHistoryRetrain(decodeURIComponent(hra.dataset.historyRetrainAnswer));return}
    if(e.target.closest('[data-history-retrain-next]')){e.preventDefault();nextHistoryRetrain();return}
    if(e.target.closest('[data-history-retrain-back]')){e.preventDefault();window.AcademyScreens?.practiceTool?.('history');return}
    const ra=e.target.closest('[data-review-answer]');if(ra){e.preventDefault();answerReview(decodeURIComponent(ra.dataset.reviewAnswer));return}
    if(e.target.closest('[data-review-next]')){e.preventDefault();nextReview();return}
    const cert=e.target.closest('[data-certificate-stage]');if(cert){e.preventDefault();renderCertificateDetail(cert.dataset.certificateStage);return}
    if(e.target.closest('[data-start-exam]')){e.preventDefault();startExam();return}
    const a=e.target.closest('[data-exam-answer]');if(a){e.preventDefault();answerExam(decodeURIComponent(a.dataset.examAnswer));return}
  });
  window.addEventListener('popstate',e=>{if(e.state?.type==='academy-study-tool')render(e.state.kind||'hub')});
})();