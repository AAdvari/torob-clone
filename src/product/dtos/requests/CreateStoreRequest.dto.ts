import {IsNotEmpty, IsString} from "class-validator";

export class CreateStoreRequestDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}