import type { Product } from "../types/product";
import data from "../../products.json";

export const products: Product[] = data.products;

export const newProducts: Product[] = products.filter(
  (product) => product.is_new === true,
);

export const productsById: Map<string, Product> = new Map(
  products.map((product) => [product.id, product]),
);
