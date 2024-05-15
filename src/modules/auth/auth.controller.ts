import { Request, Response } from "express";
import { UtilsService } from "../utils/utils.service";
import { AuthService } from "./auth.service";
import { DLogin } from "./dtos/login.dto";

export class AuthController {
  private utilsService = new UtilsService();
  private autService = new AuthService();
  async login(req: Request, res: Response): Promise<void> {
    try {
      const bodyData: DLogin = req.body;
      const { message: authMessage, token: authToken } =
        await this.autService.login(bodyData.email, bodyData.password);
      if (authToken) {
        const optionForCookie = this.utilsService.setCookiesOption(
          +process.env.AUTH_COOKIE_EXPIRE_IN! || 1
        );
        res.cookie("auth", authToken, optionForCookie).json({
          message: authMessage,
          status: 200,
          token: authToken,
        });
      } else {
        res.json({
          status: 401,
          message: authMessage,
          token: null,
        });
      }
    } catch (err) {
      res.json({
        status: 501,
        message: err.message,
        token: null,
      });
    }
  }
  async logout(_: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("auth").json({
        message: "Logout successfully",
        status: 202,
      });
    } catch (err) {
      res.json({
        status: 501,
        message: err.message,
      });
    }
  }
  async getLoggedInUser(req: Request, res: Response): Promise<void> {
    try {
      if (req.isAuth) {
        res.json({
          message: req.user.first_name + " " + req.user.last_name + " Found!!",
          status: 202,
          user: req.user,
          isAuth: req.isAuth,
        });
      } else {
        res.json({
          message: "User Not Found Please Log in",
          status: 404,
          user: null,
          isAuth: req.isAuth,
        });
      }
    } catch (err) {
      res.json({
        status: 501,
        message: err.message,
        user: null,
        isAuth: req.isAuth,
      });
    }
  }
}
