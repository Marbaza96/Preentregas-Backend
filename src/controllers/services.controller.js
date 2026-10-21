import ServicesService from "../services/services.service.js";
import { validateId } from "../validators/id.validator.js";

const servicesService = new ServicesService();

// Obtener todos los servicios con filtros opcionales
export const getServices = async (req, res, next) => {
    try {
        const { category, available } = req.query;

        const availableBoolean = available !== undefined
            ? available === "true"
            : undefined;

        const services = await servicesService.getServices(
            category,
            availableBoolean
        );

        res.status(200).json(services);

    } catch (error) {
        next(error);
    }
};

// Obtener un servicio por ID
export const getServiceById = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.id);

        const service = await servicesService.getServiceById(numericId);

        if (!service) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.status(200).json(service);

    } catch (error) {
        next(error);
    }
};

// Agregar un nuevo servicio
export const createService = async (req, res, next) => {
    try {
        const createdService = await servicesService.addService(req.body);

        res.status(201).json(createdService);

    } catch (error) {
        next(error);
    }
};

// Actualizar un servicio existente
export const updateService = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.id);

        const updatedService = await servicesService.updateService(
            numericId,
            req.body
        );

        if (!updatedService) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.status(200).json(updatedService);

    } catch (error) {
        next(error);
    }
};

// Eliminar un servicio por ID
export const deleteService = async (req, res, next) => {
    try {
        const numericId = validateId(req.params.id);

        const deletedService = await servicesService.deleteService(numericId);

        if (!deletedService) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.status(200).json(deletedService);

    } catch (error) {
        next(error);
    }
};