import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {BaseService} from "../../common/base/Base.service";
import {Store} from "../entities/store.entity";
import {UserService} from "../../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Product} from "../entities/product.entity";
import {GetFilteredProductsRequestDto} from "../dtos/requests/GetFilteredProductsRequest.dto";
import {SortingTypes} from "../enums/sorting-types.enum";

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
        super(productRepository);
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

}