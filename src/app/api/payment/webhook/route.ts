import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Order from '@/models/Order';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'payment.captured') {
      await connectToDatabase();

      // Update order with payment details
      const order = await Order.findOne({ 'paymentResult.id': event.payload.payment.entity.order_id });
      if (order) {
        order.paymentStatus = 'completed';
        order.paymentResult = {
          id: event.payload.payment.entity.id,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: event.payload.payment.entity.email,
        };
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
