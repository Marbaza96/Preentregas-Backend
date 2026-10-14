import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

// Obtener todos los servicios con filtros opcionales
export const getServices = async (req, res) => {
    try {
        const { category, available } = req.query;

        const availableBoolean = available !== undefined
            ? available === "true"
            : undefined;

        const services = await serviceManager.getServices(category, availableBoolean);

        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un servicio por ID
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const service = await serviceManager.getServiceById(numericId);

        if (!service) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        res.status(200).json(service);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar un nuevo servicio
export const createService = async (req, res) => {
    try {
        const createdService = await serviceManager.addService(req.body);

        res.status(201).json(createdService);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Actualizar un servicio existente
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const updatedService = await serviceManager.updateService(numericId, req.body);

        if (!updatedService) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        res.status(200).json(updatedService);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Eliminar un servicio por ID
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const deletedService = await serviceManager.deleteService(numericId);

        if (!deletedService) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        res.status(200).json(deletedService);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};