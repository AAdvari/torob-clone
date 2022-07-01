import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UpdateUserRequestDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    username?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(20)
    phoneNumber?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email?: string;

}