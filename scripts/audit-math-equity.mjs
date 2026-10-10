// Recompute the educational fixed-hand references; this is a card enumeration,
// not a strategy solver or an estimate of any user's actual playing results.
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';

const data=JSON.parse(readFileSync(new URL('../dist/math-lesson-data.json',import.meta.url),'utf8'));
const temporary=mkdtempSync(join(tmpdir(),'academy-math-audit-'));
const executable=join(temporary,'equity');
const suit={s:'♠',h:'♥',d:'♦',c:'♣'};
const card=value=>value[0]+suit[value[1]];
try{
  execFileSync('g++',['-O3',new URL('./audit-math-equity.cpp',import.meta.url).pathname,'-o',executable],{stdio:'inherit'});
  const output=execFileSync(executable,[],{encoding:'utf8',stdio:['ignore','pipe','inherit'],timeout:180000});
  let boards=0;
  for(const line of output.trim().split('\n')){
    const [rawId,h1,h2,v1,v2,winText,tieText,totalText]=line.split(' ');
    const id=rawId==='qq-aks'?'aks-qq':rawId;
    const p=data.items.find(item=>item.id===id).params;
    const total=Number(totalText),ties=Number(tieText);
    const wins=rawId==='qq-aks'?total-Number(winText)-ties:Number(winText);
    const hero=rawId==='qq-aks'?[v1,v2]:[h1,h2];
    const villain=rawId==='qq-aks'?[h1,h2]:[v1,v2];
    assert.equal(p.hero,hero.map(card).join(' '));assert.equal(p.villain,villain.map(card).join(' '));
    assert.equal(p.wins,wins);assert.equal(p.ties,ties);assert.equal(p.total,total);
    assert.ok(Math.abs(p.percent-100*(wins+ties/2)/total)<1e-8);
    boards+=total;
    console.log(id+': '+p.percent.toFixed(6)+'%; '+total+' boards');
  }
  assert.equal(boards,8*1712304);
  console.log('PASS 8 fixed-hand examples; '+boards+' exhaustively enumerated boards');
}finally{rmSync(temporary,{recursive:true,force:true});}
