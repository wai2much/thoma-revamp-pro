import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogIn, ScanLine, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";

// Import fragrance images
import amgBloomImg from "@/assets/products/amg-bloom-nobg.png";
import amgBloom100Img from "@/assets/products/amg-bloom-100ml.png";
import hausNoirImg from "@/assets/products/haus-noir-100ml.png";
import m3LoingImg from "@/assets/products/m3-loing-100ml.png";
import nSkrrtImg from "@/assets/products/n-skrrt-100ml.png";
import gtrGodImg from "@/assets/products/gtr-god-100ml.png";
import brokieImg from "@/assets/products/911-brokie-100ml.png";

export const Navigation = () => {
  const {
    user,
    subscription
  } = useAuth();
  const navigate = useNavigate();
  const itemCount = useCartStore(state => state.getItemCount());
  
  const fragrances = [
    { img: amgBloomImg, name: "AMG Bloom" },
    { img: hausNoirImg, name: "Haus Noir" },
    { img: m3LoingImg, name: "M3 Lo-ing" },
    { img: nSkrrtImg, name: "N Skrrt" },
    { img: gtrGodImg, name: "GTR G.O.D" },
    { img: brokieImg, name: "911 Brokie" },
  ];
  
  return <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-border/50 relative">
      {/* Stripe gradient background */}
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 opacity-30" style={{
      background: 'var(--gradient-stripe)'
    }} />
      
      {/* Fragrance showcase banner */}
      <div className="relative z-10 py-2 border-b border-border/30 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {fragrances.map((frag, i) => (
              <img 
                key={i}
                src={frag.img} 
                alt={frag.name} 
                className="h-10 w-auto object-contain hover:scale-110 transition-transform cursor-pointer"
                onClick={() => navigate("/shop")}
              />
            ))}
          </div>
          <div className="flex md:hidden items-center gap-1">
            {fragrances.slice(0, 3).map((frag, i) => (
              <img 
                key={i}
                src={frag.img} 
                alt={frag.name} 
                className="h-8 w-auto object-contain"
              />
            ))}
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate("/shop")}
            className="ml-2 bg-primary hover:bg-primary/90 text-xs font-bold animate-pulse"
          >
            Shop Now <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/loyalty")} className="hidden sm:flex hover:bg-primary/10 relative group">
            <span className="relative">
              Rewards
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="relative hover:bg-primary/10">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                {itemCount}
              </Badge>}
          </Button>

          {user ? <>
              {subscription.subscribed && <span className="text-sm text-primary font-semibold px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20">
                  Active Member
                </span>}
              <Button variant="ghost" size="sm" onClick={() => navigate("/scanner")} className="hidden sm:flex hover:bg-primary/10">
                <ScanLine className="mr-2 h-4 w-4" />
                Scanner
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/membership")} className="hover:border-primary hover:bg-primary/5">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
            </> : <Button size="sm" onClick={() => navigate("/auth")} className="hover:shadow-lg hover:shadow-primary/20">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>}
        </div>
      </div>
    </nav>;
};