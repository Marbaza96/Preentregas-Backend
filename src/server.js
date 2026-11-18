
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setSocketIO } from "./config/socket.config.js";
import BookingsService from "./services/bookings.service.js";
import { emitBookingCreated } from "./events/booking.events.js";
import BookingSlotModel from "./dao/models/bookingSlot.model.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

setSocketIO(io);

const bookingsService = new BookingsService();

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Recibir solicitudes de creación de reservas
    socket.on("createBooking", async (bookingData, callback) => {
        try {
            const createdBooking = await bookingsService.createBooking(bookingData);

            // Notificar a todos los clientes conectados
            emitBookingCreated(createdBooking);

            // Confirmar el resultado al cliente que envió la solicitud
            if (typeof callback === "function") {
                callback({
                    status: "success",
                    booking: createdBooking
                });
            }

        } catch (error) {

            if (!error.statusCode || error.statusCode >= 500) {
                console.error("Error al crear reserva mediante Socket.IO:", error);
            }

            if (typeof callback === "function") {
                callback({
                    status: "error",
                    message: error.statusCode >= 400 && error.statusCode < 500
                        ? error.message
                        : "No se pudo crear la reserva"
                });
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

const startServer = async () => {
    await connectDB();

    // Verificar que los índices de bloques horarios estén creados
    try {
        await BookingSlotModel.init();
        console.log("Índices de bloques horarios inicializados");
    } catch (error) {
        console.error(
            "Error al inicializar los índices de bloques horarios:",
            error
        );
        process.exit(1);
    }

    httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
});
