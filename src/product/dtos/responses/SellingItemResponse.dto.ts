import {SellingItem} from "../../entities/selling-item.entity";
import {ProductResponseDto} from "./ProductResponse.dto";
import {StoreResponseDto} from "./StoreResponse.dto";
import {ReportResponseDto} from "./ReportResponse.dto";

export class SellingItemResponseDto {
    price: number;
    link: string;
    id: number;
    product?: ProductResponseDto;
    store?: StoreResponseDto;
    reports?: ReportResponseDto[];
    constructor(si: SellingItem) {
        this.id = si.id;
        this.price = si.price;
        this.link = si.link;
        this.product= si.product ? new ProductResponseDto(si.product) : undefined;
        this.store = si.store ? new StoreResponseDto(si.store) : undefined;
        this.reports = si.reports?.map(rep => new ReportResponseDto(rep));

    }
}