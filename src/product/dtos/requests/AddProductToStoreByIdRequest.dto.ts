import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class AddProductToStoreByIdRequestDto {


    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    storeId: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;


    @IsNotEmpty()
    @IsPositive()
    productId: number;

    @IsString()
    @IsNotEmpty()
    link: string;

}