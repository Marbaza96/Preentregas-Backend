import BookingsDAO from "../dao/bookings.dao.js";

class BookingsRepository {
    constructor() {
        this.dao = new BookingsDAO();
    }

    // Obtener todas las reservas
    async getAll() {
        return await this.dao.getAll();
    }

    // Obtener una reserva por ID
    async getById(id) {
        return await this.dao.getById(id);
    }

    // Crear una nueva reserva
    async create(booking) {
        return await this.dao.create(booking);
    }

    // Actualizar una reserva existente
    async update(id, updatedBooking) {
        return await this.dao.update(id, updatedBooking);
    }

    // Eliminar una reserva por su ID
    async delete(id) {
        return await this.dao.delete(id);
    }
}

export default BookingsRepository;