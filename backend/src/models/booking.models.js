import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        professional: {
            type: Schema.Types.ObjectId,
            ref: "Professional",
            required: true,
        },

        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        bookingDate: {
            type: Date,
            required: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        bookingStatus: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Cancelled",
                "Completed"
            ],
            default: "Pending",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Refunded"
            ],
            default: "Pending",
        }

    },
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model("Booking", bookingSchema);