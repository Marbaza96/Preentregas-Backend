
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true
        },
        clientEmail: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: String,
            required: true,
            trim: true
        },
        time: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            trim: true
        },
        services: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "services",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                    validate: {
                        validator: Number.isInteger,
                        message: "La cantidad debe ser un número entero"
                    }
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const BookingModel = mongoose.model("bookings", bookingSchema);

export default BookingModel;
