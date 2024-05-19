import { IsBoolean, IsDefined, IsInt, IsString } from "class-validator";

export class DTextDataElements {
  @IsBoolean({
    message: "Is Checked should be boolean",
  })
  @IsDefined({
    message: "Is Checked required",
  })
  isChecked: boolean;

  @IsInt({
    message: "Element Value should be integer",
  })
  @IsDefined({
    message: "Element Value is required",
  })
  value: number;

  @IsString({
    message: "element Id should be string",
  })
  @IsDefined({
    message: "element Id is required",
  })
  elementId: string;
}

export class DCreateTextList {
  payload: DTextDataElements[];
}
