import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Download, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface WalletPassButtonProps {
  url?: string;
  appleUrl?: string;
  googleUrl?: string;
  isGenerating?: boolean;
  platform?: 'apple' | 'google' | 'auto';
  variant?: "default" | "outline";
  className?: string;
  onGenerate?: () => void;
}

export const WalletPassButton = ({
  url,
  appleUrl,
  googleUrl,
  isGenerating = false,
  platform = 'auto',
  variant = "default",
  className = "",
  onGenerate,
}: WalletPassButtonProps) => {
  const isMobile = useIsMobile();
  const [isOpening, setIsOpening] = useState(false);

  // Auto-detect platform if set to auto
  const detectedPlatform = platform === 'auto' ? (() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    if (isIOS) return 'apple';
    if (isAndroid) return 'google';
    return 'apple'; // Default
  })() : platform;

  // Select the appropriate URL
  const passUrl = detectedPlatform === 'apple' 
    ? (appleUrl || url)
    : (googleUrl || url);

  const buttonText = detectedPlatform === 'apple' 
    ? 'Add to Apple Wallet' 
    : 'Add to Google Wallet';

  const handleClick = async () => {
    // If we need to generate first
    if (onGenerate && !passUrl) {
      onGenerate();
      return;
    }

    if (!passUrl) {
      toast.error("Pass URL not available yet");
      return;
    }

    setIsOpening(true);

    // Add haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    try {
      // On mobile, open directly in same tab for better compatibility
      if (isMobile) {
        // Show loading toast
        toast.loading("Opening wallet pass...", { id: "wallet-pass" });
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Open in same tab on mobile (avoids popup blockers)
        window.location.href = passUrl;
        
        // Update toast
        setTimeout(() => {
          toast.success("Pass opened! Add it to your wallet.", { id: "wallet-pass" });
        }, 500);
      } else {
        // On desktop, try popup first with fallback
        const popup = window.open(passUrl, '_blank', 'noopener,noreferrer');
        
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          // Popup was blocked, show fallback
          toast.error(
            "Pop-up blocked. Click the link below to download your pass.",
            { 
              id: "wallet-pass",
              duration: 10000,
              action: {
                label: "Open Pass",
                onClick: () => window.location.href = passUrl
              }
            }
          );
        } else {
          toast.success("Wallet pass opened in new tab!", { id: "wallet-pass" });
        }
      }
    } catch (error) {
      console.error("Error opening wallet pass:", error);
      toast.error("Failed to open wallet pass. Please try again.");
    } finally {
      setIsOpening(false);
    }
  };

  const isLoading = isGenerating || isOpening;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isGenerating ? "Generating..." : "Opening..."}
        </>
      ) : (
        <>
          {isMobile ? (
            <Download className="h-4 w-4 mr-2" />
          ) : (
            <ExternalLink className="h-4 w-4 mr-2" />
          )}
          {buttonText}
        </>
      )}
    </Button>
  );
};
