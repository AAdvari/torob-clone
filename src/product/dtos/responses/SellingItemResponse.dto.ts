import {SellingItem} from "../../entities/selling-item.entity";
import {ProductResponseDto} from "./ProductResponse.dto";
import {StoreResponseDto} from "./StoreResponse.dto";

export class SellingItemResponseDto {
    price: number;
    link: string;
    product: ProductResponseDto;
    store: StoreResponseDto;
    constructor(si: SellingItem) {
        this.price = si.price;
        this.link = si.link;
        this.product= si.product ? new ProductResponseDto(si.product) : undefined;
        this.store = si.store ? new StoreResponseDto(si.store) : undefined;

    }
}