import { Service } from "../models/service.models.js";
import { Professional } from "../models/professional.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";




const createService = asyncHandler(async (req, res) => {

    const{
        title,
        description,
        category,
        price,
        duration
    }=req.body;

    if(req.user.role!=="professional"){
        throw new ApiError(
            403,
            "Only Professional can create services"
        )
    }

    const professional=await Professional.findOne({
        owner: req.user._id
    })
    if(!professional){
        throw new ApiError(
            404,
            "Professional not found"
        )
    }

    // console.log(req.body);
    // console.log(req.files);

    if (
        !title ||
        !description ||
        !category ||
        price === undefined ||
        duration === undefined
    ) {
        throw new ApiError(
            400,
            "All required fields are mandatory"
        );
    }

    if (Number(price) < 0) {
        throw new ApiError(
            400,
            "Price cannot be negative"
        );
    }

    if (Number(duration) <= 0) {
        throw new ApiError(
            400,
            "Duration must be greater than zero"
        );
    }

    const serviceImages = [];

    if (req.files?.length) {

        for (const file of req.files) {

            const uploadedImage = await uploadOnCloudinary(file.path);

            if (uploadedImage) {
                serviceImages.push(uploadedImage.secure_url);
            }

        }

    }

    const service=await Service.create({
        professional:professional,
        title,
        description,
        category,
        price:Number(price),
        duration:Number(duration),
        serviceImages

    })

    return res.status(201).json(
        new ApiResponse(
            201,
            service,
            "Service created successfully"
        )
    );

});




const getMyServices= asyncHandler(async(req, res)=>{

    if(req.user.role!=="professional"){
        throw new ApiError(
            403,
            "Only Professional can access their services"
        );
    }

    const professional=await Professional.findOne({
        owner: req.user._id
    })

    if(!professional){
        throw new ApiError(
            404,
            "Professional profile not found"
        )
    }

    const services=await Service.find({
        professional:professional._id
    }).sort({
        createdAt: -1,
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            services,
            "Services fetched successfully"
        )
    )
})


// const updateServices=asyncHandler(async (req, res)=>{

//     const{
//         title,
//         description,
//         price,
//         duration,
//         images,
//         ownership
//     }=req.body;

//     if(!title && !description && !price && !duration && !ownership && !images){
//         throw new ApiError(
//             401,
//             "At least one field is required"
//         )
//     }

//     const service=Service.findByIdAndUpdate(req.user.,
//         {
//             $set:{
//             title,
//             description,
//             price,
//             duration,
//             images,
//             ownership
//         }
//         },{
//             new:true,
//             runValidators:true
//         }
//     )

     



// })

const updateService = asyncHandler(async (req, res) => {

    const { serviceId } = req.params;

    const {
        title,
        description,
        category,
        price,
        duration,
        isActive,
    } = req.body;

    if (req.user.role !== "professional") {
        throw new ApiError(
            403,
            "Only professionals can update services"
        );
    }

    const professional = await Professional.findOne({
        owner: req.user._id,
    });

    if (!professional) {
        throw new ApiError(
            404,
            "Professional profile not found"
        );
    }

    const service = await Service.findById(serviceId);

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    // Ownership Check
    if (service.professional.toString() !== professional._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this service"
        );
    }

    const updateFields = {};

    if (title) updateFields.title = title;

    if (description) updateFields.description = description;

    if (category) updateFields.category = category;

    if (price !== undefined) {

        if (Number(price) < 0) {
            throw new ApiError(
                400,
                "Price cannot be negative"
            );
        }

        updateFields.price = Number(price);
    }

    if (duration !== undefined) {

        if (Number(duration) <= 0) {
            throw new ApiError(
                400,
                "Duration must be greater than zero"
            );
        }

        updateFields.duration = Number(duration);
    }

    if (isActive !== undefined) {
        updateFields.isActive = isActive;
    }

    // Upload New Images (Optional)
    if (req.files?.length) {

        const uploadedImages = [];

        for (const file of req.files) {

            const image = await uploadOnCloudinary(file.path);

            if (image) {
                uploadedImages.push(image.secure_url);
            }
        }

        updateFields.serviceImages = uploadedImages;
    }

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(
            400,
            "At least one field is required to update"
        );
    }

    const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        {
            $set: updateFields,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedService,
            "Service updated successfully"
        )
    );

});


const deleteService=asyncHandler(async (req, res)=>{
    const{serviceId}=req.params;

    if (req.user.role !== "professional") {
        throw new ApiError(
            403,
            "Only professionals can delete services"
        );
    }
    //console.log("Service ID:", req.params.serviceId);

    const professional=await Professional.findOne({
        owner: req.user._id
    })

    if(!professional){
        throw new ApiError(
            404,
            "Professional profile not found"
        )
    }

    const service =await Service.findById(serviceId);
    //console.log(service)

    if(!service){
        throw new ApiError(
            404,
            "Service not found"
        )
    }

    // console.log("Professional ID:", professional._id.toString());
    // console.log("Service Professional ID:", service.professional.toString());
    // console.log("Logged In User:", req.user._id.toString());

    //Ownership Check

    if(service.professional.toString()!==professional._id.toString()){
        throw new ApiError(
            403,
            "You are not eligible to delete the service"
        )
    }

    await Service.findByIdAndDelete(serviceId);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Service deleted Successfully"
        )
    )
})



const getAllServices = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    const filter = {
        isActive: true,
    };

    if (category) {
        filter.category = {
            $regex: category,
            $options: "i",
        };
    }

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortOptions = {
        [sortBy]: order === "asc" ? 1 : -1,
    };

    const services = await Service.find(filter)
        .populate({
            path: "professional",
            populate: {
                path: "owner",
                select: "fullName username avatar city",
            },
    })
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

    // console.log(services)


    const totalServices = await Service.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                services,
                page: Number(page),
                limit: Number(limit),
                totalServices,
                totalPages: Math.ceil(totalServices / Number(limit)),
            },
            "Services fetched successfully"
        )
    );

});


const getServiceById= asyncHandler(async(req, res)=>{

    const {serviceId}=req.params;

    if(!mongoose.Types.ObjectId.isValid(serviceId)){
        throw new ApiError(
            400,
            "Invalid Service ID"
        )
    }

    const service =await Service.findById(serviceId)
    .populate({
        path:"professional",
        populate:{
            path:"owner",
            select:"fullName username avatar city phone"
        }
    })

    if(!service){
        throw new ApiError(
            404,
            "Service not found"
        )
    }

    return res.status(200)
    .json(
        200,
        service,
        "Service fetched succefully"
    )
})


export {createService, getMyServices,updateService, deleteService, getAllServices, getServiceById}