import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceDisplay } from '@/components/PriceDisplay';
import { WalletPassButton } from '@/components/WalletPassButton';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { ShoppingCart, Sparkles, Crown, Download, Gift, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const CapsuleLanding = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { user, subscription } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProduct(handle!),
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-6 rounded-2xl" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-12 w-32 mb-6" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/shop')}>Browse Shop</Button>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const regularPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : parseFloat(product.priceRange.minVariantPrice.amount);
  const memberPrice = isVapeHeadProduct(product.vendor) ? getMemberPrice(product.title, regularPrice) : undefined;
  const mainImage = product.images.edges[0]?.node;
  const isSubscribed = !!subscription;
  const hasVapeHeadPricing = isVapeHeadProduct(product.vendor) && memberPrice !== undefined;

  // Extract volume from title
  const volumeMatch = product.title.match(/(\d+ml)/i);
  const volume = volumeMatch ? volumeMatch[1].toUpperCase() : null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      memberPrice,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Added to cart!", {
      description: "Ready to checkout when you are.",
      action: {
        label: "View Cart",
        onClick: () => navigate('/cart'),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        
        {/* Hero Product Image */}
        <div className="relative mb-6 rounded-3xl overflow-hidden shadow-2xl">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              className="w-full aspect-[4/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
          
          {/* Vendor Badge */}
          {product.vendor && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-border shadow-lg">
                {product.vendor}
              </Badge>
            </div>
          )}

          {/* Volume Badge */}
          {volume && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-primary/90 backdrop-blur-sm text-primary-foreground shadow-lg text-lg px-4 py-2">
                {volume}
              </Badge>
            </div>
          )}
        </div>

        {/* Product Title & Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3 leading-tight">{product.title}</h1>
          {product.description && (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Member Pricing Card */}
        {hasVapeHeadPricing && (
          <Card className="glass-card mb-6 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Member Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    {isSubscribed ? "You're saving with member pricing!" : "Join our membership to unlock exclusive savings"}
                  </p>
                </div>
              </div>
              
              <PriceDisplay
                regularPrice={regularPrice}
                memberPrice={memberPrice}
                isSubscribed={isSubscribed}
                currencyCode={selectedVariant?.price.currencyCode || 'AUD'}
                size="lg"
                showSavings={true}
              />

              {!isSubscribed && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/membership')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Become a Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Regular Pricing (for non-VAPE HEAD products) */}
        {!hasVapeHeadPricing && (
          <div className="mb-6">
            <PriceDisplay
              regularPrice={regularPrice}
              isSubscribed={isSubscribed}
              currencyCode={selectedVariant?.price.currencyCode || 'AUD'}
              size="lg"
            />
          </div>
        )}

        {/* Add to Cart Button */}
        <Button 
          size="lg" 
          className="w-full mb-6 h-14 text-lg shadow-lg"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>

        {/* Member Benefits Section */}
        {isSubscribed && (
          <Card className="glass-card mb-6 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Your Member Benefits</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Exclusive Pricing</p>
                    <p className="text-sm text-muted-foreground">Up to 33% off all VAPE HEAD products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Digital Wallet Pass</p>
                    <p className="text-sm text-muted-foreground">Always accessible on your phone</p>
                  </div>
                </div>
              </div>

              <WalletPassButton
                platform="auto"
                variant="outline"
                className="w-full"
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/shop')}
            className="h-12"
          >
            Browse Shop
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/loyalty')}
            className="h-12"
          >
            Loyalty Program
          </Button>
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Luxury Auto Fragrances
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Haus of Technik
          </p>
        </div>
      </div>
    </div>
  );
};

export default CapsuleLanding;
