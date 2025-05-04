import Link from "../models/link.model";
import User from "../models/user.model";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export default interface IDashboardControllerRequest extends Request {
  user?: any;
}

const getUserInsights = asyncHandler(
  async (req: IDashboardControllerRequest, res: Response) => {
    try {
      const userId = req.user._id;
      if (!userId) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "User ID is required"));
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
      }
      const links = await Link.find({ user: userId });
      if (!links || links.length === 0) {
        return res
          .status(404)
          .json(new ApiResponse(404, {}, "No links found for this user"));
      }
      return res
        .status(200)
        .json(new ApiResponse(200, links, "Links fetched successfully"));
    } catch (e) {
      if (e instanceof ApiError) {
        return res
          .status(e.statusCode)
          .json(new ApiResponse(e.statusCode, {}, e.message));
      }
    }
  }
);

export { getUserInsights };
