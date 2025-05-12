import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ssl: true,
      tls: true,
      retryWrites: true,
      w: 'majority' as const,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      family: 4, // Force IPv4
      // Explicit TLS configuration
      tlsInsecure: false,
      directConnection: false,
      // Add monitoring for connection issues
      monitorCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        // Add connection event listeners
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        // Log specific error details
        if (error.name === 'MongoServerSelectionError') {
          console.error('Server selection error details:', {
            message: error.message,
            reason: error.reason,
            topology: error.topology?.description,
          });
        }
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
} 