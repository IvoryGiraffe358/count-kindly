import { useState, useSyncExternalStore } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getStockStatus } from "@/data/inventory";
import { getProducts } from "@/hooks/useProductStore";
import StatusBadge from "@/components/StatusBadge";
import AbcBadge from "@/components/AbcBadge";
import AddProductDialog from "@/components/AddProductDialog";

let listeners: Array<() => void> = [];
function subscribe(cb: () => void) { listeners.push(cb); return () => { listeners = listeners.filter(l => l !== cb); }; }
function getSnapshot() { return getProducts(); }

export default function Productos() {
  const products = useSyncExternalStore(subscribe, getSnapshot);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} productos registrados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <AddProductDialog />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Código</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ABC</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Mín/Máx</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{product.barcode}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{product.name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{product.category}</td>
                  <td className="py-3 px-4 text-center"><AbcBadge classification={product.abcClass} /></td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-foreground">{product.stockActual}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{product.stockMinimo} / {product.stockMaximo}</td>
                  <td className="py-3 px-4 text-right font-mono text-foreground">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center"><StatusBadge status={getStockStatus(product)} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">No se encontraron productos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
