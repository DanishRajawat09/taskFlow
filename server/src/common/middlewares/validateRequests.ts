import { ZodObject } from "zod";
import type { RequestHandler } from "express"

const validateRequest = (schema: ZodObject): RequestHandler => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
    })

    if (!result.success) {
        return next(result.error)
    }

    next()
}

export default validateRequest;