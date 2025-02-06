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
  setUser: (user: User | null) => void;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'TOGGLE_CART' };

const initialState: AppState = {
  user: null,
  cart: [],
  isLoading: true, // Start with loading true
  isAuthenticated: false,
  cartOpen: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [], // Clear cart on logout
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_TO_CART': {
      try {
        const existingItemIndex = state.cart.findIndex(
          item => item.productId === action.payload.productId
        );

        let updatedCart;
        if (existingItemIndex > -1) {
          updatedCart = [...state.cart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + 1
          };
        } else {
          updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
        }
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        return {
          ...state,
          cart: updatedCart,
          cartOpen: true,
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
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return {
          ...state,
          cart: updatedCart,
        };
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Failed to update cart');
        return state;
      }
    }
    case 'CLEAR_CART': {
      try {
        localStorage.removeItem('cart');
        return {
          ...state,
          cart: [],
        };
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
        return state;
      }
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load cart
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
        }

        // Check session
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const response = await fetch('/api/auth/session', {
          headers: {
            'Cookie': `token=${token}`
          }
        });
        
        if (!response.ok) {
          // Clear invalid session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'CLEAR_USER' });
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const { user } = await response.json();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading initial data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  const login = async (userData: User) => {
    try {
      dispatch({ type: 'SET_USER', payload: userData });
      toast.success('Login successful!');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please try again.');
      throw error; // Re-throw to handle in the login component
    }
  };

  const logout = async () => {
    try {
      // Clear server-side session first
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear app state
      dispatch({ type: 'CLEAR_USER' });
      dispatch({ type: 'CLEAR_CART' });
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Logout failed. Please try again.');
      throw error; // Re-throw to handle in the component
    }
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Add session check interval
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Session is invalid, logout user
          logout();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    // Initial check
    checkSession();

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setUser,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
