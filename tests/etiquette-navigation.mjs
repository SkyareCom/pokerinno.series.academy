import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRoute} from '../dist/navigation.js';
import {backTarget} from '../dist/back-navigation.js';
test('Bons Modos accepts its own deep link',()=>assert.equal(resolveRoute('#chapter/etiquette'),'chapter/etiquette'));
test('Bons Modos returns to O Staff rather than leaving the chapter',()=>assert.equal(backTarget('chapter/etiquette'),'#chapter/floor'));
