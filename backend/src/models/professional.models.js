import mongoose ,{Schema} from "mongoose";

const professionalSchema=new Schema(
    {   

        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        profession:{
        type:String,
        required: true,
        enum: [
            "Driver",
            "Plumber",
            "Electrician",
            "Mechanic",
            "Carpenter",
            "Painter",
            "House Decorator",
            "Software Developer",
            "Graphic Designer",
            "Photographer",
            "Videographer",
            "Tutor",
            "Gym Trainer",
            "Cook",
            "Cleaner",
            "AC Repair",
            "Mobile Repair"
        ]
        },
        bio:{
            type:String,
            trim:true,
            maxlength:500
        },
        experience:{
            type:Number,
            default:0,
            min:0
        },
        skills:[
            {
                type:String,
                trim:true
            }
        ],
        availability:{
            type:Boolean,
            default: true
        },
        serviceAreas:[
            {
                type: String,
                trim: true
            }
        ],
        portfolioImages:[
            {
                url:String,
                publicId:String
            }
        ],
        rating:{
            type:Number,
            default:0,
            min:0,
            max:5
        },
        pricing: {
            type: Number,
            required: true,
            min: 0,
        },
        isApproved:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
)

export const Professional=mongoose.model("Professional", professionalSchema)