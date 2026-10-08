import test from 'node:test';
import assert from 'node:assert/strict';
test('training messages use real activity counts and pending saves',async()=>{
 const {trainingNotice}=await import('../dist/pokerinno-messages.js');
 assert.deepEqual(trainingNotice([],0),{key:'messages.start',params:{}});
 assert.deepEqual(trainingNotice([{at:1},{at:2}],0),{key:'messages.progress',params:{count:2}});
 assert.deepEqual(trainingNotice([{at:1}],1),{key:'messages.unsaved',params:{count:1}});
});
test('message preferences persist individually and tolerate corrupt storage',async()=>{
 const {readMessagePreferences,saveMessagePreference}=await import('../dist/pokerinno-messages.js');
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.deepEqual(readMessagePreferences(storage),{welcome:true,training:true,theory:true,forgetting:true});
 assert.equal(saveMessagePreference(storage,'theory',false),true);
 assert.equal(readMessagePreferences(storage).theory,false);
 assert.equal(readMessagePreferences(storage).training,true);
 values.set('academy.pokerinno.messages.v1','bad json');
 assert.equal(readMessagePreferences(storage).welcome,true);
});
test('absence is triggered only after more than 72 hours and visit timestamp updates',async()=>{
 const {trackMessageVisit}=await import('../dist/pokerinno-messages.js');
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const day=86400000,now=10*day;
 assert.equal(trackMessageVisit(storage,now),false);
 assert.equal(trackMessageVisit(storage,now+3*day),false);
 assert.equal(trackMessageVisit(storage,now+6*day+1),true);
 assert.equal(trackMessageVisit(storage,now+6*day+2),false);
});
test('disabled categories do not speak and theory targets actual mistakes',async()=>{
 const {buildPokerinnoMessages}=await import('../dist/pokerinno-messages.js');
 const off={welcome:false,training:false,theory:false,forgetting:false};
 assert.deepEqual(buildPokerinnoMessages({preferences:off,absent:true}),[]);
 const messages=buildPokerinnoMessages({preferences:{...off,theory:true,forgetting:true},absent:true,activities:[{correct:false,theme:'math',at:2}]});
 assert.deepEqual(messages.map(m=>m.type),['forgetting','theory']);
 assert.equal(messages[1].href,'#chapter/math');
});
