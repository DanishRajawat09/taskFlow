import type { Role } from "@prisma/client";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/middlewares/generateTokens.js";
import ApiError from "../../common/utils/apiError.js";
import cookieOption from "../../common/utils/cookiesOptions.js";
import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";

export const signUpService = async ({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}): Promise<{
  id: string;
  email: string;
  fullName: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}> => {
  const exitingUser = await prisma.user.findUnique({ where: { email } });
  if (exitingUser) {
    throw new ApiError({
      statusCode: 409,
      message: "User with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

 const { user, refreshToken } =
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    const hashedRefreshToken =
      await bcrypt.hash(refreshToken, 10);

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    return {
      user,
      refreshToken,
    };
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  return { ...user, accessToken, refreshToken };
};


type LoginServiceResponse = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};

export const logInService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginServiceResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  const hashedRefreshToken = await bcrypt.hash(
    refreshToken,
    10
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  const { password: _password, ...safeUser } = user;

  return {
    ...safeUser,
    accessToken,
    refreshToken,
  };
};


export const logOutService = async (id:string):Promise<void> => {
  await prisma.user.update({
    where : {id : id} , data : {refreshToken : null}
  });
};
