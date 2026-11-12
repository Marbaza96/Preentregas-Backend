
import { getSocketIO } from "../config/socket.config.js";

// Notificar la creación de un servicio
export const emitServiceCreated = (service) => {
    const io = getSocketIO();

    if (io) {
        io.emit("serviceCreated", service);
    }
};

// Notificar la actualización de un servicio
export const emitServiceUpdated = (service) => {
    const io = getSocketIO();

    if (io) {
        io.emit("serviceUpdated", service);
    }
};

// Notificar la eliminación de un servicio
export const emitServiceDeleted = (service) => {
    const io = getSocketIO();

    if (io) {
        io.emit("serviceDeleted", service);
    }
};
