import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("", userController.getUsers);
router.get(
  "/me",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  userController.getMe,
);
router.delete(
  "/me",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  userController.deleteMe,
);
router.put(
  "/me",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.put("/me/upgrade-premium", authMiddleware.verifyToken(ETokenType.ACCESS), userController.upgradeToPremium)
router.get("/:id", commonMiddleware.isIdValid, userController.getUser);
export const userRouter = router;
