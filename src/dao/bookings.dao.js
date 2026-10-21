import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(__dirname, "../data/bookings.json");

class BookingsDAO {

    // Obtener todas las reservas
    async getAll() {
        try {
            const data = await fs.readFile(bookingsPath, "utf-8");
            return JSON.parse(data);

        } catch (error) {
            if (error.code === "ENOENT") {
                await fs.writeFile(
                    bookingsPath,
                    JSON.stringify([], null, 2)
                );
                return [];
            }

            throw error;
        }
    }

    // Obtener una reserva por su ID
    async getById(id) {
        const bookings = await this.getAll();

        return bookings.find((booking) => booking.id === id) || null;
    }

    // Guardar arreglo completo de reservas en el archivo JSON
    async saveAll(bookings) {
        await fs.writeFile(
            bookingsPath,
            JSON.stringify(bookings, null, 2)
        );

        return bookings;
    }

    // Crear una nueva reserva
    async create(booking) {
        const bookings = await this.getAll();

        bookings.push(booking);

        await this.saveAll(bookings);

        return booking;
    }

    // Actualizar una reserva existente
    async update(id, updatedBooking) {
        const bookings = await this.getAll();

        const index = bookings.findIndex((booking) => booking.id === id);

        if (index === -1) {
            return null;
        }

        bookings[index] = {
            ...bookings[index],
            ...updatedBooking,
            id: bookings[index].id
        };

        await this.saveAll(bookings);

        return bookings[index];
    }

    // Eliminar una reserva por su ID
    async delete(id) {
        const bookings = await this.getAll();

        const bookingToDelete = bookings.find(
            (booking) => booking.id === id
        );

        if (!bookingToDelete) {
            return null;
        }

        const updatedBookings = bookings.filter(
            (booking) => booking.id !== id
        );

        await this.saveAll(updatedBookings);

        return bookingToDelete;
    }

}

export default BookingsDAO;