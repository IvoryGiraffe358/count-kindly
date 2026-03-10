import { Product, products as initialProducts, InventoryMovement, movements as initialMovements } from "@/data/inventory";

let globalProducts: Product[] = [...initialProducts];
let globalMovements: InventoryMovement[] = [...initialMovements];
let storeListeners: Array<() => void> = [];

function notify() {
  storeListeners.forEach((l) => l());
}

export function addProduct(product: Product) {
  globalProducts = [...globalProducts, product];
  notify();
}

export function updateProductStock(productId: string, delta: number, userName: string) {
  const product = globalProducts.find((p) => p.id === productId);
  if (!product) return;

  globalProducts = globalProducts.map((p) =>
    p.id === productId
      ? { ...p, stockActual: Math.max(0, p.stockActual + delta), lastUpdated: new Date().toISOString().split("T")[0] }
      : p
  );

  const movement: InventoryMovement = {
    id: `m-${Date.now()}`,
    productId,
    productName: product.name,
    type: delta > 0 ? "entrada" : "salida",
    quantity: Math.abs(delta),
    date: new Date().toISOString().split("T")[0],
    user: userName,
  };
  globalMovements = [movement, ...globalMovements];

  notify();
}

export function getProducts() {
  return globalProducts;
}

export function getMovements() {
  return globalMovements;
}

export function subscribeProducts(cb: () => void) {
  storeListeners.push(cb);
  return () => {
    storeListeners = storeListeners.filter((l) => l !== cb);
  };
}
