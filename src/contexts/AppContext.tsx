'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, CartItem } from '@/types';

interface AppState {
  user: User | null;
  cart: CartItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  login: (userData: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: AppState = {
  user: null,
  cart: [],
  isLoading: false,
  isAuthenticated: false,
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
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.productId
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        return {
          ...state,
          cart: updatedCart,
        };
      }

      // Item doesn't exist, add new item
      const updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cart.filter(
        item => item.productId !== action.payload
      );
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'UPDATE_QUANTITY': {
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
    }
    case 'CLEAR_CART':
      // Clear cart from localStorage
      localStorage.removeItem('cart');
      
      return {
        ...state,
        cart: [],
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
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    // Ensure role is included in userData
    if (!userData.role) {
      console.error('User role not provided');
      return;
    }
    dispatch({ type: 'SET_USER', payload: userData });
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
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    ...state,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
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
