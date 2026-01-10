import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, Product, isVapeHeadProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/PriceDisplay';
import { ShoppingCart, Zap, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import shopBanner from '@/assets/shop-banner.png';

const Shop = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { subscription } = useAuth();
  const [vendorFilter, setVendorFilter] = useState<string>('all');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleAddToCart = (product: Product) => {
    const memberPrice = isVapeHeadProduct(product.vendor) 
      ? product.member_price ?? undefined
      : undefined;

    addItem({
      product,
      memberPrice,
      quantity: 1,
    });

    toast.success('Added to cart!', {
      description: product.name,
      position: 'top-center',
    });
  };

  const handleProductClick = (id: string) => {
    navigate(`/shop/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background cyber-grid">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-pulse">
            <Skeleton className="h-24 w-96 mx-auto mb-4 bg-primary/20" />
            <Skeleton className="h-6 w-64 mx-auto bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[500px] animate-pulse bg-primary/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-display text-8xl mb-8 uppercase tracking-tight animate-pop-in text-glow-cyan">
            SYSTEM ERROR
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in font-mono">
            Failed to load products. Retry connection...
          </p>
        </div>
      </div>
    );
  }

  // Separate merch from fragrances
  const merchProducts = products?.filter(p => 
    p.category === 'merch' || 
    p.name.toLowerCase().includes('limited edition') || 
    p.name.toLowerCase().includes('tee') || 
    p.name.toLowerCase().includes('t-shirt')
  ) || [];
  
  const fragranceProducts = products?.filter(p => 
    p.category === 'fragrance' && 
    !p.name.toLowerCase().includes('limited edition') &&
    !p.name.toLowerCase().includes('tee') && 
    !p.name.toLowerCase().includes('t-shirt')
  ) || [];

  const uniqueVendors = Array.from(new Set(fragranceProducts.map(p => p.vendor).filter(Boolean)));
  
  const filteredProducts = vendorFilter === 'all' 
    ? fragranceProducts 
    : fragranceProducts.filter(p => p.vendor === vendorFilter);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section - Cyberpunk */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden cyber-grid">
        {/* Neon gradient background */}
        <div 
          className="absolute inset-0"
          style={{ background: 'var(--gradient-stripe)' }}
        />
        
        {/* Scan lines */}
        <div className="absolute inset-0 scan-lines opacity-30" />
        
        {/* Decorative neon rings */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-primary/40 shadow-[0_0_60px_hsl(var(--primary)/0.3)] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-accent/30 shadow-[0_0_40px_hsl(var(--accent)/0.2)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/10 shadow-[0_0_80px_hsl(var(--primary)/0.5)]" />
        </div>
        
        {/* Floating glitch symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-[10%] left-[10%] text-8xl font-mono text-primary/20 animate-float glitch">⚡</span>
          <span className="absolute top-[20%] right-[15%] text-6xl font-mono text-accent/30 animate-float" style={{ animationDelay: '1s' }}>◈</span>
          <span className="absolute bottom-[20%] left-[20%] text-7xl font-mono text-primary/15 animate-float" style={{ animationDelay: '0.5s' }}>⬡</span>
          <span className="absolute bottom-[15%] right-[10%] text-9xl font-mono text-accent/10 animate-float" style={{ animationDelay: '1.5s' }}>△</span>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Badge className="mb-4 font-mono uppercase tracking-widest bg-primary/20 border border-primary/50 text-primary animate-pulse-glow">
            <Zap className="w-3 h-3 mr-1" />
            Neural Commerce Active
          </Badge>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-wider text-foreground text-glow-cyan animate-pop-in">
            Shop The
          </h1>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-wider text-foreground text-glow-cyan animate-pop-in" style={{ animationDelay: '0.2s' }}>
            Collection
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground font-mono tracking-wide animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Luxury Auto Fragrances by Haus of Technik
          </p>
          <Button 
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 neon-glow uppercase tracking-wider font-display text-xl px-10 py-6 animate-fade-in hover:scale-105 transition-transform"
            style={{ animationDelay: '0.6s' }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Initialize Browse
          </Button>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Back to Home Button */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="group glow-border uppercase tracking-wider font-mono text-sm hover:neon-glow transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Button>
      </div>

      <div id="products" className="container mx-auto px-4 py-12">
        {/* Vendor Filter */}
        {uniqueVendors.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12 border-l-2 border-primary pl-6 animate-slide-in-left">
            <Button
              variant={vendorFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setVendorFilter('all')}
              className="font-mono tracking-wider uppercase text-sm transition-all hover:scale-105 neon-glow"
            >
              All
            </Button>
            {uniqueVendors.map((vendor, i) => (
              <Button
                key={vendor}
                variant={vendorFilter === vendor ? 'default' : 'outline'}
                onClick={() => setVendorFilter(vendor!)}
                className="font-mono tracking-wider uppercase text-sm transition-all hover:scale-105 glow-border"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                {vendor}
              </Button>
            ))}
          </div>
        )}

        {/* Shop Banner */}
        <div className="mb-12 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
          <img 
            src={shopBanner} 
            alt="Haus of Technik vs Designer Fragrances" 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8 border-l-2 border-primary pl-6">
            <h1 className="font-display text-4xl uppercase tracking-wider text-glow-cyan">Shop Products</h1>
          </div>
        </div>

        {/* Empty State */}
        {(!products || products.length === 0) && (
          <div className="text-center py-20 glass-card rounded-lg">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <h2 className="font-display text-2xl uppercase tracking-wider text-glow-cyan mb-2">No Products Found</h2>
            <p className="text-muted-foreground font-mono">Products will appear here once added to inventory.</p>
          </div>
        )}
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative glass-card border border-border hover:border-primary transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards'
              }}
            >
              {/* Product Image */}
              <div 
                className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-background"
                onClick={() => handleProductClick(product.id)}
              >
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-contain p-10 transition-all duration-700 group-hover:animate-hover-float"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 text-primary/30 animate-float" />
                  </div>
                )}
                
                {/* Vendor Badge */}
                {isVapeHeadProduct(product.vendor) && (
                  <Badge className="absolute top-4 left-4 bg-primary/20 border border-primary text-primary font-mono text-sm px-3 py-1 tracking-wider animate-bounce-in neon-glow">
                    VAPE HEAD
                  </Badge>
                )}
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-full group-hover:translate-y-0 backdrop-blur-sm">
                  <span className="font-display text-2xl text-primary uppercase tracking-wider transform scale-75 group-hover:scale-100 transition-transform duration-300 text-glow-cyan">
                    View Details
                  </span>
                </div>
                
                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-primary border-r-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              
              {/* Product Info */}
              <div className="p-4 space-y-3 border-t border-primary/20">
                {/* Title */}
                <h3 
                  className="font-display text-xl uppercase tracking-wider leading-tight cursor-pointer hover:text-primary transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground font-mono line-clamp-2">
                  {product.description || 'Premium quality automotive product'}
                </p>
                
                {/* Price */}
                <div className="pt-2">
                  <PriceDisplay
                    regularPrice={product.price}
                    memberPrice={isVapeHeadProduct(product.vendor) ? product.member_price ?? undefined : undefined}
                    isSubscribed={subscription.subscribed}
                    currencyCode="AUD"
                    size="lg"
                  />
                </div>
                
                {/* CTA */}
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full font-display text-lg tracking-wider uppercase neon-glow transition-all duration-300 transform hover:scale-105 active:scale-95"
                  disabled={!product.is_available}
                  size="lg"
                >
                  {product.is_available ? (
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
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_10px_hsl(var(--primary))]" />
            </div>
          ))}
        </div>

        {/* Divider */}
        {merchProducts.length > 0 && (
          <div className="my-20 flex items-center gap-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--accent))]" />
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_hsl(var(--primary))]" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--accent))]" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        )}

        {/* Merch Section */}
        {merchProducts.length > 0 && (
          <div className="relative -mx-4 px-4 py-12 glass-card rounded-lg border border-accent/30">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative mb-8">
              <div className="flex items-center gap-4 mb-8 border-l-2 border-accent pl-6">
                <h2 className="font-display text-4xl uppercase tracking-wider text-glow-pink">Merch</h2>
              </div>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {merchProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group relative glass-card border border-border hover:border-accent transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_40px_hsl(var(--accent)/0.3)]"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-background"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-all duration-700 group-hover:animate-hover-float"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-accent/30 animate-float" />
                      </div>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-full group-hover:translate-y-0 backdrop-blur-sm">
                      <span className="font-display text-2xl text-accent uppercase tracking-wider transform scale-75 group-hover:scale-100 transition-transform duration-300 text-glow-pink">
                        View Details
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-3 border-t border-accent/20">
                    <h3 
                      className="font-display text-xl uppercase tracking-wider leading-tight cursor-pointer hover:text-accent transition-all duration-300"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground font-mono line-clamp-2">
                      {product.description || 'Limited edition merchandise'}
                    </p>
                    
                    <div className="pt-2">
                      <span className="font-display text-2xl text-accent text-glow-pink">
                        ${product.price.toFixed(2)} {product.currency}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full font-display text-lg tracking-wider uppercase bg-accent hover:bg-accent/80 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_hsl(var(--accent)/0.4)]"
                      disabled={!product.is_available}
                      size="lg"
                    >
                      {product.is_available ? (
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
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_10px_hsl(var(--accent))]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
