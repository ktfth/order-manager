import { describe, test } from 'node:test';

import { Quantity } from '../domain/value-objects/Quantity';
import assert from 'node:assert/strict';

describe('Quantity', () => {
  test('deve criar uma Quantity válida', () => {
    const q = Quantity.create(5);
    assert.equal(q.getValue(), 5);
  });

  test('deve falhar ao criar uma Quantity com zero', () => {
    try {
      Quantity.create(0);
      assert.fail('Deveria ter lançado erro');
    } catch (error) {
      assert.match((error as Error).message, /greater than zero/);
    }
  });

  test('deve falhar ao criar uma Quantity com número decimal', () => {
    try {
      Quantity.create(2.5);
      assert.fail('Deveria ter lançado erro');
    } catch (error) {
      assert.match((error as Error).message, /integer/);
    }
  });

  test('deve falhar ao criar uma Quantity negativa', () => {
    try {
      Quantity.create(-10);
      assert.fail('Deveria ter lançado erro');
    } catch (error) {
      assert.match((error as Error).message, /greater than zero/);
    }
  });
});