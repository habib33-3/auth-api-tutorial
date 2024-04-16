import { Router } from "express";
import user from "./user.routes";
import auth from "./auth.routes";

const router = Router();

router.get("/health-check", (_, res) => {
  res.status(200);
});

router.use(user);
router.use(auth);

export default router;
