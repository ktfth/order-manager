import { CustomerId, OrderId, ProductId } from "../shared/types/BrandedTypes";

import { AddItemToOrderUseCase } from "../application/use-cases/AddItemToOrderUseCase";
import { Customer } from "../domain/entities/Customer";
import { DomainEvent } from "../domain/events/DomainEvent";
import { DomainEventDispatcher } from "../domain/events/DomainEventDispatcher";
import { Email } from "../domain/value-objects/Email";
import { InMemoryOrderRepository } from "../infrastructure/repositories/InMemoryOrderRepository";
import { InMemoryProductRepository } from "../infrastructure/repositories/InMemoryProductRepository";
import { LogOrderPlacedHandler } from "../application/event-handlers/LogOrderPlacedHandler";
import { PlaceOrderUseCase } from "../application/use-cases/PlaceOrderUseCase";
import { Price } from "../domain/value-objects/Price";
import { Product } from "../domain/entities/Product";
import { Quantity } from "../domain/value-objects/Quantity";
import http from "node:http";

const capturedEvents: DomainEvent[] = [];

// Setup de repositórios e dispatcher compartilhados
const orderRepo = new InMemoryOrderRepository();
const productRepo = new InMemoryProductRepository();
const dispatcher = new DomainEventDispatcher();
dispatcher.register("OrderPlaced", LogOrderPlacedHandler);

// Dados mockados fixos
const initializeData = async () => {
  await productRepo.save(
    Product.create(
      "p1" as ProductId,
      "Teclado",
      Price.create(200),
      Quantity.create(10)
    )
  );
  await productRepo.save(
    Product.create(
      "p2" as ProductId,
      "Mouse",
      Price.create(100),
      Quantity.create(15)
    )
  );
};

const logRequest = (req: http.IncomingMessage) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
};

const server = http.createServer(async (req, res) => {
  logRequest(req);

  if (req.method === "POST" && req.url === "/orders") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        const customer = Customer.create(
          data.customerId as CustomerId,
          data.customerName,
          Email.create(data.customerEmail)
        );

        const useCase = new PlaceOrderUseCase(orderRepo, productRepo);

        await useCase.execute({
          orderId: data.orderId as OrderId,
          customer,
          items: data.items.map((item: any) => ({
            productId: item.productId as ProductId,
            quantity: item.quantity
          }))
        });

        const order = await orderRepo.findById(data.orderId as OrderId);
        if (order) {
          await dispatcher.dispatchAll(order.getDomainEvents());
          capturedEvents.push(...order.getDomainEvents());
        }

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "created", orderId: data.orderId }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
    });
    return;
  }

  if (
    req.method === "POST" &&
    req.url?.startsWith("/orders/") &&
    req.url.endsWith("/items")
  ) {
    const parts = req.url.split("/");
    const orderId = parts[2] as OrderId;

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        const useCase = new AddItemToOrderUseCase(orderRepo, productRepo);
        await useCase.execute({
          orderId,
          productId: data.productId as ProductId,
          quantity: data.quantity
        });

        const order = await orderRepo.findById(orderId);
        if (order) {
          await dispatcher.dispatchAll(order.getDomainEvents());
          capturedEvents.push(...order.getDomainEvents());
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "item added" }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
    });
    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/orders/")) {
    const parts = req.url.split("/");
    const orderId = parts[2] as OrderId;

    const order = await orderRepo.findById(orderId);

    if (!order) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Pedido não encontrado" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        orderId,
        customerName: order.getCustomer().getName(),
        items: order.getItems().map((item) => ({
          productId: item.getProductId(),
          quantity: item.getQuantity().getValue(),
          unitPrice: item.getUnitPrice().getValue(),
          total: item.getTotalPrice().getValue()
        })),
        total: order.calculateTotal().getValue()
      })
    );
    return;
  }

  if (req.method === "GET" && req.url === "/events") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        capturedEvents.map((e) => ({
          type: e.eventName,
          time: e.occurredAt,
          ...e
        }))
      )
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

initializeData().then(() => {
  server.listen(3000, () => {
    console.log("🚀 Servidor HTTP escutando em http://localhost:3000");
  });
});
