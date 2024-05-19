import { Request, Response } from "express";
import { TextService } from "./text.service";
import { DCreateTextList } from "./dto/create-text-list";

export class TextController {
  private textService = new TextService();
  async addNewTextList(req: Request, res: Response) {
    try {
      const bodyData: DCreateTextList = req.body;
      const { message, payload, status } =
        await this.textService.createTextList(bodyData, req.user);

      if (status) {
        res.json({
          message,
          text: payload,
          status: 201,
        });
      } else {
        res.json({
          message,
          text: payload,
          status: 401,
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
        text: null,
        status: 501,
      });
    }
  }
  async getAllLoggedInUserText(req: Request, res: Response) {
    try {
      const { message, payload } =
        await this.textService.getAllLoggedInUserText(req.user.user_id);
      if (payload) {
        res.status(200).json({
          message,
          payload,
          status: 200,
        });
      } else {
        res.status(404).json({
          message,
          payload: null,
          status: 404,
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
        payload: null,
        status: 501,
      });
    }
  }
}
