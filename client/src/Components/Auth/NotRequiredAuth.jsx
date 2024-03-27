import React from 'react'

import {useSelector} from "react-redux";
import { Navigate, Outlet} from "react-router-dom"

const NotRequiredAuth =()=> {
    const {isLoggedIn} = useSelector((state)=>state?.auth)
  return isLoggedIn ? <Navigate to={"/"} replace/> : <Outlet/>
   
}

export default NotRequiredAuth;
