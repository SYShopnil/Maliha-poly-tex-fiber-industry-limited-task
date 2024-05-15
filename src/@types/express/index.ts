import { User } from "src/modules/user/user.entity";

declare global {
  namespace Express {
    interface Request {
      user: User;
      isAuth: boolean;
    }
  }
}
