import { Element } from "../elements/element.entity";
import { ElementService } from "../elements/element.service";
import { User } from "../user/user.entity";
import {
  DCreateTextList,
  DMultipleUpdateTextListById,
  DTextListUpdateByElementId,
} from "./dto/create-text-list";
import { Text } from "./text.entity";

export class TextService {
  private ElementService = new ElementService();
  async createTextList(payload: DCreateTextList, user: User) {
    try {
      const { payload: elementsOfTextList } = payload;

      const generateTextId = Math.random().toString(36).substring(7);
      const payloadOfTextCreation = {
        textId: generateTextId,
        owner: user,
      };
      const createText = await Text.createQueryBuilder()
        .insert()
        .values(payloadOfTextCreation)
        .execute();
      if (createText.generatedMaps.length) {
        const insertTextIntoElements: any[] = elementsOfTextList;
        insertTextIntoElements.forEach((_, ind) => {
          insertTextIntoElements[ind].text = createText.generatedMaps[0];
        });
        const { status } = await this.ElementService.addMultipleElement(
          insertTextIntoElements
        );
        if (status) {
          return {
            message: "Text successfully created with element",
            status: 201,
            text: createText,
          };
        } else {
          return {
            message: "Text successfully but element failed",
            status: 401,
            text: null,
          };
        }
      } else {
        return {
          message: "Text creation failed",
          status: 401,
          text: null,
        };
      }
    } catch (err) {
      return {
        message: err.message,
        payload: null,
        status: false,
      };
    }
  }
  async getAllLoggedInUserText(user_id: string) {
    return await this.getAllTextByUserId(user_id);
  }
  async getAllTextByUserId(user_id: string) {
    try {
      const userTexts = await User.createQueryBuilder("user")
        .leftJoinAndSelect("user.texts", "text")
        .leftJoinAndSelect("text.elements", "element")
        .where("user.user_id = :id", { id: user_id })
        .orderBy("text.create_at", "DESC")
        .getMany();
      const result = userTexts.map((user) => {
        return user.texts.map((text) => ({
          textId: text.textId,
          total: text.elements.reduce((acc, curr) => {
            if (curr.isChecked) {
              return acc + curr.value;
            }
            return acc; // Return accumulator if isChecked is false
          }, 0),
          elements: text.elements.map((element) => ({
            elementId: element.elementId,
            isChecked: element.isChecked,
            value: element.value,
          })),
        }));
      });
      if (result.length) {
        return {
          payload: result[0],
          status: true,
          message: "Successfully Get",
        };
      } else {
        return {
          payload: null,
          status: true,
          message: "Text Not Found",
        };
      }
    } catch (err) {
      return {
        payload: null,
        status: true,
        message: err.message,
      };
    }
  }
  async updateMultipleTextById(bodyData: DMultipleUpdateTextListById) {
    const responseSuccessQueue: boolean[] = [];
    const responseMessageQueue: string[] = [];
    try {
      for (const element of bodyData.payload) {
        const { status, message } = await this.updateTextElementById(element);
        responseSuccessQueue.push(status);
        responseMessageQueue.push(message);
      }
      if (responseSuccessQueue.filter((a) => a == false).length) {
        // all update is not complete
        return {
          status: false,
          message: responseMessageQueue,
        };
      } else {
        return {
          status: true,
          message: ["All Updated Successfully"],
        };
      }
    } catch (err) {
      console.log(err.message);
      return {
        message: [err.message],
        status: false,
      };
    }
  }
  async updateTextElementById(
    payload: DTextListUpdateByElementId
  ): Promise<{ status: boolean; message: string }> {
    try {
      const updateData = await Element.createQueryBuilder("element")
        .update()
        .set({
          isChecked: payload.isChecked,
          value: payload.value,
        })
        .where("element.elementId = :elementId", {
          elementId: payload.elementId,
        })
        .execute();
      if (updateData.affected) {
        return {
          message: `${payload.elementId} has updated!!`,
          status: true,
        };
      } else {
        return {
          message: "Update Failed",
          status: false,
        };
      }
    } catch (err) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
