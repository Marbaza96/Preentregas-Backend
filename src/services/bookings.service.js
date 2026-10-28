import BookingsRepository from "../repositories/bookings.repository.js";
import validateBooking, { filterAllowedBookingFields } from "../validators/bookings.validator.js";
import ServicesRepository from "../repositories/services.repository.js";
import AppError from "../utils/AppError.js";

class BookingsService {
    constructor() {
        this.repository = new BookingsRepository();
        this.servicesRepository = new ServicesRepository();
    }

    // Verificar que los servicios referenciados existan
    async validateExistingServices(services) {
        if (!services) return;

        for (const item of services) {
            const existingService =
                await this.servicesRepository.getById(item.service);

            if (!existingService) {
                throw new AppError("Servicio no encontrado", 404);
            }
        }
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

        const newBooking = filterAllowedBookingFields(bookingData);

        await this.validateExistingServices(newBooking.services);

        return await this.repository.create(newBooking);
    }


    // Actualizar una reserva existente
    async updateBooking(id, updatedData) {

        validateBooking(updatedData, true);

        const filteredData = filterAllowedBookingFields(updatedData);

        await this.validateExistingServices(filteredData.services);

        return await this.repository.update(id, filteredData);
    }

    // Eliminar una reserva por ID
    async deleteBooking(id) {
        return await this.repository.delete(id);
    }

    // Agregar un servicio a una reserva ya existente

    async addServiceToBooking(bookingId, serviceId) {
        const booking = await this.repository.getById(bookingId);

        if (!booking) {
            return null;
        }

        const existingCatalogService =
            await this.servicesRepository.getById(serviceId);

        if (!existingCatalogService) {
            throw new AppError("Servicio no encontrado", 404);
        }

        const existingService = booking.services.find(
            item => String(item.service) === String(existingCatalogService._id)
        );

        if (existingService) {
            existingService.quantity += 1;
        } else {
            booking.services.push({
                service: existingCatalogService._id,
                quantity: 1
            });
        }

        return await this.repository.update(bookingId, {
            services: booking.services
        });
    }
}

export default BookingsService;