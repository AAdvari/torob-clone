import {Product} from "../../entities/product.entity";
import {ProductCategory} from "../../enums/product-category.enum";
import {MobileTabletResponseDto} from "./MobileTabletResponse.dto";
import {LaptopProductResponseDto} from "./LaptopProductResponse.dto";
import {SellingItemResponseDto} from "./SellingItemResponse.dto";

export class ProductResponseDto {
    id: number;
    productCategory: ProductCategory;
    mobileProduct?: MobileTabletResponseDto;
    tabletProduct?: MobileTabletResponseDto;
    laptopProduct?: LaptopProductResponseDto;
    sellingItems?: SellingItemResponseDto[];
    constructor(product: Product) {
        this.id = product.id;
        this.productCategory = product.productCategory;
        this.mobileProduct = product.mobileProduct? new MobileTabletResponseDto(product.mobileProduct): undefined;
        this.tabletProduct = product.tabletProduct? new MobileTabletResponseDto(product.tabletProduct): undefined;
        this.laptopProduct = product.laptopProduct? new LaptopProductResponseDto(product.laptopProduct): undefined;
        this.sellingItems = product.sellingItems?.map(si => new SellingItemResponseDto(si));
    }

}