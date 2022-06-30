import {Module} from '@nestjs/common';
import {ProductController} from './controllers/product.controller';
import {ProductService} from './services/product.service';
import {StoreService} from "./services/store.service";
import {StoreController} from "./controllers/store.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Store} from "./entities/store.entity";
import {SellingItem} from "./entities/selling-item.entity";
import {LaptopProduct} from "./entities/products/laptop-product.entity";
import {MobileProduct} from "./entities/products/mobile-product.entity";
import {TabletProduct} from "./entities/products/tablet-product.entity";
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature(
        [Product, Store, SellingItem, LaptopProduct, MobileProduct, TabletProduct]),
        UserModule
    ],
    controllers: [ProductController, StoreController],
    providers: [ProductService, StoreService]
})
export class ProductModule {
}
