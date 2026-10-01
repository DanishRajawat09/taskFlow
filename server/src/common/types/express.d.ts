import type { Role } from "@prisma/client"
import type { authPayload } from "../middlewares/auth.ts"

declare global {
    namespace Express {
        interface Request {
            user? : authPayload
        }
    } 
}