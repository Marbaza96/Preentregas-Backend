import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

// Validar identificadores de MongoDB
export const validateId = (id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        throw new AppError("ID inválido", 400);
    }

    return id;
};