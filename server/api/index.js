import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes with relative paths adjusted for this location
import authRoutes from "../../routes/auth.js";
import boardRoutes from "../../routes/board.js";
import listRoutes from "../../routes/list.js";
import cardRoutes from "../../routes/card.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-u5xf.vercel.app", 
  "https://mern-u5xf-80erz50ik-sakshis-projects-c4d1ceb4.vercel.app",
  "https://mern-nine-mu.vercel.app",
  "https://mern-u5xf-d0bsedn7y-sakshis-projects-c4d1ceb4.vercel.app",
  "https://mern-u5xf-dxk29qgll-sakshis-projects-c4d1ceb4.vercel.app",
];

// CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman etc.
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

// Enable mongoose debug logging
mongoose.set('debug', true);

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Connect to DB before export
await connectDb();

export default app;
