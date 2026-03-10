import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addProduct } from "@/hooks/useProductStore";
import { toast } from "sonner";

interface AddProductDialogProps {
  defaultBarcode?: string;
  trigger?: React.ReactNode;
  onAdded?: () => void;
}

export default function AddProductDialog({ defaultBarcode = "", trigger, onAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    barcode: defaultBarcode,
    name: "",
    category: "",
    abcClass: "C" as "A" | "B" | "C",
    stockActual: "",
    stockMinimo: "",
    stockMaximo: "",
    price: "",
    supplier: "",
  });

  const resetForm = () => {
    setForm({
      barcode: defaultBarcode,
      name: "",
      category: "",
      abcClass: "C",
      stockActual: "",
      stockMinimo: "",
      stockMaximo: "",
      price: "",
      supplier: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.barcode || !form.category) {
      toast.error("Completa los campos obligatorios: nombre, código y categoría.");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      barcode: form.barcode,
      name: form.name,
      category: form.category,
      abcClass: form.abcClass,
      stockActual: Number(form.stockActual) || 0,
      stockMinimo: Number(form.stockMinimo) || 0,
      stockMaximo: Number(form.stockMaximo) || 0,
      price: Number(form.price) || 0,
      supplier: form.supplier,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    addProduct(newProduct);
    toast.success(`Producto "${newProduct.name}" registrado exitosamente.`);
    resetForm();
    setOpen(false);
    onAdded?.();
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setForm((f) => ({ ...f, barcode: defaultBarcode || f.barcode })); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> Agregar producto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar nuevo producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="barcode">Código de barras *</Label>
              <Input id="barcode" placeholder="7501001234567" value={form.barcode} onChange={(e) => update("barcode", e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" placeholder="Ej: El Universal" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Categoría *</Label>
              <Input id="category" placeholder="Ej: Periódico Nacional" value={form.category} onChange={(e) => update("category", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Clase ABC</Label>
              <Select value={form.abcClass} onValueChange={(v) => update("abcClass", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A – Alta rotación</SelectItem>
                  <SelectItem value="B">B – Media rotación</SelectItem>
                  <SelectItem value="C">C – Baja rotación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockActual">Stock actual</Label>
              <Input id="stockActual" type="number" min="0" placeholder="0" value={form.stockActual} onChange={(e) => update("stockActual", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Precio ($)</Label>
              <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockMinimo">Stock mínimo</Label>
              <Input id="stockMinimo" type="number" min="0" placeholder="0" value={form.stockMinimo} onChange={(e) => update("stockMinimo", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockMaximo">Stock máximo</Label>
              <Input id="stockMaximo" type="number" min="0" placeholder="0" value={form.stockMaximo} onChange={(e) => update("stockMaximo", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="supplier">Proveedor</Label>
            <Input id="supplier" placeholder="Ej: Distribuidora Nacional" value={form.supplier} onChange={(e) => update("supplier", e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-1" /> Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
