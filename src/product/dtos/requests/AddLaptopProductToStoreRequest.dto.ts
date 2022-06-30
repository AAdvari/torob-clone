import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {LaptopBrand} from "../../enums/laptop-brand.enum";

export class AddLaptopProductToStoreRequestDto {


    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;


    @IsNotEmpty()
    @IsString()
    title: string;


    @IsNotEmpty()
    @IsString()
    link: string;

    @IsNotEmpty()
    @IsEnum(LaptopBrand)
    brand: LaptopBrand;

    @IsNotEmpty()
    @IsString()
    cpu: string;

    @IsNotEmpty()
    @IsString()
    ram: string;

    @IsNotEmpty()
    @IsString()
    memory: string;

    @IsNotEmpty()
    @IsString()
    screen: string;

}