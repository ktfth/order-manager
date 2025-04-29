import { CustomerId, OrderId, ProductId } from '../shared/types/BrandedTypes';
import { describe, test } from 'node:test';

import { Customer } from '../domain/entities/Customer';
import { Email } from '../domain/value-objects/Email';
import { OrderAggregate } from '../domain/aggregates/OrderAggregate';
import { OrderItem } from '../domain/entities/OrderItem';
import { Price } from '../domain/value-objects/Price';
import { Quantity } from '../domain/value-objects/Quantity';
import assert from 'node:assert/strict';

describe('OrderItem', () => {
  test('deve calcular o total de um OrderItem corretamente', () => {
    const unitPrice = Price.create(10);
    const quantity = Quantity.create(3);
    const item = OrderItem.create('product-1' as ProductId, unitPrice, quantity);

    const total = item.getTotalPrice();
    assert.equal(total.getValue(), 30);
  });
});

describe('OrderAggregate', () => {
  test('deve calcular o total de um pedido com vários itens', () => {
    const item1 = OrderItem.create('product-1' as ProductId, Price.create(10), Quantity.create(2)); // 20
    const item2 = OrderItem.create('product-2' as ProductId, Price.create(15), Quantity.create(1)); // 15

    const customer = Customer.create('customer-1' as CustomerId, 'João Silva', Email.create('joao@example.com'));
    const order = OrderAggregate.create('order-1' as OrderId, customer, [item1, item2]);

    const total = order.calculateTotal();
    assert.equal(total.getValue(), 35);
  });

  test('não deve permitir criar um pedido vazio', () => {
    const customer = Customer.create('customer-2' as CustomerId, 'Maria Souza', Email.create('maria@example.com'));
    
    try {
      OrderAggregate.create('order-2' as OrderId, customer, []);
      assert.fail('Deveria ter lançado erro ao criar pedido vazio');
    } catch (error) {
      assert.match((error as Error).message, /at least one item/);
    }
  });
});
