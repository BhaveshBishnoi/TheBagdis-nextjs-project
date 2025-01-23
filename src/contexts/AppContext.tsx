'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, CartItem } from '@/types';
import toast from 'react-hot-toast';

interface AppState {
  user: User | null;
  cart: CartItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  cartOpen: boolean;
}

interface AppContextType extends AppState {
  login: (userData: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' };

const initialState: AppState = {
  user: null,
  cart: [],
  isLoading: false,
  isAuthenticated: false,
  cartOpen: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ADD_TO_CART': {
      try {
        const existingItemIndex = state.cart.findIndex(
          item => item.productId === action.payload.productId
        );

        let updatedCart;
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          updatedCart = [...state.cart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + 1
          };
        } else {
          // Item doesn't exist, add new item
          updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        return {
          ...state,
          cart: updatedCart,
          cartOpen: true, // Open cart when adding item
        };
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
        return state;
      }
    }
    case 'REMOVE_FROM_CART': {
      try {
        const updatedCart = state.cart.filter(
          item => item.productId !== action.payload
        );
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        return {
          ...state,
          cart: updatedCart,
        };
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove item from cart');
        return state;
      }
    }
    case 'UPDATE_QUANTITY': {
      try {
        const updatedCart = state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        return {
          ...state,
          cart: updatedCart,
        };
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error('Failed to update quantity');
        return state;
      }
    }
    case 'CLEAR_CART':
      try {
        // Clear cart from localStorage
        localStorage.removeItem('cart');
        
        return {
          ...state,
          cart: [],
          cartOpen: false,
        };
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
        return state;
      }
    case 'TOGGLE_CART':
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing session and cart data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Verify the session is still valid
          const response = await fetch('/api/auth/verify', {
            credentials: 'include'
          });
          
          if (response.ok) {
            dispatch({ type: 'SET_USER', payload: userData });
          } else {
            // If session is invalid, clear local storage
            localStorage.removeItem('user');
          }
        }

        // Load cart data from localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          try {
            const cartData = JSON.parse(storedCart);
            cartData.forEach((item: CartItem) => {
              dispatch({ type: 'ADD_TO_CART', payload: item });
            });
          } catch (error) {
            console.error('Error loading cart data:', error);
            localStorage.removeItem('cart');
            toast.error('Failed to load cart data');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        toast.error('Authentication error');
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    try {
      // Ensure role is included in userData
      if (!userData.role) {
        throw new Error('User role not provided');
      }
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear the auth cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      
      // Clear app state
      dispatch({ type: 'CLEAR_USER' });
      dispatch({ type: 'CLEAR_CART' });
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const addToCart = (item: CartItem) => {
    try {
      dispatch({ type: 'ADD_TO_CART', payload: item });
      toast.success('Added to cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity },
      });
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const value = {
    ...state,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
