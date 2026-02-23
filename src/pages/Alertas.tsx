import { AlertTriangle, TrendingDown, TrendingUp, Thermometer } from "lucide-react";
import { alerts } from "@/data/inventory";

const typeConfig = {
  min: { icon: TrendingDown, label: "Stock Bajo", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  max: { icon: TrendingUp, label: "Exceso", color: "text-info", bg: "bg-info/10 border-info/20" },
  seasonal: { icon: Thermometer, label: "Estacional", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
};

export default function Alertas() {
  const unread = alerts.filter(a => !a.read);
  const read = alerts.filter(a => a.read);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">{unread.length} alertas sin leer</p>
      </div>

      {unread.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-destructive">Nuevas</h2>
          {unread.map(alert => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-lg border animate-fade-in ${config.bg}`}>
                <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{alert.productName}</span>
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>{config.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {read.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Anteriores</h2>
          {read.map(alert => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 opacity-70 animate-fade-in">
                <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{alert.productName}</span>
                    <span className="text-[11px] text-muted-foreground">{config.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
