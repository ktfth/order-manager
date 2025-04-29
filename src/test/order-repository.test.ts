import { CustomerId, OrderId, ProductId } from '../shared/types/BrandedTypes';
import { describe, test } from 'node:test';

import { Customer } from '../domain/entities/Customer';
import { Email } from '../domain/value-objects/Email';
import { InMemoryOrderRepository } from '../infrastructure/repositories/InMemoryOrderRepository';
import { OrderAggregate } from '../domain/aggregates/OrderAggregate';
import { OrderItem } from '../domain/entities/OrderItem';
import { Price } from '../domain/value-objects/Price';
import { Quantity } from '../domain/value-objects/Quantity';
import assert from 'node:assert/strict';

describe('InMemoryOrderRepository', () => {
  test('deve salvar e recuperar um pedido', async () => {
    const repository = new InMemoryOrderRepository();

    const item1 = OrderItem.create('p1' as ProductId, Price.create(50), Quantity.create(2));
    const customer = Customer.create('c1' as CustomerId, 'Joana Teste', Email.create('joana@test.com'));
    const order = OrderAggregate.create('o1' as OrderId, customer, [item1]);

    await repository.save(order);

    const fetched = await repository.findById('o1' as OrderId);

    assert.ok(fetched, 'Pedido deveria ter sido encontrado');
    assert.equal(fetched?.getId(), 'o1');
    assert.equal(fetched?.getItems().length, 1);
    assert.equal(fetched?.calculateTotal().getValue(), 100);
  });

  test('deve retornar null ao buscar um pedido inexistente', async () => {
    const repository = new InMemoryOrderRepository();
    const result = await repository.findById('não-existe' as OrderId);
    assert.equal(result, null);
  });
});
