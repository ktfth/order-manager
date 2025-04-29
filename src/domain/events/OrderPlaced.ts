import { DomainEvent } from "./DomainEvent.js";
import { OrderId } from "../../shared/types/BrandedTypes.js";

export class OrderPlaced implements DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventName: string = 'OrderPlaced';
  public readonly orderId: OrderId;

  constructor(orderId: OrderId) {
    this.orderId = orderId;
    this.occurredAt = new Date();
  }
}
