import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("", postController.getAll);
router.get(
  "/my",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  postController.getMyPosts,
);
export const postRouter = router;
