import ranges from './ranges-dcfr-9max.json' with {type:'json'};
// Only RFI in the eight non-BB positions can be matched to the imported DCFR dataset.
// Other spots remain educational and have no solver-approved answer.
const positions=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'];
const stacks=[10,15,30,100];
const hands=['AKs','QQ','JTs','77','AQo','KQs','T9s','A5s'];
const cards=['Ah','7d','2c','9s','Kd'];
export const trainingSpots=Array.from({length:1500},(_,i)=>{
 const street=i%100<48?'pre':i%100<78?'flop':i%100<93?'turn':'river';
 const stack=stacks[i%4],position=positions[Math.floor(i/4)%9],hand=hands[Math.floor(i/36)%8];
 const board=cards.slice(0,street==='pre'?0:street==='flop'?3:street==='turn'?4:5);
 const scenario=street==='pre'&&position!=='BB'?ranges.scenarios[stack+'|'+position]:null;
 const actions=scenario?.actions.find(row=>row[0]===hand)?.slice(1)??null;
 return {id:i+1,street,stack,position,pot:street==='pre'?1.5:1.5+(i%12)*2,hand,board,solver:actions?{solveId:scenario.solveId,actions,context:'9MAX RFI PREFLOP'}:null};
});
export function legalTrainingActions(spot){return spot.street==='pre'&&spot.position!=='BB'&&spot.solver?['FOLD','RAISE','ALL IN']:[];}
export function checkTrainingAction(spot,action){
 if(!legalTrainingActions(spot).includes(action))return {status:'unvalidated',scorable:false,message:'Ação sem contexto de apostas suficiente.'};
 if(!spot.solver)return {status:'unvalidated',scorable:false,message:'Cenário didático: não existe solve correspondente nesta biblioteca.'};
 const map={'RAISE':'raise','FOLD':'fold','ALL IN':'allin','CALL':'call','CHECK':'check'};
 const chosen=map[action];
 const matched=spot.solver.actions.find(([a])=>a===chosen);
 if(!matched)return {status:'unvalidated',scorable:false,message:'Ação sem frequência explícita neste solve; não é possível avaliar.'};
 const frequency=matched[1];
 return {status:'solver-reference',frequency,solveId:spot.solver.solveId,scorable:false,message:chosen.toUpperCase()+': '+frequency.toFixed(1)+'% no arquivo DCFR 9-max (RFI). Referência de solver ainda não certificada independentemente; sem pontuação.'};
}
