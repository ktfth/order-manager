import { CustomerId, OrderId, ProductId } from '../shared/types/BrandedTypes';
import { describe, test } from 'node:test';

import { Customer } from '../domain/entities/Customer';
import { Email } from '../domain/value-objects/Email';
import { OrderAggregate } from '../domain/aggregates/OrderAggregate';
import { OrderItem } from '../domain/entities/OrderItem';
import { OrderPlaced } from '../domain/events/OrderPlaced';
import { Price } from '../domain/value-objects/Price';
import { Quantity } from '../domain/value-objects/Quantity';
import assert from 'node:assert/strict';

describe('OrderAggregate - Domain Events', () => {
  test('deve registrar evento OrderPlaced ao criar um pedido', () => {
    // Setup dos dados básicos
    const item = OrderItem.create('p1' as ProductId, Price.create(100), Quantity.create(1));
    const customer = Customer.create('c1' as CustomerId, 'Teste Evento', Email.create('teste@evento.com'));

    // Criação do pedido
    const order = OrderAggregate.create('o1' as OrderId, customer, [item]);

    // Verificando os eventos registrados
    const events = order.getDomainEvents();
    assert.equal(events.length, 1, 'Deveria haver um evento registrado');

    const event = events[0];
    assert.equal(event.eventName, 'OrderPlaced');
    assert.ok(event.occurredAt instanceof Date);

    const typedEvent = event as OrderPlaced;
    assert.equal(typedEvent.orderId, 'o1');
  });
});
