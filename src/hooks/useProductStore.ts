import {
  Product,
  products as initialProducts,
  InventoryMovement,
  movements as initialMovements,
  Alert,
  alerts as initialAlerts,
  OrderCompra,
  orders as initialOrders,
} from "@/data/inventory";
import { puntoOrden, eoq, nivelMaximo, demandaAjustada, clasificarAB } from "@/lib/inventoryMath";

// Recalcula PO/EOQ/Máx para un producto y devuelve copia normalizada
function recalc(p: Product): Product {
  const dBase = p.demandaDiaria ?? 0;
  const factor = p.factorEstacional ?? 1;
  const dAjust = demandaAjustada(dBase, factor);
  const PO = puntoOrden(dAjust, p.tiempoEntrega ?? 1, p.stockSeguridad ?? 0);
  const D = dAjust * 365;
  const EOQ = eoq(D, p.costoOrden ?? 0, p.costoMantto ?? 0);
  const MAX = nivelMaximo(PO, EOQ);
  return {
    ...p,
    puntoOrden: PO,
    eoq: EOQ,
    stockMinimo: PO || p.stockMinimo,
    stockMaximo: MAX || p.stockMaximo,
  };
}

// Reclasifica AB automáticamente con valor anual = demanda × precio × 365
function reclassify(prods: Product[]): Product[] {
  const map = clasificarAB(
    prods.map(p => ({ id: p.id, valorAnual: (p.demandaDiaria ?? 0) * p.price * 365 }))
  );
  return prods.map(p => ({ ...p, abcClass: map[p.id] ?? p.abcClass }));
}

let globalProducts: Product[] = reclassify(initialProducts.map(recalc));
let globalMovements: InventoryMovement[] = [...initialMovements];
let globalAlerts: Alert[] = [...initialAlerts];
let globalOrders: OrderCompra[] = [...initialOrders];
let storeListeners: Array<() => void> = [];

function notify() { storeListeners.forEach(l => l()); }

function checkAlertsAndOrders(p: Product) {
  const today = new Date().toISOString().split("T")[0];

  if (p.stockActual <= (p.puntoOrden ?? p.stockMinimo)) {
    globalAlerts = [
      {
        id: `al-${Date.now()}-${p.id}`,
        productId: p.id,
        productName: p.name,
        type: "min",
        message: `Stock ${p.stockActual} ≤ Punto de Orden ${p.puntoOrden ?? p.stockMinimo}`,
        date: today,
        read: false,
      },
      ...globalAlerts,
    ];
    // Generar orden sugerida con cantidad = EOQ (sin duplicar pendientes)
    const yaPendiente = globalOrders.some(o => o.status === "pendiente" && o.items.some(i => i.productName === p.name));
    if (!yaPendiente && (p.eoq ?? 0) > 0) {
      globalOrders = [
        {
          id: `oc-${Date.now()}-${p.id}`,
          date: today,
          supplier: p.supplier,
          status: "pendiente",
          items: [{ productName: p.name, quantity: p.eoq ?? 0 }],
          auto: true,
        },
        ...globalOrders,
      ];
    }
  } else if (p.stockActual > p.stockMaximo) {
    globalAlerts = [
      {
        id: `al-${Date.now()}-${p.id}`,
        productId: p.id,
        productName: p.name,
        type: "max",
        message: `Stock ${p.stockActual} > Máximo ${p.stockMaximo}`,
        date: today,
        read: false,
      },
      ...globalAlerts,
    ];
  }
}

export function addProduct(product: Product) {
  globalProducts = reclassify([...globalProducts, recalc(product)]);
  notify();
}

export function updateProductStock(
  productId: string,
  delta: number,
  userName: string,
  metodo: "hid" | "manual" = "manual"
) {
  const product = globalProducts.find(p => p.id === productId);
  if (!product) return;

  globalProducts = globalProducts.map(p =>
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
    metodo,
  };
  globalMovements = [movement, ...globalMovements];

  const updated = globalProducts.find(p => p.id === productId)!;
  checkAlertsAndOrders(updated);

  notify();
}

export function markAlertRead(id: string) {
  globalAlerts = globalAlerts.map(a => (a.id === id ? { ...a, read: true } : a));
  notify();
}

export function updateOrderStatus(id: string, status: OrderCompra["status"]) {
  globalOrders = globalOrders.map(o => (o.id === id ? { ...o, status } : o));
  notify();
}

export const getProducts  = () => globalProducts;
export const getMovements = () => globalMovements;
export const getAlerts    = () => globalAlerts;
export const getOrders    = () => globalOrders;

export function subscribeProducts(cb: () => void) {
  storeListeners.push(cb);
  return () => { storeListeners = storeListeners.filter(l => l !== cb); };
}
