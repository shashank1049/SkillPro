import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


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

const registerUser=asyncHandler( async (req, res)=>{
        //get the user data from req body
        //validate the data
        //check if user already exist
        //check for avatar
        //upload the image on cloudinary
        //create the user object in DB
        //remove thepassword and refresh token
        //return response

    const {
        fullName,
        username,
        email,
        password,
        phone,
        city,
        role
    }=req.body;

     if (
        [fullName, username, email, password].some(
        (field) => field?.trim() === ""
         )
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
            throw new ApiError(400, "Please enter a valid email address");
    }

    if(password.length<8){
        throw new ApiError(400, "Password must contains 8 characters")
    }
    const allowedRoles=["customer", "professional"];
    if(role && !allowedRoles.includes(role)){
        throw new ApiError(400, "Invalid Role")
    }

    const existedUser=await User.findOne({
    $or:[
        {email},
        {username}
    ]
    })
    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists")
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
        phone,
        city,
        role:role||"customer",
    });

    const createdUser= await User.findById(user._id).select( "-password -refreshToken" );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user, Please try again.")
    }
    return res
    .status(201).json(
        new ApiResponse(
            201, 
            createdUser,
            "User registered Successfully"
        )
    )

})

export {registerUser}