import { Price } from "../value-objects/Price";
import { ProductId } from "../../shared/types/BrandedTypes";
import { Quantity } from "../value-objects/Quantity";

export class OrderItem {
  private readonly productId: ProductId;
  private readonly unitPrice: Price;
  private readonly quantity: Quantity;

  private constructor(productId: ProductId, unitPrice: Price, quantity: Quantity) {
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  public static create(productId: ProductId, unitPrice: Price, quantity: Quantity): OrderItem {
    return new OrderItem(productId, unitPrice, quantity);
  }

  public getProductId(): ProductId {
    return this.productId;
  }

  public getQuantity(): Quantity {
    return this.quantity;
  }

  public getUnitPrice(): Price {
    return this.unitPrice;
  }

  public getTotalPrice(): Price {
    const totalValue = this.unitPrice.getValue() * this.quantity.getValue();
    return Price.create(totalValue);
  }
}