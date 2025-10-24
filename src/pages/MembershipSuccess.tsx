import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MembershipSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useAuth();

  useEffect(() => {
    // Refresh subscription status after successful payment
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="glass-card p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Welcome to <span className="gradient-text">Tyreplus!</span>
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Your membership is now active! Check your email for your digital wallet pass and membership details.
        </p>

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
