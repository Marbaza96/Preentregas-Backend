import AppError from "../utils/AppError.js";

// Validar los datos de una reserva
function validateBooking(bookingData, isUpdate = false) {

    const {
        clientName,
        clientEmail,
        date,
        time,
        status,
        services
    } = bookingData;

    if (
        !isUpdate && (
            !clientName ||
            !clientEmail ||
            !date ||
            !time ||
            !status
        )
    ) {
        throw new AppError(
            "Todos los campos obligatorios de la reserva deben completarse",
            400
        );
    }

    if (
        (clientName !== undefined &&
            (typeof clientName !== "string" || !clientName.trim())) ||
        (clientEmail !== undefined &&
            (typeof clientEmail !== "string" || !clientEmail.trim())) ||
        (date !== undefined &&
            (typeof date !== "string" || !date.trim())) ||
        (time !== undefined &&
            (typeof time !== "string" || !time.trim())) ||
        (status !== undefined &&
            (typeof status !== "string" || !status.trim()))
    ) {
        throw new AppError(
            "Los datos de la reserva contienen valores inválidos",
            400
        );
    }

    // Validar formato del correo electrónico
    if (
        clientEmail !== undefined &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)
    ) {
        throw new AppError(
            "El correo electrónico no tiene un formato válido",
            400
        );
    }

    // Validar que services sea un arreglo
    if (services !== undefined && !Array.isArray(services)) {
        throw new AppError(
            "Los servicios de la reserva deben ser un arreglo",
            400
        );
    }

    // Validar los elementos del arreglo de servicios
    if (Array.isArray(services)) {
        for (const item of services) {
            if (
                !item ||
                typeof item !== "object" ||
                Array.isArray(item) ||
                !Number.isInteger(item.service) ||
                item.service <= 0 ||
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
            ) {
                throw new AppError(
                    "Los servicios de la reserva contienen datos inválidos",
                    400
                );
            }
        }
    }

}

// Filtrar los campos permitidos de una reserva
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
        Object.entries(data).filter(([key]) =>
            allowedFields.includes(key)
        )
    );
}

export default validateBooking;