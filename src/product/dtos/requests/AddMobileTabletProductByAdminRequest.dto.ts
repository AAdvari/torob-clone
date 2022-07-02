import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {MobileTabletBrand} from "../../enums/mobile-tablet-brand.enum";

export class AddMobileTabletProductByAdminRequestDto {


    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(MobileTabletBrand)
    brand: MobileTabletBrand;

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