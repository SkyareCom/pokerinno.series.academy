(() => {
  const KEY='academy.pref.v1';
  const safeParse=(raw,f={})=>{try{return JSON.parse(raw||'')||f}catch(_){return f}};
  const read=()=>{try{return safeParse(localStorage.getItem(KEY),{})}catch(_){return {}}};
  const write=value=>{try{localStorage.setItem(KEY,JSON.stringify(value))}catch(_){}};
  const getMode=()=>{const mode=read().historyMode;return mode==='auto'?'auto':'off'};
  const setMode=mode=>{
    const next=mode==='auto'?'auto':'off';
    const state=read();state.historyMode=next;write(state);
    window.dispatchEvent(new CustomEvent('academy:historymode',{detail:{mode:next}}));
    return next;
  };
  const isAuto=()=>getMode()==='auto';
  const isEnabled=isAuto;
  window.TrainingPreferenceService={KEY,getMode,setMode,isAuto,isEnabled};
})();