import ServicesRepository from "../repositories/services.repository.js";
import validateService, { filterAllowedFields } from "../validators/services.validator.js";

class ServicesService {
    constructor() {
        this.repository = new ServicesRepository();
    }

    // Obtener servicios con filtros opcionales
    async getServices(category, available) {
        let services = await this.repository.getAll();

        if (category) {
            services = services.filter(
                (service) => service.category === category
            );
        }

        if (available !== undefined) {
            services = services.filter(
                (service) => service.available === available
            );
        }

        return services;
    }

    // Obtener un servicio por su ID
    async getServiceById(id) {
        return await this.repository.getById(id);
    }

    // Crear un nuevo servicio
    async addService(serviceData) {
        validateService(serviceData);

        const services = await this.repository.getAll();

        const newId = services.length > 0
            ? Math.max(...services.map((service) => Number(service.id))) + 1
            : 1;

        const newService = {
            ...serviceData,
            id: newId
        };

        return await this.repository.create(newService);
    }

    // Actualizar un servicio existente
    async updateService(id, updatedData) {
        const existingService = await this.repository.getById(id);

        if (!existingService) {
            return null;
        }

        validateService(updatedData, true);

        const filteredData = filterAllowedFields(updatedData);

        return await this.repository.update(id, filteredData);
    }

    // Eliminar un servicio existente
    async deleteService(id) {
        return await this.repository.delete(id);
    }
}

export default ServicesService;