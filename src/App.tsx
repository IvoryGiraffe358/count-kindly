import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Productos from "@/pages/Productos";
import Escaner from "@/pages/Escaner";
import Alertas from "@/pages/Alertas";
import Clasificacion from "@/pages/Clasificacion";
import Ordenes from "@/pages/Ordenes";
import Reportes from "@/pages/Reportes";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/escaner" element={<Escaner />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/clasificacion" element={<Clasificacion />} />
            <Route path="/ordenes" element={<Ordenes />} />
            <Route path="/reportes" element={<Reportes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
