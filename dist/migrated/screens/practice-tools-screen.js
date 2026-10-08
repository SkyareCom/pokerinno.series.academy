(() => {
  const t=(k,f='')=>window.AcademyI18n?.t(k,f)||f||k;
  const C=()=>window.AcademyComponents;
  const esc=v=>window.AcademyDOM?.esc(v)||String(v??'');

  if(!document.getElementById('academy-history-style')){
    const s=document.createElement('style');s.id='academy-history-style';s.textContent=`
      .academy-history-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--academy-line);border:1px solid var(--academy-card-border-color);margin-bottom:20px}
      .academy-history-summary>div{padding:14px 6px;background:var(--academy-bg-2);text-align:center}
      .academy-history-summary b,.academy-history-summary span{display:block}.academy-history-summary span{margin-top:4px;color:var(--academy-muted);text-transform:uppercase}
      .academy-history-list{border-top:1px solid var(--academy-line)}
      .academy-history-row{min-height:68px;padding:14px 0;border-bottom:1px solid var(--academy-line);display:flex;align-items:center;justify-content:space-between;gap:12px}
      .academy-history-row strong,.academy-history-row span{display:block}.academy-history-row span{margin-top:4px;color:var(--academy-muted)}
      .academy-history-row b{white-space:nowrap}.academy-history-row-actions{display:flex;gap:8px;margin-top:8px}.academy-history-row-actions button{min-height:34px;padding:6px 9px}.academy-history-actions{margin-top:20px}.academy-history-actions button{width:100%}
    `;document.head.appendChild(s);
  }

  const fmt=ts=>{const d=new Date(ts),p=n=>String(n).padStart(2,'0');return p(d.getDate())+'/'+p(d.getMonth()+1)+' · '+p(d.getHours())+':'+p(d.getMinutes())};

  function render(kind){
    const root=document.getElementById('root');if(!root)return;const nav=document.getElementById('navtools');if(nav){nav.classList.add('show');nav.innerHTML='<button class="navbtn" id="backBtn" type="button"><span class="navicon">‹</span><span>VOLTAR</span></button><button class="navbtn" id="homeBtn" type="button"><span class="navicon">⌂</span><span>MENU PRINCIPAL</span></button>'};
    const S=window.ProgressService?.snapshot?.(),p=S?.sections?.practice||{answered:0,correct:0,pct:0};
    let title='',body='',description='';
    if(kind==='ranking'){
      title=t('personalRanking','RANKING PESSOAL');
      description=t('selfRankingCopy','Seu desempenho pessoal com base nos treinos já realizados.');
      const acc=p.answered?Math.round(p.correct/p.answered*100):0;
      body=`<div class="academy-evolution">${C().EvolutionMetric({label:t('answered','QUESTÕES RESPONDIDAS'),value:String(p.answered)})}${C().EvolutionMetric({label:t('correct','ACERTOS'),value:String(p.correct)})}${C().EvolutionMetric({label:t('accuracy','APROVEITAMENTO'),value:acc+'%',pct:acc})}</div>`;
    }else if(kind==='history'){
      title=t('history','HISTÓRICO');
      description=t('historyCopy','Treinos salvos por seção e sessão.');
      const H=window.TrainingHistoryService?.summary?.()||{total:0,answered:0,correct:0};
      const mode=window.TrainingPreferenceService?.getMode?.()||'auto';
      const runs=window.TrainingHistoryService?.list?.({limit:100})||[];
      const rows=runs.length
        ?runs.map(r=>{
          const exact=Array.isArray(r.questionIds)&&r.questionIds.length>0;
          const continueLabel=r.resume?t('resumeSession','RETOMAR SESSÃO'):t('continueTraining','CONTINUAR TREINO');
          const exactButton=exact?`<button type="button" class="academy-secondary" data-history-retrain="${esc(r.id)}">${t('retrainSession','REFAZER SESSÃO')}</button>`:'';
          return `<div class="academy-history-row"><div><strong>${esc(r.label)}</strong><span>${fmt(r.updatedAt)} · ${Number(r.deltaAnswered||0)} ${t('answeredShort','respondidas').toLowerCase()}</span><div class="academy-history-row-actions"><button type="button" class="academy-secondary" data-history-continue="${esc(r.id)}">${continueLabel}</button>${exactButton}<button type="button" class="academy-secondary" data-history-delete="${esc(r.id)}">${t('delete','APAGAR')}</button></div></div><b>${Number(r.deltaCorrect||0)}/${Number(r.deltaAnswered||0)}</b></div>`;
        }).join('')
        :`<div class="academy-state">${t('historyEmpty','Nenhum treino salvo no histórico ainda.')}</div>`;
      body=`<div class="academy-history-summary"><div><b>${H.total}</b><span>${t('sessions','SESSÕES')}</span></div><div><b>${H.answered}</b><span>${t('answeredShort','RESPONDIDAS')}</span></div><div><b>${H.correct}</b><span>${t('correct','ACERTOS')}</span></div></div><div class="academy-history-list">${rows}</div><div class="academy-history-actions">${C().SecondaryButton(t('clearHistory','APAGAR HISTÓRICO'),'data-clear-academy-history')}</div>`;
    }else{
      title=t('exercises','EXERCÍCIOS');
      description=t('exercisesCopy','Acesse rapidamente os exercícios existentes sem criar conteúdo paralelo.');
      body=`<div class="academy-group-list">${C().LessonRow({num:'01',title:t('simulator','SIMULADOR'),note:t('simulatorCopy','Treine decisões e regras das modalidades existentes.'),attrs:'data-tool-lesson="0"'})}${C().LessonRow({num:'02',title:t('quiz','QUIZ'),note:t('quizCopy','Revise conceitos e retenção.'),attrs:'data-tool-lesson="1"'})}${C().LessonRow({num:'03',title:t('mathPoker','MATEMÁTICA DO POKER'),note:t('mathPokerCopy','Treine os cálculos já disponíveis.'),attrs:'data-tool-lesson="2"'})}</div>`;
    }
    root.innerHTML=`<section class="screen academy-stage-screen"><header class="academy-stage-intro"><div class="academy-stage-hero-grid"><div class="academy-kicker">${t('trainingLab','LABORATÓRIO DE TREINO')}</div><h1 class="academy-title">${esc(title)}</h1><p class="academy-copy">${esc(description)}</p></div></header><section class="academy-group">${body}</section></section>`;
    history.pushState({type:'academy-practice-tool',kind},'','#practice-'+kind);
  }

  window.AcademyScreens=window.AcademyScreens||{};
  window.AcademyScreens.practiceTool=render;

  const openRun=run=>{
    if(!run)return false;
    if(run.resume){try{sessionStorage.setItem('academy.resume.v1',JSON.stringify(run.resume))}catch(_){}}
    if(run.kind==='sim'){window.lesson?.('pratica',0,1);return true}
    if(run.kind==='quiz'){window.lesson?.('pratica',1,1);return true}
    if(run.kind==='math'){window.lesson?.('pratica',2,1);return true}
    if(run.section==='fundamentals'){window.stage?.('fundamentos',1);return true}
    if(run.section==='modalities'){window.stage?.('modalidades',1);return true}
    window.stage?.('pratica',1);return true;
  };

  document.addEventListener('click',e=>{
    const del=e.target.closest('[data-history-delete]');
    if(del){e.preventDefault();if(confirm(t('deleteSessionConfirm','Apagar esta sessão do histórico?'))){window.TrainingHistoryService?.remove?.(del.dataset.historyDelete);render('history')}return}
      return;
    }
    const cont=e.target.closest('[data-history-continue]');
    if(cont){
      e.preventDefault();
      const run=window.TrainingHistoryService?.get?.(cont.dataset.historyContinue);
      openRun(run);return;
    }
    const retrain=e.target.closest('[data-history-retrain]');
    if(retrain){
      e.preventDefault();
      const run=window.TrainingHistoryService?.get?.(retrain.dataset.historyRetrain);
      const promise=window.AcademyScreens?.retrainHistory?.(run);
      if(promise&&typeof promise.then==='function')promise.then(ok=>{if(!ok)openRun(run)});
      else openRun(run);
      return;
    }
    const clear=e.target.closest('[data-clear-academy-history]');
    if(clear){
      e.preventDefault();
      if(confirm(t('clearHistoryConfirm','Apagar somente o histórico de sessões? Seu progresso continuará salvo.'))){
        window.TrainingHistoryService?.clear?.();
        render('history');
      }
      return;
    }
    const b=e.target.closest('[data-tool-lesson]');if(!b)return;e.preventDefault();window.lesson?.('pratica',Number(b.dataset.toolLesson),1);
  });
  const old=window.onpopstate;window.onpopstate=e=>{if(e.state?.type==='academy-practice-tool'){render(e.state.kind);return}old?.(e)};
})();