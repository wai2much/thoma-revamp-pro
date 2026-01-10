import { Card } from "@/components/ui/card";
import { Wrench, Clock, Shield, Star, Users, CheckCircle } from "lucide-react";

const benefits = [
  {
    icon: Wrench,
    title: "Expert Service",
    description: "ASE-certified technicians with years of experience on all makes and models."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Online booking, express service, and convenient locations near you."
  },
  {
    icon: Shield,
    title: "Peace of Mind",
    description: "Comprehensive warranty and 100% satisfaction guarantee on all work."
  },
  {
    icon: Star,
    title: "4.9★ Rating",
    description: "Consistently rated excellent by our members across all locations."
  },
  {
    icon: Users,
    title: "Growing Community",
    description: "Join thousands of satisfied members who trust us with their car care."
  },
  {
    icon: CheckCircle,
    title: "Same-Day Service",
    description: "Most services completed the same day with our priority scheduling."
  }
];

const features = [
  "Expanding membership",
  "4.9★ average rating",
  "Same-day service",
  "Certified technicians"
];

export const Benefits = () => {
  return (
    <>
      {/* Feature strip */}
      <section className="py-12 px-4 relative overflow-hidden border-y border-primary/20" aria-label="Key features">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground font-mono uppercase tracking-wider">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <CheckCircle className="h-4 w-4 text-primary group-hover:text-glow-cyan transition-all" />
                <span className="group-hover:text-primary transition-colors">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-24 px-4 relative overflow-hidden" aria-labelledby="benefits-heading">
        {/* Cyberpunk background */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 cyber-grid opacity-15" />
        <div className="absolute inset-0 opacity-20" 
             style={{ background: 'var(--gradient-stripe)' }} 
        />
        
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 id="benefits-heading" className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase tracking-wider text-glow-cyan">
              Why choose our <span className="gradient-text">membership?</span>
            </h2>
            <p className="text-xl text-muted-foreground font-sans">
              Everything you need to keep your car running smoothly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={idx}
                  className="glass-card p-6 hover:glow-border transition-all group border-primary/20"
                >
                  <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center mb-4 border border-primary/30 group-hover:neon-glow transition-all">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 uppercase tracking-wide">{benefit.title}</h3>
                  <p className="text-muted-foreground font-sans">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
