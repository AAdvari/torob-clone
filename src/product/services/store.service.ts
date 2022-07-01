import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
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
import {GetFilteredProductsRequestDto} from "../dtos/requests/GetFilteredProductsRequest.dto";
import {SortingTypes} from "../enums/sorting-types.enum";

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

        const existingStore = await this.storeRepository.findOneBy({name: dto.name});
        if (existingStore)
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
    async validateOwnershipAndGetStore(userId: number, storeId: number) {
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
        if (!store)
            throw new NotFoundException('store with given id does not exist!')
        if (store.owner.id !== userId)
            throw new BadRequestException('the given user is not the owner of given store!')
        return store;
    }
    async addExistingProductToStore(dto: AddProductToStoreByIdRequestDto, userId: number) {
        const store = await this.validateOwnershipAndGetStore(userId, dto.storeId);
        const product = await this.productRepository.findOne({where: {id: dto.productId}});

        let sellingItem = new SellingItem();
        sellingItem.product = product;
        sellingItem.store = store;
        sellingItem.price = dto.price;
        sellingItem.link = dto.link;
        await this.sellingItemRepository.save(sellingItem);

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

        if (type === ProductCategory.MOBILE) {
            product.mobileProduct = device;
            await this.mobileRepository.save(device);
        } else {
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
    async addLaptopToStore(dto: AddLaptopProductToStoreRequestDto, userId: number) {
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
    async getStoresWithDetails(sellerId: number, stores?: number[]) {
        let query = this.storeRepository.createQueryBuilder('store')
            .andWhere('store.ownerId = :sellerId', {sellerId});
        if (stores)
            query = query.andWhere('store.id IN (...:stores)', {stores});

        return await
            query.leftJoinAndSelect('store.sellingItems', 'sellingItem')
                .leftJoinAndSelect('sellingItem.product', 'product')
                .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
                .leftJoinAndSelect('product.laptopProduct', 'laptopProduct')
                .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
                .getMany();
    }
    async getFilteredProducts(dto: GetFilteredProductsRequestDto) {
        let query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.sellingItems', 'sellingItem')
            .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
            .leftJoinAndSelect('product.laptopProduct', 'laptopProduct');

        if (dto.categories) {
            query = query
                .andWhere('product.productCategory IN (...:categories)', {categories: dto.categories});
        }

        if (dto.mobileAndTabletBrands) {
            query = query
                .andWhere('mobileProduct.brand IN (...:brands)', {brands: dto.mobileAndTabletBrands})
                .andWhere('tabletProduct.brand IN (...:brands)', {brands: dto.mobileAndTabletBrands});
        }

        if (dto.laptopBrands) {
            query = query
                .andWhere('laptopProduct.brand IN (...:brands)', {brands: dto.laptopBrands});
        }

        let products = await query.getMany();
        switch (dto.sortBy) {
            case SortingTypes.PRICE_ASCENDING:
                products =
                    products.sort((p1, p2) => {
                        const p1Cheapest = p1.sellingItems.reduce((prev, curr) => {
                                return prev.price < curr.price ? prev : curr;
                        });
                        const p2Cheapest = p2.sellingItems.reduce((prev, curr) => {
                            return prev.price < curr.price ? prev : curr;
                        });
                        return p1Cheapest.price - p2Cheapest.price;
                    });
                break;
            case SortingTypes.PRICE_DESCENDING:
                products =
                    products.sort((p1, p2) => {
                        const p1Cheapest = p1.sellingItems.reduce((prev, curr) => {
                            return prev.price < curr.price ? prev : curr;
                        });
                        const p2Cheapest = p2.sellingItems.reduce((prev, curr) => {
                            return prev.price < curr.price ? prev : curr;
                        });
                        return p2Cheapest.price - p1Cheapest.price;
                    });
                break;
            case SortingTypes.DATE_DESCENDING:
                products = products.sort((p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime())
                break;
            case SortingTypes.DATE_ASCENDING:
                products = products.sort((p1, p2) => p1.createdAt.getTime() - p2.createdAt.getTime())
        }
        return products;
    }
    async getFavoriteProducts(userId: number){
        const user = await this.userService.getUserFavoriteProducts(userId);
        return user.favoriteProducts;
    }
    async addProductToFavorites(pid: number, userId: number){
        const user = await this.userService.findUserById(userId);
        const product = await this.productRepository.findOneBy({id: pid});
        if (!product)
            throw new NotFoundException('product with given id does not exist!');
        user.favoriteProducts.push(product);
        await this.userService.save(user);
        return product;
    }
    async deleteProductFromFavorites(pid: number, userId: number){
        const user = await this.userService.findUserById(userId);
        const removingProduct = user.favoriteProducts.find(prod => prod.id === pid);
        if (!removingProduct)
            throw new BadRequestException('product with given id is not in favorite products!');
        user.favoriteProducts.filter(prod => prod.id !== pid);
        await this.userService.save(user);
        return removingProduct;
    }
    async getProductDetails(pid: number){
        return  this.productRepository.createQueryBuilder('product')
            .andWhere('product.id = :pid', {pid})
            .leftJoinAndSelect('product.laptopProduct', 'laptopProduct')
            .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
            .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('product.sellingItems', 'sellingItem')
            .leftJoinAndSelect('sellingItem.store', 'store')
            .getOne();
    }
}
