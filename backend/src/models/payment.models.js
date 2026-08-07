import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        professional: {
            type: Schema.Types.ObjectId,
            ref: "Professional",
            required: true
        },

        razorpayOrderId: {
            type: String
        },

        razorpayPaymentId: {
            type: String
        },

        razorpaySignature: {
            type: String
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded"
            ],
            default: "Pending"
        },

        paymentMethod: {
            type: String
        },

        paidAt: {
            type: Date
        }

    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model(
    "Payment",
    paymentSchema
);