import user from "../models/user.model";
import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { randomUUID } from "crypto";
import { sendMail } from "../utils/mail";
import { confirmAccount } from "../template/confirm.account.template";

/**
 * Handles user signup requests.
 *
 * This function processes the signup request by validating the input fields,
 * checking for existing users, creating a new user, and generating access and refresh tokens.
 * It also sets a secure HTTP-only cookie for the refresh token.
 *
 * @param req - The HTTP request object containing the user's signup details in the body.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response indicating the success or failure of the signup process.
 *          On success, it returns a 201 status with a success message.
 *          On failure, it returns an appropriate error status and message.
 */
const signup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, username, displayName } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please provide all required fields"));
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "User already exists"));
    }
    const confimationCode = randomUUID();
    const newUser = await user.create({
      email,
      password,
      username,
      displayName,
      confimationCode,
    });
    const template = confirmAccount(
      `${process.env.CLIENT_URL}/confirm-account?otp=${confimationCode}&email=${email}`
    );
    await sendMail(email, "Confirm your account", template);
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "User created successfully"));
  } catch (e) {
    if (e instanceof ApiError) {
      return res
        .status(e.statusCode)
        .json(new ApiResponse(e.statusCode, e.message));
    }
  }
});

/**
 * Confirms a user's account by verifying the provided OTP (One-Time Password) and email.
 *
 * @async
 * @function confirmUserAccount
 * @param {Request} req - The HTTP request object containing the OTP and email in the body.
 * @param {Response} res - The HTTP response object used to send the response.
 *
 * @description
 * This function validates the OTP and email provided in the request body. If the OTP matches
 * the user's confirmation code stored in the database, the user's account is marked as confirmed.
 * The confirmation code is then removed from the user's record. If any validation fails, an
 * appropriate error response is returned.
 *
 * @returns {Promise<void>} Sends an HTTP response with the following:
 * - 200: If the account is successfully confirmed, with a success message.
 * - 400: If required fields are missing, the user is not found, or the OTP is invalid.
 * - Custom error response if an `ApiError` is thrown.
 */
const confirmUserAccount = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { otp, email } = req.query;
    if (!otp || !email) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please provide all required fields"));
    }
    const userDetails = await user.findOne({ email });
    if (!userDetails) {
      return res.status(400).json(new ApiResponse(400, "User not found"));
    }
    if (userDetails.confirmationCode !== otp) {
      return res.status(400).json(new ApiResponse(400, "Invalid OTP"));
    }
    userDetails.confirmed = true;
    userDetails.confirmationCode = undefined;
    await userDetails.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User account confirmed successfully"));
  } catch (e) {
    if (e instanceof ApiError) {
      return res
        .status(e.statusCode)
        .json(new ApiResponse(e.statusCode, e.message));
    }
  }
});

export { signup, confirmUserAccount };
