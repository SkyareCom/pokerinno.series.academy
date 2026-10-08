import test from 'node:test';
import assert from 'node:assert/strict';
test('training messages use real activity counts and pending saves',async()=>{
 const {trainingNotice}=await import('../dist/pokerinno-messages.js');
 assert.deepEqual(trainingNotice([],0),{key:'messages.start',params:{}});
 assert.deepEqual(trainingNotice([{at:1},{at:2}],0),{key:'messages.progress',params:{count:2}});
 assert.deepEqual(trainingNotice([{at:1}],1),{key:'messages.unsaved',params:{count:1}});
});
