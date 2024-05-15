import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { ETokenType } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "",
  authMiddleware.verifyToken(ETokenType.ACCESS),
  carController.saveCar,
);
export const carRouter = router;
