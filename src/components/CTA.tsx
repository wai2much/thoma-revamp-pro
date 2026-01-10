import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Zap } from "lucide-react";

export const CTA = () => {
  return (
    <section id="locations" className="py-24 px-4 relative overflow-hidden">
      {/* Cyberpunk background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 opacity-30" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      {/* Neon accent lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      
      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-sm text-primary font-mono uppercase tracking-widest">System Ready</span>
          <Zap className="h-6 w-6 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 uppercase tracking-wider text-glow-cyan">
          Ready to <span className="gradient-text">join?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 font-sans">
          Join our growing community of drivers who trust us with their car care. Get started today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 group neon-glow uppercase tracking-wider font-semibold"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Choose Your Plan
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:border-primary uppercase tracking-wider glow-border"
          >
            Schedule Service
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>30-day notice required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Money-back guarantee</span>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-primary/20">
          <h3 className="text-xl font-display font-semibold mb-6 uppercase tracking-wider text-glow-cyan">Contact Us</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="tel:94624400"
              className="flex items-center gap-2 text-lg hover:text-primary transition-colors group glass-card px-4 py-2 rounded glow-border"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold font-mono">Shop: 9462 4400</span>
            </a>
            <div className="hidden sm:block text-primary/50">|</div>
            <a 
              href="tel:+61468003380"
              className="flex items-center gap-2 text-lg hover:text-primary transition-colors group glass-card px-4 py-2 rounded glow-border"
            >
              <Phone className="h-5 w-5" />
              <span className="font-semibold font-mono">AI Assistant: 0468 003 380</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-sans">
            Call us for appointments, service inquiries, or speak with our AI assistant 24/7
          </p>
        </div>
      </div>
    </section>
  );
};
