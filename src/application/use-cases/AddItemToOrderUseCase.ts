import { OrderId, ProductId } from "../../shared/types/BrandedTypes.js";

import { OrderItem } from "../../domain/entities/OrderItem.js";
import { OrderRepository } from "../../domain/repositories/OrderRepository.js";
import { ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { Quantity } from "../../domain/value-objects/Quantity.js";

type AddItemToOrderInput = {
  orderId: OrderId;
  productId: ProductId;
  quantity: number;
};

export class AddItemToOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository
  ) {}

  public async execute(input: AddItemToOrderInput): Promise<void> {
    const order = await this.orderRepo.findById(input.orderId);
    if (!order) throw new Error(`Order not found: ${input.orderId}`);

    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new Error(`Product not found: ${input.productId}`);

    if (input.quantity > product.getAvailableQuantity().getValue()) {
      throw new Error(`Not enough stock for product ${product.getName()}`);
    }

    const quantity = Quantity.create(input.quantity);
    const orderItem = OrderItem.create(product.getId(), product.getPrice(), quantity);

    product.decreaseStock(quantity);
    await this.productRepo.save(product);

    order.addItem(orderItem);
    await this.orderRepo.save(order);
  }
}
