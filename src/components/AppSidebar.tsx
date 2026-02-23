import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  BarChart3,
  ShoppingCart,
  ScanBarcode,
  FileText,
  Newspaper,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/productos", icon: Package, label: "Productos" },
  { to: "/escaner", icon: ScanBarcode, label: "Escáner" },
  { to: "/alertas", icon: AlertTriangle, label: "Alertas" },
  { to: "/clasificacion", icon: BarChart3, label: "ABC" },
  { to: "/ordenes", icon: ShoppingCart, label: "Órdenes" },
  { to: "/reportes", icon: FileText, label: "Reportes" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar-gradient w-64 min-h-screen flex flex-col shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">
            INVENTARIO
          </h1>
          <p className="text-[11px] text-sidebar-foreground/60 font-mono">
            Periódicos v1.0
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${active ? "text-sidebar-primary" : ""}`} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
            CA
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-accent-foreground">Carlos Admin</p>
            <p className="text-[11px] text-sidebar-foreground/50">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
