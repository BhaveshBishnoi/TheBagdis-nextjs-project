'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path ? 'text-yellow-600' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/Bagdi-logo.svg"
                alt="The Bagdi's Logo"
                width={56}
                height={56}
                className="w-auto h-14"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`${isActive('/products')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`${isActive('/about')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`${isActive('/contact')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <User className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`${isActive('/')} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`${isActive('/products')} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link
                href="/about"
                className={`${isActive('/about')} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`${isActive('/contact')} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;