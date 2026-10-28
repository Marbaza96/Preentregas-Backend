
import BookingModel from "./models/booking.model.js";

class BookingsDAO {

    // Obtener todas las reservas
    async getAll() {
        return await BookingModel.find().lean();
    }

    // Obtener una reserva por ID
    async getById(id) {
        return await BookingModel.findById(id).lean();
    }

    // Crear una nueva reserva
    async create(booking) {
        return await BookingModel.create(booking);
    }

    // Actualizar una reserva existente
    async update(id, updatedBooking) {
        return await BookingModel.findByIdAndUpdate(
            id,
            updatedBooking,
            {
                new: true,
                runValidators: true
            }
        ).lean();
    }

    // Eliminar una reserva por ID
    async delete(id) {
        return await BookingModel.findByIdAndDelete(id).lean();
    }
}

export default BookingsDAO;
