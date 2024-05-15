import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidationArguments,
  registerDecorator,
} from "class-validator";
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from "class-validator-password-check";

export const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

function PasswordMatch(validationOptions?: { message?: string }) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "passwordMatch",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const password = (args.object as any).password;
          return typeof value === "string" && value === password;
        },
      },
    });
  };
}

export class DCreateUser {
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
    message: "User role must be string!!!!",
  })
  @IsDefined({
    message: "User role required",
  })
  role: string;

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

  @IsString({
    message: "Confirm Password must be string",
  })
  @IsDefined({
    message: "Confirm Password required!!!",
  })
  @PasswordMatch({ message: "Confirm password and Password do not match" })
  confirm_password: string;

  @IsString({
    message: "profile picture base64 should be a string",
  })
  @IsOptional()
  profile_pic: string;
}
