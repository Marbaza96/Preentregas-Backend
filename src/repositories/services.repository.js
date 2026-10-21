import ServicesDAO from "../dao/services.dao.js";

class ServicesRepository {
    constructor() {
        this.dao = new ServicesDAO();
    }

    // Obtener todos los servicios
    async getAll() {
        return await this.dao.getAll();
    }

    // Obtener un servicio por ID
    async getById(id) {
        return await this.dao.getById(id);
    }

    // Crear un nuevo servicio
    async create(service) {
        return await this.dao.create(service);
    }

    // Actualizar un servicio existente
    async update(id, updatedService) {
        return await this.dao.update(id, updatedService);
    }

    // Eliminar un servicio por ID
    async delete(id) {
        return await this.dao.delete(id);
    }

}

export default ServicesRepository;