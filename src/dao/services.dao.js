
import ServiceModel from "./models/service.model.js";

class ServicesDAO {

    // Obtener todos los servicios
    async getAll() {
        return await ServiceModel.find().lean();
    }

    // Obtener un servicio por ID
    async getById(id) {
        return await ServiceModel.findById(id).lean();
    }

    // Crear un nuevo servicio
    async create(service) {
        return await ServiceModel.create(service);
    }

    // Actualizar un servicio existente
    async update(id, updatedService) {
        return await ServiceModel.findByIdAndUpdate(
            id,
            updatedService,
            {
                new: true,
                runValidators: true
            }
        ).lean();
    }

    // Eliminar un servicio por ID
    async delete(id) {
        return await ServiceModel.findByIdAndDelete(id).lean();
    }
}

export default ServicesDAO;
