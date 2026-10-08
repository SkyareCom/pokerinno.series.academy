import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('shared spacing contract loads after components and retains a full paragraph line',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const css=readFileSync(new URL('../dist/spacing.css',import.meta.url),'utf8');
 assert(html.indexOf('spacing.css')>html.indexOf('styles.css'));
 assert.match(css,/--paragraph-gap:1lh/);
 assert.match(css,/#app p\+p\{margin-block-start:var\(--paragraph-gap\)\}/);
 assert.match(css,/\.step\{display:grid;grid-template-columns:2\.5em minmax\(0,1fr\);gap:var\(--space-3\)/);
});
