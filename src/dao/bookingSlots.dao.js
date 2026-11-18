
import BookingSlotModel from "./models/bookingSlot.model.js";

class BookingSlotsDAO {

    // Reservar bloques horarios dentro de una transacción
    async createSlots(bookingId, date, times, session) {
        if (times.length === 0) return;

        const slots = times.map((time) => ({
            booking: bookingId,
            date,
            time
        }));

        return await BookingSlotModel.insertMany(slots, {
            session,
            ordered: true
        });
    }

    // Liberar los bloques asociados a una reserva
    async deleteSlotsByBooking(bookingId, session) {
        return await BookingSlotModel.deleteMany(
            { booking: bookingId },
            { session }
        );
    }
}

export default BookingSlotsDAO;
