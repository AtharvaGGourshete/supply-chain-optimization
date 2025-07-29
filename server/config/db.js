import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
        })    
        console.log("Mongo DB connected")
    } catch (error) {
        console.error("Error connecting to MONGO DB",error.message)   
        process.exit(1) 
    }
}

