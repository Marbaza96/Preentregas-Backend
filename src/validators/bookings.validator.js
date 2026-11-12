import { z } from "zod";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";


// Formatos permitidos para fecha y hora
const dateSchema = z.iso.date();

const timeSchema = z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "La hora debe tener el formato HH:mm"
);

// Estados permitidos
const statusSchema = z.enum([
    "pendiente",
    "confirmada",
    "cancelada"
]);

// Esquema de validación de los servicios asociados
const bookingServiceSchema = z.object({
    service: z.string().refine(
        (id) => mongoose.isObjectIdOrHexString(id),
        { message: "ID de servicio inválido" }
    ),
    quantity: z.number().int().min(1)
});


// Validar los identificadores al agregar un servicio a una reserva
const addServiceParamsSchema = z.object({
    bid: z.string().refine(
        (id) => mongoose.isObjectIdOrHexString(id),
        { message: "ID de reserva inválido" }
    ),
    sid: z.string().refine(
        (id) => mongoose.isObjectIdOrHexString(id),
        { message: "ID de servicio inválido" }
    )
});

export function validateAddServiceParams(params) {
    const result = addServiceParamsSchema.safeParse(params);

    if (!result.success) {
        const errors = result.error.issues.map((issue) => {
            const field = issue.path.join(".") || "datos";
            return `${field}: ${issue.message}`;
        });

        throw new AppError(
            `Datos inválidos: ${errors.join("; ")}`,
            400
        );
    }
}


// Esquema de validación de reservas
const bookingSchema = z.object({
    clientName: z.string().trim().min(1),
    clientEmail: z.email(),
    date: dateSchema,
    time: timeSchema,
    status: statusSchema,
    services: z.array(bookingServiceSchema).optional()
});

// Validar los datos de una reserva
function validateBooking(bookingData, isUpdate = false) {
    const schema = isUpdate
        ? bookingSchema.partial()
        : bookingSchema;

    const result = schema.safeParse(bookingData);

    if (!result.success) {
        const errors = result.error.issues.map((issue) => {
            const field = issue.path.join(".") || "datos";
            return `${field}: ${issue.message}`;
        });

        throw new AppError(
            `Datos inválidos: ${errors.join("; ")}`,
            400
        );
    }
}


// Conservar únicamente los campos permitidos
export function filterAllowedBookingFields(data) {
    const allowedFields = [
        "clientName",
        "clientEmail",
        "date",
        "time",
        "status",
        "services"
    ];

    return Object.fromEntries(
        Object.entries(data).filter(
            ([key]) => allowedFields.includes(key)
        )
    );
}

export default validateBooking;
