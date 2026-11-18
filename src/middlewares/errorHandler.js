// Middleware global para manejar errores
function errorHandler(error, req, res, next) {

    let statusCode = error.statusCode || 500;
    let message = error.message;

    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Los datos proporcionados no son válidos";
    }

    // Errores de conversión de tipos de Mongoose
    if (error.name === "CastError") {
        statusCode = 400;
        message = "El formato de los datos es inválido";
    }

    // Errores de clave duplicada de MongoDB
    if (error.code === 11000) {
        statusCode = 409;
        message = "Ya existe un registro con esos datos";
    }

    // Evitar detalles internos del servidor
    if (statusCode === 500) {
        message = "Error interno del servidor";
    }

    // Registrar errores internos
    if (statusCode >= 500) {
        console.error("ERROR DETECTADO:", error);
    }

    res.status(statusCode).json({
        error: message
    });
}

export default errorHandler;