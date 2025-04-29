import { CustomerId, OrderId, ProductId } from '../shared/types/BrandedTypes.js';
import { describe, test } from 'node:test';

import { Customer } from '../domain/entities/Customer.js';
import { Email } from '../domain/value-objects/Email.js';
import { InMemoryOrderRepository } from '../infrastructure/repositories/InMemoryOrderRepository.js';
import { InMemoryProductRepository } from '../infrastructure/repositories/InMemoryProductRepository.js';
import { PlaceOrderUseCase } from '../application/use-cases/PlaceOrderUseCase.js';
import { Price } from '../domain/value-objects/Price.js';
import { Product } from '../domain/entities/Product.js';
import { Quantity } from '../domain/value-objects/Quantity.js';
import assert from 'node:assert/strict';

describe('PlaceOrderUseCase', () => {
  test('deve criar um pedido válido e persistir', async () => {
    // Setup dos repositórios em memória
    const orderRepo = new InMemoryOrderRepository();
    const productRepo = new InMemoryProductRepository();

    // Criando produtos e salvando no repositório
    const p1 = Product.create('p1' as ProductId, 'Caderno', Price.create(15.5), Quantity.create(10));
    const p2 = Product.create('p2' as ProductId, 'Caneta', Price.create(4), Quantity.create(20));
    await productRepo.save(p1);
    await productRepo.save(p2);

    // Criando cliente
    const customer = Customer.create('c1' as CustomerId, 'Carlos Teste', Email.create('carlos@teste.com'));

    // Instanciando o use case
    const useCase = new PlaceOrderUseCase(orderRepo, productRepo);

    // Executando o caso de uso
    await useCase.execute({
      orderId: 'o1' as OrderId,
      customer,
      items: [
        { productId: 'p1' as ProductId, quantity: 2 }, // 15.5 * 2 = 31
        { productId: 'p2' as ProductId, quantity: 3 }  // 4 * 3 = 12
      ]
    });

    // Verificação: pedido foi salvo?
    const savedOrder = await orderRepo.findById('o1' as OrderId);
    assert.ok(savedOrder, 'Pedido deveria ter sido persistido');
    assert.equal(savedOrder?.getItems().length, 2);
    assert.equal(savedOrder?.calculateTotal().getValue(), 43);

    // Verificação: estoque dos produtos foi atualizado?
    const updatedP1 = await productRepo.findById('p1' as ProductId);
    const updatedP2 = await productRepo.findById('p2' as ProductId);
    assert.equal(updatedP1?.getAvailableQuantity().getValue(), 8);
    assert.equal(updatedP2?.getAvailableQuantity().getValue(), 17);
  });
});
