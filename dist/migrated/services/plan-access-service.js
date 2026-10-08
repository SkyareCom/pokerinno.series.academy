(() => {
  const TEST_ACCESS=true;
  const FREE_LIMIT=5;
  const FREE_FUNDAMENTALS=new Set([0,2,3]); // Ranking de mãos, Blinds/Ante, Streets
  const currentPlan=()=>window.BillingService?.getCurrentPlan?.()?.id||'free';
  const isPaid=()=>TEST_ACCESS||currentPlan()!=='free';
  const isLocked=(stage,index=null)=>{
    if(TEST_ACCESS||isPaid())return false;
    if(stage==='fundamentos')return index===null?false:!FREE_FUNDAMENTALS.has(Number(index));
    return stage!=='history';
  };
  const featureLocked=feature=>{
    if(TEST_ACCESS||isPaid())return false;
    return !['history','fundamentals-free'].includes(feature);
  };
  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
  const sampleQuestion=row=>{
    if(!row||!Array.isArray(row.options)||row.options.length<2||Array.isArray(row.answer))return null;
    return {
      id:String(row.id||'sample'),
      question:String(row.question||row.prompt||''),
      options:[...row.options],
      answer:row.answer,
      analysis:String(row.analysis||row.why||'')
    };
  };
  const sampleFor=(stage,index)=>{
    index=Number(index);
    const lesson=window.ContentService?.getLesson?.(stage,index),title=String(lesson?.[0]||'');
    let rows=[];
    if(stage==='fundamentos'){
      const bank=window.StackupFundamentalsSpotBank||{},needle=normalize(title);
      const key=Object.keys(bank).find(k=>normalize(k)===needle);
      rows=key?bank[key]||[]:[];
    }else if(stage==='modalidades'){
      const bank=window.StackupModalitiesSpotBank||{},needle=normalize(title);
      const key=Object.keys(bank).find(k=>normalize(k)===needle);
      rows=key?bank[key]||[]:[];
    }else if(stage==='pratica'){
      const mode=index===0?'sim':index===1?'quiz':index===2?'math':'';
      rows=mode?(window.StackupPracticeAdvancedBank?.[mode]||[]):[];
    }
    const q=rows.find(row=>sampleQuestion(row));
    const sample=sampleQuestion(q);
    return sample?{...sample,title}:null;
  };

  window.PlanAccessService={
    TEST_ACCESS,FREE_LIMIT,FREE_FUNDAMENTALS,
    currentPlan,isPaid,isLocked,featureLocked,sampleFor,
    fixedQuestionLimit(){return FREE_LIMIT}
  };
})();