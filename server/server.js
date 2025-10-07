// server.js (UPDATED)
import express from "express";
import { connectDB } from "./config/db.js";
import cors from 'cors'; 
import cookieParser from 'cookie-parser'; // <--- NEW IMPORT
import authRoutes from "./routes/auth.js";
import forecastRoutes from "./routes/forecastRoutes.js"
import optimizeRouter from "./routes/optimize.js"
import userRoute from "./routes/user.js";
import dotenv from 'dotenv';

dotenv.config(); // <--- Moved to the top for consistency
const app = express();

// --- MIDDLEWARE SETUP ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <--- NEW: Enable cookie parsing

const PORT = process.env.PORT || 3000;

const corsOptions = {
    // Make sure your frontend URL is set in .env as CLIENT_URL
    origin: [
        process.env.CLIENT_URL, 
        'http://localhost:5173', // Vite dev server
        'http://127.0.0.1:5173'  // Alternative localhost format
    ],
    credentials: true, // Crucial for sending/receiving HTTP-Only Cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// --- DB CONNECTION & ROUTES ---
connectDB(); // Await is not necessary here if you don't await the connection result

// Routes (Assuming your authRoutes points to the correct router containing /register, /login, /profile)
app.use("/api/auth", authRoutes); // <--- Changed to /api/auth prefix for clarity
app.use("/api", forecastRoutes);
app.use('/api', optimizeRouter);
app.use("/api", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});