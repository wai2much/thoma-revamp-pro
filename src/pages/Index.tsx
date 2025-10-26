import { Hero } from "@/components/Hero";
import { LoyaltyCardCapture } from "@/components/LoyaltyCardCapture";
import { ServiceCapabilities } from "@/components/ServiceCapabilities";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PricingPlans } from "@/components/PricingPlans";
import { ValueBreakdown } from "@/components/ValueBreakdown";
import { Benefits } from "@/components/Benefits";
import { RewardsProgram } from "@/components/RewardsProgram";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen relative text-foreground">
      {/* Stripe-inspired gradient background across entire page */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 opacity-40 -z-10" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60 -z-10" />
      
      <Navigation />
      <Hero />
      <ServiceCapabilities />
      <SavingsCalculator />
      <PricingPlans />
      <ValueBreakdown />
      <RewardsProgram />
      <Benefits />
      <CTA />
        
        {/* Footer */}
        <footer className="relative border-t border-border/50 py-12 px-4">
          <div className="absolute inset-0 bg-secondary/20" />
          <div className="absolute inset-0 opacity-30" 
               style={{ background: 'var(--gradient-stripe)' }} 
          />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Contact Us</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <a href="mailto:info@hausoftechnik.com.au" className="hover:text-primary transition-colors">
                      info@hausoftechnik.com.au
                    </a>
                  </p>
                  <p>
                    <a href="https://hausoftechnik.com.au" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      hausoftechnik.com.au
                    </a>
                  </p>
                  <p>
                    <a href="https://onlinetyreplusthomastown.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      onlinetyreplusthomastown.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Fair Play Commitment</h3>
                <p className="text-sm text-muted-foreground">
                  Our membership service is designed with transparency and fairness in mind. 
                  We comply with all Australian Consumer Law requirements and industry standards, 
                  ensuring you receive honest pricing, quality service, and clear terms without hidden fees.
                </p>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border/50">
              <p>© 2025 Tyreplus Thomastown. All rights reserved.</p>
            </div>
          </div>
        </footer>
      
      <AIAssistant />
    </div>
  );
};

export default Index;
