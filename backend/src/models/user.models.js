import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        fullName:{
            type: String,
            required: true,
            trim: true,

        },

        username:{
            required:true,
            type:String,
            trim:true,
            lowercase:true,
            unique:true
        },
        email:{
            required:true,
            type:String,
            trim:true,
            lowercase:true,
            unique:true
        },
        phone:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:8
        },

        avatar:{
            type:String,
            default:""
        },
        coverImage:{
            type:String,
            default:""
        },
        city:{
            type:String,
            trim:true
        },
        role:{
            type:String,
            enum:["customer", "professional", "admin"],
            default:"customer"
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String,
            default:""
        }

        
    },
    {
        timestamps:true,
    }
)


userSchema.pre("save", async function(){
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password, 10);
    
})


userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
            role:this.role
                        
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User=mongoose.model("User", userSchema)