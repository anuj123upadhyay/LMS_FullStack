import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import {AiOutlineArrowLeft} from "react-icons/ai";
import Layout from "../../Layout/Layout";
import { getUserData, updateProfile } from '../../Redux/authSlice';
import { useState } from 'react';

const EditProfile = () => {
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState("");
    const [data,setData] = useState({
        fullName:"",
        avatar:undefined,
        userId:useSelector((state)=> state?.auth?.data?._id),

    });

    //function to handle the image

    const getImage = (event)=>{
        event.preventDefault();
        //getting the image
        const uploadedImage = event.target.files[0];

        //if image exist then getting the url link of it
        if(uploadedImage){
            setData({
                ...data,
                avatar:uploadedImage,
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function (){
                setPreviewImage(this.result)
            });
        }
    };

    //function to set the name of user 
    const setName = (event)=>{
        const {name,value} = event.target;
        const newUserData = {
            ...data,
            [name]:value
        };
        setData(newUserData)
    };

    const handleFormSubmit = async (event)=>{
        event.preventDefault();
        //checking if the fields are empty
        if(!data.fullName || !data.avatar){
            toast.error("All fields are mandatory");
            return;
        }

        //checking the length of names
        if(data.fullName.length<5){
            toast.error("Name must be more than 5 characters");
            return;
        }

        //creating the form data from the existing data
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("avatar",data.avatar)

        const newUserData= [data.userId, formData];

        //dispatching the api call using the thunk
        await dispatch(updateProfile(newUserData));

        //fetching the data to update
        await dispatch(getUserData());

    }



  return (
    <Layout>
      <div className='flex items-center justify-center h-[100vh]'>
        <form 
        onSubmit={handleFormSubmit}
        className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
           <h1 className="text-center text-2xl font-bold">Edit Profile Page</h1> 

            {/* input for image file */}
            <label 
            className="cursor-pointer"
            htmlFor="image_uploads">{previewImage ?( 
                <img 
                className='w-28 h-28 rounded-full m-auto'
                src={previewImage} alt="previewImage" />
            ):(
                <BsPersonCircle
                className='w-28 h-28 rounded-full m-auto'/>
            )}</label>
            <input 
            onChange={getImage}
            className='hidden'

            type="file" 
            id="img_uploads"
            name="img_uploads"
            accept='.jpg,.jpeg,.png'
            />

            <div className='flex flex-col gap-1'>
                <label 
                className="text-lg
                font-semibold" htmlFor="fullName">
                    Full Name
                </label>
                <input 
                required
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Enter your full name"
                className="bg-transparent px-2 py-1 border"
                value={data.fullName}
                onChange={setName} />
            </div>
            <Link to={"/user/profile"} >
                <p className='link text-accent cursor-pointer flex items-center justify-center w-full gap-2'>
                    <AiOutlineArrowLeft/>Back to profile
                </p>
            </Link>
            <button className='w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer'
            type='submit'>
                Update Profile
            </button>
        </form>

      </div>
    </Layout>
  );
};

export default EditProfile;
