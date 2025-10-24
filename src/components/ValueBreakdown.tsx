import { Card } from "@/components/ui/card";

const services = [
  { name: "1x Wheel Alignment (Passenger)", value: 89 },
  { name: "1x Rotate & Balance (Passenger)", value: 130 },
  { name: "2x Engine Diagnostics", value: 300 },
  { name: "1x Autel Full System Scan", value: 120 },
  { name: "1x Coolant Flush", value: 90 },
  { name: "1x Power Steering Flush", value: 90 },
  { name: "1x Brake Fluid Flush", value: 50 },
  { name: "Unlimited Puncture Repairs (Est.)", value: 100 },
];

export const ValueBreakdown = () => {
  const totalValue = services.reduce((sum, service) => sum + service.value, 0);
  const annualCost = 420;
  const savings = totalValue - annualCost;

  return (
    <section className="py-24 px-4 bg-secondary/20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Exact <span className="gradient-text">Value Breakdown</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See the precise retail value of every service included in your plan. Total transparency, zero hidden costs.
          </p>
        </div>

        <Card className="glass-card p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-8">Single Pack Breakdown</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-2">Annual Cost</div>
              <div className="text-3xl font-bold">${annualCost}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Total Value</div>
              <div className="text-3xl font-bold text-primary">${totalValue}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-sm text-muted-foreground mb-2">You Save</div>
              <div className="text-3xl font-bold text-accent">${savings}</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-lg mb-4">INCLUDED SERVICES</h4>
            {services.map((service, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <span>{service.name}</span>
                <span className="font-semibold text-primary">${service.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/20 font-bold text-lg border-2 border-primary/30">
              <span>TOTAL ANNUAL VALUE</span>
              <span className="text-primary">${totalValue}</span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm">
              <strong>Pro Tip:</strong> Just one wheel alignment and a few puncture repairs pays for your entire membership. Everything else is pure savings.
            </p>
          </div>
        </Card>

        {/* Savings visualization */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Annual Cost Comparison</h3>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end justify-center gap-8 mb-8">
              <div className="flex-1">
                <div 
                  className="bg-gradient-to-t from-muted to-muted/50 rounded-t-lg mb-4 flex items-end justify-center"
                  style={{ height: '300px' }}
                >
                  <span className="text-4xl font-bold mb-4">${totalValue}</span>
                </div>
                <div className="text-sm text-muted-foreground">Retail Cost</div>
              </div>
              <div className="flex-1">
                <div 
                  className="bg-gradient-to-t from-primary to-primary/50 rounded-t-lg mb-4 flex items-end justify-center"
                  style={{ height: `${(annualCost / totalValue) * 300}px` }}
                >
                  <span className="text-4xl font-bold mb-4 text-primary-foreground">${annualCost}</span>
                </div>
                <div className="text-sm text-muted-foreground">Your Cost</div>
              </div>
            </div>
            
            <div className="glass-card p-6 inline-block">
              <div className="text-lg mb-2">
                You Save <span className="text-3xl font-bold gradient-text">${savings}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ROI: <span className="text-accent font-bold">{Math.round((savings / annualCost) * 100)}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                That's <strong className="text-foreground">${savings}</strong> back in your pocket every year
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
