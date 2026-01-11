import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import product images
import hausNoirZevo100ml from "@/assets/products/haus-noir-zevo-100ml.png";
import hausNoirM3100ml from "@/assets/products/haus-noir-m3-100ml.png";
import hausNoirI30100ml from "@/assets/products/haus-noir-i30-100ml.png";
import hausNoirGtr100ml from "@/assets/products/haus-noir-gtr-100ml.png";
import hausNoirZevo250ml from "@/assets/products/haus-noir-zevo-250ml.png";
import hausNoirM3250ml from "@/assets/products/haus-noir-m3-250ml.png";
import hausNoirI30250ml from "@/assets/products/haus-noir-i30-250ml.png";
import hausNoirGtr250ml from "@/assets/products/haus-noir-gtr-250ml.png";

interface GalleryItem {
  id: string;
  title: string;
  variant: string;
  image: string;
  collection: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "zevo-100ml",
    title: "ZEVO 5A",
    variant: "100ML",
    image: hausNoirZevo100ml,
    collection: "Disc Collection",
  },
  {
    id: "m3-100ml",
    title: "M3 LO-ING",
    variant: "100ML",
    image: hausNoirM3100ml,
    collection: "Disc Collection",
  },
  {
    id: "i30-100ml",
    title: "i30 Sedan N",
    variant: "100ML",
    image: hausNoirI30100ml,
    collection: "Disc Collection",
  },
  {
    id: "gtr-100ml",
    title: "GTR G.O.D",
    variant: "100ML",
    image: hausNoirGtr100ml,
    collection: "Disc Collection",
  },
  {
    id: "zevo-250ml",
    title: "ZEVO 5A",
    variant: "250ML",
    image: hausNoirZevo250ml,
    collection: "Collector Edition",
  },
  {
    id: "m3-250ml",
    title: "M3 LO-ING",
    variant: "250ML",
    image: hausNoirM3250ml,
    collection: "Collector Edition",
  },
  {
    id: "i30-250ml",
    title: "i30 Sedan N",
    variant: "250ML",
    image: hausNoirI30250ml,
    collection: "Collector Edition",
  },
  {
    id: "gtr-250ml",
    title: "GTR G.O.D",
    variant: "250ML",
    image: hausNoirGtr250ml,
    collection: "Collector Edition",
  },
];

export const HausNoirWallpaper = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "100ML" | "250ML">("all");

  const filteredItems =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.variant === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">HAUS NOIR Collection</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Luxury auto fragrances curated by automotive enthusiasts. Premium
          scents inspired by iconic vehicles.
        </p>
      </div>

      {/* Filter Badges */}
      <div className="flex justify-center gap-3">
        <Badge
          variant={filter === "all" ? "default" : "outline"}
          className="cursor-pointer px-6 py-2"
          onClick={() => setFilter("all")}
        >
          All Products
        </Badge>
        <Badge
          variant={filter === "100ML" ? "default" : "outline"}
          className="cursor-pointer px-6 py-2"
          onClick={() => setFilter("100ML")}
        >
          Disc Collection (100ML)
        </Badge>
        <Badge
          variant={filter === "250ML" ? "default" : "outline"}
          className="cursor-pointer px-6 py-2"
          onClick={() => setFilter("250ML")}
        >
          Collector Edition (250ML)
        </Badge>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="glass-card group relative overflow-hidden cursor-pointer hover:glow-border transition-all"
            onClick={() => setSelectedImage(item)}
          >
            <div className="aspect-[3/4] relative bg-gradient-to-br from-background to-muted">
              <img
                src={item.image}
                alt={`${item.title} ${item.variant}`}
                className="w-full h-full object-contain p-4"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <Badge variant="secondary" className="text-xs">
                {item.collection}
              </Badge>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.variant}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
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
              <div className="bg-gradient-to-br from-background via-muted to-background p-8">
                <img
                  src={selectedImage.image}
                  alt={`${selectedImage.title} ${selectedImage.variant}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <div className="p-6 bg-background border-t">
                <Badge className="mb-3">{selectedImage.collection}</Badge>
                <h3 className="text-2xl font-bold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-muted-foreground">{selectedImage.variant}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
