import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    createBooking,
    getMyBookings,
    getProfessionalBookings,
    updateBookingStatus,
    getBookingById,
    cancelBooking

} from "../controllers/booking.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Professional } from "../models/professional.models.js";
import { ApiResponse } from "../utils/apiResponse.js";


const router=Router();
// console.log("Booking Routes Loaded");

router.route("/create").post(
    verifyJWT,
    createBooking
)


router.route("/professional-bookings").get(
    verifyJWT,
    getProfessionalBookings
)


router.route("/my-bookings").get(
    verifyJWT,
    getMyBookings
);

router.route("/:bookingId/status").patch(
    verifyJWT,
    updateBookingStatus
);

router.route("/:bookingId").get(
    verifyJWT,
    getBookingById
);

router.route("/cancel/:bookingId").patch(
    verifyJWT,
    cancelBooking
);




export default router