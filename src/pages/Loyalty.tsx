import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp, History, Award, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

interface PointsTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  reward_value: number;
  reward_type: string;
}

export default function Loyalty() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLoyaltyData();
  }, [user, navigate]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      
      // Fetch points balance
      const { data: balanceData, error: balanceError } = await supabase
        .rpc("get_user_points_balance", { p_user_id: user?.id });
      
      if (balanceError) throw balanceError;
      setPointsBalance(balanceData || 0);

      // Fetch transaction history
      const { data: transData, error: transError } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (transError) throw transError;
      setTransactions(transData || []);

      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_required", { ascending: true });
      
      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

    } catch (error) {
      console.error("Error fetching loyalty data:", error);
      toast({
        title: "Error loading loyalty data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimBonus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("grant-signup-bonus", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Welcome Bonus Claimed!",
          description: "2000 points ($20 credit) added to your account",
        });
        fetchLoyaltyData();
      }
    } catch (error: any) {
      toast({
        title: error.message || "Failed to claim bonus",
        variant: "destructive",
      });
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      setRedeeming(rewardId);
      const { data, error } = await supabase.functions.invoke("redeem-reward", {
        body: { rewardId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Reward Redeemed!",
          description: `${data.reward} - ${data.points_spent} points spent`,
        });
        fetchLoyaltyData();
      }
    } catch (error: any) {
      toast({
        title: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Loyalty Rewards</h1>
          <p className="text-muted-foreground">Earn points and redeem exclusive rewards</p>
        </div>

        {/* Points Balance Card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Points Balance</CardTitle>
                <CardDescription>10 points = $1 | 1000 points = $100 value</CardDescription>
              </div>
              <Award className="w-12 h-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary mb-4">
              {pointsBalance.toLocaleString()} pts
            </div>
            <div className="text-muted-foreground mb-4">
              ≈ ${(pointsBalance / 10).toFixed(2)} value
            </div>
            {transactions.length === 0 && (
              <Button onClick={handleClaimBonus} className="w-full">
                <Gift className="w-4 h-4 mr-2" />
                Claim $200 Welcome Bonus
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rewards Catalog */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Available Rewards
            </h2>
            <div className="space-y-4">
              {rewards.map((reward) => {
                const canAfford = pointsBalance >= reward.points_required;
                return (
                  <Card key={reward.id} className={canAfford ? "border-primary/40" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{reward.title}</CardTitle>
                          <CardDescription>{reward.description}</CardDescription>
                        </div>
                        <Badge variant={canAfford ? "default" : "secondary"}>
                          {reward.points_required} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          ${reward.reward_value.toFixed(2)} value
                        </span>
                        <Button
                          onClick={() => handleRedeemReward(reward.id)}
                          disabled={!canAfford || redeeming === reward.id}
                          size="sm"
                        >
                          {redeeming === reward.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Redeeming...
                            </>
                          ) : (
                            "Redeem"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <History className="w-6 h-6" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold ${
                            transaction.transaction_type === "redeem"
                              ? "text-destructive"
                              : "text-primary"
                          }`}
                        >
                          {transaction.transaction_type === "redeem" ? "-" : "+"}
                          {transaction.points}
                        </span>
                        <Badge
                          variant={
                            transaction.transaction_type === "redeem"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {transaction.transaction_type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {transactions.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No transactions yet. Start earning points!
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Badge>Sign Up</Badge>
                Get 2000 points ($20) welcome bonus
              </li>
              <li className="flex items-center gap-2">
                <Badge>Shop</Badge>
                Earn 1 point for every $1 spent
              </li>
              <li className="flex items-center gap-2">
                <Badge>Redeem</Badge>
                Exchange 1000 points for $100 in rewards
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
