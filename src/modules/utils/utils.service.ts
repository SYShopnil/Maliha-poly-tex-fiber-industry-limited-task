import {
  registerDecorator,
  // validate,
  ValidationArguments,
  // ValidationError,
} from "class-validator";
import { unlink } from "fs";
import fs from "fs";
interface FileUploadDefault {
  fileAddStatus: boolean;
  fileUrl: string;
}

export class UtilsService {
  private searchPathOfPublicFolderByFileName(fileName: string) {
    return `${__dirname}/../../public/${fileName}`;
  }
  private serverUrl: string =
    process.env.SERVER_BASE_URL || `http://localhost:3030`; //it will come from dot env file

  setCookiesOption = (
    time: number,
    httpOnly?: boolean
  ): {
    expires: any;
  } => {
    const options = {
      expires: new Date(
        Date.now() + time * 24 * 60 * 60 * 1000 //days
      ),
      httpOnly: httpOnly || true,
    };
    return options;
  };
  async deleteAnyFileFromRoot(
    fileName: string
  ): Promise<{ hasError: boolean; responseMessage: string }> {
    return new Promise((resolve) => {
      let hasError: boolean = false;
      let responseMessage: string = "Successfully Removed!!!!";
      unlink(this.searchPathOfPublicFolderByFileName(fileName), (err) => {
        responseMessage = err?.message || "Some things wen wrong!!!";
        hasError = true;
      });
      resolve({ hasError, responseMessage });
    });
  }

  otpGenerator(digit: number): string {
    let newOtp: string;
    let randomNumberGenerator: string = "";
    for (let i: number = 1; i <= digit; i++) {
      randomNumberGenerator =
        Math.floor(Math.random() * 9 + 1) + randomNumberGenerator;
    } //generate the random number form appointment
    newOtp = randomNumberGenerator;
    return newOtp;
  }
  slugGenerator(...content: string[]) {
    let element: string[] = content; //store the parameter array in to a local variable
    let slug: string = "";
    element.map((val) => {
      slug += val + "_";
    });
    slug += Date.now();
    return slug;
  }

  async uploadAnyPicture(
    base64: string,
    agencyName: string,
    uploadType?: string,
    extension?: string
  ): Promise<{ fileUrl: string; fileAddStatus: boolean }> {
    const myBase64Data: string = base64.split(";base64,")[1]; //get the base 64 data of my data
    const userId = agencyName;
    const dataExtension =
      extension ||
      (uploadType !== "default" ? base64.split(";")[0].split("/")[1] : "png"); //get the extension of my data
    const fileName: string = `${userId}${+new Date()}`;
    const { fileAddStatus, fileUrl } = await this.uploadAnyFile(
      myBase64Data,
      fileName,
      dataExtension
    );
    return {
      fileUrl,
      fileAddStatus,
    };
  }

  async uploadAnyFile(
    base64: string,
    fileName: string,
    extension: string
  ): Promise<FileUploadDefault> {
    return new Promise((resolve) => {
      fs.writeFile(
        this.searchPathOfPublicFolderByFileName(`${fileName}.${extension}`),
        base64,
        { encoding: "base64" },
        (err: any) => {
          //this will upload file into public folder
          if (err) {
            console.log(err);
            resolve({
              fileAddStatus: false,
              fileUrl: "",
            });
          } else {
            const dataUrl = `${this.serverUrl}/${fileName}.${extension}`;
            resolve({
              fileAddStatus: true,
              fileUrl: dataUrl,
            });
          }
        }
      ); //save the data into public folder
    });
  }

  passwordMatchWithConfirmPassword(validationOptions?: { message?: string }) {
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
}
