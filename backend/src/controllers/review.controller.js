import { Review } from "../models/review.models.js";
import { Booking } from "../models/booking.models.js";
import { Professional } from "../models/professional.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createReview = asyncHandler(async (req, res) => {

    const {
        bookingId,
        rating,
        comment
    } = req.body;

    if (req.user.role !== "customer") {
        throw new ApiError(
            403,
            "Only customers can give reviews"
        );
    }

    if (!bookingId || !rating) {
        throw new ApiError(
            400,
            "Booking ID and rating are required"
        );
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(
            400,
            "Rating must be between 1 and 5"
        );
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(
            404,
            "Booking not found"
        );
    }

    if (
        booking.customer.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can review only your own bookings"
        );
    }

    if (booking.bookingStatus !== "Completed") {
        throw new ApiError(
            400,
            "Only completed bookings can be reviewed"
        );
    }

    const alreadyReviewed = await Review.findOne({
        booking: bookingId
    });

    if (alreadyReviewed) {
        throw new ApiError(
            409,
            "Review already submitted"
        );
    }

    const review = await Review.create({
        booking: booking._id,
        customer: req.user._id,
        professional: booking.professional,
        rating,
        comment
    });

    // Update Professional Rating

    const reviews = await Review.find({
        professional: booking.professional
    });

    const averageRating =
        reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        ) / reviews.length;

    await Professional.findByIdAndUpdate(
        booking.professional,
        {
            rating: Number(
                averageRating.toFixed(1)
            )
        }
    );

    const createdReview =
        await Review.findById(review._id)
            .populate(
                "customer",
                "fullName avatar"
            )
            .populate({
                path: "professional",
                populate: {
                    path: "owner",
                    select: "fullName avatar"
                }
            });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdReview,
            "Review added successfully"
        )
    );

});



const getProfessionalReviews = asyncHandler(
    async (req, res) => {

        const { professionalId } = req.params;

        const professional =
            await Professional.findById(
                professionalId
            );

        if (!professional) {
            throw new ApiError(
                404,
                "Professional not found"
            );
        }

        const reviews = await Review.find({
            professional: professionalId
        })
            .populate(
                "customer",
                "fullName avatar"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                reviews,
                "Reviews fetched successfully"
            )
        );

    }
);



const getHomeTestimonials = asyncHandler(
    async (req, res) => {

        const reviews = await Review.find({
            rating: { $gte: 4 },
            comment: {
                $exists: true,
                $ne: ""
            }
        })
            .populate(
                "customer",
                "fullName avatar"
            )
            .populate({
                path: "professional",
                populate: {
                    path: "owner",
                    select: "fullName avatar"
                }
            })
            .sort({
                createdAt: -1
            })
            .limit(6);

        return res.status(200).json(
            new ApiResponse(
                200,
                reviews,
                "Testimonials fetched successfully"
            )
        );

    }
);


const updateReview = asyncHandler(
    async (req, res) => {

        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        if (req.user.role !== "customer") {
            throw new ApiError(
                403,
                "Only customers can update reviews"
            );
        }

        const review =
            await Review.findById(reviewId);

        if (!review) {
            throw new ApiError(
                404,
                "Review not found"
            );
        }

        if (
            review.customer.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "You can update only your own review"
            );
        }

        if (rating !== undefined) {

            if (rating < 1 || rating > 5) {
                throw new ApiError(
                    400,
                    "Rating must be between 1 and 5"
                );
            }

            review.rating = rating;
        }

        if (comment) {
            review.comment = comment;
        }

        await review.save();

        // Update Average Rating

        const reviews = await Review.find({
            professional: review.professional
        });

        const averageRating =
            reviews.reduce(
                (sum, item) => sum + item.rating,
                0
            ) / reviews.length;

        await Professional.findByIdAndUpdate(
            review.professional,
            {
                rating: Number(
                    averageRating.toFixed(1)
                )
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                review,
                "Review updated successfully"
            )
        );

    }
);




const deleteReview = asyncHandler(
    async (req, res) => {

        const { reviewId } = req.params;

        if (req.user.role !== "customer") {
            throw new ApiError(
                403,
                "Only customers can delete reviews"
            );
        }

        const review =
            await Review.findById(reviewId);

        if (!review) {
            throw new ApiError(
                404,
                "Review not found"
            );
        }

        // Ownership Check

        if (
            review.customer.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "You can delete only your own review"
            );
        }

        const professionalId =
            review.professional;

        await Review.findByIdAndDelete(
            reviewId
        );

        // Recalculate Rating

        const reviews = await Review.find({
            professional: professionalId
        });

        const averageRating =
            reviews.length === 0
                ? 0
                : reviews.reduce(
                      (sum, item) =>
                          sum + item.rating,
                      0
                  ) / reviews.length;

        await Professional.findByIdAndUpdate(
            professionalId,
            {
                rating: Number(
                    averageRating.toFixed(1)
                )
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Review deleted successfully"
            )
        );

    }
);


export {
    createReview,
    getProfessionalReviews,
    getHomeTestimonials,
    updateReview,
    deleteReview
};