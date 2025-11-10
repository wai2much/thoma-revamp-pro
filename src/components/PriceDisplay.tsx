import { Badge } from "@/components/ui/badge";

interface PriceDisplayProps {
  regularPrice: number;
  memberPrice?: number;
  isSubscribed: boolean;
  currencyCode?: string;
  size?: "sm" | "md" | "lg";
  showSavings?: boolean;
}

export const PriceDisplay = ({
  regularPrice,
  memberPrice,
  isSubscribed,
  currencyCode = "AUD",
  size = "md",
  showSavings = true,
}: PriceDisplayProps) => {
  const discount = memberPrice
    ? Math.round(((regularPrice - memberPrice) / regularPrice) * 100)
    : 0;
  const savings = memberPrice ? regularPrice - memberPrice : 0;

  const priceClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const regularPriceClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (isSubscribed && memberPrice) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`${priceClasses[size]} font-bold text-primary`}>
            ${memberPrice.toFixed(2)}
          </span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
            Member Price
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${regularPriceClasses[size]} text-muted-foreground line-through`}>
            ${regularPrice.toFixed(2)}
          </span>
          {showSavings && (
            <span className={`${regularPriceClasses[size]} text-green-600 dark:text-green-500 font-medium`}>
              Save ${savings.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (memberPrice) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`${priceClasses[size]} font-bold text-foreground`}>
            ${regularPrice.toFixed(2)}
          </span>
          <span className={`${regularPriceClasses[size]} text-muted-foreground`}>
            {currencyCode}
          </span>
        </div>
        {showSavings && (
          <Badge variant="outline" className="text-xs">
            Members save {discount}% (${savings.toFixed(2)})
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`${priceClasses[size]} font-bold text-foreground`}>
        ${regularPrice.toFixed(2)}
      </span>
      <span className={`${regularPriceClasses[size]} text-muted-foreground`}>
        {currencyCode}
      </span>
    </div>
  );
};
