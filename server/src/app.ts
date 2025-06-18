import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import listingRoutes from "./routes/listingRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentROutes from "./routes/paymentRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import dotenv from "dotenv";
import { env } from "./config/env";

// Load environment variables
dotenv.config();

const app = express();

// Webhook route must be registered BEFORE body parsing middleware
app.use("/api/webhook", webhookRoutes);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://stayfinder-eta.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 600
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentROutes);

// Connect to MongoDB
mongoose
  .connect(env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Error handling
app.use(errorHandler);

export default app; 