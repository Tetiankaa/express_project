import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";

const router = Router();

router.get("", postController.getAll);
router.get(
  "/my",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  postController.getMyPosts,
);
router.get("/my/:id",authMiddleware.verifyToken(ETokenType.ACCESS), commonMiddleware.isIdValid ,postController.getPrivatePostById)
router.get("/:id", commonMiddleware.isIdValid ,postController.getPublicPostById)
router.delete("/my/:id",authMiddleware.verifyToken(ETokenType.ACCESS), commonMiddleware.isIdValid, postController.deletePostById)
export const postRouter = router;
