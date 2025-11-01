import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Membership from "./pages/Membership";
import MembershipSuccess from "./pages/MembershipSuccess";
import Scanner from "./pages/Scanner";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Loyalty from "./pages/Loyalty";
import PassEntrySetup from "./pages/PassEntrySetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/membership-success" element={<MembershipSuccess />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/passentry-setup" element={<PassEntrySetup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
