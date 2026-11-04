import { Router } from "express";
import {
    renderServices,
    renderAvailability
} from "../controllers/views.controller.js";

const router = Router();

// Vista del catálogo de servicios
router.get("/services", renderServices);

// Vista de reservas registradas
router.get("/availability", renderAvailability);

export default router;