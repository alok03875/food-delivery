import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import path from 'path'
import { fileURLToPath } from "url";

// app config
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json())         // to parse req from fruntend to backend
app.use(cors())                 // to access backend from any fruntend

// db connection
connectDB();

const _dirname = path.resolve();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/food", foodRouter);  
app.use("/images", express.static(path.join(__dirname, "uploads")));  // access image from server to show on fruntend
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Serve the main frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/admin')) {
        return next(); // Skip to the next middleware for /admin routes
    }
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

app.get("/", (req, res) => {
    res.send("API working");
})

app.listen(port, () => {
    console.log(`Server are running on http://localhost:${port}/`)
})
