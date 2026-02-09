import dotenv from "dotenv";
dotenv.config(); 
console.log("JWT_SECRET =", process.env.JWT_SECRET);


import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
});
