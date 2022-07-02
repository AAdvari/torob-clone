import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {BaseService} from "../../common/base/Base.service";
import {UserService} from "../../user/services/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Product} from "../entities/product.entity";
import {GetFilteredProductsRequestDto} from "../dtos/requests/GetFilteredProductsRequest.dto";
import {SortingTypes} from "../enums/sorting-types.enum";
import {MobileProduct} from "../entities/products/mobile-product.entity";
import {LaptopProduct} from "../entities/products/laptop-product.entity";
import {TabletProduct} from "../entities/products/tablet-product.entity";
import {AddLaptopProductByAdminRequestDto} from "../dtos/requests/AddLaptopProductByAdminRequest.dto";
import {AddMobileTabletProductByAdminRequestDto} from "../dtos/requests/AddMobileTabletProductByAdminRequest.dto";
import {ProductCategory} from "../enums/product-category.enum";
import {UserType} from "../../user/enums/user-type.enum";

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(MobileProduct)
        private readonly mobileRepository: Repository<MobileProduct>,
        @InjectRepository(LaptopProduct)
        private readonly laptopRepository: Repository<LaptopProduct>,
        @InjectRepository(TabletProduct)
        private readonly tabletRepository: Repository<TabletProduct>
    ) {
        super(productRepository);
    }
    async getProductDetails(pid: number) {
        return this.productRepository.createQueryBuilder('product')
            .andWhere('product.id = :pid', {pid})
            .leftJoinAndSelect('product.laptopProduct', 'laptopProduct')
            .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
            .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('product.sellingItems', 'sellingItem')
            .leftJoinAndSelect('sellingItem.store', 'store')
            .getOne();
    }
    async searchAndGetProducts(clause) {
        const {search} = clause;
        return this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.sellingItems', 'sellingItem')
            .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
            .leftJoinAndSelect('product.laptopProduct', 'laptopProduct')
            .orWhere('mobileProduct.title LIKE :search', {search: `%${search}%`})
            .orWhere('tabletProduct.title LIKE :search', {search: `%${search}%`})
            .orWhere('laptopProduct.title LIKE :search', {search: `%${search}%`})
            .getMany();
    }
    async getFilteredProducts(dto: GetFilteredProductsRequestDto) {
        let query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.sellingItems', 'sellingItem')
            .leftJoinAndSelect('product.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('product.tabletProduct', 'tabletProduct')
            .leftJoinAndSelect('product.laptopProduct', 'laptopProduct');

        const {categories, mobileBrands, tabletBrands, laptopBrands, sortBy} = dto;
        if (categories) {
            query = query
                .andWhere('product.productCategory IN (:...categories)', {categories});
        }
        let products = await query.getMany();
        products = products.filter(prod => {
            return mobileBrands?.includes(prod.mobileProduct?.brand) ||
                tabletBrands?.includes(prod.tabletProduct?.brand) ||
                laptopBrands?.includes(prod.laptopProduct?.brand)
        });

        if (sortBy) {
            switch (sortBy) {
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
        }
        return products;
    }
    async getFavoriteProducts(userId: number) {
        const user = await this.userService.getUserFavoriteProducts(userId);
        return user.favoriteProducts;
    }
    async addProductToFavorites(pid: number, userId: number) {
        const user = await this.userService.findUserById(userId);
        const product = await this.productRepository.findOneBy({id: pid});
        if (!product)
            throw new NotFoundException('product with given id does not exist!');
        user.favoriteProducts.push(product);
        await this.userService.save(user);
        return product;
    }
    async deleteProductFromFavorites(pid: number, userId: number) {
        const user = await this.userService.findUserById(userId);
        const removingProduct = user.favoriteProducts.find(prod => prod.id === pid);
        if (!removingProduct)
            throw new BadRequestException('product with given id is not in favorite products!');
        user.favoriteProducts = user.favoriteProducts.filter(prod => prod.id !== pid);
        await this.userService.save(user);
        return removingProduct;
    }
    async findProductByTitle(title: string){
        return this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.laptopProduct', 'laptop')
            .leftJoinAndSelect('product.mobileProduct', 'mobile')
            .leftJoinAndSelect('product.tabletProduct', 'tablet')
            .orWhere('laptop.title = :title', {title})
            .orWhere('mobile.title = :title', {title})
            .orWhere('tablet.title = :title', {title})
            .getOne();
    }
    async checkProductTitle(title: string){
        const product = await this.findProductByTitle(title);
        if (product)
            throw new BadRequestException('product with given title already exists');
    }
    async checkIfUserIsAdmin(userId: number){
        const user = await this.userService.findUserById(userId);
        if (user.userType !== UserType.ADMIN)
            throw new UnauthorizedException('only ADMINS can add products');
    }
    async addLaptopProductByAdmin(dto: AddLaptopProductByAdminRequestDto, userId: number) {
        const {title, brand, cpu, ram, memory, screen} = dto;
        await this.checkIfUserIsAdmin(userId);
        await this.checkProductTitle(title);

        let laptop = new LaptopProduct();
        laptop.cpu = cpu;
        laptop.ram = ram;
        laptop.brand = brand;
        laptop.memory = memory;
        laptop.screen = screen;
        laptop.title = title;
        laptop = await this.laptopRepository.save(laptop);

        const product = new Product();
        product.productCategory = ProductCategory.LAPTOP;
        product.laptopProduct = laptop;
        await this.productRepository.save(product);

        return laptop;
    }
    async addMobileProductByAdmin(dto: AddMobileTabletProductByAdminRequestDto, userId: number) {
        const {title, brand, cpu, ram, memory, screen} = dto;
        await this.checkIfUserIsAdmin(userId);
        await this.checkProductTitle(title);

        let mobile = new MobileProduct();
        mobile.cpu = cpu;
        mobile.ram = ram;
        mobile.brand = brand;
        mobile.memory = memory;
        mobile.screen = screen;
        mobile.title = title;
        mobile = await this.mobileRepository.save(mobile);

        const product = new Product();
        product.productCategory = ProductCategory.MOBILE;
        product.mobileProduct = mobile;
        await this.productRepository.save(product);

        return mobile;
    }
    async addTabletProductByAdmin(dto: AddMobileTabletProductByAdminRequestDto, userId: number) {
        const {title, brand, cpu, ram, memory, screen} = dto;
        await this.checkIfUserIsAdmin(userId);
        await this.checkProductTitle(title);

        let tablet = new TabletProduct();
        tablet.cpu = cpu;
        tablet.ram = ram;
        tablet.brand = brand;
        tablet.memory = memory;
        tablet.screen = screen;
        tablet.title = title;
        tablet = await this.tabletRepository.save(tablet);

        const product = new Product();
        product.productCategory = ProductCategory.TABLET;
        product.tabletProduct = tablet;
        await this.productRepository.save(product);

        return tablet;
    }
}