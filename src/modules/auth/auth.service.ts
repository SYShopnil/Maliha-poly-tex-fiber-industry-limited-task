import { UserService } from "../user/user.service";
import jwt from "jsonwebtoken";

export class AuthService {
  private userService = new UserService();
  private generateJWT(payload: any, expiresIn: string): string {
    const token = jwt.sign(payload, process.env.JWT_CODE!, {
      expiresIn,
    });
    return token;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ message: string; token: string }> {
    try {
      const getRequestedUser = await this.userService.getUserByEmail(email);
      if (getRequestedUser) {
        const { user_id, email } = getRequestedUser;
        const { status: isPasswordMatch, message: passwordVerifyResponse } =
          await this.userService.verifyPasswordByUserId(user_id, password);
        if (isPasswordMatch) {
          const jwtPayload = {
            email,
            user_id,
          };

          const authToken = this.generateJWT(
            jwtPayload,
            process.env.TOKE_EXPIRE_IN || "5d"
          );
          return {
            message: "LoggedIn Successfully",
            token: authToken,
          };
        } else {
          return {
            message: passwordVerifyResponse,
            token: "",
          };
        }
      } else {
        return {
          message: "User Not found",
          token: "",
        };
      }
    } catch (err) {
      return {
        message: err.message,
        token: "",
      };
    }
  }
  async verifyJWT(authToken: string) {
    try {
      return await jwt.verify(authToken, process.env.JWT_CODE || "");
    } catch (err) {
      console.log(err.message);
      return "";
    }
  }
}
