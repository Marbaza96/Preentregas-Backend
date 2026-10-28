// Middleware global para manejar errores
function errorHandler(error, req, res, next) {
    console.error("ERROR DETECTADO:", error);

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

    // Evitar detalles internos del servidor
    if (statusCode === 500) {
        message = "Error interno del servidor";
    }

    res.status(statusCode).json({
        error: message
    });
}

export default errorHandler;