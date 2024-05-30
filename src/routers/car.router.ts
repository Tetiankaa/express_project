import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.post(
  "",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.saveCar,
);

router.get("/currencies", carController.getCurrencies);
router.get("/brands", carController.getBrands);
router.post(
  "/brands",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  commonMiddleware.isBodyValid(CarValidator.createMissingBrandModel),
  carController.createBrandOrModel,
);
router.post(
  "/report-missing-brand-model",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(CarValidator.reportMissingBrandModel),
  carController.reportMissingBrandModel,
);
router.get(
  "/suggestions",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  carController.getCarSuggestions,
);
router.get(
  "/suggestions/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  commonMiddleware.isIdValid,
  carController.getCarSuggestion,
);
router.patch(
  "/suggestions/:id",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  authMiddleware.isAdminOrManager,
  commonMiddleware.isIdValid,
  carController.toggleCarSuggestionResolution,
);
export const carRouter = router;
