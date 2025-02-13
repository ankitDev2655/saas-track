import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes"; // Import the centralized routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Security headers
app.use(compression()); // Compress response bodies
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // HTTP request logger

// Rate limiter to prevent abuse (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter); // Apply rate limiting

// Use centralized routes
app.use(routes);



export default app;
