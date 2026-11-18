import ServicesDAO from "../dao/services.dao.js";
import validateService, { filterAllowedFields } from "../validators/services.validator.js";
import AppError from "../utils/AppError.js";
import BookingsDAO from "../dao/bookings.dao.js";


class ServicesService {
    constructor() {
        this.repository = new ServicesDAO();
        this.bookingsRepository = new BookingsDAO();
    }


    // Obtener servicios con filtros opcionales
    async getServices(category, available) {
        return await this.repository.getAll(category, available);
    }

    // Obtener servicios con filtros, paginación y ordenamiento
    async getPaginatedServices(filters) {
        return await this.repository.getPaginated(filters);
    }

    // Obtener un servicio por su ID
    async getServiceById(id) {
        return await this.repository.getById(id);
    }

    // Crear un nuevo servicio

    async addService(serviceData) {
        validateService(serviceData);

        const newService = filterAllowedFields(serviceData);

        return await this.repository.create(newService);
    }

    // Actualizar un servicio existente
    async updateService(id, updatedData) {
        validateService(updatedData, true);

        const filteredData = filterAllowedFields(updatedData);

        // Evitar actualizaciones sin campos permitidos
        if (Object.keys(filteredData).length === 0) {
            throw new AppError(
                "Debe proporcionar al menos un campo válido para actualizar",
                400
            );
        }

        // Proteger la duración de servicios con reservas confirmadas
        if (filteredData.duration !== undefined) {
            const currentService = await this.repository.getById(id);

            if (currentService && currentService.duration !== filteredData.duration) {
                const hasConfirmedBookings =
                    await this.bookingsRepository.hasConfirmedBookingsForService(id);

                if (hasConfirmedBookings) {
                    throw new AppError(
                        "No se puede modificar la duración de un servicio con reservas confirmadas",
                        409
                    );
                }
            }
        }

        return await this.repository.update(id, filteredData);
    }

    // Eliminar un servicio existente
    async deleteService(id) {
        const hasBookings =
            await this.bookingsRepository.hasBookingsForService(id);

        if (hasBookings) {
            throw new AppError(
                "No se puede eliminar un servicio asociado a reservas existentes",
                409
            );
        }

        return await this.repository.delete(id);
    }


}

export default ServicesService;