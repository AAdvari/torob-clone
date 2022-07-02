import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {LaptopBrand} from "../../enums/laptop-brand.enum";

export class AddLaptopProductByAdminRequestDto {


    @IsNotEmpty()
    @IsString()
    title: string;

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