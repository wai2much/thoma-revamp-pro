import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import shimmerBadge from "@/assets/shimmer-bot-badge.png";

interface ShimmerBotStatusProps {
  variant?: "default" | "compact";
}

const shimmerMessages = [
  "All systems nominal 🕶️",
  "Doctrine surface active",
  "Webhooks flowing clean",
  "PassEntry synced ✓",
  "Shimmer logic anchored",
];

export const ShimmerBotStatus = ({ variant = "default" }: ShimmerBotStatusProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % shimmerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (variant === "compact") {
    return (
      <div className="glass-card p-2 border-primary/20">
        <img 
          src={shimmerBadge} 
          alt="Shimmer Bot" 
          className="w-8 h-8 animate-pulse"
        />
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border-primary/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />
      
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={shimmerBadge} 
              alt="Shimmer Bot" 
              className="w-16 h-16 hover-scale"
            />
            <div>
              <h3 className="text-lg font-semibold">Shimmer Bot</h3>
              <p className="text-sm text-muted-foreground">Doctrine Guardian</p>
            </div>
          </div>
          
          <Badge variant={isOnline ? "default" : "destructive"} className="gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="p-4 rounded-lg bg-background/50 border border-border/50">
          <p className="text-sm text-foreground/80 animate-fade-in">
            {shimmerMessages[messageIndex]}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Webhooks: 142 synced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Fallbacks: 3 triggered</span>
          </div>
        </div>
      </div>
    </div>
  );
};
