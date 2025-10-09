// backend/server.js

import express from "express";
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import optimizeRouter from "./routes/optimize.js";
import supplierRoutes from "./routes/suppliers.js"; // <-- ADD THIS IMPORT
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions)); 

// DB CONNECTION
connectDB();

// --- REGISTER ALL ROUTES ---
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api", forecastRoutes);
app.use("/api", optimizeRouter);
app.use("/api", supplierRoutes); // <-- ADD THIS LINE TO USE THE ROUTE

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
