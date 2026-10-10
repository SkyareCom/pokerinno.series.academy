import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256,certifySpot,auditCatalog} from './certify-spots.mjs';
const spot={id:721,street:'flop',board:['As','Kd','2c']};
const sourceHash=sha256(JSON.stringify(spot));
const strategy={AsKs:{check:0.6,bet:0.4}};
const outputHash=sha256(JSON.stringify(strategy));
const rangeSourceHash=sha256('verified external solver range fixture');
const makeRun=(engine)=>({engine,engineCommit:sha256(engine),inputHash:sha256(engine+' input'),
  outputHash,exitCode:0,converged:true,exploitabilityPercent:0.1,strategy,sourceHash,rangeSourceHash});
const evidence={spotId:721,sourceHash,ranges:{verified:true,sourceHash:rangeSourceHash,sourceId:'fixture-only',method:'solver'},
  runs:[makeRun('engine-A'),makeRun('engine-B')]};
test('missing evidence never certifies',()=>assert.equal(certifySpot(spot,null).certified,false));
test('verified synthetic fixture demonstrates all gates, not real certification',()=>assert.equal(certifySpot(spot,evidence).certified,true));
test('same engine twice is not independent',()=>assert.equal(certifySpot(spot,{...evidence,runs:[makeRun('engine-A'),makeRun('engine-A')]}).certified,false));
test('heuristic ranges block certification',()=>assert.equal(certifySpot(spot,{...evidence,ranges:{...evidence.ranges,method:'heuristic'}}).certified,false));
test('strategy disagreement blocks certification',()=>{
 const changed={AsKs:{check:0.3,bet:0.7}};
 const altered={...makeRun('engine-B'),strategy:changed,outputHash:sha256(JSON.stringify(changed))};
 assert.equal(certifySpot(spot,{...evidence,runs:[makeRun('engine-A'),altered]}).certified,false);
});
test('tampered strategy hash blocks certification',()=>assert.equal(certifySpot(spot,{...evidence,runs:[makeRun('engine-A'),{...makeRun('engine-B'),outputHash:sha256('tampered')}] }).certified,false));
test('ledger blocks absent spots',()=>{
 const ledger=auditCatalog([spot,{id:722,street:'flop'}],[evidence]);
 assert.deepEqual([ledger.total,ledger.certified,ledger.blocked],[2,1,1]);
});
test('duplicate IDs fail closed',()=>{
 const ledger=auditCatalog([spot,spot],[evidence]);
 assert.equal(ledger.records[1].certified,false);
});
