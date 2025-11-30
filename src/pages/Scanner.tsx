import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Nfc, Search, CheckCircle, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { Navigation } from "@/components/Navigation";
import { Label } from "@/components/ui/label";

interface MemberData {
  memberId: string;
  memberName: string;
  planName: string;
  email: string;
  validUntil: string;
  memberSince: string;
  userId: string;
  loyaltyPoints: number;
}

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [manualId, setManualId] = useState("");
  const [pointsToAward, setPointsToAward] = useState("");
  const { toast } = useToast();

  const validateMember = async (memberId: string) => {
    try {
      // Extract customer ID from QR code format: HAUS-{memberId}
      const customerId = memberId.replace("HAUS-", "").toLowerCase();
      
      // Check subscription via our edge function
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch member's loyalty points
      const { data: pointsData, error: pointsError } = await supabase.rpc('get_user_points_balance', {
        p_user_id: user.id
      });

      if (pointsError) throw pointsError;

      // In a real implementation, you'd query by customer ID
      // For now, we'll show the scanned data with loyalty points
      toast({
        title: "Member Found",
        description: `Member ID: ${memberId}`,
      });

      // Mock member data - replace with actual API call
      setMemberData({
        memberId: memberId,
        memberName: "John Doe",
        planName: "Family Pack",
        email: "member@example.com",
        validUntil: "Dec 31, 2025",
        memberSince: "2024",
        userId: user.id,
        loyaltyPoints: pointsData || 0
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to validate member",
        variant: "destructive",
      });
      return false;
    }
  };

  const startQRScan = async () => {
    try {
      setScanning(true);

      // Start scanning with MLKit
      const { barcodes } = await BarcodeScanner.scan();

      setScanning(false);

      if (barcodes && barcodes.length > 0) {
        await validateMember(barcodes[0].rawValue);
      }
    } catch (error) {
      setScanning(false);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "Failed to scan QR code",
        variant: "destructive",
      });
    }
  };

  const startNFCScan = async () => {
    toast({
      title: "NFC Feature",
      description: "NFC scanning will be available after local setup. Install @capacitor-community/nfc package.",
    });
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handleManualSearch = () => {
    if (manualId.trim()) {
      validateMember(manualId.trim());
    }
  };

  const checkIn = async () => {
    if (!memberData) return;

    try {
      // Award points if specified
      if (pointsToAward && parseInt(pointsToAward) > 0) {
        const { error } = await supabase.functions.invoke('grant-signup-bonus', {
          body: {
            userId: memberData.userId,
            points: parseInt(pointsToAward),
            description: 'Check-in bonus'
          }
        });

        if (error) throw error;

        toast({
          title: "Check-in Successful",
          description: `${memberData.memberName} checked in and awarded ${pointsToAward} points!`,
        });
      } else {
        toast({
          title: "Check-in Successful",
          description: `${memberData.memberName} has been checked in`,
        });
      }

      setMemberData(null);
      setManualId("");
      setPointsToAward("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto space-y-6 p-4 pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Member Scanner</h1>
          <p className="text-muted-foreground">Scan QR code, tap NFC, or search manually</p>
        </div>

        {/* Scanning Controls */}
        {!memberData && (
          <Card className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={startQRScan}
                disabled={scanning}
                className="h-24 flex flex-col gap-2"
              >
                <QrCode className="h-8 w-8" />
                <span>Scan QR Code</span>
              </Button>

              <Button
                size="lg"
                onClick={startNFCScan}
                disabled={scanning}
                className="h-24 flex flex-col gap-2"
              >
                <Nfc className="h-8 w-8" />
                <span>Tap NFC</span>
              </Button>
            </div>

            {scanning && (
              <Button
                variant="outline"
                onClick={stopScanning}
                className="w-full"
              >
                Cancel Scanning
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or search manually
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter Member ID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
              <Button onClick={handleManualSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Member Details Card */}
        {memberData && (
          <Card className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Member Details</h2>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Valid</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold">{memberData.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member ID:</span>
                <span className="font-mono">{memberData.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-semibold">{memberData.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{memberData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since:</span>
                <span>{memberData.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until:</span>
                <span>{memberData.validUntil}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3 mt-3">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Loyalty Points:
                </span>
                <span className="font-bold text-lg text-primary">{memberData.loyaltyPoints}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="points">Award Points (Optional)</Label>
              <Input
                id="points"
                type="number"
                placeholder="Enter points to award"
                value={pointsToAward}
                onChange={(e) => setPointsToAward(e.target.value)}
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button onClick={checkIn} size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Check In
              </Button>
              <Button
                variant="outline"
                onClick={() => setMemberData(null)}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>

    </div>
  );
};

export default Scanner;
