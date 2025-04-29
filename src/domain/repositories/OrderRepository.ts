import { OrderAggregate } from "../aggregates/OrderAggregate.js";
import { OrderId } from "../../shared/types/BrandedTypes.js";

export interface OrderRepository {
  save(order: OrderAggregate): Promise<void>;
  findById(id: OrderId): Promise<OrderAggregate | null>;
}