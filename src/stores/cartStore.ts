import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/shopify';
import { getMemberPrice, isVapeHeadProduct } from '@/lib/memberPricing';
import { toast } from 'sonner';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  memberPrice?: number;
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
  getItemCount: () => number;
  getTotal: (isMember?: boolean) => number;
  getTotalSavings: (isMember?: boolean) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
          toast.success(`Updated quantity for ${item.product.title}`);
        } else {
          set({ items: [...items, item] });
          toast.success(`Added ${item.product.title} to cart`);
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        const item = get().items.find(i => i.variantId === variantId);
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
        if (item) {
          toast.success(`Removed ${item.product.title} from cart`);
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items } = get();
        
        if (items.length === 0) {
          toast.error('Your cart is empty');
          return;
        }

        set({ isLoading: true });

        try {
          const lineItems = items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }));

          console.log('Creating checkout with items:', lineItems);
          const cart = await createStorefrontCheckout(lineItems);
          console.log('Checkout created:', cart);
          
          if (cart?.checkoutUrl) {
            // Add channel parameter for proper checkout flow
            const checkoutUrlWithChannel = new URL(cart.checkoutUrl);
            checkoutUrlWithChannel.searchParams.set('channel', 'online_store');
            const finalUrl = checkoutUrlWithChannel.toString();
            
            console.log('Opening checkout URL:', finalUrl);
            
            set({ 
              cartId: cart.id, 
              checkoutUrl: finalUrl,
              isLoading: false 
            });
            
            // Open checkout in new tab
            const newWindow = window.open(finalUrl, '_blank');
            
            if (!newWindow || newWindow.closed) {
              // Popup was blocked, show message to user
              toast.info('Popup blocked! Click the link to checkout:', {
                action: {
                  label: 'Open Checkout',
                  onClick: () => window.open(finalUrl, '_blank')
                },
                duration: 10000
              });
            }
          } else {
            throw new Error('No checkout URL received');
          }
        } catch (error: any) {
          console.error('Checkout error:', error);
          toast.error(error.message || 'Failed to create checkout. Please try again.');
          set({ isLoading: false });
        }
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: (isMember = false) => {
        return get().items.reduce((total, item) => {
          const price = isMember && item.memberPrice 
            ? item.memberPrice 
            : parseFloat(item.price.amount);
          return total + (price * item.quantity);
        }, 0);
      },

      getTotalSavings: (isMember = false) => {
        if (!isMember) return 0;
        return get().items.reduce((total, item) => {
          if (item.memberPrice) {
            const regularPrice = parseFloat(item.price.amount);
            const savings = (regularPrice - item.memberPrice) * item.quantity;
            return total + savings;
          }
          return total;
        }, 0);
      },
    }),
    {
      name: 'tyreplus-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
