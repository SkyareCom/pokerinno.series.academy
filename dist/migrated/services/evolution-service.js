(() => {
  const STORE='academy.evo.v1';
  const WEIGHTS=Object.freeze({fundamentals:10,modalities:15,quiz:20,math:25,sim:30});
  const CATEGORIES=Object.freeze([
    [0,'INICIANTE'],[1300,'APRENDIZ'],[3900,'JOGADOR DE MESA'],[8300,'GRINDER'],
    [13900,'REGULAR'],[20700,'PRO'],[27700,'LENDA']
  ]);
  const safeParse=(raw,f={})=>{try{return JSON.parse(raw||'')||f}catch(_){return f}};
  const read=k=>{try{return safeParse(localStorage.getItem(k),{})}catch(_){return {}}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
  const values=o=>Object.values(o&&typeof o==='object'?o:{});
  const pct=(a,b)=>b?Math.round(a/b*100):0;

  const answers=store=>{
    let answered=0,correct=0;
    for(const section of values(store)){
      const rows=values(section?.answers||{});
      answered+=rows.length;correct+=rows.filter(x=>x?.correct===true).length;
    }
    return {answered,correct};
  };
  const mixed=()=>{
    const rows=values(read('stackup-mixed-games-progress-v2').answers||{});
    return {answered:rows.length,correct:rows.filter(x=>x?.correct===true).length};
  };
  const advanced=()=>{
    const s=read('stackup-practice-advanced-v2'),out={};
    for(const k of ['sim','quiz','math']){
      const rows=values(s[k]?.results||{});
      out[k]={answered:rows.length,correct:rows.filter(x=>x?.correct===true||x===true).length};
    }
    return out;
  };
  const corePractice=()=>{
    const s=read('stackup-practice-progress-v1'),out={};
    for(const k of ['sim','quiz']){
      const p=s[k]||{},answered=Object.keys(p.seen||{}).length;
      out[k]={answered,correct:Math.min(answered,Number(p.correct||0))};
    }
    return out;
  };

  function categoryFor(xp){
    let index=0;CATEGORIES.forEach((c,i)=>{if(xp>=c[0])index=i});
    const current=CATEGORIES[index],previous=CATEGORIES[index-1]||null,next=CATEGORIES[index+1]||null;
    const span=next?next[0]-current[0]:1,progress=next?Math.max(0,Math.min(100,Math.round((xp-current[0])/span*100))):100;
    return {
      index,name:current[1],floor:current[0],progress,
      previous:previous?{name:previous[1],floor:previous[0]}:null,
      current:{name:current[1],floor:current[0]},
      next:next?{name:next[1],floor:next[0],remaining:Math.max(0,next[0]-xp)}:null
    };
  }

  const extract=(key,raw)=>{
    const s=safeParse(raw,{}),out=[];
    if(key==='stackup-fundamentals-progress-v1'){
      for(const [chapter,data] of Object.entries(s||{}))for(const [id,a] of Object.entries(data?.answers||{}))out.push({id:'fundamentals:'+chapter+':'+id,section:'fundamentals',correct:a?.correct===true});
    }else if(key==='stackup-modalities-progress-v1'){
      for(const [game,data] of Object.entries(s||{}))for(const [id,a] of Object.entries(data?.answers||{}))out.push({id:'modalities:'+game+':'+id,section:'modalities',correct:a?.correct===true});
    }else if(key==='stackup-mixed-games-progress-v2'){
      for(const [id,a] of Object.entries(s?.answers||{}))out.push({id:'mixed:'+id,section:'modalities',correct:a?.correct===true});
    }else if(key==='stackup-practice-advanced-v2'){
      for(const mode of ['sim','quiz','math'])for(const [id,ok] of Object.entries(s?.[mode]?.results||{}))out.push({id:mode+':'+id,section:mode,correct:ok===true});
    }
    return out;
  };

  const state=()=>{
    const s=read(STORE);s.items=s.items&&typeof s.items==='object'?s.items:{};s.log=s.log&&typeof s.log==='object'?s.log:{};return s;
  };
  const today=()=>new Date().toISOString().slice(0,10);
  const snapshotTracked=s=>{
    const rows=Object.values(s.items||{});
    let firstXp=0,lastXp=0,firstCorrect=0,lastCorrect=0;
    const sections={};
    for(const r of rows){
      const w=WEIGHTS[r.section]||0,sec=sections[r.section]||(sections[r.section]={count:0,firstCorrect:0,lastCorrect:0,firstXp:0,lastXp:0});
      sec.count++;
      if(r.first){firstXp+=w;firstCorrect++;sec.firstCorrect++;sec.firstXp+=w}
      if(r.last){lastXp+=w;lastCorrect++;sec.lastCorrect++;sec.lastXp+=w}
    }
    for(const sec of Object.values(sections)){sec.firstPct=pct(sec.firstCorrect,sec.count);sec.lastPct=pct(sec.lastCorrect,sec.count);sec.deltaPp=sec.lastPct-sec.firstPct}
    return {count:rows.length,firstXp,lastXp,firstCorrect,lastCorrect,firstPct:pct(firstCorrect,rows.length),lastPct:pct(lastCorrect,rows.length),sections};
  };
  const seedCurrent=()=>{
    const s=state();
    const sources=[
      ['stackup-fundamentals-progress-v1',localStorage.getItem('stackup-fundamentals-progress-v1')],
      ['stackup-modalities-progress-v1',localStorage.getItem('stackup-modalities-progress-v1')],
      ['stackup-mixed-games-progress-v2',localStorage.getItem('stackup-mixed-games-progress-v2')],
      ['stackup-practice-advanced-v2',localStorage.getItem('stackup-practice-advanced-v2')]
    ];
    let changed=false;
    for(const [key,raw] of sources){
      for(const row of extract(key,raw)){
        if(!s.items[row.id]){s.items[row.id]={section:row.section,first:row.correct,last:row.correct,firstAt:Date.now(),lastAt:Date.now()};changed=true}
      }
    }
    if(changed){const tr=snapshotTracked(s);s.log[today()]=tr.lastXp;write(STORE,s)}
    return s;
  };

  function recordStorageChange(key,beforeRaw,afterRaw){
    if(!['stackup-fundamentals-progress-v1','stackup-modalities-progress-v1','stackup-mixed-games-progress-v2','stackup-practice-advanced-v2'].includes(key))return;
    const before=new Map(extract(key,beforeRaw).map(x=>[x.id,x])),after=extract(key,afterRaw),s=state(),now=Date.now();
    let changed=false;
    for(const row of after){
      const prev=before.get(row.id),existing=s.items[row.id];
      if(!existing){
        s.items[row.id]={section:row.section,first:row.correct,last:row.correct,firstAt:now,lastAt:now};
        changed=true;continue;
      }
      if(!prev||prev.correct!==row.correct||existing.last!==row.correct){
        existing.section=row.section;existing.last=row.correct;existing.lastAt=now;changed=true;
      }
    }
    if(changed){const tr=snapshotTracked(s);s.log[today()]=tr.lastXp;write(STORE,s)}
  }

  function snapshot(){
    const f=answers(read('stackup-fundamentals-progress-v1'));
    const mb=answers(read('stackup-modalities-progress-v1')),mx=mixed();
    const mod={answered:mb.answered+mx.answered,correct:mb.correct+mx.correct};
    const core=corePractice(),adv=advanced();
    const sim={answered:core.sim.answered+adv.sim.answered,correct:core.sim.correct+adv.sim.correct};
    const quiz={answered:core.quiz.answered+adv.quiz.answered,correct:core.quiz.correct+adv.quiz.correct};
    const math={answered:adv.math.answered,correct:adv.math.correct};
    const sections={fundamentals:f,modalities:mod,quiz,math,sim};
    let xp=0,answered=0,correct=0;
    for(const [k,s] of Object.entries(sections)){
      s.weight=WEIGHTS[k];s.xp=s.correct*s.weight;s.accuracy=pct(s.correct,s.answered);
      xp+=s.xp;answered+=s.answered;correct+=s.correct;
    }
    const ranked=Object.entries(sections).filter(([,s])=>s.answered>0);
    const weakest=ranked.slice().sort((a,b)=>a[1].accuracy-b[1].accuracy||a[1].answered-b[1].answered).slice(0,3).map(([key,s])=>({key,...s}));
    const performancePodium=ranked.slice().sort((a,b)=>b[1].accuracy-a[1].accuracy||b[1].correct-a[1].correct).slice(0,3).map(([key,s],i)=>({place:i+1,key,...s}));
    const tracked=snapshotTracked(seedCurrent()),cat=categoryFor(xp),firstCat=categoryFor(tracked.firstXp);
    const selfBattle={
      villain:tracked.firstPct,hero:tracked.lastPct,
      villainPct:tracked.firstPct,heroPct:tracked.lastPct,
      villainXp:tracked.firstXp,heroXp:tracked.lastXp,
      villainCategory:firstCat.name,heroCategory:cat.name,
      deltaXp:tracked.lastXp-tracked.firstXp,deltaPp:tracked.lastPct-tracked.firstPct,
      tracked:tracked.count
    };
    const podium={previous:cat.previous,current:cat.current,next:cat.next,progress:cat.progress,remaining:cat.next?.remaining||0};
    return {xp,answered,correct,errors:Math.max(0,answered-correct),accuracy:pct(correct,answered),category:cat,sections,weakest,performancePodium,podium,selfBattle,comparison:tracked.sections,log:{...state().log}};
  }
  window.EvolutionService={STORE,WEIGHTS,CATEGORIES,snapshot,categoryFor,recordStorageChange};
})();