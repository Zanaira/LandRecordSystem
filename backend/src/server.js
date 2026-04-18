import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import landRecordRoutes from "./routes/landRecordRoutes.js";
import ownershipHistoryRoutes from "./routes/ownershipHistoryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import cookieParser from "cookie-parser";
import reportRoute from "./routes/reportRoute.js";

import { connectDB } from "./config/db.js";
import dotenv from "dotenv";


dotenv.config();
const app=express();
const PORT= process.env.PORT || 5001;
connectDB();
app.listen(PORT,()=>{
    console.log("Server has started on PORT:",PORT);
});

// Replace your existing CORS configuration with this
const allowedOrigins = [
  "http://localhost:3000",
  "https://land-record-system.vercel.app",
  "https://land-record-system-23axwu0ok-zanairas-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

app.use(express.json());  // For Read able data from frontend   (framWork)
// app.use(express.urlencoded({extended:true}));     // (Forms)

app.use("/api/user",userRoutes);
app.use("/api/dispute",disputeRoutes);
app.use("/api/landRecord",landRecordRoutes);
app.use("/api/owner",ownershipHistoryRoutes);
app.use("/api/document",documentRoutes);
app.use("/api/notification",notificationRoutes);
app.use("/api/report",reportRoute);

