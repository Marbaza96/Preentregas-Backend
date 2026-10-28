import BookingsService from "../services/bookings.service.js";
import { ensureFound } from "../utils/notFound.js";

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
        const bookingId = req.params.bid;

        const booking = await bookingsService.getBookingById(bookingId);

        ensureFound(booking, "Reserva no encontrada");

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
        const bookingId = req.params.bid;
        const serviceId = req.params.sid;

        const updatedBooking = await bookingsService.addServiceToBooking(
            bookingId,
            serviceId
        );

        ensureFound(updatedBooking, "Reserva no encontrada");

        res.status(200).json(updatedBooking);

    } catch (error) {
        next(error);
    }
};


// Actualizar una reserva
export const updateBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.bid;

        const updatedBooking = await bookingsService.updateBooking(
            bookingId,
            req.body
        );

        ensureFound(updatedBooking, "Reserva no encontrada");

        res.status(200).json(updatedBooking);

    } catch (error) {
        next(error);
    }
};

// Eliminar una reserva
export const deleteBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.bid;

        const deletedBooking = await bookingsService.deleteBooking(bookingId);

        ensureFound(deletedBooking, "Reserva no encontrada");

        res.status(200).json(deletedBooking);

    } catch (error) {
        next(error);
    }
};