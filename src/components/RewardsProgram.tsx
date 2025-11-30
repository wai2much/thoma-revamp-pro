import { Card } from "@/components/ui/card";
import { Gift, TrendingUp, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RewardsProgram = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Earn Points Every Day",
      description: "$1 spent = 1 point earned at Haus of Technik",
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "1,000 points = $100 Uber Eats gift card",
    },
    {
      icon: Trophy,
      title: "Weekly Giveaways",
      description: "All registered members are automatically entered to win cash prizes",
    },
    {
      icon: Sparkles,
      title: "Membership Bonus",
      description: "Earn bonus points instantly when you purchase your membership",
    },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Stripe gradient overlay */}
      <div className="absolute inset-0 opacity-25" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Rewards <span className="gradient-text">Program</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn points with every purchase and redeem for exclusive rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="glass-card p-6 hover:glow-border transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card p-8 border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">1</div>
                <p className="text-muted-foreground">Shop at Haus of Technik</p>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">2</div>
                <p className="text-muted-foreground">Earn 1 point per $1 spent</p>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">3</div>
                <p className="text-muted-foreground">Redeem for rewards</p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Earning Points
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
