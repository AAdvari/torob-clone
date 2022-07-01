import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";

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