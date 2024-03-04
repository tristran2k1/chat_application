import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthParamDto {
    @IsEmail()
    username: string;

    @IsNotEmpty()
    password: string;
}
