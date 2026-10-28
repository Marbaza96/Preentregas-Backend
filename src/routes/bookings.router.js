import { Router } from "express";
import { getBookings, getBookingById, createBooking, addServiceToBooking, updateBooking, deleteBooking } from "../controllers/bookings.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

// Obtener todas las reservas
router.get("/", getBookings);

// Obtener una reserva por ID
router.get("/:bid", validateObjectId("bid"), getBookingById);

// Crear una nueva reserva
router.post("/", createBooking);

// Agregar un servicio a una reserva
router.post("/:bid/services/:sid", validateObjectId("bid", "sid"), addServiceToBooking);

// Actualizar una reserva
router.put("/:bid", validateObjectId("bid"), updateBooking);

// Eliminar una reserva
router.delete("/:bid", validateObjectId("bid"), deleteBooking);


export default router;
