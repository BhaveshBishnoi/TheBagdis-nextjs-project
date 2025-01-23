'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }
    
    // Proceed to checkout
    router.push('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven&lsquo;t added anything to your cart yet.</p>
            <Link 
              href="/products" 
              className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center hover:bg-gray-50 -mx-8 px-6 py-5">
                <div className="flex w-2/5">
                  <div className="w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-24 object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">{item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex justify-center w-1/5">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                    className="mx-2 border text-center w-20 rounded-md"
                  />
                </div>
                <span className="text-center w-1/5 font-semibold text-sm">₹{item.price.toFixed(2)}</span>
                <span className="text-center w-1/5 font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total</span>
              <span>₹{cart.totalAmount.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="bg-yellow-500 font-semibold hover:bg-yellow-600 py-3 text-sm text-white uppercase w-full rounded-md"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
