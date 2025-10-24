import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import tyrePlusLogo from "@/assets/tyreplus-logo.png";

const DigitalCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (subscription.subscribed) {
      loadMembershipData();
    }
  }, [user, subscription.subscribed, navigate]);

  const loadMembershipData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-wallet-pass");
      if (error) throw error;
      setMembershipData(data);
      
      // Generate QR code
      const qrData = JSON.stringify({
        id: data.memberId,
        email: data.memberEmail,
        plan: data.planName,
      });
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#1e40af',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("Error loading membership data:", error);
      toast({
        title: "Error",
        description: "Failed to load membership data",
        variant: "destructive",
      });
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current || !membershipData) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#0a0f1c',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `membership-card-${membershipData.memberId}.png`;
      link.click();
      
      toast({
        title: "Card Downloaded!",
        description: "Save this to your phone's photo gallery",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareCard = async () => {
    if (!cardRef.current || !membershipData) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#0a0f1c',
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `membership-card-${membershipData.memberId}.png`, {
            type: 'image/png',
          });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'My Membership Card',
              text: `${membershipData.planName} - Haus of Technik`,
            });
          } else {
            await downloadCard();
          }
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      await downloadCard();
    }
  };

  if (!subscription.subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Active Membership</h1>
          <p className="text-muted-foreground mb-6">Subscribe to get your digital membership card</p>
          <Button onClick={() => navigate('/#pricing')}>View Plans</Button>
        </div>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          ← Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Digital <span className="gradient-text">Membership Card</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Download and save to your phone for instant access
          </p>
        </div>

        {/* Digital Card */}
        <div className="flex justify-center mb-12">
          <div ref={cardRef} className="w-[420px] h-[660px]">
            <Card className="w-full h-full bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] border-2 border-primary/30 shadow-2xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>
              
              {/* Card Content */}
              <div className="relative h-full flex flex-col p-8 text-white">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <img src={tyrePlusLogo} alt="Tyreplus" className="h-16 w-auto brightness-0 invert" />
                    <p className="text-xs mt-2 font-semibold tracking-wider opacity-90">HAUS OF TECHNIK</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-xs font-bold tracking-wider">ACTIVE</p>
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div>
                    <p className="text-sm opacity-80 mb-1">MEMBER NAME</p>
                    <p className="text-3xl font-bold tracking-tight">{membershipData.memberName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs opacity-80 mb-1">MEMBERSHIP TIER</p>
                      <p className="text-lg font-semibold">{membershipData.planName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 mb-1">MEMBER SINCE</p>
                      <p className="text-lg font-semibold">{membershipData.memberSince}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs opacity-80 mb-1">MEMBER ID</p>
                    <p className="text-2xl font-mono tracking-wider font-bold">{membershipData.memberId}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs opacity-80 mb-1">VALID UNTIL</p>
                    <p className="text-sm font-semibold">{membershipData.validUntil}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mt-6">
                  <div className="bg-white p-3 rounded-xl">
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-xs opacity-70">Present this card at any Haus of Technik location</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            onClick={downloadCard}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Card
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={shareCard}
            disabled={loading}
            className="gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share Card
          </Button>
        </div>

        {/* Instructions */}
        <Card className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
          <h3 className="font-semibold mb-3 text-lg">How to use your digital card:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Download the card image to your phone</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Save it to your Photos app for easy access</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Show the card and QR code at any Haus of Technik location</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Staff will scan your QR code to verify your membership benefits</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default DigitalCard;
