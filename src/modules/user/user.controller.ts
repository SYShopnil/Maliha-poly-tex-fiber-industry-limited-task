// src/modules/user/controllers/UserController.ts

import { Request, Response } from "express";
import { UserService } from "./user.service";
import { DCreateUser } from "./dto/create-user.dto";
import { validate } from "class-validator";
import { DUpdateUserById } from "./dto/update-user-by-id.dto";
export class UserController {
  private userService = new UserService();

  async registration(req: Request, res: Response): Promise<void> {
    try {
      const bodyData: DCreateUser = req.body;
      const checkCreateUserPayload: DCreateUser | any = new DCreateUser();
      for (const property in bodyData) {
        checkCreateUserPayload[property] = req.body[property];
      }
      const isValidationError = await validate(checkCreateUserPayload); //validate the input data here
      if (isValidationError.length) {
        res.status(422).json({
          message: isValidationError,
          status: 422,
        });
      } else {
        const { user, message } = await this.userService.createUser(bodyData);
        if (user) {
          res.json({
            message,
            user,
            status: 201,
          });
        } else {
          res.json({
            message,
            user,
            status: 500,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Error!!", status: 500 });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const getUser = await this.userService.getUserById(req.params.id);
      if (getUser) {
        res.json({
          message: `${getUser.first_name} ${getUser.last_name} Found!!!`,
          status: 202,
          user: getUser,
        });
      } else {
        res.json({
          message: "User Not Found!!",
          status: 404,
          user: null,
        });
      }
    } catch (error) {
      res.json({
        message: error.message,
        status: 500,
        user: null,
      });
    }
  }
  async getAllUserBy(_: Request, res: Response): Promise<void> {
    try {
      const { message: getUserResponse, users } =
        await this.userService.getAllUser();
      if (users) {
        res.json({
          message: getUserResponse,
          status: 202,
          user: users,
        });
      } else {
        res.json({
          message: getUserResponse,
          status: 404,
          user: users,
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
        status: 500,
        user: null,
      });
    }
  }
  async updateUserById(req: Request, res: Response): Promise<void> {
    try {
      const verifyPayloadOfHeader: DUpdateUserById = req.body;
      const validateDataInstance: DUpdateUserById | any = new DUpdateUserById();
      for (const property in verifyPayloadOfHeader) {
        validateDataInstance[property] = req.body[property];
      }
      validateDataInstance.userId = req.params.userId;
      const isValidationError = await validate(validateDataInstance); //validate the input data here
      if (isValidationError.length) {
        res.status(422).json({
          message: isValidationError,
          status: 422,
        });
      } else {
        const body = {
          firstName: verifyPayloadOfHeader.first_name,
          lastName: verifyPayloadOfHeader.last_name,
          email: verifyPayloadOfHeader.email,
        };
        const { message: updateResponse, status } =
          await this.userService.updateUserById(req.params.userId, body);
        if (status) {
          res.status(202).json({
            message: updateResponse,
            status: 202,
          });
        } else {
          res.json({
            message: updateResponse,
            status: 406,
          });
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message, status: 500 });
    }
  }
}
