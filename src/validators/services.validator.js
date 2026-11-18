
import { z } from "zod";
import AppError from "../utils/AppError.js";

// Esquema de validación de servicios
const serviceSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    duration: z.number().int().min(1),
    price: z.number().min(0),
    category: z.string().trim().min(1),
        available: z.boolean()
}).strict();

// Validar los datos de un servicio
function validateService(serviceData, isUpdate = false) {
    const schema = isUpdate
        ? serviceSchema.partial()
        : serviceSchema;

    const result = schema.safeParse(serviceData);

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
function filterAllowedFields(data) {
    const allowedFields = [
        "name",
        "description",
        "duration",
        "price",
        "category",
        "available"
    ];

    return Object.fromEntries(
        Object.entries(data).filter(
            ([key]) => allowedFields.includes(key)
        )
    );
}

export default validateService;
export { filterAllowedFields };
