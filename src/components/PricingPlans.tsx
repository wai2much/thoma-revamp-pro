import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "single",
    name: "Single Pack",
    subtitle: "(1 Car)",
    badge: "The Deal Breaker",
    monthlyPrice: 35,
    yearlyPrice: 350,
    value: 1059,
    savings: 639,
    features: [
      "1x Express Service (oil change, oil filter, 5L oil, 50-point safety inspection)",
      "1x Wheel Alignment (Passenger)",
      "1x Rotate & Balance (Passenger)",
      "2x Engine Diagnostics",
      "1x Autel Full System Scan",
      "1x Coolant Flush",
      "1x Power Steering Flush",
      "1x Brake Fluid Flush",
      "Unlimited Puncture Repairs",
      "100% Labour Coverage"
    ]
  },
  {
    id: "family",
    name: "Family Safety Pack",
    subtitle: "(2 Cars)",
    badge: "Most Popular",
    popular: true,
    monthlyPrice: 60,
    yearlyPrice: 600,
    value: 1818,
    savings: 1158,
    features: [
      "2x Express Service (oil change, oil filter, 5L oil, 50-point safety inspection)",
      "2x Wheel Alignments",
      "2x Rotate & Balance",
      "4x Engine Diagnostics",
      "2x Autel Full System Scan",
      "2x Coolant Flush",
      "2x Power Steering Flush",
      "2x Brake Fluid Flush",
      "Unlimited Puncture Repairs",
      "100% Labour Coverage"
    ]
  },
  {
    id: "business",
    name: "Business Starter",
    subtitle: "(3 Vehicles)",
    badge: "The Deal Breaker",
    monthlyPrice: 110,
    yearlyPrice: 1100,
    value: 2940,
    savings: 1752,
    features: [
      "3x Express Services (5L oil included, $20/L over 5L)",
      "3x Wheel Alignments",
      "3x Rotate & Balance",
      "6x Engine Diagnostics",
      "3x Autel Full System Scan",
      "3x Coolant Flush",
      "3x Power Steering Flush",
      "3x Brake Fluid Flush",
      "Unlimited Puncture Repairs",
      "100% Labour Coverage"
    ]
  },
  {
    id: "enterprise",
    name: "Business Velocity Pack",
    subtitle: "(6+ Vehicles)",
    badge: "Enterprise Solution",
    monthlyPrice: 40,
    yearlyPrice: 400,
    perVehicle: true,
    features: [
      "Per Vehicle Pricing",
      "1 Free Tow Per Year + 50% Off 2nd Tow",
      "Concierge Vehicle Return",
      "Top Priority Workshop Service",
      "All Business Starter Benefits",
      "Dedicated Account Manager",
      "Custom Service Scheduling"
    ]
  }
];

export const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 px-4 relative">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            All plans include unlimited puncture repairs and 100% labour coverage. Start saving from day one.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-secondary/50 p-2 rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md transition-all ${
                billingPeriod === "monthly" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-md transition-all ${
                billingPeriod === "yearly" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
            </button>
            {billingPeriod === "yearly" && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">Save 17%</Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`glass-card p-6 flex flex-col relative ${
                plan.popular ? "ring-2 ring-primary glow-border scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  {plan.badge}
                </Badge>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{plan.subtitle}</p>
                {!plan.popular && (
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {plan.badge}
                  </Badge>
                )}
              </div>

              {plan.value && (
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    ${plan.value}+ Value for
                  </div>
                  <div className="text-4xl font-bold">
                    ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    <span className="text-lg text-muted-foreground">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                    {plan.perVehicle && <span className="text-sm">/vehicle</span>}
                  </div>
                  {plan.savings && (
                    <div className="text-sm text-primary mt-2">
                      Save ${plan.savings} annually
                    </div>
                  )}
                </div>
              )}

              {!plan.value && (
                <div className="mb-6">
                  <div className="text-4xl font-bold">
                    ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    <span className="text-lg text-muted-foreground">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                    {plan.perVehicle && <span className="text-sm text-muted-foreground">/vehicle</span>}
                  </div>
                </div>
              )}

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                {plan.features.length > 3 && (
                  <Button variant="outline" className="w-full" size="sm">
                    See All {plan.features.length} Services
                  </Button>
                )}
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-secondary hover:bg-secondary/80"
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
