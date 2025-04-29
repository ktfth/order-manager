import { Customer } from "../entities/Customer";
import { DomainEvent } from "../events/DomainEvent";
import { OrderId } from "../../shared/types/BrandedTypes";
import { OrderItem } from "../entities/OrderItem";
import { OrderItemAdded } from "../events/OrderItemAdded";
import { OrderPlaced } from "../events/OrderPlaced"; // Importar o evento
import { Price } from "../value-objects/Price";

export class OrderAggregate {
  private readonly id: OrderId;
  private readonly customer: Customer;
  private readonly items: OrderItem[];
  private readonly events: DomainEvent[] = []; // Inicializa lista de eventos

  private constructor(id: OrderId, customer: Customer, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }
    this.id = id;
    this.customer = customer;
    this.items = items;
  }

  public static create(id: OrderId, customer: Customer, items: OrderItem[]): OrderAggregate {
    const order = new OrderAggregate(id, customer, items);
    order.record(new OrderPlaced(id)); // <-- REGISTRANDO EVENTO AQUI
    return order;
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
    const totalValue = this.items.reduce((sum, item) => {
      return sum + item.getTotalPrice().getValue();
    }, 0);
    return Price.create(totalValue);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.events]; // Retorna uma cópia protegida
  }

  private record(event: DomainEvent): void {
    this.events.push(event);
  }

  public addItem(item: OrderItem): void {
    this.items.push(item); // Adiciona o item à lista de itens
    this.record(new OrderItemAdded(this.id, item.getProductId(), item.getQuantity().getValue())); // Registra evento
  }
}

