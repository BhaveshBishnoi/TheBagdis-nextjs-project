import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import { ObjectId } from 'mongodb';
import User from '../models/User';

interface JWTPayload {
  userId: string;
}

export class Auth {
  static async verifyAuth(token: string): Promise<boolean> {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
      
      // Connect to database
      await connectToDatabase();
      
      // Get user from database using Mongoose
      const user = await User.findById(new ObjectId(decoded.userId));
      
      return !!user;
    } catch {
      return false;
    }
  }

  static async getCurrentUser(token: string) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as JWTPayload;
      
      // Connect to database
      await connectToDatabase();
      
      // Get user from database using Mongoose
      const user = await User.findById(new ObjectId(decoded.userId));
      
      if (!user) {
        return null;
      }

      // Remove sensitive data
      const { password:userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch {
      return null;
    }
  }
}
