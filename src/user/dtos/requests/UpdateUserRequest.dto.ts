import {IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {IsValidPassword} from "../../../common/decorators/validate-password.decorator";
import {UserType} from "../../enums/user-type.enum";

export class UpdateUserRequestDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    username?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phoneNumber?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email?: string;

}