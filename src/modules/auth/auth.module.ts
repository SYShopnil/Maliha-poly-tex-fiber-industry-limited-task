import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthMiddleWare } from "./auth.middleware";

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleWare();

router.post("/login", authController.login.bind(authController));

router.get(
  "/session",
  authMiddleware.auth.bind(authMiddleware),
  authController.getLoggedInUser.bind(authController)
);
router.get(
  "/logout",
  authMiddleware.auth.bind(authMiddleware),
  authController.logout.bind(authController)
);

export { router as authModule };
