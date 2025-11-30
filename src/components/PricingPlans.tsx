import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MEMBERSHIP_TIERS } from "@/lib/membershipTiers";

const plans = [
  {
    id: "single",
    name: "Single Pack",
    subtitle: "(1 Vehicle)",
    badge: "Essential Care",
    monthlyPrice: 55,
    yearlyPrice: 550,
    value: 450,
    savings: 0,
    features: [
      "1x Express Service",
      "1x Rotate & Balance",
      "1x Diagnostics",
      "Unlimited Puncture Repairs",
      "Priority Booking",
      "Wallet Pass + Loyalty Ring"
    ],
    note: "All services include 5L oil. Excess oil: $15 per liter. No tow included."
  },
  {
    id: "family",
    name: "Family Pack",
    subtitle: "(2 Vehicles)",
    badge: "Most Popular",
    popular: true,
    monthlyPrice: 110,
    yearlyPrice: 1100,
    value: 2070,
    savings: 750,
    features: [
      "2x Express Services",
      "2x Rotate & Balance",
      "2x Wheel Alignment",
      "2x Diagnostics",
      "2x Fault Scans",
      "2x Coolant Flush",
      "Unlimited Puncture Repairs",
      "Priority Booking",
      "Wallet Pass + Loyalty Ring"
    ],
    note: "All services include 5L oil. Excess oil: $15 per liter. No tow included."
  },
  {
    id: "business",
    name: "Business Starter Pack",
    subtitle: "(3 Vehicles)",
    badge: "Fleet Ready",
    monthlyPrice: 249,
    yearlyPrice: 2490,
    value: 4716,
    savings: 1728,
    features: [
      "3x Express Services",
      "3x Rotate & Balance",
      "3x Wheel Alignment",
      "3x Diagnostics",
      "3x Fault Scans",
      "1x Coolant Flush",
      "Unlimited Puncture Repairs",
      "Priority Booking",
      "Wallet Pass + Loyalty Ring"
    ],
    note: "All services include 5L oil. Excess oil: $15 per liter. No tow included."
  },
  {
    id: "enterprise",
    name: "Business Velocity Pack",
    subtitle: "(6+ Vehicles)",
    badge: "Premium Fleet",
    monthlyPrice: 100,
    yearlyPrice: 1000,
    perVehicle: true,
    value: 1950,
    savings: 825,
    features: [
      "2x Logbook Services",
      "2x Rotate & Balance",
      "2x Wheel Alignment",
      "2x Engine Diagnostics",
      "2x Fault Full System Scans",
      "2x Coolant Flush",
      "2x Power Steering Flush",
      "2x Brake Fluid Flush",
      "Unlimited Puncture Repairs",
      "1 Free Tow per membership/year",
      "50% off additional tows",
      "Priority Booking",
      "Wallet Pass + Loyalty Ring",
      "Fleet-wide SMS + Loyalty Triggers"
    ],
    note: "All services include 5L oil. Excess oil: $15 per liter."
  }
];

export const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    console.log("🔔 Subscribe button clicked for plan:", planId);
    console.log("🔔 Current user:", user);
    
    if (!user) {
      console.log("❌ No user found, redirecting to /auth");
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe",
      });
      navigate("/auth");
      return;
    }

    const tierMap: Record<string, keyof typeof MEMBERSHIP_TIERS> = {
      single: "single",
      family: "family",
      business: "business",
      enterprise: "enterprise",
    };

    const tier = tierMap[planId];
    if (!tier) {
      console.error("❌ Invalid tier:", planId);
      toast({
        title: "Error",
        description: "Invalid plan selected",
        variant: "destructive",
      });
      return;
    }

    const priceId = MEMBERSHIP_TIERS[tier].price_id;
    console.log("✅ Using price ID:", priceId, "for tier:", tier);

    setCheckoutLoading(planId);
    
    try {
      console.log("🚀 Invoking create-checkout edge function...");
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      console.log("📦 Edge function response:", { data, error });

      if (error) {
        console.error("❌ Edge function error:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }
      
      if (!data?.url) {
        console.error("❌ No checkout URL in response:", data);
        throw new Error("No checkout URL received from server");
      }

      console.log("✅ Checkout URL received:", data.url);
      console.log("🔗 Opening Stripe checkout in new tab...");
      
      // Try to open in new tab
      const newWindow = window.open(data.url, "_blank");
      
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn("⚠️ Popup blocked, redirecting in current window");
        toast({
          title: "Popup Blocked",
          description: "Redirecting to checkout...",
        });
        // Fallback: redirect in same window
        window.location.href = data.url;
      } else {
        console.log("✅ Checkout opened successfully");
        toast({
          title: "Opening checkout",
          description: "Please complete your purchase in the new tab",
        });
      }
    } catch (error: any) {
      console.error("💥 Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to start checkout. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(null);
      console.log("🏁 Checkout process completed");
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden liquid-glass">
      {/* Subtle Stripe gradient overlay */}
      <div className="absolute inset-0 opacity-20" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            All plans include unlimited puncture repairs and 100% labour coverage. Start saving from day one.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 glass-card p-2 rounded-xl">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingPeriod === "monthly" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingPeriod === "yearly" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Yearly
            </button>
            {billingPeriod === "yearly" && (
              <Badge variant="secondary" className="bg-accent/30 text-accent font-semibold pulse-glow">Save 17%</Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isDark = plan.id === 'single' || plan.id === 'business' || plan.id === 'enterprise';
            const textColor = plan.id === 'enterprise' ? 'text-black' : 'text-white';
            const mutedColor = plan.id === 'enterprise' ? 'text-black/60' : 'text-white/70';
            
            return (
              <Card 
                key={plan.id}
                className={`p-6 flex flex-col relative transition-all duration-500 hover:-translate-y-2 border-0 ${
                  plan.popular ? "ring-2 ring-primary shadow-2xl scale-105" : ""
                }`}
                style={{
                  backgroundColor: 
                    plan.id === "single" ? '#1C1C1C' : 
                    plan.id === "family" ? '#00C2A8' :
                    plan.id === "business" ? '#0057B8' :
                    '#FFD700'
                }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary shadow-lg font-semibold animate-pulse">
                    {plan.badge}
                  </Badge>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-display font-bold mb-1 ${textColor}`}>{plan.name}</h3>
                  <p className={`text-sm mb-3 ${mutedColor}`}>{plan.subtitle}</p>
                  {!plan.popular && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        plan.id === 'enterprise' 
                          ? 'border-black/30 text-black bg-black/10' 
                          : 'border-white/30 text-white bg-white/10'
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                  )}
                </div>

                <div className="mb-6">
                  {plan.value && (
                    <div className={`text-sm mb-2 ${mutedColor}`}>
                      ${plan.value}+ Value for
                    </div>
                  )}
                  <div className="text-4xl font-bold text-flat relative" style={{ 
                    background: 'var(--gradient-vercel)',
                    backgroundSize: '200% 200%',
                    animation: 'liquid-flow 8s ease infinite',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.3))'
                  }}>
                    <div className="absolute inset-0 blur-xl opacity-40" style={{
                      background: 'var(--gradient-vercel)',
                      backgroundSize: '200% 200%',
                      animation: 'liquid-flow 8s ease infinite',
                      zIndex: -1
                    }} />
                    ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    <span className={`text-lg ${mutedColor}`} style={{ 
                      WebkitTextFillColor: 'inherit',
                      background: 'none',
                      filter: 'none'
                    }}>
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                    {plan.perVehicle && <span className={`text-sm ${mutedColor}`} style={{ 
                      WebkitTextFillColor: 'inherit',
                      background: 'none',
                      filter: 'none'
                    }}>/vehicle</span>}
                  </div>
                  {plan.savings > 0 && (
                    <div className={`text-sm mt-2 ${plan.id === 'family' ? 'text-purple-600 font-semibold' : mutedColor}`}>
                      Save ${plan.savings} annually
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${textColor}`}>
                      <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.id === 'enterprise' ? 'text-black' : 'text-white'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.note && (
                  <div className={`text-xs italic mb-4 p-2 rounded ${
                    plan.id === 'enterprise' 
                      ? 'bg-black/10 text-black/60' 
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {plan.note}
                  </div>
                )}

                <div className="space-y-3">
                  {plan.features.length > 3 && (
                    <Button 
                      className={`w-full ${
                        plan.id === 'enterprise'
                          ? 'bg-black text-white hover:bg-black/80 border-0'
                          : 'bg-black text-white hover:bg-black/80 border-0'
                      }`}
                      size="sm"
                    >
                      See All {plan.features.length} Services
                    </Button>
                  )}
                  <Button 
                    className="w-full font-semibold transition-all duration-300 border-0 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-glow hover:scale-105"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={checkoutLoading === plan.id}
                  >
                    {checkoutLoading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : plan.id === "enterprise" ? (
                      "Schedule Consultation"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            30-day notice required
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            Money-back guarantee
          </div>
        </div>
      </div>
    </section>
  );
};
