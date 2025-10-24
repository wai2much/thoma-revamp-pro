import { Hero } from "@/components/Hero";
import { LuxuryMembershipCard } from "@/components/LuxuryMembershipCard";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PricingPlans } from "@/components/PricingPlans";
import { ValueBreakdown } from "@/components/ValueBreakdown";
import { Benefits } from "@/components/Benefits";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <LuxuryMembershipCard />
        <SavingsCalculator />
        <PricingPlans />
        <ValueBreakdown />
        <Benefits />
        <CTA />
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-4">
          <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2025 Tyreplus Thomastown. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
