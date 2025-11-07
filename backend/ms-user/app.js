import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import crudRoutes from "./routes/route.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/api", crudRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
