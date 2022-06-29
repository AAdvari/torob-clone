import {IsDefined, IsEmail, IsNotEmpty, IsString, Length, Validate} from 'class-validator';
import {IsValidPassword} from "../../../common/decorators/validate-password.decorator";

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
}