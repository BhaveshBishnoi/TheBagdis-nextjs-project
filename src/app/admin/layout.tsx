'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useApp();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <Link
            href="/"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md fixed h-[calc(100vh-4rem)] top-16">
          <nav className="mt-8 px-4">
            <div className="space-y-4">
              <Link
                href="/admin"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200"
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                Orders
              </Link>
              <Link
                href="/admin/blogs"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200"
              >
                <NewspaperIcon className="h-5 w-5 mr-3" />
                Blogs
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200"
              >
                <UsersIcon className="h-5 w-5 mr-3" />
                Users
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
