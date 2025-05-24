import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forsure'
const FALLBACK_MODE = process.env.FALLBACK_MODE === 'true'

if (!MONGODB_URI && !FALLBACK_MODE) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface GlobalMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: GlobalMongoose | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // In fallback mode, return a mock connection for development
  if (FALLBACK_MODE && process.env.NODE_ENV === 'development') {
    console.log('🔄 Running in fallback mode - using mock database connection')
    return { connection: { readyState: 1 } }
  }

  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message)
      if (FALLBACK_MODE) {
        console.log('🔄 Falling back to mock database connection')
        return { connection: { readyState: 1 } }
      }
      throw error
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    if (FALLBACK_MODE) {
      console.log('🔄 Using fallback mode due to connection error')
      return { connection: { readyState: 1 } }
    }
    throw e
  }

  return cached!.conn
}