import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ZoomIn, Monitor, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import desktop wallpapers
import mercedesPixelDuo from "@/assets/wallpapers/desktop/mercedes-pixel-duo.jpg";
import mercedesPixelAerial from "@/assets/wallpapers/desktop/mercedes-pixel-aerial.jpg";
import porscheMountainRoad from "@/assets/wallpapers/desktop/porsche-mountain-road.jpg";
import fordGt40Gulf from "@/assets/wallpapers/desktop/ford-gt40-gulf.jpg";
import toyotaSupraNeon from "@/assets/wallpapers/desktop/toyota-supra-neon.jpg";
import skylineNightStreet from "@/assets/wallpapers/desktop/skyline-night-street.jpg";
import mercedesClaNight from "@/assets/wallpapers/desktop/mercedes-cla-night.png";
import mercedesAmgNature from "@/assets/wallpapers/desktop/mercedes-amg-nature.jpg";
import mercedesDuoHighway from "@/assets/wallpapers/desktop/mercedes-duo-highway.jpg";
import mercedesTrackDay from "@/assets/wallpapers/desktop/mercedes-track-day.jpg";
import hyundaiI30nDark from "@/assets/wallpapers/desktop/hyundai-i30n-dark.jpg";
import skylineR32White from "@/assets/wallpapers/desktop/skyline-r32-white.jpg";
import porsche911ClassicTrack from "@/assets/wallpapers/desktop/porsche-911-classic-track.jpg";
import skylineR33Front from "@/assets/wallpapers/desktop/skyline-r33-front.jpg";
import porsche930TurboFront from "@/assets/wallpapers/desktop/porsche-930-turbo-front.jpg";

interface WallpaperItem {
  id: string;
  title: string;
  category: string;
  image: string;
  style: string;
}

const desktopWallpapers: WallpaperItem[] = [
  {
    id: "toyota-supra-neon",
    title: "Supra Neon City",
    category: "JDM",
    image: toyotaSupraNeon,
    style: "Synthwave",
  },
  {
    id: "skyline-night",
    title: "Skyline Midnight",
    category: "JDM",
    image: skylineNightStreet,
    style: "Noir",
  },
  {
    id: "porsche-mountain",
    title: "GT3 RS Mountain Pass",
    category: "European",
    image: porscheMountainRoad,
    style: "Scenic",
  },
  {
    id: "ford-gt40",
    title: "GT40 Gulf Racing",
    category: "Classic",
    image: fordGt40Gulf,
    style: "Motorsport",
  },
  {
    id: "mercedes-cla-night",
    title: "CLA Night Drive",
    category: "European",
    image: mercedesClaNight,
    style: "Noir",
  },
  {
    id: "mercedes-amg-nature",
    title: "AMG Country Road",
    category: "European",
    image: mercedesAmgNature,
    style: "Scenic",
  },
  {
    id: "mercedes-duo-highway",
    title: "AMG Duo Highway",
    category: "European",
    image: mercedesDuoHighway,
    style: "Pixel Art",
  },
  {
    id: "mercedes-track-day",
    title: "Track Day Legends",
    category: "European",
    image: mercedesTrackDay,
    style: "Motorsport",
  },
  {
    id: "mercedes-pixel-duo",
    title: "Classic Meets Modern",
    category: "European",
    image: mercedesPixelDuo,
    style: "Pixel Art",
  },
  {
    id: "mercedes-aerial",
    title: "AMG Aerial View",
    category: "European",
    image: mercedesPixelAerial,
    style: "Pixel Art",
  },
  {
    id: "hyundai-i30n-dark",
    title: "i30 N Stealth",
    category: "Korean",
    image: hyundaiI30nDark,
    style: "Noir",
  },
  {
    id: "skyline-r32-white",
    title: "R32 GT-R Pure",
    category: "JDM",
    image: skylineR32White,
    style: "Pixel Art",
  },
  {
    id: "porsche-911-classic-track",
    title: "911 Track Legend",
    category: "European",
    image: porsche911ClassicTrack,
    style: "Motorsport",
  },
  {
    id: "skyline-r33-front",
    title: "R33 GT-R Front",
    category: "JDM",
    image: skylineR33Front,
    style: "Pixel Art",
  },
  {
    id: "porsche-930-turbo-front",
    title: "930 Turbo Retro",
    category: "Classic",
    image: porsche930TurboFront,
    style: "Scenic",
  },
];

type StyleFilter = "all" | "Synthwave" | "Noir" | "Scenic" | "Motorsport" | "Pixel Art";

export const HausNoirWallpaper = () => {
  const [selectedImage, setSelectedImage] = useState<WallpaperItem | null>(null);
  const [filter, setFilter] = useState<StyleFilter>("all");

  const filteredItems =
    filter === "all"
      ? desktopWallpapers
      : desktopWallpapers.filter((item) => item.style === filter);

  const handleDownload = (item: WallpaperItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `${item.id}-wallpaper.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-orbitron">HAUS NOIR Wallpapers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Premium pixel art automotive wallpapers. Download for your desktop or mobile devices.
        </p>
      </div>

      {/* Device Type Tabs */}
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="smartphone" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Smartphone
          </TabsTrigger>
        </TabsList>

        {/* Desktop Wallpapers */}
        <TabsContent value="desktop" className="space-y-6 mt-6">
          {/* Filter Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {(["all", "Synthwave", "Noir", "Scenic", "Motorsport", "Pixel Art"] as StyleFilter[]).map((style) => (
              <Badge
                key={style}
                variant={filter === style ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 capitalize"
                onClick={() => setFilter(style)}
              >
                {style === "all" ? "All Styles" : style}
              </Badge>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="glass-card group relative overflow-hidden cursor-pointer hover:glow-border transition-all"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-video relative bg-gradient-to-br from-background to-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <ZoomIn className="w-10 h-10 text-white" />
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDownload(item, e)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.style}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Smartphone Wallpapers */}
        <TabsContent value="smartphone" className="mt-6">
          <div className="text-center py-16">
            <Smartphone className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Smartphone wallpapers optimized for mobile devices will be available soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="bg-black">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <div className="p-6 bg-background border-t flex items-center justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge>{selectedImage.category}</Badge>
                    <Badge variant="outline">{selectedImage.style}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold">
                    {selectedImage.title}
                  </h3>
                </div>
                <Button onClick={(e) => handleDownload(selectedImage, e)} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
