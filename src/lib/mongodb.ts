import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

const globalMongoose: GlobalMongoose = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = globalMongoose;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectDB(): Promise<typeof mongoose> {
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  if (!globalMongoose.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
    };

    globalMongoose.promise = mongoose.connect(MONGODB_URI, opts).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    globalMongoose.conn = await globalMongoose.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    globalMongoose.promise = null;
    throw e;
  }

  return globalMongoose.conn;
}

export default connectDB; 