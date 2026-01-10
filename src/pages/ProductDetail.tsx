import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, isVapeHeadProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriceDisplay } from '@/components/PriceDisplay';
import { ArrowLeft, ShoppingCart, Info, Zap } from 'lucide-react';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { subscription } = useAuth();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductById(handle!),
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background cyber-grid">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8 bg-primary/20" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-primary/10" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-primary/20" />
              <Skeleton className="h-4 w-full bg-primary/10" />
              <Skeleton className="h-4 w-full bg-primary/10" />
              <Skeleton className="h-12 w-32 bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-display text-4xl uppercase tracking-wider mb-4 text-glow-cyan">Product Not Found</h1>
          <p className="text-muted-foreground mb-8 font-mono">The product you're looking for doesn't exist in database.</p>
          <Button onClick={() => navigate('/shop')} className="neon-glow uppercase tracking-wider">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const regularPrice = product.price;
  const memberPrice = isVapeHeadProduct(product.vendor) ? product.member_price ?? undefined : undefined;

  const handleAddToCart = () => {
    addItem({
      product,
      memberPrice,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background cyber-grid">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--gradient-stripe)' }}
        />
        <div className="absolute inset-0 scan-lines opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative">
        <Button
          variant="ghost"
          onClick={() => navigate('/shop')}
          className="mb-8 glow-border uppercase tracking-wider font-mono text-sm hover:neon-glow transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden glass-card border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 bg-background"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-background">
                  <ShoppingCart className="h-24 w-24 text-primary/30" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-4xl uppercase tracking-wider text-glow-cyan">{product.name}</h1>
                {isVapeHeadProduct(product.vendor) && (
                  <Badge className="bg-primary/20 border border-primary text-primary font-mono neon-glow">
                    <Zap className="w-3 h-3 mr-1" />
                    VAPE HEAD
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-mono uppercase tracking-wider">{product.vendor}</p>
            </div>

            {/* Price */}
            <div className="glass-card p-4 rounded-lg border border-primary/20">
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
              <Alert className="border-primary/30 bg-primary/5 glass-card">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="font-mono">
                    <strong className="text-primary">Become a Member</strong> and save ${(regularPrice - memberPrice).toFixed(2)} on this item!
                  </span>
                  <Button size="sm" onClick={() => navigate('/membership')} className="ml-4 neon-glow uppercase tracking-wider text-xs">
                    View Plans
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Description */}
            <div className="glass-card p-4 rounded-lg border border-border">
              <h2 className="font-display text-lg uppercase tracking-wider mb-2 text-primary">Description</h2>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                {product.description || 'Premium quality automotive product from Haus of Technik.'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full neon-glow uppercase tracking-wider font-display text-lg py-6"
                onClick={handleAddToCart}
                disabled={!product.is_available}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.is_available ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
