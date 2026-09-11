import {createContext,useContext,useState,useEffect,type ReactNode} from "react";
import type{User} from "../types";

interface AuthContextValue {
    user:User|null;
    token:string|null;
    login:(user:User,token:string)=>void;
    logout:()=>void;
}

const AuthContext=createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({children}:{children:ReactNode}){
    const [user,setUser]=useState<User|null>(null);
    const [token,setToken]=useState<string|null>(null);

    useEffect(()=>{
        const storedToken=localStorage.getItem("token");
        const storedUser=localStorage.getItem("user");
        if(storedUser && storedToken){
            try{
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }catch{
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }  
    },[]);

    const login=(user:User,token:string)=>{
        setUser(user);
        setToken(token);
        localStorage.setItem("user",JSON.stringify(user));
        localStorage.setItem("token",token);
    }

    const logout=()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth(){
    const ctx=useContext(AuthContext);
    if(!ctx){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
