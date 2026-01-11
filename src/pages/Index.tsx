import { Hero } from "@/components/Hero";
import { LoyaltyCardCapture } from "@/components/LoyaltyCardCapture";
import { ServiceCapabilities } from "@/components/ServiceCapabilities";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PricingPlans } from "@/components/PricingPlans";
import { ValueBreakdown } from "@/components/ValueBreakdown";
import { Benefits } from "@/components/Benefits";
import { RewardsProgram } from "@/components/RewardsProgram";
import { WalletPassShowcase } from "@/components/WalletPassShowcase";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen relative text-foreground">
      {/* Dark cyberpunk base background */}
      <div className="fixed inset-0 bg-background -z-10" />
      
      {/* Cyber grid overlay */}
      <div className="fixed inset-0 cyber-grid opacity-30 -z-10" />
      
      {/* Animated neon gradient */}
      <div className="fixed inset-0 opacity-40 -z-10" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      {/* Subtle vignette */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-background/60 -z-10" />
      
      <Navigation />
      
      <main>
        <Hero />
        <LoyaltyCardCapture />
        <ServiceCapabilities />
        <SavingsCalculator />
        <PricingPlans />
        <ValueBreakdown />
        <RewardsProgram />
        <Benefits />
        <CTA />
      </main>
        
        {/* Footer - Cyberpunk style */}
        <footer className="relative border-t border-primary/20 py-12 px-4 liquid-glass">
          <div className="absolute inset-0 bg-background/95" />
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-display font-semibold mb-3 text-primary uppercase tracking-wider text-glow-cyan">Contact Us</h3>
                <div className="space-y-2 text-sm text-muted-foreground font-mono">
                  <p>
                    <a href="tel:+61468003380" className="hover:text-primary transition-colors">
                      📞 +61 468 003 380
                    </a>
                  </p>
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
                    <a href="https://hausoftechnik.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      hausoftechnik.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-display font-semibold mb-3 text-primary uppercase tracking-wider text-glow-cyan">Fair Play Commitment</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-3">
                  Our membership service is designed with transparency and fairness in mind. 
                  We comply with all Australian Consumer Law requirements and industry standards, 
                  ensuring you receive honest pricing, quality service, and clear terms without hidden fees.
                </p>
                <ul className="text-xs text-muted-foreground font-mono space-y-1">
                  <li>• <span className="text-primary">Annual payment:</span> No lock-up period — full access from day one</li>
                  <li>• <span className="text-accent">Monthly payment:</span> 2-month lock-up period for premium services</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-6 border-t border-primary/20 font-mono">
              <p className="uppercase tracking-widest">© 2025 Haus of Technik // All Systems Operational</p>
            </div>
          </div>
        </footer>
      
      <AIAssistant />
    </div>
  );
};

export default Index;
