import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ExternalLink, Zap, ChevronLeft, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ContactInquiryForm } from '@/components/ContactInquiryForm';

const Cart = () => {
  const { items, updateQuantity, removeItem, createCheckout, isLoading, getTotal, getItemCount, getTotalSavings, getShippingCost, getGrandTotal, checkoutUrl } = useCartStore();
  const { subscription } = useAuth();
  const isMember = subscription.subscribed;
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    try {
      await createCheckout();
    } catch (error: any) {
      setCheckoutError(error.message || 'Checkout failed');
      toast.error('Checkout failed: ' + (error.message || 'Unknown error'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background cyber-grid">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: 'var(--gradient-stripe)' }}
          />
          <div className="absolute inset-0 scan-lines opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="glass-card p-12 rounded-lg border border-primary/30">
              <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-primary/50 animate-float" />
              <h1 className="font-display text-3xl uppercase tracking-wider mb-4 text-glow-cyan">Cart Empty</h1>
              <p className="text-muted-foreground mb-8 font-mono">
                Initialize shopping sequence to add items
              </p>
              <Button asChild size="lg" className="neon-glow uppercase tracking-wider">
                <Link to="/shop">
                  <Zap className="w-4 h-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background cyber-grid">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: 'var(--gradient-stripe)' }}
        />
        <div className="absolute inset-0 scan-lines opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="glow-border uppercase tracking-wider font-mono text-sm">
            <Link to="/shop">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <h1 className="font-display text-4xl uppercase tracking-wider mb-8 text-glow-cyan">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id} className="glass-card border border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-background border border-primary/20">
                      {item.product.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg uppercase tracking-wider">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{item.product.vendor}</p>
                        </div>
                        {item.memberPrice && isMember && (
                          <Badge className="bg-primary/20 border border-primary text-primary font-mono text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Member Price
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="glow-border h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-mono text-primary">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="glow-border h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-display text-lg text-primary text-glow-cyan">
                              ${((isMember && item.memberPrice ? item.memberPrice : item.product.price) * item.quantity).toFixed(2)}
                            </div>
                            {isMember && item.memberPrice && (
                              <div className="text-xs text-muted-foreground line-through font-mono">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card sticky top-24 border border-primary/30">
              <CardHeader className="border-b border-primary/20">
                <CardTitle className="font-display uppercase tracking-wider text-glow-cyan">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground">Items ({getItemCount()})</span>
                  <span className="text-primary">${getTotal(isMember).toFixed(2)}</span>
                </div>
                {isMember && getTotalSavings(isMember) > 0 && (
                  <div className="flex justify-between text-sm text-primary font-mono">
                    <span className="font-medium">Member Savings</span>
                    <span className="font-medium text-glow-cyan">-${getTotalSavings(isMember).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  {getShippingCost(isMember) === 0 ? (
                    <span className="text-primary font-medium">FREE</span>
                  ) : (
                    <span className="text-muted-foreground">${getShippingCost(isMember).toFixed(2)}</span>
                  )}
                </div>
                {getTotal(isMember) < 100 && (
                  <div className="text-xs text-primary/80 font-mono text-center p-2 bg-primary/10 rounded border border-primary/20">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Add ${(100 - getTotal(isMember)).toFixed(2)} more for FREE shipping!
                  </div>
                )}
                <div className="border-t border-primary/20 pt-4">
                  <div className="flex justify-between text-sm font-mono mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${getTotal(isMember).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-display text-xl uppercase">
                    <span>Total</span>
                    <span className="text-primary text-glow-cyan">${getGrandTotal(isMember).toFixed(2)} AUD</span>
                  </div>
                  {isMember && getTotalSavings(isMember) > 0 && (
                    <p className="text-xs text-primary mt-1 text-right font-mono">
                      You're saving ${getTotalSavings(isMember).toFixed(2)} with your membership!
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 border-t border-primary/20 pt-6">
                {checkoutError && (
                  <div className="w-full p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive mb-2 font-mono">
                    {checkoutError}
                  </div>
                )}
                {checkoutUrl && (
                  <Button 
                    className="w-full mb-2 glow-border uppercase tracking-wider font-mono" 
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(checkoutUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Re-open Checkout
                  </Button>
                )}
                <Button 
                  className="w-full neon-glow uppercase tracking-wider font-display" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Contact Form Alternative */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center font-mono">
                Having trouble with checkout?
              </p>
              <ContactInquiryForm cartItems={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
