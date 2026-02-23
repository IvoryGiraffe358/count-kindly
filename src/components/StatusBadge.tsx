interface StatusBadgeProps {
  status: "ok" | "low" | "critical" | "excess";
}

const statusConfig = {
  ok: { label: "Normal", className: "bg-success/10 text-success border-success/20" },
  low: { label: "Bajo", className: "bg-warning/10 text-warning border-warning/20" },
  critical: { label: "Crítico", className: "bg-destructive/10 text-destructive border-destructive/20" },
  excess: { label: "Exceso", className: "bg-info/10 text-info border-info/20" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
