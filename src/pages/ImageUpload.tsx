import { ImageUploader } from "@/components/ImageUploader";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ImageUpload = () => {
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Product Image Upload</h1>
            <p className="text-muted-foreground">
              Upload your HAUS NOIR product images here. Drag and drop or click to browse.
            </p>
          </div>

          <ImageUploader />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
