import {
  IsDefined,
  IsEmail,
  IsString,
  Matches,
  Validate,
} from "class-validator";
import { PasswordValidation } from "class-validator-password-check";
import { passwordRequirement } from "src/modules/user/dto/create-user.dto";

export class DLogin {
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

  @IsString({
    message: "Password must be string",
  })
  @IsDefined({
    message: "Password required!!!",
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: "Password pattern not match",
    /**
     *
     * password contains at least 8
     * char and at least
     * one upper case and
     * one lowercase
     *
     */
  })
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;
}
