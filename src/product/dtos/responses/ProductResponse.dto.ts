import {Product} from "../../entities/product.entity";

export class ProductResponseDto {
    id: number;
    constructor(product: Product) {
        this.id = product.id;
    }

}