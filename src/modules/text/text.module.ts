import { Router } from "express";
import { AuthMiddleWare } from "../auth/auth.middleware";
import { TextController } from "./text.controller";

const router = Router();

const textController = new TextController();
const authMiddleware = new AuthMiddleWare();

router.post(
  "/add",
  authMiddleware.auth.bind(authMiddleware),
  textController.addNewTextList.bind(textController)
);

router.post(
  "/element/update",
  authMiddleware.auth.bind(authMiddleware),
  textController.updateTextElementById.bind(textController)
);

router.get(
  "/get/all",
  authMiddleware.auth.bind(authMiddleware),
  textController.getAllLoggedInUserText.bind(textController)
);

export { router as textModule };
