import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Shield, 
  Clock, 
  Truck, 
  Phone, 
  Upload, 
  AlertCircle,
  Star,
  Users,
  Zap,
  ChevronRight,
  Calculator,
  Fuel,
  X,
  Sparkles,
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MEMBERSHIP_TIERS } from "@/lib/membershipTiers";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FleetPlan = () => {
  const [fleetSize, setFleetSize] = useState(6);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addFuelDrops, setAddFuelDrops] = useState(false);
  const [addUnlimitedTows, setAddUnlimitedTows] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const basePrice = 200;
  const minVehicles = 6;
  const competitorPrice = 50; // Average competitor cost per car
  const fuelDropsPrice = 20;
  const unlimitedTowsPrice = 100;
  
  const perVehicleCost = fleetSize >= minVehicles ? (basePrice * (fleetSize / minVehicles)) / fleetSize : 33.33;
  const baseMonthly = fleetSize >= minVehicles ? basePrice * (fleetSize / minVehicles) : basePrice;
  const addonsTotal = (addFuelDrops ? fuelDropsPrice : 0) + (addUnlimitedTows ? unlimitedTowsPrice : 0);
  const totalMonthly = baseMonthly + addonsTotal;
  const competitorTotal = fleetSize * competitorPrice;
  const savings = competitorTotal - baseMonthly;

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe",
      });
      navigate("/auth");
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: MEMBERSHIP_TIERS.enterprise.price_id },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Checkout Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 text-center font-semibold">
        <span className="mr-2">🚨</span>
        First 10 fleets get FREE tire changes for 3 months!
        <span className="ml-2">🚨</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                Premium Fleet
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
                Fleet Roadside Care:{" "}
                <span className="gradient-text">Only $33/Car/Month</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                1 Free Tow Every 90 Days + 24/7 Priority Dispatch
              </p>

              {/* Price Anchor - Competitor Comparison */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <span className="text-sm">
                  <span className="line-through text-muted-foreground">Average competitor: $50/car</span>
                  <span className="ml-2 font-bold text-primary">You pay only $33/car</span>
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>6+ Vehicle Minimum</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Save 40% vs Single Plan</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>30-day notice to cancel</span>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={handleSubscribe}
                disabled={checkoutLoading}
                className="bg-[#00C853] hover:bg-[#00C853]/90 text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                {checkoutLoading ? "Loading..." : "Cover Your Fleet Now"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Right: Image placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
                <div className="text-center p-8">
                  <Truck className="h-24 w-24 mx-auto text-primary/50 mb-4" />
                  <p className="text-muted-foreground">Fleet Driver Image</p>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-muted-foreground">Fleets Protected</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-xs text-muted-foreground">Dispatch Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Boost Banner */}
      <section className="py-6 px-4 bg-gradient-to-r from-accent/20 to-primary/20">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-semibold">Free tire changes for first 30 days</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Priority fleet dispatch (skip the line)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Box Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-5xl mx-auto">
          <Card className="p-8 border-2 border-primary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Pricing */}
              <div>
                <h2 className="text-3xl font-bold mb-2">Fleet Pricing</h2>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-primary">$200</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">(min. 6 cars — no vehicle swaps for 30 days)</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="font-semibold">$33/car — save 40% vs Single Plan</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Free tow unlocks after 60 days</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    <span className="text-sm">
                      <span className="line-through text-muted-foreground">Competitors: $50/car</span>
                      <span className="ml-2 font-bold">You save ${savings}/mo</span>
                    </span>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="border-t pt-4 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Optional Add-ons
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Fuel Drops</span>
                          <p className="text-xs text-muted-foreground">Emergency fuel delivery</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">+$20/mo</span>
                        <Switch 
                          checked={addFuelDrops} 
                          onCheckedChange={setAddFuelDrops}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Unlimited Tows</span>
                          <p className="text-xs text-muted-foreground">No limits, no waiting</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">+$100/mo</span>
                        <Switch 
                          checked={addUnlimitedTows} 
                          onCheckedChange={setAddUnlimitedTows}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={checkoutLoading}
                  className="w-full bg-[#00C853] hover:bg-[#00C853]/90 text-white font-bold text-lg py-6"
                >
                  {checkoutLoading ? "Loading..." : "Cover Your Fleet Now"}
                </Button>
              </div>

              {/* Right: Calculator */}
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Fleet Cost Calculator</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fleet-size">Number of Vehicles</Label>
                    <Input
                      id="fleet-size"
                      type="number"
                      min={6}
                      value={fleetSize}
                      onChange={(e) => setFleetSize(Math.max(6, parseInt(e.target.value) || 6))}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minimum 6 vehicles required</p>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Per Vehicle</span>
                      <span className="font-bold text-primary">${perVehicleCost.toFixed(2)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Plan</span>
                      <span className="font-semibold">${baseMonthly.toFixed(0)}</span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Add-ons</span>
                        <span>+${addonsTotal}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-semibold">Total Monthly</span>
                      <span className="font-bold text-2xl text-primary">${totalMonthly.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Savings comparison */}
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Competitor would charge:</span>
                      <span className="line-through text-muted-foreground">${competitorTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-accent">Your monthly savings:</span>
                      <span className="font-bold text-accent">${savings}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Anti-Abuse Terms */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card className="p-6 border-l-4 border-l-amber-500 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-3 text-lg">Fair Use Policy (No Surprises)</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span><strong>60-Day Tow Lock:</strong> Free tow unlocks after 60 days of active membership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span><strong>90-Day Tow Cap:</strong> Max 1 free tow every 90 days per vehicle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600" />
                    <span><strong>Early Cancel Fee:</strong> Cancel within 6 months after using tow? $50 fee applies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-amber-600" />
                    <span><strong>No Vehicle Swaps:</strong> Fleet vehicles locked for 30 days after registration</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything Your Fleet Needs
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "2x Logbook Services", desc: "Per vehicle annually" },
              { icon: Shield, title: "Unlimited Puncture Repairs", desc: "No limits, no extra cost" },
              { icon: Clock, title: "24/7 Priority Dispatch", desc: "Fleet gets priority—skip the line" },
              { icon: Zap, title: "50% Off Additional Tows", desc: "After free tow used" },
              { icon: Phone, title: "Dedicated Fleet Line", desc: "Direct support access" },
              { icon: Users, title: "Fleet-wide SMS Alerts", desc: "Service reminders for all vehicles" },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Fleet Managers
          </h2>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 glass-card">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg italic mb-3">
                    "Saved my fleet $1,200 last year! The 24/7 dispatch alone is worth it."
                  </p>
                  <p className="font-semibold">— Marcus T., Transport Solutions</p>
                  <p className="text-sm text-muted-foreground">12-vehicle fleet</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 glass-card">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg italic mb-3">
                    "Finally, a plan that makes sense for small fleets. No hidden fees, great service."
                  </p>
                  <p className="font-semibold">— Sarah K., Metro Delivery</p>
                  <p className="text-sm text-muted-foreground">8-vehicle fleet</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">500+ Fleets Protected</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">24/7 Dispatch Guarantee</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-semibold">Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Document Upload Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Upload your fleet documents to verify your vehicles and lock in your rate.
          </p>
          
          <Card className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-primary/50 mb-4" />
            <p className="font-semibold mb-2">Upload Fleet Docs</p>
            <p className="text-sm text-muted-foreground">
              Drag and drop your registration documents here
            </p>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Protect Your Fleet Today
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Join 500+ fleet managers who trust us with their vehicles
          </p>
          <p className="text-lg mb-8">
            <span className="line-through text-muted-foreground">Competitors charge $50/car</span>
            <span className="ml-2 font-bold text-primary">You pay only $33/car</span>
          </p>
          
          <Button 
            size="lg"
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="bg-[#00C853] hover:bg-[#00C853]/90 text-white font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-glow transition-all"
          >
            {checkoutLoading ? "Loading..." : "Cover Your Fleet Now — $33/car/mo"}
          </Button>
          
          <p className="mt-4 text-sm text-muted-foreground">
            30-day notice to cancel • Money-back guarantee • No vehicle swaps for 30 days
          </p>
        </div>
      </section>
    </div>
  );
};

export default FleetPlan;
