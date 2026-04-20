import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, AlertTriangle, BarChart3,
  ShoppingCart, ScanBarcode, FileText, Newspaper,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { getAlerts, getOrders, subscribeProducts } from "@/hooks/useProductStore";

const navItems = [
  { to: "/",              icon: LayoutDashboard, label: "Dashboard" },
  { to: "/productos",     icon: Package,         label: "Productos" },
  { to: "/escaner",       icon: ScanBarcode,     label: "Escáner HID" },
  { to: "/alertas",       icon: AlertTriangle,   label: "Alertas",   badgeKey: "alertas" },
  { to: "/clasificacion", icon: BarChart3,       label: "Clase ABC" },
  { to: "/ordenes",       icon: ShoppingCart,    label: "Órdenes",   badgeKey: "ordenes" },
  { to: "/reportes",      icon: FileText,        label: "Reportes" },
] as const;

export default function AppSidebar() {
  const location = useLocation();
  const alerts = useSyncExternalStore(subscribeProducts, getAlerts);
  const orders = useSyncExternalStore(subscribeProducts, getOrders);
  const badges: Record<string, number> = {
    alertas: alerts.filter(a => !a.read).length,
    ordenes: orders.filter(o => o.status === "pendiente").length,
  };

  return (
    <aside className="sidebar-gradient w-64 min-h-screen flex flex-col shrink-0 border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-accent shadow-glow">
          <Newspaper className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-sidebar-accent-foreground tracking-wide">
            INVENTARIO MAX-MIN
          </h1>
          <p className="text-[10px] text-sidebar-foreground/60 font-mono uppercase tracking-wider">
            EOQ · PO · HID · v2.0
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          const badge = "badgeKey" in item ? badges[item.badgeKey as string] : 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary shadow-inner"
                  : "text-sidebar-foreground/75 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] transition-colors ${active ? "text-sidebar-primary" : "group-hover:text-sidebar-primary"}`} />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full gradient-accent text-accent-foreground shadow-glow">
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            CA
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">Carlos Admin</p>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
