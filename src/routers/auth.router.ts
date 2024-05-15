import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authMiddleware.isEmailExist,
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleware.verifyToken(ETokenType.REFRESH),
  authController.refresh,
);

export const authRouter = router;
