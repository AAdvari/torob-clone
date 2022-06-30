import {Product} from "../../entities/product.entity";
import {ProductCategory} from "../../enums/product-category.enum";
import {MobileTabletResponseDto} from "./MobileTabletResponse.dto";
import {LaptopProductResponseDto} from "./LaptopProductResponse.dto";

export class ProductResponseDto {
    id: number;
    productCategory: ProductCategory;
    mobileProduct?: MobileTabletResponseDto;
    tabletProduct?: MobileTabletResponseDto;
    laptopProduct?: LaptopProductResponseDto;
    constructor(product: Product) {
        this.id = product.id;
        this.productCategory = product.productCategory;
        this.mobileProduct = product.mobileProduct? new MobileTabletResponseDto(product.mobileProduct): undefined;
        this.tabletProduct = product.tabletProduct? new MobileTabletResponseDto(product.tabletProduct): undefined;
        this.laptopProduct = product.laptopProduct? new LaptopProductResponseDto(product.laptopProduct): undefined;

    }

}