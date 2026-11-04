import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

// Renderizar la vista de servicios
export const renderServices = async (req, res, next) => {
    try {
        const services = await servicesService.getServices();

        res.render("services", { services });
    } catch (error) {
        next(error);
    }
};

// Renderizar la vista de reservas
export const renderAvailability = async (req, res, next) => {
    try {
        const bookings = await bookingsService.getBookings();

        res.render("availability", { bookings });
    } catch (error) {
        next(error);
    }
};