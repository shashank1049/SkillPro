import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createService, 
    getMyServices, 
    updateService, 
    deleteService,
    getAllServices,
    getServiceById
} from "../controllers/service.controller.js";

const router = Router();

router.route("/create").post(
    verifyJWT,
    upload.array("serviceImages", 5),
    createService
);

router.route("/me").get(
    verifyJWT,
    getMyServices
);


router.route("/:serviceId").delete(
    verifyJWT,
    deleteService
);

router.route("/").get(getAllServices);


router.route("/:serviceId").patch(
    verifyJWT,
    upload.array("serviceImages", 5),
    updateService
);

router.route("/:serviceId").get(getServiceById);


export default router;