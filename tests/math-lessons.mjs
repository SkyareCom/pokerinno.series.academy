import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mathLessonData,renderMathLessons} from '../dist/math-lessons.js';

const items=new Map(mathLessonData.items.map(item=>[item.id,item]));
const languages=['pt-BR','en-US','es-ES'];
const catalogs=Object.fromEntries(languages.map(lang=>[lang,JSON.parse(readFileSync(new URL('../dist/locales/'+lang+'.json',import.meta.url),'utf8'))]));
const translator=lang=>(key,params={})=>{
  assert.equal(typeof catalogs[lang][key],'string','Missing translation '+lang+'/'+key);
  return catalogs[lang][key].replace(/\{(\w+)\}/g,(_,name)=>{assert.ok(Object.hasOwn(params,name),'Missing example value '+key+'/'+name);return params[name];});
};
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,actual+' != '+expected);

test('consolidated lessons preserve each original topic exactly once',()=>{
  assert.equal(items.size,58);
  assert.ok(Array.isArray(mathLessonData.lessons),'The reader needs consolidated lessons');
  assert.equal(mathLessonData.lessons.length,20);
  const covered=mathLessonData.lessons.flatMap(lesson=>lesson.sources);
  assert.equal(covered.length,items.size);
  assert.equal(new Set(covered).size,items.size,'No concept is explained in two cards');
  assert.deepEqual([...covered].sort(),[...items.keys()].sort());
  const grouped=mathLessonData.groups.flatMap(group=>group.items);
  assert.equal(grouped.length,20);
  assert.deepEqual([...grouped].sort(),mathLessonData.lessons.map(lesson=>lesson.id).sort());
});

test('math uses unique explanatory prose and plain inline examples in every language',()=>{
  for(const lang of languages){
    const html=renderMathLessons(translator(lang),lang);
    assert.equal((html.match(/data-math-item=/g)||[]).length,20);
    assert.ok(!/data-math-field=/.test(html));
    assert.ok(!/\{\w+\}/.test(html));
    const paragraphs=[...html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)];
    assert.ok(paragraphs.length>20);
    const prose=paragraphs.filter(([,attrs])=>!attrs.includes('data-math-example'));
    const normalized=prose.map(([,_,text])=>text.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase());
    assert.equal(new Set(normalized).size,normalized.length,'Repeated explanatory paragraph');
    const label=translator(lang)('math.example');
    for(const [,attrs,text] of paragraphs){
      assert.ok(!/<\/?(?:strong|b|em|span)\b/.test(text),'Paragraphs and examples have no highlighted labels');
      if(attrs.includes('data-math-example'))assert.ok(text.startsWith(label+' '),'Example label stays inline');
    }
    for(const lesson of mathLessonData.lessons){
      assert.ok(lesson.paragraphs.length>0);
      assert.ok(lesson.examples.length>0);
    }
  }
});

test('draw examples distinguish one and two cards, and do not double-count a combo draw',()=>{
  const expected={9:[19.148936170212764,34.967622571692875],8:[17.02127659574468,31.452358926919513],4:[8.51063829787234,16.466234967622572],2:[4.25531914893617,8.41813135985199],6:[12.76595744680851,24.14431082331175],15:[31.914893617021274,54.11655874190564]};
  for(const id of ['flush-draw','oesd','gutshot','pair-two-outs','overcards','combo-draw']){
    const p=items.get(id).params;
    near(p.next,expected[p.outs][0]);near(p.river,expected[p.outs][1]);
    near(p.turn,p.outs/46*100);
    assert.equal(p.missOne,47-p.outs);assert.equal(p.missTwo,46-p.outs);
  }
  assert.equal(items.get('combo-draw').params.outs,9+8-2);
  for(const lang of languages){
    const rule=mathLessonData.lessons?.find(lesson=>lesson.id==='draw-probability')?.paragraphs.map(part=>catalogs[lang][part.key]).join(' ')||'';
    assert.ok(/all-in/.test(rule));
    assert.ok(/turn/.test(rule));
  }
});

test('starting hand and flop references use complete combinatorial counts',()=>{
  for(const [id,count] of [['receive-aa',6],['receive-pair',78],['receive-ak',16],['receive-aks',4],['receive-suited',312]])near(items.get(id).params.percent,count/1326*100);
  for(const [id,count,total] of [['flop-flush',165,19600],['flop-flush-draw',2145,19600],['flop-straight',256,19600],['flop-set',2304,19600],['flop-rank',6356,19600],['flop-two-pair',396,19600],['suited-river',135597,2118760]]){
    const p=items.get(id).params;assert.equal(p.favorable,count);assert.equal(p.total,total);near(p.percent,count/total*100);
  }
});

test('pot benchmarks use the final pot and include the call exactly once',()=>{
  const expectations={quarter:1/6,third:1/5,half:1/4,'two-thirds':2/7,'three-quarters':3/10,pot:1/3,'one-half':3/8,double:2/5};
  for(const [id,q] of Object.entries(expectations)){
    const p=items.get('bet-'+id).params;
    near(p.percent,q*100);near(p.finalPot,100+2*p.bet);
    near(q*p.finalPot-p.bet,0);
  }
});

test('fixed matchup equity includes half the ties and uses 1,712,304 complete boards',()=>{
  for(const id of ['aa-kk','aa-ako','aa-aks','88-aqo','88-aqs','qq-ako','aks-qq','ako-aqo']){
    const p=items.get(id).params;
    assert.equal(p.total,1712304);
    assert.ok(p.wins>=0&&p.ties>=0&&p.wins+p.ties<=p.total);
    near(p.percent,(p.wins+p.ties/2)/p.total*100);
    assert.equal(new Set((p.hero+' '+p.villain).split(' ')).size,4);
  }
  assert.equal(Math.round(items.get('aa-kk').params.percent*100)/100,81.26);
});

test('math examples format values for each language without changing approved card markup',()=>{
  const pt=renderMathLessons(translator('pt-BR'),'pt-BR');
  const en=renderMathLessons(translator('en-US'),'en-US');
  const es=renderMathLessons(translator('es-ES'),'es-ES');
  assert.ok(pt.includes('34,97%'));assert.ok(es.includes('34,97%'));assert.ok(en.includes('34.97%'));
  assert.ok(pt.includes('1.712.304'));assert.ok(en.includes('1,712,304'));
  assert.equal((pt.match(/class="glossary-term math-lesson"/g)||[]).length,20);
});
