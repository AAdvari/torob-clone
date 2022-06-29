import {IsDefined, IsNotEmpty, IsString} from "class-validator";

export class LoginRequestDto {

    @IsNotEmpty()
    @IsDefined()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsDefined()
    @IsString()
    password: string;
}