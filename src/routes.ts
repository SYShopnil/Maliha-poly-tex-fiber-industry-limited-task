import { Application } from "express";
import userModule from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";

export function Routes(app: Application) {
  app.use("/user", userModule);
  app.use("/auth", authModule);
}
