import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const plans = [
  { vehicles: 1, name: "Single Pack", price: 35, value: 1059, savings: 639 },
  { vehicles: 2, name: "Family Safety Pack", price: 60, value: 1818, savings: 1158 },
  { vehicles: 3, name: "Business Starter", price: 110, value: 2940, savings: 1752 },
];

export const SavingsCalculator = () => {
  const [vehicles, setVehicles] = useState(1);
  
  const currentPlan = plans.find(p => p.vehicles === vehicles) || plans[0];

  return (
    <section className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your <span className="gradient-text">Annual Savings</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See exactly how much you'll save with Priority Care
          </p>
        </div>

        <Card className="glass-card p-8 md:p-12">
          <div className="space-y-8">
            {/* Slider */}
            <div>
              <label className="block text-lg font-medium mb-6">
                How many vehicles do you have?
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[vehicles]}
                  onValueChange={(value) => setVehicles(value[0])}
                  min={1}
                  max={3}
                  step={1}
                  className="flex-1"
                />
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
                  {vehicles}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-secondary/50">
                <div className="text-sm text-muted-foreground mb-2">Recommended Plan</div>
                <div className="text-2xl font-bold">{currentPlan.name}</div>
                <div className="text-3xl font-bold text-primary mt-2">${currentPlan.price}/mo</div>
              </div>

              <div className="text-center p-6 rounded-lg bg-primary/10 md:col-span-2">
                <div className="text-sm text-muted-foreground mb-2">Your Annual Savings</div>
                <div className="text-5xl font-bold gradient-text">${currentPlan.savings}</div>
                <div className="text-lg text-muted-foreground mt-2">
                  ${currentPlan.value} value for ${currentPlan.price * 12}
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started with {currentPlan.name}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
