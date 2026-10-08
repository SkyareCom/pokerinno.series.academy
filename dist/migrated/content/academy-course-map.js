(() => {
  const map={
    fundamentals:{
      labelKey:'base',
      groups:[
        {labelKey:'hands',indexes:[0]},
        {labelKey:'gameStructure',indexes:[1,2,3,4,5,6,7]},
        {labelKey:'terminologyProfiles',indexes:[8,9]},
        {labelKey:'formats',indexes:[10,11]},
        {labelKey:'rulesConduct',indexes:[12,13]}
      ]
    },
    modalidades:{labelKey:'modalities',groups:null},
    pratica:{labelKey:'practice',groups:null}
  };
  window.AcademyCourseMap={
    stages:map,
    getGroups(stage,items=[]){
      const configured=map[stage]?.groups;
      if(configured)return configured.map(g=>({...g,indexes:g.indexes.filter(i=>items[i])}));
      return[{labelKey:stage==='pratica'?'trainingLab':stage==='fundamentos'?'base':'modalities',indexes:items.map((_,i)=>i)}];
    }
  };
})();