import { useState, useSyncExternalStore } from "react";
import { ScanBarcode, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/hooks/useProductStore";
import AddProductDialog from "@/components/AddProductDialog";

// Subscribe to product store
let listeners: Array<() => void> = [];
function subscribe(cb: () => void) { listeners.push(cb); return () => { listeners = listeners.filter(l => l !== cb); }; }
function getSnapshot() { return getProducts(); }

export default function Escaner() {
  const products = useSyncExternalStore(subscribe, getSnapshot);
  const [barcode, setBarcode] = useState("");
  const [found, setFound] = useState<typeof products[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setFound(product);
      setNotFound(false);
      setScanned(true);
    } else if (barcode.length > 0) {
      setFound(null);
      setNotFound(true);
      setScanned(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  const reset = () => {
    setBarcode("");
    setFound(null);
    setNotFound(false);
    setScanned(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escáner de Código de Barras</h1>
          <p className="text-sm text-muted-foreground mt-1">Escanea o ingresa un código para buscar/registrar productos</p>
        </div>
        <AddProductDialog />
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-lg border border-border p-8 text-center animate-fade-in">
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${scanned && found ? "bg-success/10" : "bg-accent/10 animate-pulse-glow"}`}>
            {scanned && found ? (
              <Check className="w-10 h-10 text-success" />
            ) : (
              <ScanBarcode className="w-10 h-10 text-accent" />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {scanned ? "Producto escaneado" : "Ingresa el código de barras o usa un lector"}
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Ej: 7501001234567"
              value={barcode}
              onChange={(e) => { setBarcode(e.target.value); setScanned(false); }}
              onKeyDown={handleKeyDown}
              className="font-mono text-center text-lg"
              autoFocus
            />
            <Button onClick={handleScan} className="shrink-0">Buscar</Button>
          </div>

          <p className="text-[11px] text-muted-foreground mt-3">
            Prueba con: 7501001234567 · 7501001234574
          </p>
        </div>

        {found && (
          <div className="bg-card rounded-lg border border-success/30 p-6 mt-4 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-3">✓ Producto Encontrado</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Nombre:</span> <span className="font-medium text-foreground">{found.name}</span></div>
              <div><span className="text-muted-foreground">Categoría:</span> <span className="text-foreground">{found.category}</span></div>
              <div><span className="text-muted-foreground">Stock actual:</span> <span className="font-mono font-bold text-foreground">{found.stockActual}</span></div>
              <div><span className="text-muted-foreground">Precio:</span> <span className="font-mono text-foreground">${found.price.toFixed(2)}</span></div>
              <div><span className="text-muted-foreground">Clase ABC:</span> <span className="font-bold text-foreground">{found.abcClass}</span></div>
              <div><span className="text-muted-foreground">Proveedor:</span> <span className="text-foreground">{found.supplier}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={reset}>Escanear otro</Button>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Registrar entrada</Button>
            </div>
          </div>
        )}

        {notFound && (
          <div className="bg-card rounded-lg border border-destructive/30 p-6 mt-4 animate-fade-in">
            <h3 className="font-semibold text-destructive mb-2">Producto no encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">El código "{barcode}" no está registrado en el sistema.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={reset}>Intentar otro</Button>
              <AddProductDialog
                defaultBarcode={barcode}
                onAdded={reset}
                trigger={
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Registrar nuevo producto
                  </Button>
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
