// Semantic identity ignores suit swaps, card order, cosmetic pot differences and IDs.
// Do not use this as evidence of solver certification.
const permutations=a=>a.length===1?[a]:a.flatMap((x,i)=>permutations([...a.slice(0,i),...a.slice(i+1)]).map(rest=>[x,...rest]));
const suitMaps=permutations(['s','h','d','c']).map(p=>Object.fromEntries(['s','h','d','c'].map((x,i)=>[x,p[i]])));
function canonicalCards(s){
 if(!Array.isArray(s.heroCards)||s.heroCards.length!==2)return 'UNKNOWN_CARDS';
 return suitMaps.map(map=>{
  const convert=c=>c[0]+map[c[1]];
  const hole=s.heroCards.map(convert).sort().join(',');
  const flop=(s.board||[]).slice(0,3).map(convert).sort().join(',');
  const turn=s.board?.[3]?convert(s.board[3]):'';
  const river=s.board?.[4]?convert(s.board[4]):'';
  return [hole,flop,turn,river].join('/');
 }).sort()[0];
}
export function strategicSpotKey(s){
 const street=s.street;
 const cards=canonicalCards(s);
 const line=Array.isArray(s.bettingLine)?s.bettingLine.map(a=>[a.street,a.position,a.action,a.sizeBB].join(':')).join('|'):'UNKNOWN_LINE';
 return [s.tableSize||9,street,s.position,s.stack,s.hand,cards,s.aggressor||'UNKNOWN_AGGRESSOR',line,s.effectiveStack||'UNKNOWN_EFFECTIVE_STACK',s.villainRange||'UNKNOWN_RANGE'].join('~');
}
export function auditStrategicDuplicates(spots){
 const first=new Map(),duplicates=[];
 for(const spot of spots){
  const key=strategicSpotKey(spot);
  if(first.has(key))duplicates.push({firstId:first.get(key),duplicateId:spot.id,key});
  else first.set(key,spot.id);
 }
 return {total:spots.length,unique:first.size,duplicateCount:duplicates.length,duplicates};
}
