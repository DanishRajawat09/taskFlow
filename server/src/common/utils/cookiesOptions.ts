import type { CookieOptions } from "express";
import { NODE_ENV } from "../../config/env.js";

const cookieOption = (
  maxAge: number,
  sameSite: CookieOptions["sameSite"] = "none"
): CookieOptions => {
  return {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge,
    sameSite,
  };
};

export default cookieOption;