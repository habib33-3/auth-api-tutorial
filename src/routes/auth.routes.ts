import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schema/auth.schema";
import { createSessionHandler } from "../controller/auth.controller";

const router = Router();

router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default router;
