import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { postMiddleware } from "../middlewares/postMiddleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.post(
  "",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(CarValidator.create),
  postMiddleware.checkBasicAccountPostLimit,
  postMiddleware.calculatePrices,
  postController.saveCar,
);
router.post(
  "/:id/view",
  commonMiddleware.isIdValid,
  postMiddleware.isPostExists,
  postController.saveView,
);
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
  postMiddleware.isPostExistsAnsBelongsToUser,
  postController.getPrivatePostById,
);
router.get(
  "/my/info/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isPremiumAccount,
  commonMiddleware.isIdValid,
  postMiddleware.isPostExists,
  postController.getPostInfo,
);
router.get(
  "/profanity-detected",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  postController.getPostsWithProfanity,
);
router.get(
  "/profanity-detected/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  commonMiddleware.isIdValid,
  postController.getPostWithProfanityById,
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
  postMiddleware.isPostExistsAnsBelongsToUser,
  postController.deletePostById,
);
router.delete(
  "/my/forever/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isPostExistsAnsBelongsToUser,
  postController.deleteForeverPostById,
);
router.put(
  "/my/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isPostNotDeletedAndActive,
  commonMiddleware.isBodyValid(CarValidator.update),
  commonMiddleware.validatePriceAndCurrency,
  postMiddleware.calculatePrices,
  postController.updatePost,
);
router.put(
  "/my/restore/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isPostDeletedAndNotActive,
  postController.restorePost,
);

router.patch(
  "/my/resubmit-after-profanity/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isIdValid,
  postMiddleware.isResubmissionAllowed,
  commonMiddleware.isBodyValid(CarValidator.updateAfterProfanity),
  postController.updatePostAfterProfanity,
);
export const postRouter = router;
