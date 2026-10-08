import test from 'node:test';
import assert from 'node:assert/strict';
import {decorateStreetLesson} from '../dist/street-visuals.js';
import {academyVerde9} from '../dist/academy-verde9-content.js';
const lesson=academyVerde9.FUND.find(x=>x.id==='streets').html;
test('street diagrams reveal 0/3/4/5 community cards and preserve the same two hero cards',()=>{
 const illustrated=decorateStreetLesson(lesson);
 const figures=[...illustrated.matchAll(/<figure class="street-visual" data-street="([^"]+)">([\s\S]*?)<\/figure>/g)];
 assert.equal(figures.length,4);
 const boards=[];const heroHands=[];
 for(const [i,[,stage,body]] of figures.entries()){
  const board=body.match(/<div class="street-board-cards"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
  const hero=body.match(/<div class="street-hero-cards"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
  const cards=s=>[...s.matchAll(/role="img" aria-label="([^"]+)"/g)].map(x=>x[1]);
  boards.push(cards(board));heroHands.push(cards(hero));
  assert.equal(boards[i].length,[0,3,4,5][i],stage);
  assert.equal(heroHands[i].length,2,stage);
  assert.equal(new Set([...boards[i],...heroHands[i]]).size,boards[i].length+2,'no duplicated cards in '+stage);
 }
 for(const hero of heroHands)assert.deepEqual(hero,heroHands[0]);
 assert.deepEqual(boards[2].slice(0,3),boards[1]);
 assert.deepEqual(boards[3].slice(0,4),boards[2]);
});
test('illustrated streets retain the complete lesson explanations',()=>{
 const illustrated=decorateStreetLesson(lesson);
 for(const p of lesson.match(/<p>[\s\S]*?<\/p>/g))assert.ok(illustrated.includes(p));
 assert.equal((decorateStreetLesson('<p>Another lesson.</p>').match(/street-visual/g)||[]).length,0);
});
