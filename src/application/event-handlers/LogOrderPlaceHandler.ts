import { OrderPlaced } from "../../domain/events/OrderPlaced";

export async function LogOrderPlacedHandler(event: OrderPlaced): Promise<void> {
  console.log(`📦 Pedido ${event.orderId} criado em ${event.occurredAt.toISOString()}`);
}
