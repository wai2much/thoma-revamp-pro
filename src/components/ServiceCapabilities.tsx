import { Card } from "@/components/ui/card";
import { CheckCircle, Truck, Car, AlertCircle } from "lucide-react";

export const ServiceCapabilities = () => {
  return (
    <section className="py-20 px-4 liquid-glass" aria-labelledby="service-capabilities-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="service-capabilities-heading" className="text-4xl font-bold mb-4">
            What We Service
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional service for vehicles up to 2.5 tons
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* We Service */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">We Service</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Passenger Vehicles</p>
                  <p className="text-sm text-muted-foreground">Sedans, hatchbacks, wagons</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">SUVs & 4WDs</p>
                  <p className="text-sm text-muted-foreground">All sizes up to 2.5 tons</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Utes & Light Trucks</p>
                  <p className="text-sm text-muted-foreground">Ford Ranger, Toyota Hilux, etc.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Vans</p>
                  <p className="text-sm text-muted-foreground">Commercial & passenger vans</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Maximum Capacity */}
          <Card className="glass-card p-8 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Maximum Capacity</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Maximum GVM</p>
                  <p className="text-4xl font-bold text-primary mb-2">2.5 Tons</p>
                  <p className="text-sm text-muted-foreground">(2,500 kg Gross Vehicle Mass)</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Examples of Max Vehicles:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Ford Ranger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Toyota Hilux</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Mitsubishi Triton</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Isuzu D-Max</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Not sure?</span> Contact us to confirm if we can service your vehicle.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};