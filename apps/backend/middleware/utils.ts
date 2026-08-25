import jwt from "jsonwebtoken";

// const JWT_SECRET_KEY=process.env.JWT_SECRET;

export interface TokenPayload{
    userId:string
}
export const signToken=(payload:TokenPayload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"7d"})
}
    