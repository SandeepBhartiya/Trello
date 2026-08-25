import { NextFunction, Request, Response } from "express";  
import { TokenPayload } from "./utils";
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY=process.env.JWT_SECRET!;
export const authMiddleWare=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        req.body = req.body || {};
        // console.log("req.headers",req.headers.authorization,req.headers.authorization?.split(" ")[1]);
        const token=req.headers.authorization; //can be change if auth is provided in different part of request
        if(!token)
        {
            return res.status(401).send("No Token Provided");
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET) as TokenPayload;
        req.body.userId=decoded.userId;
        next();
    }catch(err){
        console.log("Error",err);
        return res.status(401).send("Invalid or expired token" );
    }
}