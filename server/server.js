// server.js (UPDATED)
import express from "express";
import { connectDB } from "./config/db.js";
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";
import forecastRoutes from "./routes/forecastRoutes.js"
import optimizeRouter from "./routes/optimize.js"
import userRoute from "./routes/user.js";
import supplierRoutes from "./routes/suppliers.js";

dotenv.config(); 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: [
        process.env.CLIENT_URL, 
        'http://localhost:5173', 
        'http://127.0.0.1:5173' 
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// DB CONNECTION & ROUTES
connectDB();

app.use("/api/auth", authRoutes); 
app.use("/api", forecastRoutes);
app.use('/api', optimizeRouter);
app.use("/api", userRoute);
app.use('/api', supplierRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});