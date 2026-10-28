import AppError from "../utils/AppError.js";

// Validar los datos de un servicio
function validateService(serviceData, isUpdate = false) {

    if (
        !serviceData ||
        typeof serviceData !== "object" ||
        Array.isArray(serviceData)
    ) {
        throw new AppError("Los datos del servicio deben ser un objeto válido", 400);
    }

    const {
        name,
        description,
        duration,
        price,
        category,
        available
    } = serviceData;

    if (
        !isUpdate && (
            !name ||
            !description ||
            duration === undefined ||
            price === undefined ||
            !category ||
            available === undefined
        )
    ) {
        throw new AppError("Todos los campos del servicio son obligatorios", 400);
    }

    if (
        (name !== undefined && (typeof name !== "string" || !name.trim())) ||
        (description !== undefined && (typeof description !== "string" || !description.trim())) ||
        (duration !== undefined && (typeof duration !== "number" || !Number.isFinite(duration) || duration < 1)) ||
        (price !== undefined && (typeof price !== "number" || !Number.isFinite(price) || price < 0)) ||
        (category !== undefined && (typeof category !== "string" || !category.trim())) ||
        (available !== undefined && typeof available !== "boolean")
    ) {
        throw new AppError("Los datos del servicio contienen valores inválidos", 400);
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