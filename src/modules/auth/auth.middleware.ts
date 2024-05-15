import { NextFunction, Request, Response } from "express";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";

export class AuthMiddleWare {
  private userService = new UserService();
  private authService = new AuthService();
  async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { auth: cookieToken } = req.cookies; //get the authToken from cookie name "auth"
      const headToken = req.headers.authorization; //get the authToken from headers
      const authToken = headToken || cookieToken;
      if (!authToken) {
        res.json({
          message: "Unauthorized user please login!!",
          status: 401,
        });
      } else {
        const isValidToken = await this.authService.verifyJWT(authToken);
        if (isValidToken) {
          const getTokenData: any = isValidToken; //store the token data as a verified userType
          const getLoggedInUser = await this.userService.getUserById(
            getTokenData?.user_id
          );
          if (getLoggedInUser) {
            req.user = getLoggedInUser;
            req.isAuth = true;
            next();
          } else {
            req.isAuth = false;
            res.json({
              message: "Unauthorized user please login!!",
              status: 401,
            });
          }
        } else {
          req.isAuth = false;
          res.json({
            message: "Auth Token Expired",
            status: 500,
          });
        }
      }
    } catch (err) {
      req.isAuth = false;
      res.json({
        message: err.message,
        status: 500,
      });
    }
  }
  authorization(...acceptedUserType: string[]) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const acceptedUser = acceptedUserType; //store it as a array those who can access this api
        const requestUser = req.user; //get this from authentication middleware
        const { role: userType } = requestUser; //get the user type from the user
        const isAuthorizedUser = acceptedUser.find((user) => user == userType); //check that is this user type is available or not user
        if (isAuthorizedUser) {
          next();
        } else {
          res.json({
            message: "Permission Denied",
            status: 401,
          });
        }
      } catch (err) {
        res.json({
          message: err.message,
          status: 401,
        });
      }
    };
  }
}
