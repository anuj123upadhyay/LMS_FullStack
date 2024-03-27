import jwt from  "jsonwebtoken";

import AppError from "../utils/appError.js"
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";

export const isLoggedIn = asyncHandler(async (req, _res, next)=>{
   try {
     
    const  token  = req.cookies?.token;
    // console.log(`token: ${token}`)
  
    
    if (!token) {
      return next(new AppError("Unauthorized tokrn, please login to continue", 401));
    }
  
    
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`decoded: ${decoded.id}`)
  
    
    if (!decoded) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }
    const user = await User.findById(decoded?.id)
    // console.log(`user : ${user}`)
    if (!user) {
        // discuss about frontend
        throw new AppError( "Invalid Access Token",401)
    }

    req.user = user;
  
    
    next();
   } catch (error) {
    throw new AppError(401, error?.message || "Invalid  token")
}
   
  });
  

export const authorizeRoles = (...roles)=>{
    return asyncHandler(async (req,_res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new AppError("you do nothave permission to view this route", 403)
            )
            }
        next()
    })
}

export const authorizeSubscribers = asyncHandler(async (req,_res, next)=>{
    if(req.user.role !== 'ADMIN' && req.user.subscription.status !== 'active'){
        return next(new AppError("Please subscribe to access this Router.",403))

    }

    next()
})






