import { Product, products as initialProducts } from "@/data/inventory";

let globalProducts: Product[] = [...initialProducts];
let storeListeners: Array<() => void> = [];

function notify() {
  storeListeners.forEach((l) => l());
}

export function addProduct(product: Product) {
  globalProducts = [...globalProducts, product];
  notify();
}

export function updateProductStock(productId: string, delta: number) {
  globalProducts = globalProducts.map((p) =>
    p.id === productId
      ? { ...p, stockActual: Math.max(0, p.stockActual + delta), lastUpdated: new Date().toISOString().split("T")[0] }
      : p
  );
  notify();
}

export function getProducts() {
  return globalProducts;
}

export function subscribeProducts(cb: () => void) {
  storeListeners.push(cb);
  return () => {
    storeListeners = storeListeners.filter((l) => l !== cb);
  };
}
