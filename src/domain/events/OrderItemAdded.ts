import { OrderId, ProductId } from "../../shared/types/BrandedTypes.js";

import { DomainEvent } from "./DomainEvent.js";

export class OrderItemAdded implements DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventName: string = 'OrderItemAdded';
  public readonly orderId: OrderId;
  public readonly productId: ProductId;
  public readonly quantity: number;

  constructor(orderId: OrderId, productId: ProductId, quantity: number) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.occurredAt = new Date();
  }
}
