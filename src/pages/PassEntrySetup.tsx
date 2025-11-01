import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MEMBERSHIP_TIERS } from "@/lib/membershipTiers";
import { Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface TierConfig {
  product_id: string;
  template_id: string;
  tier_name: string;
}

export default function PassEntrySetup() {
  const [configs, setConfigs] = useState<Record<string, string>>({
    [MEMBERSHIP_TIERS.single.product_id]: "",
    [MEMBERSHIP_TIERS.family.product_id]: "",
    [MEMBERSHIP_TIERS.business.product_id]: "",
    [MEMBERSHIP_TIERS.enterprise.product_id]: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from("passentry_config")
        .select("*");

      if (error) throw error;

      if (data) {
        const configMap: Record<string, string> = {};
        data.forEach((config: TierConfig) => {
          configMap[config.product_id] = config.template_id;
        });
        setConfigs((prev) => ({ ...prev, ...configMap }));
      }
    } catch (error) {
      console.error("Error fetching configs:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        return;
      }

      const updates = Object.entries(configs).map(([product_id, template_id]) => ({
        product_id,
        template_id,
        tier_name: Object.values(MEMBERSHIP_TIERS).find(t => t.product_id === product_id)?.name || "",
      }));

      const { error } = await supabase.functions.invoke("update-passentry-config", {
        body: { configs: updates },
      });

      if (error) throw error;

      toast.success("PassEntry templates configured successfully!");
    } catch (error: any) {
      console.error("Error saving configs:", error);
      toast.error(error.message || "Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>PassEntry Template Setup</CardTitle>
            <CardDescription>
              Configure PassEntry template UUIDs for each membership tier. Create templates at{" "}
              <a
                href="https://app.passentry.com/pass-templates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                PassEntry Dashboard
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="single">Single Pack Template ID</Label>
                <Input
                  id="single"
                  placeholder="Enter template UUID"
                  value={configs[MEMBERSHIP_TIERS.single.product_id]}
                  onChange={(e) =>
                    setConfigs({
                      ...configs,
                      [MEMBERSHIP_TIERS.single.product_id]: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {MEMBERSHIP_TIERS.single.product_id}
                </p>
              </div>

              <div>
                <Label htmlFor="family">Family Pack Template ID</Label>
                <Input
                  id="family"
                  placeholder="Enter template UUID"
                  value={configs[MEMBERSHIP_TIERS.family.product_id]}
                  onChange={(e) =>
                    setConfigs({
                      ...configs,
                      [MEMBERSHIP_TIERS.family.product_id]: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {MEMBERSHIP_TIERS.family.product_id}
                </p>
              </div>

              <div>
                <Label htmlFor="business">Business Starter Pack Template ID</Label>
                <Input
                  id="business"
                  placeholder="Enter template UUID"
                  value={configs[MEMBERSHIP_TIERS.business.product_id]}
                  onChange={(e) =>
                    setConfigs({
                      ...configs,
                      [MEMBERSHIP_TIERS.business.product_id]: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {MEMBERSHIP_TIERS.business.product_id}
                </p>
              </div>

              <div>
                <Label htmlFor="enterprise">Business Velocity Pack Template ID</Label>
                <Input
                  id="enterprise"
                  placeholder="Enter template UUID"
                  value={configs[MEMBERSHIP_TIERS.enterprise.product_id]}
                  onChange={(e) =>
                    setConfigs({
                      ...configs,
                      [MEMBERSHIP_TIERS.enterprise.product_id]: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {MEMBERSHIP_TIERS.enterprise.product_id}
                </p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
