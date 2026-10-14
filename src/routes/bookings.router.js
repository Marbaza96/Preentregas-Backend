import { Router } from "express";
import { getBookings, getBookingById, createBooking, addServiceToBooking, updateBooking, deleteBooking } from "../controllers/bookings.controller.js";

const router = Router();

// Obtener todas las reservas
router.get("/", getBookings);

// Obtener una reserva por ID
router.get("/:bid", getBookingById);

// Crear una nueva reserva
router.post("/", createBooking);

// Agregar un servicio a una reserva
router.post("/:bid/services/:sid", addServiceToBooking);

// Actualizar una reserva
router.put("/:id", updateBooking);

// Eliminar una reserva
router.delete("/:id", deleteBooking);


export default router;
