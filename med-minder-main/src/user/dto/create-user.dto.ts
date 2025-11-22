import { 
    IsNotEmpty, 
    IsNumber, MinLength,
    IsEmail, 
    IsString,
    Matches} 
    from "class-validator";

//import { IsObjectId } from "src/objectIdValidator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message: "Name field cannot be empty"})
    fullName: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty({message: "email field cannot be empty"})
    email: string;

    @IsString()
    @IsNotEmpty({message: "phone number field cannot be empty"})
    phoneNumber: string;

    @IsNotEmpty({message: "password field cannot be empty"})
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+/, {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      })
    @MinLength(8)
    password: string;

    @IsNotEmpty({message: "DOB field cannot be empty"})
    @IsString()
    DOB: string;

    @IsString()
    @IsNotEmpty({message: "gender field cannot be empty"})
    gender: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
  }

  export class ResetPasswordDto {
       @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+/, {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      })
    @IsString()
    @MinLength(6)
    newPassword: string;
  }
