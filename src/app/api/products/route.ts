import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const products = await db.collection('products')
      .find({})
      .toArray();

    // If no products are found, return an empty array
    if (!products) {
      return NextResponse.json([]);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const db = await connectToDatabase();

    const result = await db.collection('products').insertOne({
      ...product,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Product added successfully',
      productId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
