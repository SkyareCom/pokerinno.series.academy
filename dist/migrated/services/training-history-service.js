(() => {
  const KEY='academy.hist.v1';
  const WINDOW_MS=20*60*1000;
  const safeParse=(raw,f={})=>{try{return JSON.parse(raw||'')||f}catch(_){return f}};
  const values=o=>Object.values(o&&typeof o==='object'?o:{});
  const read=()=>safeParse(localStorage.getItem(KEY),{runs:[]});
  const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(_){}};
  const prefs=()=>window.TrainingPreferenceService;
  const targetRead=()=>read();
  const targetWrite=s=>{if(prefs()?.isEnabled?.()===false)return false;write(s);return true};

  const answerStats=store=>{
    let answered=0,correct=0;
    for(const section of values(store)){
      const rows=values(section?.answers||{});
      answered+=rows.length;
      correct+=rows.filter(x=>x?.correct===true).length;
    }
    return {answered,correct};
  };
  const mixedStats=store=>{
    const rows=values(store?.answers||{});
    return {answered:rows.length,correct:rows.filter(x=>x?.correct===true).length};
  };
  const corePracticeStats=store=>{
    const out={};
    for(const type of ['sim','quiz']){
      const p=store?.[type]||{};
      const answered=Object.keys(p.seen||{}).length;
      const correct=Math.min(answered,Number(p.correct||0));
      out[type]={answered,correct};
    }
    return out;
  };
  const advancedStats=store=>{
    const out={};
    for(const type of ['sim','quiz','math']){
      const rows=values(store?.[type]?.results||{});
      out[type]={answered:rows.length,correct:rows.filter(x=>x?.correct===true||x===true).length};
    }
    return out;
  };

  const answerMap=(key,raw,kind)=>{
    const store=safeParse(raw,{}),out={};
    const put=(prefix,id,value)=>{if(id!=null&&id!=='')out[prefix+String(id)]=value};
    if(key==='stackup-fundamentals-progress-v1'){
      for(const section of values(store))for(const [id,a] of Object.entries(section?.answers||{}))put('BASE:',id,a?.correct===true);
    }else if(key==='stackup-modalities-progress-v1'){
      for(const section of values(store))for(const [id,a] of Object.entries(section?.answers||{}))put('MODALIDADES:',id,a?.correct===true);
    }else if(key==='stackup-mixed-games-progress-v2'){
      for(const [id,a] of Object.entries(store?.answers||{}))put('MIXED:',id,a?.correct===true);
    }else if(key==='stackup-practice-progress-v1'){
      const prefix=kind==='sim'?'SIM:':'QUIZ:';
      for(const id of Object.keys(store?.[kind]?.seen||{}))put(prefix,id,true);
    }else if(key==='stackup-practice-advanced-v2'){
      const prefix=kind==='sim'?'SIM:':kind==='math'?'MATEMÁTICA:':'QUIZ:';
      for(const [id,a] of Object.entries(store?.[kind]?.results||{}))put(prefix,id,a?.correct===true||a===true);
    }
    return out;
  };
  const changedQuestionIds=(key,beforeRaw,afterRaw,kind)=>{
    const before=answerMap(key,beforeRaw,kind),after=answerMap(key,afterRaw,kind),ids=[];
    for(const [id,value] of Object.entries(after))if(!(id in before)||before[id]!==value)ids.push(id);
    return ids;
  };
  const changedQuestionAttempts=(key,beforeRaw,afterRaw,kind,at)=>{
    const before=answerMap(key,beforeRaw,kind),after=answerMap(key,afterRaw,kind),rows=[];
    for(const [id,value] of Object.entries(after)){
      if(!(id in before)||before[id]!==value)rows.push({id,correct:value===true,at:Number(at||Date.now())});
    }
    return rows;
  };
  const mergeIds=(a,b)=>[...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])].slice(0,500);
  let forceNewRun=false;
  const startNewRun=()=>{forceNewRun=true;return true};

  const mergeQuestionAttempts=(base,rows)=>{
    const out=base&&typeof base==='object'?{...base}:{};
    for(const row of (Array.isArray(rows)?rows:[])){
      if(!row?.id)continue;
      const list=Array.isArray(out[row.id])?[...out[row.id]]:[];
      list.push({correct:row.correct===true,at:Number(row.at||Date.now())});
      out[row.id]=list.slice(-30);
    }
    return out;
  };

  const resumeFor=(key,raw,kind)=>{
    if(key!=='stackup-practice-advanced-v2')return null;
    const s=safeParse(raw,{});
    const mode=kind==='sim'||kind==='quiz'||kind==='math'?kind:null;
    if(!mode)return null;
    const slot=s?.[mode]||{};
    const id=String(slot.currentId||'').trim();
    if(!id)return null;
    const resume={stage:'pratica',lesson:mode==='sim'?0:mode==='quiz'?1:2,mode,id};
    if(mode==='sim'&&slot.filter)resume.filter=String(slot.filter);
    return resume;
  };

  const descriptors=(key,raw)=>{
    const store=safeParse(raw,{});
    if(key==='stackup-fundamentals-progress-v1')return [{section:'fundamentals',kind:'fundamentals',label:'BASE',...answerStats(store)}];
    if(key==='stackup-modalities-progress-v1')return [{section:'modalities',kind:'modalities',label:'MODALIDADES',...answerStats(store)}];
    if(key==='stackup-mixed-games-progress-v2')return [{section:'modalities',kind:'mixed',label:'MODALIDADES · MIXED GAMES',...mixedStats(store)}];
    if(key==='stackup-practice-progress-v1'){
      const s=corePracticeStats(store);
      return [
        {section:'practice',kind:'sim',label:'SIMULADOR',...s.sim},
        {section:'practice',kind:'quiz',label:'QUIZ',...s.quiz}
      ];
    }
    if(key==='stackup-practice-advanced-v2'){
      const s=advancedStats(store);
      return [
        {section:'practice',kind:'sim',label:'SIMULADOR',...s.sim},
        {section:'practice',kind:'quiz',label:'QUIZ',...s.quiz},
        {section:'practice',kind:'math',label:'MATEMÁTICA DO POKER',...s.math}
      ];
    }
    return [];
  };

  function recordStorageChange(key,beforeRaw,afterRaw){
    if(prefs()?.isEnabled?.()===false)return;
    const before=descriptors(key,beforeRaw),after=descriptors(key,afterRaw);
    if(!after.length)return;
    const state=targetRead();state.runs=Array.isArray(state.runs)?state.runs:[];
    const now=Date.now(),forceBoundary=forceNewRun;let changed=false;
    for(const next of after){
      const prev=before.find(x=>x.kind===next.kind&&x.section===next.section)||{answered:0,correct:0};
      const da=next.answered-prev.answered;
      const dc=next.correct-prev.correct;
      const questionIds=changedQuestionIds(key,beforeRaw,afterRaw,next.kind);
      const questionAttempts=changedQuestionAttempts(key,beforeRaw,afterRaw,next.kind,now);
      if(da<=0&&dc<=0&&!questionIds.length&&!questionAttempts.length)continue;
      const last=state.runs[0];
      const canMerge=!forceBoundary&&last&&last.section===next.section&&last.kind===next.kind&&(now-last.updatedAt)<=WINDOW_MS;
      changed=true;
      if(canMerge){
        last.updatedAt=now;
        last.answered=next.answered;
        last.correct=next.correct;
        last.errors=Math.max(0,next.answered-next.correct);
        last.deltaAnswered=(last.deltaAnswered||0)+Math.max(0,da);
        last.deltaCorrect=(last.deltaCorrect||0)+Math.max(0,dc);
        last.questionIds=mergeIds(last.questionIds,questionIds);
        last.questionAttempts=mergeQuestionAttempts(last.questionAttempts,questionAttempts);
        const resume=resumeFor(key,afterRaw,next.kind);if(resume)last.resume=resume;
      }else{
        state.runs.unshift({
          id:'AH-'+now.toString(36)+'-'+Math.random().toString(36).slice(2,7),
          section:next.section,kind:next.kind,label:next.label,
          startedAt:now,updatedAt:now,
          answered:next.answered,correct:next.correct,errors:Math.max(0,next.answered-next.correct),
          deltaAnswered:Math.max(0,da),deltaCorrect:Math.max(0,dc),
          questionIds:mergeIds([],questionIds),
          questionAttempts:mergeQuestionAttempts({},questionAttempts),
          resume:resumeFor(key,afterRaw,next.kind)
        });
      }
    }
    state.runs=state.runs.slice(0,250);
    targetWrite(state);
    if(changed)forceNewRun=false;
  }

  function list({section='',limit=100}={}){
    const runs=(read().runs||[]).filter(r=>!section||r.section===section);
    return runs.slice(0,Math.max(1,limit));
  }
  function summary(){
    const runs=list({limit:250});
    return {
      total:runs.length,
      practice:runs.filter(r=>r.section==='practice').length,
      fundamentals:runs.filter(r=>r.section==='fundamentals').length,
      modalities:runs.filter(r=>r.section==='modalities').length,
      answered:runs.reduce((n,r)=>n+Number(r.deltaAnswered||0),0),
      correct:runs.reduce((n,r)=>n+Number(r.deltaCorrect||0),0)
    };
  }
  function get(id){return (read().runs||[]).find(r=>r.id===id)||null}
  function remove(id){
    const s=read();s.runs=(s.runs||[]).filter(r=>r.id!==id);write(s);return true;
  }
  function clear(){
    try{localStorage.removeItem(KEY)}catch(_){}
    return true;
  }

  window.TrainingHistoryService={KEY,list,get,summary,remove,clear,startNewRun,recordStorageChange};
})();