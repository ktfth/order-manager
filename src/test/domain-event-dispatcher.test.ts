import { describe, test } from 'node:test';

import { DomainEventDispatcher } from '../domain/events/DomainEventDispatcher.js';
import { OrderId } from '../shared/types/BrandedTypes.js';
import { OrderPlaced } from '../domain/events/OrderPlaced.js';
import assert from 'node:assert/strict';

describe('DomainEventDispatcher', () => {
  test('deve registrar e disparar um handler para um evento', async () => {
    const dispatcher = new DomainEventDispatcher();

    let wasCalled = false;

    dispatcher.register('OrderPlaced', async (event: OrderPlaced) => {
      wasCalled = true;
      assert.equal(event.orderId, 'order-1');
    });

    const event = new OrderPlaced('order-1' as OrderId);

    await dispatcher.dispatch(event);

    assert.ok(wasCalled, 'Handler deveria ter sido chamado');
  });

  test('deve disparar múltiplos eventos corretamente', async () => {
    const dispatcher = new DomainEventDispatcher();

    let callCount = 0;

    dispatcher.register('OrderPlaced', async () => {
      callCount++;
    });

    const events = [
      new OrderPlaced('order-1' as OrderId),
      new OrderPlaced('order-2' as OrderId),
      new OrderPlaced('order-3' as OrderId),
    ];

    await dispatcher.dispatchAll(events);

    assert.equal(callCount, 3, 'Deveria ter chamado o handler 3 vezes');
  });
});
