import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";

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

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(217_91%_60%/0.08),transparent_50%)]" />
      
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
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`glass-card p-6 flex flex-col relative transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? "ring-2 ring-primary shadow-2xl scale-105" : ""
              }`}
              style={
                plan.id === "single" ? { backgroundColor: '#1C1C1C' } : 
                plan.id === "family" ? { backgroundColor: '#00C2A8' } :
                plan.id === "business" ? { backgroundColor: '#0057B8' } :
                (plan.popular ? { boxShadow: '0 0 60px hsl(217 91% 60% / 0.3)' } : {})
              }
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary shadow-lg font-semibold animate-pulse">
                  {plan.badge}
                </Badge>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-display font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{plan.subtitle}</p>
                {!plan.popular && (
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {plan.badge}
                  </Badge>
                )}
              </div>

              <div className="mb-6">
                {plan.value && (
                  <div className="text-sm text-muted-foreground mb-2">
                    ${plan.value}+ Value for
                  </div>
                )}
                <div className="text-4xl font-bold">
                  ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-lg text-muted-foreground">
                    /{billingPeriod === "monthly" ? "mo" : "yr"}
                  </span>
                  {plan.perVehicle && <span className="text-sm text-muted-foreground">/vehicle</span>}
                </div>
                {plan.savings > 0 && (
                  <div className="text-sm text-primary mt-2">
                    Save ${plan.savings} annually
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <div className="text-xs text-muted-foreground italic mb-4 p-2 bg-secondary/30 rounded">
                  {plan.note}
                </div>
              )}

              <div className="space-y-3">
                {plan.features.length > 3 && (
                  <Button variant="outline" className="w-full" size="sm">
                    See All {plan.features.length} Services
                  </Button>
                )}
                <Button 
                  className={`w-full font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-glow hover:scale-105" 
                      : "bg-secondary hover:bg-secondary/80 hover:scale-[1.02]"
                  }`}
                >
                  {plan.id === "enterprise" ? "Schedule Consultation" : "Subscribe Now"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            No commitment
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
