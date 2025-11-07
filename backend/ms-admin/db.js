import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { 
    host: process.env.DB_HOST, 
    dialect: "mysql",
    logging: false,
  }
);

// wrap authenticate in async function
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

export default sequelize;
