import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/PriceDisplay';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

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

    toast.success('Added to cart!', {
      description: product.title,
      position: 'top-center',
    });
  };

  const handleProductClick = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-pulse">
            <Skeleton className="h-24 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[500px] animate-pulse" />
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
          <h1 className="font-display text-8xl mb-8 uppercase tracking-tight animate-pop-in">ERROR</h1>
          <p className="text-muted-foreground text-lg animate-fade-in">Failed to load products. Try again later.</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-8xl mb-8 uppercase tracking-tight animate-pop-in">SHOP</h1>
          <p className="text-muted-foreground text-lg animate-fade-in">No products available yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  // Separate merch (T-shirts/apparel) from fragrances
  const merchProducts = products.filter(p => 
    p.title.toLowerCase().includes('limited edition') || 
    p.title.toLowerCase().includes('tee') || 
    p.title.toLowerCase().includes('t-shirt')
  );
  
  const fragranceProducts = products.filter(p => 
    !p.title.toLowerCase().includes('limited edition') &&
    !p.title.toLowerCase().includes('tee') && 
    !p.title.toLowerCase().includes('t-shirt')
  );

  const uniqueVendors = Array.from(new Set(fragranceProducts.map(p => p.vendor).filter(Boolean)));
  
  // Sort products: 100ML first, then 250ML
  const sortedProducts = [...fragranceProducts].sort((a, b) => {
    const aIs100 = a.title.includes('100ML');
    const bIs100 = b.title.includes('100ML');
    if (aIs100 && !bIs100) return -1;
    if (!aIs100 && bIs100) return 1;
    return 0;
  });
  
  const filteredProducts = vendorFilter === 'all' 
    ? sortedProducts 
    : sortedProducts.filter(p => p.vendor === vendorFilter);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Back to Home Button */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Vendor Filter */}
        {uniqueVendors.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12 border-l-4 border-primary pl-6 animate-slide-in-left">
            <Button
              variant={vendorFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setVendorFilter('all')}
              className="font-bold tracking-wider uppercase text-sm transition-all hover:scale-105"
            >
              All
            </Button>
            {uniqueVendors.map((vendor, i) => (
              <Button
                key={vendor}
                variant={vendorFilter === vendor ? 'default' : 'outline'}
                onClick={() => setVendorFilter(vendor)}
                className="font-bold tracking-wider uppercase text-sm transition-all hover:scale-105"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                {vendor}
              </Button>
            ))}
          </div>
        )}

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8 border-l-4 border-primary pl-6">
            <h1 className="font-display text-4xl uppercase tracking-tight text-flat">Shop Products</h1>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
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
                className="group relative bg-card border-2 border-border hover:border-primary transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_30px_rgba(255,200,87,0.3)]"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-black"
                  onClick={() => handleProductClick(product.handle)}
                >
                  {image ? (
                    <img 
                      src={image.url} 
                      alt={image.altText || product.title}
                      className="w-full h-full object-contain p-10 transition-all duration-700 group-hover:animate-hover-float"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-muted-foreground/50 animate-float" />
                    </div>
                  )}
                  
                  {/* Vendor Badge */}
                  {isVapeHeadProduct(product.vendor) && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-display text-lg px-3 py-1 tracking-wider animate-bounce-in">
                      VAPE HEAD
                    </Badge>
                  )}
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-full group-hover:translate-y-0">
                    <span className="font-display text-2xl text-white uppercase tracking-wider text-flat transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      View Details
                    </span>
                  </div>
                  
                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-primary border-r-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-0 group-hover:rotate-180"></div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 
                    className="font-headline text-xl uppercase leading-tight cursor-pointer hover:text-primary transition-all duration-300 text-flat transform hover:translate-x-2"
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
                      currencyCode="AUD"
                      size="lg"
                    />
                  </div>
                  
                  {/* CTA */}
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full font-display text-lg tracking-wider uppercase bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
                    disabled={!variant?.availableForSale}
                    size="lg"
                  >
                    {variant?.availableForSale ? (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </span>
                    ) : (
                      'Sold Out'
                    )}
                  </Button>
                </div>
                
                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Merch Section */}
        {merchProducts.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-8 border-l-4 border-accent pl-6">
                <h2 className="font-display text-4xl uppercase tracking-tight text-flat">Merch</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {merchProducts.map((product, index) => {
                const image = product.images.edges[0]?.node;
                const variant = product.variants.edges[0]?.node;
                const price = variant?.price || product.priceRange.minVariantPrice;
                const regularPrice = parseFloat(price.amount);

                return (
                  <div 
                    key={product.id} 
                    className="group relative bg-card border-2 border-border hover:border-accent transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_30px_rgba(255,100,150,0.3)]"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    {/* Product Image */}
                    <div 
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-black"
                      onClick={() => handleProductClick(product.handle)}
                    >
                      {image ? (
                        <img 
                          src={image.url} 
                          alt={image.altText || product.title}
                          className="w-full h-full object-contain p-10 transition-all duration-700 group-hover:animate-hover-float"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-16 w-16 text-muted-foreground/50 animate-float" />
                        </div>
                      )}
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-full group-hover:translate-y-0">
                        <span className="font-display text-2xl text-white uppercase tracking-wider text-flat transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          View Details
                        </span>
                      </div>
                      
                      {/* Animated corner accent */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-accent border-r-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-0 group-hover:rotate-180"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      {/* Title */}
                      <h3 
                        className="font-headline text-xl uppercase leading-tight cursor-pointer hover:text-accent transition-all duration-300 text-flat transform hover:translate-x-2"
                        onClick={() => handleProductClick(product.handle)}
                      >
                        {product.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 text-flat">
                        {product.description || 'Premium quality apparel'}
                      </p>
                      
                      {/* Price */}
                      <div className="pt-2">
                        <PriceDisplay
                          regularPrice={regularPrice}
                          isSubscribed={false}
                          currencyCode="AUD"
                          size="lg"
                        />
                      </div>
                      
                      {/* CTA */}
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full font-display text-lg tracking-wider uppercase bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 active:scale-95"
                        disabled={!variant?.availableForSale}
                        size="lg"
                      >
                        {variant?.availableForSale ? (
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </span>
                        ) : (
                          'Sold Out'
                        )}
                      </Button>
                    </div>
                    
                    {/* Accent Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
