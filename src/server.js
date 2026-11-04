
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setSocketIO } from "./config/socket.config.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

setSocketIO(io);

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

const startServer = async () => {
    await connectDB();

    httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();
