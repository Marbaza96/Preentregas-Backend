
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
            trim: true,
            validate: {
                validator: (value) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

                    const parsedDate = new Date(`${value}T00:00:00Z`);

                    return !Number.isNaN(parsedDate.getTime()) &&
                        parsedDate.toISOString().slice(0, 10) === value;
                },
                message: "La fecha debe ser válida y tener el formato YYYY-MM-DD"
            }
        },
        time: {
            type: String,
            required: true,
            trim: true,
            match: [
                /^([01]\d|2[0-3]):[0-5][05]$/,
                "La hora debe tener el formato HH:mm y respetar intervalos de 5 minutos"
            ]
        },
        status: {
            type: String,
            required: true,
            trim: true,
            enum: ["pendiente", "confirmada", "cancelada"]
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
