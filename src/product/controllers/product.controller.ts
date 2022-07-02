import {BusinessController} from "../../common/decorators/bussines-controller.decorator";
import {Auth} from "../../common/decorators/auth-guard.decorator";
import {Body, Delete, Get, Param, ParseIntPipe, Post, Query} from "@nestjs/common";
import {GetUserId} from "../../common/decorators/get-user.id";
import {ProductResponseDto} from "../dtos/responses/ProductResponse.dto";
import {ProductService} from "../services/product.service";
import {GetFilteredProductsRequestDto} from "../dtos/requests/GetFilteredProductsRequest.dto";
import {ApiOperation} from "@nestjs/swagger";
import {AddLaptopProductByAdminRequestDto} from "../dtos/requests/AddLaptopProductByAdminRequest.dto";
import {AddMobileTabletProductByAdminRequestDto} from "../dtos/requests/AddMobileTabletProductByAdminRequest.dto";
import {LaptopProductResponseDto} from "../dtos/responses/LaptopProductResponse.dto";
import {MobileTabletResponseDto} from "../dtos/responses/MobileTabletResponse.dto";

@BusinessController('product', 'product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {
    }

    @Get('get-filtered-products')
    async getFilteredProducts(@Body() filterDto: GetFilteredProductsRequestDto) {
        const products = await this.productService.getFilteredProducts(filterDto);
        return products.map(prod => new ProductResponseDto(prod));
    }

    @ApiOperation({summary: 'returns products whose titles match the given Query (provide "search" query parameter)'})
    @Get('get-products-by-search')
    async getProductsBySearchClause(@Query() search: string) {
        const products = await this.productService.searchAndGetProducts(search);
        return products.map(prod => new ProductResponseDto(prod));
    }

    @Auth()
    @Post('add-product-to-favorites/:id')
    async addToFavorites(@Param('id', ParseIntPipe) productId: number, @GetUserId() userId: number) {
        const product = await this.productService.addProductToFavorites(productId, userId);
        return new ProductResponseDto(product);
    }

    @Auth()
    @Delete('delete-favorite/:id')
    async deleteFromFavorites(@Param('id', ParseIntPipe) productId: number, @GetUserId() userId: number) {
        const product = await this.productService.deleteProductFromFavorites(productId, userId);
        return new ProductResponseDto(product);
    }

    @Auth()
    @Get('get-favorite-products')
    async getFavoriteProducts(@GetUserId() userId: number) {
        const products = await this.productService.getFavoriteProducts(userId);
        return products.map(prod => new ProductResponseDto(prod));
    }

    @Get('get-detailed-product/:id')
    async getDetailedProduct(@Param('id', ParseIntPipe) pid: number) {
        const product = await this.productService.getProductDetails(pid);
        return new ProductResponseDto(product);
    }


    @Auth()
    @Post('admin-add-laptop')
    async addLaptopByAdmin(@Body() dto: AddLaptopProductByAdminRequestDto, @GetUserId() userId: number){
        const laptop = await this.productService.addLaptopProductByAdmin(dto, userId);
        return new LaptopProductResponseDto(laptop);
    }

    @Auth()
    @Post('admin-add-mobile')
    async addMobileByAdmin(@Body() dto: AddMobileTabletProductByAdminRequestDto, @GetUserId() userId: number){
        const mobile = await this.productService.addMobileProductByAdmin(dto, userId);
        return new MobileTabletResponseDto(mobile);
    }

    @Auth()
    @Post('admin-add-tablet')
    async addTabletByAdmin(@Body() dto: AddMobileTabletProductByAdminRequestDto, @GetUserId() userId: number){
        const tablet = await this.productService.addTabletProductByAdmin(dto, userId);
        return new MobileTabletResponseDto(tablet);
    }



}