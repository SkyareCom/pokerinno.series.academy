import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {legacyProfile} from '../dist/legacy-profile-data.js';
import {t} from '../dist/i18n.js';

const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const profile=source.split('\n').find(line=>line.startsWith("else if(route==='profile')"));
const expression=profile.split('app.innerHTML=')[1].replace(/;$/,'');
const render=new Function('heading','pokerinnoPanel','messageSettings','storage','preferences','legacyProfile','nextApps','t','getLocale','autoSave','return '+expression);
const page=(locale,enabled=true)=>render(()=>'',()=>'<section data-profile-intro></section>',()=>'<section data-messages></section>',{},{sound:true,reducedMotion:false},legacyProfile,'<section class="next-apps"></section>',key=>t(key,{},locale),()=>locale,()=>enabled);

test('profile replaces access, language and training cards with inline language buttons',()=>{
 for(const locale of ['pt-BR','en-US','es-ES']){
  const html=page(locale);
  assert.match(html,/<section data-profile-intro><\/section><div class="entry-languages profile-languages"/);
  const languages=[...html.matchAll(/<button[^>]*data-profile-lang="([^"]+)"[^>]*aria-pressed="([^"]+)"[^>]*>([^<]+)<\/button>/g)];
  assert.deepEqual(languages.map(x=>x[1]),['pt-BR','en-US','es-ES']);
  assert.deepEqual(languages.map(x=>x[3]),['PT BR','EN US','ES ES']);
  assert.equal(languages.filter(x=>x[2]==='true').length,1);
  assert.equal(languages.find(x=>x[2]==='true')[1],locale);
  for(const route of ['access','language','history'])assert.ok(!html.includes('href="#profile/'+route+'"'));
  assert.deepEqual([...html.matchAll(/href="#profile\/([^"]+)"/g)].map(x=>x[1]),['plans','coach','privacy']);
  assert.ok(!html.includes('Privacidade e conta'));
  assert.ok(html.endsWith('<section class="next-apps"></section>'));
 }
});

test('profile applies the stored language to the document on reload',()=>{
 const start=source.indexOf('function render(){');
 const end=source.indexOf('const route=resolveRoute(location.hash)',start);
 assert.ok(start>=0&&end>start);
 const bootstrap=source.slice(start,end)+'} render();';
 const run=new Function('document','location','getLocale','closePokerinno','loginPage','storage','messageVisitStarted','messageReturn','trackMessageVisit','t',bootstrap);
 for(const locale of ['pt-BR','en-US','es-ES']){
  const document={documentElement:{lang:'pt-BR'},body:{classList:{remove(){}}},querySelector:()=>({setAttribute(){}})};
  run(document,{hash:'#profile'},()=>locale,()=>{},()=>{}, {},true,null,()=>{},key=>t(key,{},locale));
  assert.equal(document.documentElement.lang,locale);
 }
});

test('profile automatic training save reflects the preference and keeps manual saving available',()=>{
 const labels={'pt-BR':'SALVAR TREINOS AUTOMATICAMENTE','en-US':'SAVE TRAINING AUTOMATICALLY','es-ES':'GUARDAR ENTRENAMIENTOS AUTOMÁTICAMENTE'};
 for(const [locale,title] of Object.entries(labels))for(const enabled of [true,false]){
  const html=page(locale,enabled);
  const checkbox=html.match(/<input[^>]*id="autoSaveActivities"[^>]*>/)?.[0];
  assert.ok(checkbox,'The automatic-save checkbox is available in Profile');
  assert.equal(/\bchecked\b/.test(checkbox),enabled);
  assert.ok(html.includes(title));
  assert.equal(html.includes('data-save-activities'),!enabled);
  const settings=html.match(/<section class="profile-preferences"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(settings,'Academy settings group is available in Profile');
  assert.ok(settings.includes(t('profile.settings',{},locale)));
  assert.ok(settings.indexOf('id="sound"')<settings.indexOf('id="reducedMotion"'));
  assert.ok(settings.indexOf('id="reducedMotion"')<settings.indexOf('id="autoSaveActivities"'));
  assert.ok(settings.includes(title));
 }
});

