import User from "../models/user.model";
import Link from "../models/link.model";
import Tracking from "../models/tracking.model";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import QRCode from "qrcode";

export default interface ILinkControllerRequest extends Request {
  user?: any;
}

export const generateQRCode = async (url: string) => {
  return await QRCode.toDataURL(url);
};

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

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: { socialLinks: newLink._id },
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

/**
 * Handles the deletion of a link.
 *
 * @param req - The HTTP request object containing the link ID in the parameters.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response indicating the success or failure of the link deletion process.
 *          On success, it returns a 200 status with a success message.
 *          On failure, it returns an appropriate error status and message.
 */

const deleteLink = asyncHandler(
  async (req: ILinkControllerRequest, res: Response) => {
    try {
      const { linkId } = req.params;
      const userId = req.user._id;

      if (!linkId) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Please provide all required fields"));
      }

      const link = await Link.findById(linkId);
      if (!link) {
        return res.status(404).json(new ApiResponse(404, {}, "Link not found"));
      }

      if (link.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json(
            new ApiResponse(
              403,
              {},
              "You are not authorized to delete this link"
            )
          );
      }

      const updateUser = await User.findByIdAndUpdate(userId, {
        $pull: { socialLinks: linkId },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Link deleted successfully"));
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

interface ILink {
  url?: string;
  title?: string;
  logo?: string;
}

const updateLink = asyncHandler(
  async (req: ILinkControllerRequest, res: Response) => {
    try {
      const { linkId } = req.params;
      const userId = req.user._id;
      const { url, title, logo } = req.body;
      if (!linkId) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Please provide all required fields"));
      }

      let updatedDetails: ILink = {};
      if (url) {
        updatedDetails.url = url;
      }
      if (title) {
        updatedDetails = { ...updatedDetails, title };
      }
      if (logo) {
        updatedDetails = { ...updatedDetails, logo };
      }

      const link = await Link.findById(linkId);
      if (!link) {
        return res.status(404).json(new ApiResponse(404, {}, "Link not found"));
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
      }

      if (
        Array.isArray(user.socialLinks) &&
        user.socialLinks.includes(linkId)
      ) {
        const updatedLink = await Link.findByIdAndUpdate(
          linkId,
          { ...updatedDetails },
          { new: true }
        );
        if (!updatedLink) {
          return res
            .status(404)
            .json(new ApiResponse(404, {}, "Link not found"));
        }
        return res
          .status(200)
          .json(new ApiResponse(200, updatedLink, "Link updated successfully"));
      } else {
        return res
          .status(403)
          .json(
            new ApiResponse(
              403,
              {},
              "You are not authorized to update this link"
            )
          );
      }
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

const getUserLinks = asyncHandler(
  async (req: ILinkControllerRequest, res: Response) => {
    try {
      const { username } = req.params;
      if (!username) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Please provide all required fields"));
      }
      const user = await User.findOne({ username })
        .select("socialLinks")
        .populate("socialLinks");
      if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
      }
      if (user.socialLinks.length === 0) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], "User has no links"));
      }
      console.log(user);
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User links fetched successfully"));
    } catch (e) {
      if (e instanceof ApiError) {
        return res
          .status(e.statusCode)
          .json(new ApiResponse(e.statusCode, {}, e.message));
      }
    }
  }
);
/**
 * Handles the generation of a QR code for the user's profile URL.
 *
 * @param req - The HTTP request object containing the user details.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response containing the generated QR code data URL.
 */
export const getQRCode = asyncHandler(
  async (req: ILinkControllerRequest, res: Response) => {
    try {
      const baseUrl = process.env.FRONTEND_URL;
      const profileUrl = `${baseUrl}/@${req.user?.username}`;
      const qr = await generateQRCode(profileUrl);
      return res
        .status(200)
        .json(new ApiResponse(200, qr, "QR code generated successfully"));
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

export { createLink, deleteLink, updateLink, getUserLinks };
