import { useState, useSyncExternalStore, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ScanBarcode, Check, Plus, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProducts, subscribeProducts } from "@/hooks/useProductStore";
import AddProductDialog from "@/components/AddProductDialog";
import MovementDialog from "@/components/MovementDialog";

export default function Escaner() {
  const products = useSyncExternalStore(subscribeProducts, getProducts);
  const [params] = useSearchParams();
  const [barcode, setBarcode] = useState(params.get("code") ?? "");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanned, setScanned] = useState(false);

  const found = foundId ? products.find(p => p.id === foundId) ?? null : null;

  const handleScan = () => {
    const product = products.find(p => p.barcode === barcode);
    if (product) { setFoundId(product.id); setNotFound(false); setScanned(true); }
    else if (barcode.length > 0) { setFoundId(null); setNotFound(true); setScanned(true); }
  };

  useEffect(() => {
    if (params.get("code")) handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => { setBarcode(""); setFoundId(null); setNotFound(false); setScanned(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Escáner de Código de Barras</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent" /> Lector HID activo en toda la app · ciclo &lt; 1.5 s
          </p>
        </div>
        <AddProductDialog />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="surface-card rounded-2xl p-8 text-center animate-fade-in shadow-elev">
          <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${scanned && found ? "bg-success/10 ring-4 ring-success/20" : "gradient-accent shadow-glow"}`}>
            {scanned && found ? <Check className="w-12 h-12 text-success" /> : <ScanBarcode className="w-12 h-12 text-accent-foreground" />}
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            {scanned ? "Producto escaneado" : "Ingresa el código de barras o usa un lector HID (USB)"}
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Ej: 7501001234567 · KQ45010"
              value={barcode}
              onChange={(e) => { setBarcode(e.target.value); setScanned(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="font-mono text-center text-lg h-12"
              autoFocus
            />
            <Button onClick={handleScan} className="h-12 px-6 gradient-primary text-primary-foreground">Buscar</Button>
          </div>

          <p className="text-[11px] text-muted-foreground mt-4 font-mono">
            Prueba: 7501001234567 · 7501001234574 · KQ45010
          </p>
        </div>

        {found && (
          <div className="surface-card rounded-xl border-success/30 p-6 mt-4 animate-fade-in">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-success" /> Producto Encontrado
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <Field label="Nombre" value={found.name} mono={false} />
              <Field label="Categoría" value={found.category} mono={false} />
              <Field label="Clase ABC" value={found.abcClass} highlight />
              <Field label="Stock actual" value={found.stockActual} highlight />
              <Field label="Punto de Orden" value={found.puntoOrden ?? "—"} />
              <Field label="EOQ" value={found.eoq ?? "—"} />
              <Field label="Stock máximo" value={found.stockMaximo} />
              <Field label="Precio" value={`$${found.price.toFixed(2)}`} />
              <Field label="Proveedor" value={found.supplier} mono={false} />
            </div>
            <div className="flex gap-2 mt-5 flex-wrap">
              <Button size="sm" variant="outline" onClick={reset}>Escanear otro</Button>
              <MovementDialog product={found} type="entrada" />
              <MovementDialog product={found} type="salida" />
            </div>
          </div>
        )}

        {notFound && (
          <div className="surface-card rounded-xl border-destructive/30 p-6 mt-4 animate-fade-in">
            <h3 className="font-semibold text-destructive mb-2">Producto no encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">El código <span className="font-mono">"{barcode}"</span> no está registrado.</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={reset}>Intentar otro</Button>
              <AddProductDialog
                defaultBarcode={barcode}
                onAdded={reset}
                trigger={<Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Registrar nuevo producto</Button>}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, mono = true, highlight = false }: { label: string; value: any; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="bg-muted/40 rounded-lg p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 ${mono ? "font-mono" : ""} ${highlight ? "font-bold text-foreground text-base" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
