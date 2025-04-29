// src/domain/entities/Product

import { Price } from "../value-objects/Price.js";
import { ProductId } from "../../shared/types/BrandedTypes.js";
import { Quantity } from "../value-objects/Quantity.js";

export class Product {
  private readonly id: ProductId;
  private readonly name: string;
  private price: Price;
  private availableQuantity: Quantity;

  private constructor(
    id: ProductId,
    name: string,
    price: Price,
    availableQuantity: Quantity
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.availableQuantity = availableQuantity;
  }

  public static create(
    id: ProductId,
    name: string,
    price: Price,
    availableQuantity: Quantity
  ): Product {
    if (!name || name.trim() === "") {
      throw new Error("Product name cannot be empty.");
    }
    return new Product(id, name.trim(), price, availableQuantity);
  }

  public getId(): ProductId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getAvailableQuantity(): Quantity {
    return this.availableQuantity;
  }

  public decreaseStock(quantity: Quantity): void {
    if (quantity.getValue() > this.availableQuantity.getValue()) {
      throw new Error("Cannot decrease stock below zero.");
    }
    this.availableQuantity = this.availableQuantity.minus(quantity);
  }
}
