import type { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../../config/env.js";
import { prisma } from "../../config/db.js";
import type { Role } from "@prisma/client";
export type authPayload = {
  userId: string;
  email: string;
  role: Role;
};

const checkAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token =
      req.cookies?.["accessToken"] ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError({ statusCode: 401, message: "Unauthorize User" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET) as authPayload;
    } catch (error) {
      throw new ApiError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        message: "Unauthorize user not found",
      });
    }

    req.user = { userId: user.id, email: user.email, role: user.role };

    next();
  },
);

export { checkAuthentication };
