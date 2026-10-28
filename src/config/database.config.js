
import mongoose from "mongoose";
import dns from "node:dns";
import { MONGO_URI } from "./env.config.js";

export const connectDB = async () => {
    try {

        // Usar un DNS alternativo solo si está configurado en .env,
        // para resolver posibles problemas de conexión con MongoDB Atlas.
        if (process.env.DNS_SERVER) {
            dns.setServers([process.env.DNS_SERVER]);
        }

        await mongoose.connect(MONGO_URI);
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};
