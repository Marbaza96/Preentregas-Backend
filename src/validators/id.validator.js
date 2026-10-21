import AppError from "../utils/AppError.js";

export const validateId = (id) => {
    const numericId = Number(id);

    if (!Number.isSafeInteger(numericId) || numericId <= 0) {
        throw new AppError("El ID debe ser un número entero positivo", 400);
    }

    return numericId;
};