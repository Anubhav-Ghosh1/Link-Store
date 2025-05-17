import user from "../models/user.model";
import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { randomUUID } from "crypto";
import { sendMail } from "../utils/mail";
import { confirmAccount } from "../template/confirm.account.template";
import mongoose from "mongoose";

export interface ILoginRequest extends Request {
  user?: any;
}

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
    console.log("Body", req.body);
    if (!email || !password || !username) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please provide all required fields"));
    }
    const existingUser = await user.findOne({ email });
    console.log("Existing User", existingUser);
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "User already exists"));
    }
    const confimationCode = randomUUID();
    const newUser = await user.create({
      email:email,
      password:password,
      username:username,
      displayName:displayName,
      confirmationCode:confimationCode,
    });
    const template = confirmAccount(
      `${process.env.CLIENT_URL}/user/confirm-account?otp=${confimationCode}&email=${email}`
    );
    console.log("Template", template);
    await sendMail(email, "Confirm your account", template);
    console.log("Email sent");
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

// const generateAccessAndRefereshTokens = async (
//   userId: mongoose.Schema.Types.ObjectId
// ) => {
//   try {
//     const userDetails = await user.findById(userId);
//     console.log("User Details 1", userDetails);
//     if (!userDetails) {
//       throw new ApiError(404, "User not found");
//     }
//     console.log("User Details 2", userDetails);
//     const accessToken = userDetails.generateAccessToken();
//     const refreshToken = userDetails.generateRefreshToken();
//     console.log("Refresh Token", refreshToken);
//     userDetails.refreshToken = refreshToken;
//     await userDetails.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "Something went wrong while generating referesh and access token"
//     );
//   }
// };

const generateAccessAndRefereshTokens = async (
  userId: mongoose.Schema.Types.ObjectId
) => {
  try {
    const userDetails = await user.findById(userId) as IUser;
    if (!userDetails) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = userDetails.generateAccessToken();
    const refreshToken = userDetails.generateRefreshToken();

    userDetails.refreshToken = refreshToken;
    await userDetails.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

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
    console.log("Query", req.query);
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

/**
 * Handles user login requests.
 *
 * This function processes the login request by validating the input fields,
 * checking for existing users, validating the password, and generating access
 * and refresh tokens. It also sets secure HTTP-only cookies for the tokens.
 *
 * @param req - The HTTP request object containing the user's login details in the body.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response indicating the success or failure of the login process.
 *          On success, it returns a 200 status with user details and tokens.
 *          On failure, it returns an appropriate error status and message.
 */
const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please provide all required fields"));
    }
    const userDetails = await user.findOne({
      $and: [{ email }], // check for username or email
    });
    if (!userDetails) {
      throw new ApiError(404, "User does not exist");
    }
    // validate password
    const checkPassword = await userDetails.isPasswordCorrect(password);
    // why we are using exisitingUser.compare insted of bcrypt.comapare is that we have created a function in the model which compares the password and it accepts the password which the user has entered and fetches the saved password from the database and this is why we are now using User(model name) or bcrypt here instead we are using user that is returned by the database
    if (!checkPassword) {
      throw new ApiError(401, "Incorrect password");
    }
    if (!userDetails.confirmed) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please confirm your account"));
    }
    console.log("User Details", userDetails);
    const { accessToken, refreshToken } = await Promise.resolve(
      generateAccessAndRefereshTokens(
        userDetails._id as mongoose.Schema.Types.ObjectId
      )
    );
    const loggedinUser = await user
      .findById(userDetails._id)
      .select("-password -refreshToken");
    // send cookies
    const options = {
      httpOnly: true,
      secure: true,
      // by default it can be modify by anyone
      // but we can make only server can modify
    };
    // response
    console.log("Token1: ", refreshToken);
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    console.log("Cookie", req.cookies);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loggedinUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (e) {
    if (e instanceof ApiError) {
      return res
        .status(e.statusCode)
        .json(new ApiResponse(e.statusCode, {}, e.message));
    }
  }
});

/**
 * Handles user logout requests.
 *
 * This function processes the logout request by clearing the refresh token
 * from the user's record and removing the refresh token cookie from the response.
 *
 * @param req - The HTTP request object containing the user's details in the request.
 * @param res - The HTTP response object used to send the response back to the client.
 *
 * @returns A JSON response indicating the success or failure of the logout process.
 *          On success, it returns a 200 status with a success message.
 *          On failure, it returns an appropriate error status and message.
 */
const logout = asyncHandler(async (req: ILoginRequest, res: Response) => {
  try {
    const userDetails = await user.findById(req.user._id);
    if (!userDetails) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }
    userDetails.refreshToken = "";
    await userDetails.save();
    res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (e) {
    if (e instanceof ApiError) {
      return res
        .status(e.statusCode)
        .json(new ApiResponse(e.statusCode, {}, e.message));
    }
  }
});

const getUserDetails = asyncHandler(
  async (req: ILoginRequest, res: Response) => {
    try {
      const userDetails = await user
        .findById(req.user._id)
        .select("-password -refreshToken");
      if (!userDetails) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: userDetails },
            "User details fetched successfully"
          )
        );
    } catch (e) {
      if (e instanceof ApiError) {
        return res
          .status(e.statusCode)
          .json(new ApiResponse(e.statusCode, {}, e.message));
      }
    }
  }
);

export { signup, confirmUserAccount, login, logout, getUserDetails };
