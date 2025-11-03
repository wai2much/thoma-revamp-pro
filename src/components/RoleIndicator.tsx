import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface RoleIndicatorProps {
  role: "operator" | "narrator" | "responder" | "admin";
  userName?: string;
}

const roleConfig: Record<string, { label: string; color: string; character: string; bgClass: string }> = {
  operator: { 
    label: "Operator", 
    color: "blue",
    character: "Vito",
    bgClass: "bg-blue-600 hover:bg-blue-700"
  },
  narrator: { 
    label: "Narrator", 
    color: "purple",
    character: "Anthony",
    bgClass: "bg-purple-600 hover:bg-purple-700"
  },
  responder: { 
    label: "Responder", 
    color: "green",
    character: "Mitchell",
    bgClass: "bg-green-600 hover:bg-green-700"
  },
  admin: { 
    label: "Admin", 
    color: "orange",
    character: "Admin",
    bgClass: "bg-orange-600 hover:bg-orange-700"
  },
};

export const RoleIndicator = ({ role, userName }: RoleIndicatorProps) => {
  const config = roleConfig[role];

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        <User className="w-5 h-5 text-primary" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{userName || config.character}</span>
          <Badge className={`${config.bgClass} text-white border-0 text-xs`}>
            {config.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Doctrine Role Active</p>
      </div>
    </div>
  );
};
