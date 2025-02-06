import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user
    const user = await Auth.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency, paymentMethod } = await req.json();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      payment_capture: 1,
      notes: {
        userId: user.id, // Add user ID to order notes for verification
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amount,
      currency: currency || 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || ''
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
