import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { postMiddleware } from "../middlewares/postMiddleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.get("", postController.getAll);
router.get(
  "/my",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  postController.getMyPosts,
);
router.get(
  "/my/archive",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  postController.getMyArchivePosts,
);
router.get(
  "/my/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postController.getPrivatePostById,
);
router.get(
  "/:id",
  commonMiddleware.isIdValid,
  postController.getPublicPostById,
);
router.delete(
  "/my/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postController.deletePostById,
);
router.put(
  "/my/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isPostNotDeletedAndActive,
  commonMiddleware.isBodyValid(CarValidator.update),
  postController.updatePost,
);
router.put(
  "/my/restore/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isPostDeletedAndNotActive,
  postController.restorePost,
);

export const postRouter = router;
