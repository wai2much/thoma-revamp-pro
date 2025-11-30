import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export const CTA = () => {
  return (
    <section id="locations" className="py-24 px-4 relative overflow-hidden liquid-glass">
      {/* Stripe gradient overlay */}
      <div className="absolute inset-0 opacity-25" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to <span className="gradient-text">join?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join our growing community of drivers who trust us with their car care. Get started today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 group"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Choose Your Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            Schedule Service
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div>✓ 30-day notice required</div>
          <div>✓ Cancel anytime</div>
          <div>✓ Money-back guarantee</div>
        </div>

        <div className="mt-12 pt-12 border-t border-border/50">
          <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="tel:94624400"
              className="flex items-center gap-2 text-lg hover:text-primary transition-colors group"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold">Shop: 9462 4400</span>
            </a>
            <div className="hidden sm:block text-muted-foreground">|</div>
            <a 
              href="tel:+61468003380"
              className="flex items-center gap-2 text-lg hover:text-primary transition-colors group"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold">AI Assistant: 0468 003 380</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Call us for appointments, service inquiries, or speak with our AI assistant 24/7
          </p>
        </div>
      </div>
    </section>
  );
};
