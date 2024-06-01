import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { EActionTokenType } from "../enums/action-token-type.enum";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.register),
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
router.post(
  "/create-manager",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdmin,
  authMiddleware.isEmailExist,
  commonMiddleware.isBodyValid(UserValidator.createManager),
  authController.createManagerAccount,
);
router.put(
  "/setup-password-manager",
  authMiddleware.verifyActionToken(EActionTokenType.SETUP_MANAGER),
  commonMiddleware.isBodyValid(UserValidator.setPassword),
  authController.setManagerPassword,
);
router.put(
  "/change-password",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authController.changePassword,
);
router.post("/forgot-password")
export const authRouter = router;
