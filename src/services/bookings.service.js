import BookingsRepository from "../repositories/bookings.repository.js";
import validateBooking, { filterAllowedBookingFields } from "../validators/bookings.validator.js";
import ServicesRepository from "../repositories/services.repository.js";
import AppError from "../utils/AppError.js";

class BookingsService {
    constructor() {
        this.repository = new BookingsRepository();
        this.servicesRepository = new ServicesRepository();
    }

    // Obtener todas las reservas
    async getBookings() {
        return await this.repository.getAll();
    }

    // Obtener una reserva por su ID
    async getBookingById(id) {
        return await this.repository.getById(id);
    }

    // Crear una nueva reserva
    async createBooking(bookingData) {
        validateBooking(bookingData);

        const bookings = await this.repository.getAll();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => Number(booking.id))) + 1
            : 1;

        const newBooking = {
            id: newId,
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            date: bookingData.date,
            time: bookingData.time,
            status: bookingData.status,
            services: bookingData.services ?? []
        };

        return await this.repository.create(newBooking);
    }

    // Actualizar una reserva existente
    async updateBooking(id, updatedData) {
        const existingBooking = await this.repository.getById(id);

        if (!existingBooking) {
            return null;
        }

        validateBooking(updatedData, true);

        const filteredData = filterAllowedBookingFields(updatedData);

        return await this.repository.update(id, filteredData);
    }

    // Eliminar una reserva por ID
    async deleteBooking(id) {
        return await this.repository.delete(id);
    }

    // Agregar un servicio a una reserva ya existente
    async addServiceToBooking(bookingId, service) {
        const booking = await this.repository.getById(bookingId);

        if (!booking) {
            return null;
        }

        const existingCatalogService = await this.servicesRepository.getById(service.id);

        if (!existingCatalogService) {
            throw new AppError("Servicio no encontrado", 404);
        }

        const existingService = booking.services.find(
            item => item.service === service.id
        );

        if (existingService) {
            existingService.quantity += 1;
        } else {
            booking.services.push({
                service: service.id,
                quantity: 1
            });
        }

        return await this.repository.update(bookingId, {
            services: booking.services
        });
    }
}

export default BookingsService;