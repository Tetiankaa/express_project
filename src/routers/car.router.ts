import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {CarValidator} from "../validators/car.validator";

const router = Router();

router.post(
  "",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.saveCar,
);
export const carRouter = router;
