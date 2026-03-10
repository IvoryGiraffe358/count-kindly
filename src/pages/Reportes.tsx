import { useSyncExternalStore } from "react";
import { getStockStatus } from "@/data/inventory";
import { getProducts, getMovements, subscribeProducts } from "@/hooks/useProductStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reportes() {
  const products = useSyncExternalStore(subscribeProducts, getProducts);
  const movements = useSyncExternalStore(subscribeProducts, getMovements);

  const stockByCategory = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.stockActual;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const totalValue = products.reduce((s, p) => s + p.stockActual * p.price, 0);
  const lowStock = products.filter(p => getStockStatus(p) === "low" || getStockStatus(p) === "critical").length;
  const excessStock = products.filter(p => getStockStatus(p) === "excess").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen general del inventario</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Valor Total Inventario</p>
          <p className="text-2xl font-bold text-foreground mt-1 font-mono">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Productos Bajo Mínimo</p>
          <p className="text-2xl font-bold text-destructive mt-1">{lowStock}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Productos en Exceso</p>
          <p className="text-2xl font-bold text-info mt-1">{excessStock}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-foreground mb-4">Stock por Categoría</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-foreground mb-4">Últimos Movimientos</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Fecha</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Producto</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Tipo</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Cantidad</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 text-muted-foreground">{m.date}</td>
                <td className="py-2.5 px-3 font-medium text-foreground">{m.productName}</td>
                <td className="py-2.5 px-3">
                  <span className={`text-xs font-medium ${m.type === "entrada" ? "text-success" : "text-destructive"}`}>
                    {m.type === "entrada" ? "Entrada" : "Salida"}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-foreground">{m.quantity}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
