import mongoose from "mongoose";


const connectDB = async () => {
    const uri = process.env.MONGODB_URI?.trim();

    if (!uri) {
        throw new Error("MONGODB_URI is missing. Set it in your .env file.");
    }

    const conn = await mongoose.connect(uri);
    
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

export default connectDB;