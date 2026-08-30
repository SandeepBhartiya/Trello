import jwt from "jsonwebtoken";


export interface TokenPayload{
    userId:number
}
export const signToken=(payload:TokenPayload)=>{
    const secret=process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload,secret,{expiresIn:"7d"})
}
    