'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-yellow-600">TheBagdis</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/products" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Products
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-800 font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden md:block text-gray-700">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    
                    <Link 
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
