import { CustomerId, OrderId, ProductId } from "../shared/types/BrandedTypes";

import { Customer } from "../domain/entities/Customer";
import { DomainEventDispatcher } from "../domain/events/DomainEventDispatcher";
import { Email } from "../domain/value-objects/Email";
import { InMemoryOrderRepository } from "../infrastructure/repositories/InMemoryOrderRepository";
import { InMemoryProductRepository } from "../infrastructure/repositories/InMemoryProductRepository";
import { LogOrderPlacedHandler } from "../application/event-handlers/LogOrderPlacedHandler";
import { PlaceOrderUseCase } from "../application/use-cases/PlaceOrderUseCase";
import { Price } from "../domain/value-objects/Price";
import { Product } from "../domain/entities/Product";
import { Quantity } from "../domain/value-objects/Quantity";

// Função principal de simulação
async function simulatePlaceOrderFlow() {
  console.log('🚀 Iniciando simulação de criação de pedido...');

  // Setup repositórios
  const orderRepo = new InMemoryOrderRepository();
  const productRepo = new InMemoryProductRepository();

  // Setup dispatcher
  const dispatcher = new DomainEventDispatcher();
  dispatcher.register('OrderPlaced', LogOrderPlacedHandler);

  // Criar produtos
  const p1 = Product.create('p1' as ProductId, 'Notebook', Price.create(2500), Quantity.create(5));
  const p2 = Product.create('p2' as ProductId, 'Mouse Gamer', Price.create(150), Quantity.create(10));
  await productRepo.save(p1);
  await productRepo.save(p2);

  // Criar cliente
  const customer = Customer.create('c1' as CustomerId, 'Lucas Simulador', Email.create('lucas@teste.com'));

  // Executar caso de uso
  const placeOrder = new PlaceOrderUseCase(orderRepo, productRepo);
  await placeOrder.execute({
    orderId: 'o1' as OrderId,
    customer,
    items: [
      { productId: 'p1' as ProductId, quantity: 1 },
      { productId: 'p2' as ProductId, quantity: 2 }
    ]
  });

  // Buscar o pedido criado
  const order = await orderRepo.findById('o1' as OrderId);

  if (order) {
    console.log('✅ Pedido criado com sucesso.');
    console.log('Total do pedido:', order.calculateTotal().getValue());

    // Disparar eventos capturados
    await dispatcher.dispatchAll(order.getDomainEvents());
  } else {
    console.error('❌ Falha ao criar o pedido.');
  }
}

simulatePlaceOrderFlow();
