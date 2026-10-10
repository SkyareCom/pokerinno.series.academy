import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {trainingSpots} from '../dist/simulator-spots.js';

const modulePath='../scripts/lib/independent-solver-adapters.mjs';
const available=existsSync(new URL(modulePath,import.meta.url));
const api=available?await import(modulePath):{};
const spot=trainingSpots.find(s=>s.id===1396);

test('canonical solver game keeps street, exact hero decision, pot and stack',()=>{
 assert.equal(typeof api.canonicalScenario,'function','canonical adapter is required');
 const s=api.canonicalScenario(spot);
 assert.equal(s.street,'river'); assert.deepEqual(s.heroCards,['Ac','Ks']);
 assert.equal(s.potChips,70); assert.equal(s.stackChips,366);
 assert.deepEqual(s.nodePath,['CHECK']); assert.equal(s.rangeVerified,false);
 assert.equal(s.tree.kind,'CHECK_OR_ALL_IN');
});

test('both adapters explicitly represent the same check or all-in tree',()=>{
 assert.equal(typeof api.renderTexasInput,'function');
 const s=api.canonicalScenario(spot);
 const a=api.renderTexasInput(s,'result.json'),b=api.renderDcfrInput(s);
 assert.match(a,/set_bet_sizes oop,river,bet\n/);
 assert.match(a,/set_bet_sizes ip,river,allin\n/);
 assert.match(b,/starting-wager-per-player: 35\n/);
 assert.match(b,/bet-sizes: \[\]/);
 assert.equal((b.match(/raise-sizes: \[\]/g)??[]).length,6);
 assert.doesNotMatch(a,/,bet,50|,raise,50/);
});

test('actual Texas strategy is extracted at IP after BB check for the exact combo',()=>{
 assert.equal(typeof api.parseTexasResult,'function');
 // Contract fixture: table structure matches upstream TexasSolver exports.
 const raw={actions:['CHECK','BET 366.000000'],player:1,childrens:{CHECK:{
  actions:['CHECK','BET 366.000000'],player:0,
  strategy:{actions:['CHECK','BET 366.000000'],strategy:{AcKs:[.8,.2],AsKh:[.3,.7]}}
 }}};
 const got=api.parseTexasResult(raw,api.canonicalScenario(spot));
 assert.deepEqual(got,{CHECK:.8,'ALL_IN:366':.2});
 assert.throws(()=>api.parseTexasResult({...raw,childrens:{}},api.canonicalScenario(spot)),/node/i);
});

test('DCFR parser uses action labels and the physical combo, never the class average',()=>{
 assert.equal(typeof api.parseDcfrResult,'function');
 const log='Player to act: IP\n    [0] Check\n    [1] All-in 366\n'+
 '| Hand | Weight  | [0]   | [1]   |\n| AsKh | 0.984 | 0.200 | 0.800 |\n'+
 '| AcKs | 0.984 | 0.999 | 0.001 |\n| AKo | 8.852 | 0.333 | 0.667 |\n';
 assert.deepEqual(api.parseDcfrResult(log,api.canonicalScenario(spot)),{CHECK:.999,'ALL_IN:366':.001});
 assert.throws(()=>api.parseDcfrResult(log.replace('AcKs','AcKh'),api.canonicalScenario(spot)),/combo/i);
 assert.throws(()=>api.parseDcfrResult('Error: invalid\n'+log,api.canonicalScenario(spot)),/error/i);
});

test('convergence uses measured final percentages and rejects missing or failed runs',()=>{
 assert.equal(typeof api.readConvergence,'function');
 assert.equal(api.readConvergence('TexasSolver','Total exploitability 0.3 precent\nTotal exploitability 0.04 precent\n',0),.04);
 assert.equal(api.readConvergence('Postflop-Poker-Solver','Exploitability: 1.2 (0.04%)\n',0),.04);
 assert.throws(()=>api.readConvergence('TexasSolver','set_accuracy 0.04',0),/measured/i);
 assert.throws(()=>api.readConvergence('TexasSolver','Total exploitability 0.04 precent',124),/exit/i);
});

test('normalization never promotes the existing heuristic ranges to verified',()=>{
 assert.equal(typeof api.normalizeRun,'function');
 const s=api.canonicalScenario(spot);
 assert.equal(s.rangeVerified,false);
 assert.equal(s.rangeProvenance.villain,'ACADEMY_HEURISTIC_UNVERIFIED');
 assert.equal(s.originalSpotId,1396);
});

test('each executed solver attempt gets a new directory so stale raw exports cannot be reused',()=>{
 assert.equal(typeof api.allocateRunDirectory,'function');
 const root=mkdtempSync(join(tmpdir(),'academy-attempt-'));
 try{
  const a=api.allocateRunDirectory(root,1396),b=api.allocateRunDirectory(root,1396);
  writeFileSync(join(a,'texas-raw.json'),'old output');
  assert.notEqual(a,b);assert.equal(existsSync(join(b,'texas-raw.json')),false);
 }finally{rmSync(root,{recursive:true,force:true});}
});
