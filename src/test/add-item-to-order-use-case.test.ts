import { CustomerId, OrderId, ProductId } from '../shared/types/BrandedTypes';
import { describe, test } from 'node:test';

import { AddItemToOrderUseCase } from '../application/use-cases/AddItemToOrderUseCase';
import { Customer } from '../domain/entities/Customer';
import { Email } from '../domain/value-objects/Email';
import { InMemoryOrderRepository } from '../infrastructure/repositories/InMemoryOrderRepository';
import { InMemoryProductRepository } from '../infrastructure/repositories/InMemoryProductRepository';
import { PlaceOrderUseCase } from '../application/use-cases/PlaceOrderUseCase';
import { Price } from '../domain/value-objects/Price';
import { Product } from '../domain/entities/Product';
import { Quantity } from '../domain/value-objects/Quantity';
import assert from 'node:assert/strict';

describe('AddItemToOrderUseCase', () => {
  test('deve adicionar um novo item a um pedido existente', async () => {
    // Setup repositórios
    const orderRepo = new InMemoryOrderRepository();
    const productRepo = new InMemoryProductRepository();

    // Produtos
    const p1 = Product.create('p1' as ProductId, 'Notebook', Price.create(3000), Quantity.create(5));
    const p2 = Product.create('p2' as ProductId, 'Mouse', Price.create(150), Quantity.create(10));
    await productRepo.save(p1);
    await productRepo.save(p2);

    // Cliente
    const customer = Customer.create('c1' as CustomerId, 'Ana Compradora', Email.create('ana@teste.com'));

    // Pedido inicial com apenas o produto p1
    const placeOrder = new PlaceOrderUseCase(orderRepo, productRepo);
    await placeOrder.execute({
      orderId: 'o1' as OrderId,
      customer,
      items: [{ productId: 'p1' as ProductId, quantity: 1 }] // total inicial: 3000
    });

    // Use case para adicionar o p2
    const addItemUseCase = new AddItemToOrderUseCase(orderRepo, productRepo);
    await addItemUseCase.execute({
      orderId: 'o1' as OrderId,
      productId: 'p2' as ProductId,
      quantity: 2 // 150 * 2 = 300
    });

    // Verificações
    const updatedOrder = await orderRepo.findById('o1' as OrderId);
    assert.ok(updatedOrder, 'Pedido deve existir');
    assert.equal(updatedOrder?.getItems().length, 2);
    assert.equal(updatedOrder?.calculateTotal().getValue(), 3300);

    // Verificar estoque atualizado
    const updatedP2 = await productRepo.findById('p2' as ProductId);
    assert.equal(updatedP2?.getAvailableQuantity().getValue(), 8);
  });
});
