import Router from "express";
import  * as authController  from "./auth.controller.js";
import { logInSchema, signUpSchema } from "./auth.validation.js";

import validateRequest from "../../common/middlewares/validateRequests.js";

const router = Router();

router.route("/sign-up").post( 
    validateRequest(signUpSchema),
    authController.signUp)
router.route("/log-in").post( 
    validateRequest(logInSchema),
    authController.logIn)

export default router;