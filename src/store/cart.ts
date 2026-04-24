import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string; // product_id + color
  product_id: string;
  name: string;
  model_code: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const cartItemId = `${item.product_id}${item.color ? `-${item.color}` : ''}`;
          const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, cartItemId }] };
        });
      },
      
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },

      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'mw-industry-cart',
    }
  )
);
