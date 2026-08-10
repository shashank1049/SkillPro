import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken";
import {Professional} from "../models/professional.models.js"



const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {
        const user=await User.findById(userId)

        if (!user) {
        throw new ApiError(404, "User not found");
        }

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({
            validateBeforeSave:false
        })

        return {accessToken, refreshToken}

        
    } catch (error) {
        throw new ApiError(500, "Failed to generate Access and Refresh tokens")
    }
}

// const registerUser=asyncHandler( async (req, res)=>{
//         //get the user data from req body
//         //validate the data
//         //check if user already exist
//         //check for avatar
//         //upload the image on cloudinary
//         //create the user object in DB
//         //remove thepassword and refresh token
//         //return response

//     const {
//         fullName,
//         username,
//         email,
//         password,
//         phone,
//         city,
//         role
//     }=req.body;

//      if (
//         [fullName, username, email, password].some(
//         (field) => field?.trim() === ""
//          )
//     ) {
//         throw new ApiError(400, "All required fields are mandatory");
//     }

//     // check for avatar
//     const avatarLocalPath = req.files?.avatar?.[0]?.path;

//     const coverImageLocalPath =
//     req.files?.coverImage?.[0]?.path;

//     if(!avatarLocalPath){
//         throw new ApiError(400, "Avatar is required");
//     }

//     const avatar=await uploadOnCloudinary(
//         avatarLocalPath
//     );
//     const coverImage=coverImageLocalPath ? await uploadOnCloudinary(
//         coverImageLocalPath
//     ):null;

//     if(!avatar){
//         throw new ApiError(500, "Failed to upload avatar")
//     }


//     const emailRegex = /^\S+@\S+\.\S+$/;
//     if (!emailRegex.test(email)) {
//             throw new ApiError(400, "Please enter a valid email address");
//     }

//     if(password.length<8){
//         throw new ApiError(400, "Password must contains 8 characters")
//     }
//     const allowedRoles=["customer", "professional"];
//     if(role && !allowedRoles.includes(role)){
//         throw new ApiError(400, "Invalid Role")
//     }

//     const existedUser=await User.findOne({
//     $or:[
//         {email},
//         {username}
//     ]
//     })
//     if(existedUser){
//         throw new ApiError(409, "User with this email or username already exists")
//     }

//     const user = await User.create({
//         fullName,
//         username: username.toLowerCase().trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         phone,
//         city,
//         role:role||"customer",
//         avatar: avatar.secure_url,
//         coverImage: coverImage?.secure_url||""
//     });

//     const createdUser= await User.findById(user._id).select( "-password -refreshToken" );

//     if(!createdUser){
//         throw new ApiError(500, "Something went wrong while registering the user, Please try again.")
//     }
//     return res
//     .status(201).json(
//         new ApiResponse(
//             201, 
//             createdUser,
//             "User registered Successfully"
//         )
//     )

// })


const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        username,
        email,
        password,
        phone,
        city,
        role,

        // Professional fields
        profession,
        bio,
        experience,
        skills,
        pricing,
        serviceAreas
    } = req.body;


    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(
            400,
            "All required fields are mandatory"
        );
    }


    const avatarLocalPath =
        req.files?.avatar?.[0]?.path;

    const coverImageLocalPath =
        req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar is required"
        );
    }

    const avatar = await uploadOnCloudinary(
        avatarLocalPath
    );

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(
              coverImageLocalPath
          )
        : null;

    if (!avatar) {
        throw new ApiError(
            500,
            "Failed to upload avatar"
        );
    }


    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(
            400,
            "Please enter a valid email address"
        );
    }

    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters"
        );
    }

    const allowedRoles = [
        "customer",
        "professional"
    ];

    const selectedRole = role || "customer";

    if (!allowedRoles.includes(selectedRole)) {
        throw new ApiError(
            400,
            "Invalid Role"
        );
    }


    if (selectedRole === "professional") {

        if (!profession?.trim()) {
            throw new ApiError(
                400,
                "Profession is required for professionals"
            );
        }

        if (
            pricing === undefined ||
            pricing === "" ||
            Number(pricing) < 0
        ) {
            throw new ApiError(
                400,
                "Valid pricing is required for professionals"
            );
        }
    }


    const existedUser = await User.findOne({
        $or: [
            {
                email: email
                    .toLowerCase()
                    .trim()
            },
            {
                username: username
                    .toLowerCase()
                    .trim()
            }
        ]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists"
        );
    }


    const portfolioImages = [];

    if (
        selectedRole === "professional" &&
        req.files?.portfolioImages?.length
    ) {
        for (
            const file of req.files.portfolioImages
        ) {
            const uploadedImage =
                await uploadOnCloudinary(
                    file.path
                );

            if (uploadedImage) {
                portfolioImages.push({
                    url: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id
                });
            }
        }
    }

    const user = await User.create({
        fullName,
        username: username
            .toLowerCase()
            .trim(),
        email: email
            .toLowerCase()
            .trim(),
        password,
        phone,
        city,
        role: selectedRole,
        avatar: avatar.secure_url,
        coverImage:
            coverImage?.secure_url || ""
    });


    let professional = null;

    if (selectedRole === "professional") {

        professional =
            await Professional.create({
                owner: user._id,

                profession:
                    profession.trim(),

                bio:
                    bio?.trim() || "",

                experience:
                    Number(experience) || 0,

                skills: Array.isArray(skills)
                    ? skills
                    : skills
                    ? skills
                          .split(",")
                          .map((skill) =>
                              skill.trim()
                          )
                          .filter(Boolean)
                    : [],

                pricing:
                    Number(pricing),

                serviceAreas:
                    Array.isArray(
                        serviceAreas
                    )
                        ? serviceAreas
                        : serviceAreas
                        ? serviceAreas
                              .split(",")
                              .map((area) =>
                                  area.trim()
                              )
                              .filter(Boolean)
                        : [],

                portfolioImages,

                // Admin system abhi nahi hai
                isApproved: true
            });
    }


    const createdUser =
        await User.findById(user._id)
            .select(
                "-password -refreshToken"
            );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

   

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                    professional:
                        professional
                },
                selectedRole ===
                    "professional"
                    ? "Professional account created successfully"
                    : "User registered successfully"
            )
        );
});


const loginUser=asyncHandler(async(req, res)=>{
    //get data
    //validate data
    //find user if exists
    //check password
    //generate tokens
    //send cookies
    //return response
    const {email, username, password}=req.body;
    if(!(email||username)){
        throw new ApiError(
            400,
            "Email or username is required"
        );
    }
    if(!password){
        throw new ApiError(
            400,
            "Password is required"
        )
    }
    const user = await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!user){
        throw new ApiError(
            404,
            "User does not exists"
        )
    }
    
    const isPasswordValid= await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(
            401,
            "Invalid user credentials"
        )
    }
    const {accessToken, refreshToken}=await generateAccessTokenAndRefreshTokens(user._id);
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    };

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
                
            },
            "User Logged in successfully"
        )
    )
})



const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
        sameSite:"none"
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const refreshAccessToken=asyncHandler(async (req, res )=>{
    try {
        const incomingRefreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken;
        const decodedToken=jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id);
    
        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(
                401,
                "Refresh token is expired or already used"
            );
        }
        const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshTokens(
            user._id
        );
        const options = {
            httpOnly: true,
            secure: true,
            sameSite:"none"
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken,
                    },
                    "Access token refreshed successfully"
                )
        );
    } catch (error) {
        throw new ApiError(401,
            "Invalid or Expired refresh Token"
        )
        
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Current user fetched successfully"
            )
        );
});


export {registerUser, loginUser, logoutUser, getCurrentUser}