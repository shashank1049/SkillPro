import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
    {
        professional: {
            type: Schema.Types.ObjectId,
            ref: "Professional",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        duration: {
            type: Number, // in minutes
            required: true,
            min: 1,
        },

        serviceImages: [
            {
                type: String,
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Service = mongoose.model("Service", serviceSchema);