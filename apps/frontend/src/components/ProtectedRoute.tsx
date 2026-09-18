import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "./NavBar";
export default function ProtectedRoute({children}:{children:ReactNode}){
    const {user, loading}=useAuth();
    if(loading){
        return null;
    }

    if(!user){
        return <Navigate to="/signin" replace/>;
    }
    return <> 
        <Navbar />
        {children}
    </>;
}