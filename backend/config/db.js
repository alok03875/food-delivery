import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://alokmaurya:KOXhnZPh3sDFdDpN@cluster0.n65uq.mongodb.net/food-del')
    .then(()=>{
        console.log("Database connected successfully");
    })
} 