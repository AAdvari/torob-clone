import {MobileProduct} from "../../entities/products/mobile-product.entity";
import {TabletProduct} from "../../entities/products/tablet-product.entity";
import {MobileTabletBrand} from "../../enums/mobile-tablet-brand.enum";

export class MobileTabletResponseDto {
    title: string;
    id: number;
    brand: MobileTabletBrand;
    cpu: string;
    ram: string;
    memory: string;
    screen: string;
    constructor(device: MobileProduct | TabletProduct) {
        this.id = device.id;
        this.title = device.title;
        this.brand = device.brand;
        this.cpu = device.cpu;
        this.ram = device.ram;
        this.memory = device.memory;
        this.screen = device.screen;
    }
}