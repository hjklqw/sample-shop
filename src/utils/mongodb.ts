import mongoose from 'mongoose'

export async function connectToDb() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI!)
    if (connection.readyState === 1) {
      console.log('🚀 Connected to DB!')
    }
  } catch (error: any) {
    console.error('🚨 Unable to connect to DB!')
    console.error(error)
    throw new Error(`🚨 Unable to connect to DB! ${error?.toString()}`)
  }
}
