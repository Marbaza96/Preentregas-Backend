import ServicesService from "../services/services.service.js";
import AppError from "../utils/AppError.js";
import { ensureFound } from "../utils/notFound.js";

const servicesService = new ServicesService();

// Obtener todos los servicios con filtros opcionales
export const getServices = async (req, res, next) => {
    try {
        const { category, available } = req.query;

        if (
            available !== undefined &&
            available !== "true" &&
            available !== "false"
        ) {
            throw new AppError("El filtro available debe ser true o false", 400);
        }

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
        const id = req.params.id;

        const service = await servicesService.getServiceById(id);

        ensureFound(service, "Servicio no encontrado");

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
        const id = req.params.id;

        const updatedService = await servicesService.updateService(
            id,
            req.body
        );

        ensureFound(updatedService, "Servicio no encontrado");

        res.status(200).json(updatedService);

    } catch (error) {
        next(error);
    }
};

// Eliminar un servicio por ID
export const deleteService = async (req, res, next) => {
    try {
        const id = req.params.id;

        const deletedService = await servicesService.deleteService(id);

        ensureFound(deletedService, "Servicio no encontrado");

        res.status(200).json(deletedService);

    } catch (error) {
        next(error);
    }
};