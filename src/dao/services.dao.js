
import ServiceModel from "./models/service.model.js";
import ServicesRepository from "../repositories/services.repository.js";

class ServicesDAO extends ServicesRepository {


    // Obtener servicios con filtros opcionales
    async getAll(category, available) {
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (available !== undefined) {
            filter.available = available;
        }

        return await ServiceModel.find(filter).lean();
    }


    // Obtener servicios con filtros, paginación y ordenamiento
    async getPaginated({
        category,
        available,
        page = 1,
        limit = 10,
        sortBy = "price",
        order = "asc"
    }) {
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (available !== undefined) {
            filter.available = available;
        }

        const skip = (page - 1) * limit;
        const sortDirection = order === "desc" ? -1 : 1;

        const [services, totalDocs] = await Promise.all([
            ServiceModel.find(filter)
                .sort({ [sortBy]: sortDirection, _id: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ServiceModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalDocs / limit);

        return {
            status: "success",
            payload: services,
            totalDocs,
            totalPages,
            page,
            limit,
            hasPrevPage: page > 1 && page <= totalPages,
            hasNextPage: page < totalPages,
            prevPage: page > 1 && page <= totalPages ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        };
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
