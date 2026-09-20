import type { CookieOptions, Request, Response } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { signUpService } from "./auth.service.js";
import cookieOption from "../../common/utils/cookiesOptions.js";
import ApiResponse from "../../common/utils/apiResponse.js";

export const signUp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, fullName } = req.body;

    const { accessToken, refreshToken, ...userData } = await signUpService({
      email,
      password,
      fullName,
    });

    const REFRESH_COOKIE_OPTIONS = cookieOption(
      7 * 24 * 60 * 60 * 1000,
      "none",
    );

    const response = ApiResponse.success({
      statusCode: 201,
      data: { userData, accessToken },
      message: "User registered successfully",
    });

    res
      .cookie("RefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
      .status(201)
      .json(response);
  },
);
