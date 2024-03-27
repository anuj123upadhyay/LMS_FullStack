import app from "./app.js";
import {v2} from 'cloudinary';
import Razorpay from 'razorpay';
import connectToDB from "./configs/dbconnection.js";

//cloudinary configuration
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// Razorpay configuration
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})


const PORT = process.env.PORT || 5051;

app.listen(PORT, async()=>{
    await connectToDB();
    console.log(`App is running at  http://localhost:${PORT}`);
})








