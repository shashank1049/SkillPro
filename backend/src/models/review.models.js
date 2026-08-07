import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true
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

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

export const Review = mongoose.model("Review", reviewSchema);