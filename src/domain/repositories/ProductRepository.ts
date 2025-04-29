import { Product } from "../entities/Product.js";
import { ProductId } from "../../shared/types/BrandedTypes.js";

export interface ProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  save(product: Product): Promise<void>;
}
