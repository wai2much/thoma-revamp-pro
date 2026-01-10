import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Membership from "./pages/Membership";
import MembershipSuccess from "./pages/MembershipSuccess";
import Scanner from "./pages/Scanner";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Loyalty from "./pages/Loyalty";
import LoyaltyCard from "./pages/LoyaltyCard";
import PassEntrySetup from "./pages/PassEntrySetup";
import ImageUpload from "./pages/ImageUpload";
import Gallery from "./pages/Gallery";
import FleetPlan from "./pages/FleetPlan";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isShopPage = location.pathname.startsWith('/shop') || location.pathname.startsWith('/cart');
  
  return (
    <>
      {/* Liquid glass overlay effects - only on non-shop pages */}
      {!isShopPage && (
        <>
          <div className="neon-dust-overlay" />
          <div className="cyber-liquid-glass" />
        </>
      )}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership-success" element={<MembershipSuccess />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:handle" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/loyalty-card/:memberId" element={<LoyaltyCard />} />
        <Route path="/passentry-setup" element={<PassEntrySetup />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/fleet" element={<FleetPlan />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
