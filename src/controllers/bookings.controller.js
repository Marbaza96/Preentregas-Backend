import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

// Obtener todas las reservas
export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingManager.getBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una reserva por ID
export const getBookingById = async (req, res) => {
    try {
        const { bid } = req.params;
        const numericId = Number(bid);
        const booking = await bookingManager.getBookingById(numericId);

        if (!booking) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva reserva
export const createBooking = async (req, res) => {
    try {
        const createdBooking = await bookingManager.createBooking(req.body);
        res.status(201).json(createdBooking);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Agregar un servicio a una reserva
export const addServiceToBooking = async (req, res) => {
    try {
        const { bid, sid } = req.params;
        const numericBookingId = Number(bid);
        const numericServiceId = Number(sid);

        const service = await serviceManager.getServiceById(numericServiceId);

        if (!service) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        const updatedBooking = await bookingManager.addServiceToBooking(numericBookingId, service);

        res.status(200).json(updatedBooking);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Actualizar una reserva
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const updatedBooking = await bookingManager.updateBooking(numericId, req.body);

        res.status(200).json(updatedBooking);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Eliminar una reserva
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const deletedBooking = await bookingManager.deleteBooking(numericId);

        res.status(200).json(deletedBooking);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};