(() => {
  window.ContentService={
    getStage(key){try{return window.D?.[key]||D?.[key]||null}catch(_){return null}},
    getLesson(stage,index){const s=this.getStage(stage);return s?.i?.[index]||null},
    getLessonBlocks(title){try{return window.L?.[title]||L?.[title]||[]}catch(_){return []}},
    getStages(){return ['fundamentos','modalidades','pratica'].map(key=>({key,data:this.getStage(key)}))}
  };
})();