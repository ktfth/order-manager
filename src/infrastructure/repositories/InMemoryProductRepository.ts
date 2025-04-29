import { Product } from "../../domain/entities/Product.js";
import { ProductId } from "../../shared/types/BrandedTypes.js";
import { ProductRepository } from "../../domain/repositories/ProductRepository.js";

export class InMemoryProductRepository implements ProductRepository {
  private products: Map<ProductId, Product> = new Map();

  async save(product: Product): Promise<void> {
    this.products.set(product.getId(), product);
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }
}
