import { Professional } from "../models/professional.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createProfessionalProfile = asyncHandler(async (req, res) => {
    //get the data

    const {
        profession,
        bio,
        experience,
        skills,
        pricing,
        serviceAreas
    }=req.body;
    const user=req.user;

    if(user.role!=="professional"){
        throw new ApiError(403,
            "Only professional can create a professional profile"
        )
    }

    const existedProfile=await Professional.findOne({owner:user._id});

    if(existedProfile){
        throw new ApiError(
            409,
            "Professional profile already exists."
        )
    }
    if(!profession ||pricing===undefined){
        throw new ApiError(400,
            "Profession and pricing are required."
        )
    }

    //upload images
    const portfolioImages = [];
    if (req.files?.length) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);

            if (uploadedImage) {
                portfolioImages.push(uploadedImage.secure_url);
            }
        }
    }

    const professional=await Professional.create({

        owner:user._id,

        profession,

        bio,

        experience,

        skills,

        pricing,

        serviceAreas:Array.isArray(serviceAreas)?serviceAreas:serviceAreas?[serviceAreas]:[],

        portfolioImages
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            professional,
            "Professional profile created successfully"
        )
    )
});