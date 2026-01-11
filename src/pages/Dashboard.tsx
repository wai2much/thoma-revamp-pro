import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShimmerBotStatus } from "@/components/ShimmerBotStatus";
import { SlackChannelCard } from "@/components/SlackChannelCard";
import { RoleIndicator } from "@/components/RoleIndicator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LogOut, Lock, Unlock, Calendar, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  role: "operator" | "narrator" | "responder" | "admin";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, subscription, loading: authLoading, signOut } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [user]);

  const checkAuth = async () => {
    try {
      if (!user) {
        if (!authLoading) {
          navigate("/auth");
        }
        return;
      }

      setUserName(user.email?.split("@")[0] || "User");

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        console.error("Error fetching role:", roleError);
        toast({
          title: "No Role Assigned",
          description: "Contact admin to assign your doctrine role.",
          variant: "destructive",
        });
      } else {
        setUserRole(roleData);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Lock-up calculations for monthly subscribers
  const LOCKUP_DAYS = 60;
  const isMonthlySubscriber = subscription.subscribed && subscription.billing_interval === "month";
  const isLocked = subscription.is_locked ?? false;
  const daysUntilUnlock = subscription.days_until_unlock ?? 0;
  const lockupProgress = isMonthlySubscriber ? Math.max(0, ((LOCKUP_DAYS - daysUntilUnlock) / LOCKUP_DAYS) * 100) : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="animate-pulse text-muted-foreground">Loading cockpit...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                🕶️ Haus of Technik Cockpit
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {userRole && <RoleIndicator role={userRole.role} userName={userName} />}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lock-up Status & Shimmer Bot */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lock-up Status Card - Prominent for monthly subscribers */}
            {isMonthlySubscriber && (
              <div className={`relative overflow-hidden rounded-xl border p-6 ${
                isLocked 
                  ? 'bg-gradient-to-br from-amber-500/10 via-background to-background border-amber-500/30' 
                  : 'bg-gradient-to-br from-green-500/10 via-background to-background border-green-500/30'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  {isLocked ? (
                    <Lock className="w-full h-full text-amber-500" />
                  ) : (
                    <Unlock className="w-full h-full text-green-500" />
                  )}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Zap className="w-5 h-5 text-green-500" />
                    )}
                    <h3 className="text-lg font-semibold">
                      {isLocked ? 'Fair Play Lock-up' : 'Full Access Unlocked!'}
                    </h3>
                  </div>
                  
                  {isLocked ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Premium services unlock in <span className="text-amber-500 font-bold">{daysUntilUnlock} days</span>
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-mono text-amber-500">{Math.round(lockupProgress)}%</span>
                        </div>
                        <Progress 
                          value={lockupProgress} 
                          className="h-3 bg-amber-500/20"
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>Unlocks: {subscription.lockup_ends_at ? new Date(subscription.lockup_ends_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Calculating...'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <p className="text-xs text-muted-foreground">
                          💡 <strong>Tip:</strong> Upgrade to annual billing for immediate full access with no lock-up period.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-green-500">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">All premium services are now available!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Annual subscriber badge */}
            {subscription.subscribed && subscription.billing_interval === "year" && (
              <div className="relative overflow-hidden rounded-xl border p-4 bg-gradient-to-br from-primary/10 via-background to-background border-primary/30">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Annual Member</h3>
                    <p className="text-xs text-muted-foreground">Full access — no lock-up period</p>
                  </div>
                </div>
              </div>
            )}
            
            <ShimmerBotStatus />
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="text-lg font-bold">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Webhooks Today</span>
                  <span className="text-lg font-bold text-green-500">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fallbacks</span>
                  <span className="text-lg font-bold text-yellow-500">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Slack Channels */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">📡 Live Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SlackChannelCard
                  channel="ops-alerts"
                  lastMessage="2 webhooks failed - fallback triggered"
                  timestamp={new Date(Date.now() - 2 * 60 * 1000)}
                  eventCount={2}
                />
                <SlackChannelCard
                  channel="customer-flow"
                  lastMessage="New signup: john@example.com (Family Pack)"
                  timestamp={new Date(Date.now() - 5 * 60 * 1000)}
                  eventCount={5}
                />
                <SlackChannelCard
                  channel="daily-digest"
                  lastMessage="Daily summary: +12 members, $1,245 MRR"
                  timestamp={new Date(Date.now() - 60 * 60 * 1000)}
                />
                <SlackChannelCard
                  channel="doctrine-log"
                  lastMessage="Anchored with precision — module deployed"
                  timestamp={new Date(Date.now() - 3 * 60 * 60 * 1000)}
                />
              </div>
            </div>

            {/* Event Stream Preview */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">📡 Webhook Event Stream</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-3 p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">14:32</span>
                  <span className="text-green-500">✅</span>
                  <span className="text-foreground/80">pass.created → user@example.com</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">14:28</span>
                  <span className="text-blue-500">💳</span>
                  <span className="text-foreground/80">payment.succeeded → $49/mo Family Pack</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">14:15</span>
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-foreground/80">passentry.failed → Retry triggered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
