import { useSyncExternalStore } from "react";
import { ShoppingCart, Clock, Send, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders, updateOrderStatus, subscribeProducts } from "@/hooks/useProductStore";

const statusConfig = {
  pendiente: { icon: Clock,       label: "Sugerida", className: "bg-warning/10 text-warning border-warning/30" },
  enviada:   { icon: Send,        label: "Enviada",  className: "bg-info/10 text-info border-info/30" },
  recibida:  { icon: CheckCircle, label: "Recibida", className: "bg-success/10 text-success border-success/30" },
};

export default function Ordenes() {
  const orders = useSyncExternalStore(subscribeProducts, getOrders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Órdenes de Compra</h1>
        <p className="text-sm text-muted-foreground mt-1">Generadas automáticamente con cantidad = EOQ al cruzar el Punto de Orden</p>
      </div>

      {orders.length === 0 && (
        <div className="surface-card rounded-xl p-12 text-center">
          <ShoppingCart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay órdenes activas. Se crearán al detectar stock bajo PO.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => {
          const cfg = statusConfig[order.status];
          const Icon = cfg.icon;
          return (
            <div key={order.id} className="surface-card rounded-xl p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-elev">
                    <ShoppingCart className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      Orden #{order.id.slice(-6).toUpperCase()}
                      {order.auto && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded gradient-accent text-accent-foreground inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AUTO · EOQ
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">{order.supplier} · {order.date}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${cfg.className}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
              </div>

              <div className="bg-muted/40 rounded-lg p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      <th className="text-left pb-1.5">Producto</th>
                      <th className="text-right pb-1.5">Cantidad (EOQ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-t border-border/40">
                        <td className="py-1.5 text-foreground">{item.productName}</td>
                        <td className="py-1.5 text-right font-mono font-semibold text-foreground">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order.status !== "recibida" && (
                <div className="flex justify-end gap-2 mt-3">
                  {order.status === "pendiente" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "enviada")}>
                      <Send className="w-3.5 h-3.5 mr-1" /> Aprobar y enviar
                    </Button>
                  )}
                  {order.status === "enviada" && (
                    <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "recibida")}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Marcar recibida
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
