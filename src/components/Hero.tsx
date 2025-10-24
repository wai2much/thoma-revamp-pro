import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const Hero = () => {
  const scrollToPlans = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocations = () => {
    document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(217_91%_60%/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(271_91%_65%/0.1),transparent_50%)]" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Tyreplus Thomastown - Growing membership base</p>
        </div>

        {/* Main headline */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Car care made
            <br />
            <span className="gradient-text">simple and affordable</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Membership-based car maintenance that saves you time and money. All-inclusive plans starting at $55/month.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            onClick={scrollToPlans}
            className="group bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            View Membership Plans
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={scrollToLocations}
            className="border-primary/20 hover:bg-primary/10"
          >
            Find a Location
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-6 text-center hover:glow-border transition-all">
            <div className="text-4xl font-bold mb-2">Growing</div>
            <div className="text-muted-foreground">Customer Base</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center hover:glow-border transition-all">
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-muted-foreground">Locations</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center hover:glow-border transition-all">
            <div className="text-4xl font-bold mb-2">4.9★</div>
            <div className="text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/61451590517?text=Hi!%20I%27m%20interested%20in%20your%20car%20service%20membership"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </section>
  );
};
