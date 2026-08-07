import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createReview,
    getProfessionalReviews,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js";

const router = Router();

// Create Review
router.route("/create").post(
    verifyJWT,
    createReview
);

// Get Reviews of a Professional
router.route("/professional/:professionalId").get(
    getProfessionalReviews
);

// Update Review
router.route("/:reviewId").patch(
    verifyJWT,
    updateReview
);

// Delete Review
router.route("/:reviewId").delete(
    verifyJWT,
    deleteReview
);

export default router;