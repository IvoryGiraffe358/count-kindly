import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "accent" | "success" | "destructive" | "primary";
  trend?: { value: string; positive?: boolean };
}

const variantStyles = {
  default:     "bg-card border-border",
  primary:     "bg-card border-primary/20",
  accent:      "bg-card border-accent/30 metric-glow",
  success:     "bg-card border-success/30",
  destructive: "bg-card border-destructive/30",
};

const iconVariantStyles = {
  default:     "bg-secondary text-foreground",
  primary:     "gradient-primary text-primary-foreground shadow-elev",
  accent:      "gradient-accent text-accent-foreground shadow-glow",
  success:     "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
};

export default function MetricCard({ title, value, subtitle, icon: Icon, variant = "default", trend }: MetricCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 animate-fade-in transition-all hover:shadow-elev ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1.5 text-foreground tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
          {trend && (
            <p className={`text-[11px] font-medium mt-2 ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.positive ? "▲" : "▼"} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconVariantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
