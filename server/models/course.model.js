import mongoose,{Schema} from "mongoose";

const courseSchema = new Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        minLength:[8,'Title must contain alteast 8 chars'],
        maxLength:[50,'Title must contain not more 50 chars'],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minlength:[20,'Description must be atleast 20 characters long']
    },
    category:{
        type:String,
        required:true,

    },
    lectures:[
        {
            title:String,
            descripion:String,
            lecture:{
                public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
        }
    ],
    thumbnail:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String
        }
    },
    numberOfLectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:[true,"Course instructor name is required"]
    }

},{timestamps: true})

 const Course = mongoose.model("Course",courseSchema);
 export default Course;