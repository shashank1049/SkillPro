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

        experience:Number(experience)||0,

            skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills.split(",").map(skill => skill.trim())
        : [],

        pricing:Number(pricing),

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


const getMyProfessionalProfile = asyncHandler(async (req, res) => {
    const profile = await Professional.findOne({
        owner: req.user._id,
    }).populate(
        "owner",
        "-password -refreshToken"
    );

    if (!profile) {
        throw new ApiError(
            404,
            "Professional profile not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Professional profile fetched successfully"
        )
    );
});



const updateProfessionalProfile = asyncHandler(async (req, res) => {
    const{
        profession,
        bio,
        experience,
        skills,
        pricing,
        availability,
        serviceAreas,
    }=req.body;

    if(req.user.role !=="professional"){
        throw new ApiError(403,
            "Only Professional can update their profile"
        )
    }

    const profile=await Professional.findOne({
        owner:req.user._id,
    });

    if(!profile){
        throw new ApiError(404,
            "Professional profile not found"
        )
    }

    const updateFields = {};
    if (profession) {
        updateFields.profession = profession;
    }
    if (bio) {
        updateFields.bio = bio;
    }
    if (experience !== undefined) {

        if (experience < 0) {
            throw new ApiError(
                400,
                "Experience cannot be negative"
            );
        }

        updateFields.experience = Number(experience);
    }
    if (pricing !== undefined) {

        if (pricing < 0) {
            throw new ApiError(
                400,
                "Pricing cannot be negative"
            );
        }

        updateFields.pricing = Number(pricing);
    }

        if (availability !== undefined) {
        updateFields.availability = availability;
    }

    if (skills) {
        updateFields.skills = Array.isArray(skills)
            ? skills
            : skills.split(",").map(skill => skill.trim());
    }

    if (serviceAreas) {
        updateFields.serviceAreas = Array.isArray(serviceAreas)
            ? serviceAreas
            : serviceAreas.split(",").map(area => area.trim());
    }

    //update the profile

    const updatedProfile= await Professional.findOneAndUpdate(
        {
            owner:req.user._id,
        },
        {
            $set:updateFields,
        },
        {
            new:true,
            runValidators:true,
        }
    ).populate(
        "owner",
        "fullName username city role avatar"
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProfile,
            "Professional profile updated successfully"
        )
    );
});






const getAllProfessionals = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 10,
        profession,
        city,
        availability,
        sortBy = "createdAt",
        order = "desc",
    } = req.query;


    const filter = {
        isApproved: true,
    };

    if (profession) {
        filter.profession = profession;
    }

    if (availability !== undefined) {
        filter.availability = availability === "true";
    }

    if (city) {
        filter.serviceAreas = city;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = {
        [sortBy]: order === "asc" ? 1 : -1,
    };

    const professionals = await Professional.find(filter)
    .populate(
        "owner",
        "fullName username avatar city"
    )
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

    const totalProfessionals = await Professional.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                professionals,
                page: Number(page),
                limit: Number(limit),
                totalProfessionals,
                totalPages: Math.ceil(totalProfessionals / Number(limit)),
            },
            "Professionals fetched successfully"
        )
    );


});


const getProfessionalById=asyncHandler(async (req , res)=>{
    const {professionalId}=req.params;

    if(!professionalId){
        throw new ApiError(
            400,
            "Professional Id is required"
        );
    }

    const professional=await Professional.findById(professionalId).populate(
        "owner",
        "fullName username avatar city role"
    );

    if(!professional){
        throw new ApiError(
            404,
            "Professional not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            professional,
            "Professional fetched Successfully"
        )
    )
})




const uploadPortfolioImages = asyncHandler(async (req, res) => {

    if(req.user.role !== "professional"){
        throw new ApiError(
            403,
            "Only professionals can upload portfolio images"
        );
    }

    const profile = await Professional.findOne({
        owner:req.user._id
    });

    if(!profile){
        throw new ApiError(
            404,
            "Professional profile not found"
        );
    }

    if(!req.files?.length){
        throw new ApiError(
            400,
            "Portfolio images are required"
        );
    }

    const uploadedImages=[];

    for(const file of req.files){

        const image=await uploadOnCloudinary(file.path);

        if(image){
            uploadedImages.push(image.secure_url);
        }

    }

    profile.portfolioImages.push(...uploadedImages);

    await profile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Portfolio images uploaded successfully"
        )
    );

});



const deletePortfolioImage = asyncHandler(async(req,res)=>{

    const { imageIndex } = req.params;

    const profile=await Professional.findOne({
        owner:req.user._id
    });

    if(!profile){
        throw new ApiError(
            404,
            "Professional profile not found"
        );
    }

    if(
        imageIndex<0 ||
        imageIndex>=profile.portfolioImages.length
    ){
        throw new ApiError(
            400,
            "Invalid image index"
        );
    }

    profile.portfolioImages.splice(imageIndex,1);

    await profile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Portfolio image deleted successfully"
        )
    );

});







export {
    createProfessionalProfile,
    getMyProfessionalProfile,
    updateProfessionalProfile,
    getAllProfessionals,
    getProfessionalById,
    uploadPortfolioImages,
    deletePortfolioImage

};