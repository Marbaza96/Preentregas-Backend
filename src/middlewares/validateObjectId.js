
import { validateId } from "../validators/id.validator.js";

export const validateObjectId = (...params) => {
    return (req, res, next) => {
        try {
            for (const param of params) {
                validateId(req.params[param]);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
