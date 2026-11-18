class BookingsRepository {

    async getAll() {
        throw new Error("Método getAll() no implementado");
    }

    async getById(id) {
        throw new Error("Método getById() no implementado");
    }

    async getConfirmedBookingsByDate(date, session = null) {
        throw new Error("Método getConfirmedBookingsByDate() no implementado");
    }

    async hasConfirmedBookingsForService(serviceId) {
        throw new Error("Método hasConfirmedBookingsForService() no implementado");
    }

    async hasBookingsForService(serviceId) {
        throw new Error("Método hasBookingsForService() no implementado");
    }

    async getByIdWithoutPopulate(id, session = null) {
        throw new Error("Método getByIdWithoutPopulate() no implementado");
    }

    async create(booking, session = null) {
        throw new Error("Método create() no implementado");
    }

    async update(id, updatedBooking, session = null) {
        throw new Error("Método update() no implementado");
    }

    async delete(id, session = null) {
        throw new Error("Método delete() no implementado");
    }
}

export default BookingsRepository;