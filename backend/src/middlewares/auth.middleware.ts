import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { JwtPayload } from "jsonwebtoken";
import JWT from "jsonwebtoken";

export interface IAuthRequest extends Request {
    user?: any;
}

export const verifyJWT = asyncHandler(async(req: IAuthRequest,res: Response,next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","");
        console.log("Token 2",accessToken);
    
        if(!accessToken)
        {
            throw new ApiError(401,"Unauthorized request");
        }
        const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
        const decodedToken = JWT.verify(accessToken,process.env.JWT_SECRET as string);
        const payload = decodedToken as JwtPayload & { _id: string };
        const user = await User.findById(payload?._id).select("-password -refreshToken");
        if(!user)
        {
            // Discuss about frontend
            throw new ApiError(401,"Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        const errorMessage = (error as Error)?.message ?? "Invalid token";
        throw new ApiError(401, errorMessage);
    }
})