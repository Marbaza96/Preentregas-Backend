
import mongoose from "mongoose";

const bookingSlotSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "bookings",
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Impedir que dos reservas ocupen el mismo bloque horario
bookingSlotSchema.index(
    { date: 1, time: 1 },
    { unique: true }
);

const BookingSlotModel = mongoose.model(
    "bookingSlots",
    bookingSlotSchema
);

export default BookingSlotModel;
