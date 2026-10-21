import BookingsService from "../services/bookings.service.js";
import { validateId } from "../validators/id.validator.js";

const bookingsService = new BookingsService();

// Obtener todas las reservas
export const getBookings = async (req, res, next) => {
    try {
        const bookings = await bookingsService.getBookings();

        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

// Obtener una reserva por ID
export const getBookingById = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.bid);

        const booking = await bookingsService.getBookingById(numericId);

        if (!booking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        next(error);
    }
};

// Crear una nueva reserva
export const createBooking = async (req, res, next) => {
    try {
        const createdBooking = await bookingsService.createBooking(req.body);

        res.status(201).json(createdBooking);

    } catch (error) {
        next(error);
    }
};

// Agregar un servicio a una reserva
export const addServiceToBooking = async (req, res, next) => {
    try {
        const numericBookingId = validateId(req.params.bid);
        const numericServiceId = validateId(req.params.sid);

        const updatedBooking = await bookingsService.addServiceToBooking(
            numericBookingId,
            { id: numericServiceId }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(updatedBooking);

    } catch (error) {
        next(error);
    }
};

// Actualizar una reserva
export const updateBooking = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.bid);

        const updatedBooking = await bookingsService.updateBooking(
            numericId,
            req.body
        );

        if (!updatedBooking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(updatedBooking);

    } catch (error) {
        next(error);
    }
};

// Eliminar una reserva
export const deleteBooking = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.bid);

        const deletedBooking = await bookingsService.deleteBooking(numericId);

        if (!deletedBooking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(deletedBooking);

    } catch (error) {
        next(error);
    }
};