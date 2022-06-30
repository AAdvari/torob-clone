import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Store} from "../entities/store.entity";
import {CreateStoreRequestDto} from "../dtos/requests/CreateStoreRequest.dto";
import {UserService} from "../../user/user.service";
import {UserType} from "../../user/enums/user-type.enum";
import {BaseService} from "../../common/base/Base.service";
import {Product} from "../entities/product.entity";
import {ProductCategory} from "../enums/product-category.enum";
import {SellingItem} from "../entities/selling-item.entity";
import {MobileProduct} from "../entities/products/mobile-product.entity";
import {AddMobileTabletProductToStoreRequestDto} from "../dtos/requests/AddMobileTabletProductToStoreRequest.dto";
import {TabletProduct} from "../entities/products/tablet-product.entity";
import {LaptopProduct} from "../entities/products/laptop-product.entity";
import {AddLaptopProductToStoreRequestDto} from "../dtos/requests/AddLaptopProductToStoreRequest.dto";
import {AddProductToStoreByIdRequestDto} from "../dtos/requests/AddProductToStoreByIdRequest.dto";

@Injectable()
export class StoreService extends BaseService<Store> {
    constructor(
                private readonly userService: UserService,
                @InjectRepository(Store)
                private readonly storeRepository: Repository<Store>,
                @InjectRepository(SellingItem)
                private readonly sellingItemRepository: Repository<SellingItem>,
                @InjectRepository(Product)
                private readonly productRepository: Repository<Product>,
                @InjectRepository(MobileProduct)
                private readonly mobileRepository: Repository<MobileProduct>,
                @InjectRepository(LaptopProduct)
                private readonly laptopRepository: Repository<LaptopProduct>,
                @InjectRepository(TabletProduct)
                private readonly tabletRepository: Repository<TabletProduct>,

    ) {
        super(storeRepository);
    }

    async createStore(dto: CreateStoreRequestDto, userId: number) {
        const user = await this.userService.findUserById(userId);
        if (user.userType !== UserType.SELLER)
            throw new UnauthorizedException('only seller users can add stores!');

        if (user.stores.find(store => store.name === dto.name))
            throw new BadRequestException('store with given name already exists');

        let store = new Store();
        store.name = dto.name;
        store.owner = user;
        store = await this.storeRepository.save(store);

        user.stores.push(store);
        await this.userService.save(user);

        return await this.storeRepository.findOne({
            where: {id: store.id}, relations: {
                owner: true,
                sellingItems: true
            }
        });
    }
    async validateOwnershipAndGetStore(userId: number, storeId: number){
        const user = await this.userService.findUserById(userId);
        if (user.userType !== UserType.SELLER)
            throw new UnauthorizedException('only seller users can add products!');
        const store = await this.storeRepository.findOne({
            where: {id: storeId},
            relations: {
                sellingItems: true,
                owner: true
            }
        });
        if (store.owner.id !== userId)
            throw new BadRequestException('the given user is not the owner of given store!')
        return store;
    }
    async addExistingProductToStore(dto: AddProductToStoreByIdRequestDto, userId: number ){
        const store = await this.validateOwnershipAndGetStore(userId, dto.storeId);
        const product = await this.productRepository.findOne({where: {id: dto.productId}});

        let sellingItem = new SellingItem();
        sellingItem.product = product;
        sellingItem.store = store;
        sellingItem.price = dto.price;
        sellingItem.link = dto.link;

        return product;
    }
    async addMobileTableToStore(dto: AddMobileTabletProductToStoreRequestDto, userId: number, type: ProductCategory) {

        const store = await this.validateOwnershipAndGetStore(userId, dto.storeId);
        let product = new Product();
        product.productCategory = type;

        let device
        if (type === ProductCategory.MOBILE)
            device = new MobileProduct();
        else
            device = new TabletProduct();

        device.title = dto.title;
        device.brand = dto.brand;
        device.cpu = dto.cpu;
        device.ram = dto.ram;
        device.memory = dto.memory;
        device.screen = dto.screen;

        if (type === ProductCategory.MOBILE){
            product.mobileProduct = device;
            await this.mobileRepository.save(device);
        }
        else {
            product.tabletProduct = device;
            await this.tabletRepository.save(device);
        }

        product = await this.productRepository.save(product);

        let sellingItem = new SellingItem();
        sellingItem.price = dto.price;
        sellingItem.link = dto.link;
        sellingItem.product = product;
        sellingItem.store = store;
        await this.sellingItemRepository.save(sellingItem);


        return device;
    }
    async addLaptopToStore(dto: AddLaptopProductToStoreRequestDto, userId: number){
        const store = await this.validateOwnershipAndGetStore(userId, dto.storeId);

        let product = new Product();
        product.productCategory = ProductCategory.LAPTOP;

        let device = new LaptopProduct();
        device.title = dto.title;
        device.brand = dto.brand;
        device.cpu = dto.cpu;
        device.ram = dto.ram;
        device.memory = dto.memory;
        device.screen = dto.screen;

        product.laptopProduct = device;
        await this.laptopRepository.save(device);

        product = await this.productRepository.save(product);

        let sellingItem = new SellingItem();
        sellingItem.price = dto.price;
        sellingItem.link = dto.link;
        sellingItem.product = product;
        sellingItem.store = store;
        await this.sellingItemRepository.save(sellingItem);

        return device;

    }

}
