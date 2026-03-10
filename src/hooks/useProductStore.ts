import { useState, useCallback } from "react";
import { Product, products as initialProducts } from "@/data/inventory";

// Simple global store for products
let globalProducts: Product[] = [...initialProducts];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

export function addProduct(product: Product) {
  globalProducts = [...globalProducts, product];
  notify();
}

export function getProducts() {
  return globalProducts;
}

export function useProductStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return { products: globalProducts, addProduct };
}
