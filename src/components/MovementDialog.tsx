import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Product } from "@/data/inventory";
import { updateProductStock } from "@/hooks/useProductStore";
import { toast } from "sonner";

interface MovementDialogProps {
  product: Product;
  type: "entrada" | "salida";
  trigger?: React.ReactNode;
}

export default function MovementDialog({ product, type, trigger }: MovementDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [user, setUser] = useState("");

  const isEntrada = type === "entrada";
  const Icon = isEntrada ? ArrowDownToLine : ArrowUpFromLine;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Ingresa una cantidad válida.");
      return;
    }
    if (!isEntrada && qty > product.stockActual) {
      toast.error(`Stock insuficiente. Disponible: ${product.stockActual}`);
      return;
    }
    if (!user.trim()) {
      toast.error("Ingresa el nombre del responsable.");
      return;
    }

    const delta = isEntrada ? qty : -qty;
    updateProductStock(product.id, delta, user.trim());
    toast.success(
      `${isEntrada ? "Entrada" : "Salida"} de ${qty} unidades de "${product.name}" registrada.`
    );
    setQuantity("");
    setUser("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={isEntrada ? "default" : "outline"}>
            <Icon className="w-4 h-4 mr-1" />
            {isEntrada ? "Registrar entrada" : "Registrar salida"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {isEntrada ? "Entrada de inventario" : "Salida de inventario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="rounded-md bg-muted/50 p-3 text-sm space-y-1">
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-muted-foreground text-xs font-mono">{product.barcode}</p>
            <p className="text-muted-foreground text-xs">Stock actual: <span className="font-bold text-foreground">{product.stockActual}</span></p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qty">Cantidad *</Label>
            <Input id="qty" type="number" min="1" placeholder="Ej: 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus />
            <p className="text-[11px] text-muted-foreground">Puedes ingresar cualquier cantidad (ej: 1, 50, 200)</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user">Responsable *</Label>
            <Input id="user" placeholder="Ej: Carlos" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" variant={isEntrada ? "default" : "destructive"}>
              <Icon className="w-4 h-4 mr-1" /> Confirmar {isEntrada ? "entrada" : "salida"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
