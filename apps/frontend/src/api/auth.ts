import { apiClient } from "./client";
import type { User } from "../types";

interface AuthResponse {
    user: User;
    token: string;
}

export const signup=(email:string,username:string,password:string)=>
    apiClient<AuthResponse>("/signup",{
        method:"POST",
        body:{email,username,password}
    });

export const signin=(email:string,password:string)=>
    apiClient<AuthResponse>("/signin",{
        method:"POST",
        body:{email,password}
    });