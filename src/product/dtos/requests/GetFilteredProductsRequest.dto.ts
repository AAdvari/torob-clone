import { IsEnum, IsOptional} from "class-validator";
import {SortingTypes} from "../../enums/sorting-types.enum";
import {ProductCategory} from "../../enums/product-category.enum";
import {MobileTabletBrand} from "../../enums/mobile-tablet-brand.enum";
import {LaptopBrand} from "../../enums/laptop-brand.enum";

export class GetFilteredProductsRequestDto {

    @IsOptional()
    @IsEnum(SortingTypes)
    sortBy: SortingTypes;

    @IsOptional()
    @IsEnum(ProductCategory, {each: true})
    categories?: ProductCategory[];

    @IsOptional()
    @IsEnum(MobileTabletBrand, {each: true})
    mobileAndTabletBrands?: MobileTabletBrand[];

    @IsOptional()
    @IsEnum(LaptopBrand, {each: true})
    laptopBrands?: LaptopBrand[];

}