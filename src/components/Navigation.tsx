import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogIn, ScanLine, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";

export const Navigation = () => {
  const {
    user,
    subscription
  } = useAuth();
  const navigate = useNavigate();
  const itemCount = useCartStore(state => state.getItemCount());
  
  return <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-primary/20 relative">
      {/* Dark cyberpunk background */}
      <div className="absolute inset-0 bg-background/95" />
      <div className="absolute inset-0 opacity-20 cyber-grid" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hover:bg-primary/10 hover:text-primary relative group uppercase tracking-wider font-mono text-sm">
            <span className="relative">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(180_100%_50%)]" />
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/shop")} className="hover:bg-primary/10 hover:text-primary relative group uppercase tracking-wider font-mono text-sm">
            <span className="relative">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(180_100%_50%)]" />
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/loyalty")} className="hidden sm:flex hover:bg-primary/10 hover:text-primary relative group uppercase tracking-wider font-mono text-sm">
            <span className="relative">
              Rewards
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(180_100%_50%)]" />
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")} className="hidden sm:flex hover:bg-primary/10 hover:text-primary relative group uppercase tracking-wider font-mono text-sm">
            <span className="relative">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(180_100%_50%)]" />
            </span>
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="relative hover:bg-primary/10 hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground animate-pulse">
                {itemCount}
              </Badge>}
          </Button>

          {user ? <>
              {subscription.subscribed && <span className="text-sm text-primary font-semibold px-3 py-1 bg-primary/10 border border-primary/30 rounded uppercase tracking-wider hidden sm:inline-block text-glow-cyan">
                  Active Member
                </span>}
              <Button variant="ghost" size="sm" onClick={() => navigate("/scanner")} className="hidden sm:flex hover:bg-primary/10 hover:text-primary uppercase tracking-wider font-mono text-sm">
                <ScanLine className="mr-2 h-4 w-4" />
                Scanner
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/membership")} className="border-primary/50 hover:border-primary hover:bg-primary/10 uppercase tracking-wider glow-border">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
            </> : <Button size="sm" onClick={() => navigate("/auth")} className="neon-glow uppercase tracking-wider font-semibold">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>}
        </div>
      </div>
    </nav>;
};