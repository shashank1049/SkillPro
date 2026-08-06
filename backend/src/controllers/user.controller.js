import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { application } from "express";
import mongoose from "mongoose";


const updateAccountDetails=asyncHandler(async(req, res)=>{

    const{
        fullName,
        email,
        phone,
        city
    }=req.body;

    if(!fullName && !email && !phone && !city){
        throw new ApiError(
            400,
            "At least one field is required to update"
        )
    }
    if(email){
        const emailRegex=/^\S+@\S+\.\S+$/;

        if(!emailRegex.test(email)){
            throw new ApiError(400,
                "Invalid email address"
            )
        }
    }

    //DUPLICATE EMAIL CHECK

    if(email){
        const existingUser=await User.findOne({
            email:email.toLowerCase().trim(),
            _id:{$ne: req.user._id}
        })
        if(existingUser){
            throw new ApiError(
                409,
                "Email already exists."
            )
        }
    }

    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email.toLowerCase().trim();
    if (phone) updateFields.phone = phone;
    if (city) updateFields.city = city;

    const updatedUser= await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:updateFields,
        },
        {
            new: true,
            runValidators:true
        }
    ).select("-password -refreshToken")

    if(!updatedUser){
        throw new ApiError(404,
            "User not found."
        )
    }

    return res.status(200).json(
    new ApiResponse(
        200,
        updatedUser,
        "Account updated successfully"
        )
    );

})

//CHANGE CURRENT PASSWORD

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const{oldPassword, newPassword}=req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    if (newPassword.length < 8) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long"
        );
    
    }

    const user=await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404,
            "User not found"
        )
    }

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400,
            "Old password is incorrect"
        )
    }

    if (oldPassword === newPassword) {
        throw new ApiError(
            400,
            "New password cannot be same as old password"
        );
    }
    user.password=newPassword;
        await user.save({
        validateBeforeSave: false,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    );


});


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar image is required"
        );
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(
            500,
            "Failed to upload avatar"
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.secure_url,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");


    if (!updatedUser) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Avatar updated successfully"
        )
    );

});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(
            400,
            "Cover image is required"
        );
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new ApiError(
            500,
            "Failed to upload cover Image"
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.secure_url,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");


    if (!updatedUser) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Cover Image updated successfully"
        )
    );

});


export {
    updateAccountDetails,
    changeCurrentPassword,
    updateUserAvatar,
    updateUserCoverImage,
};