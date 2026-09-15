import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({children}:{children:ReactNode}){
    const {user, loading}=useAuth();
    if(loading){
        return null;
    }

    if(!user){
        return <Navigate to="/signin" replace/>;
    }
    return <>{children}</>;
}