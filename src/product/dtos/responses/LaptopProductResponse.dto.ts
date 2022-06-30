import {LaptopBrand} from "../../enums/laptop-brand.enum";
import {LaptopProduct} from "../../entities/products/laptop-product.entity";

export class AddLaptopProductToStoreResponse {
    id: number;
    title: string;
    brand: LaptopBrand;
    cpu: string;
    ram: string;
    memory: string;
    screen: string;
    constructor(device: LaptopProduct) {
        this.id = device.id;
        this.title = device.title;
        this.brand = device.brand;
        this.cpu = device.cpu;
        this.ram = device.ram;
        this.memory = device.memory;
        this.screen = device.screen;
    }
}