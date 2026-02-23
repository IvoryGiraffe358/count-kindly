import { Package, AlertTriangle, TrendingUp, ShoppingCart, ArrowDownRight, ArrowUpRight } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import AbcBadge from "@/components/AbcBadge";
import { products, alerts, movements, getStockStatus, getAbcStats } from "@/data/inventory";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const abcData = getAbcStats(products);
const totalStock = products.reduce((sum, p) => sum + p.stockActual, 0);
const lowStockCount = products.filter(p => {
  const s = getStockStatus(p);
  return s === "low" || s === "critical";
}).length;
const unreadAlerts = alerts.filter(a => !a.read).length;

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen del inventario · {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Productos" value={products.length} subtitle="de 500 capacidad" icon={Package} />
        <MetricCard title="Stock Total" value={totalStock.toLocaleString()} subtitle="unidades en inventario" icon={TrendingUp} variant="accent" />
        <MetricCard title="Alertas Activas" value={unreadAlerts} subtitle={`${lowStockCount} productos bajo mínimo`} icon={AlertTriangle} variant={unreadAlerts > 0 ? "destructive" : "default"} />
        <MetricCard title="Órdenes Pendientes" value={1} subtitle="Distribuidora Centro" icon={ShoppingCart} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ABC Chart */}
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-4">Clasificación ABC</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={abcData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {abcData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
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

        {/* Recent Alerts */}
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-4">Alertas Recientes</h2>
          <div className="space-y-3">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-md border ${!alert.read ? "bg-destructive/5 border-destructive/15" : "bg-muted/50 border-border"}`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === "min" ? "text-destructive" : alert.type === "max" ? "text-info" : "text-warning"}`} />
                <div>
                  <p className="text-xs font-medium text-foreground">{alert.productName}</p>
                  <p className="text-[11px] text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground mb-4">Movimientos Recientes</h2>
          <div className="space-y-3">
            {movements.slice(0, 5).map(mov => (
              <div key={mov.id} className="flex items-center gap-3 p-2.5 rounded-md bg-muted/30">
                {mov.type === "entrada" ? (
                  <ArrowDownRight className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{mov.productName}</p>
                  <p className="text-[11px] text-muted-foreground">{mov.date} · {mov.user}</p>
                </div>
                <span className={`text-xs font-mono font-medium ${mov.type === "entrada" ? "text-success" : "text-destructive"}`}>
                  {mov.type === "entrada" ? "+" : "-"}{mov.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Product Overview */}
      <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-foreground mb-4">Productos con Atención Requerida</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ABC</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rango</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => getStockStatus(p) !== "ok").map(product => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{product.name}</td>
                  <td className="py-2.5 px-3"><AbcBadge classification={product.abcClass} /></td>
                  <td className="py-2.5 px-3 font-mono text-foreground">{product.stockActual}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{product.stockMinimo} – {product.stockMaximo}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={getStockStatus(product)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
