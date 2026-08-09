import { Booking } from "../models/booking.models.js";
import { Payment } from "../models/payment.models.js";
import { Professional } from "../models/professional.models.js";
import { razorpay } from "../utils/razorpay.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Service } from "../models/service.models.js";
import crypto from "crypto";




const createPaymentOrder = asyncHandler(async (req, res) => {

    const { bookingId } = req.body;

    // Only customers can make payment
    if (req.user.role !== "customer") {
        throw new ApiError(
            403,
            "Only customer can make payment"
        );
    }

    // Booking ID required
    if (!bookingId) {
        throw new ApiError(
            400,
            "BookingId is required"
        );
    }


  

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(
            404,
            "Booking not found"
        );
    }


    
    // BOOKING STATUS CHECK
    

    if (booking.bookingStatus === "Cancelled") {
        throw new ApiError(
            400,
            "Cancelled booking cannot be paid"
        );
    }
    if (booking.bookingStatus !== "Accepted") {
        throw new ApiError(
            400,
            "Payment is available only after professional accepts the booking"
        );
    }

    if (booking.bookingStatus === "Completed") {
        throw new ApiError(
            400,
            "Completed booking cannot be paid"
        );
    }


    
    // OWNERSHIP CHECK
    

    if (
        booking.customer.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can pay only for your own booking"
        );
    }


    
    // ALREADY PAID CHECK
    

    if (booking.paymentStatus === "Paid") {
        throw new ApiError(
            400,
            "Already Paid"
        );
    }


    
    // FIND SERVICE
    

    const service = await Service.findById(
        booking.service
    );

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }


    
    // GET ACTUAL SERVICE PRICE
   

    const amount = service.price;

    if (!amount || amount <= 0) {
        throw new ApiError(
            400,
            "Invalid service price"
        );
    }


    

    // const existingPayment =
    //     await Payment.findOne({
    //         booking: booking._id,
    //         paymentStatus: "Pending"
    //     });

    // if (existingPayment) {
    //     throw new ApiError(
    //         400,
    //         "Pending payment already exists"
    //     );
    // }

    const existingPayment = await Payment.findOne({
        booking: booking._id,
        paymentStatus: "Pending",
    });

    if (existingPayment) {
        const existingOrder =
            await razorpay.orders.fetch(
                existingPayment.razorpayOrderId
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        order: existingOrder,
                        payment: existingPayment,
                    },
                    "Existing payment order fetched successfully"
                )
            );
    }


    
    // CREATE RAZORPAY ORDER
    

    const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `booking_${booking._id}`,
    });


    
    // SAVE PAYMENT RECORD
    

    const payment = await Payment.create({

        booking: booking._id,

        customer: booking.customer,

        professional: booking.professional,

        razorpayOrderId: order.id,

        amount: amount,

        paymentStatus: "Pending",
    });



    // RESPONSE
    

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    order,
                    payment,
                },
                "Payment created successfully"
            )
        );
});



// VERIFY PAYMENT


const verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;


    
    // VALIDATE PAYMENT DATA
    

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        throw new ApiError(
            400,
            "All payment details are required"
        );
    }


    
    // FIND PAYMENT
    

    const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment record not found"
        );
    }


    // OWNERSHIP CHECK
    

    if (
        payment.customer.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Unauthorized payment verification"
        );
    }


    
    // PREVENT DUPLICATE VERIFICATION
    

    if (payment.paymentStatus === "Paid") {
        throw new ApiError(
            400,
            "Payment already verified"
        );
    }


   
    // GENERATE RAZORPAY SIGNATURE
    

    const generatedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");


    
    // COMPARE SIGNATURE
   

    if (
        generatedSignature !==
        razorpay_signature
    ) {
        throw new ApiError(
            400,
            "Invalid payment signature"
        );
    }


    
    // UPDATE PAYMENT
  
    payment.razorpayPaymentId =
        razorpay_payment_id;

    payment.paymentStatus = "Paid";

    payment.paidAt = new Date();

    await payment.save();


    
    // UPDATE BOOKING
    // 

    await Booking.findByIdAndUpdate(
        payment.booking,
        {
            paymentStatus: "Paid",
        },
        {
            new: true,
        }
    );


    

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                payment,
                "Payment verified successfully"
            )
        );
});




const getPaymentDetails = asyncHandler(
    async (req, res) => {

        const { bookingId } = req.params;


        // =================================================
        // FIND PAYMENT
        // =================================================

        const payment =
            await Payment.findOne({
                booking: bookingId,
            })
                .populate("booking")
                .populate(
                    "customer",
                    "fullName email phone"
                )
                .populate({
                    path: "professional",
                    populate: {
                        path: "owner",
                        select:
                            "fullName avatar city phone",
                    },
                });


        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found"
            );
        }


        
        // CUSTOMER ACCESS CHECK
    

        if (req.user.role === "customer") {

            if (
                payment.customer._id.toString() !==
                req.user._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "Unauthorized access"
                );
            }
        }


    
        // PROFESSIONAL ACCESS CHECK
        // 

        if (
            req.user.role ===
            "professional"
        ) {

            const professional =
                await Professional.findOne({
                    owner: req.user._id,
                });


            if (!professional) {
                throw new ApiError(
                    404,
                    "Professional profile not found"
                );
            }


            if (
                payment.professional._id.toString() !==
                professional._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "Unauthorized access"
                );
            }
        }


    

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    payment,
                    "Payment details fetched successfully"
                )
            );
    }
);


export {
    createPaymentOrder,
    verifyPayment,
    getPaymentDetails,
};