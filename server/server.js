import express from "express";
import { connectDB } from "./config/db.js";
import cors from 'cors'; // Add this import
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000', // In case you serve frontend from same port
        'http://127.0.0.1:5173'  // Alternative localhost format
    ],
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const PORT = 3000;

await connectDB();

import authRoutes from "./routes/auth.js"
import dotenv from 'dotenv';
dotenv.config();




// Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
