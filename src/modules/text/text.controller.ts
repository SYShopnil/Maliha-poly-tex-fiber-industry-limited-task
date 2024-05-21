import { Request, Response } from "express";
import { TextService } from "./text.service";
import {
  DCreateTextList,
  DMultipleUpdateTextListById,
  DTextDataElements,
} from "./dto/create-text-list";
import { ElementService } from "../elements/element.service";

export class TextController {
  private textService = new TextService();
  private elementService = new ElementService();
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

  /**
   *
   * Use Cases
   * 1. user can update exist element only of a text
   * 2. .
   * 3. user can deleted existing one and also can update remains element
   *
   */
  async updateTextElementById(req: Request, res: Response) {
    try {
      const bodyData: DMultipleUpdateTextListById = req.body;
      // console.log(bodyData);
      const { payload: existingDataPayload } =
        await this.textService.getTextElementsByTextId(bodyData.textId);
      if (existingDataPayload) {
        let responseMessage: string[] = [];
        let responseStatus: boolean = false;
        if (existingDataPayload.elements.length == bodyData.payload.length) {
          //only update happen
          const { message, status } =
            await this.textService.updateMultipleTextById(bodyData);
          responseMessage = message;
          responseStatus = status;
        } else if (
          existingDataPayload.elements.length > bodyData.payload.length
        ) {
          //element has deleted and also can be updated
          const copyExistingElement = existingDataPayload.elements;
          const copyBodyDataElements = bodyData.payload;
          const convertBodyElementToSet = new Set(
            copyBodyDataElements.map((element) => {
              return element.elementId;
            })
          );
          const elementsToDelete = copyExistingElement.filter(
            (element) => !convertBodyElementToSet.has(element.elementId)
          );
          const elementToUpdate = bodyData.payload;
          const {
            message: updateResponseMessage,
            status: updateResponseStatus,
          } = await this.textService.updateMultipleTextById({
            payload: elementToUpdate,
            textId: bodyData.textId,
          });
          if (updateResponseStatus) {
            //now have to delete multiple element
            const {
              message: deleteResponseMessage,
              status: deleteResponseStatus,
            } = await this.textService.deleteMultipleTextElementById({
              payload: elementsToDelete,
              textId: bodyData.textId,
            });
            if (deleteResponseStatus) {
              // element update and delete both successfully done
              responseMessage = [
                ...updateResponseMessage,
                ...deleteResponseMessage,
              ];
              responseStatus = true;
            } else {
              //element updated but delete failed
              responseMessage = [
                ...updateResponseMessage,
                ...deleteResponseMessage,
              ];
              responseStatus = false;
            }
          } else {
            //update failed
            responseMessage = [
              ...updateResponseMessage,
              "Element Update did not happen!!",
            ];
            responseStatus = updateResponseStatus;
          }
        } else if (
          existingDataPayload.elements.length < bodyData.payload.length
        ) {
          //element has added and also can updated
          const copyExistingElement = existingDataPayload.elements;
          const copyBodyDataElements = bodyData.payload;
          const convertExistingElementToSet = new Set(
            copyExistingElement.map((element) => {
              return element.elementId;
            })
          );
          const elementsToAdd = copyBodyDataElements.filter(
            (element) => !convertExistingElementToSet.has(element.elementId)
          );
          const elementToUpdate = copyBodyDataElements.filter((element) =>
            convertExistingElementToSet.has(element.elementId)
          );
          const {
            message: updateElementResponseMessages,
            status: updateElementResponseStatus,
          } = await this.textService.updateMultipleTextById({
            payload: elementToUpdate,
            textId: bodyData.textId,
          });
          if (updateElementResponseStatus) {
            //now have to add new element
            interface IElementToAddWithTextId extends DTextDataElements {
              text?: string;
            }
            const elementsToAddWithTextId: IElementToAddWithTextId[] =
              elementsToAdd;
            elementsToAddWithTextId.forEach((_, ind) => {
              elementsToAddWithTextId[ind].text = bodyData.textId;
            });
            const {
              message: addNewElementResponseMessage,
              status: addNewElementResponseStatus,
            } = await this.elementService.addMultipleElement(
              elementsToAddWithTextId
            );
            if (addNewElementResponseStatus) {
              //successfully add new one
              responseMessage = [
                ...updateElementResponseMessages,
                addNewElementResponseMessage,
              ];
              responseStatus = true;
            } else {
              //failed to add new elements
              responseMessage = [
                ...updateElementResponseMessages,
                addNewElementResponseMessage,
              ];
              responseStatus = false;
            }
          } else {
            //update failed and new element add did not execute
            responseMessage = [
              ...updateElementResponseMessages,
              "New Element Add did not execute",
            ];
            responseStatus = false;
          }
        }
        if (responseStatus) {
          // all operation has successfully done
          res.json({
            message: responseMessage,
            status: 202,
          });
        } else {
          res.json({
            message: responseMessage,
            status: 401,
          });
        }
      }
    } catch (err) {
      console.log(err.message);
      res.status(501).json({
        message: err.message,
        status: 501,
      });
    }
  }
}
