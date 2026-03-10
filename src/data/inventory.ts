export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  abcClass: "A" | "B" | "C";
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  price: number;
  supplier: string;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  type: "min" | "max" | "seasonal";
  message: string;
  date: string;
  read: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "salida";
  quantity: number;
  date: string;
  user: string;
}

export interface OrderCompra {
  id: string;
  date: string;
  supplier: string;
  status: "pendiente" | "enviada" | "recibida";
  items: { productName: string; quantity: number }[];
}

export const products: Product[] = [
  { id: "1", barcode: "7501001234567", name: "El Universal", category: "Periódico Nacional", abcClass: "A", stockActual: 120, stockMinimo: 50, stockMaximo: 200, price: 18.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-23" },
  { id: "2", barcode: "7501001234568", name: "Reforma", category: "Periódico Nacional", abcClass: "A", stockActual: 95, stockMinimo: 40, stockMaximo: 180, price: 22.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-23" },
  { id: "3", barcode: "7501001234569", name: "La Jornada", category: "Periódico Nacional", abcClass: "A", stockActual: 85, stockMinimo: 35, stockMaximo: 160, price: 15.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-22" },
  { id: "4", barcode: "7501001234570", name: "Excélsior", category: "Periódico Nacional", abcClass: "B", stockActual: 60, stockMinimo: 25, stockMaximo: 120, price: 20.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-22" },
  { id: "5", barcode: "7501001234571", name: "Milenio", category: "Periódico Nacional", abcClass: "B", stockActual: 45, stockMinimo: 20, stockMaximo: 100, price: 18.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-21" },
  { id: "6", barcode: "7501001234572", name: "El Financiero", category: "Periódico Financiero", abcClass: "B", stockActual: 30, stockMinimo: 15, stockMaximo: 80, price: 25.00, supplier: "Distribuidora Especializada", lastUpdated: "2026-02-21" },
  { id: "7", barcode: "7501001234573", name: "Récord", category: "Periódico Deportivo", abcClass: "B", stockActual: 55, stockMinimo: 30, stockMaximo: 110, price: 16.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-22" },
  { id: "8", barcode: "7501001234574", name: "Esto", category: "Periódico Deportivo", abcClass: "C", stockActual: 12, stockMinimo: 15, stockMaximo: 60, price: 14.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-20" },
  { id: "9", barcode: "7501001234575", name: "El Heraldo", category: "Periódico Local", abcClass: "C", stockActual: 20, stockMinimo: 10, stockMaximo: 50, price: 12.00, supplier: "Distribuidora Local", lastUpdated: "2026-02-20" },
  { id: "10", barcode: "7501001234576", name: "Metro", category: "Periódico Local", abcClass: "C", stockActual: 65, stockMinimo: 10, stockMaximo: 40, price: 10.00, supplier: "Distribuidora Local", lastUpdated: "2026-02-19" },
  { id: "11", barcode: "7501001234577", name: "El Sol de México", category: "Periódico Nacional", abcClass: "C", stockActual: 18, stockMinimo: 10, stockMaximo: 45, price: 15.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-19" },
  { id: "12", barcode: "7501001234578", name: "Proceso", category: "Revista", abcClass: "A", stockActual: 40, stockMinimo: 20, stockMaximo: 80, price: 55.00, supplier: "Distribuidora Especializada", lastUpdated: "2026-02-23" },
  { id: "13", barcode: "KQ45010", name: "Edición Especial KQ", category: "Revista", abcClass: "B", stockActual: 25, stockMinimo: 10, stockMaximo: 60, price: 35.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-03-10" },
];

export const alerts: Alert[] = [
  { id: "a1", productId: "8", productName: "Esto", type: "min", message: "Stock por debajo del mínimo (12/15)", date: "2026-02-23", read: false },
  { id: "a2", productId: "10", productName: "Metro", type: "max", message: "Exceso de inventario (65/40 máx)", date: "2026-02-23", read: false },
  { id: "a3", productId: "1", productName: "El Universal", type: "seasonal", message: "Demanda estacional detectada: incremento 15%", date: "2026-02-22", read: true },
  { id: "a4", productId: "11", productName: "El Sol de México", type: "min", message: "Stock cercano al mínimo (18/10)", date: "2026-02-21", read: true },
];

export const movements: InventoryMovement[] = [
  { id: "m1", productId: "1", productName: "El Universal", type: "entrada", quantity: 50, date: "2026-02-23", user: "Carlos" },
  { id: "m2", productId: "2", productName: "Reforma", type: "salida", quantity: 30, date: "2026-02-23", user: "Ana" },
  { id: "m3", productId: "8", productName: "Esto", type: "salida", quantity: 8, date: "2026-02-22", user: "Carlos" },
  { id: "m4", productId: "12", productName: "Proceso", type: "entrada", quantity: 20, date: "2026-02-22", user: "Ana" },
  { id: "m5", productId: "3", productName: "La Jornada", type: "entrada", quantity: 40, date: "2026-02-21", user: "Carlos" },
];

export const orders: OrderCompra[] = [
  { id: "o1", date: "2026-02-23", supplier: "Distribuidora Centro", status: "pendiente", items: [{ productName: "Esto", quantity: 30 }, { productName: "La Jornada", quantity: 50 }] },
  { id: "o2", date: "2026-02-22", supplier: "Distribuidora Nacional", status: "enviada", items: [{ productName: "El Universal", quantity: 80 }] },
];

export function getStockStatus(product: Product): "ok" | "low" | "critical" | "excess" {
  if (product.stockActual > product.stockMaximo) return "excess";
  if (product.stockActual <= product.stockMinimo * 0.5) return "critical";
  if (product.stockActual <= product.stockMinimo) return "low";
  return "ok";
}

export function getAbcStats(prods: Product[]) {
  const a = prods.filter(p => p.abcClass === "A").length;
  const b = prods.filter(p => p.abcClass === "B").length;
  const c = prods.filter(p => p.abcClass === "C").length;
  return [
    { name: "Clase A", value: a, fill: "hsl(var(--chart-a))" },
    { name: "Clase B", value: b, fill: "hsl(var(--chart-b))" },
    { name: "Clase C", value: c, fill: "hsl(var(--chart-c))" },
  ];
}
