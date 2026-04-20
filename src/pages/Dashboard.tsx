import { useSyncExternalStore } from "react";
import { Package, AlertTriangle, TrendingUp, ShoppingCart, ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import AbcBadge from "@/components/AbcBadge";
import { getStockStatus, getAbcStats } from "@/data/inventory";
import { getProducts, getMovements, getAlerts, getOrders, subscribeProducts } from "@/hooks/useProductStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const products  = useSyncExternalStore(subscribeProducts, getProducts);
  const movements = useSyncExternalStore(subscribeProducts, getMovements);
  const alerts    = useSyncExternalStore(subscribeProducts, getAlerts);
  const orders    = useSyncExternalStore(subscribeProducts, getOrders);

  const abcData = getAbcStats(products);
  const totalStock = products.reduce((s, p) => s + p.stockActual, 0);
  const totalValue = products.reduce((s, p) => s + p.stockActual * p.price, 0);
  const lowStockCount = products.filter(p => { const s = getStockStatus(p); return s === "low" || s === "critical"; }).length;
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const pendingOrders = orders.filter(o => o.status === "pendiente").length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 lg:p-8 text-primary-foreground shadow-elev">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 0%, hsl(var(--accent)) 0%, transparent 50%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-80">
            <Activity className="w-3.5 h-3.5" /> Sistema Operativo · {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-2 tracking-tight">Dashboard de Inventario</h1>
          <p className="text-sm opacity-80 mt-1">Control Máximo-Mínimo · Algoritmos PO · EOQ · Clasificación AB</p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <div><span className="opacity-70">Valor inventario:</span> <span className="font-mono font-bold text-gradient-accent">${totalValue.toLocaleString()}</span></div>
            <div><span className="opacity-70">Productos activos:</span> <span className="font-mono font-bold">{products.length}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Productos" value={products.length} subtitle="catálogo activo" icon={Package} variant="primary" />
        <MetricCard title="Stock Total" value={totalStock.toLocaleString()} subtitle="unidades en inventario" icon={TrendingUp} variant="accent" />
        <MetricCard title="Alertas Activas" value={unreadAlerts} subtitle={`${lowStockCount} bajo PO`} icon={AlertTriangle} variant={unreadAlerts > 0 ? "destructive" : "default"} />
        <MetricCard title="Órdenes Sugeridas" value={pendingOrders} subtitle="generadas por EOQ" icon={ShoppingCart} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="surface-card rounded-xl p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-1">Clasificación AB</h2>
          <p className="text-[11px] text-muted-foreground mb-3">Pareto automático por valor anual</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={abcData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {abcData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {abcData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.fill }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-xl p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-3">Alertas Recientes</h2>
          <div className="space-y-2.5">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${!a.read ? "bg-destructive/5 border-destructive/20" : "bg-muted/40 border-border"}`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${a.type === "min" ? "text-destructive" : a.type === "max" ? "text-info" : "text-warning"}`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{a.productName}</p>
                  <p className="text-[11px] text-muted-foreground">{a.message}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">Sin alertas. Inventario saludable ✓</p>}
          </div>
        </div>

        <div className="surface-card rounded-xl p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-3">Movimientos Recientes</h2>
          <div className="space-y-2.5">
            {movements.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                {m.type === "entrada" ? <ArrowDownRight className="w-4 h-4 text-success shrink-0" /> : <ArrowUpRight className="w-4 h-4 text-destructive shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.productName}</p>
                  <p className="text-[10px] text-muted-foreground">{m.date} · {m.user}{m.metodo === "hid" ? " · HID" : ""}</p>
                </div>
                <span className={`text-xs font-mono font-bold ${m.type === "entrada" ? "text-success" : "text-destructive"}`}>
                  {m.type === "entrada" ? "+" : "-"}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card rounded-xl p-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-foreground mb-4">Productos con Atención Requerida</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ABC</th>
                <th className="text-right py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-right py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">PO</th>
                <th className="text-right py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">EOQ</th>
                <th className="text-right py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Máx</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => getStockStatus(p) !== "ok").map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{p.name}</td>
                  <td className="py-2.5 px-3"><AbcBadge classification={p.abcClass} /></td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">{p.stockActual}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{p.puntoOrden ?? "—"}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{p.eoq ?? "—"}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{p.stockMaximo}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={getStockStatus(p)} /></td>
                </tr>
              ))}
              {products.filter(p => getStockStatus(p) !== "ok").length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">Todos los productos están en niveles saludables ✓</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
