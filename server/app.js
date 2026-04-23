import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;
// user defined package
import connectDB from "./utils/connectDB.js";
import authRoute from "./routes/authRoute.js";
import orderRoute from "./routes/orderRoute.js";
import homeVisitRoute from "./routes/homeVisitRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

app.get("/", (req, res) => {
    res.send("server is running successfully");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/home-visit", homeVisitRoute);
app.use("/api/v1/payment", paymentRoute);

const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🔗 Local URL: http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("\n⚠️  DATABASE WARNING: Connection failed.");
        console.error("👉 REASON:", err.message);
        console.error("💡 HINT: Check if your local MongoDB is running or if Atlas IP is whitelisted.");
        console.error("🚀 The server will still start, but database features will be unavailable.");
        console.error("--------------------------------------------------\n");
        
        // Still start the listener so the user can see the UI
        app.listen(PORT, () => {
            console.log(`🚀 Server started in OFFLINE mode on port ${PORT}`);
        });
    }
}

startServer();

