import { Outlet, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import AppSidebar from "./AppSidebar";
import { useHidScanner } from "@/hooks/useHidScanner";
import { getProducts, updateProductStock } from "@/hooks/useProductStore";
import { toast } from "sonner";

export default function AppLayout() {
  const navigate = useNavigate();

  const handleScan = useCallback((code: string) => {
    const product = getProducts().find(p => p.barcode === code);
    if (!product) {
      toast.error(`Código "${code}" no registrado`, {
        action: { label: "Registrar", onClick: () => navigate(`/escaner?code=${encodeURIComponent(code)}`) },
      });
      return;
    }
    // Salida rápida por defecto al escanear (workflow más común en venta de periódicos)
    updateProductStock(product.id, -1, "Operador HID", "hid");
    toast.success(`HID · Salida 1× ${product.name} · stock ${Math.max(0, product.stockActual - 1)}`);
  }, [navigate]);

  useHidScanner({ onScan: handleScan });

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
