import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import { ObjectId } from 'mongodb';

export async function verifyAuth(token: string) {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    // Get user from database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    return !!user;
  } catch (error) {
    return false;
  }
}

export async function getCurrentUser(token: string) {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    // Get user from database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) {
      return null;
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    return null;
  }
}
