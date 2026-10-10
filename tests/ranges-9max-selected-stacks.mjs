import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../dist/ranges-dcfr-9max.json', import.meta.url), 'utf8'));
const stacks = [10, 15, 30, 100];
const positions = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB'];
const ranks = 'AKQJT98765432';
const expectedHands = new Set();
for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++) {
  expectedHands.add(i === j ? ranks[i] + ranks[j] : i < j ? ranks[i] + ranks[j] + 's' : ranks[j] + ranks[i] + 'o');
}

test('all 32 displayed 9-max RFI scenarios exist with 169 unique hands', () => {
  assert.equal(data.tableSize, 9);
  assert.equal(data.engine, 'DCFR_SOLVER');
  for (const stack of stacks) for (const position of positions) {
    const key = stack + '|' + position;
    const scenario = data.scenarios[key];
    assert.ok(scenario, 'missing ' + key);
    assert.ok(scenario.solveId, 'missing provenance reference: ' + key);
    assert.equal(scenario.actions.length, 169, key);
    assert.deepEqual(new Set(scenario.actions.map(row => row[0])), expectedHands, key);
    for (const [hand, ...actions] of scenario.actions) {
      assert.ok(actions.length > 0, key + ':' + hand);
      const labels = new Set();
      let total = 0;
      for (const [action, frequency] of actions) {
        assert.ok(['fold', 'call', 'raise', 'allin', 'all-in', 'shove', 'check'].includes(action), key + ':' + hand + ':' + action);
        assert.ok(!labels.has(action), 'duplicate action: ' + key + ':' + hand + ':' + action);
        labels.add(action);
        assert.ok(Number.isFinite(frequency) && frequency >= 0 && frequency <= 100, key + ':' + hand);
        total += frequency;
      }
      assert.ok(Math.abs(total - 100) <= 0.2, key + ':' + hand + ':' + total);
    }
  }
});

test('integrity is not independent solver certification', () => {
  assert.match(data.source, /preflop-9max\.json$/);
  assert.ok(Number.isInteger(data.iterations) && data.iterations > 0);
  // solveId and metadata are provenance CLAIMS; reproduction requires original
  // solver outputs, configuration, tree, rake and an independent comparison.
});
