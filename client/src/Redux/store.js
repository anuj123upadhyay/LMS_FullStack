import {configureStore } from  "@reduxjs/toolkit";
import authSliceReducer from "../Redux/authSlice";
import courseSliceReducer from "../Redux/courseSlice";
import lectureSliceReducer from "../Redux/lectureSlice";
import razorpaySliceReducer from "../Redux/razorpaySlice";
import statSliceReducer from "../Redux/statsSlice";

const store = configureStore({
    reducer:{
        auth:authSliceReducer,
        course:courseSliceReducer,
        lecture: lectureSliceReducer,
        razorpay: razorpaySliceReducer,
        stat : statSliceReducer
    }
});
export default store; 