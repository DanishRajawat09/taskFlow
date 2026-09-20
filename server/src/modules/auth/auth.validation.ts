import { z } from "zod";


export const signUpSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(3).max(50),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain an uppercase letter")
            .regex(/[a-z]/, "Password must contain a lowercase letter")
            .regex(/\d/, "Password must contain a number")
            .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
    }).strict()
});


export const logInSchema = z.object({
    body: z.object({
        email: z.string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
               password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain an uppercase letter")
            .regex(/[a-z]/, "Password must contain a lowercase letter")
            .regex(/\d/, "Password must contain a number")
            .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
    }).strict()
});
