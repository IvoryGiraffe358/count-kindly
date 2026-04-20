import { useSyncExternalStore } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, Thermometer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAlerts, markAlertRead, subscribeProducts } from "@/hooks/useProductStore";

const typeConfig = {
  min:      { icon: TrendingDown, label: "Bajo Punto de Orden", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  max:      { icon: TrendingUp,   label: "Sobre Máximo",        color: "text-info",        bg: "bg-info/10 border-info/20" },
  seasonal: { icon: Thermometer,  label: "Estacional",          color: "text-warning",     bg: "bg-warning/10 border-warning/20" },
};

export default function Alertas() {
  const alerts = useSyncExternalStore(subscribeProducts, getAlerts);
  const unread = alerts.filter(a => !a.read);
  const read = alerts.filter(a => a.read);

  const Card = ({ alert, dimmed = false }: any) => {
    const cfg = typeConfig[alert.type as keyof typeof typeConfig];
    const Icon = cfg.icon;
    return (
      <div className={`flex items-start gap-4 p-4 rounded-xl border animate-fade-in ${dimmed ? "border-border bg-muted/30 opacity-70" : cfg.bg}`}>
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{alert.productName}</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">{alert.date}</p>
        </div>
        {!alert.read && (
          <Button size="sm" variant="ghost" onClick={() => markAlertRead(alert.id)}>
            <Check className="w-4 h-4 mr-1" /> Marcar
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Alertas Automáticas</h1>
          <p className="text-sm text-muted-foreground mt-1">{unread.length} sin leer · disparadas por triggers de stock</p>
        </div>
      </div>

      {alerts.length === 0 && (
        <div className="surface-card rounded-xl p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay alertas. Todo bajo control ✓</p>
        </div>
      )}

      {unread.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-destructive">Nuevas ({unread.length})</h2>
          {unread.map(a => <Card key={a.id} alert={a} />)}
        </div>
      )}

      {read.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Anteriores</h2>
          {read.map(a => <Card key={a.id} alert={a} dimmed />)}
        </div>
      )}
    </div>
  );
}
