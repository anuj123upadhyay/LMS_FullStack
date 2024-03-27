import mongoose, {Schema } from "mongoose";
import crypto from 'crypto';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    fullName:{
        type: String,
        required:[ true,, "Name is required"],
        minlength:[5,"Name must be at least 5 characters"],
        lowercase:true,
        trim: true,
        index: true
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        lowercase: true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please fill  a valid  email address']//match regex
    },
    password:{
        type: String,
        required:[ true,, "Password is required"],
        minlength:[8,"Password must be at least 8 characters"],
        select: false
    },
    subscription: {
        id: String,
        status: String,
      },
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry: Date,

},{timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword =(async function(plainPassword){
    try {
        return await bcrypt.compare(plainPassword,this.password)
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
})

userSchema.methods.generateJWTToken = (async function(){
    return  jwt.sign(
        {
            id:this._id,
            role:this.role,
            subscription:this.subscription,

        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
});
// this will generate a token for password reset
userSchema.methods.generatePasswordResetToken = (async function(){
      // creating a random token using node's built-in crypto module
      const resetToken = crypto.randomBytes(20).toString('hex');

      this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

      this.forgotPasswordExpiry = Date.now() + 30*24*60*60* 1000;    // 30 min

      
     return resetToken;
})

 const User = mongoose.model('User', userSchema)

 export default User;
        
        