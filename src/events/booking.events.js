
import { getSocketIO } from "../config/socket.config.js";

// Notificar a los clientes cuando se crea una reserva
export const emitBookingCreated = (booking) => {
    const io = getSocketIO();

    if (io) {
        io.emit("bookingCreated", booking);
    }
};

// Notificar a los clientes cuando se actualiza una reserva
export const emitBookingUpdated = (booking) => {
    const io = getSocketIO();

    if (io) {
        io.emit("bookingUpdated", booking);
    }
};

// Notificar a los clientes cuando se elimina una reserva
export const emitBookingDeleted = (bookingId) => {
    const io = getSocketIO();

    if (io) {
        io.emit("bookingDeleted", bookingId);
    }
};
