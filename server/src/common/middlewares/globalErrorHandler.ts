import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues,
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError ) {
        return res.status(400).json({
            success: false,
            message: "Database Error",
            errors: err.message,
        });
    }

    res.status(statusCode).json({
        success: false,
        message,
    })
}

    export default globalErrorHandler