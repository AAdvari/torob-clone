import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class AddProductToStoreByIdRequestDto {


    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    storeId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;


    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    productId: number;

    @IsString()
    @IsNotEmpty()
    link: string;

}