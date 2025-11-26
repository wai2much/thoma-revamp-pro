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
        <div className="flex items-center gap-2">
          <img src={hausLogo} alt="Haus of Technik" className="h-24 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/shop")}
            className="hidden sm:flex"
          >
            Shop
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/loyalty")}
            className="hidden sm:flex"
          >
            Rewards
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <>
              {subscription.subscribed && (
                <span className="text-sm text-primary font-semibold px-3 py-1 bg-primary/10 rounded-full">
                  Active Member
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/scanner")}
                className="hidden sm:flex"
              >
                <ScanLine className="mr-2 h-4 w-4" />
                Scanner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/membership")}
              >
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
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
