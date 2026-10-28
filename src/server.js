
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();
