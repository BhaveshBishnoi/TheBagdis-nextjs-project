'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Navbar() {
  const { cart } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/Bagdi-logo.svg" 
              alt="The Bagdis Logo" 
              width={140} 
              height={40} 
              className="object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-yellow-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-700 hover:text-yellow-500 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Icon */}
            <Link href="/login" className="text-gray-700 hover:text-yellow-500 transition-colors">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}