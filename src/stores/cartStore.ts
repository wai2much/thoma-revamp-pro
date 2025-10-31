import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout } from '@/lib/shopify';
import { toast } from 'sonner';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
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
  getTotal: () => string;
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

          const cart = await createStorefrontCheckout(lineItems);
          
          if (cart?.checkoutUrl) {
            set({ 
              cartId: cart.id, 
              checkoutUrl: cart.checkoutUrl,
              isLoading: false 
            });
            
            // Open checkout in new tab
            window.open(cart.checkoutUrl, '_blank');
          }
        } catch (error) {
          console.error('Checkout error:', error);
          toast.error('Failed to create checkout. Please try again.');
          set({ isLoading: false });
        }
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        const total = get().items.reduce((sum, item) => {
          return sum + (parseFloat(item.price.amount) * item.quantity);
        }, 0);
        return total.toFixed(2);
      }
    }),
    {
      name: 'tyreplus-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
