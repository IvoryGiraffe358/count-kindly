import { useSyncExternalStore } from "react";
import { getAbcStats } from "@/data/inventory";
import { getProducts, subscribeProducts } from "@/hooks/useProductStore";
import AbcBadge from "@/components/AbcBadge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const fills = ["hsl(var(--chart-a))", "hsl(var(--chart-b))", "hsl(var(--chart-c))"];

export default function Clasificacion() {
  const products = useSyncExternalStore(subscribeProducts, getProducts);

  const abcData = getAbcStats(products);
  const classAProducts = products.filter(p => p.abcClass === "A");
  const classBProducts = products.filter(p => p.abcClass === "B");
  const classCProducts = products.filter(p => p.abcClass === "C");

  const valueByClass = [
    { name: "Clase A", value: classAProducts.reduce((s, p) => s + p.stockActual * p.price, 0) },
    { name: "Clase B", value: classBProducts.reduce((s, p) => s + p.stockActual * p.price, 0) },
    { name: "Clase C", value: classCProducts.reduce((s, p) => s + p.stockActual * p.price, 0) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clasificación ABC</h1>
        <p className="text-sm text-muted-foreground mt-1">Análisis mensual basado en valor de consumo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribución por Cantidad</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={abcData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {abcData.map((_, i) => <Cell key={i} fill={fills[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-4">Valor en Inventario ($)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Valor"]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {valueByClass.map((_, i) => <Cell key={i} fill={fills[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {[
        { label: "Clase A", desc: "Alto valor · Control estricto", items: classAProducts },
        { label: "Clase B", desc: "Valor medio · Control moderado", items: classBProducts },
        { label: "Clase C", desc: "Bajo valor · Control simple", items: classCProducts },
      ].map(({ label, desc, items }) => (
        <div key={label} className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <AbcBadge classification={label.slice(-1) as "A" | "B" | "C"} />
            <div>
              <h2 className="text-sm font-semibold text-foreground">{label}</h2>
              <p className="text-xs text-muted-foreground">{desc} · {items.length} productos</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Producto</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Precio</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-foreground">{p.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">{p.stockActual}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">${p.price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">${(p.stockActual * p.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
