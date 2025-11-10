import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Shield, Calendar, CreditCard, LogOut, Wallet, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WalletPassButton } from "@/components/WalletPassButton";
import { toast as sonnerToast } from "sonner";

const PRODUCT_NAMES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "Single Pack",
  "prod_TIKmAWTileFjnm": "Family Pack",
  "prod_TIKmxYafsqTXwO": "Business Starter Pack",
  "prod_TIKmurHwJ5bDWJ": "Business Velocity Pack",
};

const Membership = () => {
  const { user, subscription, loading, signOut, refreshSubscription } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [passUrls, setPassUrls] = useState<{
    appleUrl?: string;
    googleUrl?: string;
    url?: string;
  }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user && subscription.subscribed) {
      // Fetch pass from database when component loads
      fetchPassFromDatabase();
    }
  }, [user, loading, navigate, subscription.subscribed]);

  const fetchPassFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("membership_passes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching pass:", error);
        return;
      }

      if (data) {
        console.log("Pass found in database:", data);
        setPassUrls({
          appleUrl: data.apple_url || undefined,
          googleUrl: data.google_url || undefined,
          url: data.download_url || undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching pass:", error);
    }
  };

  const handleGeneratePass = async () => {
    if (!user) {
      sonnerToast.error("Please sign in to generate your pass");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-wallet-pass");
      
      if (error) throw error;

      if (data?.appleUrl || data?.googlePayUrl || data?.downloadUrl) {
        setPassUrls({
          appleUrl: data.appleUrl,
          googleUrl: data.googlePayUrl,
          url: data.downloadUrl,
        });
        sonnerToast.success("Wallet pass generated successfully!");
      }
    } catch (error: any) {
      console.error("Error generating pass:", error);
      sonnerToast.error(error.message || "Failed to generate wallet pass");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription.subscribed) {
      navigate("/#pricing");
      return;
    }

    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!user || !subscription.subscribed || !subscription.product_id) {
      sonnerToast.error("Missing required data for test email");
      return;
    }

    setTestEmailLoading(true);
    try {
      // Get member ID from database
      const { data: passData } = await supabase
        .from("membership_passes")
        .select("member_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!passData?.member_id) {
        sonnerToast.error("No membership pass found. Generate a pass first.");
        return;
      }

      const userName = user.email?.split('@')[0] || 'Member';
      const planName = PRODUCT_NAMES[subscription.product_id] || "Unknown Plan";

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        sonnerToast.error("Session expired. Please sign in again.");
        return;
      }

      const { error } = await supabase.functions.invoke('send-membership-welcome', {
        body: {
          name: userName,
          email: user.email,
          phone: user.phone || undefined,
          memberId: passData.member_id,
          planName: planName,
          productId: subscription.product_id,
          appleWalletUrl: passUrls.appleUrl,
          googlePayUrl: passUrls.googleUrl,
          passUrl: passUrls.url,
        },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      sonnerToast.success("Test welcome email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Test email error:", error);
      sonnerToast.error(error.message || "Failed to send test email");
    } finally {
      setTestEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const planName = subscription.product_id
    ? PRODUCT_NAMES[subscription.product_id] || "Unknown Plan"
    : null;

  return (
    <div className="min-h-screen py-24 px-4 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Membership</h1>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Card className="glass-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <Shield className="h-12 w-12 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Membership Status</h2>
              {subscription.subscribed ? (
                <>
                  <p className="text-xl text-primary font-semibold mb-2">Active</p>
                  {planName && (
                    <p className="text-muted-foreground mb-1">Plan: {planName}</p>
                  )}
                  {subscription.subscription_end && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Next billing: {new Date(subscription.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xl text-muted-foreground font-semibold mb-2">No Active Membership</p>
                  <p className="text-sm text-muted-foreground">Subscribe to unlock all benefits</p>
                </>
              )}
            </div>
          </div>
        </Card>

        {subscription.subscribed && (
          <Card className="glass-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Digital Wallet Pass
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your membership card to Apple Wallet or Google Pay for quick access
            </p>
            
            {passUrls.appleUrl || passUrls.googleUrl || passUrls.url ? (
              <WalletPassButton
                appleUrl={passUrls.appleUrl}
                googleUrl={passUrls.googleUrl}
                url={passUrls.url}
                isGenerating={isGenerating}
                variant="default"
                className="w-full"
              />
            ) : (
              <Button
                onClick={handleGeneratePass}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Pass...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Generate Wallet Pass
                  </>
                )}
              </Button>
            )}
          </Card>
        )}

        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Manage Subscription
          </h3>
          
          <div className="space-y-3">
            <Button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="w-full"
            >
              {portalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : subscription.subscribed ? (
                "Manage Billing & Payment"
              ) : (
                "Choose a Plan"
              )}
            </Button>

            {subscription.subscribed && (
              <>
                <Button
                  variant="outline"
                  onClick={refreshSubscription}
                  className="w-full"
                >
                  Refresh Status
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleSendTestEmail}
                  disabled={testEmailLoading}
                  className="w-full"
                >
                  {testEmailLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Test Welcome Email
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {subscription.subscribed && (
            <p className="text-xs text-muted-foreground mt-4">
              Use the billing portal to update payment methods, view invoices, or cancel your subscription.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Membership;
