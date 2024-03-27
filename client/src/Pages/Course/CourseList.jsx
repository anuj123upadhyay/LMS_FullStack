import React,{useEffect } from "react";
import {useDispatch , useSelector} from "react-redux";
import CourseCard from "../../Components/CourseCard";
import Layout from "../../Layout/Layout";
import { getAllCourses} from "../../Redux/courseSlice";

const Courses = ()=>{
    const dispatch = useDispatch();
    const { coursesData } = useSelector((state)=> state.course);
    console.log(coursesData);
    
    useEffect(()=>{
        (async ()=>{
            await dispatch(getAllCourses());
        })();// these are iffe
    },[])

    return (
        <Layout>
            {/* courses container for displaying the card */}
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col flex-wrap gap-10 text-white">
                <h1 className="text-cenwter text-3xl font-semibold">
                    Explore the courses made by {" "}
                    <span className="font-bold text-yellow-500">Industry Experts

                    </span>
                </h1>
            {/* wrapper for courses card */}
            <div className="mb-10 flex flex-wrap gap-14">
                {coursesData?.map((element)=>{
                    return <CourseCard key={element._id} data={element}/>
                })}

            </div>
            </div>
        </Layout>
    )

};

export default Courses;
