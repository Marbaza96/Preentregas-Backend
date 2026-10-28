import AppError from "./AppError.js";

export const ensureFound = (resource, message) => {
    if (!resource) {
        throw new AppError(message, 404);
    }

    return resource;
};