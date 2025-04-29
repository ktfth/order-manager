import { OrderId, ProductId } from "../../shared/types/BrandedTypes";

import { Customer } from "../../domain/entities/Customer";
import { OrderAggregate } from "../../domain/aggregates/OrderAggregate";
import { OrderItem } from "../../domain/entities/OrderItem";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { Quantity } from "../../domain/value-objects/Quantity";

type PlaceOrderInput = {
  orderId: OrderId;
  customer: Customer;
  items: {
    productId: ProductId;
    quantity: number;
  }[];
};

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository
  ) {}

  public async execute(input: PlaceOrderInput): Promise<void> {
    const orderItems: OrderItem[] = [];

    for (const item of input.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (item.quantity > product.getAvailableQuantity().getValue()) {
        throw new Error(`Insufficient stock for product ${product.getName()}`);
      }

      const quantity = Quantity.create(item.quantity);
      const orderItem = OrderItem.create(product.getId(), product.getPrice(), quantity);

      product.decreaseStock(quantity); // opcional, se quiser atualizar estoque aqui
      await this.productRepo.save(product);

      orderItems.push(orderItem);
    }

    const order = OrderAggregate.create(input.orderId, input.customer, orderItems);
    await this.orderRepo.save(order);
  }
}
