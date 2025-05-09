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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      w: 1,
    };

    globalMongoose.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    globalMongoose.conn = await globalMongoose.promise;
  } catch (e) {
    globalMongoose.promise = null;
    throw e;
  }

  return globalMongoose.conn;
}

export default connectDB; 