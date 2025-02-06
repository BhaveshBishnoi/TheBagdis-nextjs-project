'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

interface CheckoutFormData {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  saveAddress: boolean;
}

export default function CheckoutPage() {
  const { user, cart, clearCart } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('new');
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'cod',
    saveAddress: true
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Load user's addresses
    if (user.addresses) {
      setAddresses(user.addresses);
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress('saved');
        setFormData(prev => ({
          ...prev,
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          street: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          pinCode: defaultAddress.pinCode
        }));
      }
    }
  }, [user, cart, router]);

  const handleAddressSelect = (value: string) => {
    setSelectedAddress(value);
    if (value === 'new') {
      setFormData(prev => ({
        ...prev,
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pinCode: ''
      }));
    } else {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setFormData(prev => ({
          ...prev,
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          street: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          pinCode: defaultAddress.pinCode
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the address string
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;

      // Create order payload
      const orderData = {
        items: cart,
        address: fullAddress,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        saveAddress: formData.saveAddress
      };

      // If it's a card or UPI payment, initiate payment first
      if (formData.paymentMethod !== 'cod') {
        const paymentResponse = await fetch('/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            currency: 'INR',
            paymentMethod: formData.paymentMethod
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error('Payment initialization failed');
        }

        const { paymentId, paymentLink } = await paymentResponse.json();
        
        // Store order data in session storage before redirecting
        sessionStorage.setItem('pendingOrder', JSON.stringify({
          ...orderData,
          paymentId
        }));

        // Redirect to payment page
        window.location.href = paymentLink;
        return;
      }

      // For COD, create order directly
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      
      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderId=${order._id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !cart || cart.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            
            {addresses.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="savedAddress"
                    name="addressType"
                    value="saved"
                    checked={selectedAddress === 'saved'}
                    onChange={(e) => handleAddressSelect(e.target.value)}
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                  />
                  <label htmlFor="savedAddress">Use saved address</label>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="radio"
                    id="newAddress"
                    name="addressType"
                    value="new"
                    checked={selectedAddress === 'new'}
                    onChange={(e) => handleAddressSelect(e.target.value)}
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                  />
                  <label htmlFor="newAddress">Use new address</label>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit PIN code"
                  required
                />
              </div>

              {selectedAddress === 'new' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={formData.saveAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-900">
                    Save this address for future orders
                  </label>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'cod' }))}
                      className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'upi' }))}
                      className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                    />
                    <label htmlFor="upi" className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">UPI</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'card' }))}
                      className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">Credit/Debit Card</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-yellow-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-white font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.productId} className="py-4 flex items-center">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
