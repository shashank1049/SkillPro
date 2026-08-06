import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProfessionalProfile } from "../controllers/professional.controller.js";

const router = Router();

router.route("/create-profile").post(
    verifyJWT,
    upload.array("portfolioImages", 5),
    createProfessionalProfile
);

export default router;