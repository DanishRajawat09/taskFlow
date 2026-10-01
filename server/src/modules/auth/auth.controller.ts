import type { CookieOptions, Request, Response } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { logInService, logOutService, signUpService } from "./auth.service.js";
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
    const ACCESS_COOKIE_OPTIONS = cookieOption(15 * 60 * 1000, "none");

    const response = ApiResponse.success({
      statusCode: 201,
      data: { userData },
      message: "User registered successfully",
    });

    res
      .cookie("AccessToken", accessToken, ACCESS_COOKIE_OPTIONS)
      .cookie("RefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
      .status(201)
      .json(response);
  },
);

export const logIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, ...userData } = await logInService({
      email,
      password,
    });

    const response = ApiResponse.success({
      statusCode: 200,
      data: {
        userData,
        accessToken,
      },
      message: "User Logged in successfully",
    });

    const REFRESH_COOKIE_OPTIONS = cookieOption(
      7 * 24 * 60 * 60 * 1000,
      "none",
    );
    const ACCESS_COOKIE_OPTIONS = cookieOption(15 * 60 * 1000, "none");

    res
      .cookie("AccessToken", accessToken, ACCESS_COOKIE_OPTIONS)
      .cookie("RefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
      .status(200)
      .json(response);
  },
);

export const logOut = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    await logOutService(userId);

    const response = ApiResponse.success({
      statusCode: 200,
      data: {},
      message: "User Logged Out successfully",
    });

    const REFRESH_COOKIE_OPTIONS = cookieOption(
      7 * 24 * 60 * 60 * 1000,
      "none",
    );
    const ACCESS_COOKIE_OPTIONS = cookieOption(15 * 60 * 1000, "none");

    res
      .clearCookie("AccessToken", ACCESS_COOKIE_OPTIONS)
      .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
      .status(200)
      .json(response);
  },
);
