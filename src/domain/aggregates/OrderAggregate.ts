import { Customer } from "../entities/Customer";
import { OrderId } from "../../shared/types/BrandedTypes";
import { OrderItem } from "../entities/OrderItem";
import { Price } from "../value-objects/Price";

export class OrderAggregate {
  private readonly id: OrderId;
  private customer: Customer;
  private items: OrderItem[];

  private constructor(id: OrderId, customer: Customer, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error("Order must have at least one item.");
    }

    this.id = id;
    this.customer = customer;
    this.items = items;
  }

  public static create(id: OrderId, customer: Customer, items: OrderItem[]): OrderAggregate {
    return new OrderAggregate(id, customer, items);
  }

  public getId(): OrderId {
    return this.id;
  }

  public getCustomer(): Customer {
    return this.customer;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public calculateTotal(): Price {
    let totalValue = this.items.reduce((sum, item) => sum + item.getTotalPrice().getValue(), 0);
    return Price.create(totalValue);
  }
}
