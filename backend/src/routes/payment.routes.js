import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createPaymentOrder ,
    verifyPayment,
    getPaymentDetails

} from "../controllers/payment.controller.js";

const router = Router();

router.route("/create-order").post(
    verifyJWT,
    createPaymentOrder
);

router.route("/:bookingId").get(
    verifyJWT,
    getPaymentDetails
);



router.route("/verify").post(
    verifyJWT,
    verifyPayment
);



export default router;