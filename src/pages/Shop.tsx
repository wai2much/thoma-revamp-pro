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
import { toast } from 'sonner';

// Import banner image
import hausTechnikBanner from "@/assets/haus-technik-fragrances-banner.png";

// Import fragrance images
import amgBloomImg from "@/assets/products/amg-bloom-250ml.png";
import amgBloomBottleImg from "@/assets/products/amg-bloom-bottle.png";
import amgBloom100Img from "@/assets/products/amg-bloom-100ml.png";
import m3LoingImg from "@/assets/products/m3-loing-100ml.png";
import nSkrrtImg from "@/assets/products/n-skrrt-100ml.png";
import gtrGodImg from "@/assets/products/gtr-god-100ml.png";
import brokieImg from "@/assets/products/911-brokie-100ml.png";
import hausNoirImg from "@/assets/products/haus-noir-100ml.png";

// Import figurine images
import hausonsuitImg from "@/assets/figurines/hauson-suit.png";
import hausoncasualImg from "@/assets/figurines/hauson-casual.png";
import hausonwizardImg from "@/assets/figurines/hauson-wizard.png";
import hausontuxImg from "@/assets/figurines/hauson-tux.png";

// Import artwork images for hero
import artworkHauson from "@/assets/artwork/hauson-3-3.png";
import artworkFriendvibe from "@/assets/artwork/day0friendvibe.png";
import artworkOne from "@/assets/artwork/artwork-1.png";
import artworkBill from "@/assets/artwork/bill.png";

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

    // Toast notification positioned at top
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

  const uniqueVendors = Array.from(new Set(products.map(p => p.vendor).filter(Boolean)));
  const filteredProducts = vendorFilter === 'all' 
    ? products 
    : products.filter(p => p.vendor === vendorFilter);

  const hasVapeHeadProducts = products.some(p => isVapeHeadProduct(p.vendor));
  const showMemberBanner = !subscription.subscribed && hasVapeHeadProducts;

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

      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden border-b-4 border-primary min-h-[600px] lg:min-h-[700px]">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover scale-105"
            poster="https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1920"
          >
            <source src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          {/* Additional grain texture overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDAiLz48L3N2Zz4=')] opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                {/* Overline - Slide in from left */}
                <div className="flex items-center gap-3 mb-6 animate-slide-in-left">
                  <div className="h-px w-12 bg-primary animate-slide-line"></div>
                  <span className="text-primary font-bold text-sm tracking-[0.3em] uppercase">Latest Drop</span>
                  <Zap className="w-4 h-4 text-primary animate-bounce-in" fill="currentColor" />
                </div>
                
                {/* Main Headline - Pop in with bounce */}
                <h1 className="font-display text-[clamp(4rem,15vw,14rem)] leading-[0.85] uppercase tracking-tighter text-white animate-pop-in drop-shadow-2xl">
                  SHOP <span className="text-primary inline-block animate-bounce-in" style={{ animationDelay: '0.2s' }}>NOW</span>
                </h1>
                
                {/* Subheadline - Fade in with delay */}
                <p className="text-white/80 text-lg md:text-xl max-w-xl font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  Premium automotive culture. Street-certified performance. 
                  <span className="text-primary font-bold"> No compromises.</span>
                </p>
                
                {/* Stats Bar - Staggered pop in */}
                <div className="flex flex-wrap gap-6 text-sm font-bold">
                  <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-primary animate-pulse"></div>
                    <span className="text-white">{products.length} PRODUCTS</span>
                  </div>
                  <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-secondary animate-pulse"></div>
                    <span className="text-white">FAST SHIPPING</span>
                  </div>
                  <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.7s' }}>
                    <div className="w-2 h-2 bg-accent animate-pulse"></div>
                    <span className="text-white">MEMBERS SAVE 25-33%</span>
                  </div>
                </div>
              </div>

              {/* Right: Artwork Gallery Display */}
              <div className="relative h-[500px] hidden lg:grid grid-cols-2 gap-4">
                {/* Artwork 1 */}
                <div className="relative overflow-hidden rounded-lg border-2 border-primary/50 hover:border-primary transition-all duration-500 group backdrop-blur-sm bg-black/20">
                  <img 
                    src={artworkHauson} 
                    alt="Hauson Artwork" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Artwork 2 */}
                <div className="relative overflow-hidden rounded-lg border-2 border-accent/50 hover:border-accent transition-all duration-500 group backdrop-blur-sm bg-black/20">
                  <img 
                    src={artworkFriendvibe} 
                    alt="Day 0 Friend Vibe" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Artwork 3 */}
                <div className="relative overflow-hidden rounded-lg border-2 border-secondary/50 hover:border-secondary transition-all duration-500 group backdrop-blur-sm bg-black/20">
                  <img 
                    src={artworkOne} 
                    alt="Artwork Collection" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Artwork 4 */}
                <div className="relative overflow-hidden rounded-lg border-2 border-primary/50 hover:border-primary transition-all duration-500 group backdrop-blur-sm bg-black/20">
                  <img 
                    src={artworkBill} 
                    alt="Bill Artwork" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements - Animated */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 right-10 font-display text-[20vw] text-primary leading-none opacity-30 rotate-12 animate-float">
            SHOP
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Member Savings Banner - Slide in from top */}
        {showMemberBanner && (
          <Alert className="mb-12 border-2 border-primary bg-card/50 backdrop-blur animate-slide-up">
            <Info className="h-5 w-5 text-primary animate-bounce" />
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
                className="font-bold tracking-wide bg-primary hover:bg-primary/90 shrink-0 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
              >
                JOIN NOW
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Vendor Filter - Hypebeast Style with animations */}
        {uniqueVendors.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12 border-l-4 border-primary pl-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
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
        
        {/* HAUS OF TECHNIK Fragrances Banner */}
        <div className="mb-16 animate-pop-in">
          <div className="relative overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-500">
            <img 
              src={hausTechnikBanner} 
              alt="HAUS OF TECHNIK Luxury Auto Fragrances" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* HAUS OF TECHNIK Fragrances Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8 border-l-4 border-secondary pl-6">
            <h2 className="font-display text-4xl uppercase tracking-tight text-flat">Luxury Auto Fragrances</h2>
            <Badge className="bg-secondary text-secondary-foreground">NEW</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {[
              // 100ML variants - $25
              { id: "fragrance-amg-bloom-100", name: "AMG Bloom", description: "Luxury Auto Fragrance - 100ML", image: amgBloom100Img, price: "25.00" },
              { id: "fragrance-haus-noir-100", name: "Haus Noir", description: "100X More Fancy - 100ML", image: hausNoirImg, price: "25.00" },
              { id: "fragrance-m3-loing-100", name: "M3 Lo-ing", description: "Luxury Auto Fragrance - 100ML", image: m3LoingImg, price: "25.00" },
              { id: "fragrance-n-skrrt-100", name: "N Skrrt", description: "Luxury Auto Fragrance - 100ML", image: nSkrrtImg, price: "25.00" },
              { id: "fragrance-gtr-god-100", name: "GTR G.O.D", description: "Luxury Auto Fragrance - 100ML", image: gtrGodImg, price: "25.00" },
              { id: "fragrance-911-brokie-100", name: "911 Brokie No-Nobu", description: "Luxury Auto Fragrance - 100ML", image: brokieImg, price: "25.00" },
              // 250ML variants - $38
              { id: "fragrance-amg-bloom-250", name: "AMG Bloom", description: "Luxury Auto Fragrance - 250ML", image: amgBloomImg, price: "38.00" },
              { id: "fragrance-haus-noir-250", name: "Haus Noir", description: "100X More Fancy - 250ML", image: hausNoirImg, price: "38.00" },
              { id: "fragrance-m3-loing-250", name: "M3 Lo-ing", description: "Luxury Auto Fragrance - 250ML", image: m3LoingImg, price: "38.00" },
              { id: "fragrance-n-skrrt-250", name: "N Skrrt", description: "Luxury Auto Fragrance - 250ML", image: nSkrrtImg, price: "38.00" },
              { id: "fragrance-gtr-god-250", name: "GTR G.O.D", description: "Luxury Auto Fragrance - 250ML", image: gtrGodImg, price: "38.00" },
              { id: "fragrance-911-brokie-250", name: "911 Brokie No-Nobu", description: "Luxury Auto Fragrance - 250ML", image: brokieImg, price: "38.00" }
            ].map((fragrance, index) => (
              <div 
                key={fragrance.id}
                className="group relative bg-card border-2 border-border hover:border-secondary transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_30px_rgba(255,200,87,0.3)]"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="aspect-[3/4] p-10 bg-black flex items-center justify-center">
                  <img 
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-full h-full object-contain transition-all duration-700 group-hover:animate-hover-float"
                  />
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-headline text-lg uppercase leading-tight text-flat">
                    {fragrance.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{fragrance.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-secondary">${fragrance.price}</span>
                    <span className="text-xs text-muted-foreground">AUD</span>
                  </div>
                  <Button 
                    onClick={() => {
                      addItem({
                        product: {
                          id: fragrance.id,
                          title: fragrance.name,
                          description: fragrance.description,
                          handle: fragrance.id,
                          vendor: 'HAUS OF TECHNIK',
                          images: { edges: [{ node: { url: fragrance.image, altText: fragrance.name } }] },
                          variants: { edges: [{ node: { id: fragrance.id, title: fragrance.description, price: { amount: fragrance.price, currencyCode: 'AUD' }, availableForSale: true, selectedOptions: [] } }] },
                          priceRange: { minVariantPrice: { amount: fragrance.price, currencyCode: 'AUD' } }
                        },
                        variantId: fragrance.id,
                        variantTitle: fragrance.description,
                        price: { amount: fragrance.price, currencyCode: 'AUD' },
                        quantity: 1,
                        selectedOptions: []
                      });
                    }}
                    className="w-full font-display tracking-wider uppercase bg-secondary hover:bg-secondary/90 transition-all hover:scale-105"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                
                <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground animate-bounce-in">
                  NEW
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Figurine Products Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8 border-l-4 border-accent pl-6">
            <h2 className="font-display text-4xl uppercase tracking-tight text-flat">Limited Edition Figurines</h2>
            <Badge className="bg-accent text-accent-foreground animate-pulse">COMING SOON</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {[
              { name: "Hauson Suit Edition", image: hausonsuitImg, price: "89.99" },
              { name: "Hauson Casual Edition", image: hausoncasualImg, price: "79.99" },
              { name: "Hauson Wizard Edition", image: hausonwizardImg, price: "94.99" },
              { name: "Hauson Tux Edition", image: hausontuxImg, price: "99.99" }
            ].map((figurine, index) => (
              <div 
                key={figurine.name}
                className="group relative bg-card border-2 border-border hover:border-accent transition-all duration-500 overflow-hidden animate-pop-in rounded-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="aspect-[3/4] p-10 bg-black flex items-center justify-center">
                  <img 
                    src={figurine.image}
                    alt={figurine.name}
                    className="w-full h-full object-contain transition-all duration-700 group-hover:animate-hover-float group-hover:rotate-3"
                  />
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-headline text-lg uppercase leading-tight text-flat">
                    {figurine.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-accent">${figurine.price}</span>
                    <span className="text-xs text-muted-foreground">AUD</span>
                  </div>
                  <Button 
                    disabled
                    className="w-full font-display tracking-wider uppercase opacity-50"
                    size="lg"
                  >
                    Coming Soon
                  </Button>
                </div>
                
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground animate-bounce-in">
                  NEW
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Product Grid - Magazine Layout with staggered animations */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8 border-l-4 border-primary pl-6">
            <h2 className="font-display text-4xl uppercase tracking-tight text-flat">Shop Products</h2>
          </div>
        </div>
        
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
                  
                  {/* Vendor Badge - Animated */}
                  {isVapeHeadProduct(product.vendor) && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-display text-lg px-3 py-1 tracking-wider animate-bounce-in">
                      VAPE HEAD
                    </Badge>
                  )}
                  
                  {/* Quick View Overlay - Slide up on hover */}
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
                  
                  {/* CTA - Enhanced hover */}
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
                
                {/* Accent Line - Animated on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
