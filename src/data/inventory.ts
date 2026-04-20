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
  // Parámetros matemáticos (opcionales, para PO/EOQ/Máx)
  demandaDiaria?: number;
  factorEstacional?: number;
  tiempoEntrega?: number;   // L (días)
  stockSeguridad?: number;  // SS
  costoOrden?: number;      // S
  costoMantto?: number;     // H
  puntoOrden?: number;      // PO calculado
  eoq?: number;             // EOQ calculado
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
  metodo?: "hid" | "manual";
}

export interface OrderCompra {
  id: string;
  date: string;
  supplier: string;
  status: "pendiente" | "enviada" | "recibida";
  items: { productName: string; quantity: number }[];
  auto?: boolean;
}

export const products: Product[] = [
  { id: "1", barcode: "7501001234567", name: "El Universal", category: "Periódico Nacional", abcClass: "A", stockActual: 120, stockMinimo: 50, stockMaximo: 200, price: 18.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-23", demandaDiaria: 25, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 15, costoOrden: 50, costoMantto: 2 },
  { id: "2", barcode: "7501001234568", name: "Reforma", category: "Periódico Nacional", abcClass: "A", stockActual: 95, stockMinimo: 40, stockMaximo: 180, price: 22.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-23", demandaDiaria: 22, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 12, costoOrden: 50, costoMantto: 2 },
  { id: "3", barcode: "7501001234569", name: "La Jornada", category: "Periódico Nacional", abcClass: "A", stockActual: 85, stockMinimo: 35, stockMaximo: 160, price: 15.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-22", demandaDiaria: 20, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 10, costoOrden: 45, costoMantto: 1.5 },
  { id: "4", barcode: "7501001234570", name: "Excélsior", category: "Periódico Nacional", abcClass: "B", stockActual: 60, stockMinimo: 25, stockMaximo: 120, price: 20.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-22", demandaDiaria: 14, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 8, costoOrden: 45, costoMantto: 1.8 },
  { id: "5", barcode: "7501001234571", name: "Milenio", category: "Periódico Nacional", abcClass: "B", stockActual: 45, stockMinimo: 20, stockMaximo: 100, price: 18.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-21", demandaDiaria: 12, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 6, costoOrden: 40, costoMantto: 1.5 },
  { id: "6", barcode: "7501001234572", name: "El Financiero", category: "Periódico Financiero", abcClass: "B", stockActual: 30, stockMinimo: 15, stockMaximo: 80, price: 25.00, supplier: "Distribuidora Especializada", lastUpdated: "2026-02-21", demandaDiaria: 8, factorEstacional: 1.0, tiempoEntrega: 3, stockSeguridad: 5, costoOrden: 55, costoMantto: 2.2 },
  { id: "7", barcode: "7501001234573", name: "Récord", category: "Periódico Deportivo", abcClass: "B", stockActual: 55, stockMinimo: 30, stockMaximo: 110, price: 16.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-02-22", demandaDiaria: 13, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 8, costoOrden: 40, costoMantto: 1.5 },
  { id: "8", barcode: "7501001234574", name: "Esto", category: "Periódico Deportivo", abcClass: "C", stockActual: 12, stockMinimo: 15, stockMaximo: 60, price: 14.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-20", demandaDiaria: 7, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 4, costoOrden: 35, costoMantto: 1.2 },
  { id: "9", barcode: "7501001234575", name: "El Heraldo", category: "Periódico Local", abcClass: "C", stockActual: 20, stockMinimo: 10, stockMaximo: 50, price: 12.00, supplier: "Distribuidora Local", lastUpdated: "2026-02-20", demandaDiaria: 6, factorEstacional: 1.0, tiempoEntrega: 1, stockSeguridad: 3, costoOrden: 30, costoMantto: 1.0 },
  { id: "10", barcode: "7501001234576", name: "Metro", category: "Periódico Local", abcClass: "C", stockActual: 65, stockMinimo: 10, stockMaximo: 40, price: 10.00, supplier: "Distribuidora Local", lastUpdated: "2026-02-19", demandaDiaria: 5, factorEstacional: 1.0, tiempoEntrega: 1, stockSeguridad: 2, costoOrden: 25, costoMantto: 0.8 },
  { id: "11", barcode: "7501001234577", name: "El Sol de México", category: "Periódico Nacional", abcClass: "C", stockActual: 18, stockMinimo: 10, stockMaximo: 45, price: 15.00, supplier: "Distribuidora Centro", lastUpdated: "2026-02-19", demandaDiaria: 5, factorEstacional: 1.0, tiempoEntrega: 2, stockSeguridad: 3, costoOrden: 35, costoMantto: 1.2 },
  { id: "12", barcode: "7501001234578", name: "Proceso", category: "Revista", abcClass: "A", stockActual: 40, stockMinimo: 20, stockMaximo: 80, price: 55.00, supplier: "Distribuidora Especializada", lastUpdated: "2026-02-23", demandaDiaria: 10, factorEstacional: 1.2, tiempoEntrega: 3, stockSeguridad: 6, costoOrden: 60, costoMantto: 3 },
  { id: "13", barcode: "KQ45010", name: "Edición Especial KQ", category: "Revista", abcClass: "B", stockActual: 25, stockMinimo: 10, stockMaximo: 60, price: 35.00, supplier: "Distribuidora Nacional", lastUpdated: "2026-03-10", demandaDiaria: 8, factorEstacional: 1.4, tiempoEntrega: 3, stockSeguridad: 5, costoOrden: 50, costoMantto: 2 },
];

export const alerts: Alert[] = [];

export const movements: InventoryMovement[] = [
  { id: "m1", productId: "1", productName: "El Universal", type: "entrada", quantity: 50, date: "2026-02-23", user: "Carlos", metodo: "manual" },
  { id: "m2", productId: "2", productName: "Reforma", type: "salida", quantity: 30, date: "2026-02-23", user: "Ana", metodo: "manual" },
  { id: "m3", productId: "8", productName: "Esto", type: "salida", quantity: 8, date: "2026-02-22", user: "Carlos", metodo: "manual" },
];

export const orders: OrderCompra[] = [];

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
