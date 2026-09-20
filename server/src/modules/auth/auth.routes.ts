import Router from "express";
import  * as authController  from "./auth.controller.js";
import { signUpSchema } from "./auth.validation.js";

import validateRequest from "../../common/middlewares/validateRequests.js";

const router = Router();

router.route("/sign-up").post( 
    validateRequest(signUpSchema),
    authController.signUp)

export default router;