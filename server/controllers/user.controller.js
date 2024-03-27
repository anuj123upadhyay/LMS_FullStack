import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import User from  "../models/user.model.js";
import cloudinary from "cloudinary";
import sendEmail from "../utils/sendEmail.js"
import fs from "fs/promises";
import crypto from "crypto";


const cookieOptions = {
    secure: process.env.NODE_ENV === "production" ? true: false,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
}


/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/user/register
 * @ACCESS Public
 */


export const registerUser = asyncHandler(async(req,res,next)=>{
    const { fullName, email,password,role } = req.body;

    if(!fullName || !email || !password || !role){
        return next(new AppError('AllFields are required',400));
    }

    const userExist = await User.findOne({email});

    if(userExist){
        return next(new AppError('user already exist', 409));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id: email,
            secure_url:"https://res.cloudinary.com/df6zsp5um/image/upload/v1707150785/trkndfzqatvxwl846p50.jpg"
        },
        role
    });

    if(!user){
        return next(new AppError("User registration failed , please try again later", 400)
        );
    }

    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"lms",
                width:250,
                height:250,
                gravity:"faces",
                crop:"fill"
            });

            if(result){
                user.avatar.public_id = result.public_id,
                user.avatar.secure_url = result.secure_url;


                // after successfull upload remove the file from the  local storage

                fs.rm(`uploads/${req.file.filename}`);

            }
        } catch (error) {
            return next(new AppError(error || "File not uploaded, please try again", 400));
        }
    }

// asve the user object

await user.save();


const token = await user.generateJWTToken();


// setting the password to undefined so it doesnot get sent in  the response
user.password = undefined

res.cookie("token",token,cookieOptions)

res.status(201).json({
    success:true,
    message:"User registered successully",
    user
})
});

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @ACCESS Public
 */

export const loginUser = asyncHandler(async(req,res,next)=>{
    const { email,password} = req.body;

    if(!email || !password){
        return next(new AppError('Email and Password are required', 400))
    }

    const user = await User.findOne({email}).select('+password')


    if(!(user && (await user.comparePassword(password)))){
        return next(
            new AppError('Email or Password donot match or user does not exist', 401)
        )
    }


    const token = await user.generateJWTToken();

//setting the password to undefined so it doesnot get sent in the response
    user.password = undefined;

    res.cookie("token",token , cookieOptions);

    res.status(200).json({
        success: true,
        message:"User logged in successfully",
        user
    })
})


/**
 * @LOGOUT
 * @ROUTE @POST {{URL}}/api/v1/user/logout
 * @ACCESS Public
 */

export const logoutUser = asyncHandler(async(_req,res,_next)=>{
    // setting the cookies value to null or clear all cookies
    res.cookie('token',null,{
        secure: process.env.NODE_ENV === "production" ? true: false,
        maxAge: 0,
        httpOnly: true
    })

    //sending the response 

    res.status(200).json({
        success: true,
        message:"User logged out successfully"
    })
})

/**
 * @LOGGED_IN_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/user/me
 * @ACCESS Private(Logged in users only)
 */

export const getLoggedInUserDetails = asyncHandler(async (req, res, _next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User Details",
            user
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset
 * @ACCESS Public
 */

 export const forgotPassword = asyncHandler(async(req,res,next)=>{
    const { email} = req.body;
    if(!email){
        return next(new AppError("Email is required", 400))
    }

    const user = await User.findOne({email});

    if(!user){
        return next(new AppError('Email not registered', 400))
    }

    const resetToken = await user.generatePasswordResetToken();

// saving the forgot password to DB
    await user.save();


    // constructing a url to send the correct data
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    // we here need to send an email to the user with the token
    const subject = "Reset Passsword";
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\n if the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n if you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email,subject,message)

        // if email sent successfully send the succes response
        res.status(200).json({
            success:true,
            mesage:"Rset password token has been sent o ${email successfully"
        })
    } catch (error) {
        // If Some error happened we need to clear the forgotPassword* fields in our DB

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save()

        return next(
            new AppError(
                error.message || "Something went wrong , please try again.",
                500
            )
        )
    }



});

/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset/:resetToken
 * @ACCESS Public
 */

export const resetPassword = asyncHandler(async(req,res,next)=>{
    
    //extracting the resetToken from req.params object
    const { resetToken } = req.params;

    //extracting password from the req.body
    const {password} = req.body;

    //we are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm

    const forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    // check if the password is not there then send response saying password is required
    if(!password){
        return next(new AppError("Password is required",400))
    }

    console.log(forgotPasswordToken);

    // checking if token matches in DB and if is still valid (Not Expired)

    const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry:{$gt:Date.now() },//// $gt is greater than , means if expiry is greater than date.now() than it is valid otherwise expired
});




    //if not found or expired send the response
    if(!user){
        next(new AppError('Token is invalid or expired , please try again',400)
        );
    }

    //update the passwprd if token is valid and not expired

    user.password = password;

    //making forgotPassword* values undefined n the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;


    await user.save();

    ///Sending the response when everyThing goes good
    res.status(200).json({
        success: true,
        message:'Password changed successfully',
    })
}) 

/**
 * @CHANGE_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/change-password
 * @ACCESS Private (Logged in users only)
 */
export const changePassword = asyncHandler(async(req,res, next)=>{
    //Destructuring the necessary data from the req object
    const { oldPassword , newPassword } = req.body;
    const { id } = req.user;
    // because of the middleware isLoggedIn

    // check if the values are there or not
    if(!oldPassword || ! newPassword){
        return next(
            new AppError('OLd Password and New Password are required',400)
        );
    }

    const user = await User.findById({id}).select('+password');

    //If no user then throw an error message
    if(!user){
        return next(new AppError('Invalid user id or user does not exist',400));
    }

    //check if the oldPassword is correct
    const isPasswordValid = await user.comparePassword(oldPassword);

    // If the old password is not valid then throw an error message
    if(!isPasswordValid){
        return next(
            new AppError("Invalid Old Password", 400)
        );
    }

    user.password = newPassword;

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })
});


/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/update/:id
 * @ACCESS Private (Logged in user only)
 */

export const updateUser = asyncHandler(async(req,res, next)=>{
    const { fullName} = req.body;
    const { id } = req.params;

    const user = await User.findById({id});
    if(!user){
        return next(new AppError('Invalid user id or user does not'));
    }

    if(fullName){
        user.fullName = fullName;
    }

//Run only if user sends a file 
if(req.file){
    //delete old file/images uploaded by the user
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms',
            width: 250,
            height: 250,
            gravity: "faces",
            crop:'fill'
        })   
        
        //if success
        if(result){
            //set the public_id and secure_url in DB
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            //after successful upload remove the file from the local storage
            fs.rm(`upload/${req.file.filename}`)
        }
    } catch (error) {
        return next(new AppError(error || 'File not uploaded , please try again', 400))
    }
}

// save the user object

await user.save();

res.status(200).json({
    success:true,
    message:"User details updated successfully"
})
});


