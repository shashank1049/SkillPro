import { Booking } from "../models/booking.models.js";
import {Service} from "../models/service.models.js";
import { Professional } from "../models/professional.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createBooking =asyncHandler(async(req, res)=>{

    const{
        serviceId,
        bookingDate,
        address,
        notes
    }=req.body;

    if(req.user.role!=="customer"){
        throw new ApiError(403,
            "Only Customer can book a service"
        )
    }

    if(!serviceId || !bookingDate || !address){
        throw new ApiError(
            400,
            "Service, bookin date and address are required"
        )
    }

    const service=await Service.findById(serviceId);
    if(!service){
        throw new ApiError(
            404,
            "Service not found"
        )
    }

    const professional=await Professional.findById(
        service.professional
    )

    if(!professional){
        throw new ApiError(
            404,
            "Professional not found"
        )
    }

    const selectedDate=new Date(bookingDate);

    if(selectedDate < new Date()){
        throw new ApiError(
            400,
            "Booking date can not be in the past"
        )
    }

    const booking = await Booking.create({
        customer: req.user._id,
        professional:professional._id,
        service: service._id,
        bookingDate: selectedDate,
        address,
        notes
    })

    const createdBooking= await Booking.findById(
        booking._id
    )
    .populate(
        "customer",
        "fullName email phone"
    )
    .populate(
        {
            path:"professional",
            populate:{
                path:"owner",
                select:"fullName avatar city phone"
            }
        }
    )
    .populate(
        "service",
        "title price duration"
    )

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdBooking,
            "Booking created successfully"
        )
    )
})


const getMyBookings=asyncHandler(async(req, res)=>{
    if(req.user.role!=="customer"){
        throw new ApiError(
            403,
            "Only customer can view their bookings"
        )
    };

    const bookings = await Booking.find({
        customer: req.user._id,
    })
    .populate({
        path: "professional",
        populate: {
            path: "owner",
            select: "fullName avatar phone city",
        },
    })
    .populate(
        "service",
        "title price duration serviceImages"
    )
    .sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Bookings fetched successfully"
        )
    );

});


const getProfessionalBookings=asyncHandler(async(req, res)=>{
    if(req.user.role!=="professional"){
        throw new ApiError(
            403,
            "Only professional can view their bookings"
        )
    }
    
    const professional=await Professional.findOne({
        owner:req.user._id.toString()
    })

    

    if(!professional){
        throw new ApiError(
            404,
            "Professional profile not found"
        )
    }

    const bookings=await Booking.find({
        professional:professional._id
    })
    .populate(
        "customer",
        "fullName phone avatar email"
    )
    .populate(
        "service",
        "title price duration"
    )
    .sort({
        createdAt:-1,

    })
    //console.log(await Booking.find());

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            bookings,
            "Bokkings fetched successfully"
        )
    )
})


const updateBookingStatus= asyncHandler(async(req, res)=>{
    const{bookingId}=req.params
    const{bookingStatus}=req.body
    

    //RoleCheck

    if(req.user.role!=="professional"){
        throw new ApiError(
            403,
            "Only professional can update booking status"
        )
    }

    //Validate statusCheck
    const allowedStatus=[
        "Accepted",
        "Rejected",
        "Completed"

    ]
    if(!allowedStatus.includes(bookingStatus)){
        throw new ApiError(
            400,
            "Invalid booking status"
        )
    }

    //Find Professional
    const professional= await Professional.findOne({
        owner:req.user._id
    })

    if(!professional){
        throw new ApiError(
            404,
            "Professional profile not found"
        )
    }

    //Find Bookings

    const booking=await Booking.findById(bookingId);

    if(!booking){
        throw new ApiError(
            404,
            "Booking not found"
        )
    }

    //OwnerShip check

    if(
        booking.professional.toString()!==professional._id.toString()
    ){
        throw new ApiError(
            403,
            "You are not allowed to update this booking"
        )
    }

    //State Validation

    if(booking.bookingStatus=="Completed"){
        throw new ApiError(
            400,
            "Completed booking can't be updated"
        )
    }

    if(booking.bookingStatus==="Rejected"){
        throw new ApiError(
            400,
            "Rejected booking can't be updated"
        )
    }
    if (
        booking.bookingStatus === "Pending" &&
        bookingStatus === "Completed"
    ) {
        throw new ApiError(
            400,
            "Booking must be accepted before completion"
        );
    }

    booking.bookingStatus=bookingStatus;
    await booking.save()

    const updatedBooking = await Booking.findById(
        booking._id
    )
        .populate(
            "customer",
            "fullName phone email"
        )
        .populate({
            path: "professional",
            populate: {
                path: "owner",
                select: "fullName avatar city phone",
            },
        })
        .populate(
            "service",
            "title price duration"
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedBooking,
            "Booking status updated successfully"
        )
    );

});


const getBookingById = asyncHandler(async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate(
            "customer",
            "fullName email phone avatar"
        )
        .populate({
            path: "professional",
            populate: {
                path: "owner",
                select: "fullName avatar phone city",
            },
        })
        .populate(
            "service",
            "title description price duration serviceImages"
        );

    if (!booking) {
        throw new ApiError(
            404,
            "Booking not found"
        );
    }

    // Only booking owner or professional can view

    const professional = await Professional.findOne({
        owner: req.user._id,
    });

    const isCustomer =
        booking.customer._id.toString() === req.user._id.toString();

    const isProfessional =
        professional &&
        booking.professional._id.toString() ===
            professional._id.toString();

    if (!isCustomer && !isProfessional) {
        throw new ApiError(
            403,
            "You are not authorized to view this booking"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking fetched successfully"
        )
    );

});



const cancelBooking=asyncHandler(async(req, res)=>{
    const{bookingId}=req.params;

    if(req.user.role!=="customer"){
        throw new ApiError(
            403,
            "Only customer can cancel booking"
        )
    }

    const booking=await Booking.findById(bookingId);
    if(!booking){
        throw new ApiError(
            404,
            "Booking not found"
        )
    }

    //ownerShip Check
    if(
        booking.customer.toString()!==req.user._id.toString()
    ){
        throw new ApiError(
            403,
            "You are not allowed to cancel the booking"
        
        )
    }

    if(booking.bookingStatus!=="Pending"){
        throw new ApiError(
            400,
            "Only Pending bookings can be cancelled"
        )
    }
    booking.bookingStatus="Cancelled";
    await booking.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            booking,
            "Booking cancelled successfully"
        )
    )
})


export {
    createBooking, 
    getMyBookings, 
    getProfessionalBookings,
    updateBookingStatus,
    cancelBooking,
    getBookingById
}