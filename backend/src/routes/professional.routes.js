import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
    import { 
        createProfessionalProfile,         getMyProfessionalProfile,updateProfessionalProfile,
        getAllProfessionals,
        getProfessionalById,
        uploadPortfolioImages,
        deletePortfolioImage
 } from "../controllers/professional.controller.js";

const router = Router();
console.log("Professional Routes Loaded");

router.route("/create-profile").post(
    verifyJWT,
    upload.array("portfolioImages", 5),
    createProfessionalProfile
);


router.route("/portfolio").patch(
    verifyJWT,
    upload.array("portfolioImages",5),
    uploadPortfolioImages
);



router.route("/me").get(
    verifyJWT,
    getMyProfessionalProfile
);



router.route("/update").patch(
    verifyJWT,
    updateProfessionalProfile
);



router.route("/").get(getAllProfessionals);

router.route("/:professionalId").get(getProfessionalById);

router.route("/portfolio/:imageIndex").delete(
    verifyJWT,
    deletePortfolioImage
);





export default router;