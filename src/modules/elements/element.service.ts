import { ObjectLiteral } from "typeorm";
import { DTextDataElements } from "../text/dto/create-text-list";
import { Element } from "./element.entity";

export class ElementService {
  private ElementEntity = Element;
  async addMultipleElement(elements: DTextDataElements[]): Promise<
    | {
        message: string;
        status: boolean;
        elements: ObjectLiteral[];
      }
    | {
        message: any;
        status: boolean;
        elements: null;
      }
  > {
    try {
      const createMultipleElements =
        await this.ElementEntity.createQueryBuilder()
          .insert()
          .values(elements)
          .execute();
      console.log({ createMultipleElements });
      if (createMultipleElements.generatedMaps.length) {
        return {
          message: "Successfully added!!",
          status: true,
          elements: createMultipleElements.generatedMaps,
        };
      } else {
        return {
          message: "Element build failed",
          status: false,
          elements: null,
        };
      }
    } catch (err) {
      console.log(err.message);
      return {
        message: err.message,
        status: false,
        elements: null,
      };
    }
  }
}
