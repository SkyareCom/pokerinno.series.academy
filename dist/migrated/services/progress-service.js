(() => {
  const KEYS={
    fundamentals:'stackup-fundamentals-progress-v1',
    modalities:'stackup-modalities-progress-v1',
    mixed:'stackup-mixed-games-progress-v2',
    practice:'stackup-practice-progress-v1',
    advanced:'stackup-practice-advanced-v2',
    weekly:'stackup-academy-weekly-v1',
    last:'stackup-academy-last-route-v1'
  };
  const TOTALS={fundamentals:700,modalities:550,practice:495};
  const TRACKED=[KEYS.fundamentals,KEYS.modalities,KEYS.mixed,KEYS.practice,KEYS.advanced];
  const safeParse=(v,fallback={})=>{try{return JSON.parse(v||'')||fallback}catch(_){return fallback}};
  const read=k=>{try{return safeParse(localStorage.getItem(k),{})}catch(_){return {}}};
  const values=o=>Object.values(o&&typeof o==='object'?o:{});
  const answerStats=(store)=>{
    let answered=0,correct=0;
    for(const section of values(store)){
      const ans=section?.answers||{};
      const rows=values(ans);answered+=rows.length;correct+=rows.filter(x=>x?.correct===true).length;
    }
    return {answered,correct};
  };
  const mixedStats=()=>{
    const rows=values(read(KEYS.mixed).answers||{});
    return {answered:rows.length,correct:rows.filter(x=>x?.correct===true).length};
  };
  const practiceCoreStats=()=>{
    const s=read(KEYS.practice);let answered=0,correct=0,attempts=0;
    for(const key of ['sim','quiz']){
      const p=s[key]||{};answered+=Object.keys(p.seen||{}).length;correct+=Number(p.correct||0);attempts+=Number(p.attempts||0);
    }
    return {answered,correct,attempts};
  };
  const advancedStats=()=>{
    const s=read(KEYS.advanced);let answered=0,correct=0;
    for(const key of ['sim','quiz','math']){
      const rows=values(s[key]?.results||{});answered+=rows.length;correct+=rows.filter(x=>x?.correct===true||x===true).length;
    }
    return {answered,correct};
  };
  const clamp=n=>Math.max(0,Math.min(100,Math.round(n||0)));
  const dayKey=d=>{const x=new Date(d),p=n=>String(n).padStart(2,'0');return x.getFullYear()+'-'+p(x.getMonth()+1)+'-'+p(x.getDate())};
  const weekStartDate=dt=>{const d=new Date(dt);const day=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-day);return d};
  const weekStart=()=>dayKey(weekStartDate(new Date()));
  const activity=()=>{
    const a=read(KEYS.weekly),start=weekStart(),allowed=[30,50,100];
    const next={weekStart:start,goal:Number(a.goal)||50,days:{...(a.days||{})}};
    next.goal=allowed.includes(Number(next.goal))?Number(next.goal):50;
    const cutoff=new Date();cutoff.setDate(cutoff.getDate()-450);
    for(const k of Object.keys(next.days))if(k<dayKey(cutoff))delete next.days[k];
    return next;
  };
  const writeActivity=a=>{try{localStorage.setItem(KEYS.weekly,JSON.stringify(a))}catch(_){}};
  const recordActivity=(count=1)=>{
    if(count<=0)return;const a=activity();const today=dayKey(new Date());
    a.days[today]=(a.days[today]||0)+count;writeActivity(a);
  };
  const setWeeklyGoal=goal=>{
    const value=Number(goal);if(![30,50,100].includes(value))return false;
    const a=activity();a.goal=value;writeActivity(a);return true;
  };
  const countStore=(key,raw)=>{
    const s=safeParse(raw,{});
    if(key===KEYS.fundamentals||key===KEYS.modalities)return answerStats(s).answered;
    if(key===KEYS.mixed)return Object.keys(s.answers||{}).length;
    if(key===KEYS.practice)return ['sim','quiz'].reduce((n,k)=>n+Object.keys(s[k]?.seen||{}).length,0);
    if(key===KEYS.advanced)return ['sim','quiz','math'].reduce((n,k)=>n+Object.keys(s[k]?.results||{}).length,0);
    return 0;
  };

  /* Training persistence is binary: enabled writes progress/history; disabled
     discards tracked training writes instead of creating a manual draft. */
  if(!window.__academyProgressStoragePatch && typeof Storage!=='undefined'){
    window.__academyProgressStoragePatch=true;
    const nativeGet=Storage.prototype.getItem,nativeSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){
      const track=this===localStorage&&TRACKED.includes(key);
      if(!track)return nativeSet.call(this,key,value);
      if(window.TrainingPreferenceService?.isEnabled?.()===false)return;
      let beforeRaw=null,before=0;
      try{beforeRaw=nativeGet.call(localStorage,key);before=countStore(key,beforeRaw);}catch(_){}
      const result=nativeSet.call(localStorage,key,value);
      try{
        const after=countStore(key,value),delta=Math.max(0,after-before);
        if(after>before)recordActivity(after-before);
        window.TrainingHistoryService?.recordStorageChange?.(key,beforeRaw,value);
        window.EvolutionService?.recordStorageChange?.(key,beforeRaw,value);
        if(delta>0)window.AnalyticsService?.track?.('training_progress',{store:key,answered_delta:delta,answered_total:after});
      }catch(_){}
      return result;
    };
  }

  function snapshot(){
    const f=answerStats(read(KEYS.fundamentals));
    const mBase=answerStats(read(KEYS.modalities)),mix=mixedStats(),m={answered:mBase.answered+mix.answered,correct:mBase.correct+mix.correct};
    const pCore=practiceCoreStats(),pAdv=advancedStats();const practiceAnswered=pCore.answered+pAdv.answered;const p={answered:practiceAnswered,correct:Math.min(practiceAnswered,pCore.correct+pAdv.correct)};
    const sections={
      fundamentals:{...f,total:TOTALS.fundamentals},
      modalities:{...m,total:TOTALS.modalities},
      practice:{...p,total:TOTALS.practice}
    };
    for(const s of values(sections))s.pct=clamp((s.answered/s.total)*100);
    const answered=f.answered+m.answered+p.answered,correct=f.correct+m.correct+p.correct,total=TOTALS.fundamentals+TOTALS.modalities+TOTALS.practice;
    const weekly=activity(),now=new Date(),ws=weekStartDate(now);let weekDone=0;
    for(let i=0;i<7;i++){const d=new Date(ws);d.setDate(ws.getDate()+i);weekDone+=Number((weekly.days||{})[dayKey(d)]||0);}
    const shield=window.PlanAccessService?.isPaid?.()===true;
    let cursor=new Date(now);cursor.setHours(0,0,0,0);if(!(weekly.days||{})[dayKey(cursor)])cursor.setDate(cursor.getDate()-1);
    const usedWeeks=new Set();let streak=0,shieldDaysUsed=0;
    for(let i=0;i<400;i++){
      const k=dayKey(cursor);
      if(Number((weekly.days||{})[k]||0)>0)streak++;
      else{
        const wk=dayKey(weekStartDate(cursor));
        if(shield&&streak>0&&!usedWeeks.has(wk)){usedWeeks.add(wk);shieldDaysUsed++;}
        else break;
      }
      cursor.setDate(cursor.getDate()-1);
    }
    const goal=Number(weekly.goal||50);
    return {
      answered,correct,errors:Math.max(0,answered-correct),total,pct:clamp(answered/total*100),
      accuracy:answered?clamp(correct/answered*100):0,streak,
      weekly:{goal,completed:weekDone,pct:clamp(weekDone/goal*100),shield,shieldDaysUsed},
      sections
    };
  }
  const setLastRoute=route=>{try{localStorage.setItem(KEYS.last,JSON.stringify(route))}catch(_){}};
  const getLastRoute=()=>read(KEYS.last);
  window.ProgressService={KEYS,TOTALS,TRACKED,snapshot,setLastRoute,getLastRoute,recordActivity,setWeeklyGoal};
})();