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
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(217_91%_60%/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(271_91%_65%/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(316_70%_60%/0.1),transparent_60%)]" />
      
      {/* Animated dots */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full pulse-glow" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary rounded-full pulse-glow" style={{ animationDelay: '2s' }} />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mb-8 opacity-0 animate-fade-in">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm text-muted-foreground font-medium">Tyreplus Thomastown - Growing membership base</p>
        </div>

        {/* Main headline */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Car care made
            <br />
            <span className="gradient-text">simple and affordable</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Membership-based car maintenance that saves you time and money. All-inclusive plans starting at <span className="text-primary font-semibold">$55/month</span>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <Button 
            size="lg" 
            onClick={scrollToPlans}
            className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-glow-accent transition-all duration-300 hover:scale-105"
          >
            View Membership Plans
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={scrollToLocations}
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            Find a Location
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
            <div className="text-5xl font-display font-bold mb-2 gradient-text group-hover:scale-110 transition-transform duration-300">Growing</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Customer Base</div>
          </div>
          <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
            <div className="text-5xl font-display font-bold mb-2 gradient-text group-hover:scale-110 transition-transform duration-300">Premium</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Service Quality</div>
          </div>
          <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
            <div className="text-5xl font-display font-bold mb-2 text-primary group-hover:scale-110 transition-transform duration-300">4.9★</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/61451590517?text=Hi!%20I%27m%20interested%20in%20your%20car%20service%20membership"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 pulse-glow animate-fade-in"
        style={{ boxShadow: '0 0 30px rgba(37, 211, 102, 0.3)' }}
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </section>
  );
};
