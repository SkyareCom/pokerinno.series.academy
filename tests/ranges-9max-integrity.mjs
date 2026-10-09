import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = JSON.parse(readFileSync(new URL('../dist/ranges-dcfr-9max.json', import.meta.url), 'utf8'));
const library = readFileSync(new URL('../dist/ranges-library.js', import.meta.url), 'utf8');

test('range dataset is explicitly nine-max', () => {
  assert.equal(source.tableSize, 9);
  assert.match(source.source, /preflop-9max\.json$/);
  assert.equal(source.engine, 'DCFR_SOLVER');
  assert.ok(source.scenarios && Object.keys(source.scenarios).length > 0);
});

test('all exposed scenarios have a solve reference and valid action frequencies', () => {
  for (const [key, scenario] of Object.entries(source.scenarios)) {
    assert.match(key, /^\d+\|[A-Z0-9+]+$/);
    assert.ok(typeof scenario.solveId === 'string' && scenario.solveId.length > 0, key);
    assert.ok(Array.isArray(scenario.actions) && scenario.actions.length > 0, key);
    for (const [hand, ...actions] of scenario.actions) {
      assert.match(hand, /^(?:[2-9TJQKA]{2}|[2-9TJQKA]{2}[so])$/);
      assert.ok(actions.length > 0, key + ':' + hand);
      const total = actions.reduce((sum, [action, frequency]) => {
        assert.ok(typeof action === 'string' && action.length > 0);
        assert.ok(Number.isFinite(frequency) && frequency >= 0 && frequency <= 100);
        return sum + frequency;
      }, 0);
      assert.ok(Math.abs(total - 100) <= 0.2, key + ':' + hand + ' = ' + total);
    }
  }
});

test('academy imports 9max ranges and labels other actions didactic', () => {
  assert.match(library, /from '\.\/ranges-dcfr-9max\.json/);
  assert.doesNotMatch(library, /from '\.\/ranges-dcfr-verified\.json/);
  assert.match(library, /NÃO VALIDADO/);
});
