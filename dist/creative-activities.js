/* Audited scenario activities: unique unordered seat pairs, distinct pot ratios, distinct etiquette actions. */
const choice=(id,prompt,options,answer,analysis)=>({id,type:'choice',prompt,options,answer,analysis});
const math=[];
const usedPotRatios=new Set();
for(const pot of [40,60,80,100,120,150,200,240,300,400]){
 for(const call of [10,20,30,40,50,60]){
  const exactRatio=call/(pot+2*call);
  const ratioKey=exactRatio.toFixed(8);
  if(usedPotRatios.has(ratioKey))continue;
  usedPotRatios.add(ratioKey);
  const pct=Math.round(100*exactRatio*10)/10;
  const right=pct.toFixed(1)+'%';
  const wrong=[(pct+5).toFixed(1)+'%',(pct+10).toFixed(1)+'%',(pct+15).toFixed(1)+'%'];
  math.push(choice('CREATIVE-POT-'+pot+'-'+call,'O pote tem '+pot+' fichas antes da aposta adversária de '+call+'. Você precisa pagar '+call+'. Qual a equidade mínima aproximada para um call sem considerar apostas futuras?',[right,...wrong],right,'O pote final após pagar será '+(pot+2*call)+'. A equidade de equilíbrio é '+call+'/'+(pot+2*call)+' = '+right+'.'));
 }
}
const position=[];
const seats=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'];
for(let i=0;i<seats.length;i++){
 for(let j=i+1;j<seats.length;j++){
  const first=seats[i],second=seats[j],answer=i<j?first:second;
  position.push(choice('CREATIVE-SEATS-'+i+'-'+j,'Em uma mesa 9-max, na ordem pré-flop sem considerar folds, quem age primeiro: '+first+' ou '+second+'?',[first,second],answer,'Na ordem pré-flop, a sequência começa em UTG e termina no big blind, quando não há straddle.'));
 }
}
const manners=[];
const actions=[
 ['mostrar as cartas ao vizinho durante uma mão','INCORRETO','As cartas privadas não devem ser mostradas a outro jogador durante a mão.'],
 ['aguardar sua vez de agir','CORRETO','Respeitar a ordem de ação evita informação indevida.'],
 ['comentar uma mão em andamento quando você já desistiu','INCORRETO','Comentários podem influenciar os jogadores ainda envolvidos.'],
 ['manter fichas de maior valor visíveis','CORRETO','Fichas de maior denominação devem ficar claramente visíveis.'],
 ['anunciar verbalmente um raise antes de mover as fichas','CORRETO','Uma declaração clara ajuda a evitar ambiguidades.'],
 ['revelar a mão de um adversário sem autorização','INCORRETO','A mão de outro jogador deve ser respeitada.']
];
for(let i=0;i<actions.length;i++){
 const context=['em torneio ao vivo','em cash game presencial','na mesa final de um torneio','durante uma mão com múltiplos jogadores'][i%4];
 const [act,answer,analysis]=actions[i];
 manners.push(choice('CREATIVE-ETIQUETTE-'+i+'-'+context,'Avalie esta conduta '+context+': '+act+'.',['CORRETO','INCORRETO'],answer,analysis));
}
export const creativeActivities={math,discover:position,etiquette:manners};
