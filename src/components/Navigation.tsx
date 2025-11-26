import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogIn, ScanLine, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hausLogo from "@/assets/haus-logo.png";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";

export const Navigation = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-border/50 relative">
      {/* Stripe gradient background */}
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 opacity-30" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <img 
            src={hausLogo} 
            alt="Haus of Technik" 
            className="h-36 w-auto transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/shop")}
            className="hidden sm:flex transition-all duration-300 hover:scale-105 hover:bg-primary/10 relative group"
          >
            <span className="relative">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/loyalty")}
            className="hidden sm:flex transition-all duration-300 hover:scale-105 hover:bg-primary/10 relative group"
          >
            <span className="relative">
              Rewards
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative transition-all duration-300 hover:scale-110 hover:bg-primary/10"
          >
            <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                {itemCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <>
              {subscription.subscribed && (
                <span className="text-sm text-primary font-semibold px-3 py-1 bg-primary/10 rounded-full transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                  Active Member
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/scanner")}
                className="hidden sm:flex transition-all duration-300 hover:scale-105 hover:bg-primary/10"
              >
                <ScanLine className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Scanner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/membership")}
                className="transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/5"
              >
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
