import ranges from '../dist/ranges-dcfr-9max.json' with {type:'json'};
import {mkdirSync,writeFileSync} from 'node:fs';
const ranks='23456789TJQKA';
function comboCount(hand){return hand.length===2?6:hand.endsWith('s')?4:12;}
function score(hand){
 const a=ranks.indexOf(hand[0]),b=ranks.indexOf(hand[1]);
 if(hand.length===2)return 20+a*2;
 const hi=Math.max(a,b),lo=Math.min(a,b),gap=hi-lo;
 return hi*2+lo*.65+(hand.endsWith('s')?3:0)-(gap>1?(gap-1)*.8:0);
}
const out={schemaVersion:1,tableSize:9,mode:'ACADEMY_WEIGHTED_RANGES_PROVISIONAL',warning:'BTN raise frequencies imported from 9max reference; BB defend frequencies are transparent heuristic estimates, NOT solver solutions. No postflop decision is certified.',scenarios:{}};
for(const stack of [30,100]){
 const source=ranges.scenarios[stack+'|BTN'];
 if(!source||source.actions.length!==169)throw Error('Missing complete 9max BTN source '+stack);
 const btn={},bb={};let btnMass=0,bbMass=0;
 for(const [hand,...actions] of source.actions){
  const raise=actions.find(([action])=>action==='raise')?.[1]??0;
  if(!Number.isFinite(raise)||raise<0||raise>100)throw Error('Invalid BTN frequency '+hand);
  btn[hand]=Number((raise/100).toFixed(6));
  // Transparent educational BB response proxy, not a claim about GTO or solver output.
  const threshold=stack===30?17:15;
  bb[hand]=Number((1/(1+Math.exp(-(score(hand)-threshold)/3))).toFixed(6));
  btnMass+=comboCount(hand)*btn[hand];
  bbMass+=comboCount(hand)*bb[hand];
 }
 out.scenarios[String(stack)]={btnOpen:{sourceSolveId:source.solveId,provenance:'IMPORTED_9MAX_RFI_REFERENCE_NOT_INDEPENDENTLY_CERTIFIED',weights:btn,weightedCombos:Number(btnMass.toFixed(4))},bbDefend:{provenance:'ACADEMY_HEURISTIC_NOT_SOLVER_VALIDATED',weights:bb,weightedCombos:Number(bbMass.toFixed(4))}};
}
mkdirSync('dist',{recursive:true});
writeFileSync('dist/academy-weighted-ranges.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({stacks:Object.keys(out.scenarios),classes:169,certified:false}));
