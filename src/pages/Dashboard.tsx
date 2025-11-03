import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShimmerBotStatus } from "@/components/ShimmerBotStatus";
import { SlackChannelCard } from "@/components/SlackChannelCard";
import { RoleIndicator } from "@/components/RoleIndicator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  role: "operator" | "narrator" | "responder" | "admin";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
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
    await supabase.auth.signOut();
    navigate("/");
  };

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
                🕶️ TyrePlus Haus Cockpit
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
          {/* Left Column - Shimmer Bot Status */}
          <div className="lg:col-span-1 space-y-6">
            <ShimmerBotStatus />
            
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
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
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
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
