import { orders } from "@/data/inventory";
import { ShoppingCart, Clock, Send, CheckCircle } from "lucide-react";

const statusConfig = {
  pendiente: { icon: Clock, label: "Pendiente", className: "bg-warning/10 text-warning border-warning/20" },
  enviada: { icon: Send, label: "Enviada", className: "bg-info/10 text-info border-info/20" },
  recibida: { icon: CheckCircle, label: "Recibida", className: "bg-success/10 text-success border-success/20" },
};

export default function Ordenes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Órdenes de Compra</h1>
        <p className="text-sm text-muted-foreground mt-1">Órdenes generadas automáticamente y manuales</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const config = statusConfig[order.status];
          const Icon = config.icon;
          return (
            <div key={order.id} className="bg-card rounded-lg border border-border p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Orden #{order.id.toUpperCase()}</h3>
                    <p className="text-xs text-muted-foreground">{order.supplier} · {order.date}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.className}`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>
              <div className="bg-muted/30 rounded-md p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground">
                      <th className="text-left pb-1">Producto</th>
                      <th className="text-right pb-1">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-t border-border/30">
                        <td className="py-1.5 text-foreground">{item.productName}</td>
                        <td className="py-1.5 text-right font-mono text-foreground">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
