import React from "react";
import Layout from "../Layout/Layout";
import homePageMainImage from "../Assets/homePageMainImage.png";
import { Link } from "react-router-dom";

const HomePage = ()=>{
    return (
        <Layout>
            <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
                {/* for platform detais */}
                <div className="text-5xl font-semibold my-3">
                    <h1>
                    Find out best{" "}
                    <span className="text-yellow-500 font-bold my-3">Online Courses</span>
                    </h1>
                    <p className="text-xl text-gray-200 my-3">We have a large library of courses taught by highly skilled and qualified facultites at a very affordable cost.
                    </p>
                    {/* for buttons */}

                    <div className="sapce-x-6 flex gap-x-4"> 
                    <Link to={"/courses"}>
                        <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out">
                        Explore Courses
                        </button>
                    </Link>
                    <Link to={"/contact"}>
                        <button className=
                        "border border-yelloe-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:border-yellow-600 transition-all ease-in-out duration-300">
                         Contact Us
                        </button>
                    </Link>
                    </div>

                </div>

                {/* right section for image */}
                <div className="w-1/2 flex items-center justify-center">
                    <img src= {homePageMainImage}
                    alt="home page image"/>

                </div>
            </div>
        </Layout>
    );
};

export default HomePage;