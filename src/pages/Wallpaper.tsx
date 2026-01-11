import { Navigation } from "@/components/Navigation";
import { HausNoirWallpaper } from "@/components/HausNoirWallpaper";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Wallpaper = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <HausNoirWallpaper />
      </div>
    </div>
  );
};

export default Wallpaper;
