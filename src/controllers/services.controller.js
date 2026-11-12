import ServicesService from "../services/services.service.js";
import AppError from "../utils/AppError.js";
import { ensureFound } from "../utils/notFound.js";
import {
    emitServiceCreated,
    emitServiceUpdated,
    emitServiceDeleted
} from "../events/service.events.js";

const servicesService = new ServicesService();

// Obtener servicios con filtros, paginación y ordenamiento
export const getServices = async (req, res, next) => {
    try {
        const {
            category,
            available,
            page = "1",
            limit = "10",
            sortBy = "price",
            order = "asc"
        } = req.query;

        // Validar disponibilidad
        if (
            available !== undefined &&
            available !== "true" &&
            available !== "false"
        ) {
            throw new AppError(
                "El filtro available debe ser true o false",
                400
            );
        }

        // Validar paginación
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isSafeInteger(pageNumber) ||
            pageNumber < 1 ||
            !Number.isSafeInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            throw new AppError(
                "page debe ser un entero positivo y limit debe estar entre 1 y 100",
                400
            );
        }

        // Validar ordenamiento
        const allowedSortFields = [
            "name",
            "duration",
            "price",
            "category"
        ];

        if (!allowedSortFields.includes(sortBy)) {
            throw new AppError(
                "El campo sortBy no es válido",
                400
            );
        }

        if (!["asc", "desc"].includes(order)) {
            throw new AppError(
                "order debe ser asc o desc",
                400
            );
        }

        // Consultar MongoDB
        const result = await servicesService.getPaginatedServices({
            category,
            available: available === undefined
                ? undefined
                : available === "true",
            page: pageNumber,
            limit: limitNumber,
            sortBy,
            order
        });

        // Construir enlaces conservando los filtros
        const buildLink = (targetPage) => {
            const params = new URLSearchParams();

            if (category) params.set("category", category);
            if (available !== undefined) {
                params.set("available", available);
            }

            params.set("page", String(targetPage));
            params.set("limit", String(limitNumber));
            params.set("sortBy", sortBy);
            params.set("order", order);

            return `/api/services?${params.toString()}`;
        };

        res.status(200).json({
            ...result,
            prevLink: result.hasPrevPage
                ? buildLink(result.prevPage)
                : null,
            nextLink: result.hasNextPage
                ? buildLink(result.nextPage)
                : null
        });

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

        emitServiceCreated(createdService);

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

        emitServiceUpdated(updatedService);

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

        emitServiceDeleted(deletedService);

        res.status(200).json(deletedService);

    } catch (error) {
        next(error);
    }
};