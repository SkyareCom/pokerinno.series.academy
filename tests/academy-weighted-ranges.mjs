import test from 'node:test';
import assert from 'node:assert/strict';
import {trainingSpots} from '../dist/simulator-spots.js';
import ranges from '../dist/ranges-dcfr-9max.json' with {type:'json'};

test('all Academy postflop ranges contain 169 bounded weighted hand classes',()=>{
 const spots=trainingSpots.filter(s=>s.street!=='pre');
 assert.equal(spots.length,780);
 for(const s of spots){
  assert.equal(s.tableSize,9);
  assert.equal(s.rangeProvenance.hero,'IMPORTED_9MAX_RFI_REFERENCE');
  assert.equal(s.rangeProvenance.villain,'ACADEMY_HEURISTIC_UNVERIFIED');
  const source=ranges.scenarios[s.stack+'|BTN'];
  assert.ok(source);
  for(const [name,weights] of [['hero',s.heroRange],['villain',s.villainRange]]){
   assert.equal(Object.keys(weights).length,169,s.id+' '+name);
   assert.ok(Object.values(weights).every(w=>Number.isFinite(w)&&w>=0&&w<=1));
   assert.ok(Object.values(weights).some(w=>w>0));
  }
  for(const [hand,...actions] of source.actions){
   const raise=actions.find(([a])=>a==='raise')?.[1]??0;
   assert.ok(Math.abs(s.heroRange[hand]-raise/100)<0.000001);
   assert.ok(Number.isFinite(s.villainRange[hand]));
  }
  assert.equal(s.solver,null);
 }
});
