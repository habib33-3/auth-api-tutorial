import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import {
  createUserHandler,
  forgotPasswordHandler,
  verifyUserHandler,
} from "../controller/user.controller";

const router = Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/api/user/forgot-password/",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

export default router;
