import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import boardRoutes from "./routes/board.js";
import listRoutes from "./routes/list.js";
import cardRoutes from "./routes/card.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-u5xf.vercel.app",          // <-- add your frontend domain here!
  "https://mern-nine-mu.vercel.app"        // <-- backend domain for direct API calls, if needed
];

// CORS Middleware - only one instance
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow requests like curl or Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from this Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

// Global error handler (if any)
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});


// Enable mongoose debug logging
mongoose.set('debug', true);

// Connect to MongoDB & start the server with error handling
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true, // set false in production for security
    });
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    if (err.reason && err.reason.type) {
      console.error("Reason type:", err.reason.type);
    }
    if (err.code) {
      console.error("Error code:", err.code);
    }
    process.exit(1);
  }
};

connectDb();
