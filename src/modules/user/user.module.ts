import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/create", userController.registration.bind(userController));
router.get("/single/:id", userController.getUserById.bind(userController));
router.get("/get/all", userController.getAllUserBy.bind(userController));
router.post(
  "/update/:userId",
  userController.updateUserById.bind(userController)
);

export default router;
