import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cPackServices = [
  { name: "1x Express Service", value: 150 },
  { name: "1x Rotate & Balance", value: 130 },
  { name: "1x Diagnostics", value: 150 },
  { name: "Unlimited Puncture Repairs (Est.)", value: 100 },
  { name: "Priority Booking", value: 50 },
];

const familyPackServices = [
  { name: "2x Express Services (per vehicle)", value: 600 },
  { name: "2x Rotate & Balance (per vehicle)", value: 520 },
  { name: "2x Wheel Alignment (per vehicle)", value: 360 },
  { name: "2x Diagnostics (per vehicle)", value: 600 },
  { name: "2x Fault Scans (per vehicle)", value: 480 },
  { name: "2x Coolant Flush (per vehicle)", value: 360 },
  { name: "Unlimited Puncture Repairs (Est.)", value: 150 },
];

const businessStarterServices = [
  { name: "3x Express Services (per vehicle)", value: 1350 },
  { name: "3x Rotate & Balance (per vehicle)", value: 1170 },
  { name: "3x Wheel Alignment (per vehicle)", value: 810 },
  { name: "3x Diagnostics (per vehicle)", value: 1350 },
  { name: "3x Fault Scans (per vehicle)", value: 1080 },
  { name: "1x Coolant Flush (per vehicle)", value: 270 },
  { name: "Unlimited Puncture Repairs (Est.)", value: 200 },
];

const businessVelocityServices = [
  { name: "2x Logbook Services (per vehicle)", value: 600 },
  { name: "2x Rotate & Balance (per vehicle)", value: 260 },
  { name: "2x Wheel Alignment (per vehicle)", value: 180 },
  { name: "2x Engine Diagnostics (per vehicle)", value: 300 },
  { name: "2x Fault Full System Scans (per vehicle)", value: 240 },
  { name: "2x Coolant Flush (per vehicle)", value: 180 },
  { name: "2x Power Steering Flush (per vehicle)", value: 180 },
  { name: "2x Brake Fluid Flush (per vehicle)", value: 100 },
  { name: "Unlimited Puncture Repairs (Est.)", value: 100 },
  { name: "1 Free Tow + 50% off additional", value: 150 },
];

const planData = [
  {
    id: "c-pack",
    name: "C Pack",
    subtitle: "1 Vehicle",
    services: cPackServices,
    annualCost: 660,
    margin: "~88%"
  },
  {
    id: "family",
    name: "Family Pack",
    subtitle: "2 Vehicles",
    services: familyPackServices,
    annualCost: 1320,
    margin: "~57%"
  },
  {
    id: "business",
    name: "Business Starter Pack",
    subtitle: "3 Vehicles",
    services: businessStarterServices,
    annualCost: 2988,
    margin: "~58%"
  },
  {
    id: "velocity",
    name: "Business Velocity Pack",
    subtitle: "Per Vehicle (6+ minimum)",
    services: businessVelocityServices,
    annualCost: 1200,
    margin: "~69%"
  }
];

export const ValueBreakdown = () => {
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

        <Tabs defaultValue="family" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            {planData.map((plan) => (
              <TabsTrigger key={plan.id} value={plan.id} className="text-xs sm:text-sm">
                {plan.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {planData.map((plan) => {
            const totalValue = plan.services.reduce((sum, service) => sum + service.value, 0);
            const savings = totalValue - plan.annualCost;
            const roi = Math.round((savings / plan.annualCost) * 100);

            return (
              <TabsContent key={plan.id} value={plan.id}>
                <Card className="glass-card p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.subtitle}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 rounded-lg bg-secondary/50">
                      <div className="text-sm text-muted-foreground mb-2">Annual Cost</div>
                      <div className="text-3xl font-bold">${plan.annualCost}</div>
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
                    {plan.services.map((service, idx) => (
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-lg bg-accent/10 border-l-4 border-accent">
                      <div className="text-sm font-semibold mb-2">Profit Margin</div>
                      <div className="text-2xl font-bold text-accent">{plan.margin}</div>
                    </div>
                    <div className="p-6 rounded-lg bg-primary/10 border-l-4 border-primary">
                      <div className="text-sm font-semibold mb-2">Customer ROI</div>
                      <div className="text-2xl font-bold text-primary">{roi}%</div>
                    </div>
                  </div>

                  {savings > 0 && (
                    <div className="mt-6 p-6 rounded-lg bg-accent/10 border-l-4 border-accent">
                      <p className="text-sm">
                        <strong>Value Proposition:</strong> Members save ${savings} annually compared to retail pricing. That's <strong>${Math.round(savings / 12)}</strong> back in their pocket every month.
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Visualization */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">See Your Savings at a Glance</h3>
          <p className="text-muted-foreground mb-4">
            Switch between plans above to compare value breakdowns
          </p>
        </div>
      </div>
    </section>
  );
};
