import mongoose from "mongoose";

const connectDB = (url) => {
    return mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000 // Fail faster if the DB is down
    })
    .then(() => console.log("✅ connected mongodb successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err; // Re-throw to prevent server from starting
    });
}

export default connectDB;

