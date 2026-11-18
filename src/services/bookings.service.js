import BookingsDAO from "../dao/bookings.dao.js";
import ServicesDAO from "../dao/services.dao.js";
import validateBooking, { filterAllowedBookingFields } from "../validators/bookings.validator.js";
import AppError from "../utils/AppError.js";
import BookingSlotsDAO from "../dao/bookingSlots.dao.js";
import mongoose from "mongoose";

class BookingsService {
    constructor() {
        this.repository = new BookingsDAO();
        this.servicesRepository = new ServicesDAO();
        this.bookingSlotsRepository = new BookingSlotsDAO();
    }

    // Ejecutar operaciones de reservas dentro de una transacción
    async executeBookingTransaction(operation) {
        try {
            return await mongoose.connection.transaction(
                async (session) => {
                    return await operation(session);
                }
            );
        } catch (error) {
            // Un bloque horario ya está ocupado
            if (error.code === 11000) {
                throw new AppError(
                    "El horario solicitado ya está ocupado por otra reserva confirmada",
                    409
                );
            }

            throw error;
        }
    }


    // Calcular la duración total de los servicios de una reserva
    async calculateBookingDuration(services) {
        let totalDuration = 0;

        for (const item of services) {
            const service = await this.servicesRepository.getById(item.service);

            if (!service) {
                throw new AppError("Servicio no encontrado", 404);
            }

            totalDuration += service.duration * item.quantity;
        }

        // Redondear hacia arriba al siguiente bloque de 5 minutos
        return Math.ceil(totalDuration / 5) * 5;
    }


    // Generar los bloques de 5 minutos que ocupa una reserva
    async generateBookingSlots(bookingData) {
        const duration = await this.calculateBookingDuration(
            bookingData.services
        );

        const [hours, minutes] = bookingData.time
            .split(":")
            .map(Number);

        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + duration;

        // Evitar reservas que terminen después de medianoche
        if (endMinutes > 24 * 60) {
            throw new AppError(
                "La reserva no puede finalizar después de medianoche",
                400
            );
        }

        const slots = [];

        for (
            let current = startMinutes;
            current < endMinutes;
            current += 5
        ) {
            const slotHours = Math.floor(current / 60);
            const slotMinutes = current % 60;

            const formattedTime =
                `${String(slotHours).padStart(2, "0")}:` +
                `${String(slotMinutes).padStart(2, "0")}`;

            slots.push(formattedTime);
        }

        return slots;
    }

    // Verificar si una reserva se superpone con otra confirmada
    async validateBookingAvailability(
        bookingData,
        excludeBookingId = null,
        session = null
    ) {
        if (bookingData.status !== "confirmada") return;

        if (!bookingData.services?.length) {
            throw new AppError(
                "Una reserva confirmada debe tener al menos un servicio",
                400
            );
        }

        const duration = await this.calculateBookingDuration(
            bookingData.services
        );

        const toMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const requestedStart = toMinutes(bookingData.time);
        const requestedEnd = requestedStart + duration;


        const bookings = await this.repository.getConfirmedBookingsByDate(
            bookingData.date,
            session
        );

        for (const booking of bookings) {

            if (
                excludeBookingId &&
                String(booking._id) === String(excludeBookingId)
            ) {
                continue;
            }

            const existingDuration = await this.calculateBookingDuration(
                booking.services
            );

            const existingStart = toMinutes(booking.time);
            const existingEnd = existingStart + existingDuration;

            if (
                requestedStart < existingEnd &&
                requestedEnd > existingStart
            ) {
                throw new AppError(
                    "El horario solicitado se superpone con otra reserva confirmada",
                    409
                );
            }
        }
    }

    // Verificar que los servicios existan y estén disponibles
    async validateExistingServices(services) {
        if (!services) return;

        for (const item of services) {
            const existingService =
                await this.servicesRepository.getById(item.service);

            if (!existingService) {
                throw new AppError("Servicio no encontrado", 404);
            }

            if (!existingService.available) {
                throw new AppError("El servicio no está disponible", 400);
            }
        }
    }

    // Obtener todas las reservas
    async getBookings() {
        return await this.repository.getAll();
    }

    // Obtener una reserva por su ID
    async getBookingById(id) {
        return await this.repository.getById(id);
    }

    // Crear una nueva reserva
    async createBooking(bookingData) {
        validateBooking(bookingData);

        const newBooking = filterAllowedBookingFields(bookingData);

        await this.validateExistingServices(newBooking.services);

        // Las reservas pendientes y canceladas no bloquean horarios
        if (newBooking.status !== "confirmada") {
            return await this.repository.create(newBooking);
        }

        // Calcular los bloques que ocupará la reserva
        const slots = await this.generateBookingSlots(newBooking);

        // Crear la reserva y sus bloques en una misma transacción
        return await this.executeBookingTransaction(async (session) => {

            await this.validateBookingAvailability(newBooking, null, session);

            const createdBooking = await this.repository.create(
                newBooking,
                session
            );

            await this.bookingSlotsRepository.createSlots(
                createdBooking._id,
                newBooking.date,
                slots,
                session
            );

            return createdBooking;
        });
    }

    // Actualizar una reserva existente

    async updateBooking(id, updatedData) {
        const isDynamicUpdate = typeof updatedData === "function";

        let filteredData = {};

        if (!isDynamicUpdate) {
            validateBooking(updatedData, true);
            filteredData = filterAllowedBookingFields(updatedData);
        }

        if (!isDynamicUpdate && Object.keys(filteredData).length === 0) {
            throw new AppError(
                "Debe proporcionar al menos un campo válido para actualizar",
                400
            );
        }

        return await this.executeBookingTransaction(async (session) => {
            // Obtener el estado actual dentro de la transacción
            const existingBooking =
                await this.repository.getByIdWithoutPopulate(id, session);

            if (!existingBooking) {
                return null;
            }

            // Calcular los cambios usando la reserva leída en la transacción
            if (isDynamicUpdate) {
                const dynamicData = await updatedData(existingBooking);

                validateBooking(dynamicData, true);
                filteredData = filterAllowedBookingFields(dynamicData);

                if (Object.keys(filteredData).length === 0) {
                    throw new AppError(
                        "Debe proporcionar al menos un campo válido para actualizar",
                        400
                    );
                }
            }

            const bookingToValidate = {
                ...existingBooking,
                ...filteredData
            };

            await this.validateExistingServices(filteredData.services);

            // Calcular los nuevos bloques si quedará confirmada
            let newSlots = [];

            if (bookingToValidate.status === "confirmada") {

                await this.validateBookingAvailability(
                    bookingToValidate,
                    id,
                    session
                );

                newSlots = await this.generateBookingSlots(
                    bookingToValidate
                );
            }

            // Liberar los bloques anteriores
            await this.bookingSlotsRepository.deleteSlotsByBooking(
                id,
                session
            );

            // Actualizar la reserva
            const updatedBooking = await this.repository.update(
                id,
                filteredData,
                session
            );

            // Ocupar los nuevos bloques si está confirmada
            if (bookingToValidate.status === "confirmada") {
                await this.bookingSlotsRepository.createSlots(
                    id,
                    bookingToValidate.date,
                    newSlots,
                    session
                );
            }

            return updatedBooking;
        });
    }

    // Eliminar una reserva y liberar sus bloques horarios
    async deleteBooking(id) {
        return await this.executeBookingTransaction(async (session) => {
            // Eliminar los bloques asociados a la reserva
            await this.bookingSlotsRepository.deleteSlotsByBooking(
                id,
                session
            );

            // Eliminar la reserva dentro de la misma transacción
            return await this.repository.delete(id, session);
        });
    }

    // Agregar un servicio a una reserva existente
    async addServiceToBooking(bookingId, serviceId) {
        const existingCatalogService =
            await this.servicesRepository.getById(serviceId);

        if (!existingCatalogService) {
            throw new AppError("Servicio no encontrado", 404);
        }

        if (!existingCatalogService.available) {
            throw new AppError("El servicio no está disponible", 400);
        }

        return await this.updateBooking(bookingId, (booking) => {
            // Copiar los servicios de la reserva actual
            const updatedServices = booking.services.map((item) => ({
                service: item.service,
                quantity: item.quantity
            }));

            // Comprobar si el servicio ya está incluido
            const existingService = updatedServices.find(
                (item) =>
                    String(item.service) ===
                    String(existingCatalogService._id)
            );

            if (existingService) {
                existingService.quantity += 1;
            } else {
                updatedServices.push({
                    service: existingCatalogService._id,
                    quantity: 1
                });
            }

            return {
                services: updatedServices
            };
        });
    }
}

export default BookingsService;