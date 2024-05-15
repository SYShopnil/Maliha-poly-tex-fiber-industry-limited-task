import { IsDefined, IsEmail, IsString, Matches } from "class-validator";

export class DUpdateUserById {
  @IsString({
    message: "User Id must be string!!!!",
  })
  @IsDefined({
    message: "User Id required as a params",
  })
  userId: string;
  @IsString({
    message: "First name must be string!!!!",
  })
  @IsDefined({
    message: "First name required",
  })
  first_name: string;

  @IsString({
    message: "Last name must be string!!!!",
  })
  @IsDefined({
    message: "Last name required",
  })
  last_name: string;

  @IsString({
    message: "Email must be string",
  })
  @IsDefined({
    message: "Email required!!!",
  })
  @Matches(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    { message: "Email validation failed" }
  )
  @IsEmail({}, { message: "Email is not valid please enter a valid one!!!" })
  email: string;
}
