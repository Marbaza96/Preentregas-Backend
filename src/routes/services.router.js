import { Router } from "express";
import { getServices, getServiceById, createService, updateService, deleteService } from "../controllers/services.controller.js";

const router = Router();

// Obtener todos los servicios con filtros opcionales
router.get("/", getServices);


// Servicio por ID
router.get("/:id", getServiceById);

// Agregar un nuevo servicio
router.post("/", createService);

// Actualizar un servicio existente
router.put("/:id", updateService);

// Eliminar un servicio por ID
router.delete("/:id", deleteService);

export default router;