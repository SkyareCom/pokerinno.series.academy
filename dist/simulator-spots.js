import ranges from './ranges-dcfr-9max.json' with {type:'json'};
// 1,500 distinct educational decision contexts; not independently solver-certified.
const positions=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB'];
const stacks=[10,15,30,100];
const ranks='23456789TJQKA',suits='shdc';
const deck=[...ranks].flatMap(rank=>[...suits].map(suit=>rank+suit));
const handClasses=Object.keys(ranges.scenarios).length
 ? ranges.scenarios['100|UTG'].actions.map(row=>row[0]):[];
function holeCards(hand,index){
 const [a,b,type]=hand;
 if(a===b)return [a+suits[index%4],b+suits[(index+1)%4]];
 if(type==='s'){const suit=suits[index%4];return [a+suit,b+suit];}
 return [a+suits[index%4],b+suits[(index+1)%4]];
}
function boardCards(heroCards,index,count){
 const available=deck.filter(card=>!heroCards.includes(card));
 // Rotate a deterministic 52-card deck, not merely permuting an identical board.
 const offset=(index*17+Math.floor(index/31)*7)%available.length;
 return Array.from({length:count},(_,j)=>available[(offset+j*9)%available.length]);
}
const preflop=Array.from({length:720},(_,i)=>{
 const position=positions[i%8],stack=stacks[Math.floor(i/8)%4];
 const hand=handClasses[Math.floor(i/32)%handClasses.length];
 const scenario=ranges.scenarios[stack+'|'+position];
 const actions=scenario?.actions.find(row=>row[0]===hand)?.slice(1)??null;
 return {id:i+1,tableSize:9,street:'pre',position,stack,effectiveStack:stack,
  hand,heroCards:holeCards(hand,i),board:[],pot:1.5,
  aggressor:null,villainRange:'UNOPENED',bettingLine:[],
  solver:actions?{solveId:scenario.solveId,actions,context:'9MAX RFI PREFLOP'}:null};
});
const postflop=Array.from({length:780},(_,i)=>{
 const street=i<450?'flop':i<675?'turn':'river';
 const count={flop:3,turn:4,river:5}[street];
 const stack=[30,100][i%2],position='BTN';
 const hand=handClasses[Math.floor(i/2)%handClasses.length];
 const heroCards=holeCards(hand,i);
 const board=boardCards(heroCards,i,count);
 const bettingLine=[
  {street:'pre',position:'BTN',action:'raise',sizeBB:2.5},
  {street:'pre',position:'BB',action:'call',sizeBB:2.5}
 ];
 if(street!=='flop')bettingLine.push(
  {street:'flop',position:'BB',action:'check',sizeBB:0},
  {street:'flop',position:'BTN',action:'bet',sizeBB:2},
  {street:'flop',position:'BB',action:'call',sizeBB:2}
 );
 if(street==='river')bettingLine.push(
  {street:'turn',position:'BB',action:'check',sizeBB:0},
  {street:'turn',position:'BTN',action:'bet',sizeBB:4},
  {street:'turn',position:'BB',action:'call',sizeBB:4}
 );
 bettingLine.push({street,position:'BB',action:'check',sizeBB:0});
 const pot={flop:5.5,turn:9.5,river:17.5}[street];
 return {id:721+i,tableSize:9,street,position,stack,effectiveStack:stack-2.5-(street==='flop'?0:street==='turn'?2:6),
  hand,heroCards,board,pot,aggressor:'BTN',villainRange:'BB_DEFEND_VS_BTN_OPEN_UNVERIFIED',
  bettingLine,solver:null};
});
export const trainingSpots=[...preflop,...postflop];
export function legalTrainingActions(spot){return spot.street==='pre'&&spot.position!=='BB'&&spot.solver?['FOLD','RAISE']:[];}
export function checkTrainingAction(spot,action){
 if(!legalTrainingActions(spot).includes(action))return {status:'unvalidated',scorable:false,message:'Ação sem contexto de apostas suficiente.'};
 if(!spot.solver)return {status:'unvalidated',scorable:false,message:'Cenário didático: não existe solve correspondente nesta biblioteca.'};
 const map={'RAISE':'raise','FOLD':'fold','ALL IN':'allin','CALL':'call','CHECK':'check'};
 const chosen=map[action];
 const matched=spot.solver.actions.find(([a])=>a===chosen);
 if(!matched)return {status:'unvalidated',scorable:false,message:'Ação sem frequência explícita neste solve; não é possível avaliar.'};
 const frequency=matched[1];
 if(!Number.isFinite(frequency)||frequency<0||frequency>100)return {status:'unvalidated',scorable:false,message:'Frequência inválida no registro do solver.'};
 return {status:'solver-reference',frequency,solveId:spot.solver.solveId,scorable:false,message:chosen.toUpperCase()+': '+frequency.toFixed(1)+'% no arquivo DCFR 9-max (RFI). Referência de solver ainda não certificada independentemente; sem pontuação.'};
}
