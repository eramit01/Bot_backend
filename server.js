import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import spaRoutes from "./routes/spas.js";
import leadRoutes from "./routes/leads.js";
import authRoutes from "./routes/auth.js";
import { ensureDefaultAdmin } from "./utils/seedAdmin.js";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// Add localhost origins for development
const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:4173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:3000",
];

// Combine allowed origins with dev origins, remove duplicates
const allAllowedOrigins = allowedOrigins.includes("*")
  ? ["*"]
  : [...new Set([...allowedOrigins, ...devOrigins])];

console.log("Allowed CORS origins:", allAllowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allAllowedOrigins.includes("*")) {
        return callback(null, true);
      }
      
      if (allAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allAllowedOrigins.join(", ")}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/spas", spaRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/spa-bot";

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(async () => {
    console.log("MongoDB connected");
    await ensureDefaultAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Mongo connection error", error);
    process.exit(1);
  });

