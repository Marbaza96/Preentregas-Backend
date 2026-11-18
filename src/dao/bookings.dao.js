
import BookingModel from "./models/booking.model.js";
import BookingsRepository from "../repositories/bookings.repository.js";

class BookingsDAO extends BookingsRepository {

    // Obtener todas las reservas con sus servicios completos
    async getAll() {
        return await BookingModel.find()
            .populate("services.service", "name duration price category")
            .lean();
    }

    // Obtener reservas confirmadas de una fecha
    async getConfirmedBookingsByDate(date, session = null) {
        return await BookingModel.find({
            date,
            status: "confirmada"
        })
            .session(session)
            .lean();
    }

    // Comprobar si un servicio tiene reservas confirmadas
    async hasConfirmedBookingsForService(serviceId) {
        return await BookingModel.exists({
            status: "confirmada",
            "services.service": serviceId
        });
    }

    // Comprobar si un servicio está asociado a alguna reserva
    async hasBookingsForService(serviceId) {
        return await BookingModel.exists({
            "services.service": serviceId
        });
    }

    // Obtener una reserva por ID con sus servicios completos
    async getById(id) {
        return await BookingModel.findById(id)
            .populate("services.service")
            .lean();
    }

    // Obtener una reserva sin populate
    async getByIdWithoutPopulate(id, session = null) {
        return await BookingModel.findById(id)
            .session(session)
            .lean();
    }

    // Crear una nueva reserva
    async create(booking, session = null) {
        if (session) {
            const [createdBooking] = await BookingModel.create(
                [booking],
                { session }
            );

            return createdBooking;
        }

        return await BookingModel.create(booking);
    }

    // Actualizar una reserva existente
    async update(id, updatedBooking, session = null) {
        return await BookingModel.findByIdAndUpdate(
            id,
            updatedBooking,
            {
                new: true,
                runValidators: true,
                session
            }
        ).lean();
    }


    // Eliminar una reserva por ID 
    async delete(id, session = null) {
        return await BookingModel.findByIdAndDelete(id)
            .session(session)
            .lean();
    }

}

export default BookingsDAO;
