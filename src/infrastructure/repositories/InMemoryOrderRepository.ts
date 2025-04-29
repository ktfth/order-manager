import { OrderAggregate } from "../../domain/aggregates/OrderAggregate.js";
import { OrderId } from "../../shared/types/BrandedTypes.js";
import { OrderRepository } from "../../domain/repositories/OrderRepository.js";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<OrderId, OrderAggregate> = new Map();

  async save(order: OrderAggregate): Promise<void> {
    this.orders.set(order.getId(), order);
  }

  async findById(id: OrderId): Promise<OrderAggregate | null> {
    return this.orders.get(id) ?? null;
  }
}
