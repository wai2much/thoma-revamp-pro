import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Locations = () => {
  return (
    <section id="locations" className="relative py-24 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 opacity-30" style={{ background: 'var(--gradient-stripe)' }} />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest font-mono">
              Service Locations
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wider mb-4 text-glow-cyan">
            Find <span className="gradient-text">Your Location</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit our flagship service center for premium car care and membership services.
          </p>
        </div>

        {/* Location card */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-10 border-primary/30 relative overflow-hidden group">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              {/* Location header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide text-glow-cyan">
                    TyrePlus Thomastown
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm mt-1">
                    Flagship Service Center
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Address */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Address</p>
                      <p className="text-foreground font-medium">
                        130 Settlement Road
                        <br />
                        Thomastown VIC 3074
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                      <a 
                        href="tel:0394624400" 
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        (03) 9462 4400
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Opening Hours</p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        <p className="text-foreground">Monday - Friday</p>
                        <p className="text-muted-foreground font-mono">8:00 AM - 5:30 PM</p>
                        <p className="text-foreground">Saturday</p>
                        <p className="text-muted-foreground font-mono">8:00 AM - 1:00 PM</p>
                        <p className="text-foreground">Sunday</p>
                        <p className="text-muted-foreground font-mono">Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow uppercase tracking-wider font-semibold"
                  asChild
                >
                  <a 
                    href="https://maps.google.com/?q=130+Settlement+Road+Thomastown+VIC+3074" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="flex-1 border-primary/50 hover:bg-primary/10 hover:border-primary uppercase tracking-wider glow-border"
                  asChild
                >
                  <a href="tel:0394624400">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-8 rounded-xl overflow-hidden border border-primary/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3156.3897089687146!2d145.0166853!3d-37.6915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad64f4b2a7a6e8f%3A0x8a1b9f8d0f1a2b3c!2s130%20Settlement%20Rd%2C%20Thomastown%20VIC%203074!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                  width="100%"
                  height="300"
                  style={{ border: 0, filter: 'grayscale(80%) contrast(1.1) brightness(0.9)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TyrePlus Thomastown Location"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>
    </section>
  );
};
