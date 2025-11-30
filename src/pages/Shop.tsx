import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriceDisplay } from '@/components/PriceDisplay';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { ShoppingCart, Info } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { subscription } = useAuth();
  const [vendorFilter, setVendorFilter] = useState<string>('all');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchProducts(20),
  });

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    const regularPrice = parseFloat(variant.price.amount);
    const memberPrice = isVapeHeadProduct(product.vendor) 
      ? getMemberPrice(product.title, regularPrice) 
      : undefined;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      memberPrice,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    });
  };

  const handleProductClick = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Shop</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-muted-foreground">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-muted-foreground">No products available yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  const uniqueVendors = Array.from(new Set(products.map(p => p.vendor).filter(Boolean)));
  const filteredProducts = vendorFilter === 'all' 
    ? products 
    : products.filter(p => p.vendor === vendorFilter);

  const hasVapeHeadProducts = products.some(p => isVapeHeadProduct(p.vendor));
  const showMemberBanner = !subscription.subscribed && hasVapeHeadProducts;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Shop</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse our selection of premium tyres, parts, and accessories
        </p>

        {/* Member Savings Banner */}
        {showMemberBanner && (
          <Alert className="mb-8 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Become a Member</strong> and save 25-33% on VAPE HEAD products!
              </span>
              <Button 
                size="sm" 
                onClick={() => navigate('/membership')}
                className="ml-4"
              >
                View Membership
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Vendor Filter */}
        {uniqueVendors.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Button
              variant={vendorFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setVendorFilter('all')}
            >
              All Products
            </Button>
            {uniqueVendors.map((vendor) => (
              <Button
                key={vendor}
                variant={vendorFilter === vendor ? 'default' : 'outline'}
                onClick={() => setVendorFilter(vendor)}
              >
                {vendor}
              </Button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const image = product.images.edges[0]?.node;
            const variant = product.variants.edges[0]?.node;
            const price = variant?.price || product.priceRange.minVariantPrice;
            const regularPrice = parseFloat(price.amount);
            const memberPrice = isVapeHeadProduct(product.vendor) 
              ? getMemberPrice(product.title, regularPrice) 
              : undefined;

            return (
              <Card key={product.id} className="glass-card group hover:glow-border transition-all">
                <CardHeader className="p-0">
                  <div 
                    className="relative h-48 overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => handleProductClick(product.handle)}
                  >
                    {image ? (
                      <img 
                        src={image.url} 
                        alt={image.altText || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {isVapeHeadProduct(product.vendor) && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        VAPE HEAD
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle 
                    className="text-lg mb-2 cursor-pointer hover:text-primary"
                    onClick={() => handleProductClick(product.handle)}
                  >
                    {product.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mb-4">
                    {product.description || 'No description available'}
                  </CardDescription>
                  <PriceDisplay
                    regularPrice={regularPrice}
                    memberPrice={memberPrice}
                    isSubscribed={subscription.subscribed}
                    currencyCode={price.currencyCode}
                    size="md"
                  />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    disabled={!variant?.availableForSale}
                  >
                    {variant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
