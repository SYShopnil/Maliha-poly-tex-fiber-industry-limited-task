import { Application } from "express";
import userModule from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";
import { textModule } from "./modules/text/text.module";

export function Routes(app: Application) {
  app.use("/user", userModule);
  app.use("/auth", authModule);
  app.use("/text", textModule);
}
