// Motor matemático del sistema (margen de error 0%)
// Fórmulas oficiales de la propuesta técnica.

/** Punto de Orden: PO = (d × L) + SS */
export function puntoOrden(d: number, L: number, SS: number): number {
  return Math.ceil(d * L + SS);
}

/** Cantidad Óptima de Pedido: EOQ = √(2 D S / H) */
export function eoq(D: number, S: number, H: number): number {
  if (H <= 0) return 0;
  return Math.ceil(Math.sqrt((2 * D * S) / H));
}

/** Nivel Máximo: Máx = PO + EOQ */
export function nivelMaximo(PO: number, EOQ: number): number {
  return PO + EOQ;
}

/** Demanda mensual ajustada por factor estacional */
export function demandaAjustada(base: number, factor: number): number {
  return Math.round(base * factor * 100) / 100;
}

export interface AbcInput { id: string; valorAnual: number }
/** Clasificación AB (Pareto 80/20) — A: top 80% del valor; B: el resto */
export function clasificarAB<T extends AbcInput>(items: T[]): Record<string, "A" | "B"> {
  const sorted = [...items].sort((a, b) => b.valorAnual - a.valorAnual);
  const total = sorted.reduce((s, p) => s + p.valorAnual, 0);
  let acum = 0;
  const out: Record<string, "A" | "B"> = {};
  for (const p of sorted) {
    acum += p.valorAnual;
    out[p.id] = total > 0 && acum / total <= 0.8 ? "A" : "B";
  }
  return out;
}
