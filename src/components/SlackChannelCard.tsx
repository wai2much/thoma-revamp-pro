import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface SlackChannelCardProps {
  channel: string;
  lastMessage: string;
  timestamp: Date;
  eventCount?: number;
}

const channelConfig: Record<string, { color: string; emoji: string; bgClass: string }> = {
  "ops-alerts": { 
    color: "red", 
    emoji: "🚨", 
    bgClass: "bg-red-600 hover:bg-red-700" 
  },
  "customer-flow": { 
    color: "green", 
    emoji: "📈", 
    bgClass: "bg-green-600 hover:bg-green-700" 
  },
  "daily-digest": { 
    color: "yellow", 
    emoji: "📊", 
    bgClass: "bg-yellow-500 hover:bg-yellow-600" 
  },
  "doctrine-log": { 
    color: "gray", 
    emoji: "📜", 
    bgClass: "bg-gray-600 hover:bg-gray-700" 
  },
};

export const SlackChannelCard = ({ 
  channel, 
  lastMessage, 
  timestamp,
  eventCount = 0 
}: SlackChannelCardProps) => {
  const config = channelConfig[channel] || channelConfig["doctrine-log"];

  return (
    <Card className="glass-card group hover:glow-border transition-all overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              className={`${config.bgClass} text-white border-0 transition-colors`}
            >
              {config.emoji} #{channel}
            </Badge>
            {eventCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {eventCount} new
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-foreground/90 line-clamp-2">
            {lastMessage}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 group-hover:via-primary/60 transition-all duration-300" />
    </Card>
  );
};
