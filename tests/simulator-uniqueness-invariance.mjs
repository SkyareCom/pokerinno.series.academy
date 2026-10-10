import test from 'node:test';
import assert from 'node:assert/strict';
import {strategicSpotKey,auditStrategicDuplicates} from '../dist/simulator-uniqueness.js';
const base={id:1,tableSize:9,street:'flop',position:'BTN',stack:30,hand:'AKs',heroCards:['As','Ks'],board:['2s','7d','Th'],aggressor:'BTN',bettingLine:[{street:'pre',position:'BTN',action:'raise',sizeBB:2.5}],effectiveStack:30,villainRange:'BB_DEFEND'};
test('reordering hole cards and flop does not create a new spot',()=>{
 const alt={...base,id:2,heroCards:['Ks','As'],board:['Th','2s','7d']};
 assert.equal(strategicSpotKey(base),strategicSpotKey(alt));
 assert.equal(auditStrategicDuplicates([base,alt]).duplicateCount,1);
});
test('renaming every suit does not create a new spot',()=>{
 const rename={s:'h',h:'d',d:'c',c:'s'};
 const change=c=>c[0]+rename[c[1]];
 const alt={...base,id:3,heroCards:base.heroCards.map(change),board:base.board.map(change)};
 assert.equal(strategicSpotKey(base),strategicSpotKey(alt));
});
test('a changed betting line is a different strategic decision',()=>{
 const alt={...base,id:4,bettingLine:[{street:'pre',position:'BTN',action:'raise',sizeBB:3.5}]};
 assert.notEqual(strategicSpotKey(base),strategicSpotKey(alt));
});
test('a changed effective stack is a different strategic decision',()=>{
 assert.notEqual(strategicSpotKey(base),strategicSpotKey({...base,id:5,effectiveStack:15}));
});
