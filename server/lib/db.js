import mongoose from 'mongoose';

// Function to connect to mongodb database
export const connectDB = async() => {
    try{
        mongoose.connection.on("connected", () => console.log("Database connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/sniff-chat`)
    }catch(err){
        console.error("Error connecting to MongoDB:", err.message);
    }
}