import { Router } from "express";
import { getBookings, getBookingById, createBooking, addServiceToBooking, updateBooking, deleteBooking } from "../controllers/bookings.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { validateAddServiceParams } from "../validators/bookings.validator.js";

const router = Router();

// Obtener todas las reservas
router.get("/", getBookings);

// Obtener una reserva por ID
router.get("/:bid", validateObjectId("bid"), getBookingById);

// Crear una nueva reserva
router.post("/", createBooking);

// Agregar un servicio a una reserva
router.post(
    "/:bid/services/:sid",
    (req, res, next) => {
        try {
            validateAddServiceParams(req.params);
            next();
        } catch (error) {
            next(error);
        }
    },
    addServiceToBooking
);

// Actualizar una reserva
router.put("/:bid", validateObjectId("bid"), updateBooking);

// Eliminar una reserva
router.delete("/:bid", validateObjectId("bid"), deleteBooking);


export default router;
