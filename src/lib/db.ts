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

const cached = globalWithMongoose.mongoose;

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      dbName: 'bagdi-web',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4 only
    };

    mongoose.set('strictQuery', true);

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }

  return cached.conn;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
});

export { connectToDatabase };
export default connectToDatabase;
