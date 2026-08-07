import { Booking } from "../models/booking.models.js";
import { Payment } from "../models/payment.models.js";
import { razorpay } from "../utils/razorpay.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Service } from "../models/service.models.js";
import crypto from "crypto";







const createPaymentOrder=asyncHandler(async(req, res)=>{
    const{bookingId}=req.body;

    if(req.user.role!=="customer"){
        throw new ApiError(
            403,
            "Only customer can nake payment"
        )
    }

    if(!bookingId){
        throw new ApiError(
            400,
            "BookingId is required"
        )
    }

    //Find booking
    const booking=await Booking.findById(bookingId);
    if(!booking){
        throw new ApiError(
            404,
            "Booking not found"
        )
    }

    if (booking.bookingStatus === "Cancelled") {
        throw new ApiError(
            400,
            "Cancelled booking cannot be paid"
        );
    }

    if (booking.bookingStatus === "Completed") {
        throw new ApiError(
            400,
            "Completed booking cannot be paid"
        );
    }


    //Ownership Check
    if(booking.customer.toString()!==req.user._id.toString()){
        throw new ApiError(
            403,
            "You can pay only for your own booking"
        )
    }

    if(booking.paymentStatus==="Paid"){
        throw new ApiError(
            400,
            "Already Paid"
        )
    }
    
    
    
    //Amount
    const service = await Service.findById(booking.service);

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }
    const amount=service.price;

    const existingPayment = await Payment.findOne({
        booking: booking._id,
        paymentStatus: "Pending"
    });

    if (existingPayment) {
        throw new ApiError(
            400,
            "Pending payment already exists"
        );
    }

    //Create Razorpay Order

    const order=await razorpay.orders.create({
        amount:amount*100,
        currency:"INR",
        receipt:`booking_${booking._id}`
    })

    //save Payment
    const payment= await Payment.create({
        booking:booking._id,
        customer:booking.customer,
        professional:booking.professional,
        razorpayOrderId:order.id,
        amount:amount,
        paymentStatus:"Pending"
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                order,
                payment
            },
            "Payment created successfully"
        )
    )


})




const verifyPayment=asyncHandler(async (req, res)=>{
    const{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    }=req.body

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        throw new ApiError(
            400,
            "All payment details are required"
        )
    }

    //Generate Signature
    const generatedSignature=crypto.createHmac(
        "sha1211",
        process.env.RAZORPAY_KEY_SECRET
    ).update(
        `${razorpay_order_id}|${razorpay_payment_id}`
    ).digest("hex");


//Compare Signature
    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(
            400,
            "Invalid payment signature"
        );
    }


    if (payment.customer.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Unauthorized payment verification"
        );
    }


    //Find Payment
    const payment=await Payment.findOne({
        razorpayOrderId:razorpay_order_id
    })

    if(!payment){
        throw new ApiError(
            404,
            "PAyment record not found"
        )
    }

    //Update Payment

    Payment.razorpayPaymentId=razorpay_payment_id;
    Payment.razorpayOrderId=razorpay_order_id;
    Payment.paymentStatus="Paid",
    Payment.paidAt=new Date()

    //Update Booking

    await Booking.findByIdAndUpdate(
        payment.booking,
        {
            paymentStatus:"Paid"
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            payment,
            "PAyment Verified Successfully"
        )
    )

})



const getPaymentDetails = asyncHandler(async (req, res) => {

    const { bookingId } = req.params;

    const payment = await Payment.findOne({
        booking: bookingId
    })
    .populate(
        "booking"
    )
    .populate(
        "customer",
        "fullName email phone"
    )
    .populate({
        path: "professional",
        populate: {
            path: "owner",
            select: "fullName avatar city phone"
        }
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    // Customer can view own payment
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

    // Professional can view own payment
    if (req.user.role === "professional") {

        const professional = await Professional.findOne({
            owner: req.user._id
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

    return res.status(200).json(
        new ApiResponse(
            200,
            payment,
            "Payment details fetched successfully"
        )
    );

});








export {
    createPaymentOrder,
    verifyPayment,
    getPaymentDetails
}