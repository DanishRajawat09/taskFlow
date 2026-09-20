import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../../common/middlewares/generateTokens.js";
import ApiError from "../../common/utils/apiError.js";
import cookieOption from "../../common/utils/cookiesOptions.js";
import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";




export const signUpService = async ({ email, password, fullName }: { email: string; password: string; fullName: string }): Promise<{ id: string; email: string; fullName: string; accessToken: string | undefined; refreshToken: string | undefined;  }> => {
    const exitingUser = await prisma.user.findUnique({ where: { email } });
    if (exitingUser) {
        throw new ApiError({ statusCode: 409, message: "User with this email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await prisma.user.create({
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


    const accessToken = generateAccessToken({
        userId: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
    });

    const refreshToken = generateRefreshToken({
        userId: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
    });

    return { ...userData, accessToken, refreshToken,  };
};




export const logInService = async ({ email, password }: { email: string; password: string }): Promise<{ id: string; email: string; fullName: string; accessToken: string; refreshToken: string;  }> => {
 
const userData = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, fullName: true, password: true, role: true } });
if (!userData) {
    throw new ApiError({ statusCode: 401, message: "Invalid email or password" });
}

const isPasswordMatch = await bcrypt.compare(password, userData.password);
if (!isPasswordMatch) {
    throw new ApiError({ statusCode: 401, message: "Invalid email or password" });
}

const accessToken = generateAccessToken({
    userId: userData.id,
    email: userData.email,
    fullName: userData.fullName,
    role: userData.role,
});

const refreshToken = generateRefreshToken({
    userId: userData.id,
    email: userData.email,
    fullName: userData.fullName,
    role: userData.role,
});

const { password: _, ...safeUser } = userData;
return { ...safeUser, accessToken, refreshToken,  };
}