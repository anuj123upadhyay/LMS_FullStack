import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js"



//   @CONTACT_US
//  @ROUTE @POST {{URL}}/api/v1/contact
//   @ACCESS Public

export const contactUS = asyncHandler(async(req,res,next)=>{
    const { name, email, message } = req.body;
     if(!name || !email || !message){
        return next(new AppError('Name, Email,Message are required'));
     }

     try {
        const subject = 'Contact Us Form';
        const textMessage = `${name} - ${email} <br/> ${message}`;

        await sendEmail(process.env.CONTACT_US_EMAIL, subject,textMessage);
     } catch (error) {
        console.log(error);
        return next(new AppError(error.message, 400));
     }
     res.status(200).json({
        success:true,
        message:'Your request has been submitted successsfully'
     })



})


/**
 * @USER_STATS_ADMIN
 * @ROUTE @GET {{URL}}/api/v1/admin/stats/users
 * @ACCESS Private(ADMIN ONLY)
 */

export const userStats = asyncHandler(async(_req,res, _next)=>{
    const allUsersCount = await User.countDocuments();
    const subscribedUsersCount = await User.countDocuments({
        'subscription.status':'active'
    });
    res.status(200).json({
        success: true,
        message:'All registered users count',
        allUsersCount,
        subscribedUsersCount
    })

});