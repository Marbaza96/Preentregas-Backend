import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Falta configurar MONGO_URI en el archivo .env");
}

export { PORT, NODE_ENV, MONGO_URI };