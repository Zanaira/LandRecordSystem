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

const allowedOrigins = [
  "http://localhost:3000",
  "https://land-record-system.vercel.app",
  "https://land-record-system-23axwu0ok-zanairas-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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

