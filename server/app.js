config()
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {config } from "dotenv";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js"

const app = express()

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended :true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser());

//Server status check route

app.get('/ping',(_req,res)=>{
    res.send("PONG");

});

//Import all routes
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js"
import paymentRoutes from './routes/payment.routes.js'
import miscRoutes from './routes/other.routes.js'





app.use('/api/v1/user', userRoutes);

app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/', miscRoutes)




//Default catch all routes -404

app.all('*',(_req,res)=>{
    res.status(404).send('OOPS!! 404 Page Not Found');
})
//custom error handling middleware
app.use(errorMiddleware)



export default app;