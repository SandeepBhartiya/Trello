import { NextFunction, Request, Response } from "express";  
import { TokenPayload } from "./utils";
import jwt from "jsonwebtoken";
export const authMiddleWare=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        req.body = req.body || {};
        // console.log("req.headers",req.headers.authorization,req.headers.authorization?.split(" ")[1]);
        const authHeader=req.headers.authorization; //can be change if auth is provided in different part of request
        const token=authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
        if(!token)
        {
            return res.status(401).send("No Token Provided");
        }
        const secret=process.env.JWT_SECRET;
        if(!secret){
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded=jwt.verify(token,secret) as TokenPayload;
        req.body.userId=decoded.userId;
        next();
    }catch(err){
        console.log("Error",err);
        return res.status(401).send("Invalid or expired token" );
    }
}