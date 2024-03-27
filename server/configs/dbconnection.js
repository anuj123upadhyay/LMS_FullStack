import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

mongoose.set("strictQuery", false);

const connectToDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        if(connectionInstance){
            console.log(`Connected to DB : ${connectionInstance.connection.host}`)
        }
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
}


export default connectToDB;