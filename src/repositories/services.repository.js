class ServicesRepository {


    async getAll(category, available) {
        throw new Error("Método getAll() no implementado");
    }

    async getPaginated(filters) {
        throw new Error("Método getPaginated() no implementado");
    }

    async getById(id) {
        throw new Error("Método getById() no implementado");
    }

    async create(service) {
        throw new Error("Método create() no implementado");
    }

    async update(id, updatedService) {
        throw new Error("Método update() no implementado");
    }

    async delete(id) {
        throw new Error("Método delete() no implementado");
    }
}

export default ServicesRepository;