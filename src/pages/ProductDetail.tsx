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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriceDisplay } from '@/components/PriceDisplay';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { subscription } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProduct(handle!),
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const regularPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : parseFloat(product.priceRange.minVariantPrice.amount);
  const memberPrice = isVapeHeadProduct(product.vendor) ? getMemberPrice(product.title, regularPrice) : undefined;
  const mainImage = product.images.edges[0]?.node;
  const hasMultipleVariants = product.variants.edges.length > 1;

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
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/shop')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">{product.title}</h1>
                {isVapeHeadProduct(product.vendor) && (
                  <Badge className="bg-primary">VAPE HEAD</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{product.vendor}</p>
            </div>

            {/* Price */}
            <div>
              <PriceDisplay
                regularPrice={regularPrice}
                memberPrice={memberPrice}
                isSubscribed={subscription.subscribed}
                currencyCode="AUD"
                size="lg"
                showSavings={true}
              />
            </div>

            {/* Member Banner */}
            {!subscription.subscribed && memberPrice && (
              <Alert className="border-primary/20 bg-primary/5">
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    <strong>Become a Member</strong> and save ${(regularPrice - memberPrice).toFixed(2)} on this item!
                  </span>
                  <Button size="sm" onClick={() => navigate('/membership')} className="ml-4">
                    View Plans
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Variants */}
            {hasMultipleVariants && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Select Option</h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((variant, index) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === index ? 'default' : 'outline'}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!variant.node.availableForSale}
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
