import {IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, Length, Validate} from 'class-validator';
import {IsValidPassword} from "../../../common/decorators/validate-password.decorator";
import {UserType} from "../../enums/user-type.enum";

export class CreateUserRequestDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 128)
    @IsValidPassword()
    password: string;

    @IsNotEmpty()
    @IsDefined()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType;
}