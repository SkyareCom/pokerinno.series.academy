// Semantic identity ignores suit swaps, card order, cosmetic pot differences and IDs.
// Do not use this as evidence of solver certification.
export function strategicSpotKey(s){
 const rankBoard=(s.board||[]).map(c=>c[0]);
 const street=s.street;
 const flop=rankBoard.slice(0,3).sort().join('');
 const turn=rankBoard[3]||'',river=rankBoard[4]||'';
 const line=Array.isArray(s.bettingLine)?s.bettingLine.map(a=>[a.street,a.position,a.action,a.sizeBB].join(':')).join('|'):'UNKNOWN_LINE';
 return [s.tableSize||9,street,s.position,s.stack,s.hand,flop,turn,river,s.aggressor||'UNKNOWN_AGGRESSOR',line,s.effectiveStack||'UNKNOWN_EFFECTIVE_STACK',s.villainRange||'UNKNOWN_RANGE'].join('~');
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
