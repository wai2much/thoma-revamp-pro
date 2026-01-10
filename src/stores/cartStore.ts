import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
  memberPrice?: number;
}

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
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
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.product.id === item.product.id);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.product.id === item.product.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
          toast.success(`Updated quantity for ${item.product.name}`);
        } else {
          set({ items: [...items, item] });
          toast.success(`Added ${item.product.name} to cart`);
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (productId) => {
        const item = get().items.find(i => i.product.id === productId);
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
        if (item) {
          toast.success(`Removed ${item.product.name} from cart`);
        }
      },

      clearCart: () => {
        set({ items: [], checkoutUrl: null });
      },

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
          const cartItems = items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.memberPrice ?? item.product.price,
            quantity: item.quantity,
            imageUrl: item.product.image_url || undefined,
          }));

          const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
            body: { items: cartItems },
          });

          if (error) throw error;
          
          if (data?.url) {
            set({ checkoutUrl: data.url, isLoading: false });
            
            const newWindow = window.open(data.url, '_blank');
            
            if (!newWindow || newWindow.closed) {
              toast.info('Popup blocked! Click to checkout:', {
                action: {
                  label: 'Open Checkout',
                  onClick: () => window.open(data.url, '_blank')
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
            : item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      getTotalSavings: (isMember = false) => {
        if (!isMember) return 0;
        return get().items.reduce((total, item) => {
          if (item.memberPrice) {
            const savings = (item.product.price - item.memberPrice) * item.quantity;
            return total + savings;
          }
          return total;
        }, 0);
      },
    }),
    {
      name: 'haus-technik-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
