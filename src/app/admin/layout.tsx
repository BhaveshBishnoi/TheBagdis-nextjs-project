'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardIcon,
  NewspaperIcon,
  UserIcon,
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
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen fixed">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <nav className="mt-4">
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <ClipboardIcon className="h-5 w-5 mr-2" />
              Orders
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <NewspaperIcon className="h-5 w-5 mr-2" />
              Blogs
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Users
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
