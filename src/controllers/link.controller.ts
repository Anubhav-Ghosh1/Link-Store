import User from "../models/user.model";
import Link from "../models/link.model";
import Tracking from "../models/tracking.model";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export default interface ILinkControllerRequest extends Request {
  user?: any;
}

/**
 * Handles the creation of a new link.
 *
 * @param req - The HTTP request object containing the link details in the body.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response indicating the success or failure of the link creation process.
 *          On success, it returns a 201 status with the created link data.
 *          On failure, it returns an appropriate error status and message.
 */

const createLink = asyncHandler(
  async (req: ILinkControllerRequest, res: Response) => {
    try {
      let { url, title, logo } = req.body;
      const userId = req.user._id;

      if (!url) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Please provide all required fields"));
      }
      if (!logo) {
        logo = undefined;
      }
      if (!title) {
        title = undefined;
      }

      const newLink = await Link.create({
        user: userId,
        url,
        title,
        logo,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, newLink, "Link created successfully"));
    } catch (e) {
      if (e instanceof ApiError) {
        return res
          .status(e.statusCode)
          .json(new ApiResponse(e.statusCode, {}, e.message));
      }
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Internal server error"));
    }
  }
);

export { createLink };
