import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { ApiError } from "./errors/api-error";
import { authRouter } from "./routers/auth.router";
import { carRouter } from "./routers/car.router";
import { postRouter } from "./routers/post.router";
import { userRouter } from "./routers/user.router";
import {runCronJobs} from "./crons";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/posts", postRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 500).json(err.message);
  },
);

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  process.exit(1);
});

app.listen(config.PORT, config.HOST, async () => {
  await mongoose.connect(config.MONGO_URL, {});
  runCronJobs();
  console.log(`Server is running at http://${config.HOST}:${config.PORT}/`);
});
