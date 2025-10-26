import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Wallet, Loader2, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MembershipSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useAuth();
  const [isGenerating, setIsGenerating] = useState(true);
  const [passUrls, setPassUrls] = useState<{
    appleWalletUrl?: string;
    googlePayUrl?: string;
    passUrl?: string;
  }>({});
  const [membershipData, setMembershipData] = useState<{
    planName?: string;
    memberId?: string;
    memberSince?: string;
  }>({});

  useEffect(() => {
    // Refresh subscription status after successful payment
    refreshSubscription();
    
    // Generate wallet pass automatically
    generateWalletPass();
  }, [refreshSubscription]);

  const generateWalletPass = async () => {
    try {
      setIsGenerating(true);
      console.log("Generating wallet pass...");
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please sign in to generate your pass");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-wallet-pass', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) throw error;

      console.log("Wallet pass generated:", data);
      setPassUrls({
        appleWalletUrl: data.appleWalletUrl,
        googlePayUrl: data.googlePayUrl,
        passUrl: data.passUrl,
      });
      setMembershipData(data.membershipData);
      toast.success("Your digital membership card is ready!");
    } catch (error) {
      console.error("Error generating wallet pass:", error);
      toast.error("Failed to generate wallet pass. You can try again from your membership page.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="glass-card p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to <span className="gradient-text">Tyreplus!</span>
        </h1>
        
        <p className="text-muted-foreground mb-6 text-center">
          Your membership is now active!
        </p>

        {membershipData.planName && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-semibold">{membershipData.planName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member ID:</span>
              <span className="font-mono font-semibold">{membershipData.memberId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member Since:</span>
              <span className="font-semibold">{membershipData.memberSince}</span>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating your digital membership card...</p>
          </div>
        ) : passUrls.appleWalletUrl || passUrls.googlePayUrl ? (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-center mb-3 flex items-center justify-center gap-2">
              <Wallet className="h-4 w-4" />
              Add to Your Digital Wallet
            </p>
            
            {passUrls.appleWalletUrl && (
              <Button
                onClick={() => window.open(passUrls.appleWalletUrl, '_blank')}
                className="w-full bg-black hover:bg-black/90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Add to Apple Wallet
              </Button>
            )}
            
            {passUrls.googlePayUrl && (
              <Button
                onClick={() => window.open(passUrls.googlePayUrl, '_blank')}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Add to Google Pay
              </Button>
            )}
            
            {passUrls.passUrl && !passUrls.appleWalletUrl && !passUrls.googlePayUrl && (
              <Button
                onClick={() => window.open(passUrls.passUrl, '_blank')}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Pass
              </Button>
            )}
          </div>
        ) : null}

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go to Homepage
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/membership")}
            className="w-full"
          >
            View My Membership
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MembershipSuccess;
