'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const router = useRouter();
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsAdminMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex w-full">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/Bagdi-logo.svg"
                  alt="The Bagdis Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150"
              >
                Contact
              </Link>
              
              {/* Admin Panel Link for Admin Users */}
              {user?.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={toggleAdminMenu}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150 flex items-center"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-1" />
                    Admin Panel
                  </button>
                  
                  {/* Admin Dropdown Menu */}
                  {isAdminMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          <ChartBarIcon className="h-5 w-5 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/products"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          Products
                        </Link>
                        <Link
                          href="/admin/users"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          <UsersIcon className="h-5 w-5 mr-2" />
                          Users
                        </Link>
                        <Link
                          href="/admin/blogs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Blogs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Nav */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center text-gray-900 hover:text-yellow-600 transition duration-150"
            >
              <div className="relative">
                <ShoppingBagIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-gray-900 hover:text-yellow-600 transition duration-150 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-800 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition duration-150"
              >
                Login
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition duration-150 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Admin Links */}
            {user?.role === 'admin' && (
              <div className="border-t border-gray-100 pt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">Admin Panel</div>
                <Link
                  href="/admin/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <Link
                  href="/admin/products"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Cog6ToothIcon className="h-5 w-5 mr-2" />
                    Products
                  </div>
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    Users
                  </div>
                </Link>
                <Link
                  href="/admin/blogs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Blogs
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}