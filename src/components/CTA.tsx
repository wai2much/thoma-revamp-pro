import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section id="locations" className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(217_91%_60%/0.15),transparent_70%)]" />
      
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
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          <div>✓ Some commitment</div>
          <div>✓ Cancel anytime</div>
          <div>✓ Money-back guarantee</div>
        </div>
      </div>
    </section>
  );
};
