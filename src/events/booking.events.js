
import { getSocketIO } from "../config/socket.config.js";

// Notificar a los clientes cuando se crea una reserva
export const emitBookingCreated = (booking) => {
    const io = getSocketIO();

    if (io) {
        io.emit("bookingCreated", booking);
    }
};
