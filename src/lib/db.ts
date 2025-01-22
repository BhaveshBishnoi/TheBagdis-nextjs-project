import mongoose from 'mongoose';

// Define the global mongoose cache type
type GlobalMongoose = {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | null;
}

// Extend the global scope
declare global {

  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose['mongoose'];
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: GlobalMongoose['mongoose'];
};

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Ensure global mongoose cache is initialized
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}


export async function connectToDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const opts = {
      bufferCommands: true,
      dbName: 'thebagdisdb',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4 only
    };

    await mongoose.connect(MONGODB_URI, opts);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

export default connectToDatabase;
