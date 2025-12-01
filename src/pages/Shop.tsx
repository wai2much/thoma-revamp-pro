import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriceDisplay } from '@/components/PriceDisplay';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { ShoppingCart, Info, Zap } from 'lucide-react';

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
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Skeleton className="h-24 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[500px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-8xl mb-8 uppercase tracking-tight">ERROR</h1>
          <p className="text-muted-foreground text-lg">Failed to load products. Try again later.</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-8xl mb-8 uppercase tracking-tight">SHOP</h1>
          <p className="text-muted-foreground text-lg">No products available yet. Check back soon!</p>
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
    <div className="min-h-screen bg-background">
      {/* Hero Section - Streetwear Magazine Style */}
      <div className="relative overflow-hidden border-b-4 border-primary bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Overline */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary"></div>
              <span className="text-primary font-bold text-sm tracking-[0.3em] uppercase">Latest Drop</span>
              <Zap className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display text-[clamp(3rem,15vw,12rem)] leading-[0.85] uppercase tracking-tighter mb-6 text-flat">
              SHOP<br/>
              <span className="text-primary">NOW</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl font-medium mb-8 text-flat">
              Premium automotive culture. Street-certified performance. 
              <span className="text-primary font-bold"> No compromises.</span>
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap gap-6 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary animate-pulse"></div>
                <span className="text-flat">{products.length} PRODUCTS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary animate-pulse"></div>
                <span className="text-flat">FAST SHIPPING</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent animate-pulse"></div>
                <span className="text-flat">MEMBERS SAVE 25-33%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-10 font-display text-[20vw] text-primary leading-none opacity-30 rotate-12">
            SHOP
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Member Savings Banner - Streetwear Style */}
        {showMemberBanner && (
          <Alert className="mb-12 border-2 border-primary bg-card/50 backdrop-blur">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-display text-xl uppercase text-flat">Members Only Pricing</span>
                <p className="text-sm text-muted-foreground mt-1 text-flat">
                  Save 25-33% on VAPE HEAD products with membership
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/membership')}
                className="font-bold tracking-wide bg-primary hover:bg-primary/90 shrink-0"
              >
                JOIN NOW
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Vendor Filter - Hypebeast Style */}
        {uniqueVendors.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12 border-l-4 border-primary pl-6">
            <Button
              variant={vendorFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setVendorFilter('all')}
              className="font-bold tracking-wider uppercase text-sm"
            >
              All
            </Button>
            {uniqueVendors.map((vendor) => (
              <Button
                key={vendor}
                variant={vendorFilter === vendor ? 'default' : 'outline'}
                onClick={() => setVendorFilter(vendor)}
                className="font-bold tracking-wider uppercase text-sm"
              >
                {vendor}
              </Button>
            ))}
          </div>
        )}
        
        {/* Product Grid - Magazine Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => {
            const image = product.images.edges[0]?.node;
            const variant = product.variants.edges[0]?.node;
            const price = variant?.price || product.priceRange.minVariantPrice;
            const regularPrice = parseFloat(price.amount);
            const memberPrice = isVapeHeadProduct(product.vendor) 
              ? getMemberPrice(product.title, regularPrice) 
              : undefined;

            return (
              <div 
                key={product.id} 
                className="group relative bg-card border-2 border-border hover:border-primary transition-all duration-300 overflow-hidden"
                style={{ 
                  animationDelay: `${index * 50}ms` 
                }}
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-muted"
                  onClick={() => handleProductClick(product.handle)}
                >
                  {image ? (
                    <img 
                      src={image.url} 
                      alt={image.altText || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  {/* Vendor Badge */}
                  {isVapeHeadProduct(product.vendor) && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-display text-lg px-3 py-1 tracking-wider">
                      VAPE HEAD
                    </Badge>
                  )}
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-display text-2xl text-white uppercase tracking-wider text-flat">
                      View Details
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 
                    className="font-headline text-xl uppercase leading-tight cursor-pointer hover:text-primary transition-colors text-flat"
                    onClick={() => handleProductClick(product.handle)}
                  >
                    {product.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 text-flat">
                    {product.description || 'Premium quality automotive product'}
                  </p>
                  
                  {/* Price */}
                  <div className="pt-2">
                    <PriceDisplay
                      regularPrice={regularPrice}
                      memberPrice={memberPrice}
                      isSubscribed={subscription.subscribed}
                      currencyCode={price.currencyCode}
                      size="lg"
                    />
                  </div>
                  
                  {/* CTA */}
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full font-display text-lg tracking-wider uppercase bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all"
                    disabled={!variant?.availableForSale}
                    size="lg"
                  >
                    {variant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
                  </Button>
                </div>
                
                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
